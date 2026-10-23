---
type: development
category: development
keywords: [vue-component, yeoman, generator, dialtone-vue, storybook, vitest, props, slots, events, jsdoc, constants]
ai_summary: Current Vue component files, legacy generator limitations, source-owned API conventions, and export and build steps.
last_updated: 2026-10-23
related_packages: [dialtone-vue, dialtone-css]
---

# Component Development Workflow

This reference explains component files, scaffolding and export/build steps in `packages/dialtone-vue`. Follow the [current Vue requirements](../../../../../.agents/resources/rules/vue-components.md) for authoring policy and the component source for its API. The generator output described below is legacy scaffolding, not the current component contract.

## What Lives in a Component

Follow the existing component directory's layout and casing. Button illustrates PascalCase implementation, constants and story filenames without the `Dt` prefix; helper and module filenames can differ:

```text
components/Button/
├── Button.vue
├── ButtonConstants.js
├── Button.test.js
├── Button.stories.js
├── ButtonDefault.story.vue
├── ButtonVariants.story.vue
└── index.js
```

This is an example, not a fixed artifact count. Constants, extra stories, MDX, helper files, modules and composables depend on the component. Preserve existing helper and module names or casing. Review the current artifact requirements when adding or changing a public API; an optional MDX file does not make documentation optional.

## Naming Conventions

| Thing | Convention | Example |
| ---------------------------- | ---------------------------------- | ---------------------------------- |
| Component class name | PascalCase, `Dt` prefix | `DtButton` |
| Directory | PascalCase, no prefix | `Button/` |
| Implementation and constants | PascalCase, no `Dt` prefix | `Button.vue`, `ButtonConstants.js` |
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
1. **Component name** (PascalCase) — Must start with `Dt` (e.g., `DtMyNewComponent`).
2. **Human-readable name** — Used in Storybook labels (e.g., `My New Component`).

The [current Vue 3 generator](../../../../../generator-dialtone/generators/vue3/index.js) creates eight snake_case files, including MDX and an Options API implementation. Its [component template](../../../../../generator-dialtone/generators/vue3/templates/component.ejs) does not implement the current new-component conventions. Treat it as a legacy starting point: rename the generated directory/files and update imports, replace the new implementation with the required Composition API structure, and review the artifacts before committing. Do not apply that conversion to existing Options API components without explicit authorization.

## Step 2 — Add to Root Index (Manual)

After generation, add one line to `packages/dialtone-vue/index.js`:

```javascript
export * from './components/MyNewComponent';
```

Without the root export, the component is not available to consumers of `@dialpad/dialtone-vue`. Generation also does not complete the required API, styles, tests, public documentation, Combinator or thumbnail work. Use the [component workflow](../../../../../.agents/skills/component-work/SKILL.md#workflow) to review affected artifacts rather than treating a successful scaffold as a finished component.

## API Style

New components use Composition API with `<script setup lang="ts">` under the current Vue requirements. Existing Options API components retain their style unless conversion is explicitly requested. The following illustrates an existing Options API component, not a new-component scaffold:

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
   * @values 100, 200, 300, 400, 500
   */
  size: {
    type: [String, Number],
    default: 300,
    validator: ordinalSizeValidator(BUTTON_SIZE_MODIFIERS),
  },

}
```

This Options API excerpt uses Button's current constants and `ordinalSizeValidator` from [the shared validators](../../../../dialtone-vue/common/validators/index.js). Import those helpers when using the excerpt. Numeric size values are preferred; inspect the selected component before assuming a common scale or default.

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

Use the component's current constants and validators instead of copying a value map from this reference. [ButtonConstants.js](../../../../dialtone-vue/components/Button/ButtonConstants.js) contains Button's modifier maps and deprecated aliases; [Button.vue](../../../../dialtone-vue/components/Button/Button.vue) selects its numeric default and ordinal validator. The shared scale is defined in [sizes.js](../../../../dialtone-vue/common/constants/sizes.js), but each component decides which values it accepts.

Keep local imports and the component's `index.js` exports aligned when renaming or adding files. Only export the constants intended to be public; use the existing barrel as the reference.

## data-qa Attributes

Add `data-qa` to important elements for QA and automation, following the [Vue contributing guidance](../../../../dialtone-vue/.github/CONTRIBUTING.md#data-qa-attributes). Use the existing testing rules to choose stable selectors. A Button selector example is:

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

Stories use CSF3 format. The `Button.stories.js` file defines metadata, controls, and story references. Story templates live in the component's `.story.vue` files; their number varies.

`argsData` sets default prop values for interactive controls. `argTypesData` defines what controls appear in the Storybook panel:

Use the current [Button stories](../../../../dialtone-vue/components/Button/Button.stories.js) as the control example. Button's size control currently lists all keys in `BUTTON_SIZE_MODIFIERS`, including deprecated aliases.

## Build and Test

```bash
# Run all tests for dialtone-vue
pnpm nx run dialtone-vue:test

# Watch mode during development
cd packages/dialtone-vue && pnpm test:watch

# Build (also generates component-documentation.json)
pnpm nx run dialtone-vue:build
```

The current [Vue build target](../../../../dialtone-vue/project.json) compiles components and runs `scripts/build-dialtone-vue-docs.mjs` to extract API documentation into `dist/component-documentation.json`. Generated output does not replace the authored public page, stories or API source.
