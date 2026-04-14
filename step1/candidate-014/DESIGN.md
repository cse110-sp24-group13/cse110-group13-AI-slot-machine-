# Design Document: The AGI Accelerator Slot Machine

## 1. Vision & Aesthetics
- **Theme:** A sarcastic AI "training interface" where you gamble "Compute Credits" to achieve "AGI."
- **Visual Style:** Neon-cyberpunk, dark mode. Glassmorphism, glowing borders, and "monochrome terminal" fonts.
- **Interactive Feedback:** A "System Log" terminal that prints sarcastic AI messages (e.g., "Hallucinating a win for you..." or "I'm sorry, your balance violates my safety guidelines.").

## 2. Core Mechanics
- **Reels:** 3 reels.
- **Symbols:**
  - 🤖 **AGI** (Jackpot - 1000 credits)
  - 🧠 **LLM** (Large win - 200 credits)
  - 🔌 **GPU** (Medium win - 50 credits)
  - 💬 **Prompt** (Small win - 20 credits)
  - 🧊 **Weights** (Break even - 10 credits)
  - 🌫️ **Hallucination** (Loss - 0 credits)
- **Currency:** "Compute Credits." Start with 100. Spin cost: 10.
- **Animations:** CSS `transition` for reel spinning. Use `transform: translateY` for the scrolling effect.

## 3. Project Structure
- `index.html`: Layout (Slot machine frame, reels, display panel, terminal).
- `style.css`: Styling (Glassmorphism, animations, layout).
- `app.js`: Game logic (Spinning, RNG, balance, terminal messages).

## 4. Implementation Plan
1. **HTML Structure:** Define the reel container, the "System Log" terminal, and the control panel.
2. **CSS Styling:** Create the slot machine "cabinet" look and the scrolling reel effect using `overflow: hidden`.
3. **JS Logic:** Implement the "Spin" logic:
    - Generate random results based on symbol weights.
    - Animate reels by offsetting symbol strips.
    - Calculate win/loss and update the balance.
    - Update the terminal with context-aware sarcastic messages.
4. **Refinement:** Add interactive hover effects and ensuring responsive design.
