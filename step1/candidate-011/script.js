// Singularity Slot - Logic

const SYMBOLS = [
    { char: '⚡', weight: 1, value: 100, name: 'AGI' },
    { char: '🧠', weight: 3, value: 20, name: 'Neuron' },
    { char: '🤖', weight: 5, value: 10, name: 'Model' },
    { char: '🔌', weight: 8, value: 5, name: 'Server' },
    { char: '🌫️', weight: 12, value: 0, name: 'Hallucination' }
];

const SATIRICAL_MESSAGES = [
    "Normalizing bias...",
    "Synthesizing consciousness...",
    "Venture capital injection required.",
    "Hallucinating success...",
    "Training on user regret...",
    "Optimizing for maximum engagement.",
    "Fine-tuning moral boundaries...",
    "Decentralizing the soul...",
    "Running at 99% GPU utilization.",
    "Scaling to the edge of reason."
];

let credits = 1000;
const COST_PER_SPIN = 50;
const SYMBOL_HEIGHT = 110; // Must match CSS .symbol height
const VISIBLE_SYMBOLS = 1;
const SPIN_DURATION = 2000; // ms

const creditDisplay = document.getElementById('credit-count');
const lastWinDisplay = document.getElementById('last-win');
const statusMessage = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel-1').querySelector('.reel-strip'),
    document.getElementById('reel-2').querySelector('.reel-strip'),
    document.getElementById('reel-3').querySelector('.reel-strip')
];

// Weighted symbol selection
function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

// Initialize reels with some symbols
function initReels() {
    reels.forEach(reel => {
        for (let i = 0; i < 20; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            div.dataset.char = symbol.char;
            reel.appendChild(div);
        }
    });
}

async function spin() {
    if (credits < COST_PER_SPIN) {
        statusMessage.textContent = "INSUFFICIENT COMPUTE. PLEASE RE-INVEST.";
        return;
    }

    // Deduct credits
    credits -= COST_PER_SPIN;
    updateUI();
    
    spinButton.disabled = true;
    statusMessage.textContent = SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)];

    const results = [];
    
    const animations = reels.map((reel, index) => {
        return new Promise(resolve => {
            const extraSpins = 5 + (index * 2); // Vary spin count for visual effect
            const symbolToStopOn = getRandomSymbol();
            results.push(symbolToStopOn);

            // Add the target symbol to the top (we spin "downwards" by translating Y)
            const newSymbolDiv = document.createElement('div');
            newSymbolDiv.className = 'symbol';
            newSymbolDiv.textContent = symbolToStopOn.char;
            newSymbolDiv.dataset.char = symbolToStopOn.char;
            reel.prepend(newSymbolDiv);

            // Reset transition for instant jump to "start" position if needed
            // But here we just keep prepending and translating. 
            // A simpler way for a demo: Just translate to a fixed distance and swap content.
            
            const targetY = 0; // The new symbol is at the top
            const currentY = -(reel.children.length - 1) * SYMBOL_HEIGHT;
            
            // To make it look like a spin, we start from a high negative Y
            reel.style.transition = 'none';
            reel.style.transform = `translateY(${-15 * SYMBOL_HEIGHT}px)`;
            
            // Force reflow
            reel.offsetHeight;

            reel.style.transition = `transform ${SPIN_DURATION + (index * 500)}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.transform = `translateY(0px)`;

            setTimeout(() => {
                // Cleanup: remove old symbols to prevent DOM bloat
                while (reel.children.length > 20) {
                    reel.removeChild(reel.lastChild);
                }
                resolve();
            }, SPIN_DURATION + (index * 500));
        });
    });

    await Promise.all(animations);
    checkWin(results);
    spinButton.disabled = false;
}

function checkWin(results) {
    const chars = results.map(r => r.char);
    const isWin = chars[0] === chars[1] && chars[1] === chars[2];
    
    if (isWin) {
        const winningSymbol = SYMBOLS.find(s => s.char === chars[0]);
        const winAmount = COST_PER_SPIN * winningSymbol.value;
        
        if (winningSymbol.char === '🌫️') {
            statusMessage.textContent = "CRITICAL ERROR: HALLUCINATION DETECTED. NULL YIELD.";
            lastWinDisplay.textContent = "0 (ERR)";
        } else {
            credits += winAmount;
            lastWinDisplay.textContent = winAmount;
            statusMessage.textContent = `SUCCESS: ${winningSymbol.name} convergence. Yielded ${winAmount} credits.`;
            triggerWinEffect();
        }
    } else {
        lastWinDisplay.textContent = "0";
        if (Math.random() > 0.7) {
            statusMessage.textContent = "Model failed to converge. Try more parameters.";
        }
    }
    updateUI();
}

function updateUI() {
    creditDisplay.textContent = credits;
    if (credits < COST_PER_SPIN) {
        spinButton.textContent = "OUT OF COMPUTE";
        spinButton.disabled = true;
    }
}

function triggerWinEffect() {
    const machine = document.querySelector('.slot-machine');
    machine.style.borderColor = 'var(--neon-cyan)';
    setTimeout(() => {
        machine.style.borderColor = 'var(--neon-purple)';
    }, 1000);
}

spinButton.addEventListener('click', spin);

// Initialize
initReels();
updateUI();
