---
description: "Local code review against Dialtone review rules. Triggered by '/review', natural language ('review my changes', 'check this code'), or '/review <area>' for focused review (e.g., '/review accessibility', '/review css'). Reads the rules from .claude/rules/code-review.md and applies them to changed files."
---

# Dialtone Code Review

Reviews changed code against the Dialtone code review checklist defined in `.claude/rules/code-review.md`. Reports findings only — does not auto-fix or commit.

## Usage

- `/review` — Review all staged and unstaged changes
- `/review <area>` — Focus on one category: `reuse`, `quality`, `vue`, `css`, `api`, `testing`, `storybook`, `i18n`, `accessibility`
- `/review <file>` — Review a specific file

## Workflow

### Step 1 — Load the rules

Read `.claude/rules/code-review.md` to load the full review checklist.

### Step 2 — Detect scope

Determine what to review:

1. If user specified a file path → review that file
2. If there are staged changes → `git diff --cached --name-only`
3. If there are unstaged changes → `git diff --name-only`
4. If no local changes → diff against the base branch:
   - Detect base: `git rev-parse --abbrev-ref HEAD@{upstream} 2>/dev/null` — extracts the remote tracking branch (e.g., `origin/staging`, `origin/next`)
   - If no upstream is set, fall back to the repo's default branch: `git remote show origin | sed -n 's/.*HEAD branch: //p'`
   - Then: `git diff --name-only <base>...HEAD`

### Step 3 — Check file count and delegate if needed

Count the changed files. If **10 or more files** are in scope (threshold chosen to protect the main conversation's context window), delegate to the `.claude/agents/review.md` agent running in the background instead of continuing inline. Tell the user: "Large diff detected (N files) — running review in the background. I'll share the results when it's done."

If under 10 files, continue inline.

### Step 4 — Map files to rule categories

For each changed file, determine which review categories apply:

| File pattern | Categories |
|---|---|
| `*.vue` | Reuse & Duplication, Code Quality, Vue Correctness, API & Library Design, i18n & Assets, Accessibility |
| `*.less` | CSS / Styling |
| `*.test.js` | Testing |
| `*.stories.js`, `*.mdx` | Storybook |
| JS helpers (`*_constants.js`, `validators.js`, `utils.js`, `index.js`, and similar) | Reuse & Duplication, Code Quality, API & Library Design |
| `packages/dialtone-tokens/**/*.json` | CSS / Styling (token usage) |

If user specified a focus area (e.g., `/review accessibility`), only apply that category regardless of file type.

### Step 5 — Review each file

For each file in scope:

1. Read the full file content (not just the diff) to understand context
2. Read the diff to understand what changed
3. Check each applicable rule from the checklist against the changed code
4. Note any findings — include the file path and the specific line or area

### Step 6 — Output findings

Present findings as a flat list grouped by file:

```text
## Review: <scope description>

### path/to/file.vue
- [Rule category] Finding description (line N)
- [Rule category] Finding description (line N)

### path/to/other_file.less
- [Rule category] Finding description (line N)

---
No issues found in: path/to/clean_file.test.js
```

If no findings at all: "No issues found. All changes pass the Dialtone review checklist."

## Rules

- **Report only** — never auto-fix code or create commits
- **Read before judging** — always read the full file for context, not just the diff
- **Be specific** — include file path, line number, and the rule that was violated
- **Skip irrelevant categories** — don't check CSS rules on `.test.js` files
- **Flag uncertainty** — if unsure whether something is a violation, say so rather than guessing
- **Don't duplicate linting** — skip issues that ESLint or Stylelint would already catch (formatting, unused vars, etc.)
- **Cross-reference existing rules** — the path-scoped rules in `.claude/rules/vue-components.md`, `css-utilities.md`, `vue-tests.md` have deeper conventions; reference them when relevant
