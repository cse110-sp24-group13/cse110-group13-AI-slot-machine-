import { CONFIG, SYMBOLS, MESSAGES } from './config.js';

export class UIManager {
    constructor(state, engine) {
        this.state = state;
        this.engine = engine;
        this.reelContainers = [
            document.querySelector('#reel1 .reel-container'),
            document.querySelector('#reel2 .reel-container'),
            document.querySelector('#reel3 .reel-container')
        ];
        this.spinBtn = document.getElementById('spin-btn');
        this.statusDisplay = document.getElementById('status');
        this.creditsDisplay = document.getElementById('credits');
        this.betDisplay = document.getElementById('current-bet');
        this.streakDisplay = document.getElementById('win-streak');
        this.rtpDisplay = document.getElementById('rtp');
        this.payoutList = document.getElementById('payout-list');
        this.historyLog = document.getElementById('history-log');
        this.autoplayBtn = document.getElementById('autoplay-btn');
        this.clearLogsBtn = document.getElementById('history-clear');
        this.themeToggle = document.getElementById('theme-toggle');
        this.tempSlider = document.getElementById('temp-slider');
        this.tempValue = document.getElementById('temp-value');

        this.init();
    }

    init() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.clearLogsBtn.addEventListener('click', () => this.state.clearHistory());
        this.tempSlider.addEventListener('input', (e) => {
            this.state.setTemperature(e.target.value);
        });
        this.state.subscribe(s => this.update(s));
    }

    renderPayoutTable(temperature) {
        const probabilities = this.engine.getProbabilities(temperature);

        this.payoutList.innerHTML = '';
        SYMBOLS.forEach(s => {
            const probability = probabilities[s.id];
            
            const li = document.createElement('li');
            li.className = 'payout-item';
            li.innerHTML = `
                <span>${s.icon} ${s.name}</span> 
                <span>${s.value}x</span>
                <span class="odds-value">${probability}%</span>
            `;
            this.payoutList.appendChild(li);
        });
    }

    update(state) {
        this.creditsDisplay.textContent = Math.floor(state.credits);
        this.betDisplay.textContent = state.currentBet;
        this.rtpDisplay.textContent = `${state.getRTP().toFixed(1)}%`;
        this.tempValue.textContent = state.temperature.toFixed(1);
        this.tempSlider.value = state.temperature;
        
        this.autoplayBtn.textContent = `AUTOPLAY: ${state.isAutoplay ? 'ON' : 'OFF'}`;
        this.autoplayBtn.classList.toggle('active', state.isAutoplay);
        
        this.renderPayoutTable(state.temperature);
        this.renderHistory(state.history);
    }

    renderHistory(history) {
        this.historyLog.innerHTML = '';
        history.slice(0, 15).forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            if (item.type === 'system') {
                li.innerHTML = `<span style="color: var(--secondary)">[SYSTEM] ${item.message}</span>`;
            } else {
                const winClass = item.payout > 0 ? 'win' : 'loss';
                const sign = item.payout > 0 ? '+' : '';
                li.innerHTML = `
                    <div class="log-top">[${item.timestamp}] Bet: ${item.bet} | <span class="${winClass}">Payout: ${sign}${item.payout}</span></div>
                    <div class="log-msg">${item.message || ''}</div>
                `;
            }
            this.historyLog.appendChild(li);
        });
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
    }

    setStatus(message, color = '') {
        this.statusDisplay.textContent = message;
        this.statusDisplay.style.color = color;
    }

    setSpinning(isSpinning) {
        this.spinBtn.disabled = isSpinning;
        if (isSpinning) {
            this.setStatus(MESSAGES.EMPTY[Math.floor(Math.random() * MESSAGES.EMPTY.length)]);
        }
    }

    async animateReel(reelIndex, finalSymbols) {
        const reel = this.reelContainers[reelIndex];
        const finalSymbol = finalSymbols[reelIndex];
        
        // Populate reel with random symbols for animation
        reel.innerHTML = '';
        for (let i = 0; i < CONFIG.SYMBOLS_PER_REEL; i++) {
            const div = document.createElement('div');
            div.className = 'symbol';
            div.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].icon;
            reel.appendChild(div);
        }

        // The very last symbol is our result
        const finalDiv = document.createElement('div');
        finalDiv.className = 'symbol';
        finalDiv.textContent = finalSymbol.icon;
        reel.appendChild(finalDiv);

        const duration = CONFIG.ANIMATION_DURATION + (reelIndex * CONFIG.ANIMATION_STAGGER);
        const endPos = (reel.children.length - 1) * CONFIG.SYMBOL_HEIGHT;

        return new Promise(resolve => {
            reel.style.transition = `transform ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            reel.style.transform = `translateY(-${endPos}px)`;

            setTimeout(() => {
                // Reset for next spin
                const lastIcon = reel.lastElementChild.textContent;
                reel.style.transition = 'none';
                reel.style.transform = 'translateY(0px)';
                reel.innerHTML = `<div class="symbol">${lastIcon}</div>`;
                resolve();
            }, duration);
        });
    }

    celebrateWin(type) {
        const machine = document.querySelector('.slot-machine');
        machine.classList.add('win-animation');
        setTimeout(() => machine.classList.remove('win-animation'), 2000);
    }
}
