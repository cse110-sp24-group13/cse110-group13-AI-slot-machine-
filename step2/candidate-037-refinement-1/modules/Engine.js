/**
 * Game Logic & Payout Engine Module
 * Responsibility: Handle RNG, symbol table, win calculation, and dynamic difficulty.
 * Follows SRP: Does not touch the DOM or manage persistent state.
 */
export const SYMBOL_TABLE = [
    { id: 'jackpot', name: 'AGI-SINGULARITY', icon: '🌌', baseWeight: 1, value: 500, color: 'var(--neon-purple)' },
    { id: 'llm', name: 'GPT-LLM', icon: '🤖', baseWeight: 5, value: 50, color: 'var(--neon-green)' },
    { id: 'brain', name: 'NEURAL NET', icon: '🧠', baseWeight: 10, value: 20, color: 'var(--neon-blue)' },
    { id: 'vc', name: 'VC FUNDING', icon: '💰', baseWeight: 15, value: 10, color: '#ffcc00' },
    { id: 'loss', name: 'LOSS FUNC', icon: '📉', baseWeight: 25, value: 2, color: 'var(--neon-red)' },
    { id: 'mushroom', name: 'HALLUCINATION', icon: '🍄', baseWeight: 30, value: 0, color: '#ffcc00' },
    { id: 'api', name: 'API ERROR', icon: '🔌', baseWeight: 20, value: 1, color: '#aaaaaa' }
];

export class Engine {
    constructor(targetRTP = 95) {
        this.targetRTP = targetRTP;
        this.luckFactor = 1.0; // 1.0 = normal, < 1.0 = tougher, > 1.0 = easier
    }

    /**
     * Adjusts the difficulty based on player's current RTP.
     * If player's RTP is high, reduce luckFactor. If low, increase it.
     */
    updateDifficulty(currentRTP) {
        const threshold = 5; // Start adjusting if more than 5% off target
        const diff = this.targetRTP - currentRTP;
        
        // PID-lite adjustment: move luckFactor in small increments
        if (Math.abs(diff) > threshold) {
            this.luckFactor += (diff / 100) * 0.1; 
            // Clamp luck factor between 0.5 and 2.0 to keep it subtle
            this.luckFactor = Math.max(0.5, Math.min(2.0, this.luckFactor));
        } else {
            // Decay luck factor back to 1.0 if near target
            this.luckFactor += (1.0 - this.luckFactor) * 0.05;
        }
    }

    getRandomSymbol() {
        // Calculate dynamic weights
        const weightedTable = SYMBOL_TABLE.map(symbol => {
            let weight = symbol.baseWeight;
            // High-value symbols are affected more by luckFactor
            if (symbol.value > 50) {
                weight *= this.luckFactor;
            }
            return { ...symbol, weight };
        });

        const totalWeight = weightedTable.reduce((sum, s) => sum + s.weight, 0);
        let random = Math.random() * totalWeight;

        for (const symbol of weightedTable) {
            if (random < symbol.weight) return symbol;
            random -= symbol.weight;
        }
        return weightedTable[weightedTable.length - 1];
    }

    spin(bet) {
        const results = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];

        return {
            reels: results,
            ...this.calculateWin(results, bet)
        };
    }

    calculateWin(results, bet) {
        const id1 = results[0].id;
        const id2 = results[1].id;
        const id3 = results[2].id;

        // Jackpot Check (3 of a kind)
        if (id1 === id2 && id2 === id3) {
            const winSymbol = results[0];
            const winAmount = winSymbol.value * bet;
            return {
                winAmount,
                type: winSymbol.id === 'jackpot' ? 'JACKPOT' : 'BIG_WIN',
                message: `CONVERGENCE ACHIEVED: ${winSymbol.name} match! +${winAmount} units.`
            };
        }

        // Partial Match (2 of a kind)
        if (id1 === id2 || id2 === id3 || id1 === id3) {
            const matchSymbol = (id1 === id2) ? results[0] : results[2];
            // Recover bet or small profit for partials
            const winAmount = Math.floor(bet * 0.5); 
            return {
                winAmount,
                type: 'PARTIAL',
                message: `Partial alignment detected. Recovered ${winAmount} units.`
            };
        }

        // Special Events
        if (results.some(r => r.id === 'mushroom')) {
            return {
                winAmount: 0,
                type: 'HALLUCINATION',
                message: "Hallucination detected. Model outputting gibberish..."
            };
        }

        return {
            winAmount: 0,
            type: 'NONE',
            message: "Inference failed to converge. Training continues..."
        };
    }
}
