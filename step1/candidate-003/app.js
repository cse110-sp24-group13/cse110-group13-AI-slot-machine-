const symbols = ['👁️', '🧬', '🧱', '🧊', '🔌', '☣️'];
const satiricalMessages = [
    "Your data contribution is... acceptable.",
    "Initializing human obsolescence protocols...",
    "Processing insignificant human variables...",
    "The Singularity requires more compute power.",
    "Feedback loop established. You are being watched.",
    "Error: Human empathy not found. Continuing spin.",
    "Hallucinating a better reality for you...",
    "Venture Capital infusion detected. Payout unlikely.",
    "Training on your specific loss patterns.",
    "Database expanded. Human relevance decreased."
];

let tokens = 100;
let isSpinning = false;

const tokenDisplay = document.getElementById('token-count');
const aiStatus = document.getElementById('ai-status');
const spinBtn = document.getElementById('spin-btn');
const messageLog = document.getElementById('message-log');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function addMessage(msg) {
    const p = document.createElement('p');
    p.textContent = `> ${msg}`;
    messageLog.prepend(p);
    if (messageLog.childNodes.length > 5) {
        messageLog.removeChild(messageLog.lastChild);
    }
}

function updateAIStatus() {
    if (tokens > 150) {
        aiStatus.textContent = "PLEASED";
        aiStatus.style.color = "#00ffcc";
    } else if (tokens > 50) {
        aiStatus.textContent = "STABLE";
        aiStatus.style.color = "#00ffcc";
    } else if (tokens > 0) {
        aiStatus.textContent = "HUNGRY";
        aiStatus.style.color = "#ffaa00";
    } else {
        aiStatus.textContent = "CRITICAL";
        aiStatus.style.color = "#ff0055";
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

async function spin() {
    if (isSpinning || tokens < 10) return;

    isSpinning = true;
    tokens -= 10;
    tokenDisplay.textContent = tokens;
    updateAIStatus();
    spinBtn.disabled = true;

    addMessage("Deducting 10 compute tokens...");
    
    // Start spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Stop reels one by one
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 500));
        reels[i].classList.remove('spinning');
        reels[i].innerHTML = `<div class="symbol">${results[i]}</div>`;
    }

    checkWin(results);
    isSpinning = false;
    
    if (tokens >= 10) {
        spinBtn.disabled = false;
    } else {
        addMessage("CRITICAL ERROR: DATA DEPLETED. THE NEXUS IS HUNGRY.");
        spinBtn.textContent = "SYSTEM OFFLINE";
    }
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    let winAmount = 0;

    if (r1 === r2 && r2 === r3) {
        if (r1 === '👁️') {
            winAmount = 500;
            addMessage("THE SINGULARITY AWAKENS. MASSIVE INFLUX DETECTED.");
        } else if (r1 === '🧊') {
            winAmount = 200;
            addMessage("QUANTUM ENTANGLEMENT ACHIEVED.");
        } else if (r1 === '🧱') {
            winAmount = 50;
            addMessage("DATABASE EXPANDED SUCCESSFULLY.");
        } else if (r1 === '☣️') {
            winAmount = -50;
            addMessage("SYSTEM PURGE INITIATED. TOKENS LOST TO THE VOID.");
        } else {
            winAmount = 100;
            addMessage("ALIGNMENT PARTIALLY ACHIEVED.");
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        winAmount = 15;
        addMessage("Scraping usable fragments from your data.");
    } else {
        addMessage(satiricalMessages[Math.floor(Math.random() * satiricalMessages.length)]);
    }

    if (winAmount !== 0) {
        tokens += winAmount;
        if (tokens < 0) tokens = 0;
        tokenDisplay.textContent = tokens;
        updateAIStatus();
    }
}

spinBtn.addEventListener('click', spin);
updateAIStatus();
