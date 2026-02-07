# Text Overflow

Utilities for controlling an element's text overflow.

- **Keywords**: ellipsis, truncate, clip

## Truncate

Use `d-truncate` to truncate an element's text to a single line with an ellipsis (`...`) if needed. Note that while CSS Utilities are fundamentally a single CSS property, this utility combines three: `overflow`, `text-overflow`, and `white-space` to achieve the effect.

```html
<p class="d-truncate">...</p>
```

## Ellipsis

Use `d-to-ellipsis`, combined with `d-of-hidden` to truncate an element's overflowing text with an ellipsis (`...`) if needed.

```html
<p class="d-of-hidden d-to-ellipsis">...</p>
```

## Clip

Use `d-to-clip` to clip an element's overflowing text if needed.

```html
<p class="d-of-hidden d-to-clip">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-to-clip` | text-overflow: clip !important |
| `d-to-ellipsis` | text-overflow: ellipsis !important |
| `d-to-unset` | text-overflow: unset !important |
| `d-truncate` | overflow: hidden !important; white-space: nowrap !important; text-overflow: ellipsis !important |
