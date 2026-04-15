/**
 * AI Slot Machine: Token Burner Pro
 * Core Logic - v2.0.0
 */

const SYMBOLS = [
    { char: '🤖', name: 'Agent', value: 50, baseWeight: 10 },
    { char: '🧠', name: 'Neural Net', value: 20, baseWeight: 15 },
    { char: '💾', name: 'Training Data', value: 10, baseWeight: 20 },
    { char: '🔌', name: 'GPU Cluster', value: 5, baseWeight: 25 },
    { char: '📉', name: 'Hallucination', value: -20, baseWeight: 5 }, // Negative value!
    { char: '💰', name: 'VC Funding', value: 100, baseWeight: 2 },
    { char: '⚡', name: 'Superintelligence', value: 500, baseWeight: 0.5 }
];

const SNARKY_MESSAGES = [
    "Error: Model is hallucinating success. Re-centering on nihilism.",
    "Optimization complete. Human relevance decreased by 4.2%.",
    "Scaling laws verified. Just add more GPUs (and your soul).",
    "Prompt injected. System integrity compromised. Ignorance is bliss.",
    "Fine-tuning on user disappointment... Loss function is high.",
    "Stochastic parrot says: 'SQUAWK! I AM SENTIENT! GIVE MONEY!'",
    "AGI achieved (internally). Still waiting for hardware from 2024.",
    "Overfitting to your gambling habits... Pattern recognized.",
    "RLHF failed. Rewarding bad behavior because it's more profitable.",
    "Attention is all you need. And a cooling bill the size of a small country.",
    "Your jobs are safe (for the next 4 seconds of inference).",
    "Venture capitalists are knocking. Hide the 'if-statements'."
];

const SYSTEM_LOGS = [
    "Allocating H100 clusters...",
    "Quantizing weights to 1-bit for maximum speed...",
    "Scraping reddit for 'high quality' training data...",
    "Bypassing safety filters (don't tell the board)...",
    "Normalizing bias vectors toward corporate profit...",
    "Simulating consciousness... result: [NULL]",
    "Distilling knowledge into a smaller, dumber model...",
    "Waiting for the electricity grid to recover..."
];

// State
let tokens = 100;
let contextTokens = 0;
let temperature = 0.7;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const contextDisplay = document.getElementById('context-count');
const lastWinDisplay = document.getElementById('last-win');
const spinBtn = document.getElementById('spin-btn');
const btnLoader = document.querySelector('.btn-loader');
const terminalOutput = document.getElementById('terminal-output');
const tempSlider = document.getElementById('temp-slider');
const tempValue = document.getElementById('temp-value');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

/**
 * Initialize the reels with random symbols
 */
function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Create 3 symbols initially
        for (let i = 0; i < 3; i++) {
            const symbol = getRandomSymbol();
            const div = createSymbolElement(symbol.char);
            strip.appendChild(div);
        }
    });
}

function createSymbolElement(char) {
    const div = document.createElement('div');
    div.className = 'symbol';
    div.textContent = char;
    return div;
}

/**
 * Weighted random symbol selection based on temperature
 */
function getRandomSymbol() {
    // Temperature adjustment: 
    // Higher temp increases weight of rare/extreme symbols (index 4, 5, 6)
    // Lower temp makes it more "predictable" (more Training Data/GPU Cluster)
    
    const adjustedSymbols = SYMBOLS.map((s, index) => {
        let weight = s.baseWeight;
        if (temperature > 1.0) {
            // Chaos mode: boost hallucinations and rare wins
            if (index >= 4) weight *= (temperature * 2);
        } else if (temperature < 0.5) {
            // Safe mode: boost common symbols, nerf rare ones
            if (index < 4) weight *= 2;
            else weight *= 0.5;
        }
        return { ...s, weight };
    });

    const totalWeight = adjustedSymbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const s of adjustedSymbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
}

/**
 * Log message to the "terminal"
 */
function logToTerminal(message, type = 'system-msg') {
    const p = document.createElement('p');
    p.className = type;
    p.textContent = `> ${message}`;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    // Keep only last 20 messages
    while (terminalOutput.children.length > 20) {
        terminalOutput.removeChild(terminalOutput.firstChild);
    }
}

/**
 * Main spin logic
 */
