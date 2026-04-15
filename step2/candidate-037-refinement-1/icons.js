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

function getRandomSymbol(temperature = 1.0) {
    // Temperature affects weights:
    // Higher temperature increases randomness and boosts rare symbols but also boosts mushrooms.
    // Lower temperature makes it more predictable and stable (higher weights for common symbols).
    
    const weightedSymbols = SYMBOLS.map(symbol => {
        let weight = symbol.weight;
        
        if (temperature > 1.2) {
            // High temp: Boost rare and wild symbols
            if (symbol.id === 'llm' || symbol.id === 'brain') weight *= (temperature * 1.5);
            if (symbol.id === 'mushroom') weight *= (temperature * 2.0);
            if (symbol.id === 'loss' || symbol.id === 'api') weight *= (0.5 / temperature);
        } else if (temperature < 0.8) {
            // Low temp: Boost stable/common symbols
            if (symbol.id === 'loss' || symbol.id === 'api') weight *= (2.0 / temperature);
            if (symbol.id === 'llm' || symbol.id === 'brain') weight *= (temperature * 0.5);
            if (symbol.id === 'mushroom') weight *= (temperature * 0.2);
        }
        
        return { ...symbol, tempWeight: weight };
    });

    const totalWeight = weightedSymbols.reduce((sum, s) => sum + s.tempWeight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of weightedSymbols) {
        if (random < symbol.tempWeight) return symbol;
        random -= symbol.tempWeight;
    }
    return SYMBOLS[0];
}

window.SYMBOLS = SYMBOLS;
window.getRandomSymbol = getRandomSymbol;
window.getSymbolById = getSymbolById;
