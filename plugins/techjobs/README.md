# TechJobs.vn plugin

Tech jobs in Vietnam for your agent. The plugin connects Claude to the [techjobs.vn](https://techjobs.vn/mcp) MCP server (open IT jobs, companies, student programs; sign-in only for your own CV and Apply Tracker) and adds four skills.

## Install

```
/plugin install techjobs --marketplace techjobs-vn/skills
```

## Skills

| Skill | What it does |
|-------|--------------|
| `techjobs` | Connects your agent to techjobs.vn (MCP or REST) and says which tool to use when. Mirrors https://techjobs.vn/SKILL.md. |
| `vn-job-search` | Saves your targets and dealbreakers, triages a shortlist, scores each JD against your CV with evidence and saves the evaluation, then tailors the CV, asks for a referral, tracks the application and drafts follow-ups. |
| `vn-interview` | Prepares each interview round, runs a mock interview with feedback, debriefs into your Apply Tracker and keeps a story bank where every figure keeps its source. |
| `vn-offer-check` | Gross to Net with 2026 Vietnam tax and insurance rules, offer comparison, a plain reading of the contract and the terms to ask about. |

## What the plugin sends and runs

- The MCP server is `https://techjobs.vn/mcp`. Searching needs no account. When a tool needs your CV or tracker, techjobs.vn asks you to sign in (OAuth).
- `vn-offer-check` runs one local script, `skills/vn-offer-check/scripts/gross-net.mjs`, a pure calculator with no network access.
- The skills never apply, submit or send anything on your behalf; they draft and you decide.

## Links

- Documentation: https://techjobs.vn/mcp/setup#claude
- Support: https://techjobs.vn/mcp/setup#mcp-support
- Privacy policy: https://techjobs.vn/privacy
- Source and issues: https://github.com/techjobs-vn/skills

MIT licensed, see `LICENSE`.
