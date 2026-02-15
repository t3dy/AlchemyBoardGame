import { BASIC_ACTIONS, HEALTH_STATES } from './data.js';

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
            reagents: document.getElementById('res-medicine'), // Mapping medicine UI to reagents
            victory: document.getElementById('res-victory')
        };
        this.workerList = document.getElementById('worker-list');
        this.actionBoard = document.getElementById('lab-board'); // Reusing ID for The Commons
        this.narratorTitle = document.getElementById('phase-title');
        this.narratorPrompt = document.getElementById('narrator-guidance');
        this.gameLog = document.getElementById('game-log');
    }

    renderAll() {
        this.renderResources();
        this.renderWorkers();
        this.renderCommons();
        this.updateNarrator();
    }

    renderResources() {
        this.resEls.gold.innerText = this.state.gold;
        this.resEls.ingredients.innerText = this.state.ingredients;
        this.resEls.metals.innerText = this.state.metals;
        this.resEls.potions.innerText = this.state.potions;
        this.resEls.reagents.innerText = this.state.reagents;
        this.resEls.victory.innerText = this.state.victoryPoints;
    }

    renderWorkers() {
        this.workerList.innerHTML = '';
        const workersAtHome = this.state.workers.length - this.state.occupiedActions.size;

        for (let i = 0; i < this.state.workers.length; i++) {
            const div = document.createElement('div');
            div.className = 'worker-item';
            div.innerHTML = `<span style="font-size: 1.5rem">👨‍🔬</span> <div>Alchemist ${i + 1}</div>`;
            if (i >= this.state.workers.length - workersAtHome) {
                div.style.border = '2px solid var(--gold)';
            } else {
                div.style.opacity = '0.5';
                div.innerHTML += ' <small>(At Work)</small>';
            }
            this.workerList.appendChild(div);
        }
    }

    renderCommons() {
        this.actionBoard.innerHTML = '';

        // Basic Actions
        BASIC_ACTIONS.forEach(action => this.createActionCard(action));

        // Revealed Round Cards
        this.state.revealedCards.forEach(action => this.createActionCard(action));
    }

    createActionCard(action) {
        const div = document.createElement('div');
        const isOccupied = this.state.occupiedActions.has(action.id);
        div.className = `action-card ${isOccupied ? 'occupied' : ''}`;
        div.innerHTML = `
            <div class="card-header">${action.emoji} ${action.name}</div>
            <div class="card-body">${action.description}</div>
        `;
        if (!isOccupied) div.onclick = () => window.gameEngine.selectAction(action.id);
        this.actionBoard.appendChild(div);
    }

    updateNarrator() {
        const maintenance = this.state.getMaintenanceCost();
        this.narratorTitle.innerText = `ROUND ${this.state.round}: ${this.state.phase.toUpperCase()}`;

        if (this.state.phase === 'work') {
            this.narratorPrompt.innerText = `Work Phase: Place your alchemists on action cards. Next Harvest in Round ${this.getNextHarvest()}. Total Reagents needed: ${maintenance}.`;
        } else if (this.state.phase === 'harvest') {
            this.narratorPrompt.innerText = "Harvest Phase: Feeding Alchemists and gathering field yields.";
        }
    }

    getNextHarvest() {
        const harvestRounds = [4, 7, 9, 11, 13, 14];
        return harvestRounds.find(r => r >= this.state.round) || 14;
    }

    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `[R${this.state.round}] ${message}`;
        this.gameLog.prepend(entry);
    }

    showOverlay(title, msg) {
        const overlay = document.getElementById('overlay');
        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-message').innerText = msg;
        overlay.classList.remove('hidden');
    }
}
