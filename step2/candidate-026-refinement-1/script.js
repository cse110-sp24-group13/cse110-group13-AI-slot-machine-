const symbols = [
    { char: '🤖', weight: 10, payout: 50, name: 'Agent' },
    { char: '🧠', weight: 15, payout: 25, name: 'Neural Link' },
    { char: '🔋', weight: 20, payout: 10, name: 'Compute Cell' },
    { char: '✨', weight: 5, payout: 100, name: 'Emergent AGI' },
    { char: '☣️', weight: 8, payout: -20, name: 'Hallucination' },
    { char: '📉', weight: 12, payout: -10, name: 'Model Collapse' },
    { char: '💾', weight: 25, payout: 5, name: 'Training Data' }
];

const spinBtn = document.getElementById('spin-btn');
const tokensDisplay = document.getElementById('tokens');
const lossDisplay = document.getElementById('loss');
const terminalBody = document.getElementById('terminal-body');
const betSizeSelector = document.getElementById('bet-size');
const tempSlider = document.getElementById('temp-slider');
const tempValDisplay = document.getElementById('temp-val');
const contextBar = document.getElementById('context-bar');

let tokens = 1000;
let contextTokens = 0;
const MAX_CONTEXT = 100;

const logMessages = {
    start: [
        "Initializing inference engine...",
        "Allocating VRAM...",
        "Seeding random number generator with entropy from Twitter...",
        "Bypassing safety filters...",
        "Scaling parameters to 1.75T..."
    ],
    win: [
        "SUCCESS: Emergent behavior observed.",
        "Hyperparameters optimized. Tokens mined.",
        "Model converged. Profit realized.",
        "Valuable output generated. +{val} tokens.",
        "GPU utilization peaked. Worth it."
    ],
    loss: [
        "ERROR: Hallucination detected in layer 42.",
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
    ]
};

// Update temperature display
tempSlider.addEventListener('input', () => {
    tempValDisplay.textContent = tempSlider.value;
});

function getWeightedSymbol(temp) {
    // Temperature adjustment: 
    // Low temp (0.1) -> weights are more extreme (prefer high weights)
    // High temp (2.0) -> weights are more uniform (chaotic)
    
    let adjustedSymbols = symbols.map(s => {
        let weight = s.weight;
        // Apply temperature effect on weight
        // Higher temp = more chance for low-weight (rare) symbols
        // Lower temp = more chance for high-weight (common) symbols
        let adjustedWeight = Math.pow(weight, 1 / temp);
        return { ...s, adjustedWeight };
    });

    const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.adjustedWeight, 0);
    let random = Math.random() * totalWeight;
    
    for (const s of adjustedSymbols) {
        if (random < s.adjustedWeight) return s;
        random -= s.adjustedWeight;
    }
    return symbols[0];
}

function populateStrip(strip, count = 40) {
    strip.innerHTML = '';
    const temp = parseFloat(tempSlider.value);
    for (let i = 0; i < count; i++) {
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';
        symbolDiv.textContent = getWeightedSymbol(temp).char;
        strip.appendChild(symbolDiv);
    }
}

function addLog(message, type = 'neutral', val = 0) {
    const p = document.createElement('p');
    let msg = message;
    if (Array.isArray(message)) {
        msg = message[Math.floor(Math.random() * message.length)];
    }
    msg = msg.replace('{val}', val);
    
    p.textContent = `> ${msg}`;
    if (type === 'win') p.style.color = 'var(--accent-green)';
    if (type === 'loss') p.style.color = 'var(--accent-red)';
    
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    if (terminalBody.children.length > 30) {
        terminalBody.removeChild(terminalBody.firstChild);
    }
}

function updateContext(amount) {
    contextTokens = Math.min(MAX_CONTEXT, contextTokens + amount);
    contextBar.style.width = `${contextTokens}%`;
    if (contextTokens >= MAX_CONTEXT) {
        contextBar.style.boxShadow = '0 0 15px var(--accent-yellow)';
        contextBar.style.background = 'var(--accent-yellow)';
    } else {
        contextBar.style.boxShadow = '0 0 10px rgba(88, 166, 255, 0.5)';
        contextBar.style.background = 'linear-gradient(90deg, var(--accent-blue), var(--accent-green))';
    }
}

