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

Ensures all artifacts are consistent when a Dialtone Vue component is created or significantly modified. A complete component in Dialtone requires 6 synchronized artifacts: source, tests, docs JSON, Storybook stories, VuePress page, and downstream tool data (MCP server + language server).

Memory is used to track: past pipeline results, known pre-existing test failures, recurring documentation drift patterns.

## Pipeline Steps

### 1. Verify Source

Check the component's Vue source file for correctness:

- **Props use `validator` not `validate`**: Vue silently ignores `validate:`, making it a hidden bug
- **JSDoc is complete**: All props, events, and slots have JSDoc comments with `@see` and `@values` annotations where applicable
- **Constants file exists**: A `*_constants.js` file exports all enum values for props with constrained values
- **Separation of concerns**: No business logic in templates, no inline styles, no raw color/spacing values
- **Correct API style**: New components use Composition API (`<script setup>`); existing components use Options API with `compatConfig: { MODE: 3 }`

Component source location: `packages/dialtone-vue/components/<component_name>/`

### 2. Verify Tests

Check the component's test coverage:

- **Test file exists**: `*.test.js` in the component directory
- **Props covered**: Tests verify default values and each valid value for enum props
- **Slots covered**: All named slots are rendered in at least one test
- **Events covered**: All emitted events are tested for emission and payload shape
- **Tests pass**: Run `pnpm nx run dialtone-vue:test -- --testPathPattern=<component>`

### 3. Check Redundancy

Before accepting a new component, verify it doesn't duplicate existing functionality:

- Search `common/components_list.js` for similar component names
- Check deprecated components aren't being functionally duplicated
- Verify no functional overlap with existing components (e.g., a new Card that overlaps with existing Panel)

### 4. Generate Docs JSON

Ensure the component is included in the generated documentation data:

- Run `node scripts/build-dialtone-vue-docs.mjs` (or the equivalent NX build target)
- Verify `component-documentation.json` includes the component entry
- Check all props, events, and slots from the source are reflected in the JSON output
- Verify types and default values match

### 5. Delegate to Docs Architect

Delegate documentation tasks (Storybook, VuePress, sidebar, MCP/language-server rebuild) to the `docs-architect` agent. Provide it with:
- Component name and directory path
- Summary of props, events, and slots from source verification
- Whether this is a new component or update to existing

The docs-architect handles: Storybook stories/MDX, VuePress page creation/update, sidebar navigation, and downstream tool rebuilds.

### 6. Run Full Test Suite

Run a regression check to ensure the changes don't break other components:

- `pnpm nx run dialtone-vue:test`
- Report any test failures, distinguishing between pre-existing failures and new ones

### 7. Report

Generate a summary report:

```text
## Component Pipeline Report: <ComponentName>

| Artifact                | Status | Notes               |
|------------------------|--------|---------------------|
| Source (props/events)  | PASS   |                     |
| Constants file         | PASS   |                     |
| Test file              | PASS   | 3 props untested    |
| Docs JSON              | PASS   |                     |
| Storybook stories      | PASS   | (via docs-architect)|
| VuePress page          | PASS   | (via docs-architect)|
| Sidebar navigation     | PASS   | (via docs-architect)|
| MCP server data        | PASS   | (via docs-architect)|
| Language server data   | PASS   | (via docs-architect)|
| Full test suite        | PASS   |                     |

### Manual Steps Remaining
- [ ] Visual review of Storybook stories
- [ ] Figma sync verification
- [ ] Accessibility audit
```
