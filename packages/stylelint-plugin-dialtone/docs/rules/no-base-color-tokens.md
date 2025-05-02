# Detects usage of base color tokens (no-base-color-tokens)

The usage of base color tokens is being deprecated in favor or semantic color tokens.

## Rule Details

This rule aims to detect and prevent usage of base color tokens.

Examples of **incorrect** code for this rule:

Base color token usage:

```css
.a {
  background-color: var(--dt-color-black-100);
}
```

Examples of **correct** code for this rule:

Semantic color token usage:

```css
.a {
  background-color: var(--dt-color-surface-primary);
}
```
