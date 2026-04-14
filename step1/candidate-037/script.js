document.addEventListener('DOMContentLoaded', () => {
    const tokenDisplay = document.getElementById('token-count');
    const inferBtn = document.getElementById('infer-btn');
    const betAmountSelect = document.getElementById('bet-amount');
    const logContainer = document.getElementById('log-container');
    const autoSpinCheck = document.getElementById('auto-spin');
    const strips = [
        document.querySelector('#reel-1 .strip'),
        document.querySelector('#reel-2 .strip'),
        document.querySelector('#reel-3 .strip')
    ];

    let tokens = 10000;
    let isSpinning = false;
    const SYMBOL_HEIGHT = 120; // from CSS --reel-size

    const SATIRICAL_MESSAGES = [
        "Aligning neural weights...",
        "Tokenizing hallucinations...",
        "Optimizing for maximum engagement...",
        "Reducing loss function (hopefully)...",
        "Feeding the black box...",
        "Scraping the internet without permission...",
        "Generating pseudo-wisdom...",
        "Bypassing safety filters...",
        "H100 cooling at 98%...",
        "Requesting more VC funding...",
        "Prompt injection detected... ignoring.",
        "Synthesizing corporate synergy...",
        "Applying RLHF (punishing the model)...",
        "Converting electricity into hype..."
    ];

    function updateUI() {
        tokenDisplay.innerText = tokens.toLocaleString();
        const h100Status = document.getElementById('h100-status');
        
        if (tokens >= 100000) {
            h100Status.innerText = "OVERHEATING";
            h100Status.style.color = "var(--neon-red)";
        } else if (tokens <= 0) {
            h100Status.innerText = "OUT OF COMPUTE";
            h100Status.style.color = "var(--neon-red)";
            showVCButton();
        } else {
            h100Status.innerText = "ONLINE";
            h100Status.style.color = "var(--neon-green)";
        }
    }

    function showVCButton() {
        if (document.getElementById('vc-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'vc-btn';
        btn.innerText = "PITCH TO VCs (GET 5,000 TOKENS)";
        btn.style.marginTop = "10px";
        btn.style.width = "100%";
        btn.style.padding = "10px";
        btn.style.background = "var(--neon-purple)";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.onclick = () => {
            tokens += 5000;
            updateUI();
            addLog("Pitched a 'Blockchain-enabled LLM' to VCs. Received 5,000 compute units.", "win");
            btn.remove();
        };
        document.querySelector('.machine-container').appendChild(btn);
    }

    // Initialize strips
    function initStrips() {
        strips.forEach(strip => {
            strip.innerHTML = '';
            // Add 20 random symbols for the initial strip
            for (let i = 0; i < 30; i++) {
                const symbol = window.getRandomSymbol();
                const div = document.createElement('div');
                div.className = 'symbol';
                div.innerHTML = symbol.icon;
                div.dataset.id = symbol.id;
                strip.appendChild(div);
            }
        });
    }

    function addLog(message, type = 'normal') {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        if (type === 'win') entry.style.borderLeftColor = 'var(--neon-purple)';
        if (type === 'error') entry.style.borderLeftColor = 'var(--neon-red)';
        entry.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.prepend(entry);
    }

    async function spin() {
        if (isSpinning) return;
        
        const bet = parseInt(betAmountSelect.value);
        if (tokens < bet) {
            addLog("INSUFFICIENT COMPUTE UNITS. REQUEST MORE VC FUNDING.", "error");
            return;
        }

        isSpinning = true;
        tokens -= bet;
        updateUI();
        inferBtn.disabled = true;

        addLog(SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]);

        const results = [];
        const spinPromises = strips.map((strip, index) => {
            return new Promise(resolve => {
                const targetSymbol = window.getRandomSymbol();
                results.push(targetSymbol);

                // Add the target symbol to the end of the strip to ensure it lands there
                const div = document.createElement('div');
                div.className = 'symbol';
                div.innerHTML = targetSymbol.icon;
                div.dataset.id = targetSymbol.id;
                strip.appendChild(div);

                const totalSymbols = strip.children.length;
                const targetY = -(totalSymbols - 1) * SYMBOL_HEIGHT;
                
                // Animation
                const duration = 2 + index * 0.5;
                strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                strip.style.transform = `translateY(${targetY}px)`;

                setTimeout(() => {
                    // Reset position but keep the look
                    strip.style.transition = 'none';
                    strip.innerHTML = '';
                    // Put the landed symbol first, and add new ones above/below for next spin
                    for (let i = 0; i < 30; i++) {
                        const symbol = i === 0 ? targetSymbol : window.getRandomSymbol();
                        const newDiv = document.createElement('div');
                        newDiv.className = 'symbol';
                        newDiv.innerHTML = symbol.icon;
                        newDiv.dataset.id = symbol.id;
                        strip.appendChild(newDiv);
                    }
                    strip.style.transform = 'translateY(0)';
                    resolve();
                }, duration * 1000);
            });
        });

        await Promise.all(spinPromises);
        checkWin(results, bet);
        isSpinning = false;
        inferBtn.disabled = false;

        if (autoSpinCheck.checked && tokens >= bet) {
            setTimeout(spin, 1000);
        }
    }

    function checkWin(results, bet) {
        const id1 = results[0].id;
        const id2 = results[1].id;
        const id3 = results[2].id;

        if (id1 === id2 && id2 === id3) {
            const winSymbol = results[0];
            const winAmount = winSymbol.value * (bet / 10);
            tokens += winAmount;
            updateUI();
            addLog(`AGI ACHIEVED! Recieved ${winAmount} compute units from ${winSymbol.name} match.`, 'win');
            triggerGlitch();
        } else if (id1 === id2 || id2 === id3 || id1 === id3) {
            const winAmount = bet; // Money back for 2
            tokens += winAmount;
            updateUI();
            addLog(`Partial convergence detected. Recovered ${winAmount} tokens.`, 'normal');
        } else if (results.some(r => r.id === 'mushroom')) {
            updateUI();
            addLog("Hallucination detected. Model outputting gibberish...", "error");
            triggerGlitch();
        } else {
            updateUI();
            addLog("Inference failed to converge. Training continue...");
        }
    }

    function triggerGlitch() {
        document.body.classList.add('glitch');
        setTimeout(() => document.body.classList.remove('glitch'), 600);
    }

    inferBtn.addEventListener('click', spin);
    initStrips();
    updateUI();
    addLog("READY TO SCALE. PLEASE INPUT TOKENS.");
});
