# Code Review Quality

Created: 2026-05-11
Author: belu.montoya@dialpad.com
Category: Infrastructure
Status: Final
Research: Standard

## Problem Statement

Dialtone runs **three AI-based code reviewers** with no defined lane allocation, producing overlapping low-value commentary that erodes trust. External reviewer feedback on PR #1264 (Ignacio Ropolo, 2026-05-11) named the symptom: "you are doing so bad code reviews lately." Independent industry audits report **15–28% noise** in CodeRabbit comments. The local `/review` skill is structurally worse — no validator pass, no confidence threshold, no explicit do-not-flag list, and 9 open-ended quality questions in `.claude/rules/code-review.md` that bias toward high recall / low precision. Codex, currently invoked through the global `codex:rescue` skill (a debugging/implementation use case, not the review-specific `/codex:adversarial-review` command it should be using), has zero project-specific configuration — it reviews with no `AGENTS.md`, no knowledge of Dialtone's conventions, no awareness of breaking-change rules, and no understanding of what the other reviewers already cover.

A fourth surface — the GitHub Actions Claude reviewer (`.github/workflows/claude-code-review.yml` for PR review, `.github/workflows/claude.yml` for the `@claude` chatbot) — exists in the repo but **has never run successfully and never will due to org-level restrictions on `anthropics/claude-code-action@v1` / the required API key secret**. These workflows are dead config and a maintenance liability; they are deleted in this PRD's scope.

The fix is to **define explicit lanes for each remaining reviewer, eliminate inter-reviewer overlap, and apply the documented industry pattern** (multi-agent discovery → per-finding validator → confidence threshold → explicit "What NOT to Flag" list) to the reviewers that don't yet have it. Published benchmarks for systems using this pattern report ~1.2 findings per review average and false-positive reductions from 40% → 12%. The lane allocation: CodeRabbit = automated first-pass on every PR (tuned for low verbosity); local `/review` = the deep critical-path reviewer, manually triggered pre-PR; Codex = adversarial second-opinion when stuck. Three reviewers, three distinct triggers, no overlap.

## Reviewer Lanes

| Reviewer | Lane | Trigger | Project config |
|----------|------|---------|----------------|
| **CodeRabbit** | First-pass automated review: diff-local nits, style, common pitfalls, standards enforcement | Every PR open/synchronize | `.coderabbit.yaml` (tune for verbosity in this PRD) |
| **Local `/review` skill** | Deep critical-path review: convention compliance, architectural concerns, cross-package impact. The only Claude-based reviewer in the system (the GHA workflow is dropped — see below) | Manual `/review` invocation | `.claude/skills/review.md` + agents + `.claude/rules/code-review.md` |
| **Codex (adversarial review)** | Adversarial second-opinion: find what other reviewers missed. Different-model (GPT-5.x) perspective that questions the approach itself, not just defects. Codex's built-in `prompts/adversarial-review.md` already implements the skeptical-stance + material-findings-only + structured-JSON-with-confidence pattern — we add Dialtone context, not behavior | Manual `/codex:adversarial-review` invocation | `AGENTS.md` at repo root (NEW — Dialtone context + lane boundaries, no rule duplication). Codex CLI also natively supports `--uncommitted` and `--base <ref>` for diff-only scoping |

### Lane boundary rules

Each reviewer has **one job** and must not encroach on the others' surface:

- **CodeRabbit** flags diff-local style nits, common pitfalls, linter-equivalent issues, breaking-change-without-footer detection. **Does not** opine on architecture, cross-file impact, or material design decisions.
- **Local `/review`** flags Dialtone convention violations (path-scoped rules), HIGH SIGNAL logic/correctness bugs, cross-file architectural issues. **Does not** duplicate CodeRabbit's nit/style coverage; **does not** post inline PR comments; **does not** run in CI.
- **Codex adversarial review** challenges the implementation approach itself: assumptions, design tradeoffs, attack surfaces, what fails under stress. **Does not** flag style nits, convention violations, or anything CodeRabbit/local-`/review` would have caught.

A finding produced by one reviewer that would also be produced by another is the failure case this PRD is designed to eliminate.

## Core User Flows

### Flow 1: Run a deep review on the current branch

