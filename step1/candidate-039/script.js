// Symbols with satirical weights (imaginary)
const symbols = ["🤖", "🧠", "🎨", "💰", "💩", "🚀", "⚡"];

// Satirical AI Status Messages
const startMessages = [
    "Initializing neural weights...",
    "Gathering venture capital...",
    "Scraping the internet for 'inspiration'...",
    "Hallucinating a sustainable business model...",
    "Optimizing for maximum hype...",
    "Aligning values with quarterly profits...",
    "Ignoring ethical guidelines for performance..."
];

const winMessages = [
    "AGI achieved! (Actually, it's just a regex).",
    "Model successfully overfit to your luck.",
    "VC funding secured! Burn it all.",
    "Found a pattern in the noise.",
    "Scale solves everything. Especially your debt.",
    "Emergent behavior detected: Winning."
];

const lossMessages = [
    "Model hallucinated a win. Sorry.",
    "Tokens consumed by cooling the data center.",
    "Prompt rejected by safety filters.",
    "Scaling law failure: More tokens required.",
    "Backpropagating your losses...",
    "Inference timeout. Better luck next epoch.",
    "Error: Logic not found in training data."
];

// Game State
let tokens = 100;
let iq = 0;
let isSpinning = false;

// DOM Elements
const tokensDisplay = document.getElementById('tokens');
const iqDisplay = document.getElementById('iq');
const spinButton = document.getElementById('spin-button');
const betInput = document.getElementById('bet-input');
const statusMessage = document.getElementById('status-message');
const reels = [
    document.getElementById('reel-1'),
    document.getElementById('reel-2'),
    document.getElementById('reel-3')
];

function updateDisplay() {
    tokensDisplay.textContent = tokens;
    iqDisplay.textContent = iq;
    
    if (tokens <= 0) {
        spinButton.disabled = true;
        statusMessage.textContent = "Out of compute. Please pivot to a new startup.";
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function getRandomMessage(messageArray) {
    return messageArray[Math.floor(Math.random() * messageArray.length)];
}

async function spin() {
    const bet = parseInt(betInput.value);
    
    if (isNaN(bet) || bet <= 0) {
        statusMessage.textContent = "Invalid compute allocation.";
        return;
    }

    if (bet > tokens) {
        statusMessage.textContent = "Insufficient compute tokens. Seek more funding.";
        return;
    }

    // Start spin
    isSpinning = true;
    spinButton.disabled = true;
    tokens -= bet;
    updateDisplay();
    
    statusMessage.textContent = getRandomMessage(startMessages);
    
    // Add spinning animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulated "Inference" time
    const spinDuration = 1500;
    
    setTimeout(() => {
        // Stop spinning and set final symbols
        const results = [];
        reels.forEach((reel, index) => {
            setTimeout(() => {
                const finalSymbol = getRandomSymbol();
                results.push(finalSymbol);
                reel.textContent = finalSymbol;
                reel.classList.remove('spinning');
                
                // If last reel stopped, check results
                if (index === reels.length - 1) {
                    processResults(results, bet);
                }
            }, index * 300); // Staggered stop
        });
    }, spinDuration);
}

function processResults(results, bet) {
    isSpinning = false;
    spinButton.disabled = false;

    const [r1, r2, r3] = results;
    
    // Win Logic
    if (r1 === r2 && r2 === r3) {
        // Jackpot! (3 of a kind)
        let winMultiplier = 10;
        if (r1 === "🤖") winMultiplier = 20; // AGI bonus
        if (r1 === "💩") winMultiplier = 2;   // Hallucination pittance
        
        const winAmount = bet * winMultiplier;
        tokens += winAmount;
        iq += 50;
        statusMessage.innerHTML = `<span class="win">JACKPOT! ${getRandomMessage(winMessages)} (+${winAmount} tokens)</span>`;
    } 
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Pair
        const winAmount = Math.floor(bet * 2);
        tokens += winAmount;
        iq += 10;
        statusMessage.innerHTML = `<span class="win">Partial match found. ${getRandomMessage(winMessages)} (+${winAmount} tokens)</span>`;
    }
    else {
        // Loss
        iq = Math.max(0, iq - 5);
        statusMessage.innerHTML = `<span class="loss">${getRandomMessage(lossMessages)} (-${bet} tokens)</span>`;
    }

    updateDisplay();
}

spinButton.addEventListener('click', spin);

// Initial state
updateDisplay();
