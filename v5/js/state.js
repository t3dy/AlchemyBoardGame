export class GameState {
    constructor() {
        this.gold = 2;
        this.ingredients = 2;
        this.metals = 0;
        this.reagents = 2; // Food equivalent
        this.potions = 0;
        this.victoryPoints = 0;

        this.rooms = 2;
        this.workers = [
            { id: 'alc1', name: 'Alchemist A', state: 'stable' },
            { id: 'alc2', name: 'Alchemist B', state: 'stable' }
        ];

        this.round = 1;
        this.maxRounds = 14;
        this.phase = 'preparation'; // preparation, work, harvest, upkeep

        // Progressive Actions
        this.revealedCards = [];
        this.occupiedActions = new Set();

        this.selectedWorkerIdx = null;
        this.beggingCards = 0;
    }

    getMaintenanceCost() {
        return this.workers.length * 2;
    }

    addWorker() {
        if (this.workers.length < this.rooms) {
            this.workers.push({ id: `alc${this.workers.length + 1}`, name: `Alchemist ${String.fromCharCode(65 + this.workers.length)}`, state: 'stable' });
            return true;
        }
        return false;
    }
}
