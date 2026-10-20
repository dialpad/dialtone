# Vue Component Rules

Apply to `packages/dialtone-vue/components/**`.

## API Style

- New components use Composition API with `<script setup lang="ts">`.
- Existing Options API components keep Options API and `compatConfig: { MODE: 3 }` unless the user explicitly asks to convert them.
- Prop validators use `validator`, never `validate`.
- Enum-like prop values come from `*_constants.js`; do not inline arrays in components or tests.

## Events, Slots, And Sizes

- Use `modelValue` / `update:modelValue` for the v-model prop and emitted event
  contract. In Vue templates, follow the existing linted listener spelling,
  for example `@update:model-value`.
- Use `update:open` for overlay visibility; verify the existing component's emitted events before changing its contract.
- Overlay slots use `headerContent` / `footerContent`; structural slots use `header` / `footer`.
- Component sizes use the numeric ordinal scale in `packages/dialtone-vue/common/constants/sizes.js`; use each component's constants for supported values. T-shirt aliases are legacy. Icon sizes use their separate numeric `100`-`800` scale.
- New directional props, slots, values, and events use logical naming. Load `.agents/resources/rules/logical-naming.md` when direction names are added or changed.

## Structure

- Keep template expressions simple; move logic into script/computed helpers.
- Component styles live in `packages/dialtone-css`; templates should prefer `d-*` utility classes.
- Use `var(--dt-*)` tokens for colors, spacing, sizing, z-index, radius, and typography.

## Artifact Sync

- Check source, constants, tests, Storybook stories/MDX, VuePress docs, component docs JSON, MCP/query data, and public docs impact for public API changes.
- For prop, slot, valid-value, or visual-state changes, check the Combinator variant file at `packages/combinator/src/variants/variants_<component>.js`, registration in `packages/combinator/src/variants/variants.js`, and unsupported status in `packages/combinator/src/unsupported_components.json`. Load `.agents/resources/rules/combinator-variants.md`.
