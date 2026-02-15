import { getFurnitureData, getHealthData } from './data.js';

export class UI {
    constructor(state) {
        this.state = state;
        this.init();
    }

    init() {
        this.resEls = { gold: document.getElementById('res-gold'), ingredients: document.getElementById('res-ingredients'), metals: document.getElementById('res-metals'), potions: document.getElementById('res-potions'), medicine: document.getElementById('res-medicine'), victory: document.getElementById('res-victory') };
        this.workerList = document.getElementById('worker-list');
        this.labBoard = document.getElementById('lab-board');
        this.narratorTitle = document.getElementById('phase-title');
        this.narratorPrompt = document.getElementById('narrator-guidance');
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
            div.innerHTML = `<span>${h.emoji}</span> <strong>${w.name}</strong> (${h.name})`;
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
            div.innerHTML = `<div class="action-emoji">${data.emoji}</div><div class="action-name">${data.name}</div>`;
            if (f.occupant !== null) {
                const meeple = document.createElement('div');
                meeple.className = 'occupant-meeple';
                meeple.innerText = getHealthData(this.state.workers[f.occupant].state).emoji;
                div.appendChild(meeple);
            }
            div.onclick = () => window.gameEngine.assignWorkerToSlot(f.slot);
            this.labBoard.appendChild(div);
        });
    }

    updateNarrator() {
        this.narratorTitle.innerText = `${this.state.phase.toUpperCase()} PHASE (Round ${this.state.round})`;
        this.narratorPrompt.innerText = "Follow the round structure.";
    }

    showOverlay(title, msg) {
        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-message').innerText = msg;
        document.getElementById('overlay').classList.remove('hidden');
    }
}