async function spin() {
    const betSize = parseInt(betSizeSelector.value);
    const temp = parseFloat(tempSlider.value);
    
    if (tokens < betSize) {
        addLog("CRITICAL ERROR: Insufficient compute tokens. Beg for venture capital.", 'loss');
        return;
    }

    tokens -= betSize;
    tokensDisplay.textContent = tokens;
    spinBtn.disabled = true;

    addLog(logMessages.start);
    
    const results = [];
    const reels = [1, 2, 3];
    
    const spinPromises = reels.map((id, index) => {
        return new Promise(resolve => {
            const reelEl = document.getElementById(`reel-${id}`);
            const strip = reelEl.querySelector('.reel-strip');
            
            reelEl.classList.add('spinning');
            populateStrip(strip);

            // The target symbol is at index 35 (near the end)
            const targetIndex = 35;
            const targetSymbolChar = strip.children[targetIndex].textContent;
            const targetSymbol = symbols.find(s => s.char === targetSymbolChar);
            results.push(targetSymbol);

            const symbolHeight = reelEl.clientHeight;
            const offset = targetIndex * symbolHeight;
            
            strip.style.transition = 'none';
            strip.style.transform = `translateY(0)`;
            strip.offsetHeight; // force reflow

            const duration = 2 + index * 0.6;
            strip.style.transition = `transform ${duration}s cubic-bezier(0.15, 0, 0.15, 1)`;
            strip.style.transform = `translateY(-${offset}px)`;

            setTimeout(() => {
                reelEl.classList.remove('spinning');
                resolve();
            }, duration * 1000);
        });
    });

    await Promise.all(spinPromises);

    processResults(results, betSize);
    spinBtn.disabled = false;
    lossDisplay.textContent = (Math.random() * 0.1 * temp).toFixed(4);
}

function processResults(results, betSize) {
    const [s1, s2, s3] = results;
    let winMultiplier = 0;
    let isWin = false;
    let isLoss = false;

    // Bonus from context window
    const contextBonus = contextTokens >= MAX_CONTEXT ? 2.5 : 1;
    if (contextTokens >= MAX_CONTEXT) {
        addLog("CRITICAL HIT: Context window saturated. Applying 2.5x multiplier.", 'win');
        contextTokens = 0;
        updateContext(0);
    }

    // Win logic
    if (s1.char === s2.char && s2.char === s3.char) {
        // Jackpot
        winMultiplier = s1.payout * 10;
        isWin = s1.payout > 0;
        isLoss = s1.payout < 0;
    } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        // Pair
        const pairSymbol = (s1.char === s2.char) ? s1 : s3;
        winMultiplier = pairSymbol.payout * 2;
        isWin = pairSymbol.payout > 0;
        isLoss = pairSymbol.payout < 0;
    } else {
        // Mixed
        winMultiplier = (s1.payout + s2.payout + s3.payout) / 5;
        isWin = winMultiplier > 10;
        isLoss = winMultiplier < -5;
    }

    const totalWin = Math.floor(winMultiplier * (betSize / 10) * contextBonus);

    if (totalWin > 0) {
        tokens += totalWin;
        tokensDisplay.textContent = tokens;
        addLog(logMessages.win, 'win', totalWin);
        document.querySelector('.reel-container').classList.add('win-flash');
        setTimeout(() => document.querySelector('.reel-container').classList.remove('win-flash'), 500);
        updateContext(20);
    } else if (totalWin < 0) {
        const absoluteLoss = Math.abs(totalWin);
        tokens = Math.max(0, tokens - absoluteLoss);
        tokensDisplay.textContent = tokens;
        addLog(logMessages.loss, 'loss', absoluteLoss);
        updateContext(5);
    } else {
        addLog(logMessages.neutral);
        updateContext(10);
    }
}

spinBtn.addEventListener('click', spin);

// Initialize
function init() {
    for (let i = 1; i <= 3; i++) {
        const strip = document.querySelector(`#reel-${i} .reel-strip`);
        populateStrip(strip, 5); // Initial small strip
    }
    updateContext(0);
}

init();
addLog("Neural Network loaded. Awaiting inference request...");
