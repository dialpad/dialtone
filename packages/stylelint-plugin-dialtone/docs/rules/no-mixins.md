# Detects usage of LESS mixins (no-mixins)

Less mixin usage is one of the primary causes of our extremely slow front end build performance. We are attempting to remove as many less mixins as possible and eventually transition to a more modern pure CSS approach.

## Rule Details

This rule aims to detect and prevent usage of LESS mixins.

Examples of **incorrect** code for this rule:

Mixin usage:

```css
.a {
  .aMixin();
}
```

Older style mixin syntax usage:

```css
.a {
 .aMixin;
}
```

Examples of **correct** code for this rule:

No mixins used.

```css
.a {
  color: var(--dt-color-foreground-critical);
}
```
