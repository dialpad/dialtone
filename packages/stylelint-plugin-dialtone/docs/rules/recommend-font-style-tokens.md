# Detects text styles properties (recommend-font-style-tokens)

Instead of setting font-family, font-weight, font-size, and line-height separately it is preferred to set the property Font to a
composition token that bundles all of those.
More information can be found here: https://dialtone.dialpad.com/design/typography/#api.

## Rule Details

Examples of **incorrect** code for this rule:

```css
.a {
  font-family: var(--dt-font-family-mono);
  font-size: var(--dt-font-size-200);
  line-height: var(--dt-font-line-height-300);
  font-weight: var(--dt-font-weight-medium);
}
```

Examples of **correct** code for this rule:

```css
.a {
  font: var(--dt-typography-body-md-compact);
}
```
