const symbols = [
    { char: '🚀', weight: 1, name: 'AGI' },
    { char: '🤖', weight: 3, name: 'LLM' },
    { char: '🧠', weight: 5, name: 'Neural Net' },
    { char: '💬', weight: 10, name: 'Token' },
    { char: '🚫', weight: 8, name: 'Hallucination' },
    { char: '📉', weight: 4, name: 'Model Collapse' }
];

const SPIN_COST = 10;
let tokens = 100;
let isSpinning = false;

const reelElements = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const tokenCountEl = document.getElementById('token-count');
const inferBtn = document.getElementById('infer-btn');
const statusMessageEl = document.getElementById('status-message');

function getRandomSymbol() {
    const totalWeight = symbols.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of symbols) {
        if (random < symbol.weight) {
            return symbol;
        }
        random -= symbol.weight;
    }
    return symbols[0];
}

function updateUI() {
    tokenCountEl.textContent = tokens;
    inferBtn.disabled = tokens < SPIN_COST || isSpinning;
}

async function spin() {
    if (isSpinning || tokens < SPIN_COST) return;

    isSpinning = true;
    tokens -= SPIN_COST;
    updateUI();
    
    statusMessageEl.textContent = "Sampling latent space...";
    statusMessageEl.classList.remove('error');

    // Add spinning animation class
    reelElements.forEach(reel => reel.classList.add('spinning'));

    const results = [];
    
    // Simulate API latency/inference time
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 300));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reelElements[i].textContent = symbol.char;
        reelElements[i].classList.remove('spinning');
    }

    isSpinning = false;
    calculateWinnings(results);
    updateUI();
}

function calculateWinnings(results) {
    const chars = results.map(r => r.char);
    let reward = 0;
    let message = "";

    // Check for 3 of a kind
    if (chars[0] === chars[1] && chars[1] === chars[2]) {
        const char = chars[0];
        if (char === '🚀') reward = 100;
        else if (char === '🤖') reward = 25;
        else if (char === '🧠') reward = 10;
        else if (char === '💬') reward = 5;
        
        if (reward > 0) {
            message = `High confidence match! Gain ${reward} tokens.`;
        }
    }
    
    // Check for penalties or specific symbols
    const hallucinations = chars.filter(c => c === '🚫').length;
    const collapses = chars.filter(c => c === '📉').length;

    if (collapses > 0) {
        const penalty = collapses * 10;
        reward -= penalty;
        message = `Model collapse detected. Loss: ${penalty} tokens.`;
        statusMessageEl.classList.add('error');
    } else if (hallucinations > 0 && reward === 0) {
        message = "Hallucination detected. Zero signal strength.";
    } else if (reward === 0) {
        message = "No convergence found. Gradient descent failed.";
    }

    tokens += reward;
    if (message) {
        statusMessageEl.textContent = message;
    }
    
    if (tokens <= 0) {
        statusMessageEl.textContent = "CRITICAL FAILURE: Out of tokens. Model deprecated.";
        statusMessageEl.classList.add('error');
        inferBtn.disabled = true;
    }
}

inferBtn.addEventListener('click', spin);

// Initial UI state
updateUI();
