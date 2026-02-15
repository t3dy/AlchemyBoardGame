export const TILES = {
    furnace: { id: 'furnace', name: "Furnace", cost: 3, emoji: "🔥", baseProd: 2, hazardRisk: 0.1 },
    alembic: { id: 'alembic', name: "Alembic", cost: 2, emoji: "🧪", baseProd: 1, hazardRisk: 0.05 },
    assay: { id: 'assay', name: "Assay Bench", cost: 2, emoji: "⚒️", baseProd: 1, hazardRisk: 0 },
    crucible: { id: 'crucible', name: "Crucible", cost: 2, emoji: "🥣", baseProd: 1, hazardRisk: 0.05 }
};

export const INGREDIENTS = {
    ash: { name: "Ash", emoji: "💨" },
    herbs: { name: "Herbs", emoji: "🌿" }
};

export const DISASTERS = {
    spill: { title: "Spill", text: "Minor chemical spill.", stabilityLoss: 1, suspicionGain: 1 },
    explosion: { title: "Explosion", text: "Laboratory accident!", stabilityLoss: 2, suspicionGain: 3 }
};

export function getTileData(id) { return TILES[id]; }
