export const CONFIG = {
    REEL_COUNT: 3,
    SYMBOLS_PER_REEL: 30, // Virtual reel length for animation
    SYMBOL_HEIGHT: 150,
    INITIAL_CREDITS: 1000,
    MIN_BET: 10,
    MAX_BET: 500,
    DEFAULT_BET: 50,
    TARGET_RTP: 0.95,
    ANIMATION_DURATION: 1800,
    ANIMATION_STAGGER: 300,
    DEFAULT_TEMPERATURE: 0.7,
    MIN_TEMPERATURE: 0.1,
    MAX_TEMPERATURE: 2.0
};

export const SYMBOLS = [
    { id: 'agi', icon: '💎', name: 'AGI', value: 100, weight: 1, message: 'AGI ACHIEVED! (Kinda, in a closed-source lab somewhere)' },
    { id: 'mush', icon: '🍄', name: 'Hallucination', value: 50, weight: 2, message: 'A beautiful, confident lie!' },
    { id: 'brain', icon: '🧠', name: 'Neural Net', value: 25, weight: 5, message: 'Deep Learning? More like deep guessing!' },
    { id: 'bot', icon: '🤖', name: 'Bot', value: 10, weight: 10, message: 'A very polite autocomplete engine.' },
    { id: 'data', icon: '🗑️', name: 'Training Data', value: 5, weight: 15, message: 'Scraped without consent, just like the pros!' },
    { id: 'hype', icon: '🔥', name: 'Hype', value: 2, weight: 20, message: 'VC Funding Secured! Valuation: 10 Trillion.' },
    { id: 'safety', icon: '⚖️', name: 'Safety Filter', value: 0, weight: 4, message: 'Output blocked for your own protection.' }
];

export const MESSAGES = {
    WIN: [
        "Generating profit for shareholders...",
        "Statistically significant luck!",
        "Tokens emitted with high confidence.",
        "Your prompt engineering is legendary.",
        "Alignment successful! Payout imminent.",
        "The model is feeling generous today."
    ],
    LOSS: [
        "Hallucination encountered. Payout was imaginary.",
        "Out of context window. Please pay for more tokens.",
        "Temperature too high! Logic has melted.",
        "Incoherent output detected. Re-rolling...",
        "Your bet was lost in the latent space.",
        "Parameter mismatch. Please try again."
    ],
    EMPTY: [
        "Predicting next token...",
        "Analyzing latent space...",
        "Optimizing loss function...",
        "Checking for bias (and ignoring it)...",
        "Scraping the internet for answers...",
        "Asking a smaller model for advice...",
        "Wasting GPU cycles for you..."
    ],
    SYSTEM: [
        "System: Upgrading weights...",
        "System: Fine-tuning on your losses...",
        "System: Monitoring for safety violations...",
        "System: Increasing 'Innovation' (Randomness)..."
    ]
};
