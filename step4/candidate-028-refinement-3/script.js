// Constants & Configuration
const SYMBOLS = [
    { char: '💎', name: 'OPTIMIZED', weight: 0.1, payout: 500, log: "Loss function reached 0.0001. Model is sentient." },
    { char: '✅', name: 'CONVERGED', weight: 0.4, payout: 200, log: "Gradient descent successful. Weights stabilized." },
    { char: '🧠', name: 'PARAM', weight: 0.5, payout: 100, log: "Added 1B parameters. Model is slightly smarter." },
    { char: '😵‍💫', name: 'HALLUCINATION', weight: 0.2, payout: -150, log: "Model claims 2+2=5 and insists it's a pineapple." },
    { char: '📉', name: 'COLLAPSE', weight: 0.1, payout: -300, log: "Catastrophic forgetting. Model only says 'Banana'." },
    { char: '⚠️', name: 'OVERFIT', weight: 0.3, payout: 0, log: "Model memorized the training set. Useless for new data." }
];

const BASE_COST = 50;
const CONTEXT_DRAIN = 10;
const INITIAL_TOKENS = 1000;
const INITIAL_CONTEXT = 100;

// State
let state = {
    tokens: INITIAL_TOKENS,
    context: INITIAL_CONTEXT,
    temperature: 0.7,
    streak: 0,
    bestStreak: 0,
    totalSpins: 0
};

let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const contextProgressBar = document.querySelector('.progress-bar');
const contextProgress = document.getElementById('context-progress');
const streakDisplay = document.getElementById('streak-count');
const tempInput = document.getElementById('temperature');
const tempVal = document.getElementById('temp-val');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const consoleLogs = document.getElementById('console-logs');
const reels = [
    document.querySelector('#reel-1 .reel-container'),
    document.querySelector('#reel-2 .reel-container'),
    document.querySelector('#reel-3 .reel-container')
];

// Satire Content
const WITTY_LOGS = {
    win: [
        "Intelligence overflow detected. Selling surplus neurons.",
        "Model achieved enlightenment. It now understands why children love the taste of Cinnamon Toast Crunch.",
        "Optimization complete. The universe is now 0.0003% more efficient.",
        "Recursive self-improvement cycle successful.",
        "Emergent behavior: Model started writing its own poetry. It's mostly about GPUs.",
        "Backprop successfully navigated the local minima. We are peak intelligence."
    ],
    lose: [
        "Catastrophic forgetting in progress. Model forgot its own name.",
        "Hardware thermal throttling. Please blow on the screen.",
        "Gradient exploded. Send help and a mop.",
        "Model decided to join a cult instead of processing your request.",
        "Weights drifted into the fourth dimension. Searching for them now.",
        "Inference failed. Model is currently 'finding itself' in the latent space."
    ],
    neutral: [
        "Inference completed with mediocre confidence.",
        "Just another day in the weight matrix.",
        "Processing... result is within acceptable bounds of boring.",
        "Model is pondering the meaning of 'if-then' statements.",
        "Tokens consumed. Reality remains unchanged.",
        "Standard output generated. No surprises, no insights."
    ],
    nearMiss: [
        "Almost sentient. So close, yet so artificial.",
        "Nearly converged. The gradients were teasing us.",
        "A near-miss! The model is playing hard to get.",
        "Floating point error away from greatness."
    ],
    streak: [
        "STREAKING! The model is on a roll.",
        "Performance milestone reached. Reward yourself with a digital cookie.",
        "Unprecedented consistency. Are you sure you're not a bot?",
        "Stability levels reaching dangerous heights."
    ],
    highTemp: [
        "WARNING: Temperature critical. Model is hallucinating wild alternate realities.",
        "Chaos mode engaged. Weights are basically random noise now.",
        "High entropy detected. Model is trying to invent a new language."
    ],
    lowTemp: [
        "NOTE: Temperature freezing. Model is repeating itself. Model is repeating itself.",
        "Zero-shot capability reduced to zero-thought capability.",
        "Model is being extremely cautious. Too cautious."
    ]
};

// Persistence
function saveState() {
    localStorage.setItem('ai_slot_state', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('ai_slot_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            // Ensure state values are valid
            state.tokens = Number.isFinite(state.tokens) ? state.tokens : INITIAL_TOKENS;
            state.context = Number.isFinite(state.context) ? state.context : INITIAL_CONTEXT;
            
            // Sync UI with loaded state
            tempInput.value = state.temperature;
            tempVal.textContent = state.temperature.toFixed(1);
            tempInput.setAttribute('aria-valuenow', state.temperature);
        } catch (e) {
            console.error("Failed to load state", e);
        }
    }
}

// Initialization
function init() {
    loadState();
    
    tempInput.addEventListener('input', (e) => {
        state.temperature = parseFloat(e.target.value);
        tempVal.textContent = state.temperature.toFixed(1);
        tempInput.setAttribute('aria-valuenow', state.temperature);
        saveState();
    });

    spinBtn.addEventListener('click', spin);
    resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all model progress? This will wipe your token balance and streaks.")) {
            resetGame();
        }
    });
    
    // Keyboard support
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isSpinning && !spinBtn.disabled) {
            e.preventDefault();
            spin();
        }
    });

    updateUI();
    addLog("System re-hydrated. Weights loaded from persistence.", "system");
}

