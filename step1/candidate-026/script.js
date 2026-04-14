const symbols = ['🤖', '🧠', '🔋', '✨', '☣️', '📉'];
const spinBtn = document.getElementById('spin-btn');
const tokensDisplay = document.getElementById('tokens');
const lossDisplay = document.getElementById('loss');
const terminalBody = document.getElementById('terminal-body');
const betSizeSelector = document.getElementById('bet-size');

let tokens = 1000;

const logMessages = [
    "Optimizing loss function...",
    "Injecting venture capital...",
    "Scaling parameters to 7T...",
    "Hallucinating success...",
    "Fine-tuning ethics module... [FAILED]",
    "Discarding common sense for scale...",
    "Generating synthetic data...",
    "Minimizing human oversight...",
    "Red-teaming sanity...",
    "Compressing reality...",
    "Predicting next token: 'Profit' (99.2%)",
    "GPU temperature critical. Continuing...",
    "Re-calibrating reward model...",
    "Overfitting to user desires..."
];

// Initialize reels
function initReels() {
    for (let i = 1; i <= 3; i++) {
        const strip = document.querySelector(`#reel-${i} .reel-strip`);
        populateStrip(strip);
    }
}

function populateStrip(strip) {
    strip.innerHTML = '';
    for (let i = 0; i < 40; i++) {
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';
        symbolDiv.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        strip.appendChild(symbolDiv);
    }
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    
    if (terminalBody.children.length > 20) {
        terminalBody.removeChild(terminalBody.firstChild);
    }
}

async function spin() {
    const betSize = parseInt(betSizeSelector.value);
    
    if (tokens < betSize) {
        addLog("CRITICAL ERROR: Insufficient compute tokens. Reduce hyperparameters.");
        return;
    }

    tokens -= betSize;
    tokensDisplay.textContent = tokens;
    spinBtn.disabled = true;

    addLog(logMessages[Math.floor(Math.random() * logMessages.length)]);

    const results = [];
    const reels = [1, 2, 3];
    
    const spinPromises = reels.map((id, index) => {
        return new Promise(resolve => {
            const strip = document.querySelector(`#reel-${id} .reel-strip`);
            
            // Re-populate to keep it fresh
            populateStrip(strip);

            const targetIndex = Math.floor(Math.random() * 10) + 25;
            const targetSymbol = strip.children[targetIndex].textContent;
            results.push(targetSymbol);

            const offset = targetIndex * 100;
            strip.style.transition = 'none';
            strip.style.transform = `translateY(0)`;
            
            strip.offsetHeight; // trigger reflow

            strip.style.transition = `transform ${2 + index * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            strip.style.transform = `translateY(-${offset}px)`;

            setTimeout(() => {
                resolve();
            }, (2 + index * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);

    checkWin(results, betSize);
    spinBtn.disabled = false;
    lossDisplay.textContent = (Math.random() * 0.5).toFixed(4);
}

function checkWin(results, betSize) {
    const [s1, s2, s3] = results;
    const multiplier = betSize / 10;
    
    if (s1 === s2 && s2 === s3) {
        let winAmount = 0;
        switch(s1) {
            case '🤖': winAmount = 500 * multiplier; break;
            case '🧠': winAmount = 250 * multiplier; break;
            case '🔋': winAmount = 100 * multiplier; break;
            case '✨': winAmount = 1000 * multiplier; break;
            case '☣️': winAmount = -100 * multiplier; addLog("REINFORCEMENT LEARNING ERROR: Hallucination detected."); break;
            case '📉': winAmount = -50 * multiplier; addLog("MODEL COLLAPSE: Overfitting detected."); break;
        }

        if (winAmount > 0) {
            tokens += winAmount;
            tokensDisplay.textContent = tokens;
            addLog(`SUCCESS: Emergent behavior observed. +${winAmount} tokens.`);
        } else if (winAmount < 0) {
            tokens = Math.max(0, tokens + winAmount);
            tokensDisplay.textContent = tokens;
        }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        addLog("Partial match. No significant convergence.");
    } else {
        addLog("Noise detected. Iterating...");
    }
}

spinBtn.addEventListener('click', spin);
initReels();
addLog("Neural Network loaded. Awaiting inference request.");
