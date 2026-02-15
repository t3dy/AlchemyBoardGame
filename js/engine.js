import { GameState } from './state.js';
import { UI } from './ui.js';
import { ROLES, PRODUCTS, WORKSHOPS, COMMISSIONS } from './data.js';

class Engine {
    constructor() {
        this.state = new GameState();
        this.ui = new UI(this.state);
        this.init();
    }

    init() {
        this.ui.renderAll();
        this.ui.log("The 17th Century calls. Choose a Role to lead the guild.");
    }

    selectRole(roleId) {
        if (this.state.phase !== 'selection') return;

        this.state.currentRole = roleId;
        this.state.phase = 'resolution';
        this.ui.log(`You chose the ${ROLES[roleId].name}. ${ROLES[roleId].follow}`);

        // 1. Player Privilege Action
        this.executeRoleAction(roleId, true);

        // 2. Rival Follow Action
        setTimeout(() => this.executeRivalFollow(), 1000);
    }

    executeRoleAction(roleId, isPlayer) {
        const actor = isPlayer ? this.state : this.state.rival;
        const privilege = isPlayer;

        switch (roleId) {
            case 'prospector':
                actor.gold += privilege ? 2 : 1;
                break;
            case 'merchant':
                this.performMarketAction(isPlayer, privilege);
                break;
            case 'alchemist':
                this.performProduction(isPlayer, privilege);
                break;
            case 'guildmaster':
                // Handled via UI interaction after selecting role
                if (isPlayer) this.ui.showBuildPanel(privilege);
                else this.executeRivalBuild();
                break;
            case 'patron':
                if (isPlayer) this.ui.showShippingPanel(privilege);
                else this.executeRivalShip();
                break;
        }
        this.ui.renderAll();
    }

    executeRivalFollow() {
        const roleId = this.state.currentRole;
        this.ui.log(`Rival Alchemist follows as ${ROLES[roleId].name}.`);
        this.executeRoleAction(roleId, false);

        // End of Role Turn
        setTimeout(() => this.endRoleTurn(), 1000);
    }

    endRoleTurn() {
        const idx = this.state.availableRoles.indexOf(this.state.currentRole);
        this.state.availableRoles.splice(idx, 1);

        if (this.state.availableRoles.length < 3) {
            this.endRound();
        } else {
            this.state.phase = 'selection';
            this.state.currentRole = null;
            this.ui.log("Choose another Role.");
        }
        this.ui.renderAll();
    }

    endRound() {
        this.state.round++;
        this.state.availableRoles = ['guildmaster', 'alchemist', 'merchant', 'patron', 'prospector'];
        this.ui.log(`--- Round ${this.state.round} ---`);
        this.ui.renderAll();

        if (this.state.round > this.state.maxRounds) {
            this.resolveVictory();
        }
    }

    performProduction(isPlayer, privilege) {
        const actor = isPlayer ? this.state : this.state.rival;
        const workshops = isPlayer ? this.state.workshops : this.state.rival.workshops;

        workshops.forEach(wsId => {
            const data = WORKSHOPS[wsId];
            const product = PRODUCTS[data.output];

            // Check Recipe
            let canMake = true;
            for (const [ing, amt] of Object.entries(product.recipe)) {
                if (actor.inventory[ing] < amt) canMake = false;
            }

            if (canMake) {
                for (const [ing, amt] of Object.entries(product.recipe)) actor.inventory[ing] -= amt;
                actor.inventory[product.id] += 1;
                if (isPlayer) this.ui.log(`Workshop ${data.name} produced ${product.name}.`);
            }
        });

        if (privilege && isPlayer) {
            this.state.gold += 1; // Merchant privilege bonus
        }
    }

    performMarketAction(isPlayer, privilege) {
        const actor = isPlayer ? this.state : this.state.rival;
        // Simple sell-highest-value-valid item
        const sellables = Object.values(PRODUCTS).filter(p => p.type === 'fine' && actor.inventory[p.id] > 0);
        if (sellables.length > 0) {
            const item = sellables[0];
            actor.inventory[item.id]--;
            const gain = item.baseValue + (privilege ? 1 : 0);
            actor.gold += gain;
            if (isPlayer) this.ui.log(`Market: Sold ${item.name} for ${gain} Gold.`);
        }
    }

    executeRivalBuild() {
        const possible = Object.values(WORKSHOPS).filter(w => this.state.rival.gold >= w.cost);
        if (possible.length > 0) {
            const choice = possible[0];
            this.state.rival.gold -= choice.cost;
            this.state.rival.workshops.push(choice.id);
        }
    }

    executeRivalShip() {
        this.state.rival.vp += 2; // Simplified
    }

    buyWorkshop(id, privilege) {
        const data = WORKSHOPS[id];
        const cost = Math.max(0, data.cost - (privilege ? 1 : 0));
        if (this.state.gold >= cost) {
            this.state.gold -= cost;
            this.state.workshops.push(id);
            this.ui.log(`Guild Master: Built ${data.name}.`);
            this.ui.renderAll();
        } else { alert("Not enough Gold!"); }
    }

    resolveVictory() {
        this.ui.showOverlay("Master of Secrets", `Final Score: Your VP ${this.state.victoryPoints} vs Rival VP ${this.state.rival.vp}`);
    }
}

window.gameEngine = new Engine();