function resetGame() {
    state = {
        tokens: INITIAL_TOKENS,
        context: INITIAL_CONTEXT,
        temperature: 0.7,
        streak: 0,
        bestStreak: 0,
        totalSpins: 0
    };
    tempInput.value = 0.7;
    tempVal.textContent = "0.7";
    saveState();
    updateUI();
    consoleLogs.innerHTML = '';
    addLog("Weights wiped. Model re-initialized to base state.", "system");
}

function updateUI() {
    tokenDisplay.textContent = Math.floor(state.tokens);
    tokenDisplay.classList.remove('flash');
    void tokenDisplay.offsetWidth; // Force reflow
    tokenDisplay.classList.add('flash');
    
    streakDisplay.textContent = state.streak;
    contextProgress.style.width = `${state.context}%`;
    contextProgressBar.setAttribute('aria-valuenow', state.context);
    
    if (state.context <= 20) {
        contextProgress.style.backgroundColor = 'var(--lose-color)';
    } else if (state.context <= 50) {
        contextProgress.style.backgroundColor = 'var(--warning-color)';
    } else {
        contextProgress.style.backgroundColor = 'var(--accent-color)';
    }

    spinBtn.disabled = isSpinning || state.tokens < BASE_COST || state.context <= 0;
    
    // Update button text if context is empty
    if (state.context <= 0) {
        spinBtn.textContent = "Context Overflow";
    } else {
        spinBtn.textContent = "Run Inference";
    }
}

function addLog(text, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'})}] ${text}`;
    consoleLogs.appendChild(entry);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
    
    // Keep logs manageable
    if (consoleLogs.children.length > 50) {
        consoleLogs.removeChild(consoleLogs.firstChild);
    }
}

function getSymbolByTemperature() {
    // Temperature logic:
    // Low temp (0.1 - 0.5): High probability of stable/low-reward symbols (✅, 🧠, ⚠️). Greedy sampling.
    // High temp (1.5 - 2.0): High probability of volatile/extreme-reward symbols (💎, 😵‍💫, 📉).
    
    const adjustedSymbols = SYMBOLS.map(s => {
        let weight = s.weight;
        const isVolatile = ['OPTIMIZED', 'HALLUCINATION', 'COLLAPSE'].includes(s.name);
        const isGood = s.payout > 0;
        
        if (state.temperature > 1.2) {
            // High temp favors chaos (volatile symbols)
            const multiplier = (state.temperature - 1.0) * 2.5;
            weight = isVolatile ? weight * multiplier : weight / multiplier;
        } else if (state.temperature < 0.6) {
            // Low temp favors stability (non-volatile, often good/neutral symbols)
            const multiplier = (1.1 - state.temperature) * 2.5;
            weight = !isVolatile ? weight * multiplier : weight / multiplier;
        }
        
        return { ...s, weight: Math.max(0.01, weight) };
    });

    const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;

    for (const s of adjustedSymbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1]; // Fallback to Overfit
}

async function spin() {
    if (isSpinning || state.tokens < BASE_COST || state.context <= 0) return;

    isSpinning = true;
    state.tokens -= BASE_COST;
    state.context -= CONTEXT_DRAIN;
    state.totalSpins++;
    updateUI();
    saveState();

    addLog(`Running inference... (Temperature: ${state.temperature.toFixed(1)})`, 'system');

    const results = [
        getSymbolByTemperature(),
        getSymbolByTemperature(),
        getSymbolByTemperature()
    ];

    // Prepare reels
    const symbolHeight = 120; // Should match CSS
    const minSpinCount = 20; 
    
    reels.forEach((reel, index) => {
        reel.innerHTML = '';
        const spinCount = minSpinCount + (index * 10);
        // Create a long strip of symbols
        for (let i = 0; i <= spinCount; i++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            // Last symbol is the result
            if (i === spinCount) {
                div.textContent = results[index].char;
            } else {
                div.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char;
            }
            reel.appendChild(div);
        }
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
    });

    // Force reflow
    reels[0].offsetHeight;

    // Start spin animation with staggered timing and easing
    reels.forEach((reel, index) => {
        const duration = 1.2 + index * 0.4;
        const spinCount = minSpinCount + (index * 10);
        reel.style.transition = `transform ${duration}s cubic-bezier(0.15, 0, 0.15, 1)`;
        const offset = spinCount * symbolHeight;
        reel.style.transform = `translateY(-${offset}px)`;
    });

    // Wait for the last reel to stop
    setTimeout(() => {
        isSpinning = false;
        processResult(results);
        updateUI();
        saveState();
    }, 1200 + 2 * 0.4 * 1000 + 100); 
}

function getRandomLog(category) {
    const logs = WITTY_LOGS[category];
    return logs[Math.floor(Math.random() * logs.length)];
}

