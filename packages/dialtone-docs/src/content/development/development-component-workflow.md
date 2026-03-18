---
type: development
category: development
keywords: [vue-component, yeoman, generator, dialtone-vue, storybook, vitest, props, slots, events, jsdoc, constants, recipe]
ai_summary: How to create a new Vue component in dialtone-vue using the Yeoman generator, what files are created, and the manual steps required after generation.
last_updated: 2026-03-04
related_packages: [dialtone-vue, dialtone-css]
---

# Component Development Workflow

This document covers the full lifecycle of creating a new Vue component in `packages/dialtone-vue` — from scaffolding with the Yeoman generator through documentation and export.

## What Lives in a Component

Each component lives in its own directory under `packages/dialtone-vue/components/`. A complete component has exactly 8 files:

```
components/button/
├── button.vue                   # Component template + logic (Options API)
├── button_constants.js          # Exported constants for prop values and CSS class maps
├── button.test.js               # Vitest tests
├── button.stories.js            # Storybook CSF3 configuration and controls
├── button_default.story.vue     # Interactive default story template
├── button_variants.story.vue    # Variants overview story template
├── button.mdx                   # Storybook documentation page
└── index.js                     # Barrel export for the component and its constants
```

Recipe components (built from other Dialtone components) follow the same structure but live under `recipes/{category}/` instead of `components/`.

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Component class name | PascalCase, `Dt` prefix | `DtButton` |
| Recipe component class name | PascalCase, `DtRecipe` prefix | `DtRecipeCallbarButton` |
| Directory and file names | snake_case, no prefix | `button/`, `button.vue` |
| Template tag | kebab-case, `dt-` prefix | `<dt-button>` |
| CSS base class | `d-{name}` | `d-btn` |
| CSS modifier class | `d-{name}--{variant}` | `d-btn--primary`, `d-btn--lg` |
| CSS element class | `d-{name}__{element}` | `d-btn__icon` |
| Constants objects | `{COMPONENT}_{CATEGORY}_MODIFIERS` | `BUTTON_SIZE_MODIFIERS` |

## Step 1 — Generate the Component

Run the Yeoman generator from inside the `dialtone-vue` package directory:

```bash
cd packages/dialtone-vue
pnpm exec yo dialtone
```

The generator asks:
1. **Is this a recipe?** — A recipe is a compound component built from other Dialtone components. Regular components answer No.
2. **Category** (recipes only) — The sub-folder under `recipes/` (e.g., `Buttons`, `Inputs`, or a custom name).
3. **Component name** (PascalCase) — Must start with `Dt` (e.g., `DtMyNewComponent`) or `DtRecipe` for recipes.
4. **Human-readable name** — Used in Storybook labels (e.g., `My New Component`).

The generator creates all 8 files with boilerplate already in place: an empty `.vue`, an empty `_constants.js`, a test scaffold, Storybook config, two story templates, MDX docs, and the `index.js` barrel.

## Step 2 — Add to Root Index (Manual)

After generation, add one line to `packages/dialtone-vue/index.js`:

```javascript
export * from './components/my-new-component';
```

This is the **only manual step** the generator does not handle. Without it, the component will not be available to consumers of `@dialpad/dialtone-vue`.

## Component Structure (Options API)

All Dialtone Vue components use the Options API. The canonical structure is:

```javascript
export default {
  compatConfig: { MODE: 3 },  // Vue 3 compatibility flag

  name: 'DtButton',           // PascalCase

  components: {},             // Child components used in template

  mixins: [],                 // Shared behavior (InputMixin, CheckableMixin, etc.)

  inheritAttrs: false,        // Set false when manually binding $attrs

  props: { /* ... */ },

  emits: [ /* ... */ ],

  data () {
    return { /* reactive state */ };
  },

  computed: { /* derived state */ },

  watch: { /* watchers */ },

  mounted () { /* lifecycle */ },

  methods: { /* instance methods */ },
};
```

## Documenting Props (JSDoc)

Every prop must have a JSDoc comment. Tags supported:

