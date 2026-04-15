/**
 * Audio Management Module
 * Responsibility: Synthesize and play sound effects using Web Audio API.
 * Follows SRP: No UI or game logic dependencies.
 */
export class AudioModule {
    constructor() {
        this.ctx = null;
        this.enabled = false;
        
        // Resume context on user interaction
        ['click', 'keydown'].forEach(evt => {
            window.addEventListener(evt, () => this.init(), { once: true });
        });
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    play(freq, type = 'sine', duration = 0.1, volume = 0.1) {
        if (!this.enabled) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSpin() {
        this.play(150, 'triangle', 0.2, 0.2);
    }

    playStop() {
        this.play(100, 'square', 0.05, 0.1);
    }

    playWin() {
        const now = this.ctx.currentTime;
        [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => this.play(f, 'sine', 0.2, 0.2), i * 100);
        });
    }

    playJackpot() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.play(400 + Math.random() * 1000, 'sawtooth', 0.1, 0.1);
            }, i * 50);
        }
    }
}
