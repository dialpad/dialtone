# Position

Utility classes to change an element’s position type.

- **Keywords**: relative, absolute, fixed, sticky, static

## Examples

```html
<div class="d-ps-static">…</div>
<div class="d-ps-relative">…</div>
<div class="d-ps-absolute">…</div>
<div class="d-ps-fixed">…</div>
<div class="d-ps-sticky">…</div>
```

## Classes

Set an element’s position by using the position classes listed in the table below. Starting in v5.8.0, Dialtone began providing immutable type classes, meaning they include an <span class="code-example--inline">!important</span> to override CSS specificity.

| Class | Output |
| --- | --- |
| `d-ps-absolute` | position: absolute !important |
| `d-ps-fixed` | position: fixed !important |
| `d-ps-relative` | position: relative !important |
| `d-ps-static` | position: static !important |
| `d-ps-sticky` | position: sticky !important |
| `d-ps-unset` | position: unset !important |
