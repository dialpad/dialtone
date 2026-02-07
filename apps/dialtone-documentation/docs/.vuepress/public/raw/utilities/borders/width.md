# Border Widths

Utilities for controlling an element's border width.

- **Keywords**: border size, border thickness

## All Sides

Use `d-baw{n}` to change the border width on your element.

```html
<div class="d-ba d-baw0">...</div>
<div class="d-ba d-baw1">...</div>
<div class="d-ba d-baw2">...</div>
<div class="d-ba d-baw4">...</div>
```

## Individual Sides

Use `d-b{a|t|r|b|l}w{n}` to change the border width of your direction on your element.

```html

<div class="d-bt d-btw1">...</div>
<div class="d-br d-btw2">...</div>
<div class="d-bb d-btw4">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-baw0` | border-width: var(--dt-size-border-0) !important |
| `d-baw1` | border-width: var(--dt-size-border-100) !important |
| `d-baw2` | border-width: var(--dt-size-border-200) !important |
| `d-baw4` | border-width: var(--dt-size-border-300) !important |
| `d-bbw0` | border-block-end-width: var(--dt-size-border-0) !important |
| `d-bbw1` | border-block-end-width: var(--dt-size-border-100) !important |
| `d-bbw2` | border-block-end-width: var(--dt-size-border-200) !important |
| `d-bbw4` | border-block-end-width: var(--dt-size-border-300) !important |
| `d-blw0` | border-inline-start-width: var(--dt-size-border-0) !important |
| `d-blw1` | border-inline-start-width: var(--dt-size-border-100) !important |
| `d-blw2` | border-inline-start-width: var(--dt-size-border-200) !important |
| `d-blw4` | border-inline-start-width: var(--dt-size-border-300) !important |
| `d-brw0` | border-inline-end-width: var(--dt-size-border-0) !important |
| `d-brw1` | border-inline-end-width: var(--dt-size-border-100) !important |
| `d-brw2` | border-inline-end-width: var(--dt-size-border-200) !important |
| `d-brw4` | border-inline-end-width: var(--dt-size-border-300) !important |
| `d-btw0` | border-block-start-width: var(--dt-size-border-0) !important |
| `d-btw1` | border-block-start-width: var(--dt-size-border-100) !important |
| `d-btw2` | border-block-start-width: var(--dt-size-border-200) !important |
| `d-btw4` | border-block-start-width: var(--dt-size-border-300) !important |
| `d-bxw0` | border-inline-end-width: var(--dt-size-border-0) !important; border-inline-start-width: var(--dt-size-border-0) !important |
| `d-bxw1` | border-inline-end-width: var(--dt-size-border-100) !important; border-inline-start-width: var(--dt-size-border-100) !important |
| `d-bxw2` | border-inline-end-width: var(--dt-size-border-200) !important; border-inline-start-width: var(--dt-size-border-200) !important |
| `d-bxw4` | border-inline-end-width: var(--dt-size-border-300) !important; border-inline-start-width: var(--dt-size-border-300) !important |
| `d-byw0` | border-block-start-width: var(--dt-size-border-0) !important; border-block-end-width: var(--dt-size-border-0) !important |
| `d-byw1` | border-block-start-width: var(--dt-size-border-100) !important; border-block-end-width: var(--dt-size-border-100) !important |
| `d-byw2` | border-block-start-width: var(--dt-size-border-200) !important; border-block-end-width: var(--dt-size-border-200) !important |
| `d-byw4` | border-block-start-width: var(--dt-size-border-300) !important; border-block-end-width: var(--dt-size-border-300) !important |
