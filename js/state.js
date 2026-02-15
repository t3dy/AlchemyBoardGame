export class GameState {
    constructor() {
        this.gold = 5;
        this.ingredients = 3;
        this.metals = 1;
        this.medicine = 1;
        this.potions = 0;
        this.victoryPoints = 0;

        this.role = null; // selected in Phase 1

        this.workers = [
            { id: 'alc1', name: 'Alchemist A', state: 'green', isApprentice: false },
            { id: 'alc2', name: 'Alchemist B', state: 'green', isApprentice: false }
        ];

        this.furniture = [
            { slot: 0, typeId: 'crucible', occupant: null },
            { slot: 1, typeId: 'alembic', occupant: null },
            { slot: 2, typeId: 'workbench', occupant: null },
            { slot: 3, typeId: 'research', occupant: null }
            // Safety tiles added via expansion actions later
        ];

        this.round = 1;
        this.maxRounds = 10;
        this.phase = 'role'; // role, action, production, hazard_minor, hazard_major, recovery, upgrade, scoring

        this.activeDisaster = null;
        this.selectedWorkerIdx = null;
        this.traumaTokens = 0;
    }

    resetOccupants() {
        this.furniture.forEach(f => f.occupant = null);
        this.selectedWorkerIdx = null;
    }

    addTrauma() {
        this.traumaTokens++;
        this.victoryPoints = Math.max(0, this.victoryPoints - 2);
    }
}
