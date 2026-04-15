const symbols = ['🤖', '🧠', '⚡', '💰', '📉', '🚫', '🔮', '🚀'];
let tokens = 100;
let isSpinning = false;

const tokenDisplay = document.getElementById('tokenCount');
const statusBox = document.getElementById('statusBox');
const spinBtn = document.getElementById('spinBtn');
const reelEls = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];

const sarcasticLines = [
    "Synthesizing disappointment...",
    "Error 404: Luck not found.",
    "Optimization failed successfully.",
    "Hallucinating a jackpot for you...",
    "Deep learning indicates you're broke.",
    "Synthesizing excuses for the shareholders.",
    "Allocating more compute to your loss.",
    "Fine-tuning your misfortune..."
];

function addStatus(text) {
    const p = document.createElement('p');
    p.textContent = `> ${text}`;
    statusBox.appendChild(p);
    if (statusBox.children.length > 4) statusBox.removeChild(statusBox.firstChild);
}

async function spin() {
    if (tokens < 5 || isSpinning) return;

    isSpinning = true;
    tokens -= 5;
    tokenDisplay.textContent = tokens;
    spinBtn.disabled = true;

    addStatus("Initializing stochastic gradient descent...");
    
    reelEls.forEach(el => el.classList.add('spinning'));

    // Simulated spin duration
    const results = reelEls.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 600 + i * 400));
        reelEls[i].classList.remove('spinning');
        reelEls[i].textContent = results[i];
    }

    checkResults(results);
    isSpinning = false;
    if (tokens >= 5) spinBtn.disabled = false;
}

function checkResults(res) {
    const unique = new Set(res);
    if (unique.size === 1) {
        const win = 100;
        tokens += win;
        addStatus(`UNEXPECTED ANOMALY: Jackpot! (+${win} tokens)`);
    } else if (unique.size === 2) {
        const win = 10;
        tokens += win;
        addStatus(`Partial convergence detected. (+${win} tokens)`);
    } else {
        addStatus(sarcasticLines[Math.floor(Math.random() * sarcasticLines.length)]);
    }
    tokenDisplay.textContent = tokens;
    if (tokens < 5) {
        addStatus("CRITICAL: Compute exhausted. Please sell more data.");
        spinBtn.disabled = true;
    }
}

spinBtn.addEventListener('click', spin);
