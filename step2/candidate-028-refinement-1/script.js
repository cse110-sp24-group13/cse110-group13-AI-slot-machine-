const SYMBOLS = [
    { char: '💎', name: 'A100_GPU', weight: 5, payout: 100 },
    { char: '🚀', name: 'SOTA_PAPER', weight: 8, payout: 50 },
    { char: '🧠', name: 'NEURAL_WEIGHTS', weight: 15, payout: 20 },
    { char: '📦', name: 'DATAFRAME', weight: 20, payout: 10 },
    { char: '🧪', name: 'VALIDATION_SET', weight: 25, payout: 5 },
    { char: '📉', name: 'GRADIENT_DESCENT', weight: 30, payout: 2 },
    { char: '⚠️', name: 'HALLUCINATION', weight: 15, payout: 0 }
];

const LOG_MESSAGES = [
    "Injecting noise into latent space...",
    "Re-ranking candidate tokens...",
    "Adjusting attention masks...",
    "Dropping out redundant neurons...",
    "Quantizing model weights to 4-bit...",
    "Sampling from the top-p distribution...",
    "Calculating perplexity scores...",
    "Overfitting to the training set...",
    "Detecting catastrophic forgetting...",
    "Initializing random seed..."
];

let balance = 1000;
let contextTokens = 4096;
let isSpinning = false;
let temperature = 0.7;

const balanceEl = document.getElementById('balance');
const contextEl = document.getElementById('context-tokens');
const lossEl = document.getElementById('loss');
const betInput = document.getElementById('bet');
const tempInput = document.getElementById('temperature');
const tempValueEl = document.getElementById('temp-value');
const spinBtn = document.getElementById('spin-btn');
const clearContextBtn = document.getElementById('clear-context-btn');
const logsEl = document.getElementById('logs');
const resetBtn = document.getElementById('reset-btn');

const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

// Initialize reels with random symbols
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        const symbol = getRandomSymbol();
        const el = createSymbolEl(symbol);
        reel.appendChild(el);
    });
}

function createSymbolEl(symbol) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = symbol.char;
    div.dataset.name = symbol.name;
    return div;
}

function getRandomSymbol() {
    // Temperature adjustment logic:
    // Low temperature (0.1) -> weights for common symbols are amplified.
    // High temperature (2.0) -> weights are more uniform, rarer symbols become more likely but so do bad ones.
    
    const adjustedSymbols = SYMBOLS.map(s => {
        let weight = s.weight;
        if (temperature < 1.0) {
            // Favor more common symbols (higher original weight)
            if (s.weight > 20) weight *= (1 / temperature);
            else weight *= temperature;
        } else if (temperature > 1.0) {
            // Flatten distribution, make rare symbols more likely but also hallucinations
            if (s.weight < 15) weight *= temperature;
            if (s.name === 'HALLUCINATION') weight *= (temperature * 1.5);
        }
        return { ...s, adjustedWeight: weight };
    });

    const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.adjustedWeight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of adjustedSymbols) {
        if (random < symbol.adjustedWeight) return symbol;
        random -= symbol.adjustedWeight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

function addLog(message, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Array(8).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    entry.textContent = `[0x${timestamp}] > ${message}`;
    logsEl.prepend(entry);
    
    if (logsEl.children.length > 30) {
        logsEl.removeChild(logsEl.lastChild);
    }
}

async function spin() {
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) {
        addLog("CRITICAL: INVALID_BATCH_SIZE", "loss");
        return;
    }
    if (bet > balance) {
        addLog("ERROR: INSUFFICIENT_COMPUTE_CREDITS", "loss");
        return;
    }
    if (contextTokens < bet * 5) {
        addLog("WARNING: CONTEXT_WINDOW_EXHAUSTED. Please flush cache.", "loss");
        return;
    }

    isSpinning = true;
    setControlsEnabled(false);
    
    balance -= bet;
    // Context tokens decrease per spin
    const contextCost = Math.floor(bet * (1.5 + temperature));
    contextTokens = Math.max(0, contextTokens - contextCost);
    
    updateUI();
    addLog(`Running inference... Temp: ${temperature}, Cost: ${bet} tokens, Context: -${contextCost}`);

    const spinDuration = 2000;
    const results = [];

    reels.forEach((reel, index) => {
        const strip = document.createElement('div');
        strip.className = 'reel-strip';
        strip.style.display = 'flex';
        strip.style.flexDirection = 'column';
        
        // Add current symbol
        const currentSymbol = reel.children[0].textContent;
        strip.appendChild(createSymbolEl(SYMBOLS.find(s => s.char === currentSymbol) || SYMBOLS[0]));

        // Add filler symbols
        const numFiller = 30 + (index * 10);
        for (let i = 0; i < numFiller; i++) {
            strip.appendChild(createSymbolEl(getRandomSymbol()));
        }

        // Add target symbol
        const targetSym = getRandomSymbol();
        results.push(targetSym);
        strip.appendChild(createSymbolEl(targetSym));

        reel.innerHTML = '';
        reel.appendChild(strip);

        const symbolHeight = 130;
        const targetY = -(strip.children.length - 1) * symbolHeight;

        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        reel.offsetHeight; // force reflow

        reel.style.transition = `transform ${spinDuration + (index * 400)}ms cubic-bezier(0.15, 0, 0.15, 1)`;
        reel.style.transform = `translateY(${targetY}px)`;
    });

    const logInterval = setInterval(() => {
        addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
    }, 400);

    setTimeout(() => {
        clearInterval(logInterval);
        isSpinning = false;
        setControlsEnabled(true);
        
        reels.forEach((reel, i) => {
            const finalSymbol = results[i];
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';
            reel.innerHTML = '';
            reel.appendChild(createSymbolEl(finalSymbol));
        });

        calculateWin(results, bet);
    }, spinDuration + 1200);
}

