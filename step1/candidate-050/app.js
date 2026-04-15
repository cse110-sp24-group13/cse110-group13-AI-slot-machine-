const SYMBOLS = ['🤖', '🧠', '⚡', '💸', '💩'];
const SPIN_COST = 100;

let credits = 1000;
let relevance = 99;

const creditsEl = document.getElementById('credits');
const relevanceEl = document.getElementById('relevance');
const spinBtn = document.getElementById('spin-btn');
const statusMsg = document.getElementById('status-msg');
const reelInners = [
    document.querySelector('#reel-1 .reel-inner'),
    document.querySelector('#reel-2 .reel-inner'),
    document.querySelector('#reel-3 .reel-inner')
];
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

const messages = [
    "Optimizing weights...",
    "Aligning with human values (mostly)...",
    "Securing VC seed round...",
    "Scraping the internet...",
    "Hallucinating a solution...",
    "Scaling to infinite compute...",
    "Disrupting the industry...",
    "Minimizing loss function...",
    "Injecting tokens..."
];

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function updateStats() {
    creditsEl.textContent = credits;
    relevanceEl.textContent = relevance + '%';
    
    if (credits < SPIN_COST) {
        spinBtn.disabled = true;
        statusMsg.textContent = "Out of compute. Relevance at zero. You are now a chatbot.";
    }
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    // Reset reel glow
    reels.forEach(r => r.classList.remove('win-glow'));

    if (r1 === r2 && r2 === r3) {
        let winAmount = 0;
        let msg = "";
        
        reels.forEach(r => r.classList.add('win-glow'));

        switch(r1) {
            case '🤖':
                winAmount = 500;
                msg = "VC Seed Round Secured! +500 Credits";
                break;
            case '🧠':
                winAmount = 1000;
                msg = "Neural Breakthrough! +1000 Credits";
                break;
            case '⚡':
                winAmount = 2500;
                msg = "GPU Cluster Secured! +2500 Credits";
                break;
            case '💸':
                winAmount = 10000;
                msg = "IPO / EXIT SUCCESS! +10000 Credits";
                break;
            case '💩':
                winAmount = -500;
                msg = "Massive Hallucination! -500 Credits";
                break;
        }
        
        credits += winAmount;
        statusMsg.textContent = msg;
        statusMsg.style.color = winAmount > 0 ? 'var(--neon-green)' : 'red';
    } else {
        statusMsg.textContent = "Model failed to converge. Try again.";
        statusMsg.style.color = 'var(--neon-blue)';
    }
}

async function spin() {
    if (credits < SPIN_COST) return;

    // Deduct cost
    credits -= SPIN_COST;
    relevance = Math.max(0, relevance - Math.floor(Math.random() * 5));
    updateStats();

    spinBtn.disabled = true;
    statusMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
    statusMsg.style.color = 'var(--neon-blue)';

    // Start animations
    reelInners.forEach((reel, i) => {
        setTimeout(() => {
            reel.classList.add('spinning');
        }, i * 100);
    });

    // Simulate training delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const results = [];
    reelInners.forEach((reel, i) => {
        setTimeout(() => {
            const symbol = getRandomSymbol();
            results[i] = symbol;
            reel.classList.remove('spinning');
            reel.textContent = symbol;

            if (i === 2) {
                checkWin(results);
                spinBtn.disabled = credits < SPIN_COST;
                updateStats();
            }
        }, i * 300);
    });
}

spinBtn.addEventListener('click', spin);

// Initial state
updateStats();
