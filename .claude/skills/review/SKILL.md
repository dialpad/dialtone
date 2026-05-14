---
description: "Local code review using a 3-agent + validator pipeline. Triggered by '/review' (all changes), '/review <area>' for focused review (areas: vue, css, api, testing, storybook, i18n, accessibility). Reports findings only — no auto-fix, no commits, no GitHub API calls."
---

# Dialtone Code Review

Runs the 3-agent + validator pipeline against the current branch diff. Three discovery agents (Conventions, Bugs & Logic, Architecture) produce candidate findings in parallel, then a batched Validator agent scores them with a confidence threshold of 80. Deduplicated, filtered findings are printed to the terminal.

## Usage

- `/review` — Review all changed files (full pipeline)
- `/review <area>` — Focus on one area: `vue`, `css`, `api`, `testing`, `storybook`, `i18n`, `accessibility`

**Note:** `/review <file>` is no longer supported. Run `/review` on a branch where only that file has changed.

## Workflow

### Step 0 — Session setup, base resolution, temp cleanup

Compute a unique session token and resolve the diff base. Both are passed explicitly to every spawned agent — agents do NOT read environment variables themselves.

```bash
SESSION="${PILOT_SESSION_ID:-$(date +%s)-$$}"
```

Resolve base:
```bash
BASE=$(git rev-parse --abbrev-ref HEAD@{upstream} 2>/dev/null)
if [ -z "$BASE" ]; then
  DEFAULT=$(git remote show origin 2>/dev/null | sed -n 's/.*HEAD branch: //p')
  BASE="origin/${DEFAULT:-staging}"
fi
```

Clean stale temp files from any previous run:
```bash
rm -f "/tmp/dialtone-review-${SESSION}-"*.json
```

### Step 1 — Parse argument and detect scope

**File-path detection:** If the argument looks like a file path (contains `/` or ends in `.vue`, `.js`, `.ts`, `.mjs`, `.less`, `.json`, `.md`) and is NOT one of the known areas below, print the migration notice and exit:

```
/review <file> is no longer supported.
Run /review on a branch where only that file has changed, or use:
  git stash  # stash unrelated changes
  git diff HEAD -- <file>  # verify only that file changes
```

**Area mapping:** If an area argument is given, record which agents to activate:

| Area | Agents |
|---|---|
| `vue`, `css`, `i18n`, `storybook`, `accessibility` | Conventions only (Agent A) |
| `api` | Conventions (Agent A) + Architecture (Agent C) |
| `testing` | Conventions (Agent A) + Bugs & Logic (Agent B) |
| (no argument) | All 3 agents |

**Collect changed files:**
```bash
STAGED=$(git diff --cached --name-only 2>/dev/null)
UNSTAGED=$(git diff --name-only 2>/dev/null)
CHANGED_FILES=$(echo "$STAGED"$'\n'"$UNSTAGED" | sort -u | grep -v '^$' | tr '\n' ',')
```

If no local changes:
```bash
CHANGED_FILES=$(git diff --name-only "$BASE"...HEAD 2>/dev/null | tr '\n' ',')
```

### Step 2 — Delegate to background agent for large diffs

Count changed files. If **10 or more files** are in scope, delegate to `.claude/agents/review.md` running in the background. Tell the user: "Large diff detected (N files) — running the review pipeline in the background. Results will appear when complete."

Pass SESSION, BASE, CHANGED_FILES, and the AREA (if any) to the agent prompt.

If under 10 files, continue inline with Steps 3–8.

### Step 3 — Spawn discovery agents in parallel

Spawn the applicable discovery agents with `run_in_background: true`. Pass SESSION, BASE, and CHANGED_FILES in each prompt.

**Temp file paths:**
- Agent A: `/tmp/dialtone-review-${SESSION}-conventions-1.json`
- Agent B: `/tmp/dialtone-review-${SESSION}-bugs-2.json`
- Agent C: `/tmp/dialtone-review-${SESSION}-architecture-3.json`

Include the temp file path in each agent's prompt so the agent knows where to write.

Example prompt for Agent A:
```
SESSION=${SESSION}
BASE=${BASE}
CHANGED_FILES=${CHANGED_FILES}
OUTPUT_PATH=/tmp/dialtone-review-${SESSION}-conventions-1.json

[rest of the agent's system prompt as defined in .claude/agents/review-dialtone-conventions.md]
```

