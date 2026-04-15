export class AudioManager {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playOsc(freq, type, duration, volume = 0.1) {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

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
        this.playOsc(150, 'square', 0.1, 0.05);
    }

    playWin() {
        this.playOsc(440, 'sine', 0.5, 0.1);
        setTimeout(() => this.playOsc(554.37, 'sine', 0.5, 0.1), 100);
        setTimeout(() => this.playOsc(659.25, 'sine', 0.5, 0.1), 200);
    }

    playLoss() {
        this.playOsc(100, 'sawtooth', 0.3, 0.1);
        setTimeout(() => this.playOsc(80, 'sawtooth', 0.3, 0.1), 150);
    }

    playJackpot() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playWin(), i * 300);
        }
    }
}
