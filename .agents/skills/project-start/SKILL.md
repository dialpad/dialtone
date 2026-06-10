---
name: project-start
description: Start a Dialtone effort safely. Use when the user invokes $project-start or asks to start a new task, tooling update, bug fix, chore, PR cleanup, or NO-JIRA effort.
---

# Dialtone Project Start

## Goal

Establish ticket mode, branch name, base branch, working-tree safety, and the next workflow before repo edits begin.

## Trigger

- `$project-start <ticket-or-NO-JIRA> <description>`
- Starting a new Dialtone implementation, chore, docs update, tooling update, fix, or PR follow-up.

## Required Context

- `git status --short --branch`
- `git branch --show-current`
- `git rev-parse origin/staging` when `origin/staging` exists locally
- `AGENTS.md`
- `.agents/README.md`
- `resources/package-map.md`
- `resources/agent-tooling-parity.md` for agent tooling work

## Constraints

- Branch from `staging` unless the user or PR target says otherwise.
- Do not edit files directly on `staging`, `production`, `main`, or `master`.
- Use Dialtone branch style: `chore/NO-JIRA-short-purpose` or `<type>/DLT-1234-short-purpose`.
- Treat `NO-JIRA` as explicit permission to skip Jira lookup, creation, assignment, and transition.
- Jira creation is separate. If ticket mode is unresolved, ask whether to use an existing ticket, create one via a Jira workflow, or proceed `NO-JIRA`.
- Do not stage or alter unrelated modified or untracked files.

## Workflow

1. Inspect branch, base, and worktree status.
2. Parse ticket mode:
   - `NO-JIRA`: use no-Jira mode.
   - `DLT-1234`: use that ticket; do not create another.
   - Missing ticket: pause for ticket-mode decision before branch creation.
3. Pick branch type:
   - `chore` for agent tooling, repo maintenance, and broad non-release work.
   - `docs` for contributor/user documentation-only changes.
   - `fix`, `feat`, `refactor`, `test`, or `ci` only when the requested work clearly matches the commit convention.
4. Slugify the description in lowercase kebab case.
5. If tracked changes exist before branch creation, stop and ask how to handle them.
6. Report unrelated untracked files and leave them alone.
7. Create or propose the branch depending on user intent and safety state.
8. Route to the next skill: `review`, `validate`, `component-work`, `pr-comments`, or implementation.

## Done When

- Branch or proposed branch name is clear.
- Ticket mode is `NO-JIRA`, an existing ticket, or explicitly unresolved.
- Base branch and dirty/untracked state are reported.
- No Jira mutation has happened unless the user explicitly asked for a separate Jira action.
- Next workflow is named.

## Verification

- `node .agents/skills/project-start/evals/run-project-start-evals.mjs`

## References

- `AGENTS.md`
- `.agents/README.md`
- `.agents/resources/package-map.md`
- `.agents/resources/agent-tooling-parity.md`
