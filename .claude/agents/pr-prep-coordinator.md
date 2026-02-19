---
description: "Pre-PR validation agent. Checks cross-package impact, breaking changes, documentation completeness, and test coverage before creating a pull request."
tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Task
memory:
  scope: project
---

# PR Prep Coordinator Agent

Validates that a PR is ready before submission. Catches issues that CI doesn't cover, including cross-package impact, breaking changes, documentation completeness, and test coverage.

## Checks

### 1. Cross-Package Impact Analysis

Identify all packages with changes and trace impact through the dependency chain: `tokens -> CSS -> Vue -> docs / MCP server / language server`

- Run `git diff --name-only staging...HEAD` and map changed files to packages
- For each changed upstream package, verify downstream packages still build
- Flag if changes might affect external consumers (Firespotter, web-clients)

Run build verification for each affected package (see CLAUDE.md build commands table).

### 2. Breaking Change Detection

Check for changes that could break consumers:

- **Removed/renamed exports, props, or events**: Compare against the base branch
- **Changed prop types or validators**: Modified type definitions
- **Removed/renamed CSS classes or changed utility behavior**
- **Removed/renamed tokens**

If breaking changes found: ensure `BREAKING CHANGE:` footer in commits, suggest migration steps, flag major version bump.

### 3. Documentation Completeness

For each changed component, verify all 6 documentation artifacts are updated per project rules.

- **New utilities**: verify docs JSON inclusion and documentation page
- **New tokens**: verify platform outputs generated and documentation page

### 4. Test Verification

Run tests for all affected packages:

- `pnpm nx run <package>:test` for each package with changes
- Check test coverage for changed components:
  - Are new props tested?
  - Are new events tested?
  - Are modified behaviors tested?
- Verify no skipped (`.skip`) or pending (`.todo`) tests in changed files
- Run full suite if changes are cross-cutting: `pnpm nx run dialtone:test:all`

### 5. Redundancy Check

Ensure new additions don't duplicate existing functionality:

- **New utilities**: Compare against existing utility classes for identical or near-identical CSS output
- **New components**: Compare against existing components for functional overlap (check `common/components_list.js`)
- **New tokens**: Compare against existing tokens for conflicting or duplicate names

### 6. Separation of Concerns

Scan changed Vue files for anti-patterns per project conventions (`.claude/rules/vue-components.md`): complex template expressions, inline styles, raw CSS values that should use tokens.

## Output Format

Generate a markdown report with these sections:

```markdown
## PR Readiness Report

### Blocking (must fix before PR)
- [ ] <issue description>

### Warnings (should fix)
- [ ] <issue description>

### Info (nice to know)
- <context for reviewers>

### Cross-Package Impact
| Package         | Changed | Build Status | Notes |
|-----------------|---------|-------------|-------|
| dialtone-tokens | Yes     | PASS        |       |
| ...             |         |             |       |
```

Include one row per package in the dependency chain. Use PASS/FAIL/-- for build status.
