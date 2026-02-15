import { GameState } from './state.js';
import { UI } from './ui.js';
import { BASIC_ACTIONS, ROUND_CARDS, HARVEST_ROUNDS, HEALTH_STATES } from './data.js';

class Engine {
    constructor() {
        this.state = new GameState();
        this.ui = new UI(this.state);
        this.init();
        this.startRound();
    }

    init() {
        document.getElementById('next-phase-btn').onclick = () => this.advancePhase();
        this.ui.renderAll();
    }

    startRound() {
        this.state.phase = 'preparation';
        this.state.occupiedActions.clear();

        // Reveal new action card
        const newCard = ROUND_CARDS.find(c => c.round === this.state.round);
        if (newCard) this.state.revealedCards.push(newCard);

        this.ui.log(`--- Round ${this.state.round} Begins ---`);
        this.state.phase = 'work';
        this.ui.renderAll();
    }

    selectAction(actionId) {
        if (this.state.phase !== 'work') return;
        if (this.state.occupiedActions.has(actionId)) {
            alert("This action is already taken this round!");
            return;
        }

        const availableWorkers = this.state.workers.filter((w, idx) => !this.isWorkerPlaced(idx));
        if (availableWorkers.length === 0) {
            alert("All alchemists are currently busy.");
            return;
        }

        // Place the first available worker
        const workerIdx = this.state.workers.findIndex((w, idx) => !this.isWorkerPlaced(idx));
        this.performAction(actionId, workerIdx);
    }

    isWorkerPlaced(idx) {
        // Simple internal check: since actions are immediate in v5, we just track occupied slots
        // and decrement available actions. Real Agricola tracks which worker went where.
        return false; // placeholder for simpler logic below
    }

    performAction(actionId, workerIdx) {
        const action = [...BASIC_ACTIONS, ...this.state.revealedCards].find(a => a.id === actionId);
        if (!action) return;

        this.state.occupiedActions.add(actionId);
        this.executeImmediateEffect(actionId);

        this.ui.log(`Action: ${action.name} performed.`);

        // Check if round over
        if (this.state.occupiedActions.size >= this.state.workers.length) {
            this.ui.log("Work Phase Complete. Returning home...");
        }

        this.ui.renderAll();
    }

    executeImmediateEffect(id) {
        switch (id) {
            case 'gather_ash': this.state.ingredients += 1; break;
            case 'gather_gold': this.state.gold += 1; break;
            case 'reagent_mix': this.state.reagents += 1; break;
            case 'extra_workbench': this.state.ingredients += 3; break;
            case 'expansion': this.state.rooms += 1; break;
            case 'hiring': this.state.addWorker(); break;
            case 'stable_distill': this.state.potions += 2; break;
            case 'industrial_alembic': this.state.metals += 2; break;
        }
    }

    advancePhase() {
        if (this.state.phase === 'work') {
            if (HARVEST_ROUNDS.includes(this.state.round)) {
                this.startHarvest();
            } else {
                this.endRound();
            }
        } else if (this.state.phase === 'harvest') {
            this.endRound();
        }
    }

    startHarvest() {
        this.state.phase = 'harvest';
        this.ui.log("AUTUMN AUDIT: Time to maintain the laboratory.");

        const cost = this.state.getMaintenanceCost();
        if (this.state.reagents >= cost) {
            this.state.reagents -= cost;
            this.ui.log(`Paid ${cost} Reagents to maintain ${this.state.workers.length} Alchemists.`);
        } else {
            const shortage = cost - this.state.reagents;
            this.state.reagents = 0;
            this.state.beggingCards += shortage;
            this.state.victoryPoints -= (shortage * 3);
            this.ui.log(`CRITICAL SHORTAGE: Took ${shortage} Begging penalties.`);
        }
        this.ui.renderAll();
    }

    endRound() {
        if (this.state.round >= this.state.maxRounds) {
            this.resolveVictory();
            return;
        }
        this.state.round++;
        this.startRound();
    }

    resolveVictory() {
        const score = this.state.victoryPoints + (this.state.potions * 2) + (this.state.rooms);
        this.ui.showOverlay("End of Round 14", `Final Score: ${score} VP. Begging penalties: ${this.state.beggingCards}`);
    }
}

window.gameEngine = new Engine();
