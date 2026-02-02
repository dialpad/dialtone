# Combining multiple typography utility categories is discouraged in favor of composed typography utilities (`recommend-typography-style`)

Before combining multiple typography utilities from different categories, first consider using Dialtone's composed text styles that bundle Font family, Font weight, Font size, and Line height together.

## Rule Details

This rule flags when **two or more different categories** of typography utilities are combined in the same class attribute. Single typography utilities are acceptable for overrides.

The typography categories are:
- **font-weight**: `d-fw-normal`, `d-fw-medium`, `d-fw-semibold`, `d-fw-bold`
- **font-size**: `d-fs-*` (e.g., `d-fs-200`, `d-fs-300`)
- **line-height**: `d-lh-*` (e.g., `d-lh-300`, `d-lh-400`)
- **font-family**: `d-ff-custom`, `d-ff-sans`, `d-ff-mono`, `d-ff-marketing`, `d-ff-unset`

Examples of **incorrect** code for this rule:

```html
<!-- Combining font-weight + font-size + line-height (3 categories) -->
<span class="d-fw-bold d-fs-200 d-lh-400">

<!-- Combining font-weight + font-size (2 categories) -->
<span class="d-fw-bold d-fs-200">

<!-- Combining font-family + font-weight (2 categories) -->
<span class="d-ff-mono d-fw-semibold">
```

Examples of **correct** code for this rule:

```html
<!-- Composed typography utility -->
<span class="d-headline--md">

<!-- Single typography utility (acceptable for overrides) -->
<span class="d-fw-bold">

<!-- Single category (same category multiple times is fine) -->
<span class="d-fw-bold d-fw-medium">

<!-- Single typography utility mixed with non-typography utilities -->
<span class="d-fw-bold d-mt-4 d-p-8">
```

## Further Reading

- [Dialtone Text Styles](https://dialtone.dialpad.com/design/typography/)
