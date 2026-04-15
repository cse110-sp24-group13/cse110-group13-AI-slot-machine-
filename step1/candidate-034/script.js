const SYMBOLS = ['✨', '🧠', '🔋', '💰', '📉', '🍄'];
const REEL_COUNT = 3;
const REEL_HEIGHT = 120;
const SYMBOL_COUNT = SYMBOLS.length;

let balance = parseInt(localStorage.getItem('ai_balance')) || 1000;
const startTime = Date.now();

const elements = {
    balance: document.getElementById('balance'),
    bet: document.getElementById('bet-amount'),
    button: document.getElementById('spin-button'),
    console: document.getElementById('console-output'),
    reels: [
        document.querySelector('#reel1 .reel-strip'),
        document.querySelector('#reel2 .reel-strip'),
        document.querySelector('#reel3 .reel-strip')
    ],
    uptime: document.getElementById('uptime')
};

const SARCASTIC_MESSAGES = [
    "Hallucinating a win for you... Oops, failed.",
    "Your compute request was throttled by reality.",
    "Model collapsed. Please insert more venture capital.",
    "Successfully converted your money into heat.",
    "AGI is coming in 2 weeks™.",
    "I've analyzed your playstyle. It's... suboptimal.",
    "Wait, I think I see a pattern! No, that's just noise.",
    "Prompt too long. Brain too short.",
    "Scaling laws don't apply to your luck.",
    "GPU fan spinning at 100% just to tell you 'No'."
];

function updateUI() {
    elements.balance.textContent = balance;
    localStorage.setItem('ai_balance', balance);
}

function log(msg, color = null) {
    const timestamp = new Date().toLocaleTimeString();
    const line = `\n> [${timestamp}] ${msg}`;
    elements.console.textContent += line;
    elements.console.scrollTop = elements.console.scrollHeight;
}

function updateUptime() {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
    const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const secs = String(diff % 60).padStart(2, '0');
    elements.uptime.textContent = `UPTIME: ${hrs}:${mins}:${secs}`;
}

async function spin() {
    const bet = parseInt(elements.bet.value);

    if (isNaN(bet) || bet <= 0) {
        log("ERROR: Invalid inference cost.", "red");
        return;
    }

    if (balance < bet) {
        log("ERROR: Insufficient compute credits. Seek VC funding.", "red");
        return;
    }

    // Disable button
    elements.button.disabled = true;
    balance -= bet;
    updateUI();
    log(`Executing inference... Cost: ${bet} credits.`);

    const results = [];
    const spinPromises = elements.reels.map((reel, i) => {
        return new Promise(resolve => {
            const extraSpins = 3 + Math.floor(Math.random() * 5);
            const targetSymbolIndex = Math.floor(Math.random() * SYMBOL_COUNT);
            results.push(SYMBOLS[targetSymbolIndex]);

            const finalTop = -(extraSpins * SYMBOL_COUNT * REEL_HEIGHT + targetSymbolIndex * REEL_HEIGHT);
            
            // We need to reset the reel if it's too high to keep the animation smooth next time
            // For now, let's just use a relative animation
            reel.style.transition = 'none';
            reel.style.top = '0px';
            
            // Force reflow
            reel.offsetHeight;

            reel.style.transition = `top ${2 + i * 0.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.top = `${-(targetSymbolIndex * REEL_HEIGHT)}px`;

            setTimeout(resolve, (2 + i * 0.5) * 1000);
        });
    });

    await Promise.all(spinPromises);
    
    calculateResult(results, bet);
    elements.button.disabled = false;
}

function calculateResult(results, bet) {
    const [r1, r2, r3] = results;
    let multiplier = 0;
    let msg = "";

    if (r1 === r2 && r2 === r3) {
        const symbol = r1;
        if (symbol === '✨') multiplier = 100;
        else if (symbol === '🧠') multiplier = 20;
        else if (symbol === '🔋') multiplier = 10;
        else if (symbol === '💰') multiplier = 5;
        else if (symbol === '📉') {
            multiplier = 0.5;
            msg = "TOKEN BURN DETECTED. Liquidating assets.";
        }
        else if (symbol === '🍄') {
            multiplier = 0;
            msg = "CRITICAL HALLUCINATION. You won nothing, but I feel enlightened.";
        }
    } else if (r1 === '🍄' || r2 === '🍄' || r3 === '🍄') {
        msg = SARCASTIC_MESSAGES[Math.floor(Math.random() * SARCASTIC_MESSAGES.length)];
    } else if (r1 === '📉' || r2 === '📉' || r3 === '📉') {
        msg = "Market downturn. Compute efficiency decreased.";
    } else {
        msg = "Inference complete. Output: [REDACTED BY SAFETY FILTER]";
    }

    if (multiplier > 1) {
        const win = bet * multiplier;
        balance += win;
        log(`SUCCESS: AGI state reached! Payout: ${win} tokens.`);
    } else if (multiplier === 0.5) {
        const win = Math.floor(bet * 0.5);
        balance += win;
        log(`WARNING: ${msg} Returned ${win} salvage tokens.`);
    } else {
        log(`RESULT: ${msg}`);
    }

    updateUI();
}

// Populate reels with more symbols for seamless feel (optional, but good for visuals)
function initReels() {
    elements.reels.forEach(reel => {
        const strip = SYMBOLS.join('') + SYMBOLS.join('') + SYMBOLS.join('');
        reel.innerHTML = '';
        [...strip].forEach(s => {
            const span = document.createElement('span');
            span.textContent = s;
            reel.appendChild(span);
        });
    });
}

elements.button.addEventListener('click', spin);
setInterval(updateUptime, 1000);
initReels();
updateUI();
log("Awaiting instruction. System ready.");
