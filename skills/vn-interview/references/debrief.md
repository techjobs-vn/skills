# Debrief a real round

Record what happened in the user's own words. Your guesses are never their lessons.

## 1. Ask, one question at a time

Which round it was; the questions asked; how the user answered; what went well; what they would do differently; anything that surprised them about the company or team; what comes next and when.

## 2. Save the round

- `log_interview` to mark the round done, with its result when known (passed or failed; leave it out while the user is still waiting), or to add the round if it was never logged.
- `save_interview_retro` with the questions asked, what went well, what to improve, red flags, what to prepare next, a 1–5 confidence and improvement tags, all from what the user said.

## 3. Contradictions

The interviewer said something that contradicts the CV, the evaluation or the posting (a different level, no remote after all, a lower salary range, a different stack) → point it out and ask the user which is right. Never change the CV, a story or the evaluation silently. If an evaluation is now wrong, offer to evaluate again (the `vn-job-search` skill).

The user realises a claim they made is wrong or overstated → re-save the story with the corrected figure and provenance `user_stated`, or archive it (`archived`), and stop using the old figure.

## 4. Stories

A strong example in their answers → offer `save_story` with provenance `user_stated`.

## 5. Red flags

Across rounds (a vague role, unpaid take-home work of many days, pressure to accept fast, salary only "thỏa thuận" at the last round, interviewers who cannot say what the team does) → list them for the user as observations, not verdicts.

## 6. Next step

Suggest what to prepare for the next round and offer `update_application` to set the next step and its date. An offer → the `vn-offer-check` skill.

## Done when

The round is logged, the retro is saved in the user's words, contradictions were raised, and the next step is set.
