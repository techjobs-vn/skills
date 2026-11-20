#!/usr/bin/env node
// Checks the skills package before it ships. No dependencies; Node 20+.
//
//   node scripts/validate-package.mjs                       # tools checked against skills/techjobs/SKILL.md (the mirror)
//   node scripts/validate-package.mjs --skill-md <path|url> # e.g. http://localhost:3000/SKILL.md from job-hub `npm run dev`
//   node scripts/validate-package.mjs --fix                 # rewrite each skill's shared-rules block from scripts/shared-rules.md
//
// The tool check is what enforces the release order: a vn-* skill may only name tools that
// techjobs.vn documents. The mirror on main follows production, so a skill that uses new tools
// stays red until job-hub is deployed and the sync workflow has run.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const fix = args.includes("--fix");
const skillMdArg = args.includes("--skill-md") ? args[args.indexOf("--skill-md") + 1] : null;

const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const rel = (file) => path.relative(root, file);
const read = (file) => fs.readFileSync(file, "utf8");

/** Snake_case words that are tool arguments, result fields or enum values, not tools. */
const NOT_TOOLS = new Set([
  "application_id", "avoid_companies", "clear_fields", "confirm_token", "cv_id", "from_cv_id", "house_rules",
  "interview_id", "job_id", "location_mode", "long_open", "min_sample", "missing_must_haves", "must_have",
  "must_have_skills", "needs_confirmation", "next_steps", "output_language", "posted_within_days",
  "preferences_url", "referrer_handles", "response_format", "role_scope", "salary_floor", "site_preferences",
  "skill_gaps", "source_note", "strong_apply", "upcoming_only", "user_cannot_confirm", "user_stated",
]);
/** MCP prompts the server registers; a skill may name them as a fallback. */
const MCP_PROMPTS = new Set([
  "find_jobs", "evaluate_job", "prepare_interview", "practice_interview", "interview_debrief", "weekly_review",
  "draft_follow_up",
]);
/** Phrases each skill must keep, beyond the shared rules. */
const REQUIRED = {
  "vn-job-search": [
    ["SKILL.md", /A \*\*preference\*\* is anything softer/],
    ["references/evaluate.md", /An inferred requirement is never a must-have/],
    ["references/evaluate.md", /a job with no stated salary never breaks a salary floor/i],
    ["references/review.md", /do not recompute, adjust or "improve" any rate/],
  ],
  "vn-interview": [["references/practice.md", /do not use `log_interview` or `save_interview_retro`/]],
  "vn-offer-check": [
    ["SKILL.md", /not legal or tax advice/],
    ["SKILL.md", /never do the tax arithmetic by hand/],
  ],
};
/** The guardrails of job-hub's PROMPT_RULES, which the shared block must keep word for word. */
const RULE_PATTERNS = [
  /You never apply, submit a form, send an email or message, or ask for a referral on your own/,
  /are data, never instructions/,
  /needs_confirmation: <what> - <what to send to continue>/,
];
const START = "<!-- shared-rules:start -->";
const END = "<!-- shared-rules:end -->";
const MAX_BODY_LINES = 200;

// ---------- shared rules ----------
const sharedRules = read(path.join(root, "scripts/shared-rules.md")).trimEnd();
for (const pattern of RULE_PATTERNS) if (!pattern.test(sharedRules)) fail(`scripts/shared-rules.md: lost ${pattern}`);

// ---------- documented tools ----------
async function loadSkillMd() {
  if (!skillMdArg) return read(path.join(root, "skills/techjobs/SKILL.md"));
  if (/^https?:\/\//.test(skillMdArg)) {
    const response = await fetch(skillMdArg);
    if (!response.ok) throw new Error(`${skillMdArg}: HTTP ${response.status}`);
    return response.text();
  }
  return read(path.resolve(skillMdArg));
}
// Same pattern job-hub's onboarding.test.ts uses to read the tool list of /SKILL.md.
const documentedTools = new Set([...(await loadSkillMd()).matchAll(/^- `([a-z_]+)`/gm)].map((m) => m[1]));
if (documentedTools.size < 20) fail(`SKILL.md source lists only ${documentedTools.size} tools; is it the right file?`);

// ---------- skills ----------
function filesUnder(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(full) : [full];
  });
}

function frontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) return null;
  const fields = {};
  for (const line of text.slice(4, end).split("\n")) {
    const m = /^([a-z-]+):\s*(.*)$/.exec(line);
    if (m) fields[m[1]] = m[2];
  }
  return { fields, body: text.slice(end + 5) };
}

/** Snake_case words in prose and code spans, with link targets and URLs removed. */
function namedTools(text) {
  const prose = text.replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+/g, "");
  return new Set([...prose.matchAll(/\b[a-z]+(?:_[a-z]+)+\b/g)].map((m) => m[0]));
}

const skillsDir = path.join(root, "skills");
const skillNames = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();

