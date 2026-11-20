# Apply: tailor, refer, track

For a job evaluated as apply, or one the user wants to apply to anyway. Offer the steps in order and do each only when the user says yes. The user submits the application; you never do.

## 1. Tailor the CV

1. `get_job` for the JD and `get_cv` for the CV as it is now (another CV by `cv_id` from `list_my_cvs` if the user names one).
2. `create_cv_variant` with the `job_id` (and `from_cv_id` to start from another CV). It returns an editable copy.
3. Rewrite to lead with the proven evidence for this JD: reorder, reword, move the must-haves up, cut what does not serve this job. Keywords get reformulated, never fabricated: a missing requirement stays missing, and a figure from a story that is not `cv` or `user_stated` needs the four-answer check from the rules first.
4. `update_cv_variant` with the sections you rewrote; each section you pass replaces that section. Never change the name, email or phone unless the user gave the new value.
5. Share the review link from the result and say what you changed and why. Editing a copy never changes the primary CV (CV chính); only `set_primary_cv` does, and only when the user asks and agrees in their own reply.

## 2. Referral

1. `list_company_referrers` for the job's company: anonymous profiles (role, team, level, areas). The user picks 1 to 5.
2. `request_referral` without `confirm_token`: it returns a preview (job, CV chính, message, how many referrers get it, weekly quota left). Show the whole preview.
3. Call it again with the `confirm_token` only after the user explicitly agrees in their own reply. If they change the message, get a new preview.
4. Nobody refers at that company → offer `watch_company_referrers`.

A referral goes to real people and cannot be undone.

## 3. Track

`track_job` as saved when the user decides to apply, then as applied once they say they submitted. Pass on any `next_steps` it returns. Optional details: source channel, salary, next step and its date.

## Done when

The user has the review link of the tailored CV, the referral was sent or deliberately skipped, and the job is in the Apply Tracker with its status.
