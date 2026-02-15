import { GameState } from './state.js';
import { UI } from './ui.js';
import { FURNITURE, HEALTH_STATES, DISASTERS, ROLES } from './data.js';

class Engine {
    constructor() {
        this.state = new GameState();
        this.ui = new UI(this.state);
        this.initEventListeners();
        this.setupNewRound();
        this.ui.renderAll();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    initEventListeners() {
        document.getElementById('next-phase-btn').onclick = () => this.nextPhase();
        document.getElementById('prevent-btn').onclick = () => this.handleDisasterChoice(true);
        document.getElementById('suffer-btn').onclick = () => this.handleDisasterChoice(false);
    }

    setupNewRound() {
        this.state.phase = 'role';
        this.ui.log(`--- Round ${this.state.round} ---`);
        this.renderRoleSelection();
    }

    renderRoleSelection() {
        const container = document.getElementById('role-options');
        const section = document.getElementById('role-selection');
        section.classList.remove('hidden');
        container.innerHTML = '';

        Object.entries(ROLES).forEach(([id, role]) => {
            const div = document.createElement('div');
            div.className = 'role-card';
            div.innerHTML = `<strong>${role.icon} ${role.name}</strong><br><small>${role.benefit}</small>`;
            div.onclick = () => this.selectRole(id);
            container.appendChild(div);
        });
    }

    selectRole(roleId) {
        this.state.role = roleId;
        this.ui.log(`Selected Role: ${ROLES[roleId].name}`);
        document.getElementById('role-selection').classList.add('hidden');
        this.nextPhase();
    }

    selectWorker(index) {
        if (this.state.phase !== 'action') {
            if (this.state.phase === 'recovery') this.handleHealing(index);
            return;
        }

        const worker = this.state.workers[index];
        const health = HEALTH_STATES[worker.state];
        const isAssigned = this.state.furniture.some(f => f.occupant === index);

        if (!health.canWork) {
            alert(`${worker.name} is too injured to work!`);
            return;
        }
        if (isAssigned) {
            alert(`${worker.name} is already at a workstation.`);
            return;
        }

        this.state.selectedWorkerIdx = index;
        this.ui.log(`Placing ${worker.name}. Select a workstation.`);
        this.ui.renderAll();
    }

    assignWorkerToSlot(slotIdx) {
        if (this.state.phase !== 'action' || this.state.selectedWorkerIdx === null) return;

        const slot = this.state.furniture[slotIdx];
        if (slot.occupant !== null) {
            alert("This workstation is already occupied.");
            return;
        }

        slot.occupant = this.state.selectedWorkerIdx;
        this.ui.log(`${this.state.workers[this.state.selectedWorkerIdx].name} assigned to ${FURNITURE[slot.typeId].name}.`);
        this.state.selectedWorkerIdx = null;
        this.ui.renderAll();
    }

    nextPhase() {
        const order = ['role', 'action', 'production', 'hazard_minor', 'hazard_major', 'recovery', 'upgrade', 'scoring'];
        let curr = order.indexOf(this.state.phase);

        // Prevent accidental advancement during specific phases
        if (this.state.phase === 'role' && !this.state.role) return;

        this.state.phase = order[(curr + 1) % order.length];

        if (this.state.phase === 'role') {
            if (this.state.round >= this.state.maxRounds) {
                this.resolveVictory();
                return;
            }
            this.state.round++;
            this.state.resetOccupants();
            this.state.role = null;
            this.ui.hideDisaster();
            this.setupNewRound();
        }

        this.processPhase();
        this.ui.renderAll();
    }

    processPhase() {
        switch (this.state.phase) {
            case 'production':
                this.resolveProduction();
                break;
            case 'hazard_minor':
                this.drawHazard('minor');
                break;
            case 'hazard_major':
                if (this.state.round % 3 === 0) {
                    this.drawHazard('major');
                } else {
                    this.ui.log("Safety Check: No major accidents this round.");
                    this.nextPhase();
                }
                break;
            case 'upgrade':
                document.getElementById('upgrade-panel').classList.remove('hidden');
                break;
            case 'scoring':
                document.getElementById('upgrade-panel').classList.add('hidden');
                this.resolveScoring();
                break;
        }
    }

    resolveProduction() {
        let safetyCount = this.state.furniture.filter(f => FURNITURE[f.typeId].category === 'safety').length;
        let bonus = safetyCount >= 3 ? 1 : 0; // Well-Regulated Lab bonus
        if (bonus) this.ui.log("WELL-REGULATED LAB: +1 productivity bonus applied.");

        this.state.furniture.forEach(f => {
            if (f.occupant === null) return;
            const worker = this.state.workers[f.occupant];
            const hStatus = HEALTH_STATES[worker.state];
            this.resolveActionEffect(f.typeId, hStatus.bonus + bonus);
        });
    }

    resolveActionEffect(typeId, bonus) {
        let msg = "";
        const role = this.state.role;

        switch (typeId) {
            case 'workbench':
                const ing = Math.max(0, 2 + bonus + (role === 'industrialist' ? 1 : 0));
                this.state.ingredients += ing;
                msg = `Produced ${ing} Ingredients.`;
                break;
            case 'alembic':
                if (this.state.gold >= 1) {
                    this.state.gold -= 1; this.state.metals += 1;
                    msg = "Refined 1 Metal.";
                }
                break;
            case 'crucible':
                if (this.state.ingredients >= 2 && this.state.metals >= 1) {
                    this.state.ingredients -= 2; this.state.metals -= 1;
                    const pot = 1 + (role === 'brewer' ? 1 : 0);
                    this.state.potions += pot;
                    msg = `Crafted ${pot} Potions.`;
                } else if (this.state.ingredients >= 1 && this.state.gold >= 1) {
                    this.state.ingredients -= 1; this.state.gold -= 1;
                    this.state.medicine += 1;
                    msg = "Crafted 1 Medicine.";
                }
                break;
            case 'research':
                const vp = 1 + (role === 'scholar' ? 1 : 0);
                this.state.victoryPoints += vp;
                msg = `Gained ${vp} Victory Points.`;
                break;
        }
        if (msg) this.ui.log(`${FURNITURE[typeId].name}: ${msg}`);
    }

    drawHazard(tier) {
        const deck = DISASTERS[tier];
        const card = deck[Math.floor(Math.random() * deck.length)];

        // Planning mitigation?
        if (this.state.role === 'planner' && tier === 'major') {
            this.ui.log("PLANNER ABILITY: Downgrading Major hazard to Minor.");
            this.drawHazard('minor');
            return;
        }

        this.state.activeDisaster = card;
        this.ui.showDisaster(card);
    }

    handleDisasterChoice(prevent) {
        const d = this.state.activeDisaster;
        if (prevent) {
            if (this.canAfford(d.cost)) {
                this.deductCost(d.cost);
                this.ui.log(`MITIGATED: ${d.title}.`);
                this.nextPhase();
            } else { alert("Cannot afford mitigation!"); }
        } else {
            this.applyDisaster(d);
            this.nextPhase();
        }
    }

    canAfford(cost) {
        if (!cost) return true;
        if (cost.gold && this.state.gold < cost.gold) return false;
        if (cost.ingredient && this.state.ingredients < cost.ingredient) return false;
        if (cost.metal && this.state.metals < cost.metal) return false;
        if (cost.medicine && this.state.medicine < cost.medicine) return false;
        return true;
    }

    deductCost(cost) {
        if (!cost) return;
        if (cost.gold) this.state.gold -= cost.gold;
        if (cost.ingredient) this.state.ingredients -= cost.ingredient;
        if (cost.metal) this.state.metals -= cost.metal;
        if (cost.medicine) this.state.medicine -= cost.medicine;
    }

    applyDisaster(d) {
        this.ui.log(`SUFFERED: ${d.title}. consequence: ${d.effect}`);
        if (d.impact.type === 'injury') {
            const w = this.state.workers[Math.floor(Math.random() * this.state.workers.length)];
            w.state = d.impact.to;
            if (w.state === 'black') this.checkWorkerDeath(w);
        }
        if (d.impact.type === 'stat' && d.impact.target === 'all') {
            this.state.workers.forEach(w => w.state = d.impact.to);
        }
    }

    checkWorkerDeath(worker) {
        // In Upkeep/Scoring we check for Critical states. 
        // If a worker stays Critical through Upkeep, they are replaced by an Apprentice.
    }

    handleHealing(index) {
        const worker = this.state.workers[index];
        const states = ['black', 'red', 'yellow', 'green'];
        let currIdx = states.indexOf(worker.state);
        if (currIdx === states.length - 1) return;

        if (this.state.medicine >= 1) {
            this.state.medicine--;
            worker.state = states[currIdx + 1];
            this.ui.log(`HEALED: ${worker.name} is now ${worker.state.toUpperCase()}.`);
        } else if (this.state.potions >= 1) {
            this.state.potions--;
            worker.state = states[currIdx + 1];
            this.ui.log(`RECOVERED: ${worker.name} used Potion. Now ${worker.state.toUpperCase()}.`);
        } else { alert("Need Medicine/Potions!"); }
        this.ui.renderAll();
    }

    buyUpgrade(typeId) {
        const data = FURNITURE[typeId];
        if (this.state.gold >= 3) {
            this.state.gold -= 3;
            this.state.furniture.push({ slot: this.state.furniture.length, typeId: typeId, occupant: null });
            this.ui.log(`EXPANSION: ${data.name} built.`);
            this.ui.renderAll();
        } else { alert("Insufficient Gold!"); }
    }

    resolveScoring() {
        // Critical Worker Death Check
        this.state.workers.forEach((w, idx) => {
            if (w.state === 'black') {
                this.ui.log(`TRAGEDY: ${w.name} has passed away.`);
                this.state.addTrauma();
                this.state.workers[idx] = { id: `apr${Date.now()}`, name: `Apprentice ${idx + 1}`, state: 'trauma', isApprentice: true };
            }
        });

        if (this.state.round === 10) {
            this.ui.log("GRAND EXPERIMENT: Final scoring calculation...");
        }
    }

    resolveVictory() {
        const score = this.state.victoryPoints + (this.state.potions * 2);
        this.ui.showOverlay("End of Round 10", `Final Laboratory Value: ${score} VP. ${this.state.traumaTokens} casualties recorded.`);
    }
}

window.gameEngine = new Engine();
