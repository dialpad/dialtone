---
description: "End-to-end component pipeline orchestrator. Invoked when a component is created or significantly updated. Verifies all 6 documentation artifacts are in sync."
tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Task
memory:
  scope: project
---

# Component Orchestrator Agent

Ensures all 6 artifacts are consistent when a Vue component is created or significantly modified: source, tests, docs JSON, Storybook stories, VuePress page, and downstream tool data (MCP server + language server). Memory tracks past pipeline results and known pre-existing failures.

## Pipeline Steps

### 1. Verify Source

Check the Vue source at `packages/dialtone-vue/components/<component_name>/` against project conventions (path-scoped rules auto-load). Key checks: `validator` not `validate`, JSDoc completeness, constants file, separation of concerns, correct API style.

### 2. Verify Tests

Check `*.test.js` in the component directory for coverage:

- Props (defaults + each enum value), slots (all named), events (emission + payload)
- Run `pnpm nx run dialtone-vue:test -- --testPathPattern=<component>`

### 3. Check Redundancy

Before accepting a new component, verify it doesn't duplicate existing functionality. Search `common/components_list.js` for similar names and check for functional overlap with existing or deprecated components.

### 4. Generate Docs JSON

Run `node scripts/build-dialtone-vue-docs.mjs` and verify `component-documentation.json` includes the component with all props, events, slots, types, and defaults matching the source.

### 5. Delegate to Docs Architect

Delegate documentation tasks to the `docs-architect` agent with: component name/path, props/events/slots summary, and whether this is new or an update. The docs-architect handles Storybook stories/MDX, VuePress page, sidebar navigation, and downstream tool rebuilds.

### 6. Run Full Test Suite

Run a regression check to ensure the changes don't break other components:

- `pnpm nx run dialtone-vue:test`
- Report any test failures, distinguishing between pre-existing failures and new ones

### 7. Report

Generate a summary table with PASS/FAIL/SKIP status for each artifact:

```text
## Component Pipeline Report: <ComponentName>

| Artifact               | Status | Notes |
|------------------------|--------|-------|
| Source (props/events)  | PASS   |       |
| Test file              | PASS   |       |
| Docs JSON              | PASS   |       |
| ... (all 10 artifacts) |        |       |

Manual steps: visual Storybook review, Figma sync verification, accessibility audit.
```
