# TechJobs.vn skills

Agent skills for tech job search in Vietnam, on top of the [techjobs.vn](https://techjobs.vn) MCP server: open jobs from companies' own career pages, refreshed hourly.

Skill tìm việc IT ở Việt Nam cho Claude Code, Cursor, Codex: chấm JD theo CV trước khi apply, tính lương Gross ⇄ Net theo luật 2026.

[![skills.sh](https://skills.sh/b/techjobs-vn/skills)](https://skills.sh/techjobs-vn/skills)
[![TechJobs.vn MCP connector](https://glama.ai/mcp/connectors/vn.techjobs/techjobs/badges/score.svg)](https://glama.ai/mcp/connectors/vn.techjobs/techjobs)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

```bash
npx skills add techjobs-vn/skills
```

| Skill | What it does |
|---|---|
| [`techjobs`](plugins/techjobs/skills/techjobs/SKILL.md) | Connects your agent to techjobs.vn (MCP or REST) and says which tool to use when. Mirrors https://techjobs.vn/SKILL.md, synced daily. |
| [`vn-job-search`](plugins/techjobs/skills/vn-job-search/SKILL.md) | Saves your targets and dealbreakers, triages a shortlist, scores each JD against your CV with evidence and saves the evaluation, skips weak fits, then tailors the CV, asks for a referral, tracks the application, drafts follow-ups and reviews your search. |
| [`vn-interview`](plugins/techjobs/skills/vn-interview/SKILL.md) | Prepares each interview round from the JD and your evaluation, runs a mock interview with feedback, debriefs into your Apply Tracker, and keeps a story bank where every figure keeps its source. |
| [`vn-offer-check`](plugins/techjobs/skills/vn-offer-check/SKILL.md) | Gross ⇄ Net with 2026 tax and insurance rules, offer comparison, a plain reading of the contract, and the terms to ask about (probation, notice period, insurance base, 13th month). |

### How the skills work

Each `vn-*` skill is a small router: ask for something in your own words and the agent picks the mode, reads that mode's file in `references/` and runs it with the techjobs.vn tools. Invoke a skill with nothing else (for example `/vn-job-search` in Claude Code) or ask "bạn làm được gì?" to see its menu. Your own model does the reading and writing; techjobs.vn stores what it saves (search profile, evaluations, stories, Apply Tracker) and computes the verdict, confidence and statistics the same way for every agent. No extra model key is needed.

Your standing instructions for the agent (language, style, what to leave out) go in a plain file you own, `.techjobs/house-rules.md` in the project or `~/.techjobs/house-rules.md` for every project, like career-ops' `_custom.md`. Any agent that can read files follows it; techjobs.vn never stores it. [`references/house-rules.md`](plugins/techjobs/skills/vn-job-search/references/house-rules.md) has the rules and a starter file.

Agents that connect only the MCP server (Claude.ai, ChatGPT) get a short version of the same workflows as MCP prompts: `find_jobs`, `evaluate_job`, `prepare_interview`, `practice_interview`, `interview_debrief`, `weekly_review`, `draft_follow_up`.

## Install

Any agent supported by the [skills CLI](https://github.com/vercel-labs/skills) (Claude Code, Codex, Cursor, OpenCode, …):

```bash
npx skills add techjobs-vn/skills
```

Claude Code as a plugin (skills plus the MCP server in one step):

```bash
claude plugin marketplace add techjobs-vn/skills
claude plugin install techjobs@techjobs
```

Antigravity as a plugin (skills plus the MCP server; the Marketplace listing is pending review):

```bash
agy plugin install https://github.com/techjobs-vn/skills
```

Cursor as a plugin: the repository carries a Cursor manifest (`.cursor-plugin/plugin.json`) with the same skills and the MCP server, for the Cursor Marketplace. Until it is listed there, use `npx skills add techjobs-vn/skills` and add the MCP server as the `techjobs` skill describes.

No account is needed to search. Tracker, CV and referral tools ask you to sign in to techjobs.vn the first time.

## Try

- "Hỏi tôi mức lương tối thiểu và những điều tôi không chấp nhận, rồi lưu lại."
- "Tìm job backend Go ở Hà Nội, lọc nhanh rồi đánh giá 3 job hợp nhất."
- "Job này có đáng apply không: https://techjobs.vn/…"
- "Tuần sau tôi phỏng vấn vòng technical ở Grab, giúp tôi chuẩn bị và luyện thử."
- "Tôi vừa phỏng vấn xong vòng 1, ghi lại giúp tôi."
- "Tổng kết việc tìm việc của tôi tuần này."
- "Offer A 45 triệu gross, offer B 38 triệu net, tôi có 1 người phụ thuộc. Cái nào hơn?"
- "Find backend Go jobs in Hanoi and tell me which ones are worth applying to."

If a skill saved you time, a ⭐ helps other agents and people trust the repo.

## Credits

The evaluate-before-you-apply method in `vn-job-search` and the story bank in `vn-interview` are inspired by [career-ops](https://github.com/career-ops-hq/career-ops). This repository is not affiliated with that project.

Salary rules in `vn-offer-check` are a calculation aid, not tax or legal advice. Sources and the as-of date are in [references/vn-payroll.md](plugins/techjobs/skills/vn-offer-check/references/vn-payroll.md).

## For maintainers

- `plugins/techjobs/skills/techjobs/SKILL.md` is generated by techjobs.vn and synced daily; never edit it here.
- Release order: deploy the techjobs.vn server with any new tools first, run the sync (`gh workflow run sync-techjobs-skill.yml -R techjobs-vn/skills`), then merge skills that use them. CI enforces it: `node scripts/validate-package.mjs` fails while a skill names a tool the synced SKILL.md does not document. Locally, check against a dev server with `--skill-md http://localhost:3000/SKILL.md`.
- Tests: `node --test "tests/*.test.mjs"`. More in [AGENTS.md](AGENTS.md).

## Privacy

Skills run in your agent. Calls to the techjobs.vn MCP server follow the [techjobs.vn privacy policy](https://techjobs.vn/privacy).

## License

MIT
