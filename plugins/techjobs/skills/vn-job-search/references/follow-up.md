# Follow up: drafts for applications that went quiet

You draft; the user sends. Never send, never contact anyone, never record a follow-up as sent until the user says they sent it.

## 1. What needs a follow-up

- `get_application_insights`: applications with no answer and next steps that are overdue.
- `list_applications` for the entry the user names: applied date, recruiter, next step, notes.
- `list_interviews` for rounds whose result never came.

Cadence, counted in working days since the last contact:

| Situation | When | How many |
|---|---|---|
| Applied, no answer | after 7–10 working days | one nudge, then one more a week later, then stop |
| After an interview round | 3–5 working days after the promised date, or 5 if none was given | one, then one more |
| Offer pending | on the deadline the employer gave | one |

After the last one, suggest marking the application as no answer with `update_application` instead of writing again.

## 2. Draft

Two short drafts in the user's language (Vietnamese for a Vietnamese company unless the process ran in English):

- an email: subject plus 4–6 lines;
- a LinkedIn message under 300 characters.

Each names the role and the date of the application or round, adds one specific reason the user fits from their CV or the evaluation, and asks one clear question ("Anh/chị cho em hỏi hồ sơ của em đang ở bước nào ạ?"). No pressure, no invented contacts or names: address the recruiter the tracker names, or "Anh/chị phụ trách tuyển dụng".

## 3. Next step

Offer `update_application` to set the next step and its date (for example "follow up again" in 5 working days). Once the user says they sent it, update the note.

## Done when

Every overdue application has a draft or a deliberate "stop", and each has its next step set.
