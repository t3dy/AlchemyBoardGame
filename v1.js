// Game State
let state = {
    gold: 5,
    salts: 2,
    elixir: 0,
    productivity: 0,
    stability: 5,
    alchemist: '🟢', // 🟢, 🟡, 🔴
    furniture: [], // Array of { type, emoji, baseProd }
    activeCard: null,
    stabilityCollapses: 0,
    alchemistIncapacitatedCount: 0
};

// Decks
const SAFE_DECK = [
    { title: "Steady Work", text: "+1 productivity", effect: (s) => { s.lastCardBonus = 1; } },
    { title: "Minor Spill", text: "−1 Salts, Alchemist becomes 🟡", effect: (s) => { s.salts = Math.max(0, s.salts - 1); setAlchemistState('🟡'); } },
    { title: "Small Discovery", text: "+1 Salts", effect: (s) => { s.salts += 1; } }
];

const PUSH_DECK = [
    { title: "Controlled Risk", text: "+2 productivity", effect: (s) => { s.lastCardBonus = 2; } },
    { title: "Lab Disaster", text: "Stability −1, Alchemist becomes 🟡 (or 🔴)", effect: (s) => { triggerDisaster(); } },
    {
        title: "Breakthrough", text: "+3 productivity. (Bonus if Alembic exists)", effect: (s) => {
            s.lastCardBonus = 3;
            if (hasFurniture('alembic')) { s.elixir += 1; }
        }
    }
];

const FURNITURE_TYPES = {
    furnace: { name: "Furnace", cost: 3, emoji: "🔥", baseProd: 2 },
    alembic: { name: "Alembic", cost: 2, emoji: "🧪", baseProd: 1 },
    assay: { name: "Assay Bench", cost: 2, emoji: "⚒️", baseProd: 1 }
};

// Initialization
function init() {
    renderGrid();
    updateUI();
}

// UI Updating
function updateUI() {
    document.getElementById('gold').innerText = state.gold;
    document.getElementById('salts').innerText = state.salts;
    document.getElementById('elixir').innerText = state.elixir;
    document.getElementById('productivity').innerText = state.productivity;
    document.getElementById('stability').innerText = state.stability;
    document.getElementById('alchemist-state').innerText = state.alchemist;

    // Button states
    document.getElementById('buy-furnace').disabled = state.gold < 3 || state.furniture.length >= 9;
    document.getElementById('buy-alembic').disabled = state.gold < 2 || state.furniture.length >= 9;
    document.getElementById('buy-assay').disabled = state.gold < 2 || state.furniture.length >= 9;

    const isRed = state.alchemist === '🔴';
    document.getElementById('safe-btn').disabled = state.activeCard !== null || isRed;
    document.getElementById('push-btn').disabled = state.activeCard !== null || isRed;

    const recoverBtn = document.getElementById('recover-btn');
    if (isRed && !state.activeCard) {
        recoverBtn.classList.remove('hidden');
    } else {
        recoverBtn.classList.add('hidden');
    }

    // Win/Loss check
    if (state.productivity >= 12) {
        showOverlay("Magnum Opus Achieved", "The Great Work is complete! You have mastered the art of alchemy.");
    } else if (state.stabilityCollapses >= 2 || state.alchemistIncapacitatedCount >= 2) {
        showOverlay("Laboratory Ruined", "The lab is a wreck and your health has failed. Your journey ends here.");
    }
}

function renderGrid() {
    const grid = document.getElementById('lab-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (state.furniture[i]) {
            tile.classList.add('filled');
            tile.innerText = state.furniture[i].emoji;
        } else {
            tile.style.borderStyle = 'dotted';
        }
        grid.appendChild(tile);
    }
}

// Logic Functions
function hasFurniture(type) {
    return state.furniture.some(f => f.type === type);
}

function purchaseFurniture(type) {
    const data = FURNITURE_TYPES[type];
    if (state.gold >= data.cost && state.furniture.length < 9) {
        state.gold -= data.cost;
        state.furniture.push({ type: type, emoji: data.emoji, baseProd: data.baseProd });
        renderGrid();
        updateUI();
    }
}

function setAlchemistState(newState) {
    state.alchemist = newState;
    if (newState === '🔴') {
        state.alchemistIncapacitatedCount++;
    }
    updateUI();
}

function takeAction(mode) {
    const deck = mode === 'safe' ? SAFE_DECK : PUSH_DECK;
    state.activeCard = deck[Math.floor(Math.random() * deck.length)];

    document.getElementById('card-title').innerText = state.activeCard.title;
    document.getElementById('card-text').innerText = state.activeCard.text;
    document.getElementById('resolve-btn').classList.remove('hidden');

    updateUI();
}

document.getElementById('resolve-btn').onclick = () => {
    state.lastCardBonus = 0;
    state.activeCard.effect(state);

    // Calculate Productivity
    let furnitureProd = state.furniture.reduce((sum, f) => sum + f.baseProd, 0);

    // Penalties based on state
    if (state.alchemist === '🟡') {
        furnitureProd = Math.max(0, furnitureProd - 1);
    } else if (state.alchemist === '🔴') {
        furnitureProd = 0;
    }

    state.productivity += (furnitureProd + state.lastCardBonus);

    // Cleanup
    state.activeCard = null;
    document.getElementById('resolve-btn').classList.add('hidden');
    document.getElementById('card-title').innerText = "Lab Resting";
    document.getElementById('card-text').innerText = "Choose your next action.";

    // Post-resolve check
    if (state.stability <= 0) {
        handleStabilityFailure();
    }

    updateUI();
};

function triggerDisaster() {
    document.getElementById('game-container').classList.add('shake');
    setTimeout(() => document.getElementById('game-container').classList.remove('shake'), 400);

    let loss = hasFurniture('furnace') ? 2 : 1;
    if (hasFurniture('assay')) {
        loss = Math.max(0, loss - 1);
    }
    state.stability -= loss;

    // State transition
    if (state.alchemist === '🟢') setAlchemistState('🟡');
    else if (state.alchemist === '🟡') setAlchemistState('🔴');
}

function handleStabilityFailure() {
    state.stabilityCollapses++;
    alert("LAB COLLAPSE! 🧱 Stability failure.");

    if (state.furniture.length > 0) {
        const index = Math.floor(Math.random() * state.furniture.length);
        state.furniture.splice(index, 1);
    }

    state.productivity = Math.max(0, state.productivity - 3);
    state.stability = 3;
    renderGrid();
}

document.getElementById('recover-btn').onclick = () => {
    if (state.elixir > 0) {
        state.elixir -= 1;
        setAlchemistState('🟡');
    } else {
        // Lose a turn logic is effectively just resolving and coming back to yellow
        alert("You spend a round recovering...");
        setAlchemistState('🟡');
    }
    updateUI();
};

function showOverlay(title, msg) {
    document.getElementById('overlay-title').innerText = title;
    document.getElementById('overlay-message').innerText = msg;
    document.getElementById('overlay').classList.remove('hidden');
}

init();
