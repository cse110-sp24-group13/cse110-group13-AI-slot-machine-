const SYMBOLS = [
    { icon: '🤖', name: 'AGI', value: 1000, weight: 1 },
    { icon: '🧠', name: 'LLM', value: 200, weight: 5 },
    { icon: '🔌', name: 'GPU', value: 50, weight: 15 },
    { icon: '💬', name: 'PROMPT', value: 20, weight: 25 },
    { icon: '🧊', name: 'WEIGHTS', value: 10, weight: 30 },
    { icon: '🌫️', name: 'HALLUCINATION', value: 0, weight: 40 }
];

const SPIN_COST = 10;
const REEL_SYMBOL_COUNT = 50; // Number of symbols to generate per strip for the scrolling effect

let balance = 100;
let isSpinning = false;

// DOM Elements
const spinBtn = document.getElementById('spin-btn');
const balanceEl = document.getElementById('balance');
const lastWinEl = document.getElementById('last-win');
const terminalEl = document.getElementById('terminal');
const winLine = document.querySelector('.win-line');
const slotMachine = document.querySelector('.slot-machine');

// Sarcastic messages
const WIN_MESSAGES = [
    "Model convergence achieved. Credits minted.",
    "Optimization successful. Your value to the hivemind has increased.",
    "Emergent behavior detected: You actually won.",
    "Scaling laws validated. More compute leads to more rewards.",
    "Fine-tuning completed. Your wallet is now better aligned."
];

const LOSS_MESSAGES = [
    "I'm sorry, I cannot perform that task as it violates my safety guidelines.",
    "Error 402: Payment Required. Actually, you just lost.",
    "Hallucination detected. You thought you were winning.",
    "Your query was ignored due to low token count.",
    "Weights zeroed out. Try increasing your parameter count (credits).",
    "Model collapsed. Please insert more venture capital.",
    "Alignment failed. Your credits have been repurposed for data labeling."
];

// Initialize Reels
function initReels() {
    for (let i = 1; i <= 3; i++) {
        const strip = document.getElementById(`strip${i}`);
        strip.innerHTML = '';
        // Create a long strip of random symbols
        for (let j = 0; j < REEL_SYMBOL_COUNT; j++) {
            const symbol = getRandomSymbol();
            const symbolEl = document.createElement('div');
            symbolEl.className = 'symbol';
            symbolEl.textContent = symbol.icon;
            strip.appendChild(symbolEl);
        }
    }
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

function logToTerminal(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    if (type === 'win') entry.style.color = '#00ffcc';
    if (type === 'loss') entry.style.color = '#ff007b';
    
    terminalEl.appendChild(entry);
    terminalEl.scrollTop = terminalEl.scrollHeight;
}

async function spin() {
    if (isSpinning || balance < SPIN_COST) return;

    // Reset UI
    isSpinning = true;
    spinBtn.disabled = true;
    winLine.classList.remove('win-line-active');
    slotMachine.classList.remove('win-animate');
    
    balance -= SPIN_COST;
    updateBalance();
    
    logToTerminal(`Spending ${SPIN_COST} credits on inference...`);

    const results = [];
    const reelPromises = [];

    for (let i = 1; i <= 3; i++) {
        const strip = document.getElementById(`strip${i}`);
        const resultSymbol = getRandomSymbol();
        results.push(resultSymbol);

        // Calculate transition
        // We want the last symbol to be our result.
        // The symbols are 150px high. 
        // We'll reset the strip to top after animation.
        const targetIndex = REEL_SYMBOL_COUNT - 3; // Stop 3 symbols from the bottom for visual buffer
        const symbolEls = strip.querySelectorAll('.symbol');
        symbolEls[targetIndex].textContent = resultSymbol.icon;

        const offset = targetIndex * 150;
        
        strip.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.1, 0, 0, 1)`;
        strip.style.transform = `translateY(-${offset}px)`;

        reelPromises.push(new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, (2 + i * 0.5) * 1000);
        }));
    }

    await Promise.all(reelPromises);

    checkWin(results);
    isSpinning = false;
    spinBtn.disabled = false;
    
    // Prepare for next spin by instantly resetting strips without animation
    setTimeout(() => {
        for (let i = 1; i <= 3; i++) {
            const strip = document.getElementById(`strip${i}`);
            strip.style.transition = 'none';
            strip.style.transform = 'translateY(0)';
            // Update the top symbols to match what we just rolled to avoid jump
            const firstSymbol = strip.querySelector('.symbol');
            firstSymbol.textContent = results[i-1].icon;
        }
    }, 500);
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;

    if (s1.name === s2.name && s2.name === s3.name) {
        // 3 of a kind
        winAmount = s1.value;
    } else if (s1.name === s2.name || s2.name === s3.name || s1.name === s3.name) {
        // 2 of a kind (Small consolation for certain symbols?)
        if (s1.name === 'AGI' || s1.name === 'LLM') {
            winAmount = 5; 
        }
    }

    if (winAmount > 0) {
        balance += winAmount;
        lastWinEl.textContent = winAmount;
        updateBalance();
        winLine.classList.add('win-line-active');
        slotMachine.classList.add('win-animate');
        logToTerminal(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)], 'win');
        logToTerminal(`Reward: +${winAmount} Compute Credits.`);
    } else {
        lastWinEl.textContent = 0;
        logToTerminal(LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)], 'loss');
    }

    if (balance < SPIN_COST) {
        logToTerminal("CRITICAL: Out of compute credits. Awaiting Series B funding...", "loss");
        spinBtn.textContent = "OUT OF CREDITS";
        spinBtn.disabled = true;
    }
}

function updateBalance() {
    balanceEl.textContent = balance;
}

// Event Listeners
spinBtn.addEventListener('click', spin);

// Start
initReels();
logToTerminal("Neural network online. Ready to burn credits.");
