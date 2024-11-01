# Detects the use of px or rem and suggest the use of Dialtone tokens (use-dialtone-tokens)

Instead of setting values for space, size or typography to px or rem, use a Dialtone token.
For a full list of available tokens, please refer to [Dialtone Design Tokens](https://dialtone.dialpad.com/tokens/).
For some special cases where a value needs to be set and there is no token for it, use rem instead of px.

## Rule Details

Examples of **incorrect** code for this rule:

```css
.a {
  padding: 12px;
}
```

Examples of **correct** code for this rule:

```css
.a {
  padding: var(--dt-space-450);
}
```

## Special case where no token exists:

Examples of **incorrect** code for this rule:

```css
.a {
  width: 26px;
}
```

Examples of **correct** code for this rule:

```css
.a {
  width: 2.6rem;
}
```
