const SYMBOLS = [
    { id: 'llm', name: 'LLM', icon: '🤖', weight: 1, color: '#00ff00', value: 100 },
    { id: 'brain', name: 'NEURAL NET', icon: '🧠', weight: 2, color: '#ff00ff', value: 50 },
    { id: 'loss', name: 'LOSS FUNC', icon: '📉', weight: 4, color: '#ff4444', value: 10 },
    { id: 'mushroom', name: 'HALLUCINATION', icon: '🍄', weight: 3, color: '#ffcc00', value: 25 },
    { id: 'vc', name: 'VC FUNDING', icon: '💰', weight: 2, color: '#00ccff', value: 75 },
    { id: 'api', name: 'API ERROR', icon: '🔌', weight: 1, color: '#aaaaaa', value: 5 }
];

function getSymbolById(id) {
    return SYMBOLS.find(s => s.id === id);
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[0];
}

window.SYMBOLS = SYMBOLS;
window.getRandomSymbol = getRandomSymbol;
window.getSymbolById = getSymbolById;
