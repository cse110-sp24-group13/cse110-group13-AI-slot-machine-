const symbols = ['💸', '🤖', '📈', '🔌', '🌫️', '🧠'];
const symbolWeights = {
    '💸': 1,  // VC Funding (Rare)
    '🤖': 2,  // AGI (Uncommon)
    '📈': 3,  // Hype Train
    '🔌': 5,  // Server Farm
    '🌫️': 7,  // The Cloud
    '🧠': 10  // Hallucination (Common)
};

const payouts = {
    '💸': 500,
    '🤖': 100,
    '📈': 50,
    '🔌': 20,
    '🌫️': 10,
    '🧠': 0
};

const satiricalMessages = [
    "Allocating more Hype...",
    "Generating meaningless insights...",
    "Hallucinating value...",
    "Burning through Series A runway...",
    "Optimizing for Hype-Adjusted EBITDA...",
    "Pivoting to Blockchain (just kidding)...",
    "Rerouting GPU traffic to nowhere...",
    "Scraping the internet for scraps...",
    "Faking it until we make it...",
    "Disrupting the disruption industry..."
];

const winMessages = [
    "SERIES B SECURED!",
    "UNREALISTIC VALUATION ACHIEVED!",
    "HYPE TRAIN DEPARTING!",
    "THE BOARD IS IMPRESSED!",
    "EXIT STRATEGY INITIATED!"
];

const lossMessages = [
    "Compute cost exceeded value.",
    "Hallucination detected. Pivot needed.",
    "Burn rate too high.",
    "Cloud bill is overdue.",
    "Market cap shrunk by 40%."
];

let credits = 100;
let tokens = 0;
let isSpinning = false;

const spinButton = document.getElementById('spin-button');
const creditDisplay = document.getElementById('credits');
const tokenDisplay = document.getElementById('tokens');
const statusText = document.getElementById('status-text');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function getRandomSymbol() {
    const totalWeight = Object.values(symbolWeights).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    for (const [symbol, weight] of Object.entries(symbolWeights)) {
        if (random < weight) return symbol;
        random -= weight;
    }
    return '🧠';
}

function updateUI() {
    creditDisplay.innerText = credits;
    tokenDisplay.innerText = tokens;
    
    if (credits < 10 && !isSpinning) {
        spinButton.innerText = "REQUEST MORE FUNDING";
        spinButton.classList.add('funding-required');
    } else {
        spinButton.innerText = isSpinning ? "GENERATING..." : "GENERATE INSIGHTS";
        spinButton.classList.remove('funding-required');
    }
}

async function spin() {
    if (isSpinning) return;
    
    if (credits < 10) {
        credits = 100;
        statusText.innerText = "SERIES A RE-FUNDED. BURN IT ALL.";
        updateUI();
        return;
    }

    isSpinning = true;
    credits -= 10;
    updateUI();

    reels.forEach(reel => {
        reel.classList.add('spinning');
        reel.classList.remove('win');
    });

    statusText.innerText = satiricalMessages[Math.floor(Math.random() * satiricalMessages.length)];

    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Staggered reel stops
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + (i * 300)));
        reels[i].classList.remove('spinning');
        reels[i].innerText = results[i];
    }

    isSpinning = false;
    checkWin(results);
    updateUI();
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const winSymbol = results[0];
        const winAmount = payouts[winSymbol];
        
        if (winAmount > 0) {
            tokens += winAmount;
            statusText.innerText = `WIN: +${winAmount} TOKENS! ${winMessages[Math.floor(Math.random() * winMessages.length)]}`;
            reels.forEach(reel => reel.classList.add('win'));
        } else {
            statusText.innerText = "TRIPLE HALLUCINATION. ZERO VALUE CREATED.";
        }
    } else {
        statusText.innerText = lossMessages[Math.floor(Math.random() * lossMessages.length)];
    }
}

spinButton.addEventListener('click', spin);

// Initialize
updateUI();
