import { getFurnitureData, getHealthData, getRoleData } from './data.js';

export class UI {
    constructor(state) {
        this.state = state;
        this.initElements();
    }

    initElements() {
        this.resEls = {
            gold: document.getElementById('res-gold'),
            ingredients: document.getElementById('res-ingredients'),
            metals: document.getElementById('res-metals'),
            potions: document.getElementById('res-potions'),
            medicine: document.getElementById('res-medicine'),
            victory: document.getElementById('res-victory')
        };
        this.workerList = document.getElementById('worker-list');
        this.labBoard = document.getElementById('lab-board');
        this.narratorTitle = document.getElementById('phase-title');
        this.narratorPrompt = document.getElementById('narrator-guidance');
        this.gameLog = document.getElementById('game-log');
        this.disasterCard = document.getElementById('disaster-card');
        this.preventionPanel = document.getElementById('prevention-panel');
        this.nextBtn = document.getElementById('next-phase-btn');
    }

    renderAll() {
        this.renderResources();
        this.renderWorkers();
        this.renderBoard();
        this.updateNarrator();
    }

    renderResources() {
        this.resEls.gold.innerText = this.state.gold;
        this.resEls.ingredients.innerText = this.state.ingredients;
        this.resEls.metals.innerText = this.state.metals;
        this.resEls.potions.innerText = this.state.potions;
        this.resEls.medicine.innerText = this.state.medicine;
        this.resEls.victory.innerText = this.state.victoryPoints;
    }

    renderWorkers() {
        this.workerList.innerHTML = '';
        this.state.workers.forEach((w, idx) => {
            const h = getHealthData(w.state);
            const div = document.createElement('div');
            div.className = `worker-item ${this.state.selectedWorkerIdx === idx ? 'selected' : ''}`;
            div.innerHTML = `
                <span style="font-size: 1.5rem">${h.emoji}</span>
                <div>
                    <strong>${w.name} ${w.isApprentice ? '(Apprentice)' : ''}</strong><br>
                    <small class="status-${w.state}">${h.name}</small>
                </div>
            `;
            div.onclick = () => window.gameEngine.selectWorker(idx);
            this.workerList.appendChild(div);
        });
    }

    renderBoard() {
        this.labBoard.innerHTML = '';
        this.state.furniture.forEach(f => {
            const data = getFurnitureData(f.typeId);
            const div = document.createElement('div');
            div.className = `action-space ${data.type} ${f.occupant !== null ? 'occupied' : ''}`;
            div.innerHTML = `
                <div class="action-emoji">${data.emoji}</div>
                <div class="action-name">${data.name}</div>
                <div class="action-desc">${data.description}</div>
            `;
            if (f.occupant !== null) {
                const w = this.state.workers[f.occupant];
                const h = getHealthData(w.state);
                const meeple = document.createElement('div');
                meeple.className = 'occupant-meeple';
                meeple.innerText = h.emoji;
                div.appendChild(meeple);
            }
            div.onclick = () => window.gameEngine.assignWorkerToSlot(f.slot);
            this.labBoard.appendChild(div);
        });
    }

    updateNarrator() {
        const phasePrompts = {
            'role': "Choose your primary responsibility for this round. Role drafting determines your bonuses.",
            'action': "Place your alchemists at workstations. Sickened workers are less productive.",
            'production': "Resolving laboratory actions. Check the logs for yields.",
            'hazard_minor': "Checking for environmental instability...",
            'hazard_major': "A major accident is looming! Prepare your defenses.",
            'recovery': "HEALING: Spend Medicine/Potions on workers in the sidebar.",
            'upgrade': "Invest your gold in safety infrastructure or wait to score.",
            'scoring': "Calculating round efficiency. Critical workers are at risk of expiration."
        };

        const roleText = this.state.role ? ` [${getRoleData(this.state.role).name}]` : '';
        this.narratorTitle.innerText = `R${this.state.round}: ${this.state.phase.toUpperCase()}${roleText}`;
        this.narratorPrompt.innerText = phasePrompts[this.state.phase] || "Next step...";

        // Highlight Major Hazard countdown
        if (this.state.phase === 'action') {
            const countdown = 3 - (this.state.round % 3);
            if (countdown === 3) {
                this.narratorPrompt.innerText += " WARNING: Major Hazard occurs THIS round.";
            } else {
                this.narratorPrompt.innerText += ` (Major Hazard in ${countdown} rounds)`;
            }
        }
    }

    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `[R${this.state.round}] ${message}`;
        this.gameLog.prepend(entry);
    }

    showDisaster(disaster) {
        this.disasterCard.className = 'card-revealed';
        this.disasterCard.innerHTML = `
            <strong>${disaster.title}</strong>
            <p style="font-size: 0.8rem; margin: 5px 0;">IMPACT: ${disaster.effect}</p>
        `;

        const costStr = disaster.cost ? Object.entries(disaster.cost).map(([k, v]) => `${v} ${k}`).join(", ") : null;
        if (costStr) {
            this.preventionPanel.classList.remove('hidden');
            this.narratorPrompt.innerText = `MITIGATION: Spend ${costStr} to prevent this?`;
        } else {
            this.preventionPanel.classList.add('hidden');
        }
    }

    hideDisaster() {
        this.disasterCard.className = 'card-back';
        this.disasterCard.innerHTML = '<h3>⚠️</h3>';
        this.preventionPanel.classList.add('hidden');
    }

    showOverlay(title, msg) {
        const overlay = document.getElementById('overlay');
        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-message').innerText = msg;
        overlay.classList.remove('hidden');
    }
}