```javascript
props: {
  /**
   * The visual importance of the button.
   * @values clear, outlined, primary
   */
  importance: {
    type: String,
    default: 'primary',
    validator: (v) => Object.keys(BUTTON_IMPORTANCE_MODIFIERS).includes(v),
  },

  /**
   * Size of the button.
   * @values xs, sm, md, lg, xl
   */
  size: {
    type: String,
    default: 'md',
  },

  /**
   * @deprecated Use `importance` instead.
   */
  type: String,
}
```

Supported JSDoc tags:
- `@values` — comma-separated list of valid values (rendered in API table)
- `@deprecated` — marks the prop deprecated, shows suggested alternative
- `@default` — explicit default when the prop default is computed
- `@see ComponentName` — reference to a related component

## Documenting Slots

Use inline HTML comments in the template:

```vue
<template>
  <!-- @slot Default content inside the button -->
  <slot />

  <!-- @slot Optional icon, receives { iconSize } -->
  <slot name="icon" :icon-size="iconSize" />
</template>
```

## Documenting Events

Document events inline in the `emits` array:

```javascript
emits: [
  /**
   * Native focusin event
   * @event focusin
   * @type {FocusEvent}
   */
  'focusin',

  /**
   * Sync modelValue with parent
   * @event update:modelValue
   * @type {String}
   */
  'update:modelValue',
],
```

## Constants File

`button_constants.js` holds all valid value maps so validators and templates can reference them without hardcoded strings:

```javascript
export const BUTTON_SIZE_MODIFIERS = {
  xs: 'd-btn--xs',
  sm: 'd-btn--sm',
  md: '',           // Default — no modifier class
  lg: 'd-btn--lg',
  xl: 'd-btn--xl',
};

export const BUTTON_IMPORTANCE_MODIFIERS = {
  clear: '',
  outlined: 'd-btn--outlined',
  primary: 'd-btn--primary',
};
```

Validators in the component use these objects:

```javascript
validator: (v) => Object.keys(BUTTON_SIZE_MODIFIERS).includes(v)
```

The constants are re-exported through `index.js` so consumers can import them alongside the component:

```javascript
// index.js
export { default as DtButton } from './button.vue';
export { BUTTON_SIZE_MODIFIERS, BUTTON_IMPORTANCE_MODIFIERS } from './button_constants.js';
```

## data-qa Attributes

Every meaningful DOM element must have a `data-qa` attribute. This is required for test selectors and for downstream teams automating against the component:

```vue
<button data-qa="dt-button">
  <span data-qa="dt-button-icon"></span>
  <span data-qa="dt-button-label"></span>
</button>
```

Tests query by `data-qa` rather than CSS classes so they remain stable if classes change:

```javascript
button = wrapper.find('[data-qa="dt-button"]');
icon   = wrapper.find('[data-qa="dt-button-icon"]');
```

## Storybook Stories

Stories use CSF3 format. The `button.stories.js` file defines metadata, controls, and story references. Actual story templates live in the two `.story.vue` files.

`argsData` sets default prop values for interactive controls. `argTypesData` defines what controls appear in the Storybook panel:

```javascript
export const argTypesData = {
  // Props
  size: { control: 'select', options: Object.keys(BUTTON_SIZE_MODIFIERS) },

  // Slots
  default: { table: { type: { summary: 'VNode' } }, control: { type: 'text' } },

  // Events — disable duplicates that Vue emits
  onClick: { table: { disable: true } },
};
```

## Build and Test

```bash
# Run all tests for dialtone-vue
pnpm nx run dialtone-vue:test

# Watch mode during development
cd packages/dialtone-vue && pnpm test:watch

# Build (also generates component-documentation.json)
pnpm nx run dialtone-vue:build
```

The build runs two commands sequentially: Vite compiles components to `dist/`, then `scripts/build-dialtone-vue-docs.mjs` runs `vue-docgen-api` to extract JSDoc into `dist/component-documentation.json`. That JSON file is what the public documentation site uses for the API reference tables.
