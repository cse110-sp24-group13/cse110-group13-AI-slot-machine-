const SYMBOLS = [
    { name: 'LLM', icon: '🤖', value: 10 },
    { name: 'GPU', icon: '💎', value: 20 },
    { name: 'AGI', icon: '🦄', value: 100 },
    { name: 'HAL', icon: '🤡', value: 2 },
    { name: 'VEC', icon: '📐', value: 5 },
    { name: 'TOK', icon: '🪙', value: 8 },
];

const REEL_SIZE = 30; // Number of symbols in the spin sequence

const MESSAGES = {
    spinning: [
        "Optimizing weights...",
        "Scraping the internet...",
        "Consulting the hallucination engine...",
        "Calculating hype-to-value ratio...",
        "Heating up H100s...",
        "Generating bullshit..."
    ],
    win: [
        "Alignment Achieved! Tokens minted.",
        "Aha! A correlation was found where none existed.",
        "Prompt engineering successful!",
        "Stochastic parrot says: WINNER!",
        "Synthetic data produced value!",
        "Series B funding secured!"
    ],
    loss: [
        "Hallucination Detected. Energy lost.",
        "Model Collapsed. Try adding more parameters.",
        "Out of Memory. Your GPU is crying.",
        "Bias detected! Tokens forfeited.",
        "Safety filter triggered. Spin denied (joking, just lost).",
        "Regressing to the mean..."
    ]
};

let tokens = 1000;
let energy = 500;

const tokenEl = document.getElementById('token-count');
const energyEl = document.getElementById('energy-count');
const generateBtn = document.getElementById('generate-btn');
const logContent = document.getElementById('log-content');
const parameterInput = document.getElementById('parameter-count');

const reelStrips = [
    document.querySelector('#reel1 .reel-strip'),
    document.querySelector('#reel2 .reel-strip'),
    document.querySelector('#reel3 .reel-strip')
];

function initReels() {
    reelStrips.forEach(strip => {
        strip.innerHTML = '';
        // Add a few initial symbols
        for (let i = 0; i < 3; i++) {
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            const div = document.createElement('div');
            div.className = 'reel-item';
            div.innerText = symbol.icon;
            strip.appendChild(div);
        }
    });
}

function log(message, type = 'normal') {
    const div = document.createElement('div');
    div.innerText = `> ${message}`;
    if (type === 'win') div.style.color = 'var(--neon-cyan)';
    if (type === 'loss') div.style.color = 'var(--neon-red)';
    
    logContent.prepend(div);
    if (logContent.childNodes.length > 20) {
        logContent.removeChild(logContent.lastChild);
    }
}

async function spin() {
    const bet = parseInt(parameterInput.value);
    
    if (tokens < bet) {
        log("Insufficient tokens for this inference. Lower parameters.", "loss");
        return;
    }

    if (energy < 10) {
        log("Energy grid depleted. Mining paused.", "loss");
        return;
    }

    // Deduct bet and energy
    tokens -= bet;
    energy -= 10;
    updateStats();

    generateBtn.disabled = true;
    log(MESSAGES.spinning[Math.floor(Math.random() * MESSAGES.spinning.length)]);

    const results = [];

    const spinPromises = reelStrips.map((strip, index) => {
        return new Promise(resolve => {
            const stripSymbols = [];
            strip.innerHTML = '';
            
            // Build a long strip for animation
            for (let i = 0; i < REEL_SIZE; i++) {
                const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                stripSymbols.push(symbol);
                const div = document.createElement('div');
                div.className = 'reel-item';
                div.innerText = symbol.icon;
                strip.appendChild(div);
            }

            const finalSymbol = stripSymbols[REEL_SIZE - 1];
            results.push(finalSymbol);

            // Animate
            const duration = 2000 + (index * 500);
            strip.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.7, 0.1, 1)`;
            
            // Trigger reflow
            strip.offsetHeight;

            const offset = (REEL_SIZE - 1) * 150;
            strip.style.transform = `translateY(-${offset}px)`;

            setTimeout(() => {
                resolve();
            }, duration);
        });
    });

    await Promise.all(spinPromises);

    checkWin(results, bet);
    generateBtn.disabled = false;
}

function checkWin(results, bet) {
    const [s1, s2, s3] = results;
    
    if (s1.name === s2.name && s2.name === s3.name) {
        const winAmount = s1.value * bet;
        tokens += winAmount;
        energy += Math.floor(winAmount / 2); // Mining generates heat/energy?
        log(`CRITICAL HIT: ${s1.name} TRIO! +${winAmount} Tokens.`, "win");
        log(MESSAGES.win[Math.floor(Math.random() * MESSAGES.win.length)], "win");
    } else if (s1.name === s2.name || s2.name === s3.name || s1.name === s3.name) {
        const winAmount = bet * 2;
        tokens += winAmount;
        log(`Partial Match Found. +${winAmount} Tokens.`, "win");
    } else {
        log(MESSAGES.loss[Math.floor(Math.random() * MESSAGES.loss.length)], "loss");
    }

    updateStats();
}

function updateStats() {
    tokenEl.innerText = tokens;
    energyEl.innerText = energy;
}

generateBtn.addEventListener('click', spin);

initReels();
log("System Ready. Feed the Matrix.");