1. User runs `/review` with no arguments on a branch with changes
2. Skill detects the diff (staged + unstaged + branch vs. base) and the set of changed files. **Scope is strictly diff-only**: agents read full files for context but findings must reference lines present in the diff. Pre-existing issues on unchanged lines are an explicit false-positive category (per the official Anthropic plugin's exclusion list).
3. Skill spawns **3 parallel discovery agents in background tasks**:
   - **Agent A — Dialtone Conventions**: reads `.claude/rules/code-review.md` (rewritten — see Scope) + path-scoped rules under `.claude/rules/*.md` whose `paths:` frontmatter matches changed files. Flags only clear, quotable rule violations.
   - **Agent B — Bugs & Logic**: reviews the diff for logic errors, broken invariants, missing error handling, incorrect API usage. Flags only HIGH SIGNAL issues (compile/parse failures, definite logic errors, security-sensitive bugs).
   - **Agent C — Cross-file / Architectural**: uses CodeGraph (`codegraph_callers`, `codegraph_callees`, `codegraph_impact`) to assess blast radius and pattern fit. Flags only issues invisible from a diff-local view (broken callers, pattern divergence from existing module, dependency-direction violations).
4. Each agent writes its candidate findings to a temp file
5. After all 3 discovery agents complete, skill spawns the **Validator agent** for each candidate finding:
   - Takes finding + PR description + relevant file content
   - Scores confidence 0–100 against an evidence rubric
   - Drops findings < 80 confidence
6. Skill deduplicates findings post-validator: two findings collapse into one if they share `file_path` + line within ±2 + matching severity/theme. The higher-confidence finding wins; the other's justification is appended as supporting context.
7. Skill prints filtered, deduplicated findings to the terminal, grouped by file, with confidence score, severity, and a one-line justification per finding. No GitHub API calls — local report only.
8. User reviews findings, decides which to act on or post manually

### Flow 2: Focused-area review

1. User runs `/review accessibility` (or `vue`, `css`, `api`, `testing`, `i18n`)
2. Skill enables only Agent A (Dialtone Conventions), with a path-scoped rule subset matching the area
3. Validator + threshold still applied
4. Output as Flow 1

`/review <file>` mode (previously supported) is removed — same behavior is reachable by running `/review` on a branch where only that file has changes.

### Flow 3: Codex adversarial second-opinion

1. After CodeRabbit + local `/review`, user is unsure about a subtle change, suspects an assumption might not hold, or wants a different-model perspective
2. User runs `/codex:adversarial-review` (with optional `--base <ref>` or `--uncommitted` for diff scoping)
3. Codex CLI reads `AGENTS.md` at repo root for Dialtone context. The built-in adversarial prompt template (`prompts/adversarial-review.md` in the codex plugin) provides the skeptical-stance and structured-output behavior; AGENTS.md tells Codex *what Dialtone is*, *what the other reviewers already cover*, and *where its lane begins*
4. Codex returns structured JSON findings with confidence scores. The codex plugin's foreground/background mode handling presents the output verbatim to the user
5. User decides what to act on. `/codex:rescue` remains available separately for when Claude is stuck on debugging/implementation (not a review use case)

## Scope

### In Scope

- **Rewrite `.claude/rules/code-review.md`** from 9 open-ended quality questions to:
  - Objective triggers with severity (BLOCKING / IMPORTANT / NIT)
  - Explicit "What NOT to Flag" section (adapted from official Anthropic plugin: pre-existing issues, nitpicks, linter-catchable issues, general quality, things requiring context outside the diff, things CodeRabbit handles)
  - HIGH SIGNAL definition (compile errors, definite logic errors, clear quotable rule violations)
  - Evidence requirements (file:line citation, quoted rule, or call-graph reference)
- **Rewrite `.claude/skills/review.md`** to orchestrate the 3-agent + validator pipeline:
  - Discovery phase: 3 parallel `Agent` calls (run_in_background=true) writing findings to temp files
  - Polling loop for completion (bash file-existence check)
  - Validator phase: per-finding agent calls with confidence rubric
  - Filter phase: drop confidence < 80
  - Output phase: grouped-by-file terminal report
- **Create `.claude/agents/review-dialtone-conventions.md`** (Agent A) — reads path-scoped rules, flags only quotable rule violations
- **Create `.claude/agents/review-bugs-logic.md`** (Agent B) — diff-focused logic/bug agent with HIGH SIGNAL rubric
- **Create `.claude/agents/review-architecture.md`** (Agent C) — CodeGraph-integrated cross-file reviewer
- **Create `.claude/agents/review-validator.md`** — per-finding confidence-scoring agent (0–100, rubric from official Anthropic plugin)
- **Update `.claude/agents/review.md`** (existing background agent for large diffs) — refactor to call the same pipeline so behavior is consistent inline vs. backgrounded
- **Drop `/review <file>` mode** from the skill and command surface — the same scope is reachable by running `/review` on a branch with only that file changed. `/review` (no args) and `/review <area>` remain.
- **Investigate and tune `.coderabbit.yaml` for higher per-comment signal** — the noise problem isn't unique to local `/review`; CodeRabbit is also a documented contributor (Lychee audit: 28% noise; PR audits: 15% useless + 21% nitpicks). The goal is a higher useful-to-noise ratio per CodeRabbit comment, regardless of total count. Investigation targets (specific settings TBD during /spec, but candidates include):
  - `reviews.profile`: confirm whether the inherited parent (`dialpad/coderabbit/.coderabbit.yaml`) sets `assertive`; if so, override to `chill` for this repo.
  - `reviews.poem: false`, `reviews.high_level_summary: false`, `reviews.review_status: false`, `reviews.collapse_walkthrough: true`, `reviews.related_issues: false`, `reviews.related_prs: false` — disable cosmetic/meta commentary that adds line count without signal.
  - `reviews.tools.<linter>.enabled: false` — selectively disable any tool whose findings are already covered by our local linters (ESLint, Stylelint, commitlint) to remove duplicate-of-CI commentary.
  - `path_instructions`: audit the current entries (lines 71–272 of `.coderabbit.yaml`) for instructions that produce per-PR commentary on conventions our ESLint/Stylelint plugins already enforce. Remove instructions that drive duplicate flags.
  - **Confirm diff-scope behavior**: verify that CodeRabbit's review surface is strictly the PR diff (not adjacent unchanged lines). If the inherited config or any path instruction expands the context window beyond the diff, tighten it.

  Deliverable: a single PR-ready commit to `.coderabbit.yaml` that increases the per-comment usefulness ratio. Success is judged by manual rating of comments on a benchmark PR (useful vs. noise), not by raw count. A configuration that produces 6 high-signal comments is better than one producing 3 low-signal ones; a configuration that produces 20 high-signal comments is also fine. Count is descriptive; usefulness is the metric.
- **Delete the dead GitHub Actions Claude workflows and their support scripts** — `anthropics/claude-code-action@v1` is restricted at the org/secret level and these workflows have never executed successfully. Removing dead config eliminates a maintenance liability and a false reviewer-landscape entry that confused the original PRD draft. Files to delete:
  - `.github/workflows/claude-code-review.yml` (label-triggered PR reviewer, 217 lines)
  - `.github/workflows/claude.yml` (`@claude` chatbot for issues/PRs, 54 lines)
  - `.github/scripts/safe-read.sh` (only used by `claude-code-review.yml`)
  - `.github/scripts/safe-grep.sh` (only used by `claude-code-review.yml`)
  - `.github/scripts/safe-glob.sh` (only used by `claude-code-review.yml`)
  - Verify before deleting: `grep -rli "safe-read\|safe-grep\|safe-glob\|claude-code-action\|claude-review" .github/ .claude/ scripts/` returns only the files listed here. If anything else references them, address those callers first.
  - The breadth of coverage previously embedded in `claude-code-review.yml` (11 categories including FTL i18n, cross-package impact, accessibility detail) **must be preserved in the new `.claude/rules/code-review.md`** so we don't lose Dialtone-specific review coverage when the workflow goes away. This is an explicit requirement of the rules rewrite, not an afterthought.
- **Create `AGENTS.md` at repo root** — the canonical Codex CLI project-config file (same role as `CLAUDE.md` for Claude Code). Read automatically by every Codex CLI invocation, including `/codex:adversarial-review`, `/codex:review`, and `/codex:rescue`. Contents are **context + lane boundaries, not rule duplication**:

  Required sections:
  1. **What Dialtone is** (1 paragraph) — public npm design system monorepo, breaking-change sensitivity (breaking changes ship as patches if not labeled), consumed by `dialpad/firespotter`, `dialpad/ios`, and external users. Reference CLAUDE.md for build commands and architecture.
  2. **Reviewer landscape** (table) — copies the Reviewer Lanes table from this PRD verbatim so Codex knows what CodeRabbit and local `/review` already cover. This is the most important section — Codex's job description is *find what they missed*.
  3. **Codex's single job** — "Adversarial second-opinion. Question the implementation approach itself: assumptions, design tradeoffs, attack surfaces, what fails under stress. Do not flag style nits, convention violations, or anything CodeRabbit / local `/review` covers. Do not soften findings with 'consider' / 'might want to' — when an issue is real, state it directly with evidence per the structured output contract you already use."
  4. **What NOT to flag** — explicit list mirroring CodeRabbit's coverage (style, nits, formatting, breaking-change-footer detection) AND local `/review`'s coverage (Dialtone path-scoped convention violations from `.claude/rules/*.md`, Vue `validator` vs `validate`, BEM, design-token usage, etc.). If Codex would produce a finding in either of those categories, it stops.
  5. **Diff-scope expectation** — Codex must use `--uncommitted` or `--base <ref>` to constrain review surface; findings outside the diff are excluded.
  6. **Pointer to project conventions** — link to `.claude/rules/code-review.md` and CLAUDE.md so Codex *understands* what counts as a convention without needing to *enforce* them (enforcement is local `/review`'s job).

  **Out of AGENTS.md**: line-by-line review rules. The codex plugin's `prompts/adversarial-review.md` already implements the review behavior (skeptical stance, attack surface taxonomy, finding bar, structured JSON output, confidence scoring). Duplicating those instructions in AGENTS.md weakens Codex's distinct lane.

  Length target: ≤ 200 lines. Same calibration as CLAUDE.md per Anthropic guidance ("bloated files cause Claude to ignore your actual instructions" applies equally to Codex).
- **Measurement script** at `scripts/benchmark-review.mjs` — runs `/review` and captures Codex / CodeRabbit comments against a curated list of recent merged PRs (5–10). Captures **per-finding data**: file:line, severity, evidence cited, originating reviewer, lane attribution, and a manual usefulness rating slot (useful / noise — filled in by reviewer during evaluation, not auto-scored). Supports before/after comparison on the usefulness ratio, not on count. Count is captured descriptively for context but is not the metric.

### Explicitly Out of Scope

- **GitHub inline PR comments from `/review`** — local `/review` output is terminal-only by design. Adding `--post-comments` is a possible future PR; keeping it out of v1 avoids overlap with CodeRabbit's automated commenting and removes GitHub API surface from the build.
- **Replacing CodeRabbit entirely** — out of scope. CodeRabbit stays the first-pass tool for diff-local nits/style; we are *tuning* it for less verbosity, not removing it. The two systems remain complementary.
- **Resurrecting the deleted GHA workflows** with a different action or alternate auth. If org-level restrictions on Anthropic actions/keys change later, that's a future PR — outside this scope.
- **The `anthropic-practices-reviewer` and `config-reviewer` agents** (`.claude/agents/`) — these audit `.claude/` configuration itself, not PR code. Different lane. Not touched.
- **`.claude/skills/address-review.md`** — handles incoming PR comments, not generating reviews. Not touched.
- **Retiring or replacing path-scoped rules** (`.claude/rules/vue-components.md`, `vue-tests.md`, `css-utilities.md`, etc.) — these are good and validated by research ("Rules only work when small, narrow, and scoped"). Agent A reads them; they don't change.
- **Major UX changes to `/review`** — the slash command surface gets one removal (`/review <file>`); `/review` and `/review <area>` are preserved. This is primarily an internal redesign, not a UX overhaul.
- **Multi-model orchestration** (Haiku for cheap checks, Opus for bugs) — single-model (Sonnet) for v1. Cost optimization deferred.
- **Persistent learnings / per-PR memory** — out of v1; future enhancement if validator + threshold isn't enough.

## Technical Context

### Existing surface area

- `/Users/belumontoya/Desktop/dialtone/.claude/skills/review.md` — current single-pass skill orchestration
- `/Users/belumontoya/Desktop/dialtone/.claude/agents/review.md` — current background agent for large diffs (>10 files)
- `/Users/belumontoya/Desktop/dialtone/.claude/commands/review.md` — thin slash-command wrapper
- `/Users/belumontoya/Desktop/dialtone/.claude/rules/code-review.md` — the 9-question checklist (root cause of low-precision output)
- `/Users/belumontoya/Desktop/dialtone/.claude/rules/{vue-components,vue-tests,css-utilities,...}.md` — path-scoped rules, validated to remain as-is
- `/Users/belumontoya/Desktop/dialtone/.coderabbit.yaml` — CodeRabbit configuration (currently 272 lines, with `inheritance: true` from `dialpad/coderabbit/.coderabbit.yaml`). Touched for verbosity tuning, not structurally rewritten.
- `/Users/belumontoya/Desktop/dialtone/.github/workflows/claude-code-review.yml`, `.github/workflows/claude.yml`, `.github/scripts/safe-{read,grep,glob}.sh` — **DELETED** (dead config; see Scope). The 11-category coverage previously embedded in `claude-code-review.yml` is migrated into the rewritten `.claude/rules/code-review.md`.
- `/Users/belumontoya/Desktop/dialtone/AGENTS.md` (NEW) — Codex CLI project context; reviewer landscape; adversarial second-opinion stance.

### Reference patterns

- `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/code-review/commands/code-review.md` — official Anthropic plugin: 5 parallel agents + Haiku validator + confidence ≥ 80 + explicit false-positive list. Direct architectural reference for the validator phase, the confidence rubric, and the do-not-flag list.
- `~/.claude/plugins/marketplaces/claude-code-plugins/plugins/code-review/commands/code-review.md` — sibling implementation: 4 parallel agents + per-issue Opus validator + HIGH SIGNAL rule. Reference for the HIGH SIGNAL definition.

### Constraints

- **Tool integration**: agents are spawned via the `Agent` tool with `run_in_background=true`. Findings are passed between phases by writing to `/tmp/dialtone-review-<session>-<phase>-<n>.json` and polling via bash file-existence loop (per testing.md condition-based waiting). No `TaskOutput`-style polling.
- **CodeGraph access**: Agent C requires `codegraph_*` MCP tools to be available in the agent's tool list. Already configured at the user level.
- **Single-model assumption**: all reviewer agents and the validator use Sonnet. No model orchestration in v1.
- **Session isolation not required**: this is a local-only tool, not parallel-agent territory.
- **No new dependencies**: the entire change lives in `.claude/{skills,agents,rules}/` and a single Node script under `scripts/`. No package.json change, no NX target.

### Performance budget

- A `/review` run on a typical PR (3–10 files) should complete in under 90 seconds (3 parallel discovery agents + serial validator calls, one per candidate finding). This is a functional budget — review runtime, not finding quality.
- **No count-based budget for findings.** Per-finding usefulness is the quality metric (see Success Criteria). The research data point "~1.2 findings per review average for high-trust systems" is context, not a target; if our reviewers produce more findings and all are useful, that is a win.
- Large diffs (>10 files) still route through `.claude/agents/review.md` background agent, which runs the same pipeline in an isolated context.

## Research Findings

### Key Findings

- **Industry baseline noise rate is 15–28% for CodeRabbit** (Lychee audit 28%; independent PR audit 15% useless + 21% nitpicks). The complaint pattern is universal, not a Dialtone outlier.
- **Trust collapse is the documented failure mode** for noisy AI reviewers: "Teams lose trust within a week and rip it out." Alert-fatigue analogy is exact.
- **The validated solution is multi-agent + verification + threshold + explicit do-not-flag**. Published by Anthropic for Claude Code Review, deployed by Cloudflare at scale, replicated across multiple open-source pipelines.
- **One published team reduced false positives 40% → 12%** using negative examples ("What NOT to Flag") + feedback loops.
- **High-trust systems average ~1.2 findings per review** — they bias hard for signal over recall. This is research context, **not** our target. Per-finding usefulness is the metric we optimize for; if our reviewers produce more findings and all are useful, that beats a low count of noisy findings.
- **Path-scoped rules are validated**: "Rules only work when small, narrow, and scoped. LLMs have a hard time following too many instructions at once." Dialtone's `.claude/rules/*.md` pattern is correct.
- **Evidence-based filtering beats inference**: "Require evidence before findings are posted — file:line citations rather than inferences from naming."
- **Differentiation lane is documented**: CodeRabbit = "automated first-pass, obvious issues, enforce standards." Claude Code = "deep reviews of critical PRs when change touches core business logic, security-sensitive code, complex distributed systems." We pick the latter lane.

### Sources

- [How CodeRabbit delivers accurate AI code reviews on massive codebases](https://www.coderabbit.ai/blog/how-coderabbit-delivers-accurate-ai-code-reviews-on-massive-codebases)
- [The Cloudflare Blog: Orchestrating AI Code Review at scale](https://blog.cloudflare.com/ai-code-review/)
- [Anthropic Introduces Agent-Based Code Review for Claude Code (InfoQ)](https://www.infoq.com/news/2026/04/claude-code-review/)
- [Claude Code Docs — Code Review](https://code.claude.com/docs/en/code-review)
- [Optimizing AI Code Reviews: A Multi-Agent Pipeline Approach](https://earezki.com/ai-news/2026-04-13-how-i-built-a-multi-agent-code-review-pipeline/)
- [Agentic AI Code Review: From Confidently Wrong to Evidence-Based](https://platformtoolsmith.com/blog/agentic-ai-code-review/)
- [How To Write Rules for AI Coding Tools (VirtusLab)](https://virtuslab.com/blog/ai/how-to-write-rules-for-ai)
- [Automated Code Review In Practice (arXiv)](https://arxiv.org/html/2412.18531v1)

## Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Branch off | `staging` (not `next`) | Production-track work; `next` is for prerelease |
| Review lane | Deep critical-path reviewer | Match published Claude Code Review pattern; complementary to CodeRabbit's first-pass lane |
| Output mode | Local terminal report only | Lowest risk; zero overlap with CodeRabbit's automated commenting; no GitHub API surface to maintain in v1 |
| Architecture | 3 discovery agents + 1 validator | Hits Dialtone conventions / bugs / cross-file lanes; lighter than the 5-agent official plugin; heavier than single-pass — matches our scope |
| Phasing | Ship full design in one PR | User preference: don't fragment into Phase 1 + Phase 2 |
| Confidence threshold | 80 | Industry standard from research (75–80 range); matches official Anthropic plugin's filter |
| Single-model | Sonnet for all agents in v1 | Avoids model-orchestration complexity; cost optimization is a future PR |
| Discovery agents | Parallel via `Agent` with `run_in_background=true` | Native Claude Code primitive; matches official plugin's pattern; polling via bash file-existence (per testing.md) |
| `.claude/rules/code-review.md` | Full rewrite | Open-ended questions are the root cause of low precision; can't be patched, must be replaced |
| Path-scoped rules | Keep as-is | Research validated small/narrow/scoped pattern; Agent A reads them, doesn't replace them |
| GitHub inline comments | Out of scope (v1) | Keeps lanes clean vs. CodeRabbit; defer to follow-up PR if demand emerges |
| CodeRabbit config | Tune for higher per-comment signal, do not remove | The two tools are complementary; improving CodeRabbit's signal ratio is the same problem as improving local `/review`'s signal ratio. Solving only the local side leaves half the noise on PRs unchanged. Comment count is not the metric — usefulness ratio is. |
| `/review <file>` mode | Drop | Redundant with running `/review` on a branch where only that file changed; one less surface to maintain |
| Scope | All 3 active PR reviewers (CodeRabbit, local `/review`, Codex) + delete dead GHA workflows | Solving overlap in one reviewer while leaving the others noisy doesn't fix the trust problem. Dead GHA workflows had to be removed to avoid maintaining what doesn't run. |
| GHA Claude workflows | Delete entirely (`claude-code-review.yml`, `claude.yml`, supporting `safe-*` scripts) | `anthropics/claude-code-action@v1` is restricted at the org/secret level and never executes successfully; dead config is a liability |
| Coverage migration | The 11-category breadth previously in `claude-code-review.yml` (FTL i18n, cross-package, accessibility detail) moves into `.claude/rules/code-review.md` | Without this, deleting the workflow loses Dialtone-specific review coverage |
| Codex entry point | `/codex:adversarial-review` (not `/codex:rescue`) | Adversarial-review is review-specific; `/codex:rescue` is for debugging when Claude is stuck — different use case. Picking the wrong command was a mistake in the previous PRD draft. |
| Codex configuration approach | `AGENTS.md` at repo root, ≤ 200 lines, context + lane boundaries + explicit "What NOT to flag" list, no rule duplication | Codex CLI auto-loads AGENTS.md. The codex plugin's `prompts/adversarial-review.md` already implements review behavior — AGENTS.md provides Dialtone context, not behavior. |
| Reviewer lane allocation | CodeRabbit = automated first-pass / `/review` = manual deep critical-path (local-only) / Codex = adversarial second-opinion | Three reviewers, three distinct triggers, three single-responsibility jobs. Overlap is the failure case this PRD eliminates. |
| Claude-based review | Local-only (no GHA, no PR posting in v1) | Per user direction: Claude runs locally; CodeRabbit handles every-PR coverage; the GHA Claude workflows are dead config and deleted in scope. |

## Success Criteria

**Primary metric — per-finding usefulness, not count.** A finding is "useful" if it caught a real issue, prompted a substantive discussion, or led to a code change. A finding is "noise" if it was a style nit covered elsewhere, a false positive, a pre-existing issue, a duplicate of another reviewer's flag, or a low-value suggestion a senior reviewer wouldn't post. Count is captured descriptively in the benchmark script (to understand reviewer workload), but it is **not** a success criterion — high counts of useful findings are fine, low counts of noisy findings are not.

Success criteria:

- [ ] Every surfaced finding has: confidence ≥ 80, severity tag (BLOCKING / IMPORTANT / NIT), and evidence (file:line citation, quoted rule, or CodeGraph reference)
- [ ] On a benchmark set of 5 recent merged PRs, manual rating shows ≥ 80% of `/review`'s surfaced findings are "useful" (caught a real issue / would prompt discussion / would lead to a code change)
- [ ] On the same benchmark set, ≥ 80% of CodeRabbit's surfaced comments (after `.coderabbit.yaml` tuning) are rated "useful" — baseline pre-tuning rate measured first for comparison
- [ ] On the same benchmark set, ≥ 80% of Codex `/codex:adversarial-review` findings are rated "useful" and trace to the adversarial lane (questioning approach, attack surface, design tradeoff — not style or conventions)
- [ ] No finding overlaps with what another reviewer already flagged on the same PR — verified by manual cross-check on 3 benchmark PRs. A duplicate finding is a noise finding.
- [ ] No finding flags a line outside the diff on any benchmark PR; pre-existing issues on unchanged lines are explicitly excluded
- [ ] Dead GHA workflows + support scripts deleted (`claude-code-review.yml`, `claude.yml`, `safe-{read,grep,glob}.sh`); `grep -rli "safe-read\|safe-grep\|safe-glob\|claude-code-action\|claude-review" .github/ .claude/ scripts/` returns no results
- [ ] The 11-category breadth (FTL i18n, cross-package & performance, accessibility detail) from the deleted workflow is verifiably present in the rewritten `.claude/rules/code-review.md`
- [ ] `AGENTS.md` created at repo root, ≤ 200 lines, contains the 6 required sections (what Dialtone is, reviewer landscape table, Codex's single job, what NOT to flag, diff-scope expectation, pointers to conventions)
- [ ] `/codex:adversarial-review` test run on 1 benchmark PR shows Codex referencing Dialtone-specific context (design system, breaking-change rules, or reviewer landscape) and respecting its lane (no overlap with the other reviewers' findings)
- [ ] `/codex:adversarial-review` works with `--uncommitted` and `--base <ref>` for diff-scoping
- [ ] All 3 active reviewers run on 1 benchmark PR with manual cross-check: each finding traces to a distinct lane; no two reviewers flag the same finding
- [ ] `/review` runtime ≤ 90 seconds for a 3–10 file PR (functional, not a quality metric)
- [ ] Benchmark script (`scripts/benchmark-review.mjs`) captures per-finding usefulness rating + lane attribution per reviewer per PR for before/after comparison. Count is captured descriptively but not used as success/fail.
- [ ] PR opened, CI green, reviewer (Ignacio or another teammate) explicitly says the tool's findings are worth posting
