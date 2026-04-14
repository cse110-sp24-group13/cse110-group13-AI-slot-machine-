const SYMBOLS = [
    { icon: '🧠', name: 'AGI', value: 100 },
    { icon: '💸', name: 'VC_FUNDING', value: 50 },
    { icon: '🤖', name: 'LLM', value: 20 },
    { icon: '🖥️', name: 'GPU_CLUSTER', value: 10 },
    { icon: '🌫️', name: 'HALLUCINATION', value: 0 }
];

const BULLSHIT_PHRASES = [
    "Aligning incentives with disruptive paradigms...",
    "Token velocity exceeding local minima...",
    "Injecting synthetic empathy into the weights...",
    "Hallucinating a sustainable business model...",
    "Optimizing for synergy-driven growth metrics...",
    "Scraping the internet for redundant data...",
    "Our model is 0.002% less biased than yesterday.",
    "Scaling to infinite compute. Please wait.",
    "Decentralizing the neural fabric...",
    "Pivoting to a prompt-first architecture...",
    "Waiting for the AGI to solve this spin...",
    "Burn rate currently sustainable for 4 more minutes."
];

let balance = 1000;
let currentBet = 10;
let isSpinning = false;

const reelStrips = document.querySelectorAll('.reel-strip');
const spinBtn = document.getElementById('spin-btn');
const balanceDisplay = document.getElementById('token-balance');
const betDisplay = document.getElementById('current-bet');
const logContent = document.getElementById('log-content');
const betBtns = document.querySelectorAll('.bet-btn');

// Initialize reels
function initReels() {
    reelStrips.forEach(strip => {
        // Create a long strip for spinning effect
        for (let i = 0; i < 30; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = symbol.icon;
            strip.appendChild(div);
        }
        
        // Ensure the last few symbols match our SYMBOLS array exactly so we can land on them
        SYMBOLS.forEach(s => {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = s.icon;
            strip.appendChild(div);
        });
    });
}

function addLog(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message.toUpperCase()}`;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
}

function updateUI() {
    balanceDisplay.textContent = balance;
    betDisplay.textContent = currentBet;
    spinBtn.disabled = isSpinning || balance < currentBet;
}

async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    balance -= currentBet;
    updateUI();
    addLog(`DEDUCTING ${currentBet} TOKENS FOR INFERENCE...`);
    addLog(BULLSHIT_PHRASES[Math.floor(Math.random() * BULLSHIT_PHRASES.length)]);

    const results = [];
    const animationPromises = [];

    reelStrips.forEach((strip, index) => {
        const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
        const symbol = SYMBOLS[randomIndex];
        results.push(symbol);

        const symbolHeight = 150;
        const totalSymbols = strip.children.length;
        // Landing index in the "fixed" section at the end
        const landingIndex = totalSymbols - SYMBOLS.length + randomIndex;
        const targetPos = landingIndex * symbolHeight;
        
        strip.style.transition = 'none';
        strip.style.transform = `translateY(0)`;
        strip.offsetHeight; // force reflow

        strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        strip.style.transform = `translateY(-${targetPos}px)`;

        animationPromises.push(new Promise(resolve => {
            setTimeout(resolve, 2000 + index * 500);
        }));
    });

    await Promise.all(animationPromises);

    isSpinning = false;
    checkWin(results);
    updateUI();
}

function checkWin(results) {
    const icons = results.map(r => r.icon);
    let winAmount = 0;

    if (icons[0] === icons[1] && icons[1] === icons[2]) {
        // 3 of a kind
        const symbol = results[0];
        winAmount = currentBet * symbol.value;
        if (symbol.name === 'HALLUCINATION') {
            addLog("CRITICAL ERROR: THREE-FOLD HALLUCINATION DETECTED.");
            addLog("PUNITIVE TOKEN BURN INITIATED.");
            balance = Math.max(0, balance - (currentBet * 10));
            winAmount = 0;
        } else {
            addLog(`JACKPOT! ${symbol.name} SYNERGY ACHIEVED.`);
            addLog(`GENERATED ${winAmount} SYNTHETIC TOKENS.`);
        }
    } else if (icons[0] === icons[1] || icons[1] === icons[2] || icons[0] === icons[2]) {
        // 2 of a kind
        const pairIcon = icons[0] === icons[1] ? icons[0] : icons[1];
        const symbol = SYMBOLS.find(s => s.icon === pairIcon);
        winAmount = currentBet * (symbol.value / 5);
        addLog(`MINOR CONVERGENCE: ${symbol.name} STACK DETECTED.`);
        addLog(`RECOVERY: ${winAmount} TOKENS.`);
    } else {
        addLog("INFERENCE COMPLETE. RESULT: NOISE.");
    }

    balance += Math.floor(winAmount);
    updateUI();
}

// Event Listeners
spinBtn.addEventListener('click', spin);

betBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isSpinning) return;
        betBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBet = parseInt(btn.dataset.bet);
        updateUI();
        addLog(`COMPUTE INTENSITY SET TO ${currentBet}`);
    });
});

// Initialize
initReels();
updateUI();
addLog("SYSTEM READY. FEED THE MODEL.");
