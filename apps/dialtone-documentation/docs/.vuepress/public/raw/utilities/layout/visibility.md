# Visibility

Utilities for showing or hiding an element without changing the layout of a document.

- **Keywords**: visible, hidden, show, hide, screen reader

## Usage

```html
<div class="d-vi-visible">...</div>
<div class="d-vi-visible-sr">...</div>
<div class="d-vi-hidden">...</div>
```

## Accessibility

Bear in mind using a visibility value of `hidden` on an element will remove it from the accessibility tree. This will cause the element and all its descendant elements to no longer be announced by screen reading technology.

## Classes

| Class | Output |
| --- | --- |
| `d-vi-hidden` | visibility: hidden !important |
| `d-vi-unset` | visibility: unset !important |
| `d-vi-visible` | visibility: visible !important |
| `d-vi-visible-sr` | position: absolute; inline-size: var(--dt-size-100); block-size: var(--dt-size-100); margin: var(--dt-size-100-negative); padding: var(--dt-size-0); overflow: hidden; overflow-wrap: normal; border: none; clip-path: inset(50%) |
