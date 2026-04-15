/**
 * State Management Module
 * Responsibility: Track and persist game state, manage balance, stats, and history.
 * Follows SRP: Does not render UI or calculate game results.
 */
export class State {
    constructor() {
        this.tokens = parseInt(localStorage.getItem('slot-tokens')) || 10000;
        this.stats = JSON.parse(localStorage.getItem('slot-stats')) || {
            totalBet: 0,
            totalWon: 0,
            spins: 0,
            winStreak: 0,
            maxStreak: 0
        };
        this.history = JSON.parse(localStorage.getItem('slot-history')) || [];
        this.theme = localStorage.getItem('slot-theme') || 'dark';
        this.subscribers = [];
        
        // Initial sync
        document.body.dataset.theme = this.theme;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notify() {
        this.subscribers.forEach(cb => cb(this));
        this.save();
    }

    save() {
        localStorage.setItem('slot-tokens', this.tokens);
        localStorage.setItem('slot-stats', JSON.stringify(this.stats));
        localStorage.setItem('slot-history', JSON.stringify(this.history));
        localStorage.setItem('slot-theme', this.theme);
    }

    updateTokens(amount) {
        this.tokens += amount;
        this.notify();
    }

    recordSpin(bet, win) {
        this.stats.spins++;
        this.stats.totalBet += bet;
        this.stats.totalWon += win;
        
        if (win > 0) {
            this.stats.winStreak++;
            this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.winStreak);
        } else {
            this.stats.winStreak = 0;
        }

        const entry = {
            id: Date.now(),
            bet,
            win,
            rtp: ((this.stats.totalWon / this.stats.totalBet) * 100).toFixed(1),
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.unshift(entry);
        if (this.history.length > 50) this.history.pop();
        
        this.notify();
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = this.theme;
        this.notify();
    }

    get rtp() {
        if (this.stats.totalBet === 0) return 100;
        return (this.stats.totalWon / this.stats.totalBet) * 100;
    }
}
