# Review: how the search is going

The numbers come from techjobs.vn. Present them as returned: do not recompute, adjust or "improve" any rate, and do not extrapolate from a few applications.

## 1. Read

`get_application_insights` and `get_search_profile`.

## 2. Funnel and channels

- The funnel and where every application ended (rejected, no answer, waiting), days per stage.
- Response and interview rates by source channel and by CV. A rate the tool withheld (below `min_sample` applications) is "too few to say", never an estimate.
- Patterns need data: with fewer than 5 applications sent, show the counts and say it is too early for patterns.

## 3. Do the evaluations predict anything?

From `evaluations.calibration`: whether jobs evaluated as apply got more responses, interviews and offers than the ones evaluated as consider or skip, only where a rate is given. Report how many applications went against the verdict, without judging the user for it. If apply jobs do no better, say so plainly and suggest which block to look at (often pay or seniority), but change nothing in the scoring.

## 4. What to learn next

`evaluations.skill_gaps`: the skills evaluations most often marked missing, must-haves first. For each of the top three, one concrete step (a project, a course, a way to show it in the CV) and the jobs it would have unlocked.

## 5. Adjust and keep

- Follow-ups due → the follow-up mode.
- The user wants to change targets (a lower floor, a new dealbreaker, a city) → `update_search_profile`, only after they say yes.
- Offer `save_insights_snapshot` to compare next time; nothing is added when nothing changed.

## Done when

The user has the funnel, the follow-ups due, what the evaluations say (or "too few to say"), the top skill gaps with one step each, and the profile changes they agreed to.