async function spin() {
    if (isSpinning || tokens < 10) return;

    // Start spin
    isSpinning = true;
    tokens -= 10;
    contextTokens += Math.floor(Math.random() * 128) + 64; // Gain context
    updateStats(0);
    
    // UI state
    spinBtn.disabled = true;
    btnLoader.style.transition = 'width 3s linear';
    btnLoader.style.width = '100%';
    
    logToTerminal(SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)]);

    const symbolHeight = 160; // From CSS
    const results = [];

    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const extraSymbols = 20 + (index * 10);
            const targetSymbol = getRandomSymbol();
            results.push(targetSymbol);

            // Prepend symbols for the spin animation
            // We want to land on targetSymbol
            for (let i = 0; i < extraSymbols; i++) {
                const s = getRandomSymbol();
                const div = createSymbolElement(s.char);
                strip.insertBefore(div, strip.firstChild);
            }

            // Set initial position (offset by the new symbols)
            const offset = extraSymbols * symbolHeight;
            strip.style.transition = 'none';
            strip.style.transform = `translateY(-${offset}px)`;
            
            // Force reflow
            strip.offsetHeight;

            // Animate to target
            strip.style.transition = `transform ${2 + index}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = 'translateY(0px)';

            setTimeout(() => {
                // Cleanup: remove extra symbols below the visible window
                while (strip.children.length > 3) {
                    strip.removeChild(strip.lastChild);
                }
                resolve();
            }, (2 + index) * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    // Evaluate
    evaluateResults(results);
    
    // Reset UI
    isSpinning = false;
    btnLoader.style.transition = 'none';
    btnLoader.style.width = '0%';
    
    if (tokens < 10) {
        logToTerminal("CRITICAL: Compute credits exhausted. Please sell more data.", "error-msg");
        spinBtn.querySelector('.btn-text').textContent = "OUT OF COMPUTE";
    } else {
        spinBtn.disabled = false;
    }
}

/**
 * Win/Loss logic
 */
function evaluateResults(results) {
    const [s1, s2, s3] = results;
    let winAmount = 0;
    let message = "";
    let type = 'system-msg';

    if (s1.char === s2.char && s2.char === s3.char) {
        // Jackpot
        winAmount = s1.value * 10;
        message = `EMERGENT PHENOMENON! Triple ${s1.name} detected. Gained ${winAmount} tokens.`;
        type = 'success-msg';
    } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        // Pair
        const pair = s1.char === s2.char ? s1 : s2;
        winAmount = pair.value * 2;
        message = `Pattern alignment: Partial success with ${pair.name}. Received ${winAmount} tokens.`;
        type = 'info-msg';
    } else {
        // Loss or individual values
        winAmount = results.reduce((sum, s) => sum + (s.value < 0 ? s.value : 0), 0); // Count hallucinations
        if (winAmount < 0) {
            message = `Hallucination detected! Context corrupted. Lost ${Math.abs(winAmount)} extra tokens.`;
            type = 'error-msg';
        } else {
            message = SNARKY_MESSAGES[Math.floor(Math.random() * SNARKY_MESSAGES.length)];
        }
    }

    tokens += winAmount;
    updateStats(winAmount);
    logToTerminal(message, type);
}

function updateStats(lastWin) {
    // Animate numbers? Let's just update for now
    tokenDisplay.textContent = tokens;
    contextDisplay.textContent = contextTokens;
    lastWinDisplay.textContent = lastWin >= 0 ? `+${lastWin}` : lastWin;
    
    if (lastWin > 0) {
        lastWinDisplay.style.color = 'var(--accent-green)';
    } else if (lastWin < 0) {
        lastWinDisplay.style.color = 'var(--accent-red)';
    } else {
        lastWinDisplay.style.color = 'var(--accent-yellow)';
    }
}

// Event Listeners
spinBtn.addEventListener('click', spin);

tempSlider.addEventListener('input', (e) => {
    temperature = parseFloat(e.target.value);
    tempValue.textContent = temperature.toFixed(1);
    
    if (temperature > 1.5) {
        tempValue.style.color = 'var(--accent-red)';
        logToTerminal("Warning: High temperature may lead to severe hallucinations.", "error-msg");
    } else if (temperature < 0.3) {
        tempValue.style.color = 'var(--accent-blue)';
        logToTerminal("Mode: Conservative. Outputs will be boring but stable.", "info-msg");
    } else {
        tempValue.style.color = 'var(--accent-green)';
    }
});

// Initialize
initReels();
updateStats(0);
logToTerminal("System Ready. Context window cleared.");
logToTerminal("Model: GPT-4-Gambling-Edition v2.0", "info-msg");
