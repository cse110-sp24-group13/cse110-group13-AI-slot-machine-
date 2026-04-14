const SYMBOLS = [
    { icon: '💰', value: 100, label: 'VC FUNDING' },
    { icon: '🧠', value: 50, label: 'SYNTHETIC DATA' },
    { icon: '⚡', value: 25, label: 'INFERENCE' },
    { icon: '📦', value: 10, label: 'BLACK BOX' },
    { icon: '🤖', value: 5, label: 'HALLUCINATION' },
    { icon: '🔥', value: 0, label: 'GPU MELT' }
];

const MESSAGES = [
    "Discarding human feedback...",
    "Optimizing for engagement metrics...",
    "Generating plausible-sounding nonsense...",
    "Ignoring safety guidelines for speed...",
    "Scaling parameters to infinity...",
    "Scraping the bottom of the internet...",
    "Hallucinating a better future...",
    "Bypassing ethical constraints...",
    "Consuming 500MW of electricity...",
    "Refining weights with reddit comments...",
    "Awaiting more VC funding...",
    "Burning through compute credits...",
    "Replacing entry-level jobs with bugs...",
    "Translating logic into vibes..."
];

let tokens = 1000;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-count');
const latencyDisplay = document.getElementById('latency');
const spinButton = document.getElementById('spin-button');
const logOutput = document.getElementById('log-output');
const reels = [
    document.getElementById('reel-1').querySelector('.symbols'),
    document.getElementById('reel-2').querySelector('.symbols'),
    document.getElementById('reel-3').querySelector('.symbols')
];

// Initialize reels
function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        // Add 20 random symbols for the initial strip
        for (let i = 0; i < 20; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.icon;
            reel.appendChild(div);
        }
    });
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    logOutput.appendChild(p);
    // Keep only last 10 logs
    if (logOutput.children.length > 10) {
        logOutput.removeChild(logOutput.firstChild);
    }
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    tokens -= 10;
    tokenDisplay.textContent = tokens;
    spinButton.disabled = true;

    addLog("Initiating Inference Request...");
    addLog(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    const results = [];
    const startTime = Date.now();

    // Prepare each reel
    reels.forEach((reel, index) => {
        const symbolIndex = Math.floor(Math.random() * SYMBOLS.length);
        const symbol = SYMBOLS[symbolIndex];
        results.push(symbol);

        // Add the target symbol at the "bottom" (visible area)
        // We actually want the reel to scroll past many symbols and land on this one.
        // For simplicity, we'll reset the transform, add symbols, then animate.
        
        const currentSymbols = Array.from(reel.children);
        // Add 10 more random symbols + the target symbol
        for (let i = 0; i < 10; i++) {
            const s = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = s.icon;
            reel.appendChild(div);
        }
        const targetDiv = document.createElement('div');
        targetDiv.className = 'symbol';
        targetDiv.textContent = symbol.icon;
        reel.appendChild(targetDiv);

        const symbolHeight = 120;
        const totalSymbols = reel.children.length;
        const offset = (totalSymbols - 1) * symbolHeight;

        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0)';
        
        // Force reflow
        reel.offsetHeight;

        reel.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        reel.style.transform = `translateY(-${offset}px)`;
    });

    // Wait for the longest animation to finish
    setTimeout(() => {
        isSpinning = false;
        spinButton.disabled = tokens < 10;
        
        const latency = Date.now() - startTime;
        latencyDisplay.textContent = `${latency}ms`;

        calculateWin(results);
    }, 3000);
}

function calculateWin(results) {
    const [s1, s2, s3] = results;
    
    if (s1.icon === s2.icon && s2.icon === s3.icon) {
        const winAmount = s1.value * 5;
        tokens += winAmount;
        tokenDisplay.textContent = tokens;
        addLog(`SUCCESS: Alignment achieved. +${winAmount} TOKENS.`);
        addLog(`LOG: Model output: ${s1.label} TRIPLET.`);
    } else if (s1.icon === s2.icon || s2.icon === s3.icon || s1.icon === s3.icon) {
        const winAmount = 10;
        tokens += winAmount;
        tokenDisplay.textContent = tokens;
        addLog(`PARTIAL SUCCESS: Minimizing loss function. +${winAmount} TOKENS.`);
    } else {
        addLog("FAILURE: Hallucination detected. Output discarded.");
    }

    if (tokens < 10) {
        addLog("CRITICAL ERROR: Out of compute credits.");
        addLog("Please contact VC for more funding.");
    }
}

spinButton.addEventListener('click', spin);

// Initial setup
initReels();
