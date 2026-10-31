---
name: vn-job-search
description: Run a disciplined tech job search in Vietnam on techjobs.vn data — shortlist open roles, score each JD against the user's CV with evidence, gate out weak fits, then tailor the CV, ask for a referral and track the application. Use when the user wants help finding or choosing tech jobs in Vietnam ("tìm việc IT", "nên apply job nào", "đánh giá JD này"), or asks whether a specific job fits them.
---

# Vietnam tech job search

A filter before the user applies, not a spray of applications. Every job either earns an **apply** with evidence from the CV, or gets a clear **skip** with the reason. The agent never submits an application or sends a message on its own; the user clicks apply.

Tools come from the techjobs.vn MCP server (`search_jobs`, `get_job`, …). If they are not loaded, follow the `techjobs` skill to connect first; until then, use its REST fallback for search. Tools marked "Requires techjobs.vn sign-in" are optional: the search and evaluation steps work without an account.

Answer in the user's language (most users write Vietnamese).

## 1. Profile

Build the profile the rest of the run scores against:

- **CV**: signed in → `get_cv`; otherwise ask the user to paste or attach it.
- **Targets**: role, seniority, city or remote, salary floor (say Gross or Net, VND or USD), and dealbreakers (e.g. no onsite outside HCM, no outsourcing, no night shifts, must sponsor a visa).

Done when the user has confirmed a short profile you wrote back: role, seniority, location, salary floor, dealbreakers, top 5 proven skills.

## 2. Shortlist

- `search_jobs` with `response_format: "detailed"` and `posted_within_days` 14–30. Several narrow searches beat one broad one. Filters are exact, so cast wide and filter by reading:
  - skill tags vary (`go` / `golang`, `js` / `javascript`): search each spelling, and also as `query`;
  - `seniority` drops jobs that have no seniority tag: search without it and judge the level from the title;
  - a job posted for several cities can have no `city`: repeat the search without `city` and keep the ones whose location includes the target.
- Remote abroad wanted → `search_remote_jobs` too. Signed in → also `suggest_jobs_for_me`.
- Drop jobs that break a dealbreaker on their face.

Done when there are at most 10 jobs, each with its techjobs.vn link, and the user agrees which to evaluate (or names a job they already found). If the user asked you to choose, pick the closest fits and say why.

## 3. Evaluate

For each job: `get_job`, then read the full description from its techjobs.vn link when you can fetch web pages (salary and work mode, when the employer gives them, are only on that page); `get_company` for size, industry, stack and whether employees refer.

Split the JD into its requirements and give each one an **evidence** tier from the CV:

- **proven**: the CV shows it, with a role, project or number;
- **adjacent**: a close skill the user can credibly argue (Vue for a React role);
- **missing**: nothing in the CV.

A requirement written as alternatives ("Java or Go") is proven when one of them is.

No data source flags outsourcing companies: judge from `get_company` (industry, description, client-project wording) and mark it "inferred".

Score each block 1–5, citing evidence, not impressions:

| Block | What it weighs |
|---|---|
| Role & scope | Does the day-to-day match the target role? |
| Must-have skills | Share of must-haves that are proven |
| Seniority | Years and scope versus the level asked |
| Location & mode | City, onsite/hybrid/remote, hours |
| Pay | Against the salary floor, when the JD or user gives a number; compare Gross with Gross (see `vn-offer-check`) |
| Company | Product vs outsourcing, size, stability, referral available |

A block with no data (salary not stated, work mode unknown) scores 3 and becomes a question for the employer, listed under Next step.

Overall = weighted mean, one decimal: Role & scope and Must-have skills count double, the other four once (sum ÷ 8).

Then the **gate**:

- any dealbreaker hit → **skip**, whatever the score;
- overall below 4.0 → **skip**, and say what would change it (a missing must-have, a level gap, an unknown salary turning out above the floor);
- 4.0 and above → **apply**.

Signed in and the user wants a second opinion on one job → `match_cv` (daily quota; one job at a time).

Done when every evaluated job has a block table, its missing must-haves listed, and an apply or skip verdict the user has seen.

## 4. Act on each apply

Offer these in order and do each only when the user says yes:

1. **Tailor the CV**: `create_cv_variant` with the `job_id`, rewrite to lead with the proven evidence for this JD, save with `update_cv_variant`, share the review link. Rewrite only what is in the CV or what the user told you; a missing skill stays missing.
2. **Referral**: `list_company_referrers`; if any, the user picks, then `request_referral` in its two steps (preview, then confirm only after the user's explicit yes). None → offer `watch_company_referrers`.
3. **Track**: `track_job` as saved, then as applied once the user says they submitted.

## 5. Follow up

When the user comes back:

- `list_applications` and `list_interviews`; point out overdue next steps and applications with no answer after 14 days (suggest one polite follow-up the user sends).
- Interview booked → `log_interview`, and prepare from the JD's must-haves: one STAR story per must-have, built from the CV's evidence. After it → `save_interview_retro` with what the user said.
- Offer received → hand over to `vn-offer-check`.
- Every few weeks → `get_application_insights`: which channel and which CV get answers; adjust the profile and the gate.

## Output

Per evaluated job, one block:

```
### <title> — <company>  ·  <link>
Verdict: APPLY 4.3 | SKIP 3.1 (reason)
| Block | Score | Evidence |
Missing must-haves: …
Next step: …
```

Close the run with a one-line summary: N evaluated, N apply, N skip, and the next action.
