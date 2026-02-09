---
description: "MVC-style separation of concerns for Vue components. Auto-activated when working on Vue components. Ensures templates handle presentation, scripts handle logic, and styles use design tokens."
---

# Separation of Concerns for Vue Components

## Template (View Layer)

The template handles **presentation only**:

- Conditional rendering: `v-if`, `v-show`, `v-else`
- List rendering: `v-for` with `:key`
- Event binding: `@click`, `@keydown`, `@input`
- Prop passing and slot rendering

### Rules

- **Move complex expressions to computed properties.** If a template expression is longer than one line or involves more than a simple comparison, extract it.
- **No API calls or data manipulation** in templates.
- **No complex ternaries.** Use computed properties or methods instead.
- Use component props for data input, emits for communication upward.

```vue
<!-- BAD: complex logic in template -->
<div :class="item.status === 'active' && item.role !== 'admin' ? 'd-fc-success' : item.status === 'pending' ? 'd-fc-warning' : 'd-fc-critical'">

<!-- GOOD: extracted to computed -->
<div :class="statusColorClass">
```

## Script (Controller/Model Layer)

**All logic lives in the script block:**

### Composition API (new components)

- `ref()` and `reactive()` for local state
- `computed()` for derived values
- `watch()` / `watchEffect()` for side effects
- Composables (`use*` functions) for reusable logic

### Options API (existing components)

- `data()` for local state
- `computed` for derived values
- `methods` for event handlers and actions
- `watch` for side effects
- Mixins from `common/mixins/input.js` for shared input behavior

### Rules

- **No DOM manipulation.** Do not use `document.querySelector`, `innerHTML`, or `classList.add`. Use template refs (`ref="myEl"`) when direct DOM access is absolutely needed.
- **API integration belongs in composables or services**, not in component methods directly.
- **Keep components focused.** If a component exceeds ~300 lines, consider splitting it into smaller sub-components.
- Separate container (smart) components that manage state from presentation (dumb) components that just render props.

## Styles (View Layer)

### Approach

1. **First choice:** Dialtone CSS utility classes (`d-p8`, `d-d-flex`, `d-fw-bold`, `d-w100p`).
2. **Second choice:** Scoped custom CSS with design tokens.
3. **Never:** Unscoped global styles or hardcoded values.

### Rules

- Always use `<style scoped>` or Dialtone utility classes.
- **NEVER use unscoped global styles** — they leak across components and cause conflicts.
- **Reference design tokens** for all visual values:
  - Colors: `var(--dt-color-foreground-primary)`, `var(--dt-color-surface-secondary)`
  - Spacing: `var(--dt-space-400)`, `var(--dt-space-500)`
  - Typography: `var(--dt-font-size-200)`, `var(--dt-font-weight-bold)`
  - Shadows: `var(--dt-shadow-small)`
- **NEVER hardcode** colors, spacing values, font sizes, or shadows as raw CSS values.
- **No `!important`** unless you are defining utility classes.

```vue
<!-- GOOD: utility classes -->
<div class="d-d-flex d-ai-center d-p8 d-gap8">

<!-- GOOD: scoped styles with tokens -->
<style scoped>
.custom-element {
  color: var(--dt-color-foreground-primary);
  padding: var(--dt-space-400);
  border-radius: var(--dt-size-radius-400);
}
</style>

<!-- BAD: hardcoded values -->
<style>
.custom-element {
  color: #1C1C1C;
  padding: 16px;
  border-radius: 8px;
}
</style>
```

## Anti-Patterns to Flag

### Template Anti-Patterns
- Business logic in `<template>`: complex ternaries, data transformation, filtering inline with `.filter()` or `.map()`.
- Deeply nested conditional rendering (3+ levels of `v-if`) — extract into sub-components.

### Script Anti-Patterns
- Direct DOM manipulation (`document.querySelector`, `innerHTML`, `classList.add`).
- Watchers that could be computed properties. If you are watching a value to derive another value, use `computed()` instead.
- Methods that only format data — these should be computed properties.
- Components doing too much — split into presentation + container components.

### Style Anti-Patterns
- Inline styles: `style="color: red"` — use utility classes or scoped styles with tokens.
- Raw CSS values: `color: #1C1C1C` — use `var(--dt-color-foreground-primary)`.
- Unscoped styles that bleed globally.
- Using `!important` to override Dialtone styles — investigate specificity issues instead.
