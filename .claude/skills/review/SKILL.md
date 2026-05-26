---
description: "Local code review against Dialtone review rules. Triggered by '/review', natural language ('review my changes', 'check this code'), or '/review <area>' for focused review (e.g., '/review accessibility', '/review css'). Reads general-rules.md unconditionally, then loads only the rule files that match the changed files in the diff."
---

# Dialtone Code Review

Reviews changed code against Dialtone rules. Always applies general rules; loads package-specific rules only for packages present in the diff. Reports findings only — does not auto-fix or commit.

## Workflow

### Step 1 — Load general rules

Read `.claude/rules/general-rules.md`. These apply to every changed file regardless of package.

### Step 2 — Detect scope

Collect staged, unstaged, **and untracked** changed files:

```bash
git diff --cached --name-only
git diff --name-only
git ls-files --others --exclude-standard
```

Deduplicate the union. New files that exist on disk but have never been added to the index appear only in the third command — without it, brand-new files would be silently skipped.

If no local changes, diff against the base branch:

```bash
BASE=$(git rev-parse --abbrev-ref HEAD@{upstream} 2>/dev/null \
  || git remote show origin | sed -n 's/.*HEAD branch: //p')
git diff --name-only "$BASE"...HEAD
```

### Step 3 — Load package-specific rules

Glob all `.claude/rules/*.md` files except `general-rules.md`. For each:

1. Read its YAML frontmatter `paths:` block
2. If any changed file matches one of those glob patterns → load that rule file

Only rules whose `paths:` match the actual diff are loaded. If the diff only touches `packages/dialtone-css/**`, only `css-utilities.md` is loaded — all other rule files are skipped.

### Step 4 — Review each changed file

For each changed file:

1. Read the full file for context
2. Read the diff to see what changed
3. Apply the general rules from Step 1
4. Apply any package-specific rules loaded in Step 3 that match this file
5. Note findings with file path, line or area, and the specific rule

### Step 5 — Output findings

Present findings grouped by file:

```text
## Review: <scope description>

### path/to/file.vue
- [Reuse] Finding description (line N)
- [Vue] Finding description (line N)

### path/to/other_file.less
- [CSS] Finding description (line N)

---
No issues found in: path/to/clean_file.test.js
```

If no findings: "No issues found. All changes pass the Dialtone review rules."

## Rules

- **Report only** — never auto-fix code or create commits
- **Read before judging** — always read the full file for context, not just the diff
- **Be specific** — include file path, line number, and the rule
- **Only apply matched rules** — skip rule files whose paths did not match the diff
- **Flag uncertainty** — if unsure whether something is a violation, say so
- **Don't duplicate linting** — skip issues ESLint or Stylelint would already catch
