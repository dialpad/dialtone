# Box Sizing

Utilities for controlling how the browser should calculate an element's total size.

- **Keywords**: border box, content box

## Examples

All examples below have a 128px height and width. You can see how `.d-box-border` elements includes the padding and border into the overall box's height and width.

```html
<div class="d-box-border">…</div>
<div class="d-box-content">…</div>
<div class="d-box-unset">…</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-box-border` | box-sizing: border-box !important |
| `d-box-content` | box-sizing: content-box !important |
| `d-box-unset` | box-sizing: unset !important |
