const symbols = [
    { emoji: '🤖', name: 'AGI', value: 100 },
    { emoji: '🧠', name: 'Neural Net', value: 50 },
    { emoji: '🖼️', name: 'Hallucination', value: 20 },
    { emoji: '💬', name: 'Prompt', value: 10 },
    { emoji: '🔌', name: 'Data Center', value: 5 },
    { emoji: '💩', name: 'Model Collapse', value: 0 }
];

const hypeItems = [
    { name: 'Pivot to Web4', cost: 50 },
    { name: 'Hire "AI Visionary"', cost: 150 },
    { name: 'Rename .com to .ai', cost: 300 },
    { name: 'Fake Demo Video', cost: 500 },
    { name: 'Series A Funding', cost: 1000 }
];

let credits = 100;
let funding = 0;
let currentHypeIndex = 0;

const creditsEl = document.getElementById('credits');
const fundingEl = document.getElementById('funding');
const reelEls = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinBtn = document.getElementById('spin-btn');
const buyHypeBtn = document.getElementById('buy-hype-btn');
const logEl = document.getElementById('game-log');

function updateUI() {
    creditsEl.textContent = credits;
    fundingEl.textContent = `$${funding.toLocaleString()}`;
    spinBtn.disabled = credits < 10;
    
    if (currentHypeIndex < hypeItems.length) {
        const nextHype = hypeItems[currentHypeIndex];
        buyHypeBtn.textContent = `Buy "${nextHype.name}" (${nextHype.cost} Credits)`;
        buyHypeBtn.disabled = credits < nextHype.cost;
    } else {
        buyHypeBtn.textContent = "AGI SECURED (Endless Hype Mode)";
        buyHypeBtn.disabled = true;
    }
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    logEl.prepend(p);
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

async function spin() {
    if (credits < 10) return;

    credits -= 10;
    updateUI();
    addLog("Inference started... Burning GPU cycles.");

    spinBtn.disabled = true;
    
    // Animation
    reelEls.forEach(reel => reel.classList.add('spinning'));

    // Visual flicker effect
    const flickerInterval = setInterval(() => {
        reelEls.forEach((reel, i) => {
            if (reel.classList.contains('spinning')) {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)].emoji;
            }
        });
    }, 50);

    const results = [];
    
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + i * 500));
        const symbol = getRandomSymbol();
        results.push(symbol);
        reelEls[i].classList.remove('spinning');
        reelEls[i].textContent = symbol.emoji;
    }

    clearInterval(flickerInterval);
    checkWin(results);
    spinBtn.disabled = credits < 10;
}

function checkWin(results) {
    const [s1, s2, s3] = results;

    if (s1.emoji === s2.emoji && s2.emoji === s3.emoji) {
        const winAmount = s1.value * 5;
        credits += winAmount;
        funding += winAmount * 1000;
        addLog(`JACKPOT! Triple ${s1.name}. VC Funding secured! +${winAmount} credits.`);
    } else if (s1.emoji === s2.emoji || s2.emoji === s3.emoji || s1.emoji === s3.emoji) {
        const winAmount = 15;
        credits += winAmount;
        addLog(`Partial match. Market hype increased. +15 credits.`);
    } else if (results.some(r => r.emoji === '💩')) {
        addLog("Model collapse detected. Data quality is degrading.");
    } else {
        addLog("No pattern found. Tokens lost in latent space.");
    }
    updateUI();
}

function buyHype() {
    const item = hypeItems[currentHypeIndex];
    if (credits >= item.cost) {
        credits -= item.cost;
        funding += item.cost * 5000;
        addLog(`Purchased ${item.name}! Valuation skyrocketed.`);
        currentHypeIndex++;
        updateUI();
    }
}

spinBtn.addEventListener('click', spin);
buyHypeBtn.addEventListener('click', buyHype);

updateUI();
