---
description: "Full commit workflow with Jira integration, format validation, and convention enforcement. Use when committing changes or when the user says 'commit', 'ready to commit', 'stage changes', etc."
---

# /commit - Dialtone Commit Workflow

## Commit Format

```
<type>(<scope>): <jira> <subject>
```

**Parser regex:** `^(\w*)(?:\((.+)\))?: ((?:NO-JIRA|[A-Z]{2,}-\d+)(?: [A-Z]{2,}-\d+)*) (.+)$`

## Workflow

### 1. Analyze Changes

Run these commands to understand what changed:

```bash
git status
git diff --cached   # if files are staged
git diff            # if nothing staged yet
```

Review the output to understand the scope and nature of the changes.

### 2. Auto-Detect Type

Infer the commit type from what files changed:

| File pattern | Likely type |
|---|---|
| `*.vue`, component directories | `feat` (new) or `fix` (existing) |
| `*.test.js`, `*.spec.js` | `test` |
| `*.md`, `docs/`, `apps/dialtone-documentation/` | `docs` |
| `*.less`, `packages/dialtone-css/` | `style` or `feat` |
| `*.config.*`, `package.json`, `rollup.*`, `vite.*`, `webpack.*` | `build` |
| `.github/workflows/`, CI config | `ci` |
| Version bumps, changelog, formatting | `chore` |
| Performance-focused changes | `perf` |
| Code restructuring, no behavior change | `refactor` |

**Valid types:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

Only `feat`, `fix`, `perf`, and `refactor` trigger a new release.

### 3. Auto-Detect Scope

Determine scope from the most-changed package or component:

- **Component changes:** Use component name in kebab-case (e.g., `select-menu`, `combobox`)
- **Package-level changes:** Use package short name (e.g., `tokens`, `css`, `icons`, `emojis`)
- **Cross-package changes:** Use comma-separated scopes (e.g., `combobox, tooltip`)
- **Broad or repo-wide changes:** Omit scope entirely

**Monorepo packages:** dialtone-tokens, dialtone-css, dialtone-vue, dialtone-icons, dialtone-emojis, dialtone-mcp-server, language-server, eslint-plugin-dialtone, stylelint-plugin-dialtone, postcss-responsive-variations, combinator, dialtone-documentation

Scope must be **lowercase kebab-case**.

### 4. Resolve Jira Ticket

Find the Jira ticket in this priority order:

**a. Branch name pattern:**
```bash
git branch --show-current
```
Look for patterns like `feat/DLT-123-description` or `fix/DLT-456-some-bug`. Extract `DLT-\d+`.

**b. Recent commits on this branch:**
```bash
git log --oneline -10
```
Look for `DLT-\d+` in recent commit messages on the current branch.

**c. User input:**
If the user mentioned a Jira ticket in conversation, use it.

**d. Create a new ticket:**
If no ticket found, create one via `mcp__atlassian__createJiraIssue`:
1. First get the cloud ID: `mcp__atlassian__getAccessibleAtlassianResources`
2. Then create the issue:
   - `cloudId`: from step 1
   - `projectKey`: `"DLT"`
   - `issueTypeName`: `"Task"`
   - `summary`: derived from the changes being committed (imperative, concise)

**e. Fallback:**
If the Jira MCP tools are unavailable or fail, use `NO-JIRA`.

### 5. Compose the Message

Format: `<type>(<scope>): <jira> <subject>`

**Subject rules:**
- Imperative, present tense: "add" not "added" or "adds"
- No capital first letter
- No trailing period
- Keep the entire header line under 120 characters

**Body (optional):** For complex changes, add a body after a blank line explaining the "why".

**Footer (optional):** For breaking changes, add:
```
BREAKING CHANGE: description of what breaks and migration path
```

### 6. Stage Files

Stage only the relevant files. **Never stage:**
- `.env`, `.env.*`
- `credentials.*`, `secrets.*`, `*.local`
- `node_modules/`
- Large binary files not part of the change

Use specific file paths:
```bash
git add packages/dialtone-vue/components/tooltip/tooltip.vue
git add packages/dialtone-vue/components/tooltip/tooltip.test.js
```

**Never use** `git add -A` or `git add .`

### 7. Validate

Before committing, mentally verify the message matches the parser regex:
```
^(\w*)(?:\((.+)\))?: ((?:NO-JIRA|[A-Z]{2,}-\d+)(?: [A-Z]{2,}-\d+)*) (.+)$
```

Check:
- Type is one of the valid types
- Scope (if present) is kebab-case in parentheses
- Jira ticket is `DLT-\d+` or `NO-JIRA`
- Subject starts lowercase, no trailing period

### 8. Commit

Use a heredoc to avoid shell escaping issues:

```bash
git commit -m "$(cat <<'EOF'
feat(tooltip): DLT-123 add arrow positioning support
EOF
)"
```

For commits with body or footer:

```bash
git commit -m "$(cat <<'EOF'
feat(tooltip): DLT-123 add arrow positioning support

The tooltip now supports configurable arrow positioning
relative to the trigger element.

BREAKING CHANGE: removed the `arrowPosition` prop in favor of `arrowPlacement`
EOF
)"
```

### 9. Absolute Rules

- **NEVER** add `Co-Authored-By` lines to commit messages
- **NEVER** use `--no-verify` flag
- **NEVER** use `git add -A` or `git add .`
- **NEVER** commit files containing secrets or credentials
- **ALWAYS** stage specific files by path
- **ALWAYS** validate format before committing

## Examples

### Simple component fix
```
fix(tooltip): DLT-456 correct z-index stacking in nested popovers
```

### New feature across packages
```
feat(select-menu): DLT-789 add multi-select support
```

### Documentation-only change
```
docs(tooltip): NO-JIRA update usage examples
```

### Build system change
```
build: DLT-321 upgrade vite to v6
```

### Multiple scopes
```
fix(combobox, tooltip): DLT-123 fix focus trap when nested
```

### Breaking change
```
feat(text): DLT-2883 rename headline sizes from xxl to 2xl

BREAKING CHANGE: headline size props changed from xxl/xxxl to 2xl/3xl.
Update all usages of size="xxl" to size="2xl".
```

### Test-only change
```
test(modal): DLT-555 add keyboard navigation tests
```

### Revert
```
revert(popover): DLT-100 revert arrow offset changes

This reverts commit abc1234 which introduced positioning regressions.
```