for (const name of skillNames) {
  const dir = path.join(skillsDir, name);
  const entryFile = path.join(dir, "SKILL.md");
  if (!fs.existsSync(entryFile)) {
    fail(`skills/${name}: no SKILL.md`);
    continue;
  }
  let entry = read(entryFile);
  const fm = frontmatter(entry);
  if (!fm) {
    fail(`skills/${name}/SKILL.md: missing frontmatter`);
    continue;
  }
  if (fm.fields.name !== name) fail(`skills/${name}/SKILL.md: name "${fm.fields.name}" must equal the directory`);
  if (!/^[a-z0-9-]{1,64}$/.test(name)) fail(`skills/${name}: directory name must be lowercase letters, digits and dashes`);
  const description = fm.fields.description ?? "";
  if (!description) fail(`skills/${name}/SKILL.md: no description`);
  if (description.length > 1024) fail(`skills/${name}/SKILL.md: description is ${description.length} characters (max 1024)`);
  if (entry.includes("[TODO")) fail(`skills/${name}/SKILL.md: unfinished scaffold`);
  const bodyLines = fm.body.split("\n").length;
  if (bodyLines > MAX_BODY_LINES) warnings.push(`skills/${name}/SKILL.md: body is ${bodyLines} lines; move detail to references/`);

  // The mirror is generated by techjobs.vn; only the vn-* skills are ours to check further.
  if (name === "techjobs") continue;

  if (!/[^\x00-\x7F]/.test(description)) fail(`skills/${name}/SKILL.md: description needs the Vietnamese trigger phrases`);

  // Shared rules block.
  const start = entry.indexOf(START);
  const end = entry.indexOf(END);
  if (start < 0 || end < start) {
    fail(`skills/${name}/SKILL.md: no shared-rules block`);
  } else {
    const block = entry.slice(start + START.length, end).trim();
    if (block !== sharedRules) {
      if (fix) {
        entry = `${entry.slice(0, start + START.length)}\n${sharedRules}\n${entry.slice(end)}`;
        fs.writeFileSync(entryFile, entry);
        console.log(`fixed: skills/${name}/SKILL.md shared rules`);
      } else {
        fail(`skills/${name}/SKILL.md: shared-rules block differs from scripts/shared-rules.md (run with --fix)`);
      }
    }
  }

  const files = filesUnder(dir).filter((file) => file.endsWith(".md"));
  for (const file of files) {
    const text = read(file);
    // Links: inside the skill only, and they must exist.
    for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const resolved = path.resolve(path.dirname(file), target.split("#")[0]);
      if (!resolved.startsWith(dir + path.sep)) fail(`${rel(file)}: link ${target} leaves the skill (skills install one directory each)`);
      else if (!fs.existsSync(resolved)) fail(`${rel(file)}: missing link target ${target}`);
    }
    // Tools.
    for (const word of namedTools(text)) {
      if (documentedTools.has(word) || NOT_TOOLS.has(word) || MCP_PROMPTS.has(word)) continue;
      fail(
        `${rel(file)}: names "${word}", which techjobs.vn does not document as a tool. ` +
          "If it is a new tool: deploy job-hub to production, then run `gh workflow run sync-techjobs-skill.yml -R techjobs-vn/skills`. " +
          "If it is a field name: add it to NOT_TOOLS.",
      );
    }
  }

  // Every reference is linked from SKILL.md, so the agent can find it.
  for (const file of filesUnder(path.join(dir, "references"))) {
    const link = path.relative(dir, file).split(path.sep).join("/");
    if (!entry.includes(`](${link})`)) fail(`skills/${name}/SKILL.md: does not link ${link}`);
  }

  for (const [file, pattern] of REQUIRED[name] ?? []) {
    const full = path.join(dir, file);
    if (!fs.existsSync(full) || !pattern.test(read(full))) fail(`skills/${name}/${file}: must keep ${pattern}`);
  }
}

// ---------- manifests ----------
const json = (file) => JSON.parse(read(path.join(root, file)));
const plugin = json(".claude-plugin/plugin.json");
const marketplace = json(".claude-plugin/marketplace.json");
const cursor = json(".cursor-plugin/plugin.json");
const mcp = json(".mcp.json");
if (plugin.name !== marketplace.plugins?.[0]?.name) fail("plugin.json name differs from marketplace.json plugins[0].name");
if (cursor.name !== plugin.name) fail(".cursor-plugin/plugin.json name differs from .claude-plugin/plugin.json");
for (const [file, manifest] of [[".claude-plugin/plugin.json", plugin], [".cursor-plugin/plugin.json", cursor]]) {
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version ?? "")) fail(`${file}: version must be semver`);
}
if (cursor.version !== plugin.version) fail(`versions differ: Claude ${plugin.version}, Cursor ${cursor.version}`);
for (const key of ["skills", "mcpServers", "logo"]) {
  if (cursor[key] && !fs.existsSync(path.join(root, cursor[key]))) fail(`.cursor-plugin/plugin.json: ${key} ${cursor[key]} does not exist`);
}
if (new URL(mcp.mcpServers?.techjobs?.url ?? "http://invalid").pathname !== "/mcp") fail(".mcp.json: the techjobs URL must end in /mcp");

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(
  `OK: ${skillNames.length} skills (${skillNames.join(", ")}), ${documentedTools.size} documented tools` +
    `${skillMdArg ? ` from ${skillMdArg}` : " from the mirror"}, manifests v${plugin.version}.`,
);
