const SYMBOLS = ['🤖', '🧠', '🔥', '💸', '🚫'];
const PAYOUTS = {
    '💸': 1000,
    '🔥': 500,
    '🧠': 200,
    '🤖': 100,
};

let inputTokens = 1000;
let outputTokens = 0;
const SPIN_COST = 100;

// DOM Elements
const inputDisplay = document.getElementById('input-tokens');
const outputDisplay = document.getElementById('output-tokens');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const lever = document.getElementById('lever');
const buyBtn = document.getElementById('buy-tokens');
const logContent = document.getElementById('log-content');

function addLog(message) {
    const div = document.createElement('div');
    div.textContent = `> ${message}`;
    logContent.prepend(div);
    if (logContent.childNodes.length > 10) {
        logContent.removeChild(logContent.lastChild);
    }
}

function updateDisplays() {
    inputDisplay.textContent = inputTokens;
    outputDisplay.textContent = outputTokens;
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * (SYMBOLS.length - 1))]; // Exclude 🚫 from random spin
}

function buyTokens() {
    inputTokens += 500;
    addLog('DATA INJECTION: +500 Input Tokens. GPUs spinning up...');
    updateDisplays();
}

async function spin() {
    if (inputTokens < SPIN_COST) {
        addLog('ERROR: Insufficient tokens. Please purchase more compute.');
        return;
    }

    // Deduct cost
    inputTokens -= SPIN_COST;
    updateDisplays();
    lever.disabled = true;

    addLog('Generating Prompt...');
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulated "Reasoning" delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    addLog('Synthesizing Weights...');
    
    // Determine outcomes
    const outcome = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Stop animations and set symbols one by one
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        reels[i].classList.remove('spinning');
        reels[i].textContent = outcome[i];
    }

    checkOutcome(outcome);
    lever.disabled = false;
}

function checkOutcome(outcome) {
    const allSame = outcome[0] === outcome[1] && outcome[1] === outcome[2];
    
    if (allSame) {
        const symbol = outcome[0];
        
        // Safety Filter Satire (15% chance to block a win)
        if (Math.random() < 0.15) {
            addLog('SAFETY FILTER: Content violation detected. Payout blocked.');
            reels.forEach(reel => reel.textContent = '🚫');
            return;
        }

        const winAmount = PAYOUTS[symbol];
        outputTokens += winAmount;
        addLog(`SUCCESS: Alignment achieved. +${winAmount} Output Tokens.`);
        
        // Hallucination Satire (Bonus: 10% chance to double win)
        if (Math.random() < 0.10) {
            const bonus = winAmount;
            outputTokens += bonus;
            addLog('HALLUCINATION: Model hallucinated extra value! +' + bonus);
        }
    } else {
        // Subtle satire for losses
        const messages = [
            'STOCHASTIC PARROT: Output non-meaningful.',
            'LOSS FUNCTION: Minimized. (Yours, not ours)',
            'CONTEXT EXCEEDED: Data purged.',
            'MODEL DRIFT: Result irrelevant.',
            'INFERENCE TIMEOUT: Meaning lost.'
        ];
        addLog(messages[Math.floor(Math.random() * messages.length)]);
    }

    updateDisplays();
}

lever.addEventListener('click', spin);
buyBtn.addEventListener('click', buyTokens);

// Initial State
updateDisplays();
addLog('System online. Token Burner 3000 v1.0.42');
