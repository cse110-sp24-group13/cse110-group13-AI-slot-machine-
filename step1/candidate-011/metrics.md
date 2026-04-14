# Candidate 011 Metrics

## Run Metadata
- **Run ID: Candidate-011** 
- **Timestamp (ISO 8601): 2026-04-13T17:32:55Z** 
- **Model + Version String: gemini-3-flash-preview** 

## Token Usage
- **Input Tokens: 113,892** 
- **Output Tokens: 6,848** 
- **Total Tokens: 120,740** 

## Timing
- **Wall-Clock Time (s): 1m 58s ** 
- **Tool-Reported Time (s): 1m 13s** 

## Output
- **Files Produced (count): 3** 
- **Files Produced (names): index.html, script.js, style.css** 
- **Lines of Code: 448 ** 
- **Runs in Browser: Yes** 

## Quality Notes
- **App Quality Notes:**
  - Dark neon UI with symbols, status messages, and payout table
  - Core mechanic is functional: reels spin, credits deduct, wins are detected and credited correctly.
  - Hallucination symbol (🌫️) returning zero on a three-of-a-kind 

- **Code Quality Notes:**
  - Clean vanilla JS across three separated files
  - Game state is minimal and readable
  - weighted random symbol selection 
