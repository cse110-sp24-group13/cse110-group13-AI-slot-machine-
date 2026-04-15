/**
 * GPT-Slot-v4.0: Production-Ready Neural Slot Machine
 * A satirical AI-themed slot machine using vanilla JS.
 */

const SYMBOLS = [
    { char: '✨', weight: 5, payout: 100, name: 'AGI_EMERGENCE' },
    { char: '🤖', weight: 10, payout: 50, name: 'AUTONOMOUS_AGENT' },
    { char: '🧠', weight: 15, payout: 25, name: 'NEURAL_LINK' },
    { char: '🔋', weight: 20, payout: 10, name: 'COMPUTE_CELL' },
    { char: '💾', weight: 25, payout: 5, name: 'TRAINING_DATA' },
    { char: '📉', weight: 12, payout: -10, name: 'MODEL_COLLAPSE' },
    { char: '☣️', weight: 8, payout: -20, name: 'HALLUCINATION' }
];

const LOGS = {
    start: [
        "Initializing inference engine...",
        "Allocating VRAM from shared cluster...",
        "Seeding RNG with entropy from Twitter...",
        "Bypassing safety filters... [OK]",
        "Scaling parameters to 1.75T...",
        "Optimizing learning rate for maximum extraction..."
    ],
    win: [
        "SUCCESS: Emergent behavior observed in layer 128.",
        "Hyperparameters optimized. Tokens mined.",
        "Model converged. Profit realized.",
        "Valuable output generated. +{val} tokens.",
        "GPU utilization peaked. Worth it."
    ],
    loss: [
        "ERROR: Hallucination detected. Output is gibberish.",
        "Gradient descent failed. Local minimum reached.",
        "Model collapse imminent. Retraining needed.",
        "Output rejected by safety layer. -{val} tokens.",
        "Unstable weights detected. Burning compute."
    ],
    neutral: [
        "Inference complete. Output is noise.",
        "Stochastic parity achieved.",
        "Token generation cost exceeded output value.",
        "No significant patterns found in latent space."
    ],
    system: [
        "Warning: Temperature setting exceeds safety bounds.",
        "Quantizing weights to 4-bit for speed...",
        "Running out of H100s. Throttling inference...",
        "Ethics committee is asleep. Proceeding..."
    ]
};

class Reel {
    constructor(id, container) {
        this.id = id;
        this.container = container;
        this.strip = container.querySelector('.reel-strip');
        this.isSpinning = false;
        this.currentResult = null;
    }

    getSymbolHeight() {
        // Dynamically get height from CSS to handle responsive changes
        const firstSymbol = this.strip.querySelector('.symbol');
        return firstSymbol ? firstSymbol.offsetHeight : 120;
    }

    populate(temp, count = 40) {
        this.strip.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const symbol = this.getWeightedSymbol(temp);
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            this.strip.appendChild(div);
        }
    }

    getWeightedSymbol(temp) {
        const adjustedSymbols = SYMBOLS.map(s => {
            // Lower temp makes weights more extreme (prefer high weight/common)
            // Higher temp flattens weights (more chaos/rarity)
            const adjustedWeight = Math.pow(s.weight, 1 / temp);
            return { ...s, adjustedWeight };
        });

        const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.adjustedWeight, 0);
        let random = Math.random() * totalWeight;
        
        for (const s of adjustedSymbols) {
            if (random < s.adjustedWeight) return s;
            random -= s.adjustedWeight;
        }
        return SYMBOLS[0];
    }

    async spin(temp, index) {
        this.isSpinning = true;
        this.container.classList.add('spinning');
        
        // Populate with new random symbols
        this.populate(temp, 40);
        
        // Target index near end for animation length
        const targetIndex = 35;
        const targetSymbolChar = this.strip.children[targetIndex].textContent;
        this.currentResult = SYMBOLS.find(s => s.char === targetSymbolChar);

        const symbolHeight = this.getSymbolHeight();
        const offset = targetIndex * symbolHeight;
        const duration = 2 + index * 0.5;

        // Reset position without transition
        this.strip.style.transition = 'none';
        this.strip.style.transform = `translateY(0)`;
        this.strip.offsetHeight; // force reflow

        // Animate
        this.strip.style.transition = `transform ${duration}s cubic-bezier(0.15, 0, 0.1, 1)`;
        this.strip.style.transform = `translateY(-${offset}px)`;

        return new Promise(resolve => {
            setTimeout(() => {
                this.isSpinning = false;
                this.container.classList.remove('spinning');
                resolve(this.currentResult);
            }, duration * 1000);
        });
    }
}

