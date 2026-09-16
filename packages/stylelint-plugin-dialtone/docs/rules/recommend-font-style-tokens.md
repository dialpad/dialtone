# Detects text styles properties (recommend-font-style-tokens)

Instead of setting font-family, font-weight, font-size, and line-height separately it is preferred to set the property Font to a
composition token that bundles all of those.
More information can be found here: <https://dialtone.dialpad.com/design/typography/#api>.

## Rule Details

Examples of **incorrect** code for this rule:

```css
.a {
  font-family: var(--dt-text-body-md-font-family);
  font-size: var(--dt-text-body-md-font-size);
  line-height: var(--dt-text-body-md-line-height);
  font-weight: var(--dt-text-body-md-font-weight) ;
```

Examples of **correct** code for this rule:

```css
.a {
  font: var(--dt-text-body-md);
}
```
