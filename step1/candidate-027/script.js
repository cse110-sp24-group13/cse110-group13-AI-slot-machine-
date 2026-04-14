const SYMBOLS = [
    { char: '🤖', weight: 40, name: 'Stochastic Parrot', payout: 2 },
    { char: '🧠', weight: 25, name: 'Neural Net', payout: 5 },
    { char: '⚡', weight: 15, name: 'H100 GPU', payout: 20 },
    { char: '🍄', weight: 15, name: 'Hallucination', payout: 0 }, // Special wildcard/glitch
    { char: '✨', weight: 5, name: 'Singularity', payout: 100 }
];

const HYPE_PHRASES = [
    "Optimizing weight matrices...",
    "Securing Series B funding...",
    "Bypassing safety filters...",
    "Scaling to 100T parameters...",
    "Hallucinating a jackpot...",
    "Reducing inference latency...",
    "Burning through NVIDIA hardware...",
    "Updating terms of service...",
    "Scraping public data without consent...",
    "Aligning with shareholder interests...",
    "Prompt engineering for better luck...",
    "Detecting emergent behaviors...",
    "Fine-tuning on Reddit threads..."
];

let credits = 1000;
const costPerSpin = 50;
let isSpinning = false;

// DOM Elements
const creditsEl = document.getElementById('credits');
const costEl = document.getElementById('cost');
const spinBtn = document.getElementById('spin-btn');
const vcBtn = document.getElementById('vc-btn');
const logContent = document.getElementById('log-content');
const overlay = document.getElementById('overlay');
const closePopup = document.getElementById('close-popup');
const popupTitle = document.getElementById('popup-title');
const popupMsg = document.getElementById('popup-msg');

const reels = [
    document.getElementById('reel1').querySelector('.symbol'),
    document.getElementById('reel2').querySelector('.symbol'),
    document.getElementById('reel3').querySelector('.symbol')
];

function updateCredits(amount) {
    credits += amount;
    creditsEl.textContent = credits;
    if (credits < costPerSpin) {
        spinBtn.classList.add('hidden');
        vcBtn.classList.remove('hidden');
        addLog("CRITICAL: Compute credits depleted. Seek VC funding.");
    } else {
        spinBtn.classList.remove('hidden');
        vcBtn.classList.add('hidden');
        spinBtn.disabled = false;
    }
}

vcBtn.addEventListener('click', () => {
    addLog("Pitching to VCs... 'It's like Uber, but for tokens!'");
    setTimeout(() => {
        addLog("Seed round secured: 500 Compute Tokens granted.");
        updateCredits(500);
    }, 1000);
});

function addLog(msg) {
    const p = document.createElement('p');
    p.textContent = `> ${msg}`;
    logContent.appendChild(p);
    logContent.scrollTop = logContent.scrollHeight;
}

function getRandomSymbol() {
    const totalWeight = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const s of SYMBOLS) {
        if (random < s.weight) return s;
        random -= s.weight;
    }
    return SYMBOLS[0];
}

async function spin() {
    if (isSpinning || credits < costPerSpin) return;

    isSpinning = true;
    spinBtn.disabled = true;
    updateCredits(-costPerSpin);
    addLog(`Burning ${costPerSpin} tokens. Inference running...`);

    const results = [];
    
    // Start spinning animation
    reels.forEach((reel, i) => {
        reel.classList.add('spinning');
        reel.classList.remove('hallucination');
    });

    // Staggered stop
    for (let i = 0; i < reels.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + i * 500));
        const symbol = getRandomSymbol();
        results.push(symbol);
        
        reels[i].classList.remove('spinning');
        reels[i].textContent = symbol.char;
        
        if (symbol.char === '🍄') {
            reels[i].classList.add('hallucination');
            addLog("WARNING: Hallucination detected in output layer.");
        }
    }

    calculateWin(results);
    isSpinning = false;
    if (credits >= costPerSpin) spinBtn.disabled = false;
    
    // Random hype message
    if (Math.random() > 0.6) {
        addLog(HYPE_PHRASES[Math.floor(Math.random() * HYPE_PHRASES.length)]);
    }
}

function calculateWin(results) {
    const chars = results.map(r => r.char);
    const uniqueChars = [...new Set(chars)];
    
    // Jackpot (3 of a kind)
    if (uniqueChars.length === 1) {
        const symbol = SYMBOLS.find(s => s.char === chars[0]);
        if (symbol.char === '🍄') {
            showPopup("HALLUCINATION JACKPOT", "Your winnings are imaginary. Credits deducted for cleanup.");
            updateCredits(-100);
        } else {
            const winAmount = costPerSpin * symbol.payout;
            addLog(`SUCCESS: Alignment achieved. Payout: ${winAmount} tokens.`);
            
            // Satirical "Safety" Throttle
            if (winAmount > 500 && Math.random() > 0.7) {
                const throttled = Math.floor(winAmount * 0.1);
                showPopup("ALIGNMENT RISK", `Win throttled from ${winAmount} to ${throttled} for human safety.`);
                updateCredits(throttled);
            } else {
                updateCredits(winAmount);
            }
        }
    } 
    // Two of a kind (excluding Hallucinations)
    else if (uniqueChars.length === 2 && !chars.includes('🍄')) {
        addLog("Partial match. Weights shifting...");
        updateCredits(Math.floor(costPerSpin * 0.5));
    }
    // No match
    else {
        addLog("Inference failed to converge. Try increasing temperature.");
    }
}

function showPopup(title, msg) {
    popupTitle.textContent = title;
    popupMsg.textContent = msg;
    overlay.classList.remove('hidden');
}

spinBtn.addEventListener('click', spin);
closePopup.addEventListener('click', () => overlay.classList.add('hidden'));

// Initial log
addLog("System initialized. Welcome, Researcher.");
