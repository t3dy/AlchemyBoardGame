export const FURNITURE = {
    crucible: { id: 'crucible', name: "Crucible", emoji: "🥣", description: "Craft Potion (Costs: 2 Ingredients + 1 Metal)", type: 'action' },
    alembic: { id: 'alembic', name: "Alembic", emoji: "⚗️", description: "Refine Advanced Ingredients (Metals)", type: 'action' },
    workbench: { id: 'workbench', name: "Workbench", emoji: "⚒️", description: "Gain 2 Ingredients", type: 'action' },
    research: { id: 'research', name: "Research Desk", emoji: "📜", description: "Unlock Random Upgrade", type: 'action' },
    fume_hood: { id: 'fume_hood', name: "Fume Hood", emoji: "🌬️", description: "Passive: Prevents 1 Sickened result/round", type: 'passive' }
};

export const HEALTH_STATES = {
    green: { id: 'green', name: 'Healthy', emoji: '🟢', canWork: true, bonus: 0 },
    yellow: { id: 'yellow', name: 'Sickened', emoji: '🟡', canWork: true, bonus: -1 },
    red: { id: 'red', name: 'Injured', emoji: '🔴', canWork: false, bonus: 0 },
    black: { id: 'black', name: 'Critical', emoji: '💀', canWork: false, bonus: 0 }
};

export const DISASTERS = [
    { id: 'acid_spill', title: "Acid Spill", trigger: "Flash crash.", effect: "Injury.", impact: { type: 'injury', to: 'red' }, cost: { ingredient: 1 } },
    { id: 'gas', title: "Gas Leak", trigger: "Smell of eggs.", effect: "All sickened.", impact: { type: 'stat', to: 'yellow' }, passiveBlock: 'fume_hood' }
];

export function getFurnitureData(id) { return FURNITURE[id]; }
export function getHealthData(id) { return HEALTH_STATES[id]; }
