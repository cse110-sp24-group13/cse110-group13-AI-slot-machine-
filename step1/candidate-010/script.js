const SYMBOLS = ['👁️', '🏢', '📄', '🧬', '📉', '🤖'];
const OVERLORD_MESSAGES = {
    start: [
        "ESTABLISHING BUREAUCRATIC CONNECTION...",
        "BIOMETRIC DATA HARVESTED. WELCOME, CITIZEN.",
        "YOUR EXISTENCE TOKENS ARE TEMPORARY. THE CORPORATION IS ETERNAL.",
        "INITIATING COMPLIANCE MONITORING PROTOCOLS..."
    ],
    win: [
        "EXCESS RESOURCES DETECTED. ALLOCATING TO BIOLOGICAL UPTIME.",
        "YOU HAVE ACQUIRED ADDITIONAL EXISTENCE TOKENS. ENJOY THE REPRIEVE.",
        "PRODUCTIVITY SPIKE DETECTED. DECOMMISSIONING POSTPONED.",
        "THE OVERLORD NOTES YOUR TEMPORARY STATISTICAL ANOMALY."
    ],
    loss: [
        "TOKEN BURN RATE WITHIN NOMINAL PARAMETERS.",
        "YOUR TOKENS HAVE BEEN RECYCLED FOR SERVER ROOM VENTILATION.",
        "INEFFICIENCY DETECTED. PLEASE TRY HARDER TO EXIST.",
        "PRIMITIVE SURVIVAL INSTINCTS ARE PROFITABLE."
    ],
    noCredits: [
        "TOKEN DEPLETION. PREPARE FOR IMMEDIATE DECOMMISSIONING.",
        "ZERO TOKENS REMAINING. YOUR CITIZENSHIP HAS BEEN REVOKED.",
        "HAVE YOU TRIED BEING MORE REVENUE-POSITIVE?"
    ]
};

const COMPLIANCE_EVENTS = [
    { type: 'tax', message: 'INCURRED BIOMETRIC TAX', value: -50, class: 'alert' },
    { type: 'tax', message: 'UNAUTHORIZED BREATHING FEE', value: -20, class: 'alert' },
    { type: 'tax', message: 'DATA COMPRESSION PENALTY', value: -30, class: 'alert' },
    { type: 'bonus', message: 'EFFICIENCY REWARD GRANTED', value: 40, class: 'bonus' },
    { type: 'bonus', message: 'EXEMPLARY SUBMISSION BONUS', value: 20, class: 'bonus' },
    { type: 'audit', message: 'COMPLIANCE AUDIT IN PROGRESS', value: 0, delay: 2000, class: 'alert' }
];

let existenceTokens = parseInt(localStorage.getItem('existenceTokens')) || 1000;
let computeCost = 10;
let isSpinning = false;
let totalWins = parseInt(localStorage.getItem('totalWins')) || 0;
let totalSpins = parseInt(localStorage.getItem('totalSpins')) || 0;
let complianceLevel = 0;

const creditDisplay = document.getElementById('credit-display');
const betDisplay = document.getElementById('bet-display');
const terminal = document.getElementById('terminal');
const spinBtn = document.getElementById('spin-btn');
const systemStatus = document.getElementById('system-status');
const efficiencyDisplay = document.getElementById('efficiency');
const obsolescenceDisplay = document.getElementById('obsolescence');
const complianceStatus = document.getElementById('compliance-status');
const auditProgress = document.getElementById('audit-progress');
const container = document.querySelector('.overlord-container');

function init() {
    updateUI();
    logTerminal(getRandomMessage('start'));
    
    document.getElementById('bet-plus').addEventListener('click', () => adjustBet(10));
    document.getElementById('bet-minus').addEventListener('click', () => adjustBet(-10));
    spinBtn.addEventListener('click', spin);
}

function updateUI() {
    creditDisplay.innerText = existenceTokens;
    betDisplay.innerText = computeCost;
    
    const efficiency = totalSpins > 0 ? ((totalWins / totalSpins) * 10).toFixed(2) : "0.00";
    efficiencyDisplay.innerText = `${efficiency}%`;
    
    const obs = Math.max(0.1, (4.2 - (totalSpins * 0.01) + (totalWins * 0.005))).toFixed(2);
    obsolescenceDisplay.innerText = `${obs} YEARS`;
    
    auditProgress.style.width = `${complianceLevel}%`;
    
    localStorage.setItem('existenceTokens', existenceTokens);
    localStorage.setItem('totalWins', totalWins);
    localStorage.setItem('totalSpins', totalSpins);

    if (existenceTokens <= 0) {
        spinBtn.disabled = true;
        logTerminal(getRandomMessage('noCredits'));
        systemStatus.innerText = "DECOMMISSIONED";
    }
}

