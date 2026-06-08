---
name: validate
description: Select and run focused Dialtone validation. Use when the user invokes $validate, asks to run checks, or before commit/PR readiness.
---

# Dialtone Validate

## Goal

Map changed files to the smallest useful validation set and report pass/fail/skip status.

## Trigger

- `$validate`
- "run checks"
- "validate this"
- Before commit, PR prep, or PR creation.

## Required Context

- Changed files from staged, unstaged, and untracked sources.
- `.agents/resources/validation.md`
- `.agents/resources/package-map.md`

## Constraints

- Prefer focused package checks before all-repo checks.
- Do not run destructive or publishing commands.
- If a check is too expensive or irrelevant, mark it skipped with a reason.
- Do not edit files as part of validation.

## Workflow

1. Collect changed files.
2. Map files to areas with `package-map.md`.
3. Select commands from `validation.md`.
4. Run requested or risk-appropriate checks.
5. Summarize command, result, and follow-up.

## Done When

- Every changed area has selected validation or an explicit skip reason.
- Results are summarized with exact commands.
- Failures include next debugging target.

## Verification

- `node .agents/evals/run-skill-contract-evals.mjs`

## References

- `.agents/resources/validation.md`
- `.agents/resources/package-map.md`
