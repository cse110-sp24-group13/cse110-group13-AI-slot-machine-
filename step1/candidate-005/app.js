// State Management
let tokens = 100;
const COST_PER_SPIN = 10;
const SYMBOLS = ['☁️', '⛓️', '🧠', '🚀', '💩'];

// UI Elements
const tokenDisplay = document.getElementById('token-count');
const statusMsg = document.getElementById('status-msg');
const disruptBtn = document.getElementById('disrupt-btn');
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

// Messages for variety
const SPIN_MESSAGES = [
    "Leveraging synergies...",
    "Disrupting the industry...",
    "Democratizing the cloud...",
    "Optimizing KPIs...",
    "Hallucinating results...",
    "Synthesizing tokens..."
];

function updateUI() {
    tokenDisplay.textContent = tokens;
    disruptBtn.disabled = tokens < COST_PER_SPIN;
    
    if (tokens < COST_PER_SPIN) {
        statusMsg.textContent = "Insufficient Synergy";
        statusMsg.style.color = "var(--accent-red)";
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function calculateResult(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    const [s1, s2, s3] = results;

    // Check for 3 of a kind
    if (s1 === s2 && s2 === s3) {
        switch(s1) {
            case '🧠': // Neural Network
                tokens += 500;
                return "JACKPOT! Global Domination (+500)";
            case '🚀': // Growth
                tokens += 100;
                return "Big Win! Explosive Growth (+100)";
            case '☁️': // Cloud
                tokens += 50;
                return "Synergy Bonus! Cloud Scaling (+50)";
            case '⛓️': // Blockchain
                tokens -= 50;
                return "SCAMMED! Crypto Collapse (-50)";
            case '💩': // Legacy Model
                tokens += 10;
                return "Pivot Successful! (+10)";
        }
    }

    // No win
    return "Market Volatility. No payout.";
}

async function spin() {
    if (tokens < COST_PER_SPIN) return;

    // Deduct tokens
    tokens -= COST_PER_SPIN;
    updateUI();

    // Set UI to spinning state
    disruptBtn.disabled = true;
    statusMsg.textContent = SPIN_MESSAGES[Math.floor(Math.random() * SPIN_MESSAGES.length)];
    statusMsg.style.color = "var(--corp-blue)";

    reelElements.forEach(reel => reel.classList.add('spinning'));

    // Simulation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get results
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Update reels
    reelElements.forEach((reel, i) => {
        reel.classList.remove('spinning');
        reel.textContent = results[i];
    });

    // Calculate and show result
    const resultMsg = calculateResult(results);
    statusMsg.textContent = resultMsg;
    
    if (resultMsg.includes('+')) {
        statusMsg.style.color = "var(--accent-green)";
    } else if (resultMsg.includes('-')) {
        statusMsg.style.color = "var(--accent-red)";
    }

    updateUI();
}

disruptBtn.addEventListener('click', spin);

// Initial UI state
updateUI();