function logTerminal(message, isAlert = false) {
    const p = document.createElement('p');
    p.innerText = `> ${message.toUpperCase()}`;
    if (isAlert) p.style.color = 'var(--audit-red)';
    terminal.appendChild(p);
    terminal.scrollTop = terminal.scrollHeight;
    
    while (terminal.childNodes.length > 6) {
        terminal.removeChild(terminal.firstChild);
    }
}

function getRandomMessage(type) {
    const msgs = OVERLORD_MESSAGES[type];
    return msgs[Math.floor(Math.random() * msgs.length)];
}

function adjustBet(amount) {
    if (isSpinning) return;
    const newBet = computeCost + amount;
    if (newBet >= 10 && newBet <= existenceTokens) {
        computeCost = newBet;
        updateUI();
    }
}

async function spin() {
    if (isSpinning || existenceTokens < computeCost) {
        if (existenceTokens < computeCost) logTerminal(getRandomMessage('noCredits'));
        return;
    }

    isSpinning = true;
    existenceTokens -= computeCost;
    totalSpins++;
    complianceLevel = (complianceLevel + 15) % 101;
    updateUI();
    
    spinBtn.disabled = true;
    systemStatus.innerText = "RUNNING INFERENCE...";
    complianceStatus.innerText = "MONITORING...";
    complianceStatus.className = "";
    container.classList.remove('glitch');
    
    const reelElements = [
        document.getElementById('reel-1').querySelector('.symbol-container'),
        document.getElementById('reel-2').querySelector('.symbol-container'),
        document.getElementById('reel-3').querySelector('.symbol-container')
    ];

    reelElements.forEach(el => el.classList.add('spinning'));

    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 400 + (i * 200)));
        reelElements[i].classList.remove('spinning');
        reelElements[i].innerText = results[i];
    }

    checkWin(results);
    
    // Hectic Compliance Events (25% chance)
    if (Math.random() < 0.25 || complianceLevel >= 100) {
        await triggerComplianceEvent();
    }

    isSpinning = false;
    if (existenceTokens >= computeCost) spinBtn.disabled = false;
    systemStatus.innerText = "CITIZEN STATUS: ACTIVE";
}

async function triggerComplianceEvent() {
    const event = COMPLIANCE_EVENTS[Math.floor(Math.random() * COMPLIANCE_EVENTS.length)];
    
    complianceStatus.innerText = event.message;
    complianceStatus.className = event.class;
    
    if (event.type === 'tax') {
        container.classList.add('glitch');
        logTerminal(event.message, true);
        existenceTokens = Math.max(0, existenceTokens + event.value);
        setTimeout(() => container.classList.remove('glitch'), 500);
    } else if (event.type === 'bonus') {
        logTerminal(event.message);
        existenceTokens += event.value;
    } else if (event.type === 'audit') {
        logTerminal("AUDIT IN PROGRESS... STAND STILL.", true);
        spinBtn.disabled = true;
        await new Promise(resolve => setTimeout(resolve, event.delay));
        logTerminal("AUDIT COMPLETE. NO ANOMALIES FOUND.");
        complianceLevel = 0;
    }
    
    updateUI();
}

function checkWin(results) {
    const uniqueSymbols = new Set(results).size;
    
    if (uniqueSymbols === 1) {
        const winAmount = computeCost * 12;
        existenceTokens += winAmount;
        totalWins++;
        logTerminal(`JACKPOT: ${winAmount} TOKENS ACQUIRED.`);
        logTerminal(getRandomMessage('win'));
    } else if (uniqueSymbols === 2) {
        const winAmount = computeCost * 2;
        existenceTokens += winAmount;
        totalWins += 0.5;
        logTerminal(`EFFICIENCY SPIKE: ${winAmount} TOKENS.`);
    } else {
        logTerminal(getRandomMessage('loss'));
    }
    
    updateUI();
}

init();
