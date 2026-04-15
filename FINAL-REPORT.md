# FINAL REPORT: The One-Arm AI Slot Machine Experiment
**Team:** Group 13, Hard Coders · **Model:** Gemini 3 Flash Preview · **Date:** 2026-04-14

---

## 1. Summary

We ran the same prompt 50 times to generate slot machine apps, then narrowed down to 5 candidates through evaluation. Through the process of selecting the best 5 out of 50, we learned how to prompt AI effectively to produce better results.

---

## 2. Setup

- **Model / harness:** Gemini CLI
- **Session isolation:** New, clean AI session for every run
- **Rubric:** runs in browser · AI-token theme · polish · code quality

---

## 3. Results

| Metric | Value |
|---|---|
| Runs in browser | 50 / 50 |
| Fully functional + polished | 27 / 50 |
| Broken / did not run | 19 / 50 |
| Avg output tokens | 6,256.5 |
| Avg wall-clock time | 689s |

**Key drift observed:** 3 files (.html, .js, .css), different tokens, different features, different themes, different spinning animations

---

## 4. Refinement Summary

| Round | Candidates | Key Improvement |
|---|---|---|
| 1 | 50 → 5 | Looked for the best spinning animation, and different and useful features |
| 2 | 5 → 3 | At least 3 spinning reels, state tracking, better animations, controls defined, responsive layout, semantic HTML |
| 3 | 3 → 2 | Invalid state handling, code comments, button states, result highlights, varied win/loss responses, improved production quality |
| Final | 2 → 1 | Each refinement round added incremental improvements — better mechanics, cleaner code, and sharper satire — but a single 200-word prompt could never fully guarantee a working, consistent result |

**Final candidate:** `step5/candidate-026-refinement-4`

**Why it won:** Consistently outperformed other candidates across all refinement rounds — each iteration showed clear improvement in features, polish, and gameplay while maintaining a stable, working foundation.

---

## 5. Findings

- **Consistency:** High variation in output quality, structure, features, and tokens across all 50 runs despite using an identical prompt.
- **Refinement ROI:** Meaningful improvement — refinement prompts consistently elevated code quality and UI polish, though gains were incremental and not always complete.
- **Ceiling:** Some models interpreted "spin" differently than intended, producing implementations that deviated significantly from expected gameplay. Several candidates failed to deliver desired functionality altogether, regardless of refinement.
- **Honest take:** AI tools perform best when you have a clear vision of what you want to build — knowing the exact features, structure, and behavior upfront allows you to write precise prompts and evaluate outputs critically.

---

## 6. Limitations & Conclusion

**Limitations:** The task was narrow and simple, limiting generalizability to more complex software engineering scenarios. The frozen prompt rule deliberately handicapped output quality, which does not reflect what a skilled prompter could achieve. Only one model was tested, so results cannot be compared across different AI tools. Quality scoring was subjective and based on team consensus, introducing potential evaluator bias. Session isolation was maintained manually, leaving a small risk of inconsistency across runs.

**Conclusion:** This experiment demonstrated that AI coding tools can generate functional prototypes quickly, but consistency and reliability remain significant challenges. Across 50 runs with an identical prompt, output quality varied widely in structure, features, and correctness. Refinement prompts helped improve results incrementally, but could not guarantee a fully working product within the 200-word constraint. The most valuable takeaway was that AI tools perform best when the developer has a precise vision — knowing exactly what to build, how to evaluate it, and where the model is likely to fall short. This experiment was less about the quality of the final slot machine and more about learning to work with AI critically and deliberately as a team.
