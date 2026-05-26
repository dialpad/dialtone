---
name: commit
description: Safely stage and commit Dialtone changes. Use when the user asks to stage, commit, or prepare committed work.
---

# Dialtone Commit Workflow

## Goal

Stage only intended files and create a Dialtone-convention commit without Jira side effects.

## Trigger

- "stage these changes"
- "commit"
- "ready to commit"
- "commit local changes"

## Required Context

- `git status --short --branch`
- Staged and unstaged diffs for intended files.
- Ticket mode from branch name, user request, or project-start.
- `.github/COMMIT_CONVENTION.md`
- `.agents/resources/pr-template.md`

## Constraints

- Stage explicit files only. Never use `git add -A` or `git add .`.
- Never stage secrets, `.env`, `node_modules/`, generated caches, or unrelated user changes.
- Never create Jira tickets.
- Preserve `NO-JIRA` when project-start or the branch chose `NO-JIRA`.
- Never include `Co-Authored-By` lines.
- Never use `--no-verify` unless the user explicitly asks and accepts the risk.

## Workflow

1. Inspect branch and worktree state.
2. Identify intended files and unrelated changes.
3. Resolve commit type, optional scope, ticket token, and imperative subject.
4. Stop if ticket mode is unresolved and ask for project-start/Jira decision.
5. Run focused validation when practical or record why it was skipped.
6. Stage explicit intended files.
7. Commit with `<type>(<scope>): <jira> <subject>`.

## Done When

- Only intended files are staged.
- Commit message follows Dialtone convention.
- Validation status is known or intentionally skipped.
- No Jira mutation or unrelated staging occurred.

## Verification

- `git status --short --branch`
- `git diff --cached --name-only`
- Relevant validation from `.agents/resources/validation.md`

## References

- `.agents/resources/pr-template.md`
- `.agents/resources/validation.md`
