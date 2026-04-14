const symbols = ['🤖', '🧠', '💸', '🚀', '🌪️', '💩'];
let tokens = 1000;
let isSpinning = false;

const spinBtn = document.getElementById('spin-btn');
const pitchBtn = document.getElementById('pitch-btn');
const tokenCountDisplay = document.getElementById('token-count');
const messageArea = document.getElementById('message-area');
const hypeFill = document.getElementById('hype-fill');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Satirical messages
const winMessages = [
    "AGI Achieved! (Tokens are now worthless)",
    "VC funding secured! Burn it all!",
    "Neural Net scaled. Efficiency: questionable.",
    "Hype cycle peak! Sell now!",
    "GPU cluster acquired. Warming the planet."
];

const lossMessages = [
    "Prompt Hallucinated... tokens lost.",
    "Model collapsed. Sad.",
    "OpenSource fork failed. No stars.",
    "Safety filter triggered. Content rejected.",
    "Rate limited. Pay more tokens.",
    "Overfit! Generalization failed."
];

function initReels() {
    reels.forEach(reel => {
        reel.innerHTML = '';
        const initialSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        const span = document.createElement('span');
        span.textContent = initialSymbol;
        reel.appendChild(span);
    });
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    tokens -= 10;
    updateUI();
    
    messageArea.textContent = "Inferencing...";
    spinBtn.disabled = true;

    const results = [];
    const spinDurations = [1500, 2000, 2500];

    // Start spinning
    reels.forEach((reel, i) => {
        reel.classList.add('spinning');
        
        // Reset position for next spin
        reel.style.transition = 'none';
        reel.style.top = '0px';
        // Force reflow
        reel.offsetHeight;

        // Generate a random sequence for the "spin" effect
        const spinSequence = Array.from({ length: 15 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
        const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        results.push(finalSymbol);
        spinSequence.push(finalSymbol);

        reel.innerHTML = '';
        spinSequence.forEach(sym => {
            const span = document.createElement('span');
            span.textContent = sym;
            reel.appendChild(span);
        });

        // Use CSS transitions for the reel movement
        reel.style.transition = `top ${spinDurations[i]}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
        reel.style.top = `-${(spinSequence.length - 1) * 120}px`;
    });

    // Wait for the last reel to stop
    await new Promise(resolve => setTimeout(resolve, spinDurations[2]));

    reels.forEach(reel => {
        reel.classList.remove('spinning');
    });

    checkWin(results);
    isSpinning = false;
    spinBtn.disabled = false;
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;
    let message = "";

    if (r1 === r2 && r2 === r3) {
        // 3 of a kind
        switch (r1) {
            case '🤖': winAmount = 1000; break; // JACKPOT
            case '🧠': winAmount = 200; break;
            case '💸': winAmount = 100; break;
            case '🚀': winAmount = 50; break;
            default: winAmount = 20; break;
        }
        message = winMessages[Math.floor(Math.random() * winMessages.length)] + ` (+${winAmount})`;
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // 2 of a kind
        winAmount = 5;
        message = "Partial Convergence. Token rebate.";
    } else {
        message = lossMessages[Math.floor(Math.random() * lossMessages.length)];
    }

    tokens += winAmount;
    messageArea.textContent = message;
    updateUI();
}

function updateUI() {
    tokenCountDisplay.textContent = tokens;
    // Randomize hype meter a bit for aesthetic
    const hype = Math.min(100, Math.max(10, 20 + (tokens / 20)));
    hypeFill.style.width = `${hype}%`;

    if (tokens < 10) {
        spinBtn.textContent = "OUT OF COMPUTE";
        spinBtn.disabled = true;
    } else {
        spinBtn.textContent = "GENERATE TOKENS (10 🪙)";
    }
}

pitchBtn.addEventListener('click', () => {
    if (isSpinning) return;
    const boost = Math.floor(Math.random() * 50) + 10;
    tokens += boost;
    messageArea.textContent = `VC Pitch successful! Injected ${boost} tokens.`;
    updateUI();
});

spinBtn.addEventListener('click', spin);

// Initialize
initReels();
updateUI();
