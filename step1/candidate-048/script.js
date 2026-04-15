/**
 * COMPUTE_CASINO Game Logic
 */

const SYMBOLS = [
    { char: '🤖', name: 'AGI', value: 5000, msg: 'AGI ACHIEVED. SIMULATION TERMINATED (YOU WIN).' },
    { char: '💸', name: 'VC_FUNDING', value: 1000, msg: 'SERIES A SECURED. CASH OUT BEFORE THE CRASH.' },
    { char: '📈', name: 'TOKEN_INFLATION', value: 500, msg: 'TOKEN VALUE INCREASED BY 0.0001%. TO THE MOON.' },
    { char: '🧠', name: 'NEURAL_NET', value: 200, msg: 'MODEL CONVERGED. SMALL WEIGHT ADJUSTMENT GRANTED.' },
    { char: '🍄', name: 'HALLUCINATION', value: 100, msg: 'MODEL HALLUCINATED A WIN. WE WILL ALLOW IT.' },
    { char: '🔌', name: 'POWER_LOSS', value: 0, msg: 'SERVER RACK UNPLUGGED. DATA CORRUPTED.' }
];

const SPIN_COST = 100;
let tokens = 5000;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const logContent = document.getElementById('log-content');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

/**
 * Add a message to the terminal log
 */
function logMessage(message, color = '') {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    if (color) entry.style.color = color;
    entry.textContent = message;
    logContent.appendChild(entry);
    
    // Auto-scroll logic (though column-reverse handles newest at top)
}

/**
 * Random symbol selection
 */
function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

/**
 * Calculate win results
 */
function calculateResults(results) {
    const [s1, s2, s3] = results;
    
    // 3 of a kind
    if (s1.char === s2.char && s2.char === s3.char) {
        const winAmount = s1.value * 5;
        tokens += winAmount;
        reels.forEach(r => r.classList.add('win-effect'));
        setTimeout(() => reels.forEach(r => r.classList.remove('win-effect')), 2000);
        logMessage(`CRITICAL SUCCESS: 3x ${s1.name} DETECTED.`, '#39ff14');
        logMessage(s1.msg, '#00ffff');
        logMessage(`CREDITS ADDED: +${winAmount}`, '#ff00ff');
        return;
    }
    
    // 2 of a kind
    if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        const pair = (s1.char === s2.char) ? s1 : s3;
        const winAmount = pair.value;
        tokens += winAmount;
        reels.forEach((r, idx) => {
             // Basic logic to highlight the match
             if (idx === 0 && (s1.char === s2.char || s1.char === s3.char)) r.classList.add('win-effect');
             if (idx === 1 && (s1.char === s2.char || s2.char === s3.char)) r.classList.add('win-effect');
             if (idx === 2 && (s2.char === s3.char || s1.char === s3.char)) r.classList.add('win-effect');
        });
        setTimeout(() => reels.forEach(r => r.classList.remove('win-effect')), 2000);
        logMessage(`PARTIAL CONVERGENCE: 2x ${pair.name} MATCHED.`, '#39ff14');
        logMessage(`CREDITS ADDED: +${winAmount}`, '#ff00ff');
        return;
    }

    // Hallucination bonus (any 1 mushroom)
    if (results.some(s => s.char === '🍄')) {
        const hallucinations = results.filter(s => s.char === '🍄').length;
        const winAmount = 100 * hallucinations;
        tokens += winAmount;
        logMessage(`DEBUG: Hallucination detected. Model generating fake credits...`, '#ff00ff');
        logMessage(`CREDITS ADDED: +${winAmount}`, '#ff00ff');
        return;
    }

    // Loss
    logMessage("MODEL OUTPUT: Loss. Try increasing your learning rate.", '#4a4a4a');
}

/**
 * Handle the spin action
 */
async function spin() {
    if (isSpinning || tokens < SPIN_COST) {
        if (tokens < SPIN_COST) logMessage("INSUFFICIENT TOKENS. PLEASE INSERT VC CAPITAL.", "red");
        return;
    }

    isSpinning = true;
    tokens -= SPIN_COST;
    tokenDisplay.textContent = tokens;
    spinButton.disabled = true;

    logMessage(`EXECUTING PROMPT... COST: ${SPIN_COST} TOKENS.`);

    const results = [];
    
    // Start animations
    reels.forEach(reel => {
        const inner = reel.querySelector('.reel-inner');
        inner.classList.add('spinning');
    });

    // Staggered stop
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + (i * 400)));
        
        const symbol = getRandomSymbol();
        results.push(symbol);
        
        const inner = reels[i].querySelector('.reel-inner');
        inner.classList.remove('spinning');
        inner.textContent = symbol.char;
    }

    calculateResults(results);
    tokenDisplay.textContent = tokens;
    isSpinning = false;
    spinButton.disabled = false;

    if (tokens <= 0) {
        logMessage("FATAL ERROR: OUT OF COMPUTE. SHUTTING DOWN...", "red");
        spinButton.textContent = "SYSTEM_HALTED";
        spinButton.disabled = true;
    }
}

// Event Listeners
spinButton.addEventListener('click', spin);

// Keyboard shortcut (Space)
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !spinButton.disabled) {
        spin();
    }
});
