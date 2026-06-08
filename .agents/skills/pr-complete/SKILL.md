---
name: pr-complete
description: Complete merged Dialtone PR follow-up safely. Use after a PR has merged or when closing out a local PR branch.
---

# Dialtone PR Complete

## Goal

Verify merge state, return safely to `staging`, preserve user work, and handle `NO-JIRA` closeout without Jira mutation.

## Trigger

- `$pr-complete`
- "PR merged"
- "close this out"
- "return to staging"

## Required Context

- PR number or current branch PR.
- GitHub merge state.
- `git status --short --branch`
- Current branch and target base.
- `.agents/resources/package-map.md`

## Constraints

- Do not proceed with branch hygiene if the worktree is dirty.
- For `NO-JIRA`, skip Jira entirely.
- For ticketed work, Jira transition is a separate explicit action unless the user requested it.
- Switch to `staging` and fast-forward pull only after merge is verified.
- Ask before deleting the local branch.

## Workflow

1. Identify PR and branch.
2. Verify PR is merged.
3. Confirm worktree cleanliness.
4. Record ticket mode and skipped actions.
5. Switch to `staging`.
6. Pull `origin/staging` with fast-forward only.
7. Offer local branch deletion as optional cleanup.

## Done When

- Merge state is verified.
- Local repo is on updated `staging`.
- Jira handling is explicit and skipped for `NO-JIRA`.
- Local branch cleanup is completed or left for user decision.

## Verification

- `git status --short --branch`
- `git rev-parse --abbrev-ref HEAD`
- GitHub PR merged state.

## References

- `.agents/resources/package-map.md`
