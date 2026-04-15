import { StateManager } from './js/state.js';
import { Engine } from './js/engine.js';
import { DifficultyManager } from './js/difficulty.js';
import { UIManager } from './js/ui.js';
import { InputHandler } from './js/input.js';
import { AudioManager } from './js/audio.js';

class App {
    constructor() {
        this.state = new StateManager();
        this.engine = new Engine();
        this.difficulty = new DifficultyManager(this.engine);
        this.ui = new UIManager(this.state);
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
            const symbol = this.engine.getRandomSymbol();
            reel.innerHTML = `<div class="symbol">${symbol.icon}</div>`;
        });

        this.state.subscribe(() => this.handleAutoplayState());
    }

    async handleSpin() {
        if (this.isSpinning) return;
        
        const bet = this.state.currentBet;
        if (!this.state.placeBet()) {
            this.ui.setStatus("Insufficient credits!", "var(--secondary)");
            this.state.isAutoplay = false; // Stop autoplay if out of credits
            return;
        }

        this.isSpinning = true;
        this.ui.setSpinning(true);
        this.audio.playSpin();

        const results = [
            this.engine.getRandomSymbol(),
            this.engine.getRandomSymbol(),
            this.engine.getRandomSymbol()
        ];

        // Animate reels
        await Promise.all(this.ui.reelContainers.map((_, i) => this.ui.animateReel(i, results)));

        // Evaluate results
        const outcome = this.engine.evaluateSpin(results);
        this.isSpinning = false;
        this.ui.setSpinning(false);

        this.processOutcome(outcome, bet);
        this.difficulty.adjust(this.state.getRTP());
    }

    processOutcome(outcome, bet) {
        if (outcome.payout > 0) {
            this.state.updateCredits(outcome.payout);
            this.state.setWinStreak(true);
            this.ui.setStatus(`WIN: ${outcome.symbol.message} (+${outcome.payout})`, "var(--primary)");
            
            if (outcome.type === 'jackpot') {
                this.audio.playJackpot();
                this.ui.celebrateWin('jackpot');
            } else {
                this.audio.playWin();
                this.ui.celebrateWin('small');
            }
        } else {
            this.state.setWinStreak(false);
            this.ui.setStatus("Hallucination encountered. No payout.", "var(--secondary)");
            this.audio.playLoss();
        }

        this.state.addHistory({
            bet,
            payout: outcome.payout,
            type: outcome.type
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
