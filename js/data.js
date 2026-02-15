export const ROUND_CARDS = [
    { round: 1, id: 'extra_workbench', name: "Expand Workbench", emoji: "⚒️", description: "Gain +3 Ingredients", type: 'action' },
    { round: 2, id: 'hiring', name: "Hiring Fair", emoji: "🤝", description: "Add 1 Alchemist (Requires Room)", type: 'action' },
    { round: 3, id: 'stable_distill', name: "Stable Distillation", emoji: "🧪", description: "Craft 2 Potions", type: 'action' },
    { round: 4, id: 'expansion', name: "Build Laboratory Room", emoji: "🏠", description: "Add space for 1 Alchemist", type: 'action' },
    { round: 5, id: 'special_order', name: "Special Order", emoji: "📜", description: "Earn 3 VP immediately", type: 'action' },
    { round: 6, id: 'industrial_alembic', name: "Industrial Alembic", emoji: "⚗️", description: "Refine 2 Metals", type: 'action' },
    { round: 7, id: 'mass_production', name: "Mass Production", emoji: "🏭", description: "Produce +5 Ingredients", type: 'action' },
    { round: 8, id: 'renovation', name: "Premium Renovation", emoji: "✨", description: "Upgrade 1 Room to Stone", type: 'action' },
    { round: 9, id: 'master_study', name: "Master's Study", emoji: "📖", description: "Earn 1 VP for every 2 Potions", type: 'action' },
    { round: 10, id: 'apprentice_program', name: "Apprentice Program", emoji: "👨‍🎓", description: "Add 1 Alchemist instantly", type: 'action' },
    { round: 11, id: 'grand_furnace', name: "The Grand Furnace", emoji: "🔥", description: "Refine 3 Metals", type: 'action' },
    { round: 12, id: 'royal_commission', name: "Royal Commission", emoji: "👑", description: "Earn 5 VP", type: 'action' },
    { round: 13, id: 'emergency_reagents', name: "Emergency Reagents", emoji: "⚕️", description: "Gain 3 Reagents", type: 'action' },
    { round: 14, id: 'magnum_opus', name: "The Magnum Opus", emoji: "💎", description: "Earn 10 VP", type: 'action' }
];

export const BASIC_ACTIONS = [
    { id: 'gather_ash', name: "Gather Ash", emoji: "💨", description: "Gain 1 Ingredient", type: 'action' },
    { id: 'gather_gold', name: "Earn Wages", emoji: "🪙", description: "Gain 1 Gold", type: 'action' },
    { id: 'reagent_mix', name: "Mix Reagents", emoji: "⚕️", description: "Gain 1 Reagent (Food)", type: 'action' },
    { id: 'plow_bench', name: "Clear Bench", emoji: "🧹", description: "Gain 1 Lab Slot", type: 'action' }
];

export const HARVEST_ROUNDS = [4, 7, 9, 11, 13, 14];

export const FURNITURE = {
    room: { id: 'room', name: "Lab Room", emoji: "🏠", cost: { wood: 2 }, category: 'housing' },
    workbench: { id: 'workbench', name: "Workbench", emoji: "⚒️", category: 'production' },
    alembic: { id: 'alembic', name: "Alembic", emoji: "⚗️", category: 'production' },
    crucible: { id: 'crucible', name: "Crucible", emoji: "🥣", category: 'production' }
};

export const HEALTH_STATES = {
    vibrant: { id: 'vibrant', name: 'Vibrant', emoji: '✨', canWork: true },
    stable: { id: 'stable', name: 'Stable', emoji: '🟢', canWork: true },
    fatigued: { id: 'fatigued', name: 'Fatigued', emoji: '🟡', canWork: true },
    hungry: { id: 'hungry', name: 'Starving', emoji: '💀', canWork: false }
};
