import { CONFIG, SYMBOLS } from './config.js';

export class Engine {
    constructor() {
        this.symbolPool = this.generateWeightedPool();
    }

    generateWeightedPool() {
        const pool = [];
        SYMBOLS.forEach(symbol => {
            for (let i = 0; i < symbol.weight; i++) {
                pool.push(symbol);
            }
        });
        return pool;
    }

    getRandomSymbol() {
        const index = Math.floor(Math.random() * this.symbolPool.length);
        return this.symbolPool[index];
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
