import { ROLES, PRODUCTS, WORKSHOPS, COMMISSIONS } from './data.js';

export class UI {
    constructor(state) {
        this.state = state;
        this.initElements();
    }

    initElements() {
        this.resEls = {
            gold: document.getElementById('res-gold'),
            vp: document.getElementById('res-victory'),
            rivalVp: document.getElementById('rival-vp-display') // New for v6
        };
        this.invContainer = document.getElementById('inventory-list');
        this.roleBoard = document.getElementById('lab-board');
        this.atelierBoard = document.getElementById('atelier-board') || this.createAtelierBoard();
        this.narratorTitle = document.getElementById('phase-title');
        this.narratorPrompt = document.getElementById('narrator-guidance');
        this.gameLog = document.getElementById('game-log');
    }

    createAtelierBoard() {
        const board = document.createElement('div');
        board.id = 'atelier-board';
        document.getElementById('board-area').appendChild(board);
        return board;
    }

    renderAll() {
        this.renderResources();
        this.renderInventory();
        this.renderRoles();
        this.renderAteliers();
        this.updateNarrator();
    }

    renderResources() {
        this.resEls.gold.innerText = this.state.gold;
        this.resEls.vp.innerText = this.state.victoryPoints;
    }

    renderInventory() {
        this.invContainer.innerHTML = '';
        Object.entries(this.state.inventory).forEach(([id, amt]) => {
            if (amt <= 0 && PRODUCTS[id].type === 'fine') return;
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.innerHTML = `<span>${PRODUCTS[id].emoji}</span> ${PRODUCTS[id].name}: <strong>${amt}</strong>`;
            this.invContainer.appendChild(div);
        });
    }

    renderRoles() {
        this.roleBoard.innerHTML = '';
        this.state.availableRoles.forEach(roleId => {
            const role = ROLES[roleId];
            const div = document.createElement('div');
            div.className = 'role-card';
            div.innerHTML = `
                <div class="role-icon">${role.icon}</div>
                <div class="role-name">${role.name}</div>
                <small>${role.desc}</small>
            `;
            div.onclick = () => window.gameEngine.selectRole(roleId);
            this.roleBoard.appendChild(div);
        });
    }

    renderAteliers() {
        this.atelierBoard.innerHTML = '<h3>🏗️ Your Workshop Ateliers</h3>';
        const container = document.createElement('div');
        container.className = 'atelier-grid';

        this.state.workshops.forEach(wsId => {
            const data = WORKSHOPS[wsId];
            const div = document.createElement('div');
            div.className = 'atelier-tile';
            div.innerHTML = `<span>${data.emoji}</span><br><strong>${data.name}</strong>`;
            container.appendChild(div);
        });
        this.atelierBoard.appendChild(container);
    }

    showBuildPanel(privilege) {
        const panel = document.createElement('div');
        panel.id = 'build-overlay';
        panel.innerHTML = '<h3>Guild Master: Build Workshop</h3>';
        Object.values(WORKSHOPS).forEach(ws => {
            const btn = document.createElement('button');
            const cost = Math.max(0, ws.cost - (privilege ? 1 : 0));
            btn.innerHTML = `${ws.emoji} ${ws.name} (${cost} Gold)`;
            btn.onclick = () => {
                window.gameEngine.buyWorkshop(ws.id, privilege);
                panel.remove();
            };
            panel.appendChild(btn);
        });
        document.body.appendChild(panel);
    }

    updateNarrator() {
        this.narratorTitle.innerText = `R${this.state.round}: ${this.state.phase.toUpperCase()}`;
        if (this.state.phase === 'selection') {
            this.narratorPrompt.innerText = "Choose a guild role. Everyone follows, but you get the Privilege bonus.";
        } else {
            this.narratorPrompt.innerText = "Resolving the current specialized activity...";
        }
    }

    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = message;
        this.gameLog.prepend(entry);
    }

    showOverlay(title, msg) {
        const overlay = document.getElementById('overlay');
        document.getElementById('overlay-title').innerText = title;
        document.getElementById('overlay-message').innerText = msg;
        overlay.classList.remove('hidden');
    }
}
