// Game Configuration
const ICONS = ['🤖', '🧠', '⚡', '📉', '💰', '🎨'];
const SPIN_COST = 50;
const INITIAL_BALANCE = 1000;

const PAYOUTS = {
    '🤖': 2000, // AGI Jackpot
    '💰': 1000, // VC Funding
    '🧠': 500,  // Neural Net Success
    '⚡': 200,  // High Compute
    '🎨': 100,  // AI Art
    '📉': 0     // Hallucination (Loss)
};

const SATIRICAL_MESSAGES = [
    "Optimizing loss function...",
    "Hallucinating a jackpot...",
    "Scaling to 100 trillion parameters...",
    "Overfitting to your wallet...",
    "GPU temperature critical...",
    "Asking ChatGPT for financial advice...",
    "Wait, is this AGI?",
    "Token window exceeded. Retrying...",
    "Reinforcement learning from human failure...",
    "Sam Altman liked this spin."
];

// State
let balance = INITIAL_BALANCE;
let isSpinning = false;

// DOM Elements
const balanceEl = document.getElementById('balance');
const spinBtn = document.getElementById('spin-button');
const statusMsg = document.getElementById('status-message');
const consoleLog = document.getElementById('console-log');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Initialize
function init() {
    updateBalance(0);
    spinBtn.addEventListener('click', handleSpin);
}

function updateBalance(amount) {
    balance += amount;
    balanceEl.textContent = balance;
    
    if (balance < SPIN_COST) {
        spinBtn.disabled = true;
        statusMsg.textContent = "TOKEN EXHAUSTED. REQUEST VC FUNDING?";
        logToConsole("Error: Compute credits depleted. Sell your startup.");
    }
}

function logToConsole(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    consoleLog.prepend(p);
}

async function handleSpin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    spinBtn.disabled = true;
    updateBalance(-SPIN_COST);
    
    statusMsg.textContent = "Processing tokens...";
    logToConsole(`Burning ${SPIN_COST} credits...`);

    // Start spinning animation
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });

    // Randomize duration for each reel to make it look natural
    const results = [];
    for (let i = 0; i < 3; i++) {
        const duration = 1000 + (i * 500);
        const result = await spinReel(reels[i], duration);
        results.push(result);
    }

    checkResults(results);
    isSpinning = false;
    if (balance >= SPIN_COST) spinBtn.disabled = false;
}

function spinReel(reelEl, duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            reelEl.classList.remove('spinning');
            const result = ICONS[Math.floor(Math.random() * ICONS.length)];
            reelEl.querySelector('.reel-content').textContent = result;
            resolve(result);
        }, duration);
    });
}

function checkResults(results) {
    const [r1, r2, r3] = results;
    
    // Satirical Log
    logToConsole(SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]);

    if (r1 === r2 && r2 === r3) {
        // Jackpot!
        const winAmount = PAYOUTS[r1] || 0;
        if (winAmount > 0) {
            statusMsg.textContent = `MODEL CONVERGENCE! +${winAmount} TOKENS`;
            logToConsole(`AGI ALERT: Generated ${winAmount} synthetic tokens.`);
            updateBalance(winAmount);
            triggerWinEffect();
        } else {
            statusMsg.textContent = "TRIPLE HALLUCINATION! ZERO PROFIT.";
            logToConsole("Error: The model hallucinated a win but returned null.");
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Partial Match
        const matchIcon = (r1 === r2) ? r1 : r3;
        const winAmount = Math.floor(PAYOUTS[matchIcon] / 5) || 10;
        statusMsg.textContent = `Partial convergence. +${winAmount} Credits.`;
        updateBalance(winAmount);
    } else {
        statusMsg.textContent = "High Perplexity. Try scaling again.";
    }
}

function triggerWinEffect() {
    document.body.classList.add('win-animation');
    setTimeout(() => {
        document.body.classList.remove('win-animation');
    }, 2000);
}

init();
