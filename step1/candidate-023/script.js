const symbols = ['🤖', '🧠', '⚡', '📉', '🍄', '💰', '📡', '🧩'];
const weights = [0.15, 0.15, 0.15, 0.2, 0.1, 0.05, 0.1, 0.1]; // Probability for each symbol

let tokens = 1000;
let currentBet = 50;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-balance');
const betDisplay = document.getElementById('current-bet');
const spinButton = document.getElementById('spin-button');
const log = document.getElementById('message-log');
const gpuTempDisplay = document.getElementById('gpu-temp');

const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

const messages = [
    "Synthesizing hallucinations...",
    "Optimizing loss function...",
    "Re-routing through neural pathways...",
    "Querying vector database...",
    "Increasing temperature for creativity...",
    "Wait, that's not a dog, it's a blueberry muffin...",
    "Scraping the internet for inspiration...",
    "Compressing reality into weights...",
    "Consulting the silicon gods...",
    "Tokenizing the universe..."
];

const winMessages = [
    "SUCCESS: Emergent behavior detected!",
    "PROFIT: Benchmarks exceeded!",
    "VALUE: Venture capital secured!",
    "BOOM: AGl achieved (locally)!"
];

const loseMessages = [
    "ERROR: Hallucination detected.",
    "FAILED: Model collapsed.",
    "OOF: Compute costs too high.",
    "SAD: Parameter mismatch."
];

function updateDisplay() {
    tokenDisplay.textContent = tokens;
    betDisplay.textContent = currentBet;
    spinButton.disabled = tokens < currentBet || isSpinning;
}

function addLog(message, color = null) {
    const entry = document.createElement('div');
    entry.innerHTML = `> ${message}`;
    if (color) entry.style.color = color;
    log.prepend(entry);
    
    // Keep only last 10 logs
    if (log.childNodes.length > 10) {
        log.removeChild(log.lastChild);
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function setGPUTemp(temp) {
    gpuTempDisplay.textContent = `${temp}°C`;
    gpuTempDisplay.style.color = temp > 80 ? '#ff3333' : (temp > 60 ? '#ff9900' : 'var(--neon-blue)');
}

async function spin() {
    if (isSpinning || tokens < currentBet) return;

    isSpinning = true;
    tokens -= currentBet;
    updateDisplay();
    
    addLog(messages[Math.floor(Math.random() * messages.length)]);
    setGPUTemp(Math.floor(Math.random() * 20) + 60);

    // Start animation
    reels.forEach(reel => {
        reel.querySelector('.reel-content').classList.add('spinning');
    });

    // Random spin duration for each reel
    const results = [];
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 400));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reels[i].querySelector('.reel-content').classList.remove('spinning');
        reels[i].querySelector('.reel-content').textContent = symbol;
    }

    isSpinning = false;
    evaluate(results);
    setGPUTemp(Math.floor(Math.random() * 10) + 35);
}

function evaluate(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;

    if (r1 === r2 && r2 === r3) {
        // Jackpot
        winAmount = currentBet * 10;
        if (r1 === '💰') winAmount = currentBet * 50;
        if (r1 === '📉') winAmount = 0; // The "Market Crash" symbol
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Small win
        winAmount = currentBet * 2;
        if (results.includes('📉')) winAmount = Math.floor(winAmount / 2);
    }

    if (winAmount > 0) {
        tokens += winAmount;
        addLog(`${winMessages[Math.floor(Math.random() * winMessages.length)]} +${winAmount} tokens`, 'var(--neon-blue)');
        reels.forEach(r => r.classList.add('win-glow'));
        setTimeout(() => reels.forEach(r => r.classList.remove('win-glow')), 1000);
    } else {
        addLog(loseMessages[Math.floor(Math.random() * loseMessages.length)], '#ff3333');
    }

    updateDisplay();
}

// Event Listeners
spinButton.addEventListener('click', spin);

document.getElementById('bet-plus').addEventListener('click', () => {
    if (currentBet < tokens) {
        currentBet += 50;
        updateDisplay();
    }
});

document.getElementById('bet-minus').addEventListener('click', () => {
    if (currentBet > 50) {
        currentBet -= 50;
        updateDisplay();
    }
});

// Initial update
updateDisplay();