Only spawn the agents activated for the current area (Step 1).

### Step 4 — Poll for completion

Wait for each spawned agent's output file to appear (max 5 minutes per agent):

```bash
CONV_OUT="/tmp/dialtone-review-${SESSION}-conventions-1.json"
BUGS_OUT="/tmp/dialtone-review-${SESSION}-bugs-2.json"
ARCH_OUT="/tmp/dialtone-review-${SESSION}-architecture-3.json"

# Poll for only the files that were spawned
for i in $(seq 1 150); do
  READY=true
  # Check each activated agent's file
  # [[ condition per agent ]] || READY=false
  $READY && echo "READY" && break
  sleep 2
done
```

Timeout at 5 minutes (150 × 2s). If any file is missing after timeout, log which agent timed out and continue with the available files.

### Step 5 — Read findings, assign IDs, cap at 50

For each activated agent's output file:
1. Attempt `JSON.parse` of the file contents.
2. On parse failure (invalid JSON or missing file): log "⚠️ Agent <name> produced no valid output — skipped" and continue with the other agents.
3. On success: add the array to the combined candidates list.

After collecting from all agents:
- Assign `id` to each finding: `conventions-1`, `conventions-2`, `bugs-1`, `architecture-1`, etc. (agent prefix + sequential index within that agent's output).
- If the combined count exceeds 50, truncate to the first 50 and log: "⚠️ Finding cap (50) reached — truncating before validator. Consider running /review <area> for focused review."

### Step 6 — Spawn validator agent (batched, single call)

Pass the entire candidate array (with assigned `id` values) to the Validator agent in a single `Agent` call. Include SESSION and BASE.

Wait for `/tmp/dialtone-review-${SESSION}-validator.json` via bash polling (same 5-minute window).

On validator failure (timeout or parse error): log "⚠️ Validator failed — surfacing unfiltered candidates as NOT-VALIDATED" and output the candidate array with a visible `NOT VALIDATED` header. Do not silently produce empty output.

### Step 7 — Filter and deduplicate

From the validator output, keep only `decision: "surface"` findings.

Deduplicate: two findings collapse into one if ALL FOUR match:
- Same `file_path`
- `line_start` values overlap within ±2
- Same `severity`
- Same `category`

When deduplicating: the higher-confidence finding wins; the other's `evidence` is appended to a `supporting_evidence` field on the winner.

### Step 8 — Output to terminal

Print filtered, deduplicated findings grouped by file:

```
## Code Review: <scope description>

### packages/dialtone-vue/components/button/button.vue
[BLOCKING] (conventions, 92%) Vue $slots in computed
  Line 42: `computed(() => $slots.default ? ...)`
  Rule: $slots is not reactive in computed — slot presence won't update the derived value.
  Fix: Move $slots access to template or a non-computed method.

### packages/dialtone-vue/components/modal/modal.vue
[BLOCKING] (architecture, 85%) Public API break without BREAKING CHANGE
  Line 55-58: removed 'closeOnEscape' prop.
  codegraph_callers(closeOnEscape) returned 8 callers in packages/dialtone-vue and apps/dialtone-documentation.
  Fix: Add 'BREAKING CHANGE: closeOnEscape prop removed' footer, or restore and deprecate.

---
No issues surfaced in: packages/dialtone-css/components/button/_button.less
```

If no findings after filtering: "No issues found. All changes passed the Dialtone review pipeline (confidence threshold: 80%)."

If any agent failed (Steps 4–6 logged a ⚠️): append the failure note after the findings summary.

**No GitHub API calls. No file edits. Terminal output only.**

## Rules

- **Report only** — never auto-fix code, never create commits, never call `gh` or any GitHub API.
- **Diff-only** — findings must cite lines in `git diff $BASE...HEAD`. Pre-existing issues are excluded.
- **Single validator call** — the Validator is spawned ONCE with the full candidate array, not once per finding.
- **Hard cap** — 50 candidates maximum before the validator. Above this, truncate with a warning.
- **Failure resilience** — missing or malformed agent output is a logged warning, not a silent empty result.
- **Area-mode differentiation** — `/review <area>` activates only the relevant agents per the area mapping table.
