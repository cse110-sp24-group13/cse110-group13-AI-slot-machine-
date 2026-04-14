const SYMBOLS = ['🤖', '🧠', '⚡', '💸', '📉'];
const PAYOUTS = {
    '🧠': 100,
    '🤖': 50,
    '⚡': 30,
    '💸': 20,
    '📉': 0
};
const SPIN_COST = 10;
let balance = 100;

const balanceEl = document.getElementById('token-balance');
const spinBtn = document.getElementById('spin-btn');
const messageEl = document.getElementById('message');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function updateBalance(amount) {
    balance += amount;
    balanceEl.textContent = balance;
    if (balance < SPIN_COST) {
        spinBtn.disabled = true;
        messageEl.textContent = "Tokens depleted. Venture Capital rejected you.";
    }
}

function getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

async function spin() {
    if (balance < SPIN_COST) return;

    // Deduct cost
    updateBalance(-SPIN_COST);
    spinBtn.disabled = true;
    messageEl.textContent = "Optimizing parameters...";
    
    // Start animation
    reels.forEach(reel => reel.classList.add('spinning'));

    // Simulated "Model Training" (Spin time)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stop animation and set results
    reels.forEach(reel => reel.classList.remove('spinning'));
    
    const results = reels.map(reel => {
        const symbol = getRandomSymbol();
        reel.textContent = symbol;
        return symbol;
    });

    checkWin(results);
    if (balance >= SPIN_COST) {
        spinBtn.disabled = false;
    }
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const symbol = results[0];
        const winAmount = PAYOUTS[symbol];
        
        if (winAmount > 0) {
            updateBalance(winAmount);
            messageEl.textContent = `Success! +${winAmount} Tokens!`;
            messageEl.style.color = 'var(--neon-green)';
        } else {
            messageEl.textContent = "Model Overfitted. Accuracy: 0%";
            messageEl.style.color = 'var(--neon-purple)';
        }
    } else {
        messageEl.textContent = "Training failed. Loss: high.";
        messageEl.style.color = 'var(--text-color)';
    }
}

spinBtn.addEventListener('click', spin);