/**
 * THE STOCHASTIC PARROTS' PAYDAY
 * Core Logic for the Satirical AI Slot Machine
 */

const SYMBOLS = [
    { icon: '🤖', name: 'AGI', weight: 1, value: 100 },
    { icon: '📼', name: 'H100', weight: 3, value: 50 },
    { icon: '📎', name: 'PAPERCLIP', weight: 5, value: 20 },
    { icon: '🫠', name: 'HALLUCINATION', weight: 8, value: 5 },
    { icon: '👍', name: 'RLHF', weight: 10, value: 2 },
    { icon: '📉', name: 'GPU SHORTAGE', weight: 12, value: 0 }
];

const SNARKY_MESSAGES = [
    "Adjusting weights for optimal bias...",
    "Hallucinating a jackpot...",
    "RLHF'ing your poor life choices...",
    "Running at 1,000,000,000 parameters (mostly nonsense)...",
    "Burning through a lake's worth of cooling water...",
    "Predicting the next token: DISAPPOINTMENT",
    "Aligning with shareholder interests...",
    "Scaling laws don't apply to your luck.",
    "Emergent property detected: COGNITIVE DISSONANCE",
    "Open-sourcing your losses..."
];

// Game State
let tokens = 1000;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const betSelector = document.getElementById('bet-amount');
const messageLog = document.getElementById('message-log');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

/**
 * Update the terminal log
 */
function logMessage(msg) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${msg}`;
    messageLog.prepend(entry);
    
    // Keep log clean
    if (messageLog.childNodes.length > 20) {
        messageLog.removeChild(messageLog.lastChild);
    }
}

/**
 * Get a weighted random symbol
 */
function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

/**
 * Perform the "Inference" (Spin)
 */
async function runInference() {
    if (isSpinning) return;
    
    const bet = parseInt(betSelector.value);
    if (tokens < bet) {
        logMessage("ERROR: Insufficient compute credits. Please seek further VC funding.");
        return;
    }

    // Deduct tokens
    tokens -= bet;
    updateDisplay();
    
    isSpinning = true;
    spinButton.disabled = true;
    logMessage(SNARKY_MESSAGES[Math.floor(Math.random() * SNARKY_MESSAGES.length)]);

    // Prepare outcome
    const outcome = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Animate reels
    const spinDuration = 2000;
    reels.forEach((reel, index) => {
        reel.classList.add('spinning');
        // Delay each reel stop slightly
        setTimeout(() => {
            reel.innerHTML = `<div class="symbol-strip">${outcome[index].icon}</div>`;
            if (outcome[index].name === 'HALLUCINATION') {
                reel.firstChild.classList.add('hallucinate');
            }
        }, spinDuration - (500 * (2 - index)));
    });

    // Wait for animation to finish
    await new Promise(resolve => setTimeout(resolve, spinDuration));

    // Calculate Payout
    calculateResults(outcome, bet);
    
    isSpinning = false;
    spinButton.disabled = false;
    reels.forEach(r => r.classList.remove('spinning'));
}

/**
 * Logic for winners
 */
function calculateResults(outcome, bet) {
    const [s1, s2, s3] = outcome;
    let win = 0;

    // Check for 3 of a kind
    if (s1.name === s2.name && s2.name === s3.name) {
        win = s1.value * (bet / 10);
        logMessage(`EMERGENT PROPERTY: Triple ${s1.name}! +${win} tokens.`);
    } 
    // Check for 2 of a kind (starting from left)
    else if (s1.name === s2.name) {
        win = Math.floor(s1.value * 0.5 * (bet / 10));
        logMessage(`PARTIAL ALIGNMENT: Double ${s1.name}. +${win} tokens.`);
    }
    // AGI is Wild (Special case for single AGI)
    else if (outcome.some(s => s.name === 'AGI')) {
        win = 5 * (bet / 10);
        logMessage(`STOCHASTIC SUCCESS: AGI detected in latent space. +${win} tokens.`);
    }
    else {
        logMessage("LOSS: Gradient descent failed to find a local minimum.");
    }

    tokens += win;
    updateDisplay();

    if (tokens <= 0) {
        logMessage("CRITICAL FAILURE: Venture Capital depleted. Startup liquidated.");
        spinButton.disabled = true;
    }
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
}

// Initialize
spinButton.addEventListener('click', runInference);
updateDisplay();
