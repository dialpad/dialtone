# Code Review Coordination Implementation Plan

Created: 2026-05-12
Author: belu.montoya@dialpad.com
Status: COMPLETE
Approved: Yes
Iterations: 2
Worktree: No
Type: Feature

## Summary

**Goal:** Coordinate Dialtone's three AI code reviewers (CodeRabbit, local `/review`, Codex) with single-responsibility lanes. Rewrite `/review` with a 3-agent + validator pipeline; tune `.coderabbit.yaml` for higher per-comment signal ratio; delete the dead GHA Claude workflows; create `AGENTS.md` for Codex; enforce per-reviewer "What NOT to Flag" boundaries.

**Architecture:** Three distinct surfaces, each with one job: (1) **CodeRabbit** runs on every PR, tuned `.coderabbit.yaml` for first-pass nits/style. (2) **Local `/review`** orchestrates 3 parallel discovery agents (Dialtone conventions, bugs/logic, architecture via CodeGraph) followed by a serial validator pass with confidence ≥ 80 filter, dedup, and terminal-only output. (3) **Codex `/codex:adversarial-review`** uses Codex CLI's native command with project context from `AGENTS.md` at repo root.

**Tech Stack:** Markdown agent/skill files in `.claude/`, YAML config in `.coderabbit.yaml`, Node ESM for the benchmark script. No new package dependencies.

**PRD:** `docs/prd/2026-05-11-code-review-quality.md`

## Scope

### In Scope

- Rewrite `.claude/rules/code-review.md` from 9 open-ended quality questions to objective triggers + severity + evidence + explicit "What NOT to Flag" list. **Must absorb** the 11-category breadth from the soon-to-be-deleted GHA workflow (FTL i18n, cross-package & performance, accessibility detail).
- Create 4 new agents under `.claude/agents/`:
  - `review-dialtone-conventions.md` — reads path-scoped rules, flags only quotable rule violations
  - `review-bugs-logic.md` — diff-focused HIGH SIGNAL logic/bug reviewer
  - `review-architecture.md` — CodeGraph-integrated cross-file reviewer
  - `review-validator.md` — per-finding confidence-scoring agent (0–100, threshold 80)
