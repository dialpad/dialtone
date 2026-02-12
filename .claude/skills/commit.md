---
description: "Full commit workflow with Jira integration and scope auto-detection. Use when committing changes or when the user says 'commit', 'ready to commit', 'stage changes', etc."
---

# /commit - Dialtone Commit Workflow

Commit format is enforced by the `commit-format.sh` hook. See CLAUDE.md for the format specification.

## Workflow

### 1. Analyze Changes

```bash
git status
git diff --cached   # if files are staged
git diff            # if nothing staged yet
```

### 2. Auto-Detect Type

| File pattern | Likely type |
| --- | --- |
| `*.vue`, component directories | `feat` (new) or `fix` (existing) |
| `*.test.js`, `*.spec.js` | `test` |
| `*.md`, `docs/`, `apps/dialtone-documentation/` | `docs` |
| `*.less`, `packages/dialtone-css/` | `style` or `feat` |
| `*.config.*`, `package.json`, build configs | `build` |
| `.github/workflows/`, CI config | `ci` |
| Version bumps, changelog, formatting | `chore` |
| Performance-focused changes | `perf` |
| Code restructuring, no behavior change | `refactor` |

### 3. Auto-Detect Scope

- **Component changes**: kebab-case component name (e.g., `select-menu`)
- **Package-level changes**: package short name (e.g., `tokens`, `css`, `icons`)
- **Cross-package changes**: comma-separated (e.g., `combobox, tooltip`)
- **Broad or repo-wide**: omit scope

### 4. Resolve Jira Ticket

Priority order:

1. **Branch name**: Extract `DLT-\d+` from `git branch --show-current`
2. **Recent commits**: Look for `DLT-\d+` in `git log --oneline -10`
3. **User input**: Ticket mentioned in conversation
4. **Create new**: Via `mcp__atlassian__createJiraIssue` with `projectKey: "DLT"`, `issueTypeName: "Task"`
5. **Fallback**: `NO-JIRA`

### 5. Stage and Commit

Stage specific files only. **Never** `git add -A` or `git add .`. **Never** stage `.env`, credentials, or `node_modules/`.

Use heredoc format:

```bash
git commit -m "$(cat <<'EOF'
feat(tooltip): DLT-123 add arrow positioning support
EOF
)"
```

### 6. Absolute Rules

- **NEVER** add `Co-Authored-By` lines
- **NEVER** use `--no-verify`
- **NEVER** commit secrets or credentials
