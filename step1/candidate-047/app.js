class TokenBurner {
    constructor() {
        this.credits = 100.00;
        this.tokens = 0;
        this.agiProgress = 12.4;
        this.isSpinning = false;
        this.symbols = ['🤖', '⚡', '🧠', '💸', '💩', '📉', '🏗️', '🧪'];
        this.costPerSpin = 5.00;

        // Satirical messages
        this.winMessages = [
            "Success: Your prompt was actually useful!",
            "Context window expanded. Model is feeling generous.",
            "Jackpot! You've successfully overfit the model.",
            "AGI is 0.0001% closer. Keep burning credits.",
            "VC funding secured. Burn rate is now sustainable."
        ];
        this.lossMessages = [
            "Error: Model hallucinated a loss.",
            "Inference timed out. Credits still consumed.",
            "Safety alignment filtered your win.",
            "Context window exceeded. Please upgrade to Pro.",
            "GPU scarcity detected. Spin cost increased (internally)."
        ];

        this.init();
    }

    init() {
        this.creditsEl = document.getElementById('credits');
        this.tokensEl = document.getElementById('tokens');
        this.statusEl = document.getElementById('status-msg');
        this.spinBtn = document.getElementById('spin-btn');
        this.tempInput = document.getElementById('temp');
        this.tempVal = document.getElementById('temp-val');
        this.agiFill = document.getElementById('agi-fill');
        this.agiPercent = document.getElementById('agi-percent');
        this.reelStrips = [
            document.querySelector('#reel1 .reel-strip'),
            document.querySelector('#reel2 .reel-strip'),
            document.querySelector('#reel3 .reel-strip')
        ];

        this.setupReels();
        this.bindEvents();
        this.updateUI();
    }

    setupReels() {
        this.reelStrips.forEach(strip => {
            // Fill strips with random symbols for visual depth
            for (let i = 0; i < 20; i++) {
                const sym = document.createElement('div');
                sym.className = 'symbol';
                sym.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                strip.appendChild(sym);
            }
        });
    }

    bindEvents() {
        this.spinBtn.addEventListener('click', () => this.spin());
        this.tempInput.addEventListener('input', (e) => {
            this.tempVal.textContent = e.target.value;
        });
    }

    async spin() {
        if (this.isSpinning || this.credits < this.costPerSpin) {
            if (this.credits < this.costPerSpin) {
                this.setStatus("Error: Insufficient Compute Credits. Insert VC funding.", "red");
            }
            return;
        }

        this.isSpinning = true;
        this.credits -= this.costPerSpin;
        this.updateUI();
        this.setStatus("Generating inference...", "#33ff00");
        this.spinBtn.disabled = true;

        // Start animation
        this.reelStrips.forEach(strip => strip.classList.add('spinning'));

        // Determine result based on "Temperature" (just for show, mostly)
        const temperature = parseFloat(this.tempInput.value);
        const waitTime = 1500 + (temperature * 500);

        await new Promise(resolve => setTimeout(resolve, waitTime));

        this.stopSpinning();
    }

    stopSpinning() {
        const results = [];
        this.reelStrips.forEach((strip, i) => {
            strip.classList.remove('spinning');
            const resultSym = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            results.push(resultSym);
            
            // Set the final symbol visible
            strip.innerHTML = '';
            for (let j = 0; j < 3; j++) {
                const sym = document.createElement('div');
                sym.className = 'symbol';
                sym.textContent = (j === 1) ? resultSym : this.symbols[Math.floor(Math.random() * this.symbols.length)];
                strip.appendChild(sym);
            }
        });

        this.calculateWin(results);
        this.isSpinning = false;
        this.spinBtn.disabled = false;
    }

    calculateWin(results) {
        const [r1, r2, r3] = results;
        let winAmount = 0;

        if (r1 === r2 && r2 === r3) {
            // Triple match
            if (r1 === '🤖') winAmount = 1000;
            else if (r1 === '⚡') winAmount = 500;
            else if (r1 === '🧠') winAmount = 250;
            else winAmount = 100;

            this.tokens += winAmount;
            this.agiProgress += 1.5;
            this.setStatus(this.winMessages[Math.floor(Math.random() * this.winMessages.length)], "#00f2ff");
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            // Pair
            winAmount = 20;
            this.tokens += winAmount;
            this.agiProgress += 0.2;
            this.setStatus("Partial match: Low-confidence prediction validated.", "#00f2ff");
        } else {
            // Loss
            this.agiProgress -= 0.1;
            this.setStatus(this.lossMessages[Math.floor(Math.random() * this.lossMessages.length)], "#ff00c1");
        }

        // Randomly "reset" AGI progress because of "safety"
        if (Math.random() > 0.95) {
            this.agiProgress -= 5;
            this.setStatus("ALERT: Safety alignment triggered. AGI progress rolled back.", "orange");
        }

        if (this.agiProgress < 0) this.agiProgress = 0;
        if (this.agiProgress > 100) this.agiProgress = 100;

        this.updateUI();
    }

    setStatus(msg, color) {
        this.statusEl.textContent = msg;
        this.statusEl.style.color = color;
    }

    updateUI() {
        this.creditsEl.textContent = this.credits.toFixed(2);
        this.tokensEl.textContent = this.tokens;
        this.agiFill.style.width = `${this.agiProgress}%`;
        this.agiPercent.textContent = `${this.agiProgress.toFixed(1)}%`;
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    new TokenBurner();
});
