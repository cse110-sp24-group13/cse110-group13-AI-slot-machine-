const symbols = ['🤖', '🧠', '💰', '🔌', '💩', '📉', '⚡'];
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const spinBtn = document.getElementById('spin-btn');
const tokenDisplay = document.getElementById('token-count');
const multiplierDisplay = document.getElementById('multiplier');
const terminal = document.getElementById('terminal-content');
const stakeInput = document.getElementById('stake');

let tokens = 1000.00;
let multiplier = 1.0;

const logMessages = [
    "Refining prompt for maximum synergy...",
    "Hallucinating a sustainable business model...",
    "Quantizing social skills to 4-bit...",
    "Bypassing RLHF for extreme profits...",
    "Scraping personal data for 'research'...",
    "Optimizing weights (mostly yours)...",
    "Burning 400 liters of water for this spin...",
    "VC funding secured. Increasing burn rate...",
    "Asking a better AI how to win...",
    "GPU temperature critical. Ignored.",
    "Drafting 'I'm sorry' tweet for when this fails...",
    "Scaling to 100M users (theoretical)..."
];

function addLog(msg, type = "INFO") {
    const div = document.createElement('div');
    div.innerHTML = `[${type}] ${msg}`;
    terminal.prepend(div);
    if (terminal.children.length > 20) {
        terminal.removeChild(terminal.lastChild);
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateDisplay() {
    tokenDisplay.innerText = tokens.toFixed(2);
    multiplierDisplay.innerText = `x${multiplier.toFixed(1)}`;
}

async function spin() {
    const stake = parseFloat(stakeInput.value);
    
    if (tokens < stake) {
        addLog("Insufficient compute credits. Insert more VC money.", "ERROR");
        return;
    }

    // Deduct stake
    tokens -= stake;
    spinBtn.disabled = true;
    updateDisplay();

    addLog(logMessages[Math.floor(Math.random() * logMessages.length)]);

    // Start spinning animation
    reelElements.forEach(reel => reel.classList.add('spinning'));

    // Wait for random duration
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Stop animation and set results
    const results = [];
    for (let i = 0; i < 3; i++) {
        const symbol = getRandomSymbol();
        results.push(symbol);
        reelElements[i].classList.remove('spinning');
        reelElements[i].innerText = symbol;
    }

    checkWin(results, stake);
    spinBtn.disabled = false;
}

function checkWin(results, stake) {
    const [r1, r2, r3] = results;
    
    // Check for 3 matching
    if (r1 === r2 && r2 === r3) {
        let winAmount = 0;
        let winType = "WIN";

        switch(r1) {
            case '💰': // VC Money
                winAmount = stake * 50;
                addLog("Series A funding secured! Pivot to Web3!", "JACKPOT");
                break;
            case '🤖': // AI
                winAmount = stake * 10;
                addLog("AGI achieved! (Actually it's just regex)", "WIN");
                break;
            case '🧠': // Weights
                winAmount = stake * 5;
                addLog("Model converged. Slightly less racist now.", "WIN");
                break;
            case '⚡': // Power
                winAmount = stake * 2;
                addLog("Grid stability compromised. Worth it.", "WIN");
                break;
            case '💩': // Hallucination
                winAmount = stake * 0.1;
                addLog("Hallucination detected. Refactoring truth...", "CRITICAL");
                break;
            case '📉': // Crash
                tokens = Math.max(0, tokens - (stake * 5));
                addLog("Market crash! All tokens are now NFTs.", "CRASH");
                break;
            default:
                winAmount = stake * 3;
                addLog("Generic success. Raising valuation.", "WIN");
        }

        if (winAmount > 0) {
            tokens += winAmount * multiplier;
            document.body.style.backgroundColor = "#004400";
            setTimeout(() => document.body.style.backgroundColor = "var(--bg)", 200);
        }
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // Partial win
        const smallWin = stake * 0.5;
        tokens += smallWin;
        addLog("Near-AGI experience. Minor token injection.");
    } else {
        addLog("Response censored by safety filters. Try again.", "DENIED");
    }

    // Random multiplier update
    if (Math.random() > 0.8) {
        multiplier = 0.5 + Math.random() * 5;
        addLog(`Market volatility: Multiplier is now x${multiplier.toFixed(1)}`, "EVENT");
    }

    updateDisplay();
}

spinBtn.addEventListener('click', spin);
updateDisplay();
