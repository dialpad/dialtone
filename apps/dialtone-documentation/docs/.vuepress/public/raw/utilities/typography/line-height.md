# Line Height

Utilities to change an element's line-height.

- **Keywords**: leading, line spacing

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

## Relative Line-Heights

Use `d-lh-{n}` to change an element's line-height relatively. This means no unit is set with the line-height. Instead the line-height value is a multiple of the font-size.

```html
<p class="d-lh-unset">...</p>
<p class="d-lh-100">...</p>
<p class="d-lh-200">...</p>
<p class="d-lh-300">...</p>
<p class="d-lh-400">...</p>
<p class="d-lh-500">...</p>
<p class="d-lh-600">...</p>
```

## Fixed Line-Heights

Use `d-lh{n}` to fix an element's line-height. This allows you to target a specific line-height based on the font-size. For example if a target 20px line-height is desired and the current font-size is 14px, apply `.d-lh6` to achieve this target (14px font-size + 6px = 20px target line-height).

```html
<p class="d-lh0">...</p>
<p class="d-lh1">...</p>
<p class="d-lh2">...</p>
<p class="d-lh4">...</p>
<p class="d-lh6">...</p>
<p class="d-lh8">...</p>
<p class="d-lh12">...</p>
<p class="d-lh16">...</p>
<p class="d-lh20">...</p>
<p class="d-lh24">...</p>
```

## CSS Variables

  <div>
| Variable | Output |
| --- | --- |
| var(--dt-font-line-height-{{ className }}) | {{ output }} |
| var(--lh{{ className }}) | {{ output }} |

  </div>

## Classes

| Class | Output |
| --- | --- |
| `d-lh-100` | line-height: var(--dt-font-line-height-100) !important |
| `d-lh-200` | line-height: var(--dt-font-line-height-200) !important |
| `d-lh-300` | line-height: var(--dt-font-line-height-300) !important |
| `d-lh-400` | line-height: var(--dt-font-line-height-400) !important |
| `d-lh-500` | line-height: var(--dt-font-line-height-500) !important |
| `d-lh-600` | line-height: var(--dt-font-line-height-600) !important |
| `d-lh-unset` | line-height: unset !important |
| `d-lh0` | line-height: var(--lh0) !important |
| `d-lh1` | line-height: var(--lh1) !important |
| `d-lh12` | line-height: var(--lh12) !important |
| `d-lh16` | line-height: var(--lh16) !important |
| `d-lh2` | line-height: var(--lh2) !important |
| `d-lh20` | line-height: var(--lh20) !important |
| `d-lh24` | line-height: var(--lh24) !important |
| `d-lh4` | line-height: var(--lh4) !important |
| `d-lh6` | line-height: var(--lh6) !important |
| `d-lh8` | line-height: var(--lh8) !important |
