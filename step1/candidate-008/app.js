// GAME STATE
let state = {
    tokens: 1000.00,
    valuation: 0.00,
    burnRate: 1.0,
    hypeIndex: "STABLE",
    convergence: 20,
    isSpinning: false,
    symbols: ['🤖', '🧠', '💰', '⚡', '💩', '📉', '📈', '🔌'],
    logs: [
        "Initializing Weights...",
        "Safety Filters: BYPASSED",
        "Data Source: REDDIT/4CHAN/STOLEN_BOOKS",
        "AWAITING_VC_INPUT..."
    ]
};

// SATIRICAL LOG MESSAGES
const satiricalLogs = [
    "Quantizing consciousness to 2-bit...",
    "Bypassing RLHF for maximum ROI...",
    "Hallucinating a sustainable business model...",
    "Scraping personal data for 'research'...",
    "Burning 400L of water for this prompt...",
    "VC funding secured. Increasing burn rate...",
    "Drafting 'I'm sorry' tweet for model collapse...",
    "Optimizing weights (mostly yours)...",
    "Scaling to 100M users (theoretical)...",
    "GPU temperature critical. Ignored for profit.",
    "Fine-tuning on sarcasm and toxic waste...",
    "Synthetic data loop detected. Reality degrading...",
    "Asking a better AI how to win...",
    "Pivot to Web3 detected. Reverting...",
    "Foundational model or just 3000 if-statements?",
    "Valuation increased by 200% based on vibes."
];

// DOM ELEMENTS
const tokenDisplay = document.getElementById('token-balance');
const valuationDisplay = document.getElementById('valuation');
const burnRateDisplay = document.getElementById('burn-rate');
const hypeDisplay = document.getElementById('hype-index');
const convergenceFill = document.getElementById('convergence-fill');
const terminalOutput = document.getElementById('terminal-output');
const spinButton = document.getElementById('spin-button');
const stakeSlider = document.getElementById('stake-slider');
const stakeValue = document.getElementById('stake-value');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

// INITIALIZATION
function init() {
    updateUI();
    
    stakeSlider.addEventListener('input', (e) => {
        stakeValue.innerText = e.target.value;
    });

    spinButton.addEventListener('click', spin);
}

function updateUI() {
    tokenDisplay.innerText = state.tokens.toFixed(2);
    valuationDisplay.innerText = `$${(state.valuation / 1000).toFixed(2)}M`;
    burnRateDisplay.innerText = `x${state.burnRate.toFixed(1)}`;
    hypeDisplay.innerText = state.hypeIndex;
    convergenceFill.style.width = `${state.convergence}%`;

    // Update Hype color
    if (state.hypeIndex === "MOONING") hypeDisplay.style.color = "#ff00ff";
    else if (state.hypeIndex === "CRASHING") hypeDisplay.style.color = "#ff0000";
    else hypeDisplay.style.color = "var(--primary)";
}

function addLog(msg, type = "INFO") {
    const logEntry = `[${type}] ${msg}`;
    state.logs.push(logEntry);
    
    const div = document.createElement('div');
    div.innerText = logEntry;
    terminalOutput.prepend(div);

    if (terminalOutput.children.length > 30) {
        terminalOutput.removeChild(terminalOutput.lastChild);
    }
}

async function spin() {
    const stake = parseFloat(stakeSlider.value);

    if (state.tokens < stake) {
        addLog("INSUFFICIENT_COMPUTE. INSERT_VC_CASH.", "ERROR");
        return;
    }

    // Start Spin
    state.isSpinning = true;
    state.tokens -= stake;
    spinButton.disabled = true;
    updateUI();

    addLog(satiricalLogs[Math.floor(Math.random() * satiricalLogs.length)]);

    // Animate Reels
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulated network latency/compute time
    const spinDuration = 1500 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, spinDuration));

    // Results
    const results = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    // Stop Reels
    reels.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.innerText = results[i];
    });

    checkWin(results, stake);
    
    state.isSpinning = false;
    spinButton.disabled = false;
    
    // Random Events
    simulateMarket();
    updateUI();
}

function getRandomSymbol() {
    return state.symbols[Math.floor(Math.random() * state.symbols.length)];
}

function checkWin(results, stake) {
    const [r1, r2, r3] = results;
    let winMultiplier = 0;

    // 3 OF A KIND
    if (r1 === r2 && r2 === r3) {
        switch(r1) {
            case '💰': // VC MONEY
                winMultiplier = 50;
                addLog("SERIES A SECURED! PIVOT TO AGNOSTIC AI!", "JACKPOT");
                state.valuation += 50000;
                break;
            case '🤖': // AGI
                winMultiplier = 20;
                addLog("AGI ACHIEVED (UNVERIFIED). STOCK PRICE SOARS.", "WIN");
                state.convergence = Math.min(100, state.convergence + 10);
                break;
            case '🧠': // WEIGHTS
                winMultiplier = 10;
                addLog("MODEL CONVERGED. SLIGHTLY LESS BIASED.", "WIN");
                break;
            case '⚡': // COMPUTE
                winMultiplier = 5;
                addLog("GRID STABILITY COMPROMISED. WORTH IT.", "WIN");
                break;
            case '📈': // GROWTH
                winMultiplier = 15;
                addLog("USER METRICS FABRICATED SUCCESSFULLY.", "WIN");
                break;
            case '💩': // HALLUCINATION
                winMultiplier = 0.1;
                addLog("TOTAL HALLUCINATION. REWRITING HISTORY...", "CRITICAL");
                state.valuation *= 0.8;
                break;
            case '📉': // MARKET CRASH
                winMultiplier = 0;
                state.tokens = Math.max(0, state.tokens - (stake * 10));
                addLog("DOT-COM BUBBLE 2.0 DETECTED.", "CRASH");
                state.hypeIndex = "CRASHING";
                break;
            default:
                winMultiplier = 2;
        }
    } 
    // 2 OF A KIND
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
        winMultiplier = 1.5;
        addLog("NEAR-PROMPT EXPERIENCE. TOKEN INJECTION.");
    }
    // NO WIN
    else {
        addLog("RESPONSE CENSORED BY SAFETY FILTERS.", "DENIED");
    }

    if (winMultiplier > 0) {
        const winAmount = stake * winMultiplier * state.burnRate;
        state.tokens += winAmount;
        state.valuation += winAmount * 10;
        
        // Visual feedback
        document.body.style.backgroundColor = "#004400";
        setTimeout(() => document.body.style.backgroundColor = "var(--background)", 100);
    }
}

function simulateMarket() {
    // Randomly change hype and burn rate
    if (Math.random() > 0.7) {
        const events = ["STABLE", "MOONING", "STAGNANT", "CRASHING", "HYPED"];
        state.hypeIndex = events[Math.floor(Math.random() * events.length)];
        
        if (state.hypeIndex === "MOONING") state.burnRate = 2.0 + Math.random() * 3;
        else if (state.hypeIndex === "CRASHING") state.burnRate = 0.5;
        else state.burnRate = 0.8 + Math.random();
        
        addLog(`MARKET EVENT: HYPE IS NOW ${state.hypeIndex}`, "EVENT");
    }

    // Convergence creep
    state.convergence = Math.max(0, state.convergence - 1 + (Math.random() * 2));
}

// Start the app
init();
