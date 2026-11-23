# Prepare a round

## 1. Find the round and its context

- `list_interviews` with `upcoming_only`, or the application the user names (`list_applications`): round type, date and time, format, interviewers.
- `get_job` and `get_company` for the role and the company: product or outsourcing, size, stack, whether employees refer.
- `list_job_evaluations` for that job: its missing must-haves and open questions are the gaps to prepare. No evaluation yet → offer one first (the `vn-job-search` skill), or work from the JD.
- `list_stories` and, for a returning user, `get_application_insights`: the areas to improve their past retros repeat.

Company and interviewer details you cannot find stay unknown. Never make up what a company asks in its interviews.

## 2. Round types common in Vietnam

| Round | What it tests | Prepare |
|---|---|---|
| HR screening | motivation, expected salary, notice period, English | the salary answer (gross, with the floor from the profile), why this company, notice period |
| Technical interview | fundamentals and the JD's stack | the must-haves, one project explained end to end |
| Live coding / online test | problem solving under time | 2–3 timed problems in the language they use; talk while coding |
| Take-home | a small realistic task | ask the scope and the expected hours before starting; note it with `log_interview` |
| System design | trade-offs at the level asked | one design from the user's own work, then a classic one |
| Behavioural / culture fit | how the user works with others | 5–6 STAR stories: conflict, failure, ownership, deadline, feedback |
| Manager / final | scope, growth, team fit | questions about the team, the roadmap, how success is measured |

## 3. Write the plan

- 8–12 likely questions for this round type, each mapped to a story or marked "no story yet";
- the gaps to close before the date, each with what to review and how long it takes;
- 3–5 questions for the interviewer, including the evaluation's open questions. Common ones in Vietnam: salary gross or net, the insurance salary base (lương đóng bảo hiểm), probation length and pay, overtime and on-call, product or client project, team size.

## 4. Close the "no story yet" rows

For each, build a story with the user from their CV and their own words (see story-bank.md), then `save_story`. One question at a time; never fill in a result they did not give.

## Done when

The user has the plan, every must-have of the JD maps to a story or to a gap to prepare, and the stories built today are saved. Offer a practice session next.
