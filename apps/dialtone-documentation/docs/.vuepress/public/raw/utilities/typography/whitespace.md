# Whitespace

Utilities for controlling an element's whitespace.

- **Keywords**: nowrap, pre, pre wrap, word spacing

## Normal

Use `d-ws-normal` to collapse an element's text whitespaces sequences and newline characters are treated like whitespace. Lines are broken as needed to fill boxes.

```html
<p class="d-ws-normal">...</p>
```

## No Wrap

Use `d-ws-nowrap` to collapse an element's text whitespaces sequences, but line breaks are not honored. This keeps text from wrapping.

```html
<p class="d-ws-nowrap">...</p>
```

## Pre

Use `d-ws-pre` to preserve an element's whitespaces sequences. Lines are only broken at new line characters and `<br/>` elements.

```html
<p class="d-ws-pre">...</p>
```

## Pre Line

Use `d-ws-pre-line` to collapse an element's whitespaces sequences. Lines are broken at new line characters, `<br/>` elements, or as needed to fill boxes.

```html
<p class="d-ws-pre-line">...</p>
```

## Pre Wrap

Use `d-ws-pre-wrap` to preserve an element's whitespaces sequences. Lines are broken at new line characters, `<br/>` elements, or as needed to fill boxes.

```html
<p class="d-ws-pre-wrap">...</p>
```

## Break Spaces

Use `d-ws-break-spaces` to have an element act like `pre-wrap` except that any sequence of preserved whitespace always takes up space, a line breaking opportunity exists after every preserved whitespace character, and preserved spaces take up space and do not hang which affects the element's intrinisic size (`min-content` and `max-content` sizes).

```html
<p class="d-ws-break-spaces">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ws-break-spaces` | white-space: break-spaces !important |
| `d-ws-normal` | white-space: normal !important |
| `d-ws-nowrap` | white-space: nowrap !important |
| `d-ws-pre` | white-space: pre !important |
| `d-ws-pre-line` | white-space: pre-line !important |
| `d-ws-pre-wrap` | white-space: pre-wrap !important |
| `d-ws-unset` | white-space: unset !important |
