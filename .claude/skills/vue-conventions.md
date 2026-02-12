---
description: "Vue component conventions for Dialtone. Auto-activated when working with .vue files. Covers Composition API for new components, Options API patterns for existing, and all naming conventions."
---

# Vue Component Conventions for Dialtone

## New Components (Composition API)

All new components MUST use the Composition API with TypeScript:

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { COMPONENT_SIZE_DEFAULT, COMPONENT_SIZES } from './component_name_constants.js';

const props = defineProps<{
  /** The size of the component. @values xs, sm, md, lg, xl */
  size?: string;
  /** Whether the close button is hidden */
  hideClose?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:open', value: boolean): void;
}>();

defineSlots<{
  default(props: {}): any;
  headerContent(props: {}): any;
  footerContent(props: {}): any;
}>();

// Only use defineExpose when parent components need direct access
// defineExpose({ publicMethod });
</script>
```

- Use `ref()`, `computed()`, `watch()` from vue for reactivity.
- Use **composables** for reusable logic (not mixins). Place composables in `composables/` directory.
- File structure for each component directory:
  - `component_name.vue` — the component
  - `component_name_constants.js` — exported constants (sizes, variants, etc.)
  - `component_name.stories.js` — Storybook stories
  - `component_name.test.js` — Vitest unit tests
  - `component_name.mdx` — documentation
  - `index.js` — barrel export

## Existing Components (Options API)

When modifying existing components, preserve the Options API pattern:

- **Keep `compatConfig: { MODE: 3 }`** — this is required for the Vue 2/3 compatibility layer. Do not remove it.
- Do NOT convert Options API components to Composition API unless explicitly asked.
- Standard sections in order: `name`, `compatConfig`, `components`, `mixins`, `props`, `emits`, `data()`, `computed`, `watch`, `methods`, lifecycle hooks.
- Shared input behavior comes from mixins in `common/mixins/input.js`: `InputMixin`, `CheckableMixin`, `GroupableMixin`, `MessagesMixin`.

## Props Convention

### Validator Function

Use `validator` (NEVER `validate`). Vue silently ignores `validate` — this is a known bug in the codebase with 8 existing instances across 6 files. Always double-check spelling.

```javascript
// CORRECT
size: {
  type: String,
  default: COMPONENT_SIZE_DEFAULT,
  validator: (s) => Object.values(COMPONENT_SIZES).includes(s),
},

// WRONG — Vue silently ignores this
size: {
  type: String,
  default: COMPONENT_SIZE_DEFAULT,
  validate: (s) => Object.values(COMPONENT_SIZES).includes(s),  // BUG!
},
```

### Naming and Documentation

- Import allowed values from `*_constants.js` files. Never hardcode arrays of valid values inline.
- Use JSDoc with `@values` annotation listing valid values.
- Default values should be sensible (usually the smallest or most common variant).
- Boolean props: prefer the `hideX` negative polarity pattern for visibility toggles (e.g., `hideClose`, `hideHeader`, `hideArrow`).

## Events Convention

- `update:modelValue` — for v-model binding (standard Vue pattern).
- `update:open` — used by Popover, Collapsible, ImageViewer, FilterPill for open/close state.
- `update:show` — used by Modal, Tooltip, Toast. This is a **legacy inconsistency**. Do not change existing `update:show` events to `update:open`. New overlay components should use `update:open`.
- Always document events with JSDoc or `defineEmits` type signatures.
- Event payloads should be minimal and typed.

## Slots Convention

- **Overlay components** (Popover, Hovercard): use `headerContent` / `footerContent` slot names.
- **Structural components** (Card, Modal): use `header` / `footer` slot names.
- `default` slot for primary content area.
- Document slots with `defineSlots` in Composition API or JSDoc comments in Options API.
- Prefer named slots over overly complex scoped slot payloads.

## Sizes Convention

- **Interactive components** (Button, Input, Badge, etc.): use string sizes `xs`, `sm`, `md`, `lg`, `xl`.
- **Icon sizes**: use numeric scale `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`.
- Always import size constants from the component's `*_constants.js` file.
- Define both the individual values and a default:

  ```javascript
  export const COMPONENT_SIZES = { XS: 'xs', SM: 'sm', MD: 'md', LG: 'lg', XL: 'xl' };
  export const COMPONENT_SIZE_DEFAULT = COMPONENT_SIZES.MD;
  ```
