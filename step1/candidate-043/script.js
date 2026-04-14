/**
 * AGI Casino - Logic Script
 * Satirizing the AI economy one token at a time.
 */

const SYMBOLS = [
    { char: '🧠', name: 'AGI', value: 100 },
    { char: '📟', name: 'H100 GPU', value: 50 },
    { char: '🤖', name: 'RLHF Bot', value: 20 },
    { char: '🌀', name: 'Hallucination', value: 10 },
    { char: '💰', name: 'VC Funding', value: 30 },
    { char: '📜', name: 'Prompt', value: 5 }
];

const STATUS_MESSAGES = [
    "Optimizing loss functions...",
    "Crawling Reddit for training data...",
    "Hallucinating a profitable quarter...",
    "Bribing electricity providers...",
    "RLHFing the user's expectations...",
    "Burning through NVIDIA credits...",
    "Quantizing the jackpot...",
    "Updating terms of service (v89)...",
    "Compressing human intelligence...",
    "Scaling to 10 trillion parameters..."
];

const WIN_MESSAGES = [
    "SUCCESS: Model converged! You won tokens.",
    "BINGO: Seed round secured! Payout initialized.",
    "ERROR: Hallucination detected! (Wait, no, that's a win).",
    "ALERT: AGI achieved! (Briefly, in a sandbox)."
];

const LOSE_MESSAGES = [
    "FAIL: Gradient exploded. Tokens lost.",
    "NOTICE: Token limit exceeded. Please buy more compute.",
    "STATUS: Model stuck in local minima. Try again.",
    "WARNING: GPU out of memory. Cost deducted."
];

// Game State
let tokens = 1000;
let isSpinning = false;
const SPIN_COST = 10;

// DOM Elements
const tokenDisplay = document.getElementById('token-balance');
const spinBtn = document.getElementById('spin-btn');
const statusLog = document.getElementById('status-log');
const reels = [
    document.querySelector('#reel-1 .symbol-strip'),
    document.querySelector('#reel-2 .symbol-strip'),
    document.querySelector('#reel-3 .symbol-strip')
];

/**
 * Initialize the reels with symbols
 */
function initReels() {
    reels.forEach(reel => {
        // Create a long strip of symbols for the spinning effect
        for (let i = 0; i < 40; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            reel.appendChild(div);
        }
    });
}

/**
 * Add a message to the terminal log
 */
function logMessage(text, color = null) {
    const p = document.createElement('p');
    p.className = 'log-entry';
    p.textContent = `> ${text}`;
    if (color) p.style.color = color;
    statusLog.appendChild(p);
    statusLog.scrollTop = statusLog.scrollHeight;
    
    // Keep only last 10 messages
    while (statusLog.children.length > 10) {
        statusLog.removeChild(statusLog.firstChild);
    }
}

/**
 * Spin the slot machine
 */
async function spin() {
    if (isSpinning || tokens < SPIN_COST) return;

    isSpinning = true;
    tokens -= SPIN_COST;
    updateDisplay();
    spinBtn.disabled = true;

    logMessage(`Running inference... Cost: ${SPIN_COST} tokens.`, 'var(--neon-cyan)');
    
    const results = [];
    const spinDurations = [2000, 2500, 3000];

    reels.forEach((reel, index) => {
        // Pick a random final symbol
        const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
        const symbol = SYMBOLS[randomIndex];
        results.push(symbol);

        // Reset reel position without transition
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        
        // Force reflow
        reel.offsetHeight;

        // Animate to new position
        // We calculate position so the target symbol ends up in the middle
        // In our CSS, each symbol is 180px high.
        // We'll land on one of the symbols near the end.
        const offset = 30;
        const targetPos = (offset + randomIndex) * 180; 
        reel.style.transition = `transform ${spinDurations[index]}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        reel.style.transform = `translateY(-${targetPos}px)`;

        // Replace the symbol at that position to ensure it's what we want
        const targetDiv = reel.children[offset + randomIndex];
        if (targetDiv) targetDiv.textContent = symbol.char;
    });

    // Wait for the longest animation
    await new Promise(resolve => setTimeout(resolve, 3000));

    checkWin(results);
    
    isSpinning = false;
    spinBtn.disabled = false;
    
    // Add random AI status message
    if (Math.random() > 0.5) {
        logMessage(STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)]);
    }
}

/**
 * Determine if the player won
 */
function checkWin(results) {
    const [s1, s2, s3] = results;

    if (s1.char === s2.char && s2.char === s3.char) {
        // Jackpot!
        const winAmount = s1.value * 5;
        tokens += winAmount;
        logMessage(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)], 'var(--neon-green)');
        logMessage(`PROFIT: +${winAmount} tokens minted.`, 'var(--neon-green)');
        flashScreen('var(--neon-green)');
    } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        // Partial win
        const winAmount = 15;
        tokens += winAmount;
        logMessage("Minor convergence. 15 tokens recovered.", 'var(--neon-yellow)');
    } else {
        // Loss
        logMessage(LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)], 'var(--neon-pink)');
    }

    updateDisplay();
}

/**
 * Visual feedback for big wins
 */
function flashScreen(color) {
    const container = document.querySelector('.app-container');
    container.style.boxShadow = `0 0 60px ${color}`;
    setTimeout(() => {
        container.style.boxShadow = '0 0 40px rgba(0, 0, 0, 0.8)';
    }, 500);
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
    if (tokens < SPIN_COST) {
        spinBtn.textContent = "OUT OF COMPUTE (BROKE)";
        spinBtn.disabled = true;
    }
}

// Event Listeners
spinBtn.addEventListener('click', spin);

// Start
initReels();
logMessage("Welcome to AGI Casino. Good luck, meatbag.");
