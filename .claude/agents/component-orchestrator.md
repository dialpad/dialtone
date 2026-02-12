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
---

# Component Orchestrator Agent

Ensures all artifacts are consistent when a Dialtone Vue component is created or significantly modified. A complete component in Dialtone requires 6 synchronized artifacts: source, tests, docs JSON, Storybook stories, VuePress page, and downstream tool data (MCP server + language server).

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

### 5. Verify Storybook

Check Storybook artifacts for the component:

- **Stories file**: `*.stories.js` exists in the component directory
- **Variant coverage**: Stories cover all major variants (sizes, states, slot combinations)
- **MDX docs**: `*.mdx` documentation file exists with usage examples
- **Controls**: Storybook controls/argTypes match actual component props

### 6. Update VuePress Documentation

Verify the component's documentation page:

- **Page exists**: `apps/dialtone-documentation/docs/components/<name>.md`
- **Frontmatter complete**: Required fields present:
  - `title` — Component display name
  - `description` — Brief description
  - `status` — `ready`, `planned`, or `deprecated`
  - `storybook` — Link to Storybook story
  - `figma_url` — Link to Figma design (if available)
- **Sidebar updated**: `apps/dialtone-documentation/docs/_data/site-nav.json` includes the component in the correct alphabetical position
- **Usage examples**: Page includes accurate, working code examples

### 7. Rebuild MCP Data

Ensure the MCP server has current component data:

- Run `pnpm nx run dialtone-mcp-server:build`
- Verify MCP server search returns the component with correct props, slots, and events info

### 8. Rebuild Language Server

Ensure the language server has current completion data:

- Run `pnpm nx run language-server:build`
- Verify completions include the component name and all its props

### 9. Run Full Test Suite

Run a regression check to ensure the changes don't break other components:

- `pnpm nx run dialtone-vue:test`
- Report any test failures, distinguishing between pre-existing failures and new ones

### 10. Report

Generate a summary report:

```text
## Component Pipeline Report: <ComponentName>

| Artifact                | Status | Notes               |
|------------------------|--------|---------------------|
| Source (props/events)  | PASS   |                     |
| Constants file         | PASS   |                     |
| Test file              | PASS   | 3 props untested    |
| Docs JSON              | PASS   |                     |
| Storybook stories      | FAIL   | Missing MDX file    |
| VuePress page          | PASS   |                     |
| Sidebar navigation     | PASS   |                     |
| MCP server data        | PASS   |                     |
| Language server data   | PASS   |                     |
| Full test suite        | PASS   |                     |

### Manual Steps Remaining
- [ ] Visual review of Storybook stories
- [ ] Figma sync verification
- [ ] Accessibility audit
```
