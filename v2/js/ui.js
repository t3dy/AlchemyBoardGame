import { getTileData } from './data.js';

export class UI {
    constructor(state) {
        this.state = state;
        this.init();
    }

    init() {
        this.goldEl = document.getElementById('gold');
        this.prodEl = document.getElementById('productivity');
        this.repBar = document.getElementById('reputation-bar');
        this.suspBar = document.getElementById('suspicion-bar');
        this.meeplesEl = document.getElementById('meeples');
        this.gridEl = document.getElementById('lab-grid');
        this.shopEl = document.getElementById('tile-shop');
        this.invEl = document.getElementById('inventory-list');
    }

    renderAll() {
        this.renderStats();
        this.renderInventory();
        this.renderWorkers();
        this.renderGrid();
        this.renderMarketplace();
    }

    renderStats() {
        this.goldEl.innerText = this.state.gold;
        this.prodEl.innerText = this.state.productivity;
        document.getElementById('round-display').innerText = `Round ${this.state.round}`;
        document.getElementById('phase-display').innerText = `${this.state.phase.toUpperCase()} PHASE`;

        this.repBar.style.setProperty('--val', `${(this.state.reputation / 10) * 100}%`);
        this.suspBar.style.setProperty('--val', `${(this.state.suspicion / 10) * 100}%`);
    }

    renderInventory() {
        this.invEl.innerHTML = '';
        for (let key in this.state.inventory) {
            const div = document.createElement('div');
            div.innerText = `${key}: ${this.state.inventory[key]}`;
            this.invEl.appendChild(div);
        }
    }

    renderWorkers() {
        this.meeplesEl.innerHTML = '';
        this.state.workers.forEach((w, idx) => {
            const div = document.createElement('div');
            div.className = `meeple ${w.state}`;
            div.innerHTML = `<span>${w.type === 'master' ? '👑' : '👨‍🎓'}</span><small>${w.name}</small>`;
            if (this.state.selectedWorker === idx) div.style.border = '4px solid gold';
            div.onclick = () => window.gameEngine.selectWorker(idx);
            this.meeplesEl.appendChild(div);
        });
    }

    renderGrid() {
        this.gridEl.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div');
            div.className = 'tile';
            const data = this.state.grid[i];
            if (data) {
                div.classList.add('filled');
                div.innerHTML = `<span>${data.emoji}</span><small>${data.name}</small>`;

                const workerIdx = this.state.assignments[i];
                if (workerIdx !== undefined) {
                    const w = this.state.workers[workerIdx];
                    const wDiv = document.createElement('div');
                    wDiv.className = 'meeple-mini';
                    wDiv.innerText = w.type === 'master' ? '👑' : '👨‍🎓';
                    div.appendChild(wDiv);
                }
            }
            div.onclick = () => window.gameEngine.assignWorker(i);
            this.gridEl.appendChild(div);
        }
    }

    renderMarketplace() {
        this.shopEl.innerHTML = '';
        ['furnace', 'alembic', 'assay', 'crucible'].forEach(id => {
            const data = getTileData(id);
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `<span>${data.emoji}</span> <strong>${data.name}</strong> (${data.cost}G)`;
            div.onclick = () => window.gameEngine.purchaseTile(id);
            this.shopEl.appendChild(div);
        });
    }

    showOverlay(title, msg) {
        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-message').innerText = msg;
        document.getElementById('overlay').classList.remove('hidden');
    }
}
