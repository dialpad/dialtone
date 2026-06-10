---
name: pr-prep
description: Run a report-only PR readiness check. Use before opening, updating, or requesting review on a Dialtone PR.
---

# Dialtone PR Prep

## Goal

Catch readiness, validation, docs, public-safety, and cross-package gaps before PR creation or update.

## Trigger

- `$pr-prep`
- "is this ready for PR?"
- Before `$pr-create`.

## Required Context

- Current branch and base branch, usually `staging`.
- Changed files and commits relative to base.
- `.agents/resources/package-map.md`
- `.agents/resources/validation.md`
- `.agents/resources/doc-sync.md`
- `.agents/resources/pr-template.md`

## Constraints

- Report only. Do not edit, stage, commit, push, or create PRs.
- Do not create Jira tickets.
- Preserve `NO-JIRA` if already selected.
- Flag unresolved ticket state as blocking for PR creation.

## Workflow

1. Inspect branch, base, commits, changed files, and worktree cleanliness.
2. Map changed files to packages and downstream impact.
3. Check ticket mode and PR title readiness.
4. Select validation commands and note pass/fail/skip status if already run.
5. Run or invoke `doc-sync-check` logic for source areas that map to AI docs.
6. Report blocking issues, warnings, and ready-to-create status.

## Done When

- PR creation is classified as ready, ready with warnings, or blocked.
- Blockers include exact files or decisions needed.
- Validation and doc-sync expectations are explicit.

## Verification

- `node .agents/evals/run-skill-contract-evals.mjs`

## References

- `.agents/resources/package-map.md`
- `.agents/resources/validation.md`
- `.agents/resources/doc-sync.md`
- `.agents/resources/pr-template.md`