function calculateWin(results, bet) {
    const s1 = results[0].char;
    const s2 = results[1].char;
    const s3 = results[2].char;

    let winAmount = 0;
    let winMessage = "";
    
    // Check for "Hallucination" - any hallucination symbol cancels the win or causes extra loss
    const hallucinations = results.filter(r => r.name === 'HALLUCINATION').length;

    if (hallucinations > 0) {
        addLog(`HALLUCINATION_DETECTED: Model output incoherent. Lost ${bet} extra tokens.`, "loss");
        balance = Math.max(0, balance - bet);
        lossEl.textContent = (0.8 + Math.random() * 0.2).toFixed(4);
    } else if (s1 === s2 && s2 === s3) {
        const symbol = SYMBOLS.find(s => s.char === s1);
        winAmount = bet * symbol.payout;
        winMessage = `SUPERVISED_SUCCESS! ${symbol.name} converged. +${winAmount} tokens.`;
        lossEl.textContent = (Math.random() * 0.001).toFixed(4);
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        const matchChar = (s1 === s2) ? s1 : (s2 === s3 ? s2 : s1);
        const symbol = SYMBOLS.find(s => s.char === matchChar);
        winAmount = Math.floor(bet * (symbol.payout / 5));
        if (winAmount > 0) {
            winMessage = `PARTIAL_CONVERGENCE. +${winAmount} tokens.`;
            lossEl.textContent = (Math.random() * 0.05).toFixed(4);
        } else {
            winMessage = "WEAK_SIGNAL. Loss function stable.";
            lossEl.textContent = (0.1 + Math.random() * 0.2).toFixed(4);
        }
    } else {
        winMessage = "EPOCH_FAILED: No patterns recognized.";
        lossEl.textContent = (0.4 + Math.random() * 0.3).toFixed(4);
    }

    if (winAmount > 0) {
        balance += winAmount;
        addLog(winMessage, "win");
        // Reward some context for winning
        contextTokens = Math.min(4096, contextTokens + Math.floor(winAmount / 10));
    } else if (hallucinations === 0) {
        addLog(winMessage, "loss");
    }

    updateUI();

    if (balance <= 0) {
        addLog("FATAL: COMPUTE_BUDGET_EXCEEDED. Requesting emergency grant...", "loss");
        resetBtn.style.display = 'inline-block';
        setControlsEnabled(false);
    }
}

function updateUI() {
    balanceEl.textContent = balance;
    contextEl.textContent = contextTokens;
    const contextPercent = (contextTokens / 4096) * 100;
    contextEl.style.color = contextPercent < 20 ? 'var(--error-color)' : 'var(--accent-color)';
}

function setControlsEnabled(enabled) {
    spinBtn.disabled = !enabled;
    clearContextBtn.disabled = !enabled;
    betInput.disabled = !enabled;
    tempInput.disabled = !enabled;
}

tempInput.addEventListener('input', (e) => {
    temperature = parseFloat(e.target.value);
    tempValueEl.textContent = temperature.toFixed(1);
});

spinBtn.addEventListener('click', spin);

clearContextBtn.addEventListener('click', () => {
    if (balance >= 50) {
        balance -= 50;
        contextTokens = 4096;
        updateUI();
        addLog("FLUSHING_KV_CACHE... Context window cleared. -50 tokens.", "win");
    } else {
        addLog("INSUFFICIENT_TOKENS_FOR_CACHE_FLUSH", "loss");
    }
});

resetBtn.addEventListener('click', () => {
    balance = 1000;
    contextTokens = 4096;
    updateUI();
    addLog("SYSTEM_REBOOT_SUCCESSFUL. Memory wiped. New grant issued.");
    resetBtn.style.display = 'none';
    setControlsEnabled(true);
    initReels();
});

initReels();
updateUI();
