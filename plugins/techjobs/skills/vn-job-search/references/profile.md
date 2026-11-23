# Profile: the targets every score is measured against

Signed in, the profile lives on techjobs.vn and every agent and session starts from it. Not signed in, keep it in the conversation.

## 1. Read what is there

`get_search_profile` returns:

- from the website: roles, seniority, cities and work mode (`site_preferences`). These are changed only on the website, at `preferences_url`; send the user there instead of saving them yourself;
- saved by agents: `salary_floor` with its currency (VND or USD), basis (gross or net) and period (month or year), `dealbreakers`, `priorities`, `avoid_companies`, `output_language` and `notes`;
- `missing`: what is still to ask. `dealbreakers` is listed until the user has answered, even "none".

## 2. Ask only what is missing

One question at a time, in the user's words. For the salary floor, always get the basis and period: "40 triệu" alone is not a floor until you know gross or net, per month or per year.

For each limit the user names, decide with them whether it is a **dealbreaker** (hard rule, forces skip) or a **preference** (moves a score). When unsure, ask: "Nếu job hay mọi thứ khác nhưng vướng điều này, bạn có bỏ qua không?" Yes → dealbreaker; no → priority.

Also the CV: signed in → `get_cv`; not signed in → ask the user to paste or attach it. Note the top 5 skills the CV proves with a role, project or number.

## 3. Save only what the user said

`update_search_profile` with the fields the user gave or confirmed:

- hard rules → `dealbreakers` (at most 10, each a short rule: "onsite ngoài HCM", "outsourcing", "lương dưới 40 triệu gross/tháng");
- softer wants → `priorities`;
- companies they named → `avoid_companies`;
- standing instructions for you ("luôn trả lời bằng tiếng Anh", "đừng gợi ý job ở Đà Nẵng") → not here: they go in the user's local house rules file, which techjobs.vn does not store. Switch to the house rules mode ([house-rules.md](house-rules.md));
- the user answered "no dealbreakers" → save `dealbreakers` as an empty list, so it is not asked again.

A list you pass replaces the saved one: read it first and send the whole list. `clear_fields` clears a field the user wants gone. Never save a guess, an inference from the CV, or a fact about the candidate: facts live in the CV.

## Done when

You wrote the profile back in five lines (role and seniority, location and work mode, salary floor with basis, dealbreakers, top skills) and the user confirmed it.
