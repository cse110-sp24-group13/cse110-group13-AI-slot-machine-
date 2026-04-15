import { CONFIG, SYMBOLS } from './config.js';

export class Engine {
    constructor() {
        this.cachedPool = null;
        this.cachedTemp = null;
        this.generateWeightedPool(0.7);
    }

    generateWeightedPool(temperature = 0.7) {
        // Round to 1 decimal place to prevent floating point cache misses
        const temp = Math.round(temperature * 10) / 10;
        
        if (this.cachedPool && this.cachedTemp === temp) {
            return this.cachedPool;
        }

        const pool = [];
        SYMBOLS.forEach(symbol => {
            let weight = symbol.weight;
            
            // Adjust weights based on temperature
            if (temp > 1.0) {
                if (['mush', 'hype', 'safety', 'agi'].includes(symbol.id)) weight *= (temp * 1.5);
                else weight /= (temp * 0.8);
            } else if (temp < 0.5) {
                if (['bot', 'data', 'brain'].includes(symbol.id)) weight *= (1.5 / temp);
                else weight *= temp;
            }

            for (let i = 0; i < Math.max(1, Math.round(weight)); i++) {
                pool.push(symbol);
            }
        });

        this.cachedPool = pool;
        this.cachedTemp = temp;
        return pool;
    }

    getProbabilities(temperature = 0.7) {
        const pool = this.generateWeightedPool(temperature);
        const total = pool.length;
        const weights = {};
        pool.forEach(s => weights[s.id] = (weights[s.id] || 0) + 1);
        
        const probs = {};
        SYMBOLS.forEach(s => {
            probs[s.id] = ((weights[s.id] || 0) / total * 100).toFixed(1);
        });
        return probs;
    }

    getRandomSymbol(temperature = 0.7) {
        const pool = this.generateWeightedPool(temperature);
        const index = Math.floor(Math.random() * pool.length);
        return pool[index];
    }

    generateReel() {
        const reel = [];
        for (let i = 0; i < CONFIG.SYMBOLS_PER_REEL; i++) {
            reel.push(this.getRandomSymbol());
        }
        return reel;
    }

    evaluateSpin(results) {
        const icons = results.map(r => r.id);
        const uniqueIcons = [...new Set(icons)];

        // JackPot (3 matching symbols)
        if (uniqueIcons.length === 1) {
            const symbol = results[0];
            const multiplier = 10;
            return {
                type: 'jackpot',
                symbol,
                multiplier,
                payout: symbol.value * multiplier
            };
        }

        // Small Win (2 matching symbols)
        if (uniqueIcons.length === 2) {
            // Find which symbol is repeated
            let matchId = icons.find((id, index) => icons.indexOf(id) !== index);
            const matchSymbol = results.find(s => s.id === matchId);
            const multiplier = 2;
            return {
                type: 'small-win',
                symbol: matchSymbol,
                multiplier,
                payout: matchSymbol.value * multiplier
            };
        }

        // Loss
        return {
            type: 'loss',
            payout: 0
        };
    }
}
