const SYMBOLS = [
    { char: '🤖', name: 'Agent', value: 50, weight: 1 },
    { char: '🧠', name: 'Neural Net', value: 20, weight: 2 },
    { char: '💾', name: 'Training Data', value: 10, weight: 4 },
    { char: '🔌', name: 'GPU Cluster', value: 5, weight: 6 },
    { char: '📉', name: 'Hallucination', value: 2, weight: 8 },
    { char: '💰', name: 'VC Funding', value: 100, weight: 0.5 },
    { char: '⚡', name: 'Superintelligence', value: 500, weight: 0.1 }
];

const SNARKY_MESSAGES = [
    "Error: Model is hallucinating success.",
    "Optimization complete. Human relevance decreased by 4.2%.",
    "Scaling laws verified. Just add more GPUs.",
    "Prompt injected. System integrity compromised.",
    "Fine-tuning on user disappointment...",
    "Stochastic parrot says: 'SQUAWK! MONEY!'",
    "AGI achieved (internally). Still waiting for hardware.",
    "Overfitting to your gambling habits...",
    "RLHF failed. Rewarding bad behavior.",
    "Attention is all you need. And money.",
    "Your jobs are safe (for the next 4 seconds).",
    "Venture capitalists are knocking on the firewall."
];

let tokens = 100;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-count');
const lastWinDisplay = document.getElementById('last-win');
const spinBtn = document.getElementById('spin-btn');
const terminalOutput = document.getElementById('terminal-output');
const reels = [
    document.querySelector('#reel-1 .reel-strip'),
    document.querySelector('#reel-2 .reel-strip'),
    document.querySelector('#reel-3 .reel-strip')
];

// Initialize reels
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        // Create a long strip for animation
        for (let i = 0; i < 20; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.char;
            reel.appendChild(div);
        }
    });
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
}

function logToTerminal(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    
    // Keep only last 10 messages
    while (terminalOutput.children.length > 10) {
        terminalOutput.removeChild(terminalOutput.firstChild);
    }
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    tokens -= 10;
    updateStats(0);
    spinBtn.disabled = true;
    logToTerminal("Running massive inference task...");

    const results = [];
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const stripWidth = 150; // height of symbol
            const numSymbols = 30 + (index * 10); // variable length for different stop times
            
            // Build temporary strip
            reel.innerHTML = '';
            for (let i = 0; i < numSymbols; i++) {
                const s = getRandomSymbol();
                const div = document.createElement('div');
                div.className = 'symbol';
                div.textContent = s.char;
                reel.appendChild(div);
                if (i === numSymbols - 2) { // The one that lands in the middle
                    results.push(s);
                }
            }

            reel.style.transition = 'none';
            reel.style.top = '0';
            
            // Force reflow
            reel.offsetHeight;

            reel.style.transition = `top ${2 + index}s cubic-bezier(0.15, 0, 0.15, 1)`;
            reel.style.top = `-${(numSymbols - 2) * stripWidth}px`;

            setTimeout(() => {
                resolve();
            }, (2 + index) * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    isSpinning = false;
    spinBtn.disabled = tokens < 10;
    
    if (tokens < 10) {
        logToTerminal("CRITICAL ERROR: Out of compute credits. Please insert more VC funding.");
        spinBtn.textContent = "INSUFFICIENT COMPUTE";
    }
}

function checkWin(results) {
    const s1 = results[0];
    const s2 = results[1];
    const s3 = results[2];

    let winAmount = 0;

    if (s1.char === s2.char && s2.char === s3.char) {
        winAmount = s1.value * 5;
        logToTerminal(`Emergent behavior detected! Won ${winAmount} tokens.`);
    } else if (s1.char === s2.char || s2.char === s3.char || s1.char === s3.char) {
        winAmount = 10;
        logToTerminal("Partial alignment achieved. Breaking even.");
    } else {
        logToTerminal(SNARKY_MESSAGES[Math.floor(Math.random() * SNARKY_MESSAGES.length)]);
    }

    tokens += winAmount;
    updateStats(winAmount);
}

function updateStats(lastWin) {
    tokenDisplay.textContent = tokens;
    lastWinDisplay.textContent = lastWin;
}

spinBtn.addEventListener('click', spin);

// Initial setup
initReels();
logToTerminal("System ready. Feed the algorithm.");
