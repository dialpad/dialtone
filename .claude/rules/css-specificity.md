---
paths:
  - "packages/dialtone-css/**"
---

# CSS Specificity Rules

## Target: (0,1,0) Per Selector

Every component selector should aim for a specificity of (0,1,0) — one class. BEM naturally achieves this:

```less
.d-banner {}           // (0,1,0) — block
.d-banner__dialog {}   // (0,1,0) — element
.d-banner--success {}  // (0,1,0) — modifier
```

Modifier overrides should use CSS custom properties, not higher specificity:

```less
// CORRECT — modifier overrides a variable, same specificity
.d-banner { --banner-color: var(--dt-color-surface-primary); }
.d-banner--success { --banner-color: var(--dt-color-surface-success); }

// AVOID — parent modifier targets child, inflates to (0,2,0)
.d-banner--success .d-banner__icon { color: green; }
```

## Element-Type Descendants: Always Wrap in `:where()`

When a component must style bare HTML elements (`th`, `td`, `a`, `button`, `option`, `li`, etc.), wrap them in `:where()` to zero out the element's specificity contribution:

```less
// CORRECT — (0,1,0)
.d-table {
  :where(th) { color: var(--table-th-color-text); }
  :where(td) { color: var(--table-td-color-text); }
}

// WRONG — (0,1,1), harder to override
.d-table {
  th { color: var(--table-th-color-text); }
}
```

## Structural Pseudo-Classes on Elements: Wrap the Full Descendant

When using `:first-child`, `:last-of-type`, `:nth-child()`, etc. on element selectors inside a component, wrap everything in `:where()`:

```less
// CORRECT — (0,1,0)
.d-table {
  :where(tbody tr:last-of-type) {
    :where(td, th) { border-block-end-width: 0; }
  }
}

// WRONG — (0,2,3)
.d-table {
  tbody tr:last-of-type {
    td, th { border-block-end-width: 0; }
  }
}
```

## Do NOT Wrap These

- **The host component class** — `.d-table` must retain its (0,1,0) as the anchor selector
- **BEM modifier classes** — `.d-table--striped` needs its specificity to override base styles
- **State pseudo-classes** — `:hover`, `:disabled`, `:focus-visible`, `:active`, `:checked` where specificity ordering is functional (e.g., `:not(:disabled):hover` must beat `:disabled`)
- **`:not()` / `:has()` containing class selectors** — the specificity reflects semantic complexity, not accidental inflation

## Nesting Depth

- **1 class** (0,1,0): Default. Covers most rules.
- **2 classes** (0,2,0): Acceptable when a parent modifier must affect children (e.g., `.d-tablist--inverted .d-tab`). Prefer CSS custom property overrides when possible.
- **3+ classes**: Avoid. Refactor to use CSS custom properties or restructure the component.

## `@layer` Context

All component styles are inside `@layer dialtone.components`. This means:

- Unlayered consumer CSS always wins regardless of specificity
- Within the layer, lower specificity = easier to extend and override
- Keeping selectors flat benefits consumers who style within the same layer

## Anti-Patterns

- No `#id` selectors
- No bare element selectors without `:where()` wrapping
- No `!important` in component styles (reserved for utility classes)
- No qualifying element selectors on classes (e.g., `div.d-banner` — just use `.d-banner`)
