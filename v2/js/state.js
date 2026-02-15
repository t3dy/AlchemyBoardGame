export class GameState {
    constructor() {
        this.gold = 5;
        this.productivity = 0;
        this.stability = 10;
        this.suspicion = 0;
        this.reputation = 0;

        this.inventory = { ash: 0, herbs: 0 };
        this.workers = [
            { id: 0, name: "Master", type: "master", state: "white" },
            { id: 1, name: "Appren 1", type: "apprentice", state: "white" },
            { id: 2, name: "Appren 2", type: "apprentice", state: "white" }
        ];

        this.grid = new Array(9).fill(null);
        this.assignments = {}; // { gridIdx: workerIdx }
        this.selectedWorker = null;

        this.round = 1;
        this.phase = 'placement';
    }

    clearAssignments() {
        this.assignments = {};
        this.selectedWorker = null;
    }
}
