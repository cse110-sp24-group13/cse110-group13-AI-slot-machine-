/**
 * Input & Controls Module
 * Responsibility: Map user inputs (keyboard/mouse) to game actions.
 * Follows SRP: Does not handle game logic or UI rendering directly.
 */
export class Controls {
    constructor(onSpin, onBetChange, onThemeToggle) {
        this.onSpin = onSpin;
        this.onBetChange = onBetChange;
        this.onThemeToggle = onThemeToggle;
        
        this.setupEventListeners();
        this.setupKeyboardListeners();
    }

    setupEventListeners() {
        // Spin Button
        const spinBtn = document.getElementById('infer-btn');
        spinBtn.addEventListener('click', () => this.onSpin());

        // Bet Select
        const betSelect = document.getElementById('bet-amount');
        betSelect.addEventListener('change', (e) => this.onBetChange(parseInt(e.target.value)));

        // Theme Toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.onThemeToggle());
        }

        // Auto-spin checkbox
        this.autoSpinCheck = document.getElementById('auto-spin');
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.onSpin();
                    break;
                case 'KeyB':
                    this.cycleBet();
                    break;
                case 'KeyT':
                    this.onThemeToggle();
                    break;
            }
        });
    }

    cycleBet() {
        const betSelect = document.getElementById('bet-amount');
        const nextIndex = (betSelect.selectedIndex + 1) % betSelect.options.length;
        betSelect.selectedIndex = nextIndex;
        this.onBetChange(parseInt(betSelect.value));
    }

    isAutoSpinEnabled() {
        return this.autoSpinCheck.checked;
    }
}
