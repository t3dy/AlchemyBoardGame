import { GameState } from './state.js';
import { UI } from './ui.js';
import { FURNITURE, HEALTH_STATES, DISASTERS } from './data.js';

class Engine {
    constructor() {
        this.state = new GameState();
        this.ui = new UI(this.state);
        this.disasterDeck = [...DISASTERS];
        this.init();
    }
    init() {
        document.getElementById('next-phase-btn').onclick = () => this.nextPhase();
        document.getElementById('prevent-btn').onclick = () => this.handleDisaster(true);
        document.getElementById('suffer-btn').onclick = () => this.handleDisaster(false);
        this.ui.renderAll();
    }
    selectWorker(idx) {
        if (this.state.phase === 'action') this.state.selectedWorkerIdx = idx;
        else if (this.state.phase === 'healing') this.handleHealing(idx);
        this.ui.renderAll();
    }
    assignWorkerToSlot(slotIdx) {
        if (this.state.phase !== 'action' || this.state.selectedWorkerIdx === null) return;
        const slot = this.state.furniture[slotIdx];
        if (slot.occupant === null) {
            slot.occupant = this.state.selectedWorkerIdx;
            this.state.selectedWorkerIdx = null;
            this.ui.renderAll();
        }
    }
    nextPhase() {
        const order = ['action', 'production', 'disaster', 'healing', 'upkeep'];
        let curr = order.indexOf(this.state.phase);
        this.state.phase = order[(curr + 1) % order.length];
        if (this.state.phase === 'action') {
            this.state.round++;
            this.state.resetOccupants();
        }
        this.ui.renderAll();
    }
    handleDisaster(prevent) { this.nextPhase(); }
    handleHealing(idx) {
        const w = this.state.workers[idx];
        if (this.state.medicine > 0 && w.state !== 'green') {
            this.state.medicine--;
            w.state = 'green';
            this.ui.renderAll();
        }
    }
}
window.gameEngine = new Engine();
