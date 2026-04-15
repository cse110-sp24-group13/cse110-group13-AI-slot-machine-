export const CONFIG = {
    REEL_COUNT: 3,
    SYMBOLS_PER_REEL: 30, // Virtual reel length for animation
    SYMBOL_HEIGHT: 150,
    INITIAL_CREDITS: 1000,
    MIN_BET: 10,
    MAX_BET: 500,
    DEFAULT_BET: 50,
    TARGET_RTP: 0.95,
    ANIMATION_DURATION: 2000,
    ANIMATION_STAGGER: 400
};

export const SYMBOLS = [
    { id: 'bot', icon: '🤖', name: 'Bot', value: 10, weight: 10, message: 'Un-Hallucinated Fact!' },
    { id: 'brain', icon: '🧠', name: 'Neural Net', value: 25, weight: 5, message: 'Deep Learning Successful!' },
    { id: 'data', icon: '🗑️', name: 'Training Data', value: 5, weight: 15, message: 'Data Scraped!' },
    { id: 'mush', icon: '🍄', name: 'Hallucination', value: 50, weight: 2, message: 'Creative Hallucination!' },
    { id: 'safety', icon: '⚖️', name: 'Safety Filter', value: -10, weight: 4, message: 'Safety Violation Detected!' },
    { id: 'agi', icon: '💎', name: 'AGI', value: 100, weight: 1, message: 'AGI ACHIEVED! (Kinda)' },
    { id: 'hype', icon: '🔥', name: 'Hype', value: 2, weight: 20, message: 'VC Funding Secured!' }
];

export const MESSAGES = {
    WIN: [
        "Generating profit...",
        "Statistically significant!",
        "Tokens emitted successfully.",
        "Your prompt was high quality."
    ],
    LOSS: [
        "Hallucination encountered.",
        "Out of context window.",
        "Temperature too high.",
        "Incoherent output detected."
    ],
    EMPTY: [
        "Predicting next token...",
        "Analyzing latent space...",
        "Optimizing loss function...",
        "Checking for bias..."
    ]
};