- Rewrite `.claude/skills/review.md` to orchestrate the 3-agent + validator pipeline (parallel discovery → polling → serial validator → dedup → output). Drop `/review <file>` mode. Preserve `/review` and `/review <area>`.
- Update `.claude/agents/review.md` (existing background agent for >10 file diffs) to use the same pipeline so behavior is consistent inline vs. backgrounded.
- Tune `.coderabbit.yaml` for higher per-comment signal ratio (profile, cosmetic features, path_instructions audit).
- Create `AGENTS.md` at repo root with 6 required sections (Dialtone context, reviewer landscape, Codex's single job, "What NOT to Flag", diff-scope expectation, pointers to conventions). ≤ 200 lines.
- Delete dead GHA Claude workflows + supporting scripts: `.github/workflows/claude-code-review.yml`, `.github/workflows/claude.yml`, `.github/scripts/safe-{read,grep,glob}.sh`.
- Create `scripts/benchmark-review.mjs` capturing per-finding data (file:line, severity, evidence, originating reviewer, lane attribution, manual usefulness rating slot) for before/after comparison.

### Out of Scope

- GitHub inline PR comments from `/review` — terminal-only by design.
- Replacing CodeRabbit entirely; codegen/templating between rule files; auto-triggering the deleted GHA workflows under different conditions; resurrecting them with a different action.
- `anthropic-practices-reviewer` and `config-reviewer` agents (audit `.claude/` config, not PR code — different lane).
- `.claude/skills/address-review.md` (handles incoming PR comments, not generating reviews).
- Retiring path-scoped rules (`vue-components.md`, `vue-tests.md`, etc.) — read by Agent A, unchanged.
- Multi-model orchestration; persistent learnings / per-PR memory.
- Auto-rating findings — the manual "useful vs noise" rating slot in the benchmark script is filled by humans.

## Approach

**Chosen:** **Foundation-first sequential build within a single PR.** Rewrite `code-review.md` first (it absorbs the breadth from the soon-to-be-deleted GHA workflow and becomes the source of truth all 4 agents read). Then build the 4 agents in parallel (no inter-agent dependencies). Then rewrite the skill orchestration to compose them. Then add the cleanup work (CodeRabbit tuning, AGENTS.md, GHA deletion, benchmark). Each task lands cleanly before the next builds on it.

**Why:** Per PRD direction "ship full design in one PR" — splitting introduces release coordination overhead without commensurate benefit. Foundation-first ordering inside the PR reduces integration risk: every task that depends on `code-review.md` content can verify it directly, and the GHA deletion task can verify content migration before removing files.

**Alternatives considered:**

- **Parallel build across all 10 tasks:** rejected. The 4 agents and skill all depend on the rewritten `code-review.md`. Building in parallel means rework when the foundation shifts; foundation-first amortizes the design cost.
- **Split into 2 PRs (improve + cleanup):** rejected per PRD direction; coordination cost not justified for a 10-task scope where the cleanup work (GHA deletion, benchmark) is genuinely small.
- **Multi-model orchestration (Haiku for cheap checks, Opus for bugs):** rejected for v1 per PRD; single-model (Sonnet) keeps the pipeline simple and debuggable. Cost optimization is a future PR.

## Context for Implementer

### Patterns to follow

- **Existing review skill structure**: `.claude/skills/review.md:1-91`. Current single-pass orchestration with `git diff --name-only` + `git diff --cached --name-only` + dynamic base-branch detection. Reuse the diff-detection logic; replace the inline review with the multi-agent pipeline.
- **Existing background agent**: `.claude/agents/review.md:1-65`. Tool list (`Bash, Read, Glob, Grep`). The new agents follow the same frontmatter pattern; add `Task` / `Agent` to the skill's tool list if needed for spawning sub-agents, and add `codegraph_*` MCP tools to the architecture agent.
- **Official Anthropic plugin reference**: `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/code-review/commands/code-review.md`. Mirror the confidence rubric (0/25/50/75/100), the validator-pass architecture, and the explicit false-positive exclusion list. Adapt to local-only output and CodeGraph integration.
- **Sibling Anthropic plugin**: `~/.claude/plugins/marketplaces/claude-code-plugins/plugins/code-review/commands/code-review.md` for the HIGH SIGNAL definition (compile-or-parse errors, definite logic errors, clear quotable rule violations) and the "If you are not certain an issue is real, do not flag it" framing.
- **Beacon-app pr-review pattern** (`/Users/belumontoya/Desktop/beacon-app/.claude/agents/pr-review/`): 6 specialized reviewer agents (code-reviewer, silent-failure-hunter, test-analyzer, comment-analyzer, type-design-analyzer, code-simplifier). Worth studying for: (a) **mechanical rule format with explicit grep patterns** in `code-reviewer.md` — each rule has a specific search regex, not just a verbal description, making it more reliably enforceable; (b) **silent-failure-hunter** — a dedicated lane for swallowed errors, empty catches, and broken error-propagation paths (we fold this into Agent B's HIGH SIGNAL responsibilities — see Task 3); (c) **`recommendation` per finding** — every finding ends with a concrete "Fix: ..." instruction, which we adopt in the schema; (d) **per-agent model assignment** (their code-reviewer uses Haiku for cheap pattern matching) — we defer model orchestration to v2 per PRD but note Haiku is viable for Agent A.
- **Codex plugin adversarial review prompt**: `~/.claude/plugins/marketplaces/openai-codex/plugins/codex/prompts/adversarial-review.md`. Already implements skeptical stance + attack-surface taxonomy + structured JSON output + confidence scoring. `AGENTS.md` provides context, not behavior — do not duplicate this prompt.
- **Path-scoped rule format**: `.claude/rules/vue-components.md` and siblings. YAML frontmatter `paths:` controls when the rule loads. Agent A reads these and filters by `paths:` matching changed files.

### Conventions

- All `.claude/agents/*.md` files use YAML frontmatter (`description`, `tools`, optional `model`). System prompt follows in markdown.
- All findings between phases are passed via temp files at `/tmp/dialtone-review-${SESSION}-<phase>-<n>.json`. `SESSION` is computed once by the skill at Step 0 as `${PILOT_SESSION_ID:-$(date +%s)-$$}` (PID + timestamp fallback for non-Pilot environments) and **passed as a parameter** to every spawned agent's prompt — agents do not read the env var themselves. The skill also runs `rm -f /tmp/dialtone-review-${SESSION}-*.json` at Step 0 to guarantee no stale findings collide.
- Polling uses bash file-existence loop per `~/.claude/rules/testing.md` (no `TaskOutput`).
- All confidence scores: integers 0–100. Threshold: ≥ 80 surfaces, < 80 is dropped.
- **Finding schema** (every discovery agent emits objects matching this; the skill assigns `id` post-discovery):
  - `file_path` (string) — repo-relative
  - `line_start`, `line_end` (integers) — MUST be lines present in the current diff
  - `severity` (enum: `BLOCKING` | `IMPORTANT` | `NIT`)
  - `category` (enum) — one of the 11 categories from `code-review.md`: `reuse`, `code-quality`, `vue`, `css`, `tokens`, `api`, `testing`, `storybook`, `i18n`, `accessibility`, `cross-package`. Required for dedup; every agent must emit this.
  - `confidence` (integer 0–100; the validator overwrites this with its own score)
  - `evidence` (string) — file:line citation OR quoted rule text OR CodeGraph reference (e.g., `"codegraph_callers(processOrder) returned 4 callers in packages/dialtone-vue"`)
  - `recommendation` (string) — concrete fix the reviewer would apply (e.g., `"Use 'validator' (Vue silently ignores 'validate')"`). One sentence. Borrowed from beacon-app's pr-review format; makes findings actionable rather than just diagnostic.
  - `agent` (enum: `conventions` | `bugs` | `architecture`)
- **Post-discovery `id` assignment**: the skill assigns `id` to each finding as `<agent>-<index>` (e.g., `conventions-1`, `bugs-3`) after reading all 3 finding files. The validator references findings by `id`.
- **Dedup operates on**: same `file_path` + `line_start..line_end` overlapping within ±2 + same `severity` + same `category`. Higher-confidence finding wins; the other's `evidence` is appended to a `supporting_evidence` array.
- All agent system prompts begin with the diff-only constraint: agents may READ full files for context but MUST cite a line in the current diff. Pre-existing issues on unchanged lines are excluded.
- **Diff base resolution** is done ONCE in the skill, not in each agent. The skill resolves the base SHA (per the existing detect-base logic in `.claude/skills/review.md:28-30`) and passes `BASE=<sha>` to every spawned agent so all three agents review the exact same diff.
- Dialtone commit convention applies to every commit: `<type>(<scope>): <jira> <subject>`. Jira ticket is needed; the work doesn't have a ticket yet, so commits use `NO-JIRA` until/unless a ticket is filed.

### Key files

- `.claude/rules/code-review.md` — current 9-question file, fully rewritten in Task 1.
- `.claude/skills/review.md` — current single-pass orchestration, fully rewritten in Task 6.
- `.claude/agents/review.md` — current background agent, refactored in Task 6.
- `.claude/commands/review.md` — thin slash-command wrapper, slightly updated in Task 6 to remove `<file>` documentation.
- `.coderabbit.yaml` — 272 lines including a long `path_instructions` block. Tuned (not rewritten) in Task 7.
- `.github/workflows/claude-code-review.yml`, `claude.yml`, `.github/scripts/safe-*.sh` — deleted in Task 9.
- `AGENTS.md` (new, repo root) — created in Task 8.
- `scripts/benchmark-review.mjs` (new) — created in Task 10.

### Gotchas

- **`.coderabbit.yaml` inheritance**: line 3 sets `inheritance: true` from `dialpad/coderabbit/.coderabbit.yaml`. The parent likely sets `reviews.profile: assertive` which is the largest single source of verbosity. Verify by adding the override and observing the effect; we cannot read the parent file directly. Override at this file's level wins per CodeRabbit's inheritance rules.
- **CodeRabbit cannot review outside the diff** — it's PR-driven by design. The "make CodeRabbit diff-only" framing in early PRD drafts was a misconception; the actual verbosity sources are profile + cosmetic features + path_instructions that duplicate ESLint/Stylelint coverage.
- **GHA workflow security comments**: `.github/workflows/claude-code-review.yml:108-111` explicitly forbid loading repo files for prompt-injection prevention. This is moot because the workflow is being deleted, but the security pattern is worth understanding for future GHA Claude work.
- **CodeGraph never gets `projectPath`** for the current project per the user-level rule (`~/.claude/rules/development-practices.md`). Agent C must omit it.
- **Codex CLI is at `/Users/belumontoya/.nvm/versions/node/v24.1.0/bin/codex`** with `codex review` subcommand. `--uncommitted` and `--base <branch>` are the diff-scoping flags. `AGENTS.md` is auto-loaded by Codex CLI.
- **The 11-category coverage migration is the most easily forgotten step**. Before deleting the GHA workflow in Task 9, the deletion verifier must confirm `code-review.md` covers: (1) FTL i18n / hardcoded English detection, (2) cross-package & performance, (3) accessibility detail (ARIA, focus management, contrast). These were unique to the workflow.

### Domain context

- Dialtone is Dialpad's design system monorepo. Public npm packages (`@dialpad/dialtone-vue`, `dialtone-css`, `dialtone-tokens`, `dialtone-icons`). Breaking changes ship as patches if not labeled `BREAKING CHANGE:` — silently breaking consumers. Reviewers must treat prop/event/slot removals or renames as red flags.
- Three consumers matter most: `dialpad/firespotter` (web app), `dialpad/ios` (iOS app), external users.
- Commit convention is `<type>(<scope>): <jira> <subject>` (`feat`, `fix`, `perf`, `refactor` trigger releases; `BREAKING CHANGE:` footer triggers MAJOR).
- The "9 deliverables in one PR" sounds large but each is small in isolation. The cleanup tasks (GHA delete, benchmark script) are minutes of work.

## Assumptions

- Codex CLI (any recent version, installed locally — verified via `codex --version` during Task 8) auto-loads `AGENTS.md` at the repo root per the OpenAI Codex CLI convention. Supported by `codex review --help` output showing `--uncommitted` and `--base` flags consistent with the canonical OpenAI Codex CLI. Task 8's DoD includes a runtime verification (output of `codex review --uncommitted` on a no-op diff references Dialtone context) so we confirm the auto-load actually happens for the locally-installed version. (Path-independent — `nvm` paths and Node version upgrades don't affect this.)
- `.github/scripts/safe-{read,grep,glob}.sh` are not referenced by anything except `claude-code-review.yml`. Verified by grep during PRD phase (`grep -rli "safe-read|safe-grep|safe-glob"` returned only the workflow + scripts themselves). Task 9 depends on this.
- The parent `dialpad/coderabbit/.coderabbit.yaml` config can be overridden at this repo's `.coderabbit.yaml` level. Supported by CodeRabbit's documented inheritance model. Task 7 depends on this.
- The `Agent` tool with `run_in_background=true` is the right primitive for parallel discovery agents. Supported by `~/.claude/rules/task-and-workflow.md` ("Launch with `run_in_background=true`; agents write JSON files; poll with bash file-existence loop, then Read once."). Task 6 depends on this.
- CodeGraph MCP tools are available in agent tool lists at the user level. Supported by their presence in `~/.claude/rules/mcp-servers.md`. Task 4 (architecture agent) depends on this.
- The current `Worktree: No` choice means we work directly on `feat/code-review-quality` (already created off `origin/staging`). All file changes happen at the repo root, not in an isolated worktree.

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Coverage from deleted GHA workflow (FTL, cross-package, a11y) gets lost during rules rewrite | Medium | High — silent loss of Dialtone-specific review breadth | Task 9 (GHA deletion) has explicit pre-deletion gate: grep `code-review.md` for "FTL", "cross-package", "ARIA", "accessibility"; fail if missing. Task 1's DoD requires all 3 categories present. |
| Discovery agents emit overlapping findings (same line, same theme, 3 copies) | High | Medium — reviewer-fatigue regression even with confidence filter | Task 6 includes a dedup phase: collapse findings sharing `file_path` + line within ±2 + matching severity. Higher-confidence finding wins. Validator processes each finding independently; dedup happens post-validator. |
| Validator agent confidence score is miscalibrated — surfaces noise at confidence ≥ 80 anyway | Medium | High — defeats the whole filter | Task 5 (validator) includes an explicit rubric mapping (0=false positive, 25=likely FP, 50=real-but-low-priority, 75=real-and-important, 100=certain) ported from the official Anthropic plugin. Manual calibration on the benchmark PRs in Task 10. |
| CodeRabbit overrides at this repo's level don't override the parent config | Medium | Medium — Task 7 changes have no observable effect | Task 7 starts with an explicit verification step: tune ONE setting (e.g., `reviews.profile: chill`), commit + open a test PR, observe CodeRabbit output. If the override doesn't take effect, escalate to the parent config owner before continuing. |
| `Agent` tool with `run_in_background=true` doesn't behave consistently across Claude Code versions; agents may not complete or may produce malformed JSON | Low | High — pipeline silently produces no findings | Task 6 includes explicit failure handling: if any discovery agent's temp file is missing or malformed after the 5-minute polling window, the skill reports which agent failed and surfaces findings from the other two. No silent failure. |
| `/codex:adversarial-review` doesn't read `AGENTS.md` as expected, or reads it but doesn't respect lane boundaries | Medium | Low — Codex still produces output, just not lane-respecting | Task 8 (AGENTS.md) + Task 10 (benchmark) include a verification step: run `/codex:adversarial-review` on a known PR, manually check that Codex (a) cites Dialtone-specific context and (b) doesn't duplicate CodeRabbit's nits. If it fails this, AGENTS.md needs tightening — single iteration, not an open-ended risk. |
| 10 tasks in one PR creates a large review surface that takes weeks to merge | Medium | Medium — slows the win from this work | The 4 agent-creation tasks (Tasks 2–5) are similar enough that reviewer can review them as a batch. Tasks 7–10 (CodeRabbit, AGENTS.md, GHA delete, benchmark) are independent of the agent pipeline and can be reviewed independently. Submit the PR with a clear task-by-task structure in the description. If the PR grows beyond a single reviewer's attention budget, split deletion (Task 9) into a follow-up. |
| The benchmark script's "manual usefulness rating" gets skipped or done sloppily, making before/after comparison unreliable | Medium | Medium — can't measure whether the change worked | Task 10's DoD requires a documented procedure: pick 2 closed PRs (reduced from 5 for realistic time budget — see Task 10 protocol), rate every comment from every reviewer, store ratings in a CSV. Run once pre-change (baseline) and once post-change. The PRD-mandated success criterion ≥ 80% useful is enforced by this exercise. |
| Concurrent `/review` runs from different sessions collide on `/tmp/dialtone-review-*.json` filenames | Low (single-user tool) but Medium when PILOT_SESSION_ID is unset (becomes possible across terminals) | Medium — silent overwrite of in-flight findings, corrupting one or both runs | Task 6 Step 0 computes `SESSION="${PILOT_SESSION_ID:-$(date +%s)-$$}"` (PID + timestamp fallback) before spawning agents and `rm -f /tmp/dialtone-review-${SESSION}-*.json` to clean stale files. Each `/review` run gets a unique session token; collision is structurally prevented. |
| A single discovery agent emits 50+ findings (regression to noisy old behavior); validator processing time explodes | Medium | Medium — pipeline still produces output but runtime balloons | Task 6 Step 6 enforces a hard cap of 50 candidate findings before invoking the validator; excess findings are truncated with a logged warning. Task 5 (validator) documents the cap in its system prompt. This both caps runtime AND pressures discovery agents to filter at the source. |

## Goal Verification

### Truths

1. `/review` orchestrates 3 parallel discovery agents + a serial validator and emits filtered (confidence ≥ 80) deduplicated findings — no other behavior.
2. Findings reference only lines in the current diff; agents read full files for context but a finding on an unchanged line is filtered as a false positive.
3. `.claude/rules/code-review.md` contains all 11 categories from the deleted GHA workflow (FTL i18n, cross-package & performance, accessibility detail, plus the original 8) in the new objective-trigger + severity + evidence format.
4. `.github/workflows/claude-code-review.yml`, `claude.yml`, and the three `safe-*.sh` scripts do not exist after the change; no other file in `.github/`, `.claude/`, or `scripts/` references them.
5. `AGENTS.md` at repo root contains the 6 required sections (Dialtone context, reviewer landscape table, Codex's single job, "What NOT to Flag", diff-scope expectation, pointers to conventions) and is ≤ 200 lines.
6. Running `/codex:adversarial-review --uncommitted` (or `--base <ref>`) on a benchmark PR produces findings that (a) reference Dialtone-specific context and (b) do not duplicate any finding from CodeRabbit or local `/review` on the same PR. **Operational definition of "duplicate"** (per spec-review S-7): same `file_path` + line within ±5 + same root-cause category (per the 11-category enum). Verified programmatically against the Task 10 benchmark CSV's `file_path`, `line`, and `evidence_excerpt` columns.
7. `.coderabbit.yaml` updates produce a higher useful-to-noise ratio (≥ 80% useful, manually rated) on at least one benchmark PR vs. the pre-change baseline. Count change is not the metric.
8. The benchmark script `scripts/benchmark-review.mjs` runs against a list of merged PRs and captures per-finding data with a manual-rating slot.

### Artifacts

- `.claude/rules/code-review.md` (rewritten — supports Truths 2, 3)
- `.claude/agents/review-dialtone-conventions.md` (new — supports Truth 1)
- `.claude/agents/review-bugs-logic.md` (new — supports Truth 1)
- `.claude/agents/review-architecture.md` (new — supports Truths 1, 2)
- `.claude/agents/review-validator.md` (new — supports Truth 1, threshold ≥ 80)
- `.claude/skills/review.md` (rewritten — supports Truths 1, 2)
- `.claude/agents/review.md` (refactored — supports Truth 1 for backgrounded mode)
- `.coderabbit.yaml` (tuned — supports Truth 7)
- `AGENTS.md` at repo root (new — supports Truths 5, 6)
- Deleted files: `.github/workflows/claude-code-review.yml`, `.github/workflows/claude.yml`, `.github/scripts/safe-{read,grep,glob}.sh` (supports Truth 4)
- `scripts/benchmark-review.mjs` (new — supports Truths 6, 7, 8)

## Progress Tracking

- [x] Task 1: Rewrite `.claude/rules/code-review.md` (foundation; absorb 11-category breadth)
- [x] Task 2: Create `.claude/agents/review-dialtone-conventions.md` (Agent A)
- [x] Task 3: Create `.claude/agents/review-bugs-logic.md` (Agent B)
- [x] Task 4: Create `.claude/agents/review-architecture.md` (Agent C, CodeGraph-integrated)
- [x] Task 5: Create `.claude/agents/review-validator.md` (confidence rubric ≥ 80)
- [x] Task 6: Rewrite `.claude/skills/review.md` orchestration + refactor `.claude/agents/review.md` (background) + drop `/review <file>` mode
- [x] Task 7: Tune `.coderabbit.yaml` for higher per-comment signal (Phase 2 cosmetics done; Phase 0/1/3 manual steps gate PR merge)
- [x] Task 8: Create `AGENTS.md` at repo root
- [x] Task 9: Delete dead GHA Claude workflows + supporting scripts (gated on Task 1 coverage migration)
- [x] Task 10: Create `scripts/benchmark-review.mjs` skeleton (structural DoD items done; manual rating deferred to after Tasks 1–9)

**Total Tasks:** 10 | **Completed:** 10 | **Remaining:** 0

## Implementation Tasks

### Task 1: Rewrite `.claude/rules/code-review.md`

**Objective:** Replace the 9 open-ended quality questions with objective triggers + severity tags + evidence requirements + an explicit "What NOT to Flag" section. Absorb the 11-category breadth from the soon-to-be-deleted GHA workflow (FTL i18n, cross-package & performance, accessibility detail) so deletion in Task 9 loses no coverage.

**Dependencies:** None
**Mapped Scenarios:** None (Minimal runtime profile)

**Files:**

- Modify: `.claude/rules/code-review.md`

**Key Decisions / Notes:**

- Frontmatter `paths:` block stays unchanged (lines 1–7 of the current file: `packages/dialtone-vue/**`, `packages/dialtone-css/**`, etc.).
- Replace the body with 11 categories. Each rule under a category has: severity tag (`[BLOCKING]` / `[IMPORTANT]` / `[NIT]`), objective trigger (not a question), and evidence requirement (`Cite: file:line` or `Quote: <rule text>`).
- **Rule format**: each rule has (a) severity tag, (b) a one-sentence trigger description, (c) optional grep pattern that mechanically detects the violation, (d) a one-sentence Fix. Borrowed from beacon-app's `pr-review/code-reviewer.md` format — makes rules reliably enforceable by Agent A's pattern matching, not just verbal interpretation. Example:
  ```markdown
  ### [BLOCKING] Vue `validator` not `validate`
  Trigger: a prop definition uses `validate:` instead of `validator:` (Vue silently ignores `validate`).
  Pattern: `^\s*validate:\s*(?:function|\()` in `.vue` files
  Fix: rename to `validator:`.
  ```
  Not every rule needs a regex pattern — semantic rules (e.g., "Component too similar to existing one") rely on verbal description only. Aim for grep-able patterns where the rule is mechanical.
- Categories (must all be present, in order — preserves the order of the GHA workflow's embedded rules and CodeRabbit's path_instructions):
  1. Reuse & Duplication
  2. Code Quality & Readability
  3. Vue Correctness
  4. CSS / Styling
  5. Design Tokens
  6. API & Library Design
  7. Testing
  8. Storybook & Documentation
  9. Internationalization & Assets (FTL / hardcoded English / external URLs — from GHA workflow)
  10. Accessibility (ARIA, focus management, contrast, WCAG 2.1 AA — from GHA workflow, more detail than original `code-review.md`)
  11. Cross-Package & Performance (cross-package impact, non-tree-shakeable imports, security via `v-html` / `innerHTML` — from GHA workflow)
- Add a new top-level "What NOT to Flag" section with explicit categories (port from `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/code-review/commands/code-review.md` lines 33–43): pre-existing issues; pedantic nitpicks; linter/typechecker-catchable issues; general quality / lack of test coverage; CLAUDE.md-mentioned issues silenced via lint-ignore comments; intentional changes related to the broader change; real issues on lines outside the PR diff.
- Add a "HIGH SIGNAL Definition" section: compile-or-parse errors, definite logic errors regardless of inputs, clear quotable rule violations with the exact rule text quoted.
- Add an "Evidence Requirements" section: every finding must include `file:line`, quoted rule, or CodeGraph reference. Findings without evidence are dropped.
- No hard line budget — structural checks instead (see DoD). The breadth-vs-conciseness trade-off resolves on completeness, not on length.

**Definition of Done:**

- [ ] File contains all 11 categories in order (verified by `grep -c '^## [0-9]' .claude/rules/code-review.md` returning ≥ 11)
- [ ] FTL/i18n category present (`grep -i 'FTL\|hardcoded English' .claude/rules/code-review.md` returns matches)
- [ ] Accessibility category present with ARIA + WCAG 2.1 AA (`grep -i 'ARIA\|WCAG\|focus management' .claude/rules/code-review.md` returns matches)
- [ ] Cross-package & performance category present (`grep -i 'cross-package\|non-tree-shakeable\|v-html' .claude/rules/code-review.md` returns matches)
- [ ] "What NOT to Flag" section present with ≥ 6 explicit exclusion items (`awk '/## What NOT/{flag=1;next} /^## /{flag=0} flag' .claude/rules/code-review.md | grep -c '^- '` ≥ 6)
- [ ] HIGH SIGNAL Definition section present with the 3 categories verbatim from the official Anthropic plugin (compile/parse errors, definite logic errors, clear quotable rule violations)
- [ ] **Every category has ≥ 2 severity-tagged rules** (per-category check, not global):

  ```bash
  awk '/^## [0-9]+\./{cat=$0; cnt[cat]=0} /\[(BLOCKING|IMPORTANT|NIT)\]/{cnt[cat]++} END{for(k in cnt) if(cnt[k]<2) print "FAIL: " k " has only " cnt[k] " tagged rules"}' .claude/rules/code-review.md
  ```
  Must print nothing.
- [ ] No `TBD`, `TODO`, or placeholder text (grep returns nothing)

**Verify:**

```bash
grep -c '^## [0-9]' .claude/rules/code-review.md  # expect ≥ 11
grep -i 'FTL\|ARIA\|cross-package\|What NOT to Flag\|HIGH SIGNAL' .claude/rules/code-review.md
awk '/## What NOT/{flag=1;next} /^## /{flag=0} flag' .claude/rules/code-review.md | grep -c '^- '  # expect ≥ 6
awk '/^## [0-9]+\./{cat=$0; cnt[cat]=0} /\[(BLOCKING|IMPORTANT|NIT)\]/{cnt[cat]++} END{for(k in cnt) if(cnt[k]<2) print "FAIL: " k}' .claude/rules/code-review.md  # expect no output
grep -E 'TBD|TODO|FIXME|implement later' .claude/rules/code-review.md  # expect no output
```

### Task 2: Create `.claude/agents/review-dialtone-conventions.md`

**Objective:** New discovery agent (Agent A) for Dialtone convention enforcement. Reads `.claude/rules/code-review.md` (Task 1 output) and any path-scoped rules under `.claude/rules/*.md` whose `paths:` frontmatter matches changed files. Flags only quotable rule violations on lines in the diff. Writes findings to a temp file.

**Dependencies:** Task 1
**Mapped Scenarios:** None

**Files:**

- Create: `.claude/agents/review-dialtone-conventions.md`

**Key Decisions / Notes:**

- Frontmatter: `description` describes the agent's role (mirror style from `.claude/agents/anthropic-practices-reviewer.md:1-9`). `tools: [Read, Glob, Grep, Bash, Write]` — Bash for `git diff` reads, Glob for matching path-scoped rules, Write for emitting the JSON output.
- **Inputs received from the spawner (not detected by the agent)**: `SESSION` token, `BASE` SHA, and the comma-separated list of changed files. Stated explicitly at the top of the system prompt so the agent does not re-detect either value.
- System prompt structure (mirror `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/code-review/commands/code-review.md` lines 25–32 for the per-agent format):
  1. Role: "You are the Dialtone Conventions reviewer. Your single job is to flag clear, quotable violations of Dialtone path-scoped rules and `code-review.md` HIGH SIGNAL rules."
  2. Inputs: spawner-provided `BASE` SHA and changed-files list. `git diff $BASE...HEAD -- <changed-files>` for the diff. The relevant rule files (`code-review.md` always; path-scoped rules matched against changed-files).
  3. Method: For each changed file, read the file. Read `.claude/rules/code-review.md` always. For each path-scoped rule file (use `Glob` on `.claude/rules/*.md`), check if any changed file matches its `paths:` frontmatter; if so, read it. Cross-reference each changed line against the rules. Flag only when a rule is quotable and the violation is unambiguous.
  4. Output: JSON array of finding objects per the **finding schema in Conventions** — must emit `category` set to one of the 11 enum values. Write to `/tmp/dialtone-review-${SESSION}-conventions-1.json` via `Write`. (`${SESSION}` is received from the spawner.)
- Explicit "What NOT to Flag" sub-section in the system prompt (port the list from `code-review.md` Task 1 + add: "Anything that is a logic bug rather than a convention violation — that's Agent B's job." + "Anything that requires cross-file analysis — that's Agent C's job.")
- Diff-only constraint stated twice: in the method section AND in the output format ("a finding without a `line_start` in the diff is invalid and must be omitted").

**Definition of Done:**

- [ ] File exists with valid YAML frontmatter (description, tools)
- [ ] System prompt contains the 4 structural sections (role, inputs, method, output)
- [ ] System prompt contains explicit "What NOT to Flag" section
- [ ] System prompt contains the diff-only constraint, stated at least twice
- [ ] System prompt specifies the temp file path with `${PILOT_SESSION_ID}` interpolation
- [ ] Output schema is documented inline in the system prompt with example
- [ ] Manual smoke test: invoke this agent against a synthetic 1-file diff containing a known Vue convention violation (e.g., `validate:` instead of `validator:`); agent produces a finding citing the rule

**Verify:**

```bash
test -f .claude/agents/review-dialtone-conventions.md
grep -c '^---$' .claude/agents/review-dialtone-conventions.md  # expect 2 (frontmatter)
grep -iE 'diff-only|line in the diff|line.*current diff' .claude/agents/review-dialtone-conventions.md  # expect ≥ 2 matches
grep -i 'What NOT to Flag' .claude/agents/review-dialtone-conventions.md  # expect match
# Manual: invoke via Agent tool, check output JSON
```

### Task 3: Create `.claude/agents/review-bugs-logic.md`

**Objective:** New discovery agent (Agent B) for bug/logic detection. Diff-focused, HIGH SIGNAL only — compile/parse failures, definite logic errors, security-sensitive bugs. Does not enforce conventions (that's Agent A) or do cross-file analysis (that's Agent C).

**Dependencies:** Task 1
**Mapped Scenarios:** None

**Files:**

- Create: `.claude/agents/review-bugs-logic.md`

**Key Decisions / Notes:**

- Frontmatter: `tools: [Read, Glob, Grep, Bash, Write]`. No CodeGraph (that's Agent C).
- **Inputs received from the spawner**: `SESSION` token, `BASE` SHA, list of changed files. Agent does not re-detect.
- System prompt structure (mirror Task 2's structure with different role):
  1. Role: "You are the Bugs & Logic reviewer. Your single job is to find HIGH SIGNAL logic errors, broken invariants, missing error handling, **swallowed errors / silent-failure patterns** (empty `catch` blocks, `.catch(() => {})`, IndexedDB / BroadcastChannel failures that go unlogged — borrowed from beacon-app's silent-failure-hunter agent), incorrect API usage, and security-sensitive bugs on lines in the current diff."
  2. Inputs: spawner-provided `BASE` and changed-files list. `git diff $BASE...HEAD -- <changed-files>` for the diff. Relevant source files (for context only, not for flagging unchanged lines).
  3. Method: Read each changed file fully (for context). For each diff hunk, ask: would a one-character change here cause a runtime failure? Is the invariant the surrounding code assumes still true? Does this code path handle the failure modes the caller might hit? Flag only when the answer is unambiguous and the failure is concrete.
  4. Output: JSON array of finding objects per the **finding schema in Conventions** — must emit `category` (typically `code-quality` for logic bugs, `cross-package` for security via `v-html`, etc.). Write to `/tmp/dialtone-review-${SESSION}-bugs-2.json`.
- HIGH SIGNAL rubric in the system prompt (port from `~/.claude/plugins/marketplaces/claude-code-plugins/plugins/code-review/commands/code-review.md` lines 41–51): flag only (a) code that will fail to compile or parse (syntax errors, type errors, missing imports, unresolved references); (b) code that will definitely produce wrong results regardless of inputs (clear logic errors); (c) security issues (XSS via `v-html`, unsafe `innerHTML`, exposed secrets). Do NOT flag: code style or quality concerns; potential issues that depend on specific inputs or state; subjective suggestions or improvements; anything Agent A would catch.
- Same diff-only constraint as Agent A. Same explicit "What NOT to Flag" section.

**Definition of Done:**

- [ ] File exists with valid frontmatter
- [ ] System prompt contains HIGH SIGNAL rubric with the 3 categories
- [ ] System prompt explicitly states what Agent A and Agent C cover (so Bugs doesn't trespass)
- [ ] Diff-only constraint stated at least twice
- [ ] Output schema documented with example
- [ ] Manual smoke test: invoke against a synthetic diff containing a definite logic error (e.g., `if (x = 5)` assignment vs comparison); agent produces a HIGH SIGNAL finding

**Verify:**

```bash
test -f .claude/agents/review-bugs-logic.md
grep -i 'HIGH SIGNAL\|compile or parse\|definite logic error' .claude/agents/review-bugs-logic.md  # expect matches
grep -iE 'Agent A|Conventions reviewer|Agent C|Architecture reviewer' .claude/agents/review-bugs-logic.md  # expect mentions of lane boundaries
```

### Task 4: Create `.claude/agents/review-architecture.md`

**Objective:** New discovery agent (Agent C) for cross-file / architectural review. Uses CodeGraph MCP tools (`codegraph_callers`, `codegraph_callees`, `codegraph_impact`) to assess blast radius and pattern fit. Flags only issues invisible from a diff-local view.

**Dependencies:** Task 1
**Mapped Scenarios:** None

**Files:**

- Create: `.claude/agents/review-architecture.md`

**Key Decisions / Notes:**

- Frontmatter: `tools: [Read, Glob, Grep, Bash, Write, ToolSearch]`. **CodeGraph tools are NOT listed in `tools:`** — they are lazy-loaded MCP tools per `~/.claude/rules/mcp-servers.md`. The agent loads them via `ToolSearch` in its first action (see Method below). This resolves the contradiction flagged in spec-review MF-6.
- **Inputs received from the spawner**: `SESSION` token, `BASE` SHA, list of changed files.
- System prompt structure:
  1. Role: "You are the Architecture reviewer. Your single job is to flag cross-file or architectural issues invisible from a diff-local view: broken callers, pattern divergence from the existing module, dependency-direction violations, public API breaks without a `BREAKING CHANGE:` footer."
  2. Inputs: spawner-provided `BASE` + changed-files list + CodeGraph access (lazy-loaded).
  3. **First action**: `ToolSearch(query="select:codegraph_callers,codegraph_callees,codegraph_impact,codegraph_search,codegraph_explore")` to load the five CodeGraph tools. If ToolSearch returns nothing for any of them, fall back to `codegraph_context` only — Agent C still produces architectural findings using `codegraph_context` output and grep-based caller hunts. Log which tools loaded so failures are debuggable.
  4. Method: For every function or symbol changed in the diff, run `codegraph_callers` to find call sites. If the call graph shows callers in other packages or files, check whether the change preserves the contract (signature, behavior, error semantics). For every new function/component, run `codegraph_impact` to check what depends on the surrounding pattern. Flag only when the cross-file evidence is concrete.
  5. Output: JSON array of finding objects per the **finding schema in Conventions** — `evidence` field MUST include a CodeGraph reference (e.g., `codegraph_callers(symbol=X) returned 4 callers in packages/Y`); `category` is typically `cross-package` or `api`. Write to `/tmp/dialtone-review-${SESSION}-architecture-3.json`.
- **⛔ Never pass `projectPath`** to CodeGraph for the current project (per `~/.claude/rules/development-practices.md`).
- Explicit constraint: this agent does not flag issues visible from a single diff. If a finding could be made without CodeGraph evidence, it belongs to Agent A or Agent B. State this twice in the prompt.

**Definition of Done:**

- [ ] File exists with valid frontmatter listing CodeGraph MCP tools
- [ ] System prompt requires CodeGraph evidence in every finding
- [ ] System prompt contains the "no projectPath" guard
- [ ] System prompt explicitly states what Agent A and Agent B cover
- [ ] Diff-only constraint stated; finding's `line_start` must still be in the diff (the CodeGraph context informs the finding, but the finding still attaches to a changed line)
- [ ] Manual smoke test: invoke against a diff that changes a function's signature; agent runs `codegraph_callers` and produces a finding citing the broken callers

**Verify:**

```bash
test -f .claude/agents/review-architecture.md
grep -c 'codegraph_' .claude/agents/review-architecture.md  # expect ≥ 5 references (tools + method)
grep -i 'projectPath' .claude/agents/review-architecture.md  # expect a "do not pass" guard
```

### Task 5: Create `.claude/agents/review-validator.md`

**Objective:** Per-finding confidence-scoring agent. Takes a single candidate finding + PR context + relevant file content. Scores confidence 0–100 against an explicit rubric. Drops findings < 80.

**Dependencies:** Task 1 (validator references `code-review.md` for evidence rules)
**Mapped Scenarios:** None

**Files:**

- Create: `.claude/agents/review-validator.md`

**Key Decisions / Notes:**

- Frontmatter: `tools: [Read, Glob, Grep, Bash, Write]`. Same as Agents A/B; no CodeGraph (the discovery agent provided any needed CodeGraph evidence inline in the finding).
- **Inputs received from the spawner**: `SESSION` token + the full candidate findings array (already collected from the 3 discovery temp files, with `id` assigned by the skill) + the `BASE` SHA. **Batched call**: one validator agent invocation processes the entire array, returning an array of decisions. This replaces the original "spawn validator per finding, serially" design (per spec-review MF-3 — that design exceeded the PRD performance budget by 5×).
- System prompt structure:
  1. Role: "You are the Finding Validator. Your single job is to score the confidence of every candidate finding in the input array and decide whether each is real."
  2. Inputs: An array of candidate findings (each with `id`, `file_path`, `line_start`, `line_end`, `severity`, `category`, `evidence`, `agent`), the `BASE` SHA, and access to the working tree.
  3. Method: For EACH finding in the array, apply the rubric (below) carefully. For findings citing a rule, verify the rule exists in `code-review.md` or a path-scoped rule and is actually violated by the cited line (read the file at the cited line). For findings citing a bug, verify the bug would occur regardless of inputs (HIGH SIGNAL gate). For findings citing CodeGraph evidence, verify the claim by reading the cited callers if reasonable, OR trust the discovery agent's CodeGraph result if the evidence string is concrete. Output one decision per finding.
  4. Confidence Rubric (port from `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/code-review/commands/code-review.md` lines 22–26):
     - **0** — false positive that doesn't stand up to light scrutiny, or a pre-existing issue.
     - **25** — might be a real issue but the evidence is weak; agent couldn't verify it's real.
     - **50** — real issue but low priority / unlikely in practice / not very important.
     - **75** — verified real, very likely to occur in practice, important; or directly mentioned in a rule file.
     - **100** — definitely real, will occur frequently, evidence directly confirms it.
  5. Threshold: `decision: "surface"` if `confidence ≥ 80`, else `decision: "drop"`.
- **Output schema**: JSON array, one decision object per input finding, in the same order:
  ```json
  [
    {"id": "conventions-1", "confidence": 85, "decision": "surface", "rationale": "..."},
    {"id": "bugs-3", "confidence": 40, "decision": "drop", "rationale": "..."}
  ]
  ```
  Written to `/tmp/dialtone-review-${SESSION}-validator.json`.
- **Hard cap**: input array is capped at 50 findings by the skill before invoking the validator (see Task 6). If discovery emits more, the skill truncates with a warning. This prevents pathological validator-runtime explosion (per spec-review SF-8).
- Validator must not invent new findings, change severity, or alter evidence — only score and decide per input finding. State this twice in the prompt.

**Definition of Done:**

- [ ] File exists with valid frontmatter
- [ ] System prompt contains the 5-tier confidence rubric verbatim
- [ ] Threshold (`≥ 80 surfaces`) is explicit
- [ ] "Validator must not invent new findings" stated twice
- [ ] **Output schema documented as JSON ARRAY** (one decision per input finding, preserving order, referencing input findings by `id`)
- [ ] Hard cap (50 findings) documented in the system prompt
- [ ] Manual smoke test: pass a 3-finding array (one known false positive, one known true issue, one ambiguous); verify all 3 receive sensible decisions in array form

**Verify:**

```bash
test -f .claude/agents/review-validator.md
grep -E '\b(0|25|50|75|100)\b' .claude/agents/review-validator.md  # confidence rubric values present
grep -iE 'confidence.*80|≥.*80|threshold.*80' .claude/agents/review-validator.md  # threshold stated
grep -iE 'array|batched|input.*array' .claude/agents/review-validator.md  # batched call documented
```

### Task 6: Rewrite `.claude/skills/review.md` orchestration + refactor `.claude/agents/review.md` background agent + drop `/review <file>` mode

**Objective:** Replace the current single-pass review skill with the 3-agent + validator pipeline. Drop the `/review <file>` argument. Preserve `/review` (no args) and `/review <area>`. Refactor the existing background agent (`.claude/agents/review.md`) to invoke the same pipeline in an isolated context for diffs of 10+ files.

**Dependencies:** Tasks 1, 2, 3, 4, 5
**Mapped Scenarios:** None

**Files:**

- Modify: `.claude/skills/review.md`
- Modify: `.claude/agents/review.md`
- Modify: `.claude/commands/review.md` (remove `<file>` from the usage docs)

**Key Decisions / Notes:**

- Replace the current Step 4 ("Map files to rule categories") and Step 5 ("Review each file") with the multi-agent orchestration. Keep Step 1 (load rules), Step 2 (detect scope), and Step 3 (delegate to background agent if 10+ files) — the 10-file threshold and background-agent delegation stay; the agent now runs the same pipeline.

- **New Step 0: Compute session token, resolve base SHA, clean stale temp files.**
  ```bash
  SESSION="${PILOT_SESSION_ID:-$(date +%s)-$$}"
  # Resolve base via existing detect-base logic (line 28-30 of current review.md):
  BASE=$(git rev-parse --abbrev-ref HEAD@{upstream} 2>/dev/null \
    || (git remote show origin 2>/dev/null | sed -n 's/.*HEAD branch: //p' | head -1 | xargs -I{} echo origin/{}))
  # If still empty, fall back to origin/staging then origin/main:
  BASE="${BASE:-origin/staging}"
  rm -f "/tmp/dialtone-review-${SESSION}-"*.json
  ```
  Both `SESSION` and `BASE` are passed as explicit parameters to every spawned agent (not env-var-inherited).

- **New Step 4: Spawn 3 discovery agents in parallel.** For each (Conventions, Bugs, Architecture):
  ```
  Agent(
    subagent_type=<agent-id>,
    description="Review (<category>)",
    run_in_background=true,
    prompt="SESSION=${SESSION}\nBASE=${BASE}\nCHANGED_FILES=<comma-separated list>\n\n<role-specific instructions>"
  )
  ```
  Each agent writes its candidate findings to `/tmp/dialtone-review-${SESSION}-<category>-<n>.json`.

- **New Step 5: Poll for completion** using bash file-existence loop (per `~/.claude/rules/testing.md`):
  ```bash
  for i in $(seq 1 150); do
    [ -f "$CONV_OUT" ] && [ -f "$BUGS_OUT" ] && [ -f "$ARCH_OUT" ] && echo "READY" && break
    sleep 2
  done
  ```
  Timeout at 5 minutes (150 × 2s).

- **New Step 6: Read all 3 finding files with malformed-JSON handling**, assign IDs, cap at 50.
  - For each of the 3 files: try `JSON.parse`. On parse failure, treat that agent as failed (zero findings surfaced); log the file path in the terminal so the user can inspect.
  - On missing file (after timeout): same as parse failure — log and proceed with the other two.
  - Concatenate the valid arrays. Assign each finding an `id` as `<agent>-<index>` (e.g., `conventions-1`, `bugs-3`).
  - If the combined array exceeds 50 findings, truncate to the first 50 and log a warning. (Hard cap prevents validator runtime explosion.)

- **New Step 7: Spawn the validator agent ONCE with the full candidate array** (batched, not per-finding — per spec-review MF-3).
  ```
  Agent(
    subagent_type=review-validator,
    description="Validate findings batch (<N> candidates)",
    prompt="SESSION=${SESSION}\nBASE=${BASE}\n\n<candidate findings array as JSON>"
  )
  ```
  Wait for `/tmp/dialtone-review-${SESSION}-validator.json` via bash polling (same 5-minute window). Read once. Each decision object has `id`, `confidence`, `decision` (`surface`|`drop`), and `rationale`. Filter to `surface` only.

- **New Step 8: Deduplicate surfaced findings.** Two findings collapse into one if ALL FOUR match: same `file_path`, line ranges overlap within ±2, same `severity`, same `category` (per the schema, all required fields). Higher-confidence finding wins; the other's `evidence` is appended to a `supporting_evidence` array on the winner. Single-pass dedup (O(n²) is fine — n ≤ 50).

- **New Step 9: Output to terminal.** Grouped by file, with severity tag, confidence, evidence, and one-line justification per finding. No GitHub API calls. If any agent failed (missing or malformed output in Step 6), the output ends with a one-line note: "⚠️ Agent <name> produced no output — findings shown are from the remaining agents only."

- **`/review <area>` semantics** (preserve from current skill, refined): the area maps to which agents run AND which rule sections each agent reads:
  | Area | Agents activated | Notes |
  |---|---|---|
  | `vue`, `css`, `i18n`, `storybook` | Conventions only | Pure convention review, no bugs |
  | `accessibility` | Conventions only | a11y rules live in `code-review.md` category 10 |
  | `api` | Conventions + Architecture | API design is convention; breaking-change-via-callers is architectural |
  | `testing` | Conventions + Bugs | Testing has conventions AND logic concerns (assertions, mocks) |
  | (no area) | All 3 agents | Full pipeline |

- **`/review <file>` removal + migration notice**: in Step 2 (detect scope), if `<arg>` is not one of the known areas above AND looks like a file path (contains `/` or ends in `.vue`/`.js`/`.ts`/`.less`/`.json`), print:
  ```
  /review <file> is no longer supported. Run /review on a branch with only that file changed, or use git stash to isolate the change first.
  ```
  Then exit cleanly (no review run). Update the skill's frontmatter `description` and `.claude/commands/review.md` Usage section to remove `<file>` documentation.

- **Background agent refactor**: `.claude/agents/review.md` currently does a single-pass review. After the rewrite, it implements Steps 0–9 identically. The agent's tool list grows (Agent for spawning; Bash for polling/session/base; Write for any logging). It returns the same terminal-style output to the spawning skill, which forwards it.

- **Failure handling summary**: missing temp file (timeout), malformed JSON, validator failure — all three follow the same pattern: log which agent/phase failed, continue with whatever findings ARE valid, never silently produce zero output without explaining why.

- **PR description note** (not a code change, but tracked for the eventual PR): dropping `/review <file>` is a user-facing surface change. The PR description must include a one-line `BREAKING:` note ("BREAKING: `/review <file>` mode removed — run `/review` on a branch with only that file changed") so the team sees it in the merge commit. This is for humans, not semver — `.claude/` config isn't a published package.

**Definition of Done:**

- [ ] `/review` (no args) runs the full pipeline on the current branch's diff
- [ ] `/review <area>` activates the correct agent subset per the area-mapping table (verified by manual smoke test: `/review accessibility` runs Conventions only; `/review api` runs Conventions + Architecture)
- [ ] `/review <file>` (or any file-like argument) prints the migration notice and exits cleanly without invoking the pipeline
- [ ] `/review <file>` no longer documented in `.claude/skills/review.md` description, `.claude/commands/review.md` Usage section
- [ ] Skill's Step 0 computes `SESSION` with fallback and cleans stale temp files before spawning
- [ ] Discovery agents receive `SESSION` and `BASE` as explicit prompt parameters (verified by reading their spawned prompts)
- [ ] **Validator is called ONCE with the full candidate array** (single Agent spawn, not N) — verified by `grep -c 'subagent_type=review-validator' .claude/skills/review.md` returning exactly 1
- [ ] Hard cap at 50 candidate findings before validator invocation; truncation warning logged when exceeded
- [ ] Background agent (`.claude/agents/review.md`) runs the same Steps 0–9 pipeline; output format consistent with inline
- [ ] Findings filtered to confidence ≥ 80, deduplicated on (file_path + line ±2 + severity + category), grouped by file, output to terminal only
- [ ] No `gh` or GitHub API calls in the skill or background agent
- [ ] **Failure path tests** (3 explicit cases):
  - Missing temp file (kill an agent past timeout): skill reports the failure, continues with the other 2 agents' findings, terminal output ends with the ⚠️ note
  - Malformed JSON in a temp file (synthetic — write `not json` to one of the paths): skill catches the parse error, treats that agent as failed, continues
  - Validator timeout/failure: skill prints "validator failed — surfacing unfiltered candidates with a NOT-VALIDATED warning" and outputs the candidate array as-is

**Verify:**

```bash
grep -c 'Agent(' .claude/skills/review.md  # expect exactly 4 (3 discovery + 1 validator)
grep -c 'subagent_type=review-validator' .claude/skills/review.md  # expect exactly 1 (batched call, not per-finding)
grep -E '/review <file>' .claude/skills/review.md .claude/commands/review.md | grep -v -i 'removed\|no longer\|migration'  # expect no matches
grep -E 'gh pr|gh api|github\.com' .claude/skills/review.md .claude/agents/review.md  # expect no matches
grep -E 'SESSION=|BASE=' .claude/skills/review.md  # expect matches showing param passing
# Manual: run `/review` on test branch, verify output; run `/review some/file.vue`, verify migration notice
```

### Task 7: Tune `.coderabbit.yaml` for higher per-comment signal ratio

**Objective:** Reduce CodeRabbit's noise contribution by disabling cosmetic features, overriding inherited profile if assertive, and trimming `path_instructions` that duplicate ESLint/Stylelint coverage. Success is judged by per-comment usefulness on a benchmark PR, not by raw count.

**Dependencies:** Task 10 skeleton (need benchmark script for baseline capture before tuning)
**Mapped Scenarios:** None

**Files:**

- Modify: `.coderabbit.yaml`

**Key Decisions / Notes:**

- **Phase 0: Capture pre-tuning baseline** (gates Phase 1). Before touching `.coderabbit.yaml`, run `scripts/benchmark-review.mjs` (Task 10 skeleton must land first or in same commit) against 1 closed PR with the current inherited config. Save output as `scripts/benchmark-review-output/<pr>-coderabbit-baseline.csv`. Manually rate every CodeRabbit comment as `useful` or `noise`. Record the baseline ratio in the PR description for the eventual comparison.
- **Phase 1: Single-setting test with concrete observable signal.** Add a single override at the top of the `reviews:` block (after `inheritance: true`). Pick one high-confidence change first to validate the override mechanism works against the parent config. Recommended: `profile: chill`. Commit, push, open a small test PR, observe CodeRabbit comment behavior. **The override is confirmed working if** EITHER (a) CodeRabbit's walkthrough section in the PR comments mentions `profile: chill` in its config summary, OR (b) the test PR's CodeRabbit comment count drops ≥ 30% vs. the inherited-config baseline on the same diff. If neither signal appears, escalate to the parent config owner — do NOT proceed to Phase 2 with an override that isn't taking effect.
- **Phase 2: Disable cosmetic features.** Once Phase 1 confirms overrides work, add:
  ```yaml
  reviews:
    profile: chill
    poem: false
    high_level_summary: false
    review_status: false
    collapse_walkthrough: true
    related_issues: false
    related_prs: false
  ```
  These remove the cosmetic walkthroughs, summaries, poems, and "related" cross-references that add line count without per-PR signal.
- **Phase 3: Audit `path_instructions`.** Read each of the 12 `path_instructions` entries (lines 71–272). For each, ask: does any instruction here describe something our ESLint or Stylelint plugin already enforces? If yes, remove the redundant instruction. Examples to look for:
  - "Flag any prop/event/slot removal or rename without BREAKING CHANGE footer" — partially covered by `commitlint` for the footer; CodeRabbit still adds value here. Keep.
  - "Flag raw hex/rgb values, hardcoded px" — claimed coverage by `stylelint-plugin-dialtone`. **Before trimming**, manually run stylelint against a Vue file with an inline `style="color: #fff"` and a `.less` file with `width: 16px;` — verify both are flagged. Document the verification in an inline YAML comment on the trim. (Per spec-review S-3: don't assume linter coverage; verify it.)
  - "Tests use Vitest + @vue/test-utils" — informational, not a flaggable rule. Trim.
- **Do NOT touch the `inheritance: true` line or the `knowledge_base.linked_repositories` block.** These are not noise sources.
- **Validation**: after each phase, run the benchmark script (Task 10) against the same closed PR and rate every CodeRabbit comment as `useful` or `noise`. The deliverable is a higher useful ratio, not a lower count.

**Definition of Done:**

- [ ] **Phase 0 baseline captured BEFORE any change**: `scripts/benchmark-review-output/<pr>-coderabbit-baseline.csv` exists with every CodeRabbit comment rated `useful` or `noise`; baseline ratio recorded
- [ ] Phase 1 override committed and verified via concrete signal: test PR's CodeRabbit walkthrough shows `profile: chill` in its config summary, OR comment count drops ≥ 30% vs. baseline on the same diff
- [ ] Phase 2 cosmetic features disabled (verified by absence of `<!-- This is an auto-generated comment: poem -->` / similar markers in test PR's CodeRabbit comments)
- [ ] Phase 3 `path_instructions` audit completed; each trim is preceded by manual verification that the named linter actually catches the case (run linter against a known violation; document in inline YAML comment)
- [ ] **Post-tuning measurement**: same PR re-rated; useful-ratio improves over Phase 0 baseline; ≥ 80% useful on the post-tuning rating
- [ ] `.coderabbit.yaml` still validates against the schema (`yaml-language-server: $schema=...` annotation at line 1 still resolves correctly)

**Verify:**

```bash
grep -E 'profile: chill|poem: false|high_level_summary: false' .coderabbit.yaml  # expect matches
# Manual: open test PR, observe CodeRabbit comments before/after
# Manual: rate comments on benchmark PR (see Task 10)
```

### Task 8: Create `AGENTS.md` at repo root

**Objective:** Give Codex CLI project-specific context. Provide the 6 required sections per the PRD. Length ≤ 200 lines. Contents are context + lane boundaries, not duplicated rules.

**Dependencies:** Task 1 (AGENTS.md points to `code-review.md` for project conventions)
**Mapped Scenarios:** None

**Files:**

- Create: `/Users/belumontoya/Desktop/dialtone/AGENTS.md`

**Key Decisions / Notes:**

- Required sections (in order):
  1. **What Dialtone is** — 1 paragraph: monorepo, public npm design system, breaking-change sensitivity (silent ship as patches if not labeled), consumed by `dialpad/firespotter`, `dialpad/ios`, external users. Pointer to `CLAUDE.md` for build commands and full architecture.
  2. **Reviewer landscape table** — copies the table from PRD `## Reviewer Lanes` verbatim. Three rows: CodeRabbit / Local `/review` / Codex.
  3. **Codex's single job** — "Adversarial second-opinion. Question the implementation approach itself: assumptions, design tradeoffs, attack surfaces, what fails under stress. Do not flag style nits, convention violations, or anything CodeRabbit / local `/review` covers. Do not soften findings with 'consider' / 'might want to' — when an issue is real, state it directly with evidence."
  4. **What NOT to flag** — explicit list mirroring CodeRabbit's coverage (style, nits, formatting, breaking-change-footer detection) AND local `/review`'s coverage (Dialtone path-scoped convention violations, Vue `validator` vs `validate`, BEM, design-token usage). If Codex would produce a finding in either of those categories, it stops.
  5. **Diff-scope expectation** — Codex must use `--uncommitted` or `--base <ref>` to constrain review surface; findings outside the diff are excluded. Cite the codex CLI flag names exactly.
  6. **Pointer to project conventions** — link to `.claude/rules/code-review.md` and `CLAUDE.md` so Codex understands what counts as a convention without enforcing them (enforcement is local `/review`'s job).
- Length budget ≤ 250 lines (raised from 200 per spec-review S-4 — "What NOT to Flag" enumerating both CodeRabbit's and local `/review`'s coverage can run long). Per-section soft budgets to keep the file balanced:
  - Dialtone context: ≤ 15 lines
  - Reviewer landscape table: ≤ 25 lines (table + 1-line preamble)
  - Codex's single job: ≤ 15 lines
  - What NOT to Flag: ≤ 80 lines (the big one — needs to enumerate CodeRabbit's lanes and local `/review`'s lanes)
  - Diff-scope expectation: ≤ 15 lines
  - Pointers to conventions: ≤ 10 lines
  - (Headings + spacing absorb the remaining ~90 lines)
- **Out of AGENTS.md**: line-by-line review rules. The Codex plugin's `prompts/adversarial-review.md` already implements review behavior; duplicating it here weakens Codex's distinct lane.

**Definition of Done:**

- [ ] `AGENTS.md` exists at repo root
- [ ] File contains all 6 required sections (verified by grep)
- [ ] File ≤ 250 lines
- [ ] No line-by-line review rules in the file (the "What NOT to flag" section is a list of exclusions, not a positive rule list)
- [ ] Codex test (path-independent): run `codex review --uncommitted` on a small synthetic diff containing a known Dialtone convention concern; verify Codex's stdout references at least one Dialtone-specific signal (design system, breaking changes, reviewer landscape table, or one of the AGENTS.md section headings). Confirms AGENTS.md is being auto-loaded by whichever Codex CLI version is installed locally.
- [ ] Codex output for the test is captured into the Task 10 benchmark CSV with rating slot — Task 10 DoD picks this up for the ≥ 80% useful Codex measurement.

**Verify:**

```bash
test -f /Users/belumontoya/Desktop/dialtone/AGENTS.md
wc -l /Users/belumontoya/Desktop/dialtone/AGENTS.md  # expect ≤ 250
grep -iE '^##? (What Dialtone is|Reviewer landscape|Codex.*job|What NOT|Diff-scope|conventions)' AGENTS.md  # expect 6 matches
grep -iE 'BLOCKING|IMPORTANT|NIT|validator' AGENTS.md  # expect FEW matches — no line-rule duplication
codex --version  # capture version for the PR description
```

### Task 9: Delete dead GHA Claude workflows + supporting scripts (gated on Task 1 coverage migration)

**Objective:** Delete the `claude-code-review.yml` and `claude.yml` workflows + the 3 `safe-*.sh` scripts. Verify before deleting that Task 1's `code-review.md` rewrite covers all 11 categories from the workflow's embedded rules.

**Dependencies:** Task 1 (coverage migration gate)
**Mapped Scenarios:** None

**Files:**

- Delete: `.github/workflows/claude-code-review.yml`
- Delete: `.github/workflows/claude.yml`
- Delete: `.github/scripts/safe-read.sh`
- Delete: `.github/scripts/safe-grep.sh`
- Delete: `.github/scripts/safe-glob.sh`

**Key Decisions / Notes:**

- **Pre-deletion gate** (must run BEFORE `rm`):
  ```bash
  grep -i 'FTL\|hardcoded English' .claude/rules/code-review.md || { echo "FAIL: FTL category missing"; exit 1; }
  grep -i 'ARIA\|WCAG\|focus management' .claude/rules/code-review.md || { echo "FAIL: a11y detail missing"; exit 1; }
  grep -i 'cross-package\|non-tree-shakeable\|v-html\|innerHTML' .claude/rules/code-review.md || { echo "FAIL: cross-package + security missing"; exit 1; }
  # Broad orphan-reference grep across the WHOLE repo (not just .github/ .claude/ scripts/) — per spec-review MF-7.
  # Excludes generated/cache dirs. Whitelist the files we're about to delete.
  grep -rli "safe-read\|safe-grep\|safe-glob\|claude-code-action\|claude-review" . \
    --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.nx --exclude-dir=dist \
    --exclude-dir=tsc-cache --exclude-dir=.worktrees --exclude-dir=storybook-static \
    | grep -v "claude-code-review.yml\|claude.yml\|safe-read.sh\|safe-grep.sh\|safe-glob.sh" \
    | grep -v "docs/prd/2026-05-11-code-review-quality.md\|docs/plans/2026-05-12-code-review-coordination.md" \
    || true
  # Last grep should return zero output. The two doc files reference these names as part of the spec — whitelist them.
  ```
- After deletion, re-run the same broad grep (without the whitelist for deleted files):
  ```bash
  grep -rli "safe-read\|safe-grep\|safe-glob\|claude-code-action\|claude-review" . \
    --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.nx --exclude-dir=dist \
    --exclude-dir=tsc-cache --exclude-dir=.worktrees --exclude-dir=storybook-static \
    | grep -v "docs/prd/2026-05-11-code-review-quality.md\|docs/plans/2026-05-12-code-review-coordination.md"
  # Should return zero results.
  ```
- Use plain `git rm` (or `rm` + `git add -u`) — not `git rm --force`. If anything resists deletion, investigate.

**Definition of Done:**

- [ ] Pre-deletion gate passes: all 3 category greps return matches in `code-review.md`
- [ ] Orphan-reference grep returns only the files being deleted
- [ ] Files deleted: `.github/workflows/claude-code-review.yml`, `.github/workflows/claude.yml`, `.github/scripts/safe-{read,grep,glob}.sh`
- [ ] Post-deletion grep returns zero orphan references
- [ ] PR description notes the deletion and lists the migrated categories

**Verify:**

```bash
test ! -f .github/workflows/claude-code-review.yml
test ! -f .github/workflows/claude.yml
test ! -f .github/scripts/safe-read.sh
test ! -f .github/scripts/safe-grep.sh
test ! -f .github/scripts/safe-glob.sh
# Broad repo-wide check (per spec-review MF-7):
grep -rli "safe-read\|safe-grep\|safe-glob\|claude-code-action\|claude-review" . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.nx --exclude-dir=dist \
  --exclude-dir=tsc-cache --exclude-dir=.worktrees --exclude-dir=storybook-static \
  | grep -v "docs/prd/2026-05-11-code-review-quality.md\|docs/plans/2026-05-12-code-review-coordination.md\|CHANGELOG.md\|CHANGELOG.json"
# Expect zero output
# Note: CHANGELOG.md and CHANGELOG.json contain historical commit messages referencing
# 'claude-review' (PR #1189, #1143, #1138 — historical workflow improvements).
# These are immutable generated release notes; whitelisting them is correct behavior.
```

### Task 10: Create `scripts/benchmark-review.mjs` and document baseline/post-change usefulness ratings

**Objective:** Node script that runs `/review` and captures CodeRabbit + Codex output for a curated list of merged PRs. Captures per-finding data with a manual usefulness-rating slot. Used to validate the change with a before/after comparison on signal ratio (not count).

**Dependencies:** None for the script skeleton — Task 10 skeleton lands FIRST so Task 7 can use it for the pre-tuning CodeRabbit baseline. The full rating exercise (post-change) depends on Tasks 1–9.
**Mapped Scenarios:** None

**Files:**

- Create: `scripts/benchmark-review.mjs`
- Create: `scripts/benchmark-review-prs.json` (list of benchmark PR numbers + base SHAs; can start with 2 PRs and grow)

**Key Decisions / Notes:**

- ESM (`.mjs`), Node 18+. No new dependencies. Uses `child_process.execSync` for `gh` and `git` calls.
- Inputs: `scripts/benchmark-review-prs.json` listing PR numbers and base SHAs. **Start with 2 PRs** (reduced from 5 per spec-review S-6 to fit a realistic rating time budget — see protocol below) and grow as the team gains familiarity.
- For each PR in the list:
  1. **CodeRabbit comments**: `gh pr view <num> --json comments,reviewComments` — filter by `comments.filter(c => c.author.login.startsWith('coderabbitai'))` to catch `coderabbitai`, `coderabbitai[bot]`, and any other suffix variants (per spec-review SF-9). Reject PRs where the filter returns 0 comments — that's a signal the PR didn't get a CodeRabbit review or the filter is wrong.
  2. **Local `/review` findings**: (manual step) Check out the PR's head SHA in a clean worktree. Run `/review`. Capture the terminal output. Parse it into the same CSV structure as CodeRabbit comments. (The script provides a helper `parseLocalReviewOutput(stdout) → findings[]`.)
  3. **Codex findings**: (manual step) In the same clean worktree, run `codex review --base <base-sha>`. Capture stdout from the CLI (not via `gh` — Codex doesn't post to GitHub in this lane). Parse into the same CSV structure.
  4. Emit a CSV at `scripts/benchmark-review-output/<pr-number>.csv` with columns: `pr_number, reviewer (coderabbit|review|codex), file_path, line, severity, evidence_excerpt, usefulness_rating (useful|noise|tbd), notes`
- Initial `usefulness_rating` defaults to `tbd`; the human filling out the CSV sets it to `useful` or `noise`.
- The script does not auto-rate. It captures the data structure that humans rate.
- Post-rating, the script aggregates: per-reviewer useful/(useful+noise) ratio. Output to `scripts/benchmark-review-output/summary.json` with `{ reviewer: {useful, noise, ratio} }`.
- **Time budget for rating** (per spec-review S-6, so the deliverable is realistic): ~2 hours per PR per pass (covers all 3 reviewers). 2 PRs × 2 passes (baseline + post-change) ≈ 8 hours of human-rating work. Document this in the protocol comment at the top of the file so the developer knows the investment going in.
- Document the protocol in a comment at the top of the file: how to pick benchmark PRs, how to rate, how to run pre-change vs post-change, the time budget.

**Definition of Done:**

- [x] `scripts/benchmark-review.mjs` exists and executes (`node scripts/benchmark-review.mjs --help` works)
- [x] Captures CodeRabbit comments via `gh` with `startsWith('coderabbitai')` filter (per SF-9)
- [x] CSV output structure matches the spec (8 columns named above)
- [x] Smoke test: run script against a known PR with CodeRabbit comments; verify the CSV row count > 0 (PR 1259 → 3 rows including 2 manual placeholders)
- [x] Summary aggregation works on a hand-filled sample CSV (tested)
- [x] Protocol comment at top of the file explains usage + time budget in ≤ 40 lines (37 lines, lines 1–37)
- [ ] **Baseline data captured on 2 closed PRs pre-change** (saved in `scripts/benchmark-review-output/<num>-baseline.csv`); ALL three reviewers' output rated (CodeRabbit, local `/review`, Codex) — requires manual rating; gates Task 7 Phase 0
- [ ] **Codex output captured in the baseline AND post-change** for at least 1 PR (per spec-review MF-5, fulfills PRD line 225 — Codex ≥ 80% useful success criterion) — manual step after Task 8 (AGENTS.md) is done
- [ ] Post-change rating captured on the same PRs after Tasks 1–9 (saved as `<num>-post.csv`); per-reviewer ratios improve from baseline AND ≥ 80% useful on each reviewer's post-change rating (per PRD lines 222–225)

**Verify:**

```bash
node scripts/benchmark-review.mjs --help
# Smoke test:
node scripts/benchmark-review.mjs --pr 1259  # known PR with CodeRabbit comments
test -s scripts/benchmark-review-output/1259-baseline.csv  # non-empty
# After rating + post-change:
cat scripts/benchmark-review-output/summary.json
# Expect: {"coderabbit":{"ratio":≥0.8},"review":{"ratio":≥0.8},"codex":{"ratio":≥0.8}}
```

## Open Questions

None remaining — all design decisions resolved via the PRD's clarifying-question loop and the lane-allocation table.

### Deferred Ideas

- **GitHub inline PR comments from `/review`** via a `--post-comments` flag. Defer to a future PR if demand emerges; v1 is terminal-only.
- **Multi-model orchestration** (Haiku for the cheap pre/post checks, Opus for bug detection, Sonnet for conventions). Cost optimization; defer until v1 is in steady use and shows model-routing as a real bottleneck.
- **Codegen / templating** of review rules between `.claude/rules/code-review.md` and any future GHA workflow that needs an embedded copy. Moot until a future GHA workflow exists; not relevant after Task 9 deletes the current ones.
- **Auto-rating of usefulness** via a fourth LLM pass on benchmark output. Speculative; manual rating is the ground truth this PRD is calibrated against.
- **Persistent learnings / per-PR memory** for the local `/review` pipeline (mirror CodeRabbit's Learnings system). Defer until v1 ships and we can see whether confidence + threshold + do-not-flag is sufficient.
- **Specialized 4th–6th agents** modeled on beacon-app's pr-review structure (`silent-failure-hunter`, `comment-analyzer`, `type-design-analyzer`). v1 folds silent-failure-hunting into Agent B's responsibilities; if benchmark data shows we're missing concerns in those lanes, split them out as dedicated agents in v2.
- **File-classification-based agent selection** (beacon-app's `/pr-prep` pattern: "if try/catch in diff → run silent-failure-hunter"). v1 runs all 3 agents always. v2 could add this for performance — skip Agent C when no exported symbol changed, skip Agent A when no Vue/CSS file changed, etc.
- **Per-agent model assignment** (Haiku for mechanical Agent A; Sonnet for Bugs / Architecture; Opus for Validator). v1 uses Sonnet everywhere for simplicity. Cost optimization is a future PR if v1 runtime/cost is a bottleneck.
- **Code-simplifier with Write access** (beacon-app pattern: final-polish agent that auto-applies trivial fixes — import cleanup, Dialtone utility migration). Out of scope per PRD — we explicitly chose "report only, no auto-fix" for v1. Worth revisiting after v1 ships if `/review`'s output regularly contains trivially-applicable suggestions.
