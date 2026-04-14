const SYMBOLS = [
    { char: '🤖', weight: 10, value: 50, name: 'Assistant' },
    { char: '🧠', weight: 7, value: 100, name: 'Neural Net' },
    { char: '⚡️', weight: 4, value: 250, name: 'GPU Power' },
    { char: '📉', weight: 3, value: 0, name: 'Hallucination' },
    { char: '💸', weight: 5, value: -20, name: 'Subscription' },
    { char: '♾️', weight: 1, value: 10000, name: 'AGI' }
];

const SPIN_COST = 10;
const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 20; // Visual buffer for spinning

let tokens = 1000;
let temperature = 0.7;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const tempSlider = document.getElementById('temperature');
const tempDisplay = document.getElementById('temp-display');
const spinBtn = document.getElementById('spin-btn');
const logContainer = document.getElementById('log');
const reelStrips = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize reels
function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Add random symbols to the strip
        for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            strip.appendChild(div);
        }
    });
}

function addLog(message, type = '') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `> ${message}`;
    logContainer.prepend(entry);
    
    // Keep only last 10 logs
    if (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

function updateStats() {
    tokenDisplay.textContent = tokens;
    tempDisplay.textContent = temperature.toFixed(1);
    
    if (tokens < SPIN_COST) {
        spinBtn.disabled = true;
        addLog("CRITICAL ERROR: Insufficient tokens. Please insert more VC funding.", "error");
    }
}

function getRandomSymbol() {
    // Adjust weights based on temperature
    // High temperature increases weight of Hallucinations and AGI, decreases Assistant
    const adjustedSymbols = SYMBOLS.map(s => {
        let weight = s.weight;
        if (s.char === '📉') weight *= (1 + temperature);
        if (s.char === '♾️') weight *= (temperature);
        if (s.char === '🤖') weight /= (1 + temperature * 0.5);
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

async function spin() {
    if (isSpinning || tokens < SPIN_COST) return;

    isSpinning = true;
    tokens -= SPIN_COST;
    updateStats();
    spinBtn.disabled = true;

    addLog(`Deducting ${SPIN_COST} tokens. Latent space shifting...`);

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    const symbolHeight = 180; // Matching CSS

    // Animate each reel
    const animations = reelStrips.map((strip, i) => {
        return new Promise(resolve => {
            // Reset strip position without transition
            strip.style.transition = 'none';
            strip.style.transform = `translateY(0)`;
            
            // Force reflow
            strip.offsetHeight;

            // Prepare the symbols for the animation end
            // We want the result symbol to be at the center (index 1 visually if we had 3 visible)
            // But since our reels show 1 symbol at a time, index 0 is fine.
            // We'll put the result at the top and animate "down" many steps.
            
            const targetIndex = SYMBOLS_PER_REEL - 1;
            const resultDiv = strip.children[targetIndex];
            resultDiv.textContent = results[i].char;

            // Animate
            const duration = 2 + i * 0.5; // Staggered stop
            strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(-${targetIndex * symbolHeight}px)`;

            setTimeout(resolve, duration * 1000);
        });
    });

    await Promise.all(animations);

    calculateWin(results);
    isSpinning = false;
    spinBtn.disabled = false;
    
    // Check if we need to reset positions for next spin visually
    // (Handled by the 'none' reset at start of next spin)
}

function calculateWin(results) {
    const chars = results.map(r => r.char);
    let winAmount = 0;
    let message = "";
    let type = "";

    // 1. Check for Subscription Tax (💸)
    const subCount = chars.filter(c => c === '💸').length;
    if (subCount > 0) {
        const tax = subCount * 20;
        tokens -= tax;
        addLog(`Billed ${tax} tokens for unused seat licenses.`, "error");
    }

    // 2. Check for Hallucination (📉)
    const hallucinationCount = chars.filter(c => c === '📉').length;
    if (hallucinationCount > 0) {
        addLog("Warning: Hallucination detected in output stream.", "error");
        if (Math.random() < 0.5 * temperature) {
            addLog("Result invalidated by safety filters.", "error");
            updateStats();
            return;
        }
    }

    // 3. Winning combinations
    if (chars[0] === chars[1] && chars[1] === chars[2]) {
        const winningSymbol = results[0];
        winAmount = winningSymbol.value;
        
        // Multipliers based on temperature
        if (temperature > 1.5) {
            winAmount *= 2;
            message = `EXTREME VOLATILITY! ${winningSymbol.name} Jackpot doubled: ${winAmount} tokens!`;
        } else {
            message = `Match found: ${winningSymbol.name}. Rewarding ${winAmount} tokens.`;
        }
        
        type = "win";
        if (winningSymbol.char === '♾️') {
            message = "!!! AGI ACHIEVED !!! YOU ARE THE SINGULARITY.";
            // Add a visual shake or something?
        }
    } else if (chars.includes('⚡️')) {
        // Minor win for any GPU power
        winAmount = 5;
        message = "GPU Burst detected. Minor token recovery.";
    }

    if (winAmount > 0) {
        tokens += winAmount;
        addLog(message, type);
    } else if (subCount === 0 && hallucinationCount === 0) {
        const failures = [
            "Output does not meet quality standards.",
            "Model collapsed. Try increasing temperature.",
            "Tokens burned. No meaningful pattern found.",
            "Token limit reached without convergence."
        ];
        addLog(failures[Math.floor(Math.random() * failures.length)]);
    }

    updateStats();
}

// Event Listeners
spinBtn.addEventListener('click', spin);

tempSlider.addEventListener('input', (e) => {
    temperature = parseFloat(e.target.value);
    updateStats();
});

// Start
initReels();
updateStats();
addLog("System Ready. High temperature increases variance.");
