let credits = 1000;
const COST_PER_SPIN = 50;
const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 20; // Length of the reel for animation
const SYMBOL_HEIGHT = 150;

const reels = [
    document.querySelector('#reel1 .reel-container'),
    document.querySelector('#reel2 .reel-container'),
    document.querySelector('#reel3 .reel-container')
];
const spinBtn = document.getElementById('spin-btn');
const creditsDisplay = document.getElementById('credits');
const statusDisplay = document.getElementById('status');
const payoutList = document.getElementById('payout-list');

// Initialize Payout Table
SYMBOLS.forEach(s => {
    const li = document.createElement('li');
    li.className = 'payout-item';
    li.innerHTML = `${s.icon} ${s.name}: <span>${s.value}x</span>`;
    payoutList.appendChild(li);
});

// Initialize Reels
function createReel(reelContainer) {
    reelContainer.innerHTML = '';
    for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
        const symbolObj = SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
        const div = document.createElement('div');
        div.className = 'symbol';
        div.textContent = symbolObj.icon;
        reelContainer.appendChild(div);
    }
}

reels.forEach(createReel);

async function spin() {
    if (credits < COST_PER_SPIN) {
        statusDisplay.textContent = "Insufficient Compute Credits. Please deposit more VC funds.";
        return;
    }

    credits -= COST_PER_SPIN;
    updateUI();
    
    spinBtn.disabled = true;
    statusDisplay.textContent = MESSAGES.EMPTY[Math.floor(Math.random() * MESSAGES.EMPTY.length)];

    const results = [];
    const animations = reels.map((reel, index) => {
        return animateReel(reel, index).then(symbol => {
            results.push(symbol);
        });
    });

    await Promise.all(animations);
    checkResult(results);
    spinBtn.disabled = false;
}

function animateReel(reel, index) {
    return new Promise(resolve => {
        const totalSymbols = SYMBOLS_PER_REEL;
        const finalSymbol = SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];
        
        // Add the final symbol to the end of the reel
        const finalDiv = document.createElement('div');
        finalDiv.className = 'symbol';
        finalDiv.textContent = finalSymbol.icon;
        reel.appendChild(finalDiv);

        const duration = 2000 + (index * 500);
        const startTime = performance.now();
        const startPos = 0;
        const endPos = (reel.children.length - 1) * SYMBOL_HEIGHT;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentPos = - (easeProgress * endPos);
            
            reel.style.transform = `translateY(${currentPos}px)`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Reset reel for next spin
                const lastSymbol = reel.lastElementChild.textContent;
                createReel(reel);
                reel.style.transform = 'translateY(0px)';
                reel.firstElementChild.textContent = lastSymbol;
                resolve(SYMBOLS.find(s => s.icon === lastSymbol));
            }
        }

        requestAnimationFrame(update);
    });
}

function checkResult(results) {
    const icons = results.map(r => r.icon);
    const uniqueIcons = [...new Set(icons)];

    if (uniqueIcons.length === 1) {
        // JackPot (3 matching symbols)
        const symbol = results[0];
        const winAmount = symbol.value * 10;
        credits += winAmount;
        statusDisplay.textContent = `CRITICAL HIT: ${symbol.message} +${winAmount} tokens`;
        statusDisplay.style.color = 'var(--primary)';
    } else if (uniqueIcons.length === 2) {
        // Small Win (2 matching symbols)
        // Find which symbol is repeated
        let matchIcon = icons.find((icon, index) => icons.indexOf(icon) !== index);
        const matchSymbol = results.find(s => s.icon === matchIcon);
        
        const winAmount = matchSymbol.value * 2;
        credits += winAmount;
        statusDisplay.textContent = `ALIGNMENT GAIN: ${matchSymbol.message} +${winAmount} tokens`;
        statusDisplay.style.color = 'var(--primary)';
    } else {
        // Loss (0 matching symbols)
        statusDisplay.textContent = MESSAGES.LOSS[Math.floor(Math.random() * MESSAGES.LOSS.length)];
        statusDisplay.style.color = 'var(--secondary)';
    }
    
    updateUI();
}

function updateUI() {
    creditsDisplay.textContent = credits;
}

spinBtn.addEventListener('click', spin);
