const icons = [
    { symbol: '🌌', weight: 1, multiplier: 50, name: 'AGI' },
    { symbol: '🧙', weight: 5, multiplier: 10, name: 'Prompt Engineer' },
    { symbol: '🤖', weight: 10, multiplier: 5, name: 'LLM' },
    { symbol: '✨', weight: 20, multiplier: 2, name: 'Sparkle' },
    { symbol: '📉', weight: 15, multiplier: 0.5, name: 'GPU Shortage' },
    { symbol: '🌀', weight: 10, multiplier: 0, name: 'Hallucination' }
];

let tokens = 1000;
let isSpinning = false;
const spinCost = 50;

const tokenCountDisplay = document.getElementById('token-count');
const messageDisplay = document.getElementById('message');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function getRandomIcon() {
    const totalWeight = icons.reduce((sum, icon) => sum + icon.weight, 0);
    let random = Math.random() * totalWeight;
    for (const icon of icons) {
        if (random < icon.weight) return icon;
        random -= icon.weight;
    }
    return icons[icons.length - 1];
}

async function spin() {
    if (isSpinning || tokens < spinCost) return;

    isSpinning = true;
    tokens -= spinCost;
    updateUI();
    
    messageDisplay.textContent = "INFERRING...";
    messageDisplay.classList.remove('hallucinating');
    spinButton.disabled = true;

    // Start spinning animation
    const spinIntervals = reels.map(reel => {
        const content = reel.querySelector('.reel-content');
        content.classList.add('spinning');
        return setInterval(() => {
            content.textContent = icons[Math.floor(Math.random() * icons.length)].symbol;
        }, 100);
    });

    // Mock network delay (inference time)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const results = [getRandomIcon(), getRandomIcon(), getRandomIcon()];

    // Stop animation and set results sequentially
    for (let i = 0; i < reels.length; i++) {
        clearInterval(spinIntervals[i]);
        const reelContent = reels[i].querySelector('.reel-content');
        reelContent.classList.remove('spinning');
        reelContent.textContent = results[i].symbol;
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    calculateResult(results);
    isSpinning = false;
    spinButton.disabled = false;
}

function calculateResult(results) {
    const [r1, r2, r3] = results;
    
    // Check for "Hallucination" (any 🌀)
    if (results.some(r => r.symbol === '🌀')) {
        messageDisplay.textContent = "CRITICAL HALLUCINATION! DELETING CONTEXT...";
        messageDisplay.classList.add('hallucinating');
        // Extra penalty for hallucinations
        tokens = Math.max(0, tokens - 100);
        updateUI();
        return;
    }

    // Check for Win (All same)
    if (r1.symbol === r2.symbol && r2.symbol === r3.symbol) {
        const winAmount = spinCost * r1.multiplier;
        tokens += winAmount;
        messageDisplay.textContent = `SUCCESS! ${r1.name} DETECTED. +${winAmount} TOKENS`;
        updateUI();
        return;
    }

    // Two of a kind (Partial win)
    if (r1.symbol === r2.symbol || r2.symbol === r3.symbol || r1.symbol === r3.symbol) {
        const pairSymbol = (r1.symbol === r2.symbol) ? r1 : ((r2.symbol === r3.symbol) ? r2 : r1);
        const winAmount = Math.floor(spinCost * (pairSymbol.multiplier * 0.5));
        if (winAmount > 0) {
            tokens += winAmount;
            messageDisplay.textContent = `PARTIAL MATCH. +${winAmount} TOKENS`;
        } else {
            messageDisplay.textContent = "LOW CONFIDENCE SCORE. NO PAYOUT.";
        }
        updateUI();
        return;
    }

    messageDisplay.textContent = "GENERATION FAILED. TRY ADJUSTING PROMPT.";
}

function updateUI() {
    tokenCountDisplay.textContent = tokens;
    if (tokens < spinCost) {
        spinButton.disabled = true;
        messageDisplay.textContent = "OUT OF TOKENS. PLEASE INSERT COMPUTE POWER.";
    }
}

spinButton.addEventListener('click', spin);

// Initial state
updateUI();
