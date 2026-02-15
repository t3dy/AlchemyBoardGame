export const ROLES = {
    guildmaster: { id: 'guildmaster', name: "Guild Master", icon: "🏗️", desc: "Build workshops. Privilege: Cost -1 Gold.", follow: "All players may build 1 workshop." },
    alchemist: { id: 'alchemist', name: "Head Alchemist", icon: "⚗️", desc: "Produce goods. Privilege: +1 bonus product.", follow: "All workshops produce if they have raw materials." },
    merchant: { id: 'merchant', name: "Merchant", icon: "⚖️", desc: "Sell goods for Gold. Privilege: +1 Gold per sale.", follow: "All players may sell 1 item to the market." },
    patron: { id: 'patron', name: "Royal Patron", icon: "🏰", desc: "Ship goods for VP. Privilege: +1 VP per shipment.", follow: "All players may ship goods to current commissions." },
    prospector: { id: 'prospector', name: "Prospector", icon: "⛏️", desc: "Gain Gold directly. Privilege: +1 Gold.", follow: "Only user gains gold." }
};

export const PRODUCTS = {
    // Raw Materials
    mercury: { id: 'mercury', name: "Mercury", emoji: "💧", type: 'raw', baseValue: 1 },
    sulfur: { id: 'sulfur', name: "Sulfur", emoji: "🌋", type: 'raw', baseValue: 1 },
    lead: { id: 'lead', name: "Lead", emoji: "🌑", type: 'raw', baseValue: 1 },
    antimony: { id: 'antimony', name: "Antimony", emoji: "🪨", type: 'raw', baseValue: 1 },

    // Refined Goods (Pigments / Medicines / Glass)
    vermilion: { id: 'vermilion', name: "Vermilion", emoji: "🎨", type: 'fine', baseValue: 4, recipe: { mercury: 1, sulfur: 1 }, station: 'sublimatory' },
    white_lead: { id: 'white_lead', name: "White Lead", emoji: "🖌️", type: 'fine', baseValue: 3, recipe: { lead: 1 }, station: 'corroder' },
    antimony_pill: { id: 'antimony_pill', name: "Antimony Pill", emoji: "💊", type: 'fine', baseValue: 3, recipe: { antimony: 1 }, station: 'calciner' },
    spirit_salt: { id: 'spirit_salt', name: "Spirit of Salt", emoji: "🧪", type: 'fine', baseValue: 2, recipe: { sulfur: 1 }, station: 'alembic' }
};

export const WORKSHOPS = {
    sublimatory: { id: 'sublimatory', name: "Sublimatory", emoji: "🔥", cost: 3, output: 'vermilion' },
    corroder: { id: 'corroder', name: "Corrosion Pit", emoji: "🏺", cost: 2, output: 'white_lead' },
    calciner: { id: 'calciner', name: "Calcination Oven", emoji: "🌬️", cost: 2, output: 'antimony_pill' },
    alembic: { id: 'alembic', name: "Grand Alembic", emoji: "⚗️", cost: 1, output: 'spirit_salt' }
};

export const COMMISSIONS = [
    { id: 'painter', name: "The Court Painter", needs: { vermilion: 2, white_lead: 1 }, vp: 10 },
    { id: 'apothecary', name: "The Royal Apothecary", needs: { antimony_pill: 2, spirit_salt: 1 }, vp: 8 },
    { id: 'glassmaker', name: "Venetian Guild", needs: { spirit_salt: 2, mercury: 1 }, vp: 6 }
];
