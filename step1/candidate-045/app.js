// Game Configuration
const SYMBOLS = ['🤖', '💻', '🧠', '💩', '🔥'];
const PAYOUTS = {
    '🔥': 100,
    '🧠': 50,
    '💻': 20,
    '🤖': 10,
    '💩': 0
};

const SATIRICAL_MESSAGES = [
    "Optimizing backpropagation...",
    "Scraping public data without consent...",
    "Applying ethics-washing...",
    "Recalibrating GPT-5 expectations...",
    "Found 1.5 million parameters, none of them work.",
    "User prompt detected: 'Make me rich'. Processing...",
    "Hallucinating a better outcome...",
    "Burning through H100s...",
    "Replacing 10 developers with 1 medium-sized model...",
    "Synthesizing corporate buzzwords..."
];

// State Management
let tokens = parseInt(localStorage.getItem('compute-tokens')) || 1000;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const statusDisplay = document.getElementById('status-message');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const spinButton = document.getElementById('spin-button');
const betInput = document.getElementById('bet-amount');

// Initialization
function init() {
    updateTokenDisplay();
    statusDisplay.innerText = "Ready to 'innovate'...";
}

function updateTokenDisplay() {
    tokenDisplay.innerText = tokens;
    localStorage.setItem('compute-tokens', tokens);
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function setStatus(msg) {
    statusDisplay.innerText = msg;
}

async function spin() {
    const bet = parseInt(betInput.value);

    // Validation
    if (isNaN(bet) || bet <= 0) {
        setStatus("Error: Invalid compute allocation.");
        return;
    }

    if (bet > tokens) {
        setStatus("Error: Insufficient VRAM (Tokens).");
        return;
    }

    // Start Spin
    isSpinning = true;
    tokens -= bet;
    updateTokenDisplay();
    spinButton.disabled = true;
    setStatus(SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]);

    // Add spinning class
    reels.forEach(reel => reel.classList.add('spinning'));

    // Sequence of stopping reels
    const results = [];
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 400));
        const finalSymbol = getRandomSymbol();
        results.push(finalSymbol);
        reels[i].classList.remove('spinning');
        reels[i].querySelector('.reel-content').innerText = finalSymbol;
    }

    // Evaluate Win
    evaluateResults(results, bet);
    isSpinning = false;
    spinButton.disabled = false;
}

function evaluateResults(results, bet) {
    const allSame = results.every(val => val === results[0]);
    
    if (allSame) {
        const winningSymbol = results[0];
        const multiplier = PAYOUTS[winningSymbol];
        
        if (multiplier > 0) {
            const winnings = bet * multiplier;
            tokens += winnings;
            setStatus(`SUCCESS! High confidence match on ${winningSymbol}. Payout: ${winnings} tokens.`);
        } else {
            setStatus(`HALLUCINATION! Match on ${winningSymbol} detected, but it's worthless.`);
        }
    } else {
        setStatus("FAILURE: Gradient descent failed to converge.");
    }

    if (tokens <= 0) {
        setStatus("BANKRUPT! Pivoting to a new startup idea (1000 tokens granted).");
        tokens = 1000;
    }
    
    updateTokenDisplay();
}

// Event Listeners
spinButton.addEventListener('click', () => {
    if (!isSpinning) spin();
});

// Start the game
init();
