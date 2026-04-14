const SYMBOLS = [
    { char: '📈', name: 'CONVERGENT_GRADIENT', weight: 8, payout: 50 },
    { char: '🕸️', name: 'HIDDEN_LAYER', weight: 12, payout: 20 },
    { char: '📦', name: 'TENSOR_FLOW', weight: 18, payout: 10 },
    { char: '🧠', name: 'OPTIMIZED_WEIGHTS', weight: 22, payout: 5 },
    { char: '🧪', name: 'TEST_SET_VALIDATION', weight: 20, payout: 2 },
    { char: '📉', name: 'EXPLODING_GRADIENT', weight: 20, payout: 0 }
];

const LOG_MESSAGES = [
    "Optimizing learning rate...",
    "Backpropagating errors through time...",
    "Regularizing hidden layers...",
    "Augmenting data stream...",
    "Shuffling mini-batches...",
    "Converging on local minima...",
    "Calculating loss function...",
    "Pruning redundant neurons...",
    "Normalizing batch inputs...",
    "Fine-tuning hyperparameters..."
];

let balance = 1000;
let isSpinning = false;

const balanceEl = document.getElementById('balance');
const lossEl = document.getElementById('loss');
const betInput = document.getElementById('bet');
const spinBtn = document.getElementById('spin-btn');
const logsEl = document.getElementById('logs');
const resetBtn = document.getElementById('reset-btn');

const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

// Initialize reels with random symbols
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        const symbol = getRandomSymbol();
        const el = createSymbolEl(symbol);
        reel.appendChild(el);
    });
}

function createSymbolEl(symbol) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = symbol.char;
    div.dataset.name = symbol.name;
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

function addLog(message, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${message}`;
    logsEl.prepend(entry);
    
    // Keep only last 20 logs
    if (logsEl.children.length > 20) {
        logsEl.removeChild(logsEl.lastChild);
    }
}

async function spin() {
    const bet = parseInt(betInput.value);
    if (isNaN(bet) || bet <= 0) {
        addLog("INVALID_BATCH_SIZE_DETECTED", "loss");
        return;
    }
    if (bet > balance) {
        addLog("INSUFFICIENT_COMPUTE_TOKENS", "loss");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    balance -= bet;
    updateUI();
    addLog(`Initiating Epoch. Batch size: ${bet}...`);

    const spinDuration = 2000;
    const results = [];

    reels.forEach((reel, index) => {
        // Create a strip of symbols for the animation
        const strip = document.createElement('div');
        strip.style.display = 'flex';
        strip.style.flexDirection = 'column';
        
        // Add current symbol at top
        const currentSymbol = reel.children[0].textContent;
        const currentEl = document.createElement('div');
        currentEl.className = 'symbol';
        currentEl.textContent = currentSymbol;
        strip.appendChild(currentEl);

        // Add random symbols in middle
        for (let i = 0; i < 20; i++) {
            const sym = getRandomSymbol();
            strip.appendChild(createSymbolEl(sym));
        }

        // Add target symbol at bottom
        const targetSym = getRandomSymbol();
        results.push(targetSym);
        const targetEl = createSymbolEl(targetSym);
        strip.appendChild(targetEl);

        reel.innerHTML = '';
        reel.appendChild(strip);

        // Animate
        const symbolHeight = 130;
        const totalSymbols = strip.children.length;
        const targetY = -(totalSymbols - 1) * symbolHeight;

        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        
        // Force reflow
        reel.offsetHeight;

        reel.style.transition = `transform ${spinDuration + (index * 500)}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        reel.style.transform = `translateY(${targetY}px)`;
    });

    // Random log messages during spin
    const logInterval = setInterval(() => {
        addLog(LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]);
    }, 600);

    setTimeout(() => {
        clearInterval(logInterval);
        isSpinning = false;
        spinBtn.disabled = false;
        
        // Finalize reels
        reels.forEach((reel, i) => {
            const finalSymbol = results[i];
            reel.style.transition = 'none';
            reel.style.transform = 'translateY(0)';
            reel.innerHTML = '';
            reel.appendChild(createSymbolEl(finalSymbol));
        });

        calculateWin(results, bet);
    }, spinDuration + 1500);
}

function calculateWin(results, bet) {
    const s1 = results[0].char;
    const s2 = results[1].char;
    const s3 = results[2].char;

    let winAmount = 0;
    let winMessage = "";

    if (s1 === s2 && s2 === s3) {
        // Triple match
        const symbol = SYMBOLS.find(s => s.char === s1);
        winAmount = bet * symbol.payout;
        winMessage = `CRITICAL_CONVERGENCE! +${winAmount} tokens.`;
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Double match
        const matchChar = (s1 === s2) ? s1 : s3;
        const symbol = SYMBOLS.find(s => s.char === matchChar);
        winAmount = Math.floor(bet * (symbol.payout / 4));
        if (winAmount > 0) {
            winMessage = `LOCAL_MINIMA_REACHED. +${winAmount} tokens.`;
        }
    }

    if (winAmount > 0) {
        balance += winAmount;
        addLog(winMessage, "win");
        lossEl.textContent = (Math.random() * 0.01).toFixed(4);
    } else {
        addLog("EPOCH_COMPLETED: Loss function minimized (No gain).", "loss");
        lossEl.textContent = (Math.random() * 0.5 + 0.5).toFixed(4);
    }

    updateUI();

    if (balance <= 0) {
        addLog("OUT_OF_COMPUTE_RESOURCES. System shutdown imminent.", "loss");
        resetBtn.style.display = 'inline-block';
        spinBtn.disabled = true;
    }
}

function updateUI() {
    balanceEl.textContent = balance;
}

spinBtn.addEventListener('click', spin);

resetBtn.addEventListener('click', () => {
    balance = 1000;
    updateUI();
    addLog("REBOOTING... New GPU grant received.");
    resetBtn.style.display = 'none';
    spinBtn.disabled = false;
    initReels();
});

initReels();
updateUI();
