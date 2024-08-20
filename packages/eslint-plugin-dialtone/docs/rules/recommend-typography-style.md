# Utilities to set Font family, Font weight, Font size, and Line height separately are discouraged in favor of composed typography utilities (`recommend-typography-style`)

Before applying a typography utility, first consider using Dialtone's text styles that bundles Font family, Font weight, Font size, and Line height together.

## Rule Details

This rule aims to improve consistency and readability for typography styles by recommending the use of composed typography utilities over setting Font family, Font weight, Font size, and Line height separately.

Examples of **incorrect** code for this rule:

```html
<span class="d-fw-bold d-fs-200 d-lh-400">
```

Examples of **correct** code for this rule:

```html
<span class="d-headline--md">
```

## Further Reading

- [Dialtone Text Styles](https://dialtone.dialpad.com/design/typography/)
