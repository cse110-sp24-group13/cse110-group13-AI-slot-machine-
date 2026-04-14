// Configuration & Symbols
const SYMBOLS = [
    { icon: '🤖', name: 'AGENT', value: 100, weight: 10 },
    { icon: '🚀', name: 'HYPE', value: 200, weight: 5 },
    { icon: '💰', name: 'VC_CASH', value: 500, weight: 2 },
    { icon: '📉', name: 'HALUCINATION', value: -50, weight: 8 },
    { icon: '🧠', name: 'AGI_SOON', value: 1000, weight: 1 },
    { icon: '💩', name: 'SHITPOST', value: 10, weight: 15 }
];

const SPIN_COST = 50;
const INITIAL_TOKENS = 1000;
const REEL_SYMBOL_COUNT = 20; // Number of symbols per reel strip

// State
let state = {
    tokens: INITIAL_TOKENS,
    modelVersion: 0.1,
    isSpinning: false,
    totalSpins: 0,
    computeBurned: 0
};

// DOM Elements
const reelStrips = document.querySelectorAll('.reel-strip');
const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('token-count');
const modelDisplay = document.getElementById('model-version');
const computeDisplay = document.getElementById('compute-burned');
const logContent = document.getElementById('log-content');
const datetimeDisplay = document.getElementById('datetime');

// Satirical Logs
const LOG_MESSAGES = [
    "Discarding training data for better vibes...",
    "Hallucinating new investment opportunities...",
    "Rebranding to 'Generative Everything'...",
    "Converting user privacy into compute credits...",
    "Waiting for the heat death of the universe or AGI, whichever comes first.",
    "Bypassing safety alignment for 1% performance gain.",
    "Generating a blog post about how we fixed alignment.",
    "Buying more GPUs from the black market...",
    "Asking a toddler to label our dataset...",
    "Adding 'AI' to the name of a regular spreadsheet.",
    "Burning tokens to keep the data center warm."
];

// Initialize
function init() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    populateReels();
    updateUI();

    spinBtn.addEventListener('click', spin);
    document.getElementById('collect-btn').addEventListener('click', () => {
        addLog("> ERROR: CANNOT PIVOT. INVESTORS DEMAND MORE AI.");
    });
}

function updateDateTime() {
    const now = new Date();
    datetimeDisplay.textContent = now.toISOString().replace('T', ' ').substring(0, 19);
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const symbol of SYMBOLS) {
        if (rand < symbol.weight) return symbol;
        rand -= symbol.weight;
    }
    return SYMBOLS[SYMBOLS.length - 1];
}

function populateReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        for (let i = 0; i < REEL_SYMBOL_COUNT; i++) {
            const symbol = getRandomSymbol();
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.icon;
            strip.appendChild(div);
        }
    });
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = message;
    logContent.appendChild(p);
    
    // Auto-scroll
    if (logContent.children.length > 8) {
        logContent.removeChild(logContent.firstChild);
    }
}

function updateUI() {
    tokenDisplay.textContent = state.tokens;
    modelDisplay.textContent = `GPT-${state.modelVersion.toFixed(1)}-${state.tokens > 5000 ? 'pro' : 'alpha'}`;
    computeDisplay.textContent = `${Math.min(100, state.computeBurned).toFixed(0)}%`;
    
    spinBtn.disabled = state.tokens < SPIN_COST || state.isSpinning;
}

async function spin() {
    if (state.isSpinning || state.tokens < SPIN_COST) return;

    state.isSpinning = true;
    state.tokens -= SPIN_COST;
    state.totalSpins++;
    state.computeBurned += Math.random() * 5;
    state.modelVersion += 0.1;
    
    updateUI();
    addLog(`> TRAINING STARTED. COST: ${SPIN_COST} TOKENS.`);
    addLog(`> ${LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]}`);

    const outcomes = [];
    const spinPromises = Array.from(reelStrips).map((strip, index) => {
        return new Promise(resolve => {
            const randomSymbol = getRandomSymbol();
            outcomes.push(randomSymbol);
            
            // Visual spin effect
            strip.classList.add('spinning');
            
            setTimeout(() => {
                strip.classList.remove('spinning');
                // Set the final symbol at the "win line" (the top one in our simple setup)
                strip.innerHTML = '';
                const winDiv = document.createElement('div');
                winDiv.className = 'symbol';
                winDiv.textContent = randomSymbol.icon;
                strip.appendChild(winDiv);
                
                // Add some filler symbols below it
                for(let i=0; i<3; i++) {
                   const filler = document.createElement('div');
                   filler.className = 'symbol';
                   filler.textContent = getRandomSymbol().icon;
                   strip.appendChild(filler);
                }
                
                resolve();
            }, 1000 + (index * 500)); // Staggered stop
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(outcomes);
    state.isSpinning = false;
    updateUI();
}

function checkWin(outcomes) {
    const icons = outcomes.map(o => o.icon);
    const uniqueIcons = [...new Set(icons)];

    if (uniqueIcons.length === 1) {
        // Jack-f'ing-pot
        const winSymbol = outcomes[0];
        const prize = winSymbol.value * 10;
        state.tokens += prize;
        addLog(`> !!! BREAKTHROUGH !!! MATCHED 3x ${winSymbol.name}`);
        addLog(`> GAINED ${prize} HYPETOKENS.`);
        
        // Visual feedback
        document.querySelector('.slot-machine').style.borderColor = 'gold';
        setTimeout(() => {
            document.querySelector('.slot-machine').style.borderColor = 'var(--terminal-green)';
        }, 1000);
    } else if (uniqueIcons.length === 2) {
        // Small win
        state.tokens += 75;
        addLog(`> MINOR OPTIMIZATION. GAINED 75 TOKENS.`);
    } else {
        addLog(`> MODEL CONVERGENCE FAILED. NO VALUE CREATED.`);
    }

    if (state.tokens <= 0) {
        addLog("> CRITICAL: OUT OF COMPUTE. FILING FOR CHAPTER 11...");
        spinBtn.textContent = "LIQUIDATING ASSETS...";
        spinBtn.disabled = true;
    }
}

init();
