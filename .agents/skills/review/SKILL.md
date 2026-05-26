---
name: review
description: Run a report-only local review against Dialtone rules. Use when the user invokes $review, asks for a review, or asks to check local changes.
---

# Dialtone Review

## Goal

Find bugs, regressions, missing tests, public-repo risks, or workflow risks without editing files.

## Trigger

- `$review`
- "review my changes"
- "check this code"
- "look for issues"

## Required Context

- Changed files from staged, unstaged, and untracked sources.
- If no local changes, compare the current branch against upstream or `origin/staging`.
- `.agents/resources/rules/general.md`
- `.agents/resources/rule-map.md`
- Full file contents for every reviewed file.

## Constraints

- Report only. Do not edit, stage, commit, push, or reply publicly.
- Load only rules that match changed paths.
- Read the full file before judging a diff.
- Do not duplicate formatter, ESLint, or Stylelint findings unless they indicate broader risk.

## Workflow

1. Collect changed files with `git diff --cached --name-only`, `git diff --name-only`, and `git ls-files --others --exclude-standard`.
2. If the list is empty, diff against upstream or `origin/staging`.
3. Load general rules and matched path-specific rules from `rule-map.md`.
4. Review each changed file with full context and diff context.
5. Report findings first, ordered by severity, with path and line when possible.
6. Include open questions and validation gaps after findings.

## Done When

- Every changed file is either reviewed or explicitly skipped with a reason.
- Findings are severity-ordered and actionable.
- No edits or public writes were made.

## Verification

- Use this skill in report-only mode.
- Run `node .agents/evals/run-skill-contract-evals.mjs` after changing the skill.

## References

- `.agents/resources/rule-map.md`
