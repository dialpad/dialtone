# Background Patterns

Utilities for adding distinctive background patterns for Department and Call Centers.

- **Keywords**: bg pattern, department, call center

## Usage

Use `d-bgg-pattern-{pattern}-{dark|light}` to apply a pattern.

```html

<div class="... d-bgg-pattern d-bgg-pattern-slanted-stripes-dark">...</div>
<div class="... d-bgg-pattern d-bgg-pattern-dots-circles-light">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bgg-pattern` | position: relative; -webkit-padding-start: var(--dt-size-550) !important; padding-inline-start: var(--dt-size-550) !important |
| `d-bgg-pattern-blob-dark` | --bgg-pattern: var(--bgg-pattern-blob-dark) !important |
| `d-bgg-pattern-blob-light` | --bgg-pattern: var(--bgg-pattern-blob-light) !important |
| `d-bgg-pattern-chevrons-dark` | --bgg-pattern: var(--bgg-pattern-chevrons-dark) !important |
| `d-bgg-pattern-chevrons-light` | --bgg-pattern: var(--bgg-pattern-chevrons-light) !important |
| `d-bgg-pattern-crosses-dark` | --bgg-pattern: var(--bgg-pattern-crosses-dark) !important |
| `d-bgg-pattern-crosses-light` | --bgg-pattern: var(--bgg-pattern-crosses-light) !important |
| `d-bgg-pattern-crosshatch-dark` | --bgg-pattern: var(--bgg-pattern-crosshatch-dark) !important |
| `d-bgg-pattern-crosshatch-light` | --bgg-pattern: var(--bgg-pattern-crosshatch-light) !important |
| `d-bgg-pattern-dot-dash-dark` | --bgg-pattern: var(--bgg-pattern-dot-dash-dark) !important |
| `d-bgg-pattern-dot-dash-light` | --bgg-pattern: var(--bgg-pattern-dot-dash-light) !important |
| `d-bgg-pattern-dots-circles-dark` | --bgg-pattern: var(--bgg-pattern-dots-circles-dark) !important |
| `d-bgg-pattern-dots-circles-light` | --bgg-pattern: var(--bgg-pattern-dots-circles-light) !important |
| `d-bgg-pattern-horz-stripes-dark` | --bgg-pattern: var(--bgg-pattern-horz-stripes-dark) !important |
| `d-bgg-pattern-horz-stripes-light` | --bgg-pattern: var(--bgg-pattern-horz-stripes-light) !important |
| `d-bgg-pattern-slanted-stripes-dark` | --bgg-pattern: var(--bgg-pattern-slanted-stripes-dark) !important |
| `d-bgg-pattern-slanted-stripes-light` | --bgg-pattern: var(--bgg-pattern-slanted-stripes-light) !important |
| `d-bgg-pattern-steps-dark` | --bgg-pattern: var(--bgg-pattern-steps-dark) !important |
| `d-bgg-pattern-steps-light` | --bgg-pattern: var(--bgg-pattern-steps-light) !important |
| `d-bgg-pattern-stripe-dark` | --bgg-pattern: var(--bgg-pattern-stripe-dark) !important |
| `d-bgg-pattern-stripe-light` | --bgg-pattern: var(--bgg-pattern-stripe-light) !important |
| `d-bgg-pattern::after` | position: absolute; inset-block: var(--dt-size-100) var(--dt-size-100); inset-inline-start: var(--dt-size-100); min-inline-size: 2rem; min-block-size: 2rem; background-image: var(--bgg-pattern); background-repeat: repeat-y; background-position: top left; background-clip: content-box; border-radius: 0.3rem; content: '' |
