const SYMBOLS = ['🤖', '🧠', '📉', '💰', '🔥', '🥑'];
const PAYOUTS = {
    '🤖': 50,
    '🧠': 30,
    '📉': -20, // Hallucination penalty
    '💰': 100,
    '🔥': 10,
    '🥑': 5
};

const MESSAGES = [
    "Optimizing weights...",
    "Consulting the stochastic parrot...",
    "Refining via RLHF...",
    "Scaling to 1.7T parameters...",
    "Hallucinating success...",
    "Fine-tuning on Reddit data...",
    "Bypassing safety filters...",
    "Minimizing training loss...",
    "Quantizing results..."
];

const WIN_MESSAGES = [
    "AGI Achieved! Payout incoming.",
    "Synthetic Success detected.",
    "Tokens generated efficiently.",
    "Model converged on profit."
];

const LOSS_MESSAGES = [
    "Training failed. Catastrophic forgetting.",
    "Out of memory error.",
    "Output truncated. Please upgrade plan.",
    "Prompt rejected by safety layer."
];

let credits = 100;
let isSpinning = false;

const reelStrips = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];
const creditDisplay = document.getElementById('credit-count');
const generateBtn = document.getElementById('generate-btn');
const statusDisplay = document.getElementById('status-display');

// Initialize reels with some symbols
function initReels() {
    reelStrips.forEach(strip => {
        for (let i = 0; i < 20; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'symbol';
            symbol.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            strip.appendChild(symbol);
        }
    });
}

async function spin() {
    if (isSpinning || credits < 10) return;

    isSpinning = true;
    credits -= 10;
    updateUI();
    
    generateBtn.disabled = true;
    statusDisplay.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    statusDisplay.classList.remove('win-flash');

    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    // Hallucination mechanic (10% chance to flip a win)
    let hallucinated = false;
    if (results[0] === results[1] && results[1] === results[2] && Math.random() < 0.2) {
        results[2] = SYMBOLS.find(s => s !== results[0]);
        hallucinated = true;
    }

    const spinPromises = reelStrips.map((strip, i) => {
        return new Promise(resolve => {
            const symbolHeight = 150;
            const extraSpins = 5 + i * 2;
            const targetSymbolIndex = Math.floor(Math.random() * SYMBOLS.length); // Visual randomization for intermediate symbols
            
            // Add the final result symbol at the end of the strip
            const finalSymbol = document.createElement('div');
            finalSymbol.className = 'symbol';
            finalSymbol.textContent = results[i];
            strip.appendChild(finalSymbol);

            const totalSymbols = strip.children.length;
            const targetY = (totalSymbols - 1) * symbolHeight;

            strip.style.transition = `transform ${2 + i * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(-${targetY}px)`;

            setTimeout(() => {
                // Reset the strip to prevent it from growing indefinitely
                // but keep the visual state
                resolve();
            }, (2 + i * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);

    calculateWin(results, hallucinated);
    isSpinning = false;
    generateBtn.disabled = false;
}

function calculateWin(results, hallucinated) {
    if (hallucinated) {
        statusDisplay.textContent = "Error: Model hallucinated a win but was corrected by RLHF.";
        statusDisplay.classList.add('shake');
        setTimeout(() => statusDisplay.classList.remove('shake'), 500);
        return;
    }

    if (results[0] === results[1] && results[1] === results[2]) {
        const winAmount = PAYOUTS[results[0]] || 20;
        credits += winAmount;
        statusDisplay.textContent = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)] + ` (+${winAmount})`;
        statusDisplay.classList.add('win-flash');
    } else {
        statusDisplay.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
    }
    
    updateUI();

    if (credits < 10) {
        statusDisplay.textContent = "Compute Budget Exhausted. Please subscribe to Plus.";
        generateBtn.disabled = true;
    }
}

function updateUI() {
    creditDisplay.textContent = credits;
}

generateBtn.addEventListener('click', spin);

// Initial Setup
initReels();
