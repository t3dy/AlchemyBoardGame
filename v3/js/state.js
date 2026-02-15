export class GameState {
    constructor() {
        this.gold = 3;
        this.ingredients = 2;
        this.metals = 1;
        this.medicine = 1;
        this.potions = 0;
        this.victoryPoints = 0;
        this.workers = [
            { id: 'alc1', name: 'Alchemist A', state: 'green' },
            { id: 'alc2', name: 'Alchemist B', state: 'green' }
        ];
        this.furniture = [
            { slot: 0, typeId: 'crucible', occupant: null },
            { slot: 1, typeId: 'alembic', occupant: null },
            { slot: 2, typeId: 'workbench', occupant: null },
            { slot: 3, typeId: 'research', occupant: null },
            { slot: 4, typeId: 'fume_hood', occupant: null }
        ];
        this.round = 1;
        this.phase = 'action';
    }
    resetOccupants() { this.furniture.forEach(f => f.occupant = null); }
}
