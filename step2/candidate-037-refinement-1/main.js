import { State } from './modules/State.js';
import { Engine } from './modules/Engine.js';
import { UI } from './modules/UI.js';
import { AudioModule } from './modules/Audio.js';
import { Controls } from './modules/Controls.js';

class GameController {
    constructor() {
        this.state = new State();
        this.engine = new Engine(95); // 95% Target RTP
        this.ui = new UI();
        this.audio = new AudioModule();
        
        this.isSpinning = false;
        this.currentBet = 10;

        this.controls = new Controls(
            () => this.handleSpin(),
            (bet) => this.currentBet = bet,
            () => this.state.toggleTheme()
        );

        // Initial UI sync
        this.ui.update(this.state);
        this.ui.addLog("AI Inference System Online. Ready to scale.");
        
        // Subscribe UI to state changes
        this.state.subscribe((state) => this.ui.update(state));
    }

    async handleSpin() {
        if (this.isSpinning) return;
        
        if (this.state.tokens < this.currentBet) {
            this.ui.addLog("INSUFFICIENT COMPUTE UNITS. REQUEST VC FUNDING.", "error");
            return;
        }

        this.isSpinning = true;
        this.state.updateTokens(-this.currentBet);
        this.audio.playSpin();

        // Engine calculates result
        const result = this.engine.spin(this.currentBet);
        
        // Random message for atmosphere
        const SATIRICAL_MESSAGES = [
            "Aligning neural weights...",
            "Tokenizing hallucinations...",
            "Optimizing for maximum engagement...",
            "Reducing loss function...",
            "Synthesizing corporate synergy...",
            "Converting electricity into hype..."
        ];
        this.ui.addLog(SATIRICAL_MESSAGES[Math.floor(Math.random() * SATIRICAL_MESSAGES.length)]);

        // Animate UI
        await this.ui.animateSpin(result.reels, () => this.engine.getRandomSymbol());
        
        // Resolve result
        this.audio.playStop();
        this.state.updateTokens(result.winAmount);
        this.state.recordSpin(this.currentBet, result.winAmount);
        
        // Dynamic Difficulty Update
        this.engine.updateDifficulty(this.state.rtp);

        // Visual feedback
        if (result.winAmount > 0) {
            this.ui.addLog(result.message, 'win');
            this.audio.playWin();
            this.ui.showWinEffect(result.type);
        } else {
            this.ui.addLog(result.message);
        }

        this.isSpinning = false;

        // Autoplay logic
        if (this.controls.isAutoSpinEnabled() && this.state.tokens >= this.currentBet) {
            setTimeout(() => this.handleSpin(), 1000);
        }
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameController();
});
