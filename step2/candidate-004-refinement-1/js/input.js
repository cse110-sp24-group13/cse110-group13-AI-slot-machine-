export class InputHandler {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.init();
    }

    init() {
        // Button listeners
        document.getElementById('spin-btn').addEventListener('click', () => this.callbacks.onSpin());
        document.getElementById('bet-plus').addEventListener('click', () => this.callbacks.onBetAdjust(10));
        document.getElementById('bet-minus').addEventListener('click', () => this.callbacks.onBetAdjust(-10));
        document.getElementById('autoplay-btn').addEventListener('click', () => this.callbacks.onAutoplayToggle());

        // Keyboard listeners
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.callbacks.onSpin();
            }
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                this.callbacks.onBetAdjust(10);
            }
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                this.callbacks.onBetAdjust(-10);
            }
            if (e.code === 'KeyA') {
                e.preventDefault();
                this.callbacks.onAutoplayToggle();
            }
        });
    }
}
