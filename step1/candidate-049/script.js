const symbols = [
    { char: '🤖', name: 'AGI', weight: 1 },
    { char: '💰', name: 'Series A', weight: 2 },
    { char: '🧠', name: 'Neural Net', weight: 4 },
    { char: '🔌', name: 'Server', weight: 6 },
    { char: '📉', name: 'Hallucination', weight: 3 },
    { char: '💩', name: 'Data Scraping', weight: 8 }
];

const messages = [
    "Scraping the internet for copyrighted material...",
    "Explaining to VCs why we need more H100s...",
    "Replacing entry-level jobs with a 65% accurate script...",
    "Burning enough electricity to power a small nation...",
    "Rebranding 'if statements' as 'Generative AI'...",
    "Hallucinating a legal defense for our training data...",
    "Promising the Singularity is 6 months away (since 2012)..."
];

let credits = 100;
const spinCost = 10;
let isSpinning = false;

const creditDisplay = document.getElementById('credit-count');
const spinButton = document.getElementById('spin-button');
const consoleOutput = document.getElementById('console-output');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function log(text, className = '') {
    const line = document.createElement('div');
    line.className = 'console-line ' + className;
    line.textContent = `> ${text}`;
    consoleOutput.prepend(line);
}

function getRandomSymbol() {
    const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const symbol of symbols) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
    return symbols[symbols.length - 1];
}

async function spin() {
    if (isSpinning || credits < spinCost) return;

    isSpinning = true;
    credits -= spinCost;
    updateUI();
    
    spinButton.disabled = true;
    log(`Spin initiated. Cost: ${spinCost} Credits.`);
    log(messages[Math.floor(Math.random() * messages.length)]);

    const results = [];
    
    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Wait for "spinning" effect
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500 + i * 300));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reels[i].textContent = symbol.char;
        reels[i].classList.remove('spinning');
    }

    checkWin(results);
    isSpinning = false;
    spinButton.disabled = credits < spinCost;
    if (credits < spinCost) {
        log("OUT OF COMPUTE. Please wait for a Series B (Refresh).", "loss-text");
    }
}

function checkWin(results) {
    const [s1, s2, s3] = results;
    
    if (s1.char === s2.char && s2.char === s3.char) {
        let winAmount = 0;
        let msg = "";

        switch(s1.char) {
            case '🤖': winAmount = 500; msg = "SINGULARITY ACHIEVED! You are the new God."; break;
            case '💰': winAmount = 200; msg = "IPO SUCCESS! Dump your shares on retail."; break;
            case '🧠': winAmount = 50; msg = "Weights converged! Model is slightly less stupid."; break;
            case '🔌': winAmount = 20; msg = "Uptime maintained. Barely."; break;
            case '📉': 
                credits -= 50; 
                log("MASSIVE HALLUCINATION! Regulatory fine: -50 Credits.", "loss-text");
                updateUI();
                return;
            case '💩': winAmount = 15; msg = "Data scraped. Users are furious, but you don't care."; break;
        }

        credits += winAmount;
        log(`${msg} +${winAmount} Credits!`, "win-text");
    } else {
        log("No convergence. Weights randomized. Try again.");
    }
    updateUI();
}

function updateUI() {
    creditDisplay.textContent = credits;
}

spinButton.addEventListener('click', spin);

// Initial greeting
log("Neural Engine Online.");
log("Initial Credits Loaded.");
