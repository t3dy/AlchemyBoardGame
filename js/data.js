export const ROLES = {
    brewer: { id: 'brewer', name: "Potion Brewer", benefit: "+1 Potion on Crucible success", icon: "🧪" },
    planner: { id: 'planner', name: "Emergency Planner", benefit: "Downgrade 1 Disaster severity level", icon: "📋" },
    industrialist: { id: 'industrialist', name: "Industrialist", benefit: "+1 Ingredient on Workbench success", icon: "🏭" },
    scholar: { id: 'scholar', name: "Scholar", benefit: "+1 VP every Research action", icon: "🎓" }
};

export const FURNITURE = {
    crucible: { id: 'crucible', name: "Crucible", emoji: "🥣", description: "Craft Potion/Medicine", type: 'action', category: 'production' },
    alembic: { id: 'alembic', name: "Alembic", emoji: "⚗️", description: "Refine Metals", type: 'action', category: 'production' },
    workbench: { id: 'workbench', name: "Workbench", emoji: "⚒️", description: "Gain Ingredients", type: 'action', category: 'production' },
    research: { id: 'research', name: "Research Desk", emoji: "📜", description: "Advanced Crafting / VP", type: 'action', category: 'research' },
    fume_hood: { id: 'fume_hood', name: "Fume Hood", emoji: "🌬️", description: "Blocks Sickened results", type: 'passive', category: 'safety' },
    safety_shower: { id: 'safety_shower', name: "Safety Shower", emoji: "🚿", description: "Blocks Acid results", type: 'passive', category: 'safety' },
    ventilation: { id: 'ventilation', name: "Ventilation", emoji: "🌪️", description: "Blocks Gas results", type: 'passive', category: 'safety' }
};

export const DISASTERS = {
    minor: [
        { id: 'spill', title: "Minor Spill", effect: "Random worker → Sickened.", impact: { type: 'injury', to: 'yellow' }, cost: { ingredient: 1 } },
        { id: 'fumes', title: "Stray Fumes", effect: "Random worker → Sickened.", impact: { type: 'injury', to: 'yellow' }, passiveBlock: 'fume_hood' }
    ],
    major: [
        { id: 'explosion', title: "Laboratory Explosion", effect: "Random worker → Injured.", impact: { type: 'injury', to: 'red' }, cost: { gold: 2 } },
        { id: 'gas_leak', title: "Chlorine Leak", effect: "All workers → Sickened.", impact: { type: 'stat', target: 'all', to: 'yellow' }, passiveBlock: 'ventilation' }
    ],
    catastrophic: [
        { id: 'critical_failure', title: "Systemic Collapse", effect: "Random worker → Critical.", impact: { type: 'injury', to: 'black' }, cost: { medicine: 1 } },
        { id: 'containment_breach', title: "Toxic Breach", effect: "All workers → Injured.", impact: { type: 'stat', target: 'all', to: 'red' }, cost: { gold: 5 } }
    ]
};

export const HEALTH_STATES = {
    green: { id: 'green', name: 'Healthy', emoji: '🟢', canWork: true, bonus: 0 },
    yellow: { id: 'yellow', name: 'Sickened', emoji: '🟡', canWork: true, bonus: -1 },
    red: { id: 'red', name: 'Injured', emoji: '🔴', canWork: false, bonus: 0 },
    black: { id: 'black', name: 'Critical', emoji: '💀', canWork: false, bonus: 0 },
    trauma: { id: 'trauma', name: 'Traumatized', emoji: '🌑', canWork: true, bonus: -2 } // Applied to Apprentices
};

export function getFurnitureData(id) { return FURNITURE[id]; }
export function getHealthData(id) { return HEALTH_STATES[id]; }
export function getRoleData(id) { return ROLES[id]; }