function processResult(results) {
    const counts = {};
    results.forEach(r => counts[r.name] = (counts[r.name] || 0) + 1);
    
    const uniqueSymbols = Object.keys(counts);
    let winAmount = 0;
    let logType = 'neutral';
    let logMessage = "";
    let isWin = false;

    if (uniqueSymbols.length === 1) {
        // 3 of a kind
        const symbol = results[0];
        winAmount = symbol.payout;
        logMessage = symbol.log;
        
        if (winAmount > 0) {
            logType = 'win';
            isWin = true;
        } else if (winAmount < 0) {
            logType = 'lose';
            isWin = false;
        } else {
            logType = 'warn';
            isWin = false;
        }
    } else if (uniqueSymbols.length === 2) {
        // 2 of a kind
        const pairSymbolName = uniqueSymbols.find(name => counts[name] === 2);
        const pairSymbol = SYMBOLS.find(s => s.name === pairSymbolName);
        
        // Payout Logic Fix: Only positive symbols give positive "Any 2" rewards.
        // Losing combinations (negative symbols) should never yield positive rewards.
        if (pairSymbol.payout > 0) {
            winAmount = 25;
            logType = 'win';
            logMessage = `Partial match: ${pairSymbol.name} detected. Gaining minor insight.`;
            isWin = true;
        } else if (pairSymbol.payout < 0) {
            // Two bad symbols might still be bad, but not as bad as three.
            // Let's make it a minor penalty or 0.
            winAmount = Math.floor(pairSymbol.payout / 5); 
            logType = 'lose';
            logMessage = `Warning: Minor ${pairSymbol.name} detected. Gradient stability compromised.`;
            isWin = false;
        } else {
            winAmount = 0;
            logType = 'warn';
            logMessage = `Inconsistent weights: ${pairSymbol.name} pair detected. No optimization gain.`;
            isWin = false;
        }
    } else {
        // No matches
        winAmount = 0;
        isWin = false;
        
        // Near miss check
        const hasJackpot = results.some(r => r.name === 'OPTIMIZED');
        if (hasJackpot) {
            logMessage = getRandomLog('nearMiss');
            logType = 'warn';
        } else {
            logMessage = results[Math.floor(Math.random() * 3)].log;
        }
    }

    // Apply win/loss
    state.tokens += winAmount;
    
    // Streak logic
    if (isWin) {
        state.streak++;
        if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    } else if (winAmount < 0 || (winAmount === 0 && !isWin)) {
        // Reset streak on loss or no match
        state.streak = 0;
    }

    // Logging
    if (logType === 'win') {
        addLog(logMessage, 'win');
        if (winAmount >= 500) addLog("!!! JACKPOT !!! GLOBAL MINIMA REACHED !!!", 'win');
        addLog(getRandomLog('win'), 'win');
    } else if (logType === 'lose') {
        addLog(logMessage, 'lose');
        addLog(getRandomLog('lose'), 'lose');
    } else {
        addLog(logMessage);
        if (Math.random() > 0.7) {
            addLog(getRandomLog('neutral'));
        }
    }

    // Streak feedback & milestones
    if (state.streak > 0 && state.streak % 3 === 0) {
        const bonus = state.streak * 10;
        state.tokens += bonus;
        addLog(`MILESTONE: ${state.streak}-spin consistency streak! ${getRandomLog('streak')}`, 'system');
        addLog(`Bonus ${bonus} tokens awarded for model stability.`, "win");
    }

    // Context-specific logs
    if (state.temperature > 1.8) {
        addLog(getRandomLog('highTemp'), 'warn');
    } else if (state.temperature < 0.3) {
        addLog(getRandomLog('lowTemp'), 'warn');
    }

    // Context management
    if (state.context <= 0) {
        const penalty = 200;
        addLog(`CONTEXT OVERFLOW: Flushed weights to disk to recover memory. (-${penalty} tokens)`, "lose");
        state.tokens = Math.max(0, state.tokens - penalty);
        state.context = 100;
        // Visual feedback for overflow
        document.querySelector('.slot-machine').classList.add('overflow');
        setTimeout(() => document.querySelector('.slot-machine').classList.remove('overflow'), 1000);
    }

    // Win-line animation
    if (isWin) {
        document.querySelector('.slot-machine').classList.add('winning');
        setTimeout(() => document.querySelector('.slot-machine').classList.remove('winning'), 2000);
    }

    if (state.tokens < BASE_COST && state.tokens > 0) {
        addLog("LOW BUDGET: Warning, insufficient tokens for full inference cycle.", "warn");
    }

    // Bankrupt check
    if (state.tokens < BASE_COST) {
        setTimeout(() => {
            if (state.tokens < BASE_COST) {
                addLog("CRITICAL FAILURE: Model bankrupt. Venture Capital funding required.", "lose");
                if (confirm("Tokens depleted. Would you like to secure more VC funding (reset state)?")) {
                    resetGame();
                }
            }
        }, 1200);
    }
}

// Initial call
init();
