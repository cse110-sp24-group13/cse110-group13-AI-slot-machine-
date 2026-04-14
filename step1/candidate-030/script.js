const symbols = ['🤖', '🔌', '💥', '💎', '⚡', '🧠'];
const messages = [
    "Predicting your next loss with 99.9% confidence...",
    "Hallucinating a jackpot... just kidding.",
    "Model collapsing into nonsense. Try again.",
    "Scaling to zero... please hold.",
    "Injecting venture capital... 100% loss expected.",
    "Gradient descent complete. We found a local minima (you).",
    "Awaiting GPU allocation from the cloud gods.",
    "Prompt: 'Give me money.' - Result: Error 404.",
    "Backpropping your disappointment into the weights.",
    "Generating AI-powered failure...",
    "Token usage exceeded. Please purchase more hype."
];

let credits = 100;
const spinCost = 5;

const creditsEl = document.getElementById('credits');
const tempEl = document.getElementById('temp');
const messageEl = document.getElementById('message');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');

function updateUI() {
    creditsEl.textContent = credits;
    tempEl.textContent = `${40 + Math.floor(Math.random() * 60)}°C`;
    if (credits < spinCost) {
        spinBtn.disabled = true;
    } else {
        spinBtn.disabled = false;
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomMessage() {
    return `> ${messages[Math.floor(Math.random() * messages.length)]}`;
}

async function spin() {
    if (credits < spinCost) return;

    credits -= spinCost;
    updateUI();
    messageEl.textContent = "> Optimizing neural architecture...";
    spinBtn.disabled = true;

    // Start spin animation
    reels.forEach(reel => {
        reel.classList.add('spinning');
    });

    const results = [];
    
    // Stop reels one by one
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 500));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reels[i].classList.remove('spinning');
        reels[i].innerHTML = `<div class="symbol">${symbol}</div>`;
    }

    checkWin(results);
    spinBtn.disabled = credits < spinCost;
}

function checkWin(results) {
    const uniqueSymbols = new Set(results).size;
    let winAmount = 0;

    if (uniqueSymbols === 1) {
        // Jackpot!
        winAmount = 50;
        messageEl.textContent = "> AGI ACHIEVED! (Profit: 50 Credits)";
        messageEl.style.color = "var(--neon-purple)";
    } else if (uniqueSymbols === 2) {
        // Partial match
        winAmount = 10;
        messageEl.textContent = "> Feature Extracted! (Profit: 10 Credits)";
        messageEl.style.color = "var(--neon-green)";
    } else {
        // No match
        messageEl.textContent = getRandomMessage();
        messageEl.style.color = "var(--neon-green)";
    }

    credits += winAmount;
    updateUI();
}

spinBtn.addEventListener('click', spin);

resetBtn.addEventListener('click', () => {
    credits = 100;
    messageEl.textContent = "> Hype level restored. Model refreshed.";
    messageEl.style.color = "var(--neon-green)";
    updateUI();
});

// Initial UI update
updateUI();
