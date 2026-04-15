import { CONFIG, SYMBOLS } from './config.js';

export class DifficultyManager {
    constructor(engine) {
        this.engine = engine;
    }

    adjust(sessionRTP) {
        const targetRTP = CONFIG.TARGET_RTP * 100;
        const diff = sessionRTP - targetRTP;

        // If RTP is 10% higher than target, reduce weights of high-payout symbols
        if (diff > 10) {
            this.updateWeights(0.9); // Reduce high-value symbol weights by 10%
        } 
        // If RTP is 10% lower than target, increase weights of high-payout symbols
        else if (diff < -10) {
            this.updateWeights(1.1); // Increase high-value symbol weights by 10%
        }
    }

    updateWeights(factor) {
        SYMBOLS.forEach(symbol => {
            if (symbol.value > 20) {
                symbol.weight = Math.max(1, Math.round(symbol.weight * factor));
            }
        });
        // Regenerate the pool in engine
        this.engine.symbolPool = this.engine.generateWeightedPool();
    }
}
