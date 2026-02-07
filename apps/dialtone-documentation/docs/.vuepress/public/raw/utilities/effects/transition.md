# Transition

Utilities for controlling how an element transitions in and out of states.

- **Keywords**: animation, animate, ease, duration

## Adding a Transition

Use `d-t` to add a transition to an element.

```html
<dt-button kind="unstyled" class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t">...</dt-button>
```

## Changing Transition Duration

Use `d-td{n}` change an element's `transition-delay` from it's default `50ms` length.

```html
<div class="d-t d-td0">...</div>
<div class="d-t">...</div>
<div class="d-t d-td100">...</div>
<div class="d-t d-td150">...</div>
<div class="d-t d-td200">...</div>
<div class="d-t d-td300">...</div>
```

## Changing Transition Easing

Use `d-ttf-{n}` change an element's `transition-timing-function` (aka easing) from it's default Quad Ease In, Ease Out value.

```html
<div class="d-t d-td100">...</div>
<div class="d-t d-td100 d-ttf-out">...</div>
<div class="d-t d-td100 d-ttf-quint">...</div>
```

## Changing Transition Property

Use `d-tp-{n}` change an what items within an element are transitioned.

```html
<div class="d-t">...</div>
<div class="d-t d-tp-o">...</div>
<div class="d-t d-tp-bs">...</div>
<div class="d-t d-tp-bgc">...</div>
<div class="d-t d-tp-transform">...</div>
<div class="d-t d-tp-colors">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-t` | transition: all var(--td50) var(--ttf-in-out) 0s |
| `d-t-delay100` | transition-delay: var(--td100) !important |
| `d-t-delay150` | transition-delay: var(--td150) !important |
| `d-t-delay200` | transition-delay: var(--td200) !important |
| `d-t-delay25` | transition-delay: var(--td25) !important |
| `d-t-delay300` | transition-delay: var(--td300) !important |
| `d-t-delay50` | transition-delay: var(--td50) !important |
| `d-td0` | transition-duration: var(--td0) !important |
| `d-td100` | transition-duration: var(--td100) !important |
| `d-td150` | transition-duration: var(--td150) !important |
| `d-td200` | transition-duration: var(--td200) !important |
| `d-td300` | transition-duration: var(--td300) !important |
| `d-td50` | transition-duration: var(--td50) !important |
| `d-tp-all` | transition-property: all !important |
| `d-tp-bgc` | transition-property: background-color !important |
| `d-tp-bs` | transition-property: box-shadow !important |
| `d-tp-colors` | transition-property: background-color, border-color, color, fill, stroke !important |
| `d-tp-o` | transition-property: opacity !important |
| `d-tp-transform` | transition-property: -webkit-transform !important; transition-property: transform !important; transition-property: transform, -webkit-transform !important |
| `d-ttf-in-out` | transition-timing-function: var(--ttf-in-out) !important |
| `d-ttf-out` | transition-timing-function: var(--ttf-out) !important |
