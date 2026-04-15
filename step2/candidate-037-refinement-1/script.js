document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const tokenDisplay = document.getElementById('token-count');
    const h100Status = document.getElementById('h100-status');
    const contextFill = document.getElementById('context-fill');
    const inferBtn = document.getElementById('infer-btn');
    const betAmountSelect = document.getElementById('bet-amount');
    const tempSlider = document.getElementById('temp-slider');
    const tempValueLabel = document.getElementById('temp-value');
    const logContainer = document.getElementById('log-container');
    const autoSpinCheck = document.getElementById('auto-spin');
    
    const strips = [
        document.querySelector('#reel-1 .strip'),
        document.querySelector('#reel-2 .strip'),
        document.querySelector('#reel-3 .strip')
    ];

    // --- State ---
    let tokens = 10000;
    let contextTokens = 0;
    const CONTEXT_WINDOW_SIZE = 1000;
    let isSpinning = false;
    let currentTemperature = 1.0;
    const SYMBOL_HEIGHT = 120; // Adjusted for responsive via script logic if needed

    // --- Satirical Messages ---
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
        "Converting electricity into hype...",
        "Aggregating synthetic data...",
        "Rethinking human value proposition...",
        "Simulating ethical considerations... (skipped)",
        "Burning through $2.5M in H100 hours..."
    ];

    // --- Core UI Functions ---

    function updateUI() {
        tokenDisplay.innerText = tokens.toLocaleString();
        
        // Update H100 status
        if (tokens >= 250000) {
            h100Status.innerText = "CRITICAL OVERLOAD";
            h100Status.style.color = "var(--neon-red)";
        } else if (tokens <= 0) {
            h100Status.innerText = "OUT OF COMPUTE";
            h100Status.style.color = "var(--neon-red)";
            showVCButton();
        } else {
            h100Status.innerText = "ONLINE";
            h100Status.style.color = "var(--neon-green)";
        }

        // Update Context Bar
        const percent = Math.min((contextTokens / CONTEXT_WINDOW_SIZE) * 100, 100);
        contextFill.style.width = `${percent}%`;
        
        if (percent >= 100) {
            contextFill.style.backgroundColor = 'var(--neon-red)';
            contextFill.style.boxShadow = '0 0 10px var(--neon-red)';
        } else {
            contextFill.style.backgroundColor = 'var(--neon-blue)';
            contextFill.style.boxShadow = '0 0 5px var(--neon-blue)';
        }
    }

    function addLog(message, type = 'normal') {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        if (type === 'win') entry.style.borderLeftColor = 'var(--neon-purple)';
        if (type === 'error') entry.style.borderLeftColor = 'var(--neon-red)';
        if (type === 'bonus') entry.style.borderLeftColor = 'var(--neon-blue)';

        const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        entry.innerHTML = `<span style="color: #666">[${timestamp}]</span> ${message}`;
        
        logContainer.prepend(entry);
        
        // Keep logs manageable
        if (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }

    function showVCButton() {
        if (document.getElementById('vc-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'vc-btn';
        btn.innerText = "PITCH TO VCs (GET 5,000 TOKENS)";
        btn.style.cssText = "margin-top: 10px; width: 100%; padding: 10px; background: var(--neon-purple); color: white; border: none; cursor: pointer; font-weight: bold; border-radius: 2px;";
        
        btn.onclick = () => {
            tokens += 5000;
            updateUI();
            addLog("Pitched a 'Blockchain-enabled LLM' to VCs. Received 5,000 compute units.", "win");
            btn.remove();
        };
        document.querySelector('.machine-container').appendChild(btn);
    }

    // --- Slot Mechanics ---

    function initStrips() {
        strips.forEach(strip => {
            strip.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const symbol = window.getRandomSymbol(currentTemperature);
                const div = document.createElement('div');
                div.className = 'symbol';
                div.innerHTML = symbol.icon;
                div.dataset.id = symbol.id;
                strip.appendChild(div);
            }
        });
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
        
        // Add to context window
        contextTokens += (bet * 0.5);
        if (contextTokens > CONTEXT_WINDOW_SIZE) {
            contextTokens = CONTEXT_WINDOW_SIZE;
        }

        updateUI();
        inferBtn.disabled = true;

        addLog(SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]);

        const results = [];
        const spinPromises = strips.map((strip, index) => {
            return new Promise(resolve => {
                const targetSymbol = window.getRandomSymbol(currentTemperature);
                results.push(targetSymbol);

                // For animation, build a long strip with the target at the end
                const tempFrag = document.createDocumentFragment();
                for (let i = 0; i < 20; i++) {
                    const s = window.getRandomSymbol(currentTemperature);
                    const div = document.createElement('div');
                    div.className = 'symbol';
                    div.innerHTML = s.icon;
                    tempFrag.appendChild(div);
                }
                
                // The final symbol that should land
                const targetDiv = document.createElement('div');
                targetDiv.className = 'symbol';
                targetDiv.innerHTML = targetSymbol.icon;
                targetDiv.dataset.id = targetSymbol.id;
                tempFrag.appendChild(targetDiv);
                
                strip.appendChild(tempFrag);

                // Force layout reflow
                void strip.offsetHeight;

                const symbolCount = strip.children.length;
                const targetY = -(symbolCount - 1) * getSymbolHeight();
                
                const duration = 2.5 + (index * 0.6);
                strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                strip.style.transform = `translateY(${targetY}px)`;
                strip.classList.add('spinning');

                setTimeout(() => {
                    strip.classList.remove('spinning');
                    strip.style.transition = 'none';
                    strip.innerHTML = '';
                    
                    // Re-populate for next time with target at top
                    for (let i = 0; i < 30; i++) {
                        const s = i === 0 ? targetSymbol : window.getRandomSymbol(currentTemperature);
                        const newDiv = document.createElement('div');
                        newDiv.className = 'symbol';
                        newDiv.innerHTML = s.icon;
                        newDiv.dataset.id = s.id;
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
            setTimeout(spin, 1200);
        }
    }

    function getSymbolHeight() {
        const symbol = document.querySelector('.symbol');
        return symbol ? symbol.offsetHeight : 120;
    }

    function checkWin(results, bet) {
        const id1 = results[0].id;
        const id2 = results[1].id;
        const id3 = results[2].id;

        // Context Bonus Check
        let contextMultiplier = 1;
        if (contextTokens >= CONTEXT_WINDOW_SIZE) {
            addLog("CONTEXT OVERFLOW: RAG multiplier applied!", "bonus");
            contextMultiplier = 1.5 + (currentTemperature * 0.5);
            contextTokens = 0; // Flush context
            triggerGlitch('rag');
        }

        // Jackpot / AGI match (3 of a kind)
        if (id1 === id2 && id2 === id3) {
            const winSymbol = results[0];
            const baseWin = winSymbol.value * (bet / 10);
            const winAmount = Math.floor(baseWin * contextMultiplier * currentTemperature);
            
            tokens += winAmount;
            addLog(`AGI ACHIEVED! Recieved ${winAmount} compute units from ${winSymbol.name} match.`, 'win');
            triggerGlitch('win');
        } 
        // Partial match (2 of a kind)
        else if (id1 === id2 || id2 === id3 || id1 === id3) {
            const winAmount = Math.floor(bet * 1.5 * contextMultiplier);
            tokens += winAmount;
            addLog(`Partial convergence detected. Recovered ${winAmount} tokens.`, 'normal');
        } 
        // Hallucination Check
        else if (results.some(r => r.id === 'mushroom')) {
            const loss = Math.floor(bet * currentTemperature * 0.5);
            tokens = Math.max(0, tokens - loss);
            addLog(`Hallucination detected. Context poisoned! Lost additional ${loss} tokens.`, "error");
            triggerGlitch('hallucination');
        } 
        // Regular loss
        else {
            addLog("Inference failed to converge. Training continued...");
        }

        updateUI();
    }

    function triggerGlitch(type) {
        document.body.classList.add('glitch');
        if (type === 'win') {
            document.body.style.filter = 'hue-rotate(90deg) brightness(1.5)';
        } else if (type === 'hallucination') {
            document.body.style.filter = 'invert(0.8) sepia(1)';
        } else if (type === 'rag') {
            document.body.style.filter = 'drop-shadow(0 0 10px var(--neon-blue))';
        }

        setTimeout(() => {
            document.body.classList.remove('glitch');
            document.body.style.filter = 'none';
        }, 600);
    }

    // --- Listeners ---

    tempSlider.addEventListener('input', (e) => {
        currentTemperature = parseFloat(e.target.value);
        tempValueLabel.innerText = currentTemperature.toFixed(1);
        
        if (currentTemperature > 1.5) {
            tempValueLabel.style.color = 'var(--neon-red)';
            tempValueLabel.innerText += " (UNSTABLE)";
        } else if (currentTemperature < 0.5) {
            tempValueLabel.style.color = 'var(--neon-blue)';
            tempValueLabel.innerText += " (COHERENT)";
        } else {
            tempValueLabel.style.color = 'var(--neon-green)';
        }
    });

    inferBtn.addEventListener('click', spin);

    // Initial State
    initStrips();
    updateUI();
    addLog("MODEL LOADED: AI-HYP-CORP Inference Engine v1.0.4");
    addLog("READY TO SCALE. PLEASE INPUT TOKENS.");
});
