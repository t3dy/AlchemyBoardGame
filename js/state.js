export class GameState {
    constructor() {
        this.gold = 5;
        this.victoryPoints = 0;

        // Detailed History-accurate Inventory
        this.inventory = {
            mercury: 2,
            sulfur: 2,
            lead: 1,
            antimony: 1,
            vermilion: 0,
            white_lead: 0,
            antimony_pill: 0,
            spirit_salt: 0
        };

        this.workshops = []; // List of workshop IDs owned

        this.rival = {
            gold: 5,
            vp: 0,
            inventory: { mercury: 1, sulfur: 1, vermilion: 0 },
            workshops: ['alembic']
        };

        this.round = 1;
        this.maxRounds = 12;
        this.phase = 'selection'; // selection, resolution

        this.availableRoles = ['guildmaster', 'alchemist', 'merchant', 'patron', 'prospector'];
        this.currentRole = null;
        this.activeCommissions = [0, 1]; // Indices from data.js COMMISSIONS
    }

    addWorkshop(id, isRival = false) {
        if (isRival) this.rival.workshops.push(id);
        else this.workshops.push(id);
    }
}
