---
paths:
  - "packages/dialtone-vue/components/**"
---

# Vue Component Rules

## API Style
- **New components**: Composition API with `<script setup lang="ts">`. Use `defineProps`, `defineEmits`, `defineSlots`.
- **Existing components**: Options API with `compatConfig: { MODE: 3 }`. Do NOT convert unless explicitly asked.

## Props
- Use `validator` — NEVER `validate`. Vue silently ignores `validate` (8 known instances across 6 files).
- Import allowed values from `*_constants.js`. Never hardcode valid value arrays inline.
- Add JSDoc with `@values` annotation.
- Boolean visibility toggles: prefer `hideX` negative polarity (`hideClose`, `hideHeader`, `hideArrow`).

## Events
- `update:modelValue` for v-model.
- `update:open` for Popover, Collapsible, ImageViewer, FilterPill.
- `update:show` for Modal, Tooltip, Toast (legacy — don't change existing, use `update:open` for new).

## Slots
- Overlay components (Popover, Hovercard): `headerContent` / `footerContent`.
- Structural components (Card, Modal): `header` / `footer`.

## Sizes
- Interactive components: `xs`, `sm`, `md`, `lg`, `xl` (string).
- Icons: numeric scale `100`–`800`.
- Export from `*_constants.js`: `COMPONENT_SIZES` object + `COMPONENT_SIZE_DEFAULT`.

## Separation of Concerns
- **Template**: Presentation only. No complex expressions (extract to computed). No API calls.
- **Script**: All logic. Use composables for new reusable logic, mixins for legacy.
- **Styles**: `<style scoped>` or Dialtone utility classes (`d-*`). Reference tokens via `var(--dt-*)`. Never hardcode colors, spacing, or typography. No `!important` except in utility definitions.

## File Structure (per component directory)
- `component_name.vue` — implementation
- `component_name_constants.js` — exported constants
- `component_name.test.js` — Vitest tests
- `component_name.stories.js` — Storybook stories
- `component_name.mdx` — Storybook docs
- `index.js` — barrel export

## 6-Artifact Pipeline
When creating or updating a component, ALL must stay in sync:
1. Vue source in `packages/dialtone-vue/components/`
2. Tests (`.test.js`) using Vitest + @vue/test-utils
3. Storybook stories (`.stories.js` + `.mdx`)
4. Component docs JSON via `scripts/build-dialtone-vue-docs.mjs`
5. VuePress page in `apps/dialtone-documentation/docs/components/`
6. MCP server data via `pnpm nx run dialtone-mcp-server:build`
