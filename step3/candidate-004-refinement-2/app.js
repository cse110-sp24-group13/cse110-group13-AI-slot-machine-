import { CONFIG, SYMBOLS, MESSAGES } from './js/config.js';
import { StateManager } from './js/state.js';
import { Engine } from './js/engine.js';
import { UIManager } from './js/ui.js';
import { InputHandler } from './js/input.js';
import { AudioManager } from './js/audio.js';

class App {
    constructor() {
        this.state = new StateManager();
        this.engine = new Engine();
        this.ui = new UIManager(this.state, this.engine);
        this.audio = new AudioManager();
        this.input = new InputHandler({
            onSpin: () => this.handleSpin(),
            onBetAdjust: (delta) => this.state.adjustBet(delta),
            onAutoplayToggle: () => this.state.toggleAutoplay()
        });

        this.isSpinning = false;
        this.autoplayTimeout = null;
        
        // Initial reel setup
        this.ui.reelContainers.forEach(reel => {
            const symbol = this.engine.getRandomSymbol(this.state.temperature);
            reel.innerHTML = `<div class="symbol">${symbol.icon}</div>`;
        });

        this.state.subscribe(() => this.handleAutoplayState());
    }

    async handleSpin() {
        if (this.isSpinning) return;
        
        const bet = this.state.currentBet;
        if (!this.state.placeBet()) {
            this.ui.setStatus("Insufficient Compute Credits! Please upgrade your plan.", "var(--secondary)");
            this.state.isAutoplay = false;
            return;
        }

        this.isSpinning = true;
        this.ui.setSpinning(true);
        this.audio.playSpin();

        // System log satire
        if (Math.random() < 0.2) {
            const sysMsg = MESSAGES.SYSTEM[Math.floor(Math.random() * MESSAGES.SYSTEM.length)];
            this.state.addHistory({ bet: 0, payout: 0, type: 'system', message: sysMsg });
        }

        const results = [
            this.engine.getRandomSymbol(this.state.temperature),
            this.engine.getRandomSymbol(this.state.temperature),
            this.engine.getRandomSymbol(this.state.temperature)
        ];

        // Animate reels
        await Promise.all(this.ui.reelContainers.map((_, i) => this.ui.animateReel(i, results)));

        // Evaluate results
        const outcome = this.engine.evaluateSpin(results);
        this.isSpinning = false;
        this.ui.setSpinning(false);

        this.processOutcome(outcome, bet);
    }

    processOutcome(outcome, bet) {
        if (outcome.payout > 0) {
            this.state.updateCredits(outcome.payout);
            this.state.setWinStreak(true);
            
            const winMsg = MESSAGES.WIN[Math.floor(Math.random() * MESSAGES.WIN.length)];
            this.ui.setStatus(`${winMsg} (+${outcome.payout})`, "var(--primary)");
            
            if (outcome.type === 'jackpot') {
                this.audio.playJackpot();
                this.ui.celebrateWin('jackpot');
            } else {
                this.audio.playWin();
                this.ui.celebrateWin('small');
            }
        } else {
            this.state.setWinStreak(false);
            const lossMsg = MESSAGES.LOSS[Math.floor(Math.random() * MESSAGES.LOSS.length)];
            this.ui.setStatus(lossMsg, "var(--secondary)");
            this.audio.playLoss();
        }

        this.state.addHistory({
            bet,
            payout: outcome.payout,
            type: outcome.type,
            message: outcome.payout > 0 ? outcome.symbol.message : "Inference failed."
        });
    }

    async handleAutoplayState() {
        if (this.state.isAutoplay && !this.isSpinning) {
            await this.handleSpin();
            if (this.state.isAutoplay) {
                this.autoplayTimeout = setTimeout(() => this.handleAutoplayState(), 1000);
            }
        } else if (!this.state.isAutoplay && this.autoplayTimeout) {
            clearTimeout(this.autoplayTimeout);
            this.autoplayTimeout = null;
        }
    }
}

// Start the app when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.game = new App();
});
