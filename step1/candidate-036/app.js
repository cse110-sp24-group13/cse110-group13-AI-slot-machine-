/**
 * AI Startup Simulator - Game Logic
 */

// Configuration
const ICONS = ['🤖', '☁️', '🧠', '🔥', '💰', '📉'];
const SPIN_COST = 5;
const WIN_MULTIPLIERS = {
    '🤖': 10,  // Model
    '☁️': 5,   // Cloud
    '🧠': 15,  // Neural
    '🔥': 20,  // GPU
    '💰': 50,  // VC / Jackpot
    '📉': -10  // Hallucination / Penalty
};

const MESSAGES = {
    win: [
        "Series A funding secured!",
        "Viral growth detected!",
        "SOTA achieved!",
        "Monetization successful!",
        "Pivot to profit complete."
    ],
    loss: [
        "Model collapsed.",
        "Cloud bill overdue.",
        "Investors are skeptical.",
        "OOM Error in production.",
        "Hype cycle cooling down."
    ],
    penalty: [
        "Major Hallucination! SEC investigation pending.",
        "Model lied to a reporter. Valuation plummeting.",
        "Prompt injection leaked secrets!"
    ]
};

// State
let balance = 100;
let valuation = 0;
let isSpinning = false;

// DOM Elements
const balanceEl = document.getElementById('balance');
const valuationEl = document.getElementById('valuation');
const spinButton = document.getElementById('spin-button');
const messageEl = document.getElementById('message-display');
const eventLog = document.getElementById('event-log');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

/**
 * Update UI state
 */
function updateUI() {
    balanceEl.textContent = balance;
    valuationEl.textContent = `$${valuation.toLocaleString()}M`;
    spinButton.disabled = balance < SPIN_COST || isSpinning;
}

/**
 * Add a log entry
 */
function addLog(message, type = '') {
    const li = document.createElement('li');
    li.textContent = `[LOG] ${message}`;
    if (type) li.classList.add(type);
    eventLog.prepend(li);
}

/**
 * Get random icon
 */
function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

/**
 * Check results and calculate payout
 */
function checkResults(results) {
    const [r1, r2, r3] = results;
    
    // Check for 3 of a kind
    if (r1 === r2 && r2 === r3) {
        if (r1 === '📉') {
            // Triple Hallucination - Massive penalty
            const penalty = 50;
            balance = Math.max(0, balance - penalty);
            valuation = Math.max(0, valuation - 100);
            messageEl.textContent = "TRIPLE HALLUCINATION! COMPANY DISSOLVED.";
            messageEl.className = "message loss-text";
            addLog(`Massive hallucination detected! -$${penalty} Credits`, 'loss-text');
        } else {
            // Jackpot
            const multiplier = WIN_MULTIPLIERS[r1] || 10;
            const winAmount = multiplier * 5;
            balance += winAmount;
            valuation += multiplier * 2;
            messageEl.textContent = MESSAGES.win[Math.floor(Math.random() * MESSAGES.win.length)];
            messageEl.className = "message win-text";
            addLog(`BIG WIN! ${r1}${r1}${r1} matched. +${winAmount} Credits.`, 'win-text');
        }
        return;
    }

    // Check for single hallucinations
    const hallucinationCount = results.filter(i => i === '📉').length;
    if (hallucinationCount > 0) {
        const penalty = hallucinationCount * 2;
        balance = Math.max(0, balance - penalty);
        messageEl.textContent = MESSAGES.penalty[Math.floor(Math.random() * MESSAGES.penalty.length)];
        messageEl.className = "message loss-text";
        addLog(`Hallucination penalty: -${penalty} Credits.`, 'loss-text');
        return;
    }

    // Standard no-win
    messageEl.textContent = MESSAGES.loss[Math.floor(Math.random() * MESSAGES.loss.length)];
    messageEl.className = "message";
}

/**
 * Main spin function
 */
async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    updateUI();
    
    messageEl.textContent = "Running inference...";
    messageEl.className = "message";
    addLog(`Running inference... cost: ${SPIN_COST} credits`);

    // Add spinning class
    reels.forEach(reel => reel.classList.add('spinning'));

    // Set timeout for each reel to "stop"
    const results = [];
    
    for (let i = 0; i < reels.length; i++) {
        // Staggered stop
        await new Promise(resolve => setTimeout(resolve, 500 + (i * 400)));
        const finalIcon = getRandomIcon();
        results.push(finalIcon);
        reels[i].classList.remove('spinning');
        reels[i].textContent = finalIcon;
    }

    isSpinning = false;
    checkResults(results);
    updateUI();
}

// Event Listeners
spinButton.addEventListener('click', spin);

// Initial UI sync
updateUI();
