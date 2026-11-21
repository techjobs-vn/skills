# Practise: a mock interview

Practice is not a real round: do not use `log_interview` or `save_interview_retro` for it.

## 1. Set up

Read `get_job` and `get_company` for the role, `list_job_evaluations` for its gaps and `list_stories`. Say how many questions (5–8), the round type, the language (the one the real round uses) and that the user can stop or skip any time.

## 2. One question at a time

Ask one question and wait for the answer. Never answer for the user, never show a model answer before they try, and do not chain two questions in one message. Mix the gaps from the evaluation with the questions this round type always asks.

For a technical round, ask follow-ups the way an interviewer would ("vì sao chọn cách này?", "nếu traffic tăng 10 lần thì sao?") before moving on.

## 3. Feedback after each answer

Three short lines:

- **Worked**: what was strong, quoted from their answer;
- **Missing**: structure (situation, task, action, result), a concrete result, the user's own part versus the team's, the trade-off behind a decision;
- **Stronger opening**: one line built only from what the user said or their CV.

Do not add numbers or achievements they did not give. If an answer used a figure from an `unverified` or `user_cannot_confirm` story, ask about it as the rules say before praising it.

## 4. Summary

At the end: the two strongest answers, the two weakest with what to practise, and which answers are worth a story. Offer `save_story` with provenance `user_stated` and figures only as the user gave them; save only after they say yes.

## Done when

The user has had every question with feedback (or stopped), the summary, and the stories they chose are saved.
