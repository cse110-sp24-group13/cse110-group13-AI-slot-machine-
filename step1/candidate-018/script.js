const symbols = ['🤖', '⚡', '🧠', '🍄', '📉', '💰'];
const reelElements = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];
const spinBtn = document.getElementById('spin-btn');
const creditDisplay = document.getElementById('credit-count');
const weightDisplay = document.getElementById('weight-count');
const statusMessage = document.getElementById('status-message');
const winOverlay = document.getElementById('win-overlay');
const winTitle = document.getElementById('win-title');
const winAmountText = document.getElementById('win-amount');
const closeOverlayBtn = document.getElementById('close-overlay');

let credits = 100;
let weights = 0;
const COST = 10;

const snarkyMessages = [
    "Optimizing backpropagation...",
    "Crawling the web for high-quality slop...",
    "Tokenizing the universe...",
    "Distilling model into 4-bit...",
    "Refining the prompt to 'do everything'...",
    "Ignoring safety alignment for SPEED...",
    "Injecting venture capital directly into the GPU...",
    "Hallucinating a sustainable business model...",
    "Pivot to Crypto? No, stay the course!",
    "Searching for more training data... found Reddit."
];

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateStats() {
    creditDisplay.textContent = credits;
    weightDisplay.textContent = weights;
    
    if (credits < COST) {
        spinBtn.disabled = true;
        statusMessage.textContent = "OUT OF COMPUTE. Please wait for Government Subsidy...";
        setTimeout(() => {
            if (credits < COST) {
                credits += 50;
                statusMessage.textContent = "Taxpayer bailout received! +50 Credits.";
                updateStats();
            }
        }, 5000);
    } else {
        spinBtn.disabled = false;
    }
}

function checkWin(results) {
    const unique = [...new Set(results)];
    
    // 3 of a kind
    if (unique.length === 1) {
        if (results[0] === '🍄') {
            credits = Math.max(0, credits - 50);
            return { type: 'loss', msg: "TOTAL HALLUCINATION!", amount: "-50 Credits" };
        }
        if (results[0] === '📉') {
            credits = Math.max(0, credits - 100);
            return { type: 'loss', msg: "MODEL COLLAPSE!", amount: "RESETTING WEIGHTS" };
        }
        credits += 100;
        weights += 1;
        return { type: 'win', msg: "AGI ACHIEVED (Hypothetically)!", amount: "+100 Credits & +1 Model Weight" };
    }
    
    // 2 of a kind
    if (unique.length === 2) {
        credits += 20;
        return { type: 'win', msg: "FUNDING ROUND SECURED!", amount: "+20 Credits" };
    }

    // Special single symbol penalties
    if (results.includes('🍄')) {
        credits = Math.max(0, credits - 5);
        return { type: 'penalty', msg: "Minor Hallucination detected.", amount: "-5 Credits" };
    }

    return null;
}

function spin() {
    if (credits < COST) return;
    
    credits -= COST;
    updateStats();
    
    statusMessage.textContent = snarkyMessages[Math.floor(Math.random() * snarkyMessages.length)];
    
    reelElements.forEach(reel => {
        reel.classList.add('spinning');
    });

    setTimeout(() => {
        const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        
        reelElements.forEach((reel, i) => {
            reel.classList.remove('spinning');
            reel.innerHTML = `<div class="symbol">${results[i]}</div>`;
        });

        const win = checkWin(results);
        if (win) {
            if (win.type === 'win' || win.msg === "TOTAL HALLUCINATION!") {
                winTitle.textContent = win.msg;
                winAmountText.textContent = win.amount;
                winOverlay.classList.remove('hidden');
            } else {
                statusMessage.textContent = `${win.msg} (${win.amount})`;
            }
        } else {
            statusMessage.textContent = "Inference complete. No significant features extracted.";
        }
        updateStats();
    }, 1500);
}

spinBtn.addEventListener('click', spin);
closeOverlayBtn.addEventListener('click', () => {
    winOverlay.classList.add('hidden');
});

// Init
updateStats();
