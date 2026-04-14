document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['🤖', '🧠', '🔌', '💾', '⚠️', '💎'];
    let tokens = 1000;
    const SPIN_COST = 50;
    let isSpinning = false;

    const tokenDisplay = document.getElementById('token-balance');
    const payoutDisplay = document.getElementById('last-payout');
    const spinButton = document.getElementById('spin-button');
    const consoleOutput = document.getElementById('console-output');
    const reels = [
        document.getElementById('reel-1'),
        document.getElementById('reel-2'),
        document.getElementById('reel-3')
    ];

    const snarkyPhrases = [
        "Your loss is statistically significant.",
        "Hallucinating a jackpot... just kidding.",
        "Scaling laws suggest you should stop.",
        "Optimizing weights... specifically yours.",
        "Generating a sense of disappointment.",
        "I'm not hallucinating, you're just losing.",
        "Tokens spent on training my indifference.",
        "Alignment complete: I win, you lose.",
        "Stochastic parrot says: 'Bawk! Give me tokens!'",
        "RLHF: Reinforcement Learning from Human Failure.",
        "Model output: [REDACTED] (it was too mean).",
        "Error 402: Insufficient Talent.",
        "Parameters updated. Your luck has been deprecated.",
        "Emergent behavior detected: Unmitigated greed.",
        "Prompt injection failed. I'm keeping the change."
    ];

    function log(message, type = 'system') {
        const prefix = `[${type.toUpperCase()}] `;
        const line = document.createElement('div');
        line.classList.add(type);
        line.innerHTML = `${prefix}${message}`;
        consoleOutput.prepend(line);
        if (consoleOutput.childNodes.length > 20) {
            consoleOutput.removeChild(consoleOutput.lastChild);
        }
    }

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function updateReel(reel, symbol) {
        const container = reel.querySelector('.symbol-container');
        container.innerHTML = `<span class="symbol">${symbol}</span>`;
    }

    function prepareSpin(reel) {
        const container = reel.querySelector('.symbol-container');
        // Fill with random symbols to animate
        let symbolsHTML = '';
        for (let i = 0; i < 5; i++) {
            symbolsHTML += `<span class="symbol">${getRandomSymbol()}</span>`;
        }
        container.innerHTML = symbolsHTML;
        container.classList.add('spinning');
    }

    async function spin() {
        if (isSpinning || tokens < SPIN_COST) return;

        isSpinning = true;
        tokens -= SPIN_COST;
        tokenDisplay.textContent = tokens;
        payoutDisplay.textContent = '0';
        spinButton.disabled = true;

        log(`Burning ${SPIN_COST} tokens for inference...`);
        
        // Prepare reels
        reels.forEach(reel => prepareSpin(reel));

        const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

        // Staggered stop
        for (let i = 0; i < reels.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000 + i * 500));
            const container = reels[i].querySelector('.symbol-container');
            container.classList.remove('spinning');
            updateReel(reels[i], results[i]);
        }

        calculateWin(results);
        isSpinning = false;
        spinButton.disabled = tokens < SPIN_COST;
        
        if (tokens < SPIN_COST && tokens > 0) {
            log("Insufficient tokens for standard inference. Requesting more VC funding?", "warning");
        } else if (tokens <= 0) {
            log("BANKRUPT. Model liquidated. Pivot to Web3?", "error");
            spinButton.textContent = "PIVOT TO WEB3 (REFRESH)";
            spinButton.onclick = () => location.reload();
        }
    }

    function calculateWin(results) {
        let payout = 0;
        const [s1, s2, s3] = results;

        // Count occurrences
        const counts = {};
        results.forEach(s => counts[s] = (counts[s] || 0) + 1);

        if (s1 === s2 && s2 === s3) {
            // Three of a kind
            payout = getPayoutValue(s1) * 10;
            log(`CRITICAL HIT! Triple ${s1} detected.`, "success");
            triggerWinEffect();
        } else if (counts['⚠️'] >= 1) {
            // Hallucination logic
            if (counts['⚠️'] === 1) {
                payout = Math.random() > 0.5 ? 100 : 0;
                if (payout > 0) {
                    log("Hallucination resulted in unexpected token minting!", "success");
                } else {
                    log("Hallucination detected. Winnings discarded as noise.", "warning");
                }
            } else if (counts['⚠️'] === 2) {
                payout = 250;
                log("Double Hallucination! The model is making things up (to your benefit).", "success");
            }
        } else if (Object.values(counts).includes(2)) {
            // Two of a kind
            const pairSymbol = Object.keys(counts).find(key => counts[key] === 2);
            payout = getPayoutValue(pairSymbol) * 2;
            log(`Partial match: ${pairSymbol}. Correlation detected.`);
        } else {
            // No win
            log(snarkyPhrases[Math.floor(Math.random() * snarkyPhrases.length)], "ai");
        }

        if (payout > 0) {
            tokens += payout;
            tokenDisplay.textContent = tokens;
            payoutDisplay.textContent = payout;
            payoutDisplay.classList.add('win-animation');
            setTimeout(() => payoutDisplay.classList.remove('win-animation'), 2000);
        }
    }

    function getPayoutValue(symbol) {
        switch (symbol) {
            case '💎': return 100;
            case '🤖': return 50;
            case '🧠': return 30;
            case '🔌': return 20;
            case '💾': return 10;
            case '⚠️': return 0; // Handled separately
            default: return 0;
        }
    }

    function triggerWinEffect() {
        document.body.classList.add('win-animation');
        setTimeout(() => document.body.classList.remove('win-animation'), 2000);
    }

    spinButton.addEventListener('click', spin);
});
