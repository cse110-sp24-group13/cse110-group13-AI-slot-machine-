const SYMBOLS = ['🤖', '🧠', '📉', '💸', '☁️', '⚡', '🌐'];
const REWARDS = {
    '🤖': 500,
    '💸': 250,
    '📉': 100,
    '🧠': 50
};

const AI_MESSAGES = [
    "Hallucinating a jackpot...",
    "Training on your financial losses...",
    "Optimizing weights for maximum addiction...",
    "Averaging your hopes and dreams...",
    "I'm just a language model, I can't actually pay you.",
    "Your spin is being used for reinforcement learning.",
    "Disrupting the concept of winning...",
    "Scaling to meet your desperation...",
    "Neural network bottleneck detected. Try spending more.",
    "Tokens spent. Value generated (for me).",
    "Stochastic parrot says: 'Spin again!'"
];

let tokens = 1000;
let isSpinning = false;

const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinButton = document.getElementById('spin-button');
const tokenDisplay = document.getElementById('token-count');
const confidenceDisplay = document.getElementById('confidence');
const statusDisplay = document.getElementById('ai-status');

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function updateStats() {
    tokenDisplay.textContent = tokens;
    const confidence = Math.floor(Math.random() * 100);
    confidenceDisplay.textContent = `${confidence}%`;
    
    if (tokens <= 0) {
        spinButton.disabled = true;
        statusDisplay.textContent = "Out of tokens. Please upload more venture capital.";
    }
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    tokens -= 50; // Cost of generation
    updateStats();
    
    spinButton.disabled = true;
    statusDisplay.textContent = AI_MESSAGES[Math.floor(Math.random() * AI_MESSAGES.length)];

    reelElements.forEach(reel => reel.classList.add('spinning'));

    // Artificial "inference" delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    reelElements.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.textContent = results[i];
    });

    checkWin(results);
    isSpinning = false;
    spinButton.disabled = false;
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = results[0];
        const winAmount = REWARDS[symbol] || 20;
        tokens += winAmount;
        statusDisplay.textContent = `CRITICAL SUCCESS: +${winAmount} tokens. AGI imminent!`;
        statusDisplay.style.color = 'var(--neon-green)';
    } else {
        statusDisplay.style.color = 'var(--neon-blue)';
        if (Math.random() > 0.7) {
            statusDisplay.textContent = "Loss detected. Blaming the training data.";
        }
    }
    updateStats();
}

spinButton.addEventListener('click', spin);

// Initial state
updateStats();
