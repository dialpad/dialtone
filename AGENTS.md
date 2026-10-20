# Dialtone Codex Guide

Dialtone is a public design system monorepo. Keep Codex work branch-safe, public-safe, and scoped to the package graph.

## Always Loaded Rules

- Branch from `staging` unless the user or PR target says otherwise.
- Do not edit directly on `staging`, `production`, `main`, or `master`.
- Use Dialtone branch names: `chore/NO-JIRA-short-purpose` or `<type>/DLT-1234-short-purpose`.
- Treat `NO-JIRA` as an explicit decision to skip Jira lookup, creation, assignment, and transition.
- Jira creation is a separate explicit action. Do not create Jira tickets from commit, PR, review, or validation workflows.
- Preserve user work. Do not stage, delete, or rewrite unrelated modified or untracked files.
- Stage explicit files or hunks; never use `git add .` or `git add -A`. Do not force-push or discard/stash user work without explicit authorization.
- Use the pnpm version declared in `package.json`. Use `pnpm install --frozen-lockfile` for ordinary setup; change `pnpm-lock.yaml` only for an intentional dependency change and explain it in the PR.
- This is a public repo. Do not add private Dialpad links, secrets, customer data, or internal-only context to committed files or PR bodies.
- Commit and PR titles follow `.github/COMMIT_CONVENTION.md`: `<type>(<scope>): <jira> <subject>`.
- Never include `Co-Authored-By` lines in commits or PR descriptions.
- Use Dialtone CLI or MCP lookup before guessing about public component APIs, tokens, utility classes, icons, or docs guidance. Prefer CLI for version-sensitive work.
- Read `.agents/README.md` to choose the local Codex skill or resource for a task.
- During planning and before PR readiness, assess contributor-instruction and public-guide impacts. Update affected guidance with the owning change, or record why no change is needed or a named follow-up and gate. See `.agents/README.md` for instruction maintenance.
