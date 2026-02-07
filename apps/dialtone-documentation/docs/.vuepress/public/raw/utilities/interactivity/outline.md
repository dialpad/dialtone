# Outline

Utilities for controlling an element's outline.

- **Keywords**: focus ring, focus outline, focus style

## Usage

Use `d-ol-{focusring|focusring-inset|none}` to change an elements' outline.

```html
<div class="d-ol-focusring">...</div>
<div class="d-ol-focusring-inset">...</div>
<div class="d-ol-none">...</div>
```

* Use `d-ol-focusring` to add a focus ring that will render **outside** of the element.
* Use `d-ol-focusring-inset` to add a focus ring that renders **within** the edge of the element. This is particularly useful when the containing element bleeds to the edge of its parent or its `overflow` property is set to `hidden`.

## Classes

| Class | Output |
| --- | --- |
| `d-ol-focusring` | outline: none !important; box-shadow: var(--dt-shadow-focus) !important |
| `d-ol-focusring-inset` | outline: none !important; box-shadow: var(--dt-shadow-focus-inset) !important |
| `d-ol-none` | outline: none !important; box-shadow: none !important |
