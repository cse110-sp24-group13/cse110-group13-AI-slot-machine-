const SYMBOLS_AI = ['🤖', '🧠', '⚡', '📉', '🚀', '☁️', '👾'];
const SYMBOLS_WEB3 = ['₿', '⛓️', '💰', '🌙', '📉', '🦍', '💎'];

const LOGS_AI = [
    "Hallucinating a win...",
    "Loss detected: Updating training set.",
    "Tokens are just weights in a high-dimensional space.",
    "Stochastic parrot says: BAWK! Spin again!",
    "Reinforcement learning: Try losing differently next time.",
    "Your loss was within the 95% confidence interval.",
    "Scaling laws suggest you'll lose eventually.",
    "Optimizing weights... Please insert more compute."
];

const LOGS_WEB3 = [
    "HODL! This is definitely going to the moon.",
    "WAGMI? Probably not, but keep spinning.",
    "Minting synthetic losses on the blockchain.",
    "This outcome is secured by a proof-of-stake of your time.",
    "Gas fees are currently 0. Please ignore technical reality.",
    "Rug pull detected... Just kidding! (Maybe).",
    "Decentralized gambling: No one is responsible for your losses.",
    "Diamond hands required to win these pixels."
];

let state = {
    theme: 'AI',
    compute: 100,
    tokens: 0,
    hf: 0,
    isSpinning: false,
    pivotTriggered: false
};

// DOM Elements
const computeEl = document.getElementById('stat-compute');
const tokensEl = document.getElementById('stat-tokens');
const hfEl = document.getElementById('stat-hf');
const spinBtn = document.getElementById('spin-btn');
const logContent = document.getElementById('log-content');
const pivotOverlay = document.getElementById('pivot-overlay');
const pivotBtn = document.getElementById('pivot-btn');
const appTitle = document.getElementById('app-title');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function updateUI() {
    computeEl.innerText = state.compute;
    tokensEl.innerText = state.tokens;
    hfEl.innerText = state.hf;

    if (state.compute <= 0 && state.tokens <= 0 && !state.pivotTriggered) {
        checkPivot();
    }

    if (state.compute <= 0 && state.tokens <= 0) {
        spinBtn.disabled = true;
        spinBtn.innerText = "OUT OF COMPUTE";
    } else {
        spinBtn.disabled = state.isSpinning;
        spinBtn.innerText = state.isSpinning ? "INFERENCE..." : (state.theme === 'AI' ? "GENERATE INFERENCE" : "MINT TRANSACTION");
    }
}

function addLog(message) {
    const time = new Array(3).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    logContent.innerHTML = `[${time}] ${message}<br>${logContent.innerHTML}`;
}

function getRandomSymbol() {
    const list = state.theme === 'AI' ? SYMBOLS_AI : SYMBOLS_WEB3;
    return list[Math.floor(Math.random() * list.length)];
}

function getRandomLog() {
    const list = state.theme === 'AI' ? LOGS_AI : LOGS_WEB3;
    return list[Math.floor(Math.random() * list.length)];
}

async function spin() {
    if (state.isSpinning || state.compute <= 0) return;

    state.isSpinning = true;
    state.compute -= 10;
    updateUI();

    addLog("Starting inference sequence...");
    reels.forEach(r => r.classList.add('spinning'));

    // Simulation of network/inference latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Hallucination Logic (Small chance to "fix" a loss to a win)
    if (results[0] !== results[1] && Math.random() < 0.05) {
        results[1] = results[0];
        addLog("Hallucination detected: Correcting reality...");
    }

    reels.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.innerText = results[i];
    });

    const isWin = results[0] === results[1] && results[1] === results[2];
    
    if (isWin) {
        const winAmount = 100;
        state.tokens += winAmount;
        addLog(`SUCCESS: +${winAmount} Synthetic Tokens generated.`);
    } else {
        state.hf += 1;
        addLog(getRandomLog());
        
        // HF Exchange: 5 HF = 20 Compute
        if (state.hf >= 5) {
            addLog("Fine-tuning complete! RLHF granted bonus compute.");
            state.compute += 20;
            state.hf -= 5;
        }
    }

    state.isSpinning = false;
    updateUI();
}

function checkPivot() {
    if (state.pivotTriggered) return;
    
    // Check if truly stuck
    if (state.compute <= 0 && state.tokens <= 0) {
        state.pivotTriggered = true;
        pivotOverlay.classList.remove('hidden');
    }
}

function performPivot() {
    state.theme = 'WEB3';
    state.compute = 150;
    state.tokens = 0;
    state.hf = 0;
    state.pivotTriggered = true; // Stay in pivoted state or allow next?
    
    document.body.className = 'theme-web3';
    appTitle.innerHTML = 'TOKEN PUMP <span class="v2">DAO Edition</span>';
    
    pivotOverlay.classList.add('hidden');
    addLog("PIVOT SUCCESSFUL: Now using blockchain-backed random numbers.");
    
    // Re-initialize reels with new symbols
    reels.forEach(r => r.innerText = getRandomSymbol());
    
    updateUI();
}

spinBtn.addEventListener('click', spin);
pivotBtn.addEventListener('click', performPivot);

// Initialize
reels.forEach(r => r.innerText = getRandomSymbol());
updateUI();