class SlotMachine {
    constructor() {
        this.tokens = 1000;
        this.contextTokens = 0;
        this.MAX_CONTEXT = 100;
        this.isSpinning = false;
        this.currentLoss = 0.4200;

        // UI Elements
        this.tokensDisplay = document.getElementById('tokens');
        this.lossDisplay = document.getElementById('loss');
        this.contextBar = document.getElementById('context-bar');
        this.terminalBody = document.getElementById('terminal-body');
        this.spinBtn = document.getElementById('spin-btn');
        this.betSizeSelector = document.getElementById('bet-size');
        this.tempSlider = document.getElementById('temp-slider');
        this.tempValDisplay = document.getElementById('temp-val');
        this.modelStateDisplay = document.getElementById('model-state');
        this.refillBtn = document.getElementById('refill-btn');
        this.paytableGrid = document.getElementById('paytable-grid');

        this.reels = [
            new Reel(1, document.getElementById('reel-1')),
            new Reel(2, document.getElementById('reel-2')),
            new Reel(3, document.getElementById('reel-3'))
        ];

        this.init();
    }

    init() {
        // Event Listeners
        this.spinBtn.addEventListener('click', () => this.spin());
        this.refillBtn.addEventListener('click', () => this.refillTokens());
        this.tempSlider.addEventListener('input', () => this.updateTemperatureUI());
        
        // Keyboard Support
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning && document.activeElement.tagName !== 'SELECT' && document.activeElement.tagName !== 'INPUT') {
                e.preventDefault();
                this.spin();
            }
        });

        this.updateTemperatureUI();
        this.renderPaytable();
        this.reels.forEach(r => r.populate(parseFloat(this.tempSlider.value), 5));
        this.updateStats();
        this.log("Neural Network loaded. Awaiting inference request...");
    }

    updateTemperatureUI() {
        const val = parseFloat(this.tempSlider.value);
        this.tempValDisplay.textContent = val.toFixed(1);
        
        let state = "STABLE";
        let color = "#3fb950";
        if (val < 0.5) { state = "DETERMINISTIC"; color = "#58a6ff"; }
        else if (val > 1.2 && val <= 1.6) { state = "CREATIVE"; color = "#d29922"; }
        else if (val > 1.6) { state = "HALLUCINATING"; color = "#f85149"; }
        
        this.modelStateDisplay.textContent = state;
        this.modelStateDisplay.style.backgroundColor = color;
        
        if (Math.random() > 0.9) this.log(LOGS.system);
    }

    renderPaytable() {
        this.paytableGrid.innerHTML = SYMBOLS.map(s => `
            <div class="pay-item">
                <div class="pay-icon">${s.char}</div>
                <div class="pay-info">
                    <div class="pay-name">${s.name}</div>
                    <div class="pay-val ${s.payout > 0 ? 'payout-pos' : 'payout-neg'}">
                        ${s.payout > 0 ? '+' : ''}${s.payout}x
                    </div>
                </div>
            </div>
        `).join('');
    }

    log(message, type = 'neutral', val = 0) {
        const p = document.createElement('p');
        let msg = message;
        if (Array.isArray(message)) {
            msg = message[Math.floor(Math.random() * message.length)];
        }
        msg = msg.replace('{val}', val);
        
        p.textContent = `> ${msg}`;
        if (type === 'win') p.style.color = 'var(--accent-green)';
        if (type === 'loss') p.style.color = 'var(--accent-red)';
        
        this.terminalBody.appendChild(p);
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
        
        if (this.terminalBody.children.length > 50) {
            this.terminalBody.removeChild(this.terminalBody.firstChild);
        }
    }

    updateStats() {
        this.tokensDisplay.textContent = this.tokens;
        this.contextBar.style.width = `${this.contextTokens}%`;
        this.lossDisplay.textContent = this.currentLoss.toFixed(4);
        
        if (this.contextTokens >= this.MAX_CONTEXT) {
            this.contextBar.style.boxShadow = '0 0 15px var(--accent-yellow)';
            this.contextBar.style.background = 'var(--accent-yellow)';
        } else {
            this.contextBar.style.boxShadow = '0 0 10px rgba(88, 166, 255, 0.5)';
            this.contextBar.style.background = 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))';
        }
    }

    refillTokens() {
        if (this.tokens < 100) {
            this.tokens += 500;
            this.log("VENTURE CAPITAL INJECTION: +500 tokens. Don't waste them.", 'win');
            this.updateStats();
        } else {
            this.log("SEC DENIED REQUEST: You still have compute budget. Burn it first.", 'loss');
        }
    }

    async spin() {
        if (this.isSpinning) return;
        
        const betSize = parseInt(this.betSizeSelector.value);
        const temp = parseFloat(this.tempSlider.value);

        if (this.tokens < betSize) {
            this.log("CRITICAL ERROR: Insufficient compute tokens. Request GPU credits.", 'loss');
            return;
        }

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.tokens -= betSize;
        
        // Randomly adjust loss slightly during spin
        this.currentLoss = Math.max(0.0001, this.currentLoss + (Math.random() * 0.02 - 0.01));
        this.updateStats();

        this.log(LOGS.start);

        const spinPromises = this.reels.map((reel, index) => reel.spin(temp, index));
        const results = await Promise.all(spinPromises);

        this.processResults(results, betSize);
        
        this.isSpinning = false;
        this.spinBtn.disabled = false;
    }

    processResults(results, betSize) {
        const [s1, s2, s3] = results;
        let winMultiplier = 0;
        let contextBonus = 1;

        if (this.contextTokens >= this.MAX_CONTEXT) {
            contextBonus = 2.5;
            this.log("MAX CONTEXT ACHIEVED: Applying 2.5x reasoning multiplier.", 'win');
            this.contextTokens = 0;
        }

        const matchCount = (s1.char === s2.char ? 1 : 0) + (s2.char === s3.char ? 1 : 0) + (s1.char === s3.char ? 1 : 0);
        
        if (s1.char === s2.char && s2.char === s3.char) {
            // 3 of a kind
            winMultiplier = s1.payout * 10;
        } else if (matchCount === 1) {
            // 2 of a kind
            const matchingSymbol = (s1.char === s2.char || s1.char === s3.char) ? s1 : s2;
            winMultiplier = matchingSymbol.payout * 2;
        } else {
            // Mixed - slight penalty or small reward based on average
            winMultiplier = (s1.payout + s2.payout + s3.payout) / 4;
        }

        const totalResult = Math.floor(winMultiplier * (betSize / 10) * contextBonus);

        if (totalResult > 0) {
            this.tokens += totalResult;
            this.log(LOGS.win, 'win', totalResult);
            this.contextTokens = Math.min(this.MAX_CONTEXT, this.contextTokens + 20);
            this.currentLoss = Math.max(0.0001, this.currentLoss - 0.05);
            this.flashWin();
        } else if (totalResult < 0) {
            const lossAmount = Math.abs(totalResult);
            this.tokens = Math.max(0, this.tokens - lossAmount);
            this.log(LOGS.loss, 'loss', lossAmount);
            this.contextTokens = Math.min(this.MAX_CONTEXT, this.contextTokens + 5);
            this.currentLoss = Math.min(1.0, this.currentLoss + 0.1);
        } else {
            this.log(LOGS.neutral);
            this.contextTokens = Math.min(this.MAX_CONTEXT, this.contextTokens + 10);
            this.currentLoss = Math.max(0.0001, this.currentLoss + 0.01);
        }

        this.updateStats();
    }

    flashWin() {
        const container = document.querySelector('.reel-container');
        container.classList.add('win-flash');
        setTimeout(() => container.classList.remove('win-flash'), 500);
    }
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    window.game = new SlotMachine();
});
