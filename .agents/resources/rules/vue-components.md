# Vue Component Rules

Apply to `packages/dialtone-vue/components/**`.

## API Style

- New components use Composition API with `<script setup lang="ts">`.
- Existing Options API components keep Options API and `compatConfig: { MODE: 3 }` unless the user explicitly asks to convert them.
- Prop validators use `validator`, never `validate`.
- Enum-like prop values come from `*_constants.js`; do not inline arrays in components or tests.

## Events, Slots, And Sizes

- Use `update:modelValue` for v-model.
- Use `update:open` for new overlays; preserve legacy `update:show` for Modal, Tooltip, and Toast.
- Overlay slots use `headerContent` / `footerContent`; structural slots use `header` / `footer`.
- Interactive component sizes are `xs`, `sm`, `md`, `lg`, `xl`; icon sizes use the numeric `100`-`800` scale.

## Structure

- Keep template expressions simple; move logic into script/computed helpers.
- Component styles live in `packages/dialtone-css`; templates should prefer `d-*` utility classes.
- Use `var(--dt-*)` tokens for colors, spacing, sizing, z-index, radius, and typography.

## Artifact Sync

- Check source, constants, tests, Storybook stories/MDX, VuePress docs, component docs JSON, MCP/query data, and public docs impact for public API changes.
