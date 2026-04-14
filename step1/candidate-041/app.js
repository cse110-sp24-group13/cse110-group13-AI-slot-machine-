const symbols = ["🦜", "🧠", "💸", "📉", "🤖"];
let computeBalance = 100;
let hypeTokens = 0;

const computeDisplay = document.getElementById("compute-balance");
const hypeDisplay = document.getElementById("hype-tokens");
const statusMessage = document.getElementById("status-message");
const spinBtn = document.getElementById("spin-btn");
const reels = [
    document.getElementById("reel-1"),
    document.getElementById("reel-2"),
    document.getElementById("reel-3")
];

const messages = [
    "Maximum Stochasticity!",
    "Sentience Detected (Hallucination)!",
    "Series A Round Closed!",
    "Model Overfit!",
    "Catastrophic Forgetting!",
    "Weights Re-initialized.",
    "Data Privacy Violation Detected.",
    "Prompt Injection Successful!",
    "LLM Hallucinating... wait for it.",
    "GPU Shortage. Spin again later?"
];

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateUI() {
    computeDisplay.textContent = computeBalance;
    hypeDisplay.textContent = hypeTokens;
    if (computeBalance < 10) {
        spinBtn.disabled = true;
        spinBtn.textContent = "OUT OF COMPUTE";
    }
}

function checkWin(results) {
    const counts = {};
    results.forEach(s => counts[s] = (counts[s] || 0) + 1);

    if (results[0] === results[1] && results[1] === results[2]) {
        // Triple match
        const symbol = results[0];
        let reward = 50;
        let msg = "TRIPLE MATCH!";

        if (symbol === "🦜") {
            reward = 100;
            msg = "Stochastic Parrot Super Convergence! +100 Hype";
        } else if (symbol === "🧠") {
            reward = 250;
            msg = "AGI FOUND (Temporary Hallucination)! +250 Hype";
        } else if (symbol === "💸") {
            reward = 1000;
            msg = "EXIT STRATEGY TRIGGERED! +1000 Hype";
        } else if (symbol === "🤖") {
            reward = 150;
            msg = "Automated Profit Realized! +150 Hype";
        } else if (symbol === "📉") {
            reward = 10;
            msg = "Market Dip (AI Bubble Pop)! +10 Hype";
        }

        hypeTokens += reward;
        statusMessage.textContent = msg;
        document.body.classList.add("win-flash");
        setTimeout(() => document.body.classList.remove("win-flash"), 2000);
    } else if (new Set(results).size === 2) {
        // Double match
        hypeTokens += 20;
        statusMessage.textContent = "Partial Convergence. +20 Hype";
    } else {
        // Lose
        statusMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}

spinBtn.addEventListener("click", () => {
    if (computeBalance < 10) return;

    computeBalance -= 10;
    updateUI();

    statusMessage.textContent = "Generating tokens...";
    
    // Add spinning class
    reels.forEach(reel => reel.classList.add("spinning"));
    spinBtn.disabled = true;

    // Simulate network latency/inference time
    setTimeout(() => {
        const results = [];
        reels.forEach((reel, index) => {
            reel.classList.remove("spinning");
            const result = getRandomSymbol();
            reel.textContent = result;
            results.push(result);
        });

        checkWin(results);
        updateUI();
        spinBtn.disabled = computeBalance < 10;
    }, 1200);
});

// Initial update
updateUI();
