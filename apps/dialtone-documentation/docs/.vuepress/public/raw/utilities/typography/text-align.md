# Text Align

Utilities for controlling an element's text alignment.

- **Keywords**: left, center, right, justify

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

## Usage

Use `d-ta-{n}` to change an element's text alignment.

```html
<p class="d-ta-left">...</p>
<p class="d-ta-center">...</p>
<p class="d-ta-right">...</p>
<p class="d-ta-justify d-w332">...</p>
<p class="d-ta-unset">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ta-center` | text-align: center !important |
| `d-ta-justify` | text-align: justify !important |
| `d-ta-left` | text-align: start !important |
| `d-ta-right` | text-align: end !important |
| `d-ta-unset` | text-align: unset !important |
