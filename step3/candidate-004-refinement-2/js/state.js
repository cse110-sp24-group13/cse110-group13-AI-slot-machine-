import { CONFIG } from './config.js';

export class StateManager {
    constructor() {
        this.credits = CONFIG.INITIAL_CREDITS;
        this.currentBet = CONFIG.DEFAULT_BET;
        this.temperature = CONFIG.DEFAULT_TEMPERATURE;
        this.winStreak = 0;
        this.totalSpins = 0;
        this.totalBet = 0;
        this.totalWon = 0;
        this.isAutoplay = false;
        this.history = [];
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        callback(this);
    }

    notify() {
        this.listeners.forEach(callback => callback(this));
    }

    updateCredits(amount) {
        this.credits += amount;
        if (amount > 0) this.totalWon += amount;
        this.notify();
    }

    setTemperature(value) {
        this.temperature = parseFloat(value);
        this.notify();
    }

    placeBet() {
        if (this.credits >= this.currentBet) {
            this.credits -= this.currentBet;
            this.totalBet += this.currentBet;
            this.totalSpins++;
            this.notify();
            return true;
        }
        return false;
    }

    adjustBet(delta) {
        const nextBet = this.currentBet + delta;
        if (nextBet >= CONFIG.MIN_BET && nextBet <= CONFIG.MAX_BET) {
            this.currentBet = nextBet;
            this.notify();
        }
    }

    setWinStreak(isWin) {
        if (isWin) {
            this.winStreak++;
        } else {
            this.winStreak = 0;
        }
        this.notify();
    }

    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        this.notify();
    }

    clearHistory() {
        this.history = [];
        this.notify();
    }

    addHistory(event) {
        this.history.unshift({
            timestamp: new Date().toLocaleTimeString(),
            ...event
        });
        if (this.history.length > 50) this.history.pop();
        this.notify();
    }

    getRTP() {
        if (this.totalBet === 0) return 0;
        return (this.totalWon / this.totalBet) * 100;
    }
}
