const symbols = ['🤖', '🧠', '💰', '🔥', '☁️', '⚡', '🛸', '📉'];
const symbolWeights = {
    '🤖': 10, // Agent
    '🧠': 5,  // Model
    '💰': 2,  // Funding (Rare)
    '🔥': 15, // Hallucination (Common)
    '☁️': 12, // Cloud
    '⚡': 10, // Inference
    '🛸': 1,  // AGI (Super Rare)
    '📉': 15  // Market Crash
};

let tokens = 1000;
const spinCost = 50;

const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const tokenDisplay = document.getElementById('token-count');
const spinButton = document.getElementById('spin-button');
const eventLog = document.getElementById('event-log');
const statusText = document.getElementById('status-text');

function addLog(message, color = '#00ff41') {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    p.style.color = color;
    eventLog.prepend(p);
    if (eventLog.childNodes.length > 20) {
        eventLog.removeChild(eventLog.lastChild);
    }
}

function getRandomSymbol() {
    const pool = [];
    for (const [symbol, weight] of Object.entries(symbolWeights)) {
        for (let i = 0; i < weight; i++) {
            pool.push(symbol);
        }
    }
    return pool[Math.floor(Math.random() * pool.length)];
}

async function spin() {
    if (tokens < spinCost) {
        addLog("INSUFFICIENT TOKENS. PLEASE PURCHASE MORE GPU COMPUTE.", "#ff3e3e");
        return;
    }

    tokens -= spinCost;
    updateUI();
    
    spinButton.disabled = true;
    statusText.textContent = "INFERENCING... TOKENIZING PROMPT...";
    addLog(`Deducting ${spinCost} tokens for inference.`);

    const duration = 2000;
    const interval = 100;
    
    const reels = [reel1, reel2, reel3];
    const results = [];

    // Animation phase
    const spinIntervals = reels.map((reel, index) => {
        reel.classList.add('spinning');
        return setInterval(() => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, interval + (index * 20));
    });

    // Resolve phase
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + (i * 600)));
        clearInterval(spinIntervals[i]);
        reels[i].classList.remove('spinning');
        const finalSymbol = getRandomSymbol();
        reels[i].textContent = finalSymbol;
        results.push(finalSymbol);
        addLog(`Reel ${i+1} sampled: ${finalSymbol}`);
    }

    checkResults(results);
    spinButton.disabled = false;
}

function checkResults(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;
    let message = "";

    if (r1 === r2 && r2 === r3) {
        // Triple match
        if (r1 === '🛸') {
            winAmount = 10000;
            message = "SINGULARITY ACHIEVED! AGI IS HERE.";
        } else if (r1 === '💰') {
            winAmount = 2000;
            message = "SERIES A FUNDING SECURED! BURN RATE INCREASED.";
        } else if (r1 === '🧠') {
            winAmount = 1000;
            message = "MODEL CONVERGED. KNOWLEDGE DISTILLED.";
        } else if (r1 === '🔥') {
            winAmount = 0;
            message = "CRITICAL HALLUCINATION. SYSTEM PURGED.";
            tokens = Math.max(0, tokens - 200);
        } else {
            winAmount = 500;
            message = "TRIPLE MATCH DETECTED. OPTIMIZING OUTPUT.";
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Double match
        winAmount = 100;
        message = "PARTIAL ALIGNMENT SUCCESSFUL.";
    } else {
        message = "MODEL FAILED TO GENERALIZE. TRY ANOTHER SEED.";
    }

    if (winAmount > 0) {
        tokens += winAmount;
        statusText.textContent = message;
        addLog(`Success! Gained ${winAmount} tokens.`, "#00f3ff");
    } else {
        statusText.textContent = message;
        if (message.includes("HALLUCINATION")) {
            addLog(message, "#ff3e3e");
        } else {
            addLog("Inference completed with low confidence.");
        }
    }
    
    updateUI();
}

function updateUI() {
    tokenDisplay.textContent = tokens;
    if (tokens < spinCost) {
        spinButton.textContent = "OUT OF TOKENS";
        spinButton.disabled = true;
    }
}

spinButton.addEventListener('click', spin);

updateUI();
