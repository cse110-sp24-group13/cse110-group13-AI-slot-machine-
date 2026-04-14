const SYMBOLS = [
    { icon: '✨', name: 'AGI', value: 5000, weight: 1 },
    { icon: '💰', name: 'VC FUNDING', value: 2000, weight: 3 },
    { icon: '🤖', name: 'LLM', value: 500, weight: 5 },
    { icon: '🧠', name: 'NEURAL NET', value: 200, weight: 8 },
    { icon: '📉', name: 'HALLUCINATION', value: -100, weight: 10 },
    { icon: '🔌', name: 'OUTAGE', value: -50, weight: 12 },
    { icon: '🔥', name: 'TOKEN BURN', value: 0, weight: 15 }
];

const SPIN_COST = 50;
const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 20; // For the visual scroll effect

let balance = 1000;
let isSpinning = false;

const balanceDisplay = document.getElementById('balance');
const spinBtn = document.getElementById('spin-btn');
const statusLog = document.getElementById('status-log');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

// Initialize reels
function initReels() {
    reels.forEach((reel, index) => {
        reel.innerHTML = '';
        // Add a long strip of symbols for the spinning effect
        for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
            const symbolData = getRandomSymbol();
            const symbolEl = createSymbolElement(symbolData);
            reel.appendChild(symbolEl);
        }
    });
}

function createSymbolElement(symbolData) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.innerHTML = `
        <span>${symbolData.icon}</span>
        <span class="symbol-name">${symbolData.name}</span>
    `;
    return div;
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    isSpinning = true;
    balance -= SPIN_COST;
    updateBalance();
    
    spinBtn.disabled = true;
    updateStatus('Generating tokens... Burning GPU cycles...');

    const results = [];
    const animationPromises = reels.map((reel, i) => {
        const targetSymbol = getRandomSymbol();
        results.push(targetSymbol);
        
        return animateReel(reel, i, targetSymbol);
    });

    await Promise.all(animationPromises);
    
    checkResult(results);
    isSpinning = false;
    spinBtn.disabled = false;
}

function animateReel(reel, index, targetSymbol) {
    return new Promise(resolve => {
        const symbolHeight = 180; // Should match CSS
        // Reset reel position
        reel.style.transition = 'none';
        reel.style.transform = `translateY(0)`;
        
        // Force reflow
        reel.offsetHeight;

        // Create new symbols for this spin
        const newSymbols = [];
        for (let i = 0; i < SYMBOLS_PER_REEL - 1; i++) {
            newSymbols.push(getRandomSymbol());
        }
        newSymbols.push(targetSymbol); // The last one is where it stops

        reel.innerHTML = '';
        newSymbols.forEach(s => reel.appendChild(createSymbolElement(s)));

        // Animate to the bottom
        const duration = 2 + index * 0.5;
        reel.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        
        // We want to stop exactly on the target symbol which is the last one
        // The visible window shows 1 symbol. 
        // Total symbols = SYMBOLS_PER_REEL. Offset to show last one is (SYMBOLS_PER_REEL - 1) * height
        const offset = (SYMBOLS_PER_REEL - 1) * symbolHeight;
        reel.style.transform = `translateY(-${offset}px)`;

        setTimeout(resolve, duration * 1000);
    });
}

function checkResult(results) {
    const icons = results.map(r => r.icon);
    const uniqueIcons = [...new Set(icons)];
    
    let winAmount = 0;
    let message = '';

    // Parody outcome logic
    if (uniqueIcons.length === 1) {
        // 3 of a kind
        const winSymbol = results[0];
        winAmount = winSymbol.value;
        message = `CRITICAL SUCCESS: ${winSymbol.name} reached! +${winAmount} tokens.`;
        if (winSymbol.icon === '✨') message = "AGI ACHIEVED: The Singularity is here! You win everything.";
        if (winSymbol.icon === '📉') message = "SYSTEMIC COLLAPSE: Hallucinations everywhere. Tokens burned.";
    } else if (uniqueIcons.length === 2) {
        // 2 of a kind
        winAmount = 100;
        message = "Partial Convergence: Prompt engineering saved the day. +100 tokens.";
    } else {
        // No match
        message = getRandomLossMessage();
    }

    // Check for "Bad" symbols regardless of match
    results.forEach(r => {
        if (r.icon === '📉') winAmount -= 20;
        if (r.icon === '🔌') winAmount -= 10;
    });

    balance += winAmount;
    updateBalance();
    updateStatus(message);

    if (balance <= 0) {
        updateStatus("BANKRUPT: Your AI startup ran out of VC funding. Refresh for a pivot.");
        spinBtn.disabled = true;
    }
}

function getRandomLossMessage() {
    const messages = [
        "Hallucination detected. Model output discarded.",
        "GPU Shortage. Spinning wheels in idle.",
        "Overfitting on training data. No generalization found.",
        "User query was: 'What is 1+1?'. Model failed to reason.",
        "Server timeout. AWS bills are piling up.",
        "Safety alignment too strong. Model refused to spin.",
        "Synthetic data loop detected. Quality degrading."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function updateBalance() {
    balanceDisplay.innerText = balance;
    if (balance < SPIN_COST) {
        spinBtn.disabled = true;
    }
}

function updateStatus(msg) {
    statusLog.innerText = msg;
}

spinBtn.addEventListener('click', spin);

// Start
initReels();
updateStatus('System Ready. Cost per Generation: 50 Tokens.');
