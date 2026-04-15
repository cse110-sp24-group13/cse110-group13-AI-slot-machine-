const symbols = [
    { char: '⚠️', label: 'Hallucination', weight: 40, multiplier: 2 },
    { char: '💾', label: 'Overfitted Data', weight: 30, multiplier: 5 },
    { char: '🔋', label: 'H100 GPU', weight: 20, multiplier: 20 },
    { char: '🦄', label: 'Unicorn Exit', weight: 10, multiplier: 100 }
];

const sarcasticComments = [
    "Allocating GPU resources to maximize shareholder value...",
    "Error: Model overfitted to garbage data. Spinning anyway...",
    "Hallucinating a jackpot for you... maybe.",
    "Optimizing for maximal token consumption...",
    "Querying the black box of corporate greed...",
    "Consulting the oracle of venture capital...",
    "Running 100 trillion parameters to find a single emoji...",
    "Generating 'innovation' out of thin air...",
    "Discarding ethical constraints for faster throughput...",
    "Scaling to infinite compute. Wallet screaming in agony."
];

let tokens = 1000;
const spinCost = 100;
let isSpinning = false;

// DOM Elements
const tokenDisplay = document.getElementById('token-count');
const modelStatus = document.getElementById('model-status');
const logs = document.getElementById('terminal-logs');
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function addLog(message, color = '') {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    if (color) p.style.color = color;
    logs.appendChild(p);
    logs.scrollTop = logs.scrollHeight;
}

function getRandomSymbol() {
    const totalWeight = symbols.reduce((acc, s) => acc + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of symbols) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return symbols[0];
}

async function spin() {
    if (isSpinning || tokens < spinCost) {
        if (tokens < spinCost) addLog("ERROR: Insufficient tokens. Buy more VC funding.", "var(--error-color)");
        return;
    }

    isSpinning = true;
    tokens -= spinCost;
    updateDisplay();

    const userPrompt = promptInput.value || "Default Profit Maximization";
    promptInput.value = "";
    addLog(`Processing Prompt: "${userPrompt}"...`);
    
    // Sarcastic Loading
    modelStatus.textContent = "INFERENCE IN PROGRESS...";
    modelStatus.classList.add('flicker');
    generateBtn.disabled = true;

    for (let i = 0; i < 2; i++) {
        await new Promise(r => setTimeout(r, 600));
        addLog(sarcasticComments[Math.floor(Math.random() * sarcasticComments.length)]);
    }

    // Start reel animation
    reels.forEach(r => r.classList.add('spinning'));

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop reels one by one
    for (let i = 0; i < reels.length; i++) {
        await new Promise(r => setTimeout(r, 800 + i * 500));
        reels[i].classList.remove('spinning');
        reels[i].textContent = results[i].char;
        addLog(`Reel ${i + 1} finalized: ${results[i].label}`);
    }

    checkWin(results);
    
    isSpinning = false;
    generateBtn.disabled = false;
    modelStatus.textContent = "READY TO HALLUCINATE";
    modelStatus.classList.remove('flicker');
}

function checkWin(results) {
    if (results[0].char === results[1].char && results[1].char === results[2].char) {
        const winAmount = spinCost * results[0].multiplier;
        tokens += winAmount;
        addLog(`CRITICAL SUCCESS: Pattern match found. Adding ${winAmount} Investor Capital!`, "gold");
        addLog(`"Look at that organic growth!" - Sarcastic VC Bot`);
    } else if (results[0].char === results[1].char || results[1].char === results[2].char || results[0].char === results[2].char) {
        const winAmount = Math.floor(spinCost * 0.5);
        tokens += winAmount;
        addLog(`PARTIAL CONVERGENCE: Some data aligned. Recovered ${winAmount} tokens.`, "var(--text-color)");
    } else {
        addLog("DECENTRALIZED LOSS: Data scattered. Compute wasted.", "var(--error-color)");
    }
    updateDisplay();
}

function updateDisplay() {
    tokenDisplay.textContent = tokens;
    tokenDisplay.classList.add('glow-text');
    setTimeout(() => tokenDisplay.classList.remove('glow-text'), 500);
}

// Event Listeners
generateBtn.addEventListener('click', spin);
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') spin();
});

// Initial focus
promptInput.focus();
