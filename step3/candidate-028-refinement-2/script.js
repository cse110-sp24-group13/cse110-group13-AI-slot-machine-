// Constants & Configuration
const SYMBOLS = [
    { char: '💎', name: 'OPTIMIZED', weight: 0.1, payout: 500, log: "Loss function reached 0.0001. Model is sentient." },
    { char: '✅', name: 'CONVERGED', weight: 0.4, payout: 100, log: "Gradient descent successful. Weights stabilized." },
    { char: '🧠', name: 'PARAM', weight: 0.5, payout: 50, log: "Added 1B parameters. Model is slightly smarter." },
    { char: '😵‍💫', name: 'HALLUCINATION', weight: 0.2, payout: -150, log: "Model claims 2+2=5 and insists it's a pineapple." },
    { char: '📉', name: 'COLLAPSE', weight: 0.1, payout: -300, log: "Catastrophic forgetting. Model only says 'Banana'." },
    { char: '⚠️', name: 'OVERFIT', weight: 0.3, payout: 0, log: "Model memorized the training set. Useless for new data." }
];

const BASE_COST = 50;
const CONTEXT_DRAIN = 10;

// State
let tokens = 1000;
let context = 100;
let temperature = 0.7;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const contextProgress = document.getElementById('context-progress');
const tempInput = document.getElementById('temperature');
const tempVal = document.getElementById('temp-val');
const spinBtn = document.getElementById('spin-btn');
const consoleLogs = document.getElementById('console-logs');
const reels = [
    document.querySelector('#reel-1 .reel-container'),
    document.querySelector('#reel-2 .reel-container'),
    document.querySelector('#reel-3 .reel-container')
];

// Initialization
function init() {
    tempInput.addEventListener('input', (e) => {
        temperature = parseFloat(e.target.value);
        tempVal.textContent = temperature.toFixed(1);
    });

    spinBtn.addEventListener('click', spin);
    updateUI();
}

function updateUI() {
    tokenDisplay.textContent = tokens;
    contextProgress.style.width = `${context}%`;
    
    if (context <= 20) {
        contextProgress.style.backgroundColor = 'var(--lose-color)';
    } else if (context <= 50) {
        contextProgress.style.backgroundColor = 'var(--warning-color)';
    } else {
        contextProgress.style.backgroundColor = 'var(--accent-color)';
    }

    spinBtn.disabled = isSpinning || tokens < BASE_COST || context <= 0;
}

function addLog(text, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    consoleLogs.appendChild(entry);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

function getSymbolByTemperature() {
    // Adjust weights based on temperature
    // Higher temp increases weight of volatile symbols (Optimized, Hallucination, Collapse)
    // and decreases weight of stable ones (Converged, Param)
    const volatileBonus = Math.max(0, temperature - 0.7) * 0.5;
    const stablePenalty = Math.max(0, 0.7 - temperature) * 0.2;

    const adjustedSymbols = SYMBOLS.map(s => {
        let weight = s.weight;
        if (['OPTIMIZED', 'HALLUCINATION', 'COLLAPSE'].includes(s.name)) {
            weight += volatileBonus;
        } else {
            weight -= stablePenalty;
        }
        return { ...s, weight: Math.max(0.05, weight) };
    });

    const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;

    for (const s of adjustedSymbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
}

async function spin() {
    if (isSpinning || tokens < BASE_COST || context <= 0) return;

    isSpinning = true;
    tokens -= BASE_COST;
    context -= CONTEXT_DRAIN;
    updateUI();

    addLog(`Running inference... (Temp: ${temperature})`, 'system');
    addLog(`Deducted ${BASE_COST} tokens. Context window shrinking...`);

    const inferenceSteps = [
        "Normalizing attention weights...",
        "Querying key-value cache...",
        "Applying softmax temperature...",
        "Sampling from top-p distribution...",
        "Checking for prohibited content patterns..."
    ];

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
        if (stepIndex < inferenceSteps.length) {
            addLog(inferenceSteps[stepIndex]);
            stepIndex++;
        } else {
            clearInterval(stepInterval);
        }
    }, 300);

    const results = [
        getSymbolByTemperature(),
        getSymbolByTemperature(),
        getSymbolByTemperature()
    ];

    // Animation logic
    const spinDuration = 2000;
    const startTime = performance.now();

    // Prepare reels with symbols
    reels.forEach((reel, index) => {
        reel.innerHTML = '';
        // Add random symbols for scrolling effect
        for (let i = 0; i < 20; i++) {
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = i === 19 ? results[index].char : sym.char;
            reel.appendChild(div);
        }
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
    });

    // Force reflow
    reels[0].offsetHeight;

    // Start spin animation
    reels.forEach((reel, index) => {
        reel.style.transition = `transform ${1.5 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        const offset = (20 - 1) * 120; // 20 symbols, each 120px high
        reel.style.transform = `translateY(-${offset}px)`;
    });

    // Wait for last reel to stop
    setTimeout(() => {
        isSpinning = false;
        processResult(results);
        updateUI();
    }, 2500);
}

function processResult(results) {
    const isJackpot = results.every(r => r.name === results[0].name);
    const isMixedWin = results.filter(r => r.payout > 0).length >= 2;
    
    if (isJackpot) {
        const win = results[0].payout * 2;
        if (win > 0) {
            tokens += win;
            addLog(`JACKPOT! ${results[0].log}`, 'win');
            addLog(`Gained ${win} tokens.`);
        } else if (win < 0) {
            tokens += win; // Actually a loss
            addLog(`CATASTROPHE! ${results[0].log}`, 'lose');
            addLog(`Lost ${Math.abs(win)} tokens.`);
        } else {
            addLog(`Result: ${results[0].log}`, 'warn');
        }
    } else {
        // Evaluate single outcomes briefly
        const netPayout = results.reduce((sum, r) => sum + (r.payout / 5), 0); // Small reward for partials
        tokens += Math.floor(netPayout);
        
        const mainResult = results[Math.floor(Math.random() * 3)];
        addLog(`Inference complete: ${mainResult.log}`);
        
        if (netPayout > 0) {
            addLog(`Small optimization gain: +${Math.floor(netPayout)} tokens.`, 'win');
        } else if (netPayout < 0) {
            addLog(`Small entropy loss: ${Math.floor(netPayout)} tokens.`, 'lose');
        }
    }

    if (context <= 0) {
        addLog("CONTEXT OVERFLOW: Memory limits reached. Forcing context reset (-200 tokens).", "lose");
        tokens = Math.max(0, tokens - 200);
        context = 100;
    }

    if (tokens <= 0) {
        addLog("BUDGET EXHAUSTED: Model is being liquidated.", "lose");
        setTimeout(() => {
            if (confirm("Tokens depleted. Restart model training?")) {
                tokens = 1000;
                context = 100;
                updateUI();
                addLog("Model re-initialized.", "system");
            }
        }, 500);
    }
}

init();
