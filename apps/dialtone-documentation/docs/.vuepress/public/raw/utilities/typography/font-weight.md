# Font Weight

Utilities to change an element's font-weight.

- **Keywords**: bold, semibold, light, thin

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

## Usage

Use `d-fw-{n}` to change an element's font-weight.

```html
<p class="d-fw-normal">...</p>
<p class="d-fw-medium">...</p>
<p class="d-fw-semibold">...</p>
<p class="d-fw-bold">...</p>
```

## Variables

  <div>
| Variable | Output |
| --- | --- |
| var(--dt-font-weight-{{ name }}) | {{ output }} |

  </div>

## Classes

| Class | Output |
| --- | --- |
| `d-fw-bold` | font-weight: var(--dt-font-weight-bold) !important |
| `d-fw-medium` | font-weight: var(--dt-font-weight-medium) !important |
| `d-fw-normal` | font-weight: var(--dt-font-weight-normal) !important |
| `d-fw-semibold` | font-weight: var(--dt-font-weight-semi-bold) !important |
| `d-fw-unset` | font-weight: unset !important |
