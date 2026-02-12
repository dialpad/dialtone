---
description: "Component creation and update pipeline. Use '/component create <name>' to scaffold a new component, or '/component update <name>' when modifying existing components. Also auto-activated when working on Vue components."
---

# Component Skill

## Creating a New Component (`/component create <name>`)

### 1. Check for Conflicts

Before scaffolding, verify the component name is available:

- Search `common/components_list.js` for existing entries with the same or similar name
- Search `packages/dialtone-vue/components/` for directory name collisions
- If a similar component exists, confirm with the user whether to extend it or create a new one

### 2. Scaffold Component Files

New components use **Composition API** with `<script setup lang="ts">`. Create the following files under `packages/dialtone-vue/components/<name>/`:

#### `<name>.vue` — Component Implementation

```vue
<template>
  <!-- Template with proper ARIA attributes and keyboard navigation -->
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DT_<NAME>_SIZE_MODIFIERS,
  DT_<NAME>_KINDS,
} from './<name>_constants';

/**
 * Dt<Name> — Brief description of the component.
 * @see https://dialtone.dialpad.com/components/<name>/
 */

const props = withDefaults(defineProps<{
  /** Description of prop */
  size?: string;
}>(), {
  size: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void;
}>();
</script>
```

#### `<name>_constants.js` — Constants

Export all size modifiers, variant kinds, and validation arrays. These are imported by the component and by tests/stories.

#### `<name>.test.js` — Vitest Tests

Use `@vue/test-utils` with `mount`. Cover:

- Default rendering
- All prop variants
- Event emissions
- Slot rendering
- Accessibility (ARIA attributes present)

#### `<name>.stories.js` — Storybook Stories

Create stories for each variant/size combination. Include controls for interactive props.

#### `<name>.mdx` — Storybook Docs

MDX documentation page with usage examples and API table.

#### `index.js` — Barrel Export

```js
export { default as Dt<Name> } from './<name>.vue';
export * from './<name>_constants';
```

### 3. Update Barrel Exports

- Add export to `packages/dialtone-vue/index.js`
- Add component entry to `common/components_list.js`

### 4. CSS Styles

If the component needs custom styles:

- Create styles in `packages/dialtone-css/` using design tokens (`var(--dt-*)`)
- Never use raw color/spacing values

### 5. Documentation

- Create a VuePress documentation page under `apps/dialtone-documentation/docs/components/<name>.md`
- Update sidebar navigation in `apps/dialtone-documentation/docs/_data/site-nav.json`

### 6. Verification

- Run tests: `pnpm nx run dialtone-vue:test -- --filter <name>`
- Build Vue package: `pnpm nx run dialtone-vue:build`
- Rebuild docs JSON: run `scripts/build-dialtone-vue-docs.mjs`
- Rebuild MCP data: `pnpm nx run dialtone-mcp-server:build`

---

## Updating an Existing Component (`/component update <name>`)

When modifying an existing component, verify the full pipeline:

### 1. Verify Source Changes

- Read the existing component file before making changes
- Verify props, events, and slots follow project conventions (auto-loaded via path-scoped rules)
- Update JSDoc comments for any changed/added props or events
- Update constants file if new variants/sizes are added

### 2. Update Tests

- Add test cases for new/changed props, events, and slots
- Run existing tests to verify no regressions: `pnpm nx run dialtone-vue:test -- --filter <name>`

### 3. Update Storybook

- Add stories for new variants and controls for new props
- Update `.mdx` docs if API surface changed

### 4. Update Documentation

- Update VuePress page under `apps/dialtone-documentation/docs/components/<name>.md`
- Ensure prop tables, event descriptions, and slot docs are current

### 5. Rebuild Pipeline

- Rebuild docs JSON: `scripts/build-dialtone-vue-docs.mjs`
- Rebuild MCP data: `pnpm nx run dialtone-mcp-server:build`
- Run full test suite: `pnpm nx run dialtone-vue:test`

---

## Common Checks (Both Create and Update)

Follow all Vue conventions per project rules (path-scoped rules auto-load when editing component files). Key verification points:

- Props use `validator` not `validate`
- Constants exported and imported (no hardcoded strings)
- ARIA attributes, keyboard navigation, focus management
- Component name follows `Dt<PascalCase>` convention
