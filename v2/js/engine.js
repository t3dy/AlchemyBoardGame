import { GameState } from './state.js';
import { UI } from './ui.js';
import { getTileData } from './data.js';

class Engine {
    constructor() {
        this.state = new GameState();
        this.ui = new UI(this.state);
        this.init();
    }

    init() {
        document.getElementById('resolve-btn').onclick = () => this.resolveRound();
        this.ui.renderAll();
    }

    selectWorker(idx) {
        if (this.state.phase !== 'placement') return;
        this.state.selectedWorker = idx;
        this.ui.renderWorkers();
    }

    assignWorker(gridIdx) {
        if (this.state.phase !== 'placement' || this.state.selectedWorker === null) return;
        if (!this.state.grid[gridIdx]) return;

        // Remove from other slots
        for (let key in this.state.assignments) {
            if (this.state.assignments[key] === this.state.selectedWorker) delete this.state.assignments[key];
        }

        this.state.assignments[gridIdx] = this.state.selectedWorker;
        this.state.selectedWorker = null;
        this.ui.renderAll();
    }

    purchaseTile(id) {
        const data = getTileData(id);
        if (this.state.gold >= data.cost) {
            const emptyIdx = this.state.grid.findIndex(s => s === null);
            if (emptyIdx !== -1) {
                this.state.gold -= data.cost;
                this.state.grid[emptyIdx] = data;
                this.ui.renderAll();
            }
        }
    }

    resolveRound() {
        this.state.phase = 'resolution';
        let prod = 0;

        for (let gridIdx in this.state.assignments) {
            const tile = this.state.grid[gridIdx];
            prod += tile.baseProd;

            if (tile.id === 'furnace') this.state.inventory.ash++;
            if (tile.id === 'crucible') this.state.inventory.herbs++;

            if (Math.random() < tile.hazardRisk) {
                this.triggerDisaster();
            }
        }

        this.state.productivity = prod;
        this.state.reputation += Math.floor(prod / 2);
        this.state.gold += prod;

        this.state.round++;
        this.state.phase = 'placement';
        this.state.clearAssignments();

        this.checkWinLoss();
        this.ui.renderAll();
    }

    triggerDisaster() {
        this.state.stability -= 1;
        this.state.suspicion += 1;
    }

    checkWinLoss() {
        if (this.state.reputation >= 10) this.ui.showOverlay("Victory", "Your name is known across the land.");
        if (this.state.stability <= 0) this.ui.showOverlay("Defeat", "Your lab has collapsed.");
    }
}

window.gameEngine = new Engine();
