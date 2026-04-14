const SYMBOLS = [
    { icon: '🤖', name: 'Bot', value: 10, message: 'Un-Hallucinated Fact!', count: 3 },
    { icon: '🧠', name: 'Neural Net', value: 25, message: 'Deep Learning Successful!', count: 2 },
    { icon: '🗑️', name: 'Training Data', value: 5, message: 'Data Scraped!', count: 4 },
    { icon: '🍄', name: 'Hallucination', value: 50, message: 'Creative Hallucination!', count: 1 },
    { icon: '⚖️', name: 'Safety Filter', value: -10, message: 'Safety Violation Detected!', count: 1 },
    { icon: '💎', name: 'AGI', value: 100, message: 'AGI ACHIEVED! (Kinda)', count: 0.5 },
    { icon: '🔥', name: 'Hype', value: 2, message: 'VC Funding Secured!', count: 5 }
];

// Expand symbols based on their 'count' to create a weighted reel
const SYMBOL_POOL = SYMBOLS.flatMap(s => Array(Math.ceil(s.count)).fill(s));

const MESSAGES = {
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
