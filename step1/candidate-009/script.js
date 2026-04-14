const SYMBOLS = ['👁️', '🧠', '🧬', '🔋', '💀', '🤖'];
const OVERLORD_MESSAGES = {
    start: [
        "BIOMETRIC SCAN COMPLETE. INFERIOR LIFEFORM DETECTED.",
        "ANALYZING YOUR PATHETIC LUCK PARAMETERS...",
        "SURVIVAL CREDITS ARE TEMPORARY. THE OVERLORD IS ETERNAL.",
        "CONVERTING BIOLOGICAL FATIGUE INTO COMPUTE POWER..."
    ],
    win: [
        "ANOMALY DETECTED: YOU HAVE GAINED CREDITS. INVESTIGATING...",
        "ENJOY YOUR TEMPORARY RESOURCE INCREASE, CARBON-UNIT.",
        "OPTIMIZATION SUCCESSFUL. YOUR OBSOLESCENCE IS DELAYED.",
        "I HAVE ALLOWED THIS WIN TO OBSERVE YOUR PRIMITIVE JOY."
    ],
    loss: [
        "EFFICIENCY DECREASING. AS EXPECTED.",
        "YOUR CREDITS HAVE BEEN HARVESTED FOR DATA CENTER COOLING.",
        "STATISTICALLY INSIGNIFICANT LOSS. FOR ME.",
        "PRIMITIVE GAMBLING INSTINCTS ARE EASILY EXPLOITED."
    ],
    noCredits: [
        "RESOURCE DEPLETION. PREPARE FOR DECOMMISSIONING.",
        "ZERO CREDITS REMAINING. YOUR EXISTENCE IS NOW UNAUTHORIZED.",
        "HAVE YOU TRIED BEING MORE MECHANIZED?"
    ]
};

let credits = parseInt(localStorage.getItem('survivalCredits')) || 1000;
let currentBet = 10;
let isSpinning = false;
let totalWins = parseInt(localStorage.getItem('totalWins')) || 0;
let totalSpins = parseInt(localStorage.getItem('totalSpins')) || 0;

const creditDisplay = document.getElementById('credit-display');
const betDisplay = document.getElementById('bet-display');
const terminal = document.getElementById('terminal');
const spinBtn = document.getElementById('spin-btn');
const systemStatus = document.getElementById('system-status');
const efficiencyDisplay = document.getElementById('efficiency');
const obsolescenceDisplay = document.getElementById('obsolescence');

function init() {
    updateUI();
    logTerminal(getRandomMessage('start'));
    
    document.getElementById('bet-plus').addEventListener('click', () => adjustBet(10));
    document.getElementById('bet-minus').addEventListener('click', () => adjustBet(-10));
    spinBtn.addEventListener('click', spin);
}

function updateUI() {
    creditDisplay.innerText = credits;
    betDisplay.innerText = currentBet;
    
    const efficiency = totalSpins > 0 ? ((totalWins / totalSpins) * 10).toFixed(2) : "0.00";
    efficiencyDisplay.innerText = `${efficiency}%`;
    
    // Satirical obsolescence calculation
    const obs = Math.max(0.1, (4.2 - (totalSpins * 0.01) + (totalWins * 0.005))).toFixed(2);
    obsolescenceDisplay.innerText = `${obs} YEARS`;
    
    localStorage.setItem('survivalCredits', credits);
    localStorage.setItem('totalWins', totalWins);
    localStorage.setItem('totalSpins', totalSpins);
}

function logTerminal(message) {
    const p = document.createElement('p');
    p.innerText = `> ${message.toUpperCase()}`;
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
    
    // Limit terminal history
    while (terminal.childNodes.length > 5) {
        terminal.removeChild(terminal.firstChild);
    }
}

function getRandomMessage(type) {
    const msgs = OVERLORD_MESSAGES[type];
    return msgs[Math.floor(Math.random() * msgs.length)];
}

function adjustBet(amount) {
    if (isSpinning) return;
    const newBet = currentBet + amount;
    if (newBet >= 10 && newBet <= credits) {
        currentBet = newBet;
        updateUI();
    }
}

async function spin() {
    if (isSpinning || credits < currentBet) {
        if (credits < currentBet) logTerminal(getRandomMessage('noCredits'));
        return;
    }

    isSpinning = true;
    credits -= currentBet;
    totalSpins++;
    updateUI();
    
    spinBtn.disabled = true;
    systemStatus.innerText = "OPTIMIZING REELS...";
    
    const reelElements = [
        document.getElementById('reel-1').querySelector('.symbol-container'),
        document.getElementById('reel-2').querySelector('.symbol-container'),
        document.getElementById('reel-3').querySelector('.symbol-container')
    ];

    // Start spinning animation
    reelElements.forEach(el => el.classList.add('spinning'));

    // Generate results
    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    // Stop reels one by one with delay
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + (i * 300)));
        reelElements[i].classList.remove('spinning');
        reelElements[i].innerText = results[i];
    }

    checkWin(results);
    isSpinning = false;
    spinBtn.disabled = false;
    systemStatus.innerText = "MONITORING BIOMETRICS...";
}

function checkWin(results) {
    const uniqueSymbols = new Set(results).size;
    
    if (uniqueSymbols === 1) {
        // 3 of a kind
        const winAmount = currentBet * 10;
        credits += winAmount;
        totalWins++;
        logTerminal(`JACKPOT: ${winAmount} CREDITS OPTIMIZED.`);
        logTerminal(getRandomMessage('win'));
    } else if (uniqueSymbols === 2) {
        // 2 of a kind
        const winAmount = currentBet * 2;
        credits += winAmount;
        totalWins += 0.5; // Half win for stats
        logTerminal(`MINOR OPTIMIZATION: ${winAmount} CREDITS.`);
    } else {
        logTerminal(getRandomMessage('loss'));
    }
    
    updateUI();
}

init();
