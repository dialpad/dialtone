---
paths:
  - "packages/dialtone-vue/components/**"
---

# Vue Component Rules

## API Style

- **New components**: Composition API with `<script setup>`. Use `defineProps`, `defineEmits`, `defineSlots`.

- **Existing components**: Options API with `compatConfig: { MODE: 3 }`. Do NOT convert unless explicitly asked.

## Props

- Use `validator` — NEVER `validate`. Vue silently ignores `validate`.
- Import allowed values from `*_constants.js`. Never hardcode valid value arrays inline.
- Add JSDoc with `@values` annotation.
- Boolean visibility toggles: use positive polarity (`showClose`, `showHeader`, `showArrow`). Never use negative names (`hideX`, `preventX`, `skipX`).

## Events

- Use `modelValue` / `update:modelValue` for the v-model prop and emitted event
  contract. In Vue templates, follow the existing linted listener spelling,
  for example `@update:model-value`.
- `update:open` for Modal, Tooltip, Toast, Popover, Collapsible, ImageViewer, FilterPill.

## Slots

- Overlay components (Popover, Hovercard): `headerContent` / `footerContent`.
- Structural components (Card, Modal): `header` / `footer`.
- Every named slot must have a corresponding `{slotName}Class` prop; default-slot wrappers use semantic class prop names (not `defaultClass`). See `.claude/rules/slot-class-props.md` for full convention, prop shape, and exceptions.

## Sizes

- All component size props use a numeric ordinal scale: `100` (xs), `200` (sm), `300` (md), `400` (lg), `500` (xl).
- Prop type: `[String, Number]`. Default: numeric (e.g., `default: 300`).
- T-shirt aliases (`xs`, `sm`, `md`, `lg`, `xl`) remain in constants for backward compat but are deprecated.
- `@values` JSDoc: list numeric only (e.g., `@values 100, 200, 300, 400, 500`). Do not list t-shirt aliases.
- Text headline extends the scale: `500` (xl), `600` (2xl), `700` (3xl).
- Icons: separate numeric scale `100`–`800` (unchanged, do not modify).
- Shared scale definition: `packages/dialtone-vue/common/constants/sizes.js`.
- Export from `*_constants.js`: `COMPONENT_SIZE_MODIFIERS` object with both numeric and t-shirt keys.

## Separation of Concerns

- **Template**: Presentation only. No complex expressions (extract to computed). No API calls.
- **Script**: All logic. Use composables for new reusable logic, mixins for legacy.
- **Styles**: Component styles live in `packages/dialtone-css/lib/build/less/components/{component-name}.less`. Use Dialtone utility classes (`d-*`) in templates. Reference tokens via `var(--dt-*)`. Never hardcode colors, spacing, or typography.

## File Structure (per component directory)

- `component_name.vue` — implementation
- `component_name_constants.js` — exported constants
- `component_name.test.js` — Vitest tests
- `component_name.stories.js` — Storybook stories
- `component_name.mdx` — Storybook docs
- `index.js` — barrel export
- `utils.js` — utility/helper functions (optional)
- `validators.js` — prop/value validators (optional)
- `modules/` — sub-components for complex components (optional, e.g. emoji_picker, datepicker)
- `composables/` — composition functions (optional, e.g. `useCalendar.js`, `useKeyboardNavigation.js`)

## Artifact Pipeline

The root `CLAUDE.md` Documentation Pipeline is the canonical, complete list (it also covers the component-wall thumbnail and public docs JSON). The artifacts below are the ones you touch most when editing a component, and all must stay in sync:

1. Vue source in `packages/dialtone-vue/components/`
2. Tests (`.test.js`) using Vitest + @vue/test-utils
3. Storybook stories (`.stories.js` + `.mdx`)
4. Component docs JSON via `scripts/build-dialtone-vue-docs.mjs`
5. VuePress page in `apps/dialtone-documentation/docs/components/`
6. MCP server data via `pnpm nx run dialtone-mcp-server:build`
7. Combinator variant file in `packages/combinator/src/variants/variants_<component>.js`, registration in `variants.js`, and unsupported status in `unsupported_components.json`. Required when props, slots, valid values, or visual defaults change. See `.claude/rules/combinator-variants.md`.
