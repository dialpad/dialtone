---
description: "Vue component conventions reference for Dialtone. Use '/vue-conventions' to review conventions interactively, or auto-activated when working with .vue files."
---

# Vue Component Conventions

Detailed rules are applied automatically via path-scoped rules when editing component files. This skill provides an interactive quick-reference.

## Quick Reference

| Topic | Convention |
|---|---|
| New components | Composition API + `<script setup lang="ts">` |
| Existing components | Options API + `compatConfig: { MODE: 3 }` |
| Prop validation | `validator` (NEVER `validate` — Vue silently ignores it) |
| Constants | Export from `*_constants.js`, import in component + tests |
| v-model event | `update:modelValue` |
| Open/close | `update:open` (Modal, Tooltip, Toast, Popover, Collapsible, ImageViewer, FilterPill) |
| Overlay slots | `headerContent` / `footerContent` |
| Structural slots | `header` / `footer` |
| Sizes (interactive) | `xs`, `sm`, `md`, `lg`, `xl` |
| Sizes (icons) | `100`–`800` numeric |
| Visibility toggles | `showX` positive polarity |
| Styles | `<style scoped>` or `d-*` utility classes, `var(--dt-*)` tokens only |
| Shared behavior | Composables for new, mixins for legacy in `packages/dialtone-vue/common/mixins/` (`InputMixin`, `CheckableMixin`, `GroupableMixin`, `MessagesMixin`) |
