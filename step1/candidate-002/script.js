// Game Configuration
const SYMBOLS = ['🤖', '💰', '⚡', '🧠', '💩'];
const SPIN_COST = 10;
const INITIAL_BALANCE = 500;
const REEL_SYMBOLS_COUNT = 30; // Number of symbols to generate for each strip

const PAYOUTS = {
    '🤖🤖🤖': 500, // Jackpot
    '💰💰💰': 100, // High
    '⚡⚡⚡': 50,  // Medium
    '🧠🧠🧠': 20,  // Low
    '💩💩💩': 0,   // Loss
};

const SATIRE_LOGS = [
    "Hallucinating a win...",
    "Scraping Reddit for insights...",
    "Burning through GPU credits...",
    "Disrupting the gambling industry...",
    "Optimizing for maximum shareholder value...",
    "Awaiting Sam Altman's approval...",
    "Vectorizing your soul...",
    "Scaling to infinity (and zero profits)...",
    "Training on copyrighted materials...",
    "Ignoring safety alignment protocols...",
    "Pivot to Crypto detected...",
    "Rebranding to 'Advanced Intelligence'...",
    "Compressing reality into a latent space...",
    "Simulating a profitable business model..."
];

// State
let balance = INITIAL_BALANCE;
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance');
const lastPayoutDisplay = document.getElementById('last-payout');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const statusLog = document.getElementById('status-log');
const strips = [
    document.getElementById('strip-1'),
    document.getElementById('strip-2'),
    document.getElementById('strip-3')
];

// Initialization
function init() {
    strips.forEach((strip, index) => {
        populateStrip(strip);
        strip.style.transform = `translateY(0)`;
    });
    updateUI();
}

function populateStrip(strip) {
    strip.innerHTML = '';
    // Generate a long strip of random symbols
    for (let i = 0; i < REEL_SYMBOLS_COUNT; i++) {
        const symbolDiv = document.createElement('div');
        symbolDiv.classList.add('symbol');
        symbolDiv.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        strip.appendChild(symbolDiv);
    }
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    statusLog.prepend(p);
    if (statusLog.children.length > 5) {
        statusLog.removeChild(statusLog.lastChild);
    }
}

function updateUI() {
    balanceDisplay.textContent = balance;
    if (balance < SPIN_COST && !isSpinning) {
        spinBtn.disabled = true;
        spinBtn.textContent = "OUT OF COMPUTE";
        resetBtn.classList.remove('hidden');
    } else {
        spinBtn.disabled = isSpinning;
        spinBtn.textContent = isSpinning ? "PROCESSING..." : `GENERATE PROMPT (${SPIN_COST} Tokens)`;
    }
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    lastPayoutDisplay.textContent = "0";
    lastPayoutDisplay.classList.remove('winning');
    updateUI();
    addLog(SATIRE_LOGS[Math.floor(Math.random() * SATIRE_LOGS.length)]);

    const results = [];
    const animationPromises = strips.map((strip, i) => {
        const targetIndex = Math.floor(Math.random() * (REEL_SYMBOLS_COUNT - 5)) + 2;
        const resultSymbol = strip.children[targetIndex].textContent;
        results.push(resultSymbol);

        // Add blur
        strip.classList.add('blur');
        
        // Calculate offset (each symbol is 110px high)
        const offset = targetIndex * 110;
        
        return new Promise(resolve => {
            // Random delay for each reel
            setTimeout(() => {
                strip.style.transform = `translateY(-${offset}px)`;
                
                // Wait for transition to end
                setTimeout(() => {
                    strip.classList.remove('blur');
                    resolve();
                }, 3000); 
            }, i * 200);
        });
    });

    await Promise.all(animationPromises);
    
    checkWin(results);
    isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const combo = results.join('');
    let payout = 0;

    if (PAYOUTS[combo] !== undefined) {
        payout = PAYOUTS[combo];
    } else if (results[0] === results[1] && results[1] === results[2] && results[0] !== '💩') {
        // Fallback for any 3 matches not explicitly in PAYOUTS (if any added later)
        payout = 10;
    } else if (new Set(results).size === 1 && results[0] !== '💩') {
         payout = 10;
    }

    if (payout > 0) {
        balance += payout;
        lastPayoutDisplay.textContent = `+${payout}`;
        lastPayoutDisplay.classList.add('winning');
        addLog(`SUCCESS: VC Funding secured! (+${payout} tokens)`);
    } else if (results.includes('💩')) {
        addLog("CRITICAL FAILURE: Hallucination detected. Data is junk.");
    } else {
        addLog("FAILURE: Token limit exceeded. No value generated.");
    }
}

function reset() {
    balance = INITIAL_BALANCE;
    lastPayoutDisplay.textContent = "0";
    lastPayoutDisplay.classList.remove('winning');
    resetBtn.classList.add('hidden');
    addLog("PIVOT SUCCESSFUL: New seed round raised.");
    updateUI();
}

// Event Listeners
spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', reset);

// Run Init
init();
