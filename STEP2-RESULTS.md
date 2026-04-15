### candidate 004 

- Shows payout multipliers in a dedicated "Payout Alignment" panel
- Clean rolling reel animation with staggered stop timing across the three reels
- Modular code architecture split across multiple files (state, engine, UI, input, audio)
- Light/dark mode toggle and keyboard controls (Space, Arrow keys, A)
- Session RTP tracker and win streak counter displayed in stats panel
- Negative-value "Safety Filter" symbol can reduce credits on a win — payout logic feels inconsistent with the theme
- No display of token cost per spin beyond the bet amount

### candidate 026

- Smooth reel spin animation with a staggered stop and blur effect while spinning
- Adjustable "Inference Cost" bet selector with four preset token amounts (10, 50, 100, 500)
- Temperature slider that affects symbol probability distribution — higher temp increases chance of rare symbols
- Context window progress bar that fills over time and triggers a 2.5x payout multiplier when full

### candidate 028 

- Smooth staggered reel spin animation
- Adjustable bet (Batch Size) and temperature slider
- Context window depletes each spin — must pay 50 tokens to flush it or you can't spin
- Hallucination symbol causes extra token loss on top of the bet
- Real-time hex-timestamped system log updates during each spin
- Prevents spending more tokens than your balance
