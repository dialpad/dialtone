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

Identify all packages with changes and trace impact through the dependency chain:

```text
tokens → CSS → Vue → docs / MCP server / language server
```

Steps:

- Run `git diff --name-only staging...HEAD` to identify changed files
- Map each changed file to its package
- For each changed upstream package, verify downstream packages still build:
  - If tokens changed: rebuild CSS, check Vue components using affected tokens
  - If CSS changed: check Vue components using affected utilities
  - If Vue changed: check docs, MCP server, language server
- Flag if changes might affect external consumers (Firespotter, web-clients)

Build verification commands:

- Tokens: `pnpm nx run dialtone-tokens:build`
- CSS: `pnpm nx run dialtone-css:build`
- Vue: `pnpm nx run dialtone-vue:build`
- MCP: `pnpm nx run dialtone-mcp-server:build`
- Language server: `pnpm nx run language-server:build`

### 2. Breaking Change Detection

Check for changes that could break consumers:

- **Removed/renamed exports**: Compare export statements in changed files against the base branch
- **Changed prop types**: Props with modified type definitions or validators
- **Removed props**: Props that existed in the base branch but are gone
- **Renamed events**: Emitted event names that changed
- **Removed CSS classes**: Utility classes that were removed or renamed
- **Changed utility behavior**: Classes whose CSS output changed
- **Removed/renamed tokens**: Token names that changed or were removed

If breaking changes are found:

- Ensure commit messages include `BREAKING CHANGE:` in the footer
- Suggest migration steps for consumers
- Flag whether the change requires a major version bump

### 3. Documentation Completeness

For each changed component, verify all 6 artifacts are updated:

1. Source file (props, events, slots)
2. Test file (coverage for changes)
3. `component-documentation.json` (regenerated)
4. Storybook stories (updated for new props/variants)
5. VuePress documentation page (updated examples)
6. Sidebar navigation (`site-nav.json` if new pages added)

For new utilities:

- Verify the utility is included in docs JSON
- Check that documentation page exists or is updated

For new tokens:

- Verify platform outputs are generated (CSS, Less, JS, etc.)
- Check documentation page exists or is updated

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

Generate a markdown report:

```markdown
## PR Readiness Report

### Blocking (must fix before PR)
Issues that will cause CI failures or break consumers:
- [ ] Broken tests in `packages/dialtone-vue/`
- [ ] Build failure in downstream package
- [ ] Missing `BREAKING CHANGE:` footer for breaking changes
- [ ] Removed exports without deprecation

### Warnings (should fix)
Issues that won't block CI but indicate quality gaps:
- [ ] Missing documentation for new prop `headerIcon`
- [ ] Test coverage gap: `onClose` event not tested
- [ ] Naming inconsistency: using `show` instead of `open`

### Info (nice to know)
Context for reviewers:
- Changes affect 3 packages: tokens, CSS, Vue
- Downstream impact: MCP server data may need rebuild
- Similar utility `d-mx-auto` already exists — verify `d-m-auto` is intentionally different

### Cross-Package Impact
| Package           | Changed | Build Status | Notes          |
|-------------------|---------|-------------|----------------|
| dialtone-tokens   | Yes     | PASS        |                |
| dialtone-css      | No      | PASS        | Rebuilt OK     |
| dialtone-vue      | Yes     | PASS        |                |
| docs              | No      | —           | Needs update   |
| MCP server        | No      | —           | Needs rebuild  |
| language-server   | No      | —           | Needs rebuild  |
```
