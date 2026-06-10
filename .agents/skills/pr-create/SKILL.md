---
name: pr-create
description: Prepare, create, or update a Dialtone pull request. Use when the user invokes $pr-create, asks to open a PR, or asks to fill a PR description.
---

# Dialtone PR Create

## Goal

Prepare a public-safe Dialtone PR title and body, then create or update a PR only when readiness and ticket state are clear.

## Trigger

- `$pr-create`
- "open a PR"
- "fill PR body"
- "update PR description"

## Required Context

- Current branch and base branch, usually `staging`.
- Changed files and commits relative to base.
- Ticket mode from project-start, branch, or user.
- `.github/pull_request_template.md`
- `.agents/resources/pr-template.md`
- `.agents/resources/package-map.md`

## Constraints

- Do not create Jira tickets. Stop if ticket state is unresolved.
- Use `NO-JIRA` only when project-start, branch, or user chose it.
- Do not include private Dialpad links, private screenshots, customer data, secrets, or internal-only notes.
- Strip `Co-Authored-By` lines from generated PR text.
- Prefer drafting title/body before public writes.
- Confirm public writes when ambiguity remains.

## Workflow

1. Inspect current branch, base, commits, and changed files.
2. Resolve title from actual changes and `.github/COMMIT_CONVENTION.md`.
3. Build PR body from `.github/pull_request_template.md`.
4. Remove irrelevant checklist sections.
5. Add cross-package impact and documentation artifact status when relevant.
6. Report validation gaps from `pr-prep` or focused checks.
7. Create or update the PR only after the user asked for public PR action.

## Done When

- PR title follows Dialtone convention.
- PR body is public-safe and template-based.
- Ticket mode is explicit.
- Public write happened only when requested or clearly in scope.

## Verification

- `node .agents/evals/run-skill-contract-evals.mjs`
- `pnpm exec markdownlint` for edited Markdown, when applicable.

## References

- `.agents/resources/pr-template.md`
- `.agents/resources/package-map.md`
- `.agents/resources/validation.md`
