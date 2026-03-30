---
type: workflow
category: workflows
keywords: [conventional-commits, commitlint, semantic-release, commit-format, jira, breaking-change, version-bump, scope, angular-preset]
ai_summary: Dialtone commit format rules — type, optional scope, required JIRA ID, and how each type maps to a semantic version bump in the release pipeline.
last_updated: 2026-03-04
related_packages: []
---

# Conventional Commits

Dialtone enforces a specific commit message format via `commitlint`. The format drives automated changelog generation and version bump decisions in `semantic-release`. Every commit that goes into `staging` must follow this format — it is validated on PR title by the `lint-pr.yml` CI workflow.

## Commit Format

```
<type>(<scope>): <JIRA> <subject>
```

Full message structure:

```
<type>(<scope>): <JIRA> <subject>

<body — optional>

<footer — optional>
```

**Parts:**
- `type` — Required. One of 11 allowed types (see below).
- `scope` — Optional. Kebab-case. Narrows what area of the codebase the commit touches.
- `JIRA` — Required. Either a Jira ticket ID (`DLT-123`, `DP-555`) or `NO-JIRA` for changes without a ticket. Multiple tickets allowed, space-separated.
- `subject` — Required. Short description in imperative mood, no period at end.

Maximum header length: 120 characters.

## Examples

```
feat(button): DLT-1234 add loading spinner prop
fix(combobox): DLT-5678 fix keyboard navigation on blur
docs: NO-JIRA update getting started guide
refactor(input, checkbox): DLT-9012 extract shared validation mixin
chore: NO-JIRA upgrade vitest to v2
```

## Allowed Types

| Type | Description | Triggers Release |
|------|-------------|-----------------|
| `feat` | New feature for the user | Yes — **minor** |
| `fix` | Bug fix for the user | Yes — **patch** |
| `perf` | Performance improvement | Yes — **patch** |
| `refactor` | Code change that is not a feature or bug fix | Yes — **patch** |
| `build` | Changes to the build system or external dependencies | No* |
| `chore` | Maintenance work that doesn't fit other types | No* |
| `ci` | CI configuration changes | No* |
| `docs` | Documentation only changes | No* |
| `style` | Whitespace, formatting, missing semicolons (no logic change) | No* |
| `test` | Adding or updating tests | No* |
| `revert` | Reverts a previous commit | No* |

*Exception: `dialtone-icons` and `dialtone-emojis` also trigger a **patch** release for `build`, `chore`, `ci`, `docs`, `style`, and `test` types. This covers icon additions that arrive via non-`feat` commits.

Any commit type triggers a **major** release if the footer contains `BREAKING CHANGE:`.

## Scope

Scope is optional but recommended for component changes. It narrows the changelog entry:

- Must be kebab-case: `button`, `select-menu`, `combobox-with-popover`
- Multiple scopes are comma-separated: `fix(combobox, combobox-with-popover): DLT-123 fix keyboard event`
- In the generated changelog, scopes appear as Title Case: `Combobox With Popover`

For package-level changes (build config, tokens, tooling), omitting the scope is fine.

## JIRA Requirement

The JIRA field is enforced by a custom `jira-empty` commitlint rule. The parser expects it at a specific position in the header (between the colon and the subject):

```
type(scope): DLT-123 subject text here
             ^^^^^^^
```

Valid formats:
- `DLT-123` — single ticket
- `DP-555` — different project prefix
- `DLT-123 DP-555` — multiple tickets, space-separated
- `NO-JIRA` — explicitly no ticket

The JIRA validator pattern: `/^(NO-JIRA|[A-Z]{2,}-\d+)(?: [A-Z]{2,}-\d+)*/`

## Breaking Changes

A breaking change forces a **major** version bump regardless of the commit type. Declare it in the footer with an empty line before:

```
feat(tokens): DLT-9999 rename color token categories

BREAKING CHANGE: all --dt-color-* tokens have been renamed.
Replace --dt-color-foreground-* with --dt-color-text-*.
```

The `BREAKING CHANGE:` keyword must be at the start of the footer line (case-sensitive). Everything after the colon is included in the changelog as the breaking change description.

## PR Title Validation

The `lint-pr.yml` workflow validates the PR title (not every individual commit message) against the commit format:

```bash
pnpm commitlint --verbose << EOF
${{ github.event.pull_request.title }}
EOF
```

This means squash-merging a PR produces one commit whose message is the PR title — so getting the PR title right is what matters for the changelog and version bump.

## How Version Bumps Are Determined

`@dialpad/conventional-changelog-angular` (a fork of the standard Angular preset) decides version bumps by scanning all commits since the last tag:

1. Any commit with `BREAKING CHANGE:` in the footer → **major** (level 0)
2. Any `feat` commit (no breaking change) → **minor** (level 1)
3. Any `fix`, `perf`, or `refactor` commit → **patch** (level 2)
4. Only non-releasing types present → **no release**

The highest level wins. One `feat` and five `fix` commits → minor bump.

## @dialpad/conventional-changelog-angular

This is a Dialpad fork of `conventional-changelog-angular` v5.0.13. Key customizations:

- **Scope formatting** — Kebab-case scopes are converted to Title Case in release notes: `select-menu` → `Select Menu`
- **Additional types in changelog** — `docs` and `refactor` appear in the generated changelog (the standard Angular preset omits them)
- **Changelog sections:**
  - `feat` → Features
  - `fix` → Bug Fixes
  - `perf` → Performance Improvements
  - `refactor` → Code Refactoring
  - `docs` → Documentation
  - `revert` → Reverts

## commitlint Configuration

File: `commitlint.config.cjs` at the repo root.

```javascript
extends: ['@commitlint/config-conventional']
parserPreset: './parser-preset.cjs'   // Custom parser with JIRA extraction
rules: {
  'type-enum': [2, 'always', [
    'build', 'chore', 'ci', 'docs', 'feat', 'fix',
    'perf', 'refactor', 'revert', 'style', 'test'
  ]],
  'scope-case': [2, 'always', 'kebab-case'],
  'header-max-length': [2, 'always', 120],
  'jira-empty': [2, 'always'],           // Custom rule: JIRA ID required
}
```

The custom parser (`parser-preset.cjs`) uses this regex to extract the JIRA field from the header:

```
/^(\w*)(?:\((.+)\))?: ((?:NO-JIRA|[A-Z]{2,}-\d+)(?: [A-Z]{2,}-\d+)*) (.+)$/
```

Groups: `[type, scope, jira, subject]`
