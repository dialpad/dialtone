# Pointer events

Utilities for controlling how an element responds to mouse/touch events.

- **Keywords**: click through, mouse events, touch events

## Pointer Event Classes

```html
<el class="d-pe-auto">...</el>
<el class="d-pe-inherit">...</el>
<el class="d-pe-none">...</el>
```

## User Select Classes

Use the `user-select` property to control whether the user can select text.

```html
<div class="d-us-auto">...</div>
<div class="d-us-none">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-pe-auto` | pointer-events: auto !important |
| `d-pe-inherit` | pointer-events: inherit !important |
| `d-pe-none` | pointer-events: none !important |
| `d-us-auto` | -webkit-user-select: auto !important; -ms-user-select: auto !important; user-select: auto !important |
| `d-us-none` | -webkit-user-select: none !important; -ms-user-select: none !important; user-select: none !important |
