import { SYMBOL_TABLE } from './Engine.js';

/**
 * UI Rendering Module
 * Responsibility: Handle all DOM updates, animations, and visual transitions.
 * Follows SRP: Does not calculate win logic or store game data.
 */
export class UI {
    constructor() {
        this.elements = {
            tokens: document.getElementById('token-count'),
            status: document.getElementById('h100-status'),
            reels: [
                document.querySelector('#reel-1 .strip'),
                document.querySelector('#reel-2 .strip'),
                document.querySelector('#reel-3 .strip')
            ],
            log: document.getElementById('log-container'),
            stats: {
                rtp: document.getElementById('stat-rtp'),
                spins: document.getElementById('stat-spins'),
                streak: document.getElementById('stat-streak')
            },
            spinBtn: document.getElementById('infer-btn'),
            themeBtn: document.getElementById('theme-toggle')
        };
        
        this.SYMBOL_HEIGHT = 120; // Matches CSS --reel-size
    }

    update(state) {
        // Basic stats
        this.elements.tokens.innerText = state.tokens.toLocaleString();
        
        // Detailed stats (if elements exist)
        if (this.elements.stats.rtp) this.elements.stats.rtp.innerText = state.rtp.toFixed(1) + '%';
        if (this.elements.stats.spins) this.elements.stats.spins.innerText = state.stats.spins;
        if (this.elements.stats.streak) this.elements.stats.streak.innerText = state.stats.winStreak;

        // Quota Status
        if (state.tokens >= 100000) {
            this.elements.status.innerText = "OVERHEATING";
            this.elements.status.style.color = "var(--neon-red)";
        } else if (state.tokens <= 0) {
            this.elements.status.innerText = "OUT OF COMPUTE";
            this.elements.status.style.color = "var(--neon-red)";
        } else {
            this.elements.status.innerText = "ONLINE";
            this.elements.status.style.color = "var(--neon-green)";
        }
    }

    async animateSpin(results, getRandomSymbol) {
        this.elements.spinBtn.disabled = true;
        
        const spinPromises = this.elements.reels.map((strip, index) => {
            return new Promise(resolve => {
                const targetSymbol = results[index];
                
                // Prepare the strip: add random symbols and the target symbol at the end
                // We clear it first to avoid memory/perf issues with long strips
                strip.innerHTML = '';
                for (let i = 0; i < 40; i++) {
                    const symbol = i === 39 ? targetSymbol : getRandomSymbol();
                    const div = document.createElement('div');
                    div.className = 'symbol';
                    div.innerHTML = symbol.icon;
                    div.style.color = symbol.color;
                    strip.appendChild(div);
                }

                const targetY = -39 * this.SYMBOL_HEIGHT;
                const duration = 2 + index * 0.4;
                
                strip.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
                strip.style.transform = `translateY(${targetY}px)`;

                setTimeout(() => {
                    // Reset strip for next spin: keep the landed symbol at the top
                    strip.style.transition = 'none';
                    strip.innerHTML = '';
                    const landedDiv = document.createElement('div');
                    landedDiv.className = 'symbol';
                    landedDiv.innerHTML = targetSymbol.icon;
                    landedDiv.style.color = targetSymbol.color;
                    strip.appendChild(landedDiv);
                    strip.style.transform = 'translateY(0)';
                    resolve();
                }, duration * 1000);
            });
        });

        await Promise.all(spinPromises);
        this.elements.spinBtn.disabled = false;
    }

    addLog(message, type = 'normal') {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        if (type === 'win') entry.classList.add('win-log');
        if (type === 'error') entry.classList.add('error-log');
        entry.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.elements.log.prepend(entry);
    }

    showWinEffect(type) {
        if (type === 'JACKPOT' || type === 'BIG_WIN') {
            document.body.classList.add('glitch');
            setTimeout(() => document.body.classList.remove('glitch'), 1000);
        }
    }

    renderHistory(history) {
        // Logic to render a full history table if needed
    }
}
