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

New components use **Composition API** with `<script setup lang="ts">`, `defineProps`, `defineEmits`, and `withDefaults`. See path-scoped rules for conventions. Create the following files under `packages/dialtone-vue/components/<name>/`:

- **`<name>.vue`** — Component implementation (Composition API, ARIA attributes, keyboard navigation)
- **`<name>_constants.js`** — Exported size modifiers, variant kinds, validation arrays (imported by component, tests, stories)
- **`<name>.test.js`** — Vitest + `@vue/test-utils` tests (rendering, props, events, slots, a11y)
- **`<name>.stories.js`** — Storybook stories for variant/size combinations with interactive controls
- **`<name>.mdx`** — MDX documentation page with usage examples and API table
- **`index.js`** — Barrel export:

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

Follow steps 2-6 from create flow above, with these additions:

- Read the existing component **before** making changes
- Update JSDoc comments and constants file for any changed/added props, events, or sizes
- Add test cases for new/changed behavior; run existing tests for regressions
- Update Storybook stories/MDX and VuePress docs if API surface changed

---

## Common Checks

Path-scoped rules auto-load when editing component files. Key verification points:

- Props use `validator` not `validate`
- Constants exported and imported (no hardcoded strings)
- ARIA attributes, keyboard navigation, focus management
