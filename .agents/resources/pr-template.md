# Dialtone PR Template Guidance

Use this resource from `pr-prep`, `pr-create`, and `commit`.

## Title And Commit Convention

PR titles and commits follow `.github/COMMIT_CONVENTION.md`:

```text
<type>(<scope>): <jira> <subject>
```

- Use `NO-JIRA` only when project-start or the user explicitly chose no Jira.
- Do not create Jira tickets from PR or commit workflows.
- Use `chore` for agent tooling changes.
- Never include `Co-Authored-By` lines.

## PR Body Rules

- Start from `.github/pull_request_template.md`.
- Remove irrelevant sections rather than filling them with noise.
- Keep the public-repo checklist visible and check it only when true.
- Include cross-package impact when changes span package boundaries.
- Include documentation artifact status when Vue, docs, MCP, query-core, tokens, CSS, or icon behavior changes.
- Do not include private Dialpad links, private screenshots, customer data, secrets, or internal-only notes.

## Public Write Boundary

- Draft the title/body first.
- Open or update a PR only when the user asked for a public write or the workflow explicitly includes PR creation.
- If ticket state is unresolved, stop and route to `project-start` or a separate Jira workflow.
