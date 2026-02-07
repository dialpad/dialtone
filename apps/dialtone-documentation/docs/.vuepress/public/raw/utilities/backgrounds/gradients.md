# Gradients

Utilities for creating an background gradient and controlling its stops.

- **Keywords**: linear gradient, bg gradient, color stops

## Starting Color

Use `d-bgg-from-{color}` to declare the gradient starting color stop.

```html
<div class="d-bgg-to-br d-bgg-from-purple-400">...</div>
```

## Ending Color

Use `d-bgg-to-{color}` to declare the gradient ending color stop.

```html
<div class="d-bgg-to-br d-bgg-from-purple-400 d-bgg-to-magenta-300">...</div>
```

## Hover

Use `h:d-bgg-{from|to}-{color}` to change an element's background gradient color spot when in an `:hover` state.

```html
<dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 h:d-bgg-to-magenta-300 d-baw0">Hover over me</dt-button>
```

## Focus

Use `f:d-bgg-{from|to}-{color}` to change an element's background gradient starting and ending stops in `:focus` and `:focus-within` states.

```html
<dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 f:d-bgg-to-magenta-300 d-baw0">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-bgg-{from|to}-{color}` to change an element's background gradient starting and ending stops in `:focus-visible` state [only when focused by keyboard].

```html
<dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 fv:d-bgg-to-magenta-300 d-baw0">Keyboard focus me</dt-button>
```

## Changing Opacities

Use `d-bgg-(from|to)-o{n}` to change the opacity values of each gradient color stop. You can also change the opacity values of each gradient color stop on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgg-(from|to)-o{n}`, `f:d-bgg-(from|to)-o{n}`, `fv:d-bgg-(from|to)-o{n}` prefixes.

```html
<div class="d-bgg-from-purple-300 d-bgg-to-magenta-100 d-bgg-to-o0">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o99 d-bgg-to-magenta-100 d-bgg-to-o10">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o95 d-bgg-to-magenta-100 d-bgg-to-o25">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o90 d-bgg-to-magenta-100 d-bgg-to-o50">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o75 d-bgg-to-magenta-100 d-bgg-to-o75">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o50 d-bgg-to-magenta-100 d-bgg-to-o90">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o25 d-bgg-to-magenta-100 d-bgg-to-o95">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o10 d-bgg-to-magenta-100 d-bgg-to-o99">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o0 d-bgg-to-magenta-100">...</div>
```

## Directions

To create a background gradient, first declare the desired gradient and, if applicable, the direction. All classes with directions are linear gradients. Radial gradients start from the center and work out to the edge. Conic gradients progressively work around a circle.

| Class | Output |
| --- | --- |
| `d-bgg-conic` | background-image: conic-gradient(var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-from-berry-100` | --bgg-from-opacity: var(--dt-color-berry-100-a); --bgg-from: oklch(from var(--dt-color-berry-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-100-h) var(--dt-color-berry-100-s) var(--dt-color-berry-100-l) / 0%) !important |
| `d-bgg-from-berry-1000` | --bgg-from-opacity: var(--dt-color-berry-1000-a); --bgg-from: oklch(from var(--dt-color-berry-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-1000-h) var(--dt-color-berry-1000-s) var(--dt-color-berry-1000-l) / 0%) !important |
| `d-bgg-from-berry-200` | --bgg-from-opacity: var(--dt-color-berry-200-a); --bgg-from: oklch(from var(--dt-color-berry-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-200-h) var(--dt-color-berry-200-s) var(--dt-color-berry-200-l) / 0%) !important |
| `d-bgg-from-berry-300` | --bgg-from-opacity: var(--dt-color-berry-300-a); --bgg-from: oklch(from var(--dt-color-berry-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-300-h) var(--dt-color-berry-300-s) var(--dt-color-berry-300-l) / 0%) !important |
| `d-bgg-from-berry-400` | --bgg-from-opacity: var(--dt-color-berry-400-a); --bgg-from: oklch(from var(--dt-color-berry-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-400-h) var(--dt-color-berry-400-s) var(--dt-color-berry-400-l) / 0%) !important |
| `d-bgg-from-berry-50` | --bgg-from-opacity: var(--dt-color-berry-50-a); --bgg-from: oklch(from var(--dt-color-berry-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-50-h) var(--dt-color-berry-50-s) var(--dt-color-berry-50-l) / 0%) !important |
| `d-bgg-from-berry-500` | --bgg-from-opacity: var(--dt-color-berry-500-a); --bgg-from: oklch(from var(--dt-color-berry-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-500-h) var(--dt-color-berry-500-s) var(--dt-color-berry-500-l) / 0%) !important |
| `d-bgg-from-berry-600` | --bgg-from-opacity: var(--dt-color-berry-600-a); --bgg-from: oklch(from var(--dt-color-berry-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-600-h) var(--dt-color-berry-600-s) var(--dt-color-berry-600-l) / 0%) !important |
| `d-bgg-from-berry-700` | --bgg-from-opacity: var(--dt-color-berry-700-a); --bgg-from: oklch(from var(--dt-color-berry-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-700-h) var(--dt-color-berry-700-s) var(--dt-color-berry-700-l) / 0%) !important |
| `d-bgg-from-berry-800` | --bgg-from-opacity: var(--dt-color-berry-800-a); --bgg-from: oklch(from var(--dt-color-berry-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-800-h) var(--dt-color-berry-800-s) var(--dt-color-berry-800-l) / 0%) !important |
| `d-bgg-from-berry-900` | --bgg-from-opacity: var(--dt-color-berry-900-a); --bgg-from: oklch(from var(--dt-color-berry-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-900-h) var(--dt-color-berry-900-s) var(--dt-color-berry-900-l) / 0%) !important |
| `d-bgg-from-berry-950` | --bgg-from-opacity: var(--dt-color-berry-950-a); --bgg-from: oklch(from var(--dt-color-berry-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-950-h) var(--dt-color-berry-950-s) var(--dt-color-berry-950-l) / 0%) !important |
| `d-bgg-from-black-100` | --bgg-from-opacity: var(--dt-color-black-100-a); --bgg-from: oklch(from var(--dt-color-black-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-100-h) var(--dt-color-black-100-s) var(--dt-color-black-100-l) / 0%) !important |
| `d-bgg-from-black-1000` | --bgg-from-opacity: var(--dt-color-black-1000-a); --bgg-from: oklch(from var(--dt-color-black-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-1000-h) var(--dt-color-black-1000-s) var(--dt-color-black-1000-l) / 0%) !important |
| `d-bgg-from-black-200` | --bgg-from-opacity: var(--dt-color-black-200-a); --bgg-from: oklch(from var(--dt-color-black-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-200-h) var(--dt-color-black-200-s) var(--dt-color-black-200-l) / 0%) !important |
| `d-bgg-from-black-300` | --bgg-from-opacity: var(--dt-color-black-300-a); --bgg-from: oklch(from var(--dt-color-black-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-300-h) var(--dt-color-black-300-s) var(--dt-color-black-300-l) / 0%) !important |
| `d-bgg-from-black-400` | --bgg-from-opacity: var(--dt-color-black-400-a); --bgg-from: oklch(from var(--dt-color-black-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-400-h) var(--dt-color-black-400-s) var(--dt-color-black-400-l) / 0%) !important |
| `d-bgg-from-black-50` | --bgg-from-opacity: var(--dt-color-black-50-a); --bgg-from: oklch(from var(--dt-color-black-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-50-h) var(--dt-color-black-50-s) var(--dt-color-black-50-l) / 0%) !important |
| `d-bgg-from-black-500` | --bgg-from-opacity: var(--dt-color-black-500-a); --bgg-from: oklch(from var(--dt-color-black-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-500-h) var(--dt-color-black-500-s) var(--dt-color-black-500-l) / 0%) !important |
| `d-bgg-from-black-600` | --bgg-from-opacity: var(--dt-color-black-600-a); --bgg-from: oklch(from var(--dt-color-black-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-600-h) var(--dt-color-black-600-s) var(--dt-color-black-600-l) / 0%) !important |
| `d-bgg-from-black-700` | --bgg-from-opacity: var(--dt-color-black-700-a); --bgg-from: oklch(from var(--dt-color-black-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-700-h) var(--dt-color-black-700-s) var(--dt-color-black-700-l) / 0%) !important |
| `d-bgg-from-black-800` | --bgg-from-opacity: var(--dt-color-black-800-a); --bgg-from: oklch(from var(--dt-color-black-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-800-h) var(--dt-color-black-800-s) var(--dt-color-black-800-l) / 0%) !important |
| `d-bgg-from-black-900` | --bgg-from-opacity: var(--dt-color-black-900-a); --bgg-from: oklch(from var(--dt-color-black-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-900-h) var(--dt-color-black-900-s) var(--dt-color-black-900-l) / 0%) !important |
| `d-bgg-from-black-950` | --bgg-from-opacity: var(--dt-color-black-950-a); --bgg-from: oklch(from var(--dt-color-black-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-950-h) var(--dt-color-black-950-s) var(--dt-color-black-950-l) / 0%) !important |
| `d-bgg-from-blue-100` | --bgg-from-opacity: var(--dt-color-blue-100-a); --bgg-from: oklch(from var(--dt-color-blue-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-100-h) var(--dt-color-blue-100-s) var(--dt-color-blue-100-l) / 0%) !important |
| `d-bgg-from-blue-1000` | --bgg-from-opacity: var(--dt-color-blue-1000-a); --bgg-from: oklch(from var(--dt-color-blue-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-1000-h) var(--dt-color-blue-1000-s) var(--dt-color-blue-1000-l) / 0%) !important |
| `d-bgg-from-blue-200` | --bgg-from-opacity: var(--dt-color-blue-200-a); --bgg-from: oklch(from var(--dt-color-blue-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-200-h) var(--dt-color-blue-200-s) var(--dt-color-blue-200-l) / 0%) !important |
| `d-bgg-from-blue-300` | --bgg-from-opacity: var(--dt-color-blue-300-a); --bgg-from: oklch(from var(--dt-color-blue-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-300-h) var(--dt-color-blue-300-s) var(--dt-color-blue-300-l) / 0%) !important |
| `d-bgg-from-blue-400` | --bgg-from-opacity: var(--dt-color-blue-400-a); --bgg-from: oklch(from var(--dt-color-blue-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-400-h) var(--dt-color-blue-400-s) var(--dt-color-blue-400-l) / 0%) !important |
| `d-bgg-from-blue-425` | --bgg-from-opacity: var(--dt-color-blue-425-a); --bgg-from: oklch(from var(--dt-color-blue-425) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-425-h) var(--dt-color-blue-425-s) var(--dt-color-blue-425-l) / 0%) !important |
| `d-bgg-from-blue-450` | --bgg-from-opacity: var(--dt-color-blue-450-a); --bgg-from: oklch(from var(--dt-color-blue-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-450-h) var(--dt-color-blue-450-s) var(--dt-color-blue-450-l) / 0%) !important |
| `d-bgg-from-blue-475` | --bgg-from-opacity: var(--dt-color-blue-475-a); --bgg-from: oklch(from var(--dt-color-blue-475) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-475-h) var(--dt-color-blue-475-s) var(--dt-color-blue-475-l) / 0%) !important |
| `d-bgg-from-blue-50` | --bgg-from-opacity: var(--dt-color-blue-50-a); --bgg-from: oklch(from var(--dt-color-blue-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-50-h) var(--dt-color-blue-50-s) var(--dt-color-blue-50-l) / 0%) !important |
| `d-bgg-from-blue-500` | --bgg-from-opacity: var(--dt-color-blue-500-a); --bgg-from: oklch(from var(--dt-color-blue-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-500-h) var(--dt-color-blue-500-s) var(--dt-color-blue-500-l) / 0%) !important |
| `d-bgg-from-blue-600` | --bgg-from-opacity: var(--dt-color-blue-600-a); --bgg-from: oklch(from var(--dt-color-blue-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-600-h) var(--dt-color-blue-600-s) var(--dt-color-blue-600-l) / 0%) !important |
| `d-bgg-from-blue-900` | --bgg-from-opacity: var(--dt-color-blue-900-a); --bgg-from: oklch(from var(--dt-color-blue-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-900-h) var(--dt-color-blue-900-s) var(--dt-color-blue-900-l) / 0%) !important |
| `d-bgg-from-coral-100` | --bgg-from-opacity: var(--dt-color-coral-100-a); --bgg-from: oklch(from var(--dt-color-coral-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-100-h) var(--dt-color-coral-100-s) var(--dt-color-coral-100-l) / 0%) !important |
| `d-bgg-from-coral-1000` | --bgg-from-opacity: var(--dt-color-coral-1000-a); --bgg-from: oklch(from var(--dt-color-coral-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-1000-h) var(--dt-color-coral-1000-s) var(--dt-color-coral-1000-l) / 0%) !important |
| `d-bgg-from-coral-200` | --bgg-from-opacity: var(--dt-color-coral-200-a); --bgg-from: oklch(from var(--dt-color-coral-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-200-h) var(--dt-color-coral-200-s) var(--dt-color-coral-200-l) / 0%) !important |
| `d-bgg-from-coral-300` | --bgg-from-opacity: var(--dt-color-coral-300-a); --bgg-from: oklch(from var(--dt-color-coral-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-300-h) var(--dt-color-coral-300-s) var(--dt-color-coral-300-l) / 0%) !important |
| `d-bgg-from-coral-400` | --bgg-from-opacity: var(--dt-color-coral-400-a); --bgg-from: oklch(from var(--dt-color-coral-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-400-h) var(--dt-color-coral-400-s) var(--dt-color-coral-400-l) / 0%) !important |
| `d-bgg-from-coral-50` | --bgg-from-opacity: var(--dt-color-coral-50-a); --bgg-from: oklch(from var(--dt-color-coral-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-50-h) var(--dt-color-coral-50-s) var(--dt-color-coral-50-l) / 0%) !important |
| `d-bgg-from-coral-500` | --bgg-from-opacity: var(--dt-color-coral-500-a); --bgg-from: oklch(from var(--dt-color-coral-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-500-h) var(--dt-color-coral-500-s) var(--dt-color-coral-500-l) / 0%) !important |
| `d-bgg-from-coral-600` | --bgg-from-opacity: var(--dt-color-coral-600-a); --bgg-from: oklch(from var(--dt-color-coral-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-600-h) var(--dt-color-coral-600-s) var(--dt-color-coral-600-l) / 0%) !important |
| `d-bgg-from-coral-700` | --bgg-from-opacity: var(--dt-color-coral-700-a); --bgg-from: oklch(from var(--dt-color-coral-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-700-h) var(--dt-color-coral-700-s) var(--dt-color-coral-700-l) / 0%) !important |
| `d-bgg-from-coral-800` | --bgg-from-opacity: var(--dt-color-coral-800-a); --bgg-from: oklch(from var(--dt-color-coral-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-800-h) var(--dt-color-coral-800-s) var(--dt-color-coral-800-l) / 0%) !important |
| `d-bgg-from-coral-900` | --bgg-from-opacity: var(--dt-color-coral-900-a); --bgg-from: oklch(from var(--dt-color-coral-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-900-h) var(--dt-color-coral-900-s) var(--dt-color-coral-900-l) / 0%) !important |
| `d-bgg-from-coral-950` | --bgg-from-opacity: var(--dt-color-coral-950-a); --bgg-from: oklch(from var(--dt-color-coral-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-950-h) var(--dt-color-coral-950-s) var(--dt-color-coral-950-l) / 0%) !important |
| `d-bgg-from-gold-100` | --bgg-from-opacity: var(--dt-color-gold-100-a); --bgg-from: oklch(from var(--dt-color-gold-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-100-h) var(--dt-color-gold-100-s) var(--dt-color-gold-100-l) / 0%) !important |
| `d-bgg-from-gold-1000` | --bgg-from-opacity: var(--dt-color-gold-1000-a); --bgg-from: oklch(from var(--dt-color-gold-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-1000-h) var(--dt-color-gold-1000-s) var(--dt-color-gold-1000-l) / 0%) !important |
| `d-bgg-from-gold-200` | --bgg-from-opacity: var(--dt-color-gold-200-a); --bgg-from: oklch(from var(--dt-color-gold-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-200-h) var(--dt-color-gold-200-s) var(--dt-color-gold-200-l) / 0%) !important |
| `d-bgg-from-gold-300` | --bgg-from-opacity: var(--dt-color-gold-300-a); --bgg-from: oklch(from var(--dt-color-gold-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-300-h) var(--dt-color-gold-300-s) var(--dt-color-gold-300-l) / 0%) !important |
| `d-bgg-from-gold-350` | --bgg-from-opacity: var(--dt-color-gold-350-a); --bgg-from: oklch(from var(--dt-color-gold-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-350-h) var(--dt-color-gold-350-s) var(--dt-color-gold-350-l) / 0%) !important |
| `d-bgg-from-gold-400` | --bgg-from-opacity: var(--dt-color-gold-400-a); --bgg-from: oklch(from var(--dt-color-gold-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-400-h) var(--dt-color-gold-400-s) var(--dt-color-gold-400-l) / 0%) !important |
| `d-bgg-from-gold-450` | --bgg-from-opacity: var(--dt-color-gold-450-a); --bgg-from: oklch(from var(--dt-color-gold-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-450-h) var(--dt-color-gold-450-s) var(--dt-color-gold-450-l) / 0%) !important |
| `d-bgg-from-gold-50` | --bgg-from-opacity: var(--dt-color-gold-50-a); --bgg-from: oklch(from var(--dt-color-gold-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-50-h) var(--dt-color-gold-50-s) var(--dt-color-gold-50-l) / 0%) !important |
| `d-bgg-from-gold-500` | --bgg-from-opacity: var(--dt-color-gold-500-a); --bgg-from: oklch(from var(--dt-color-gold-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-500-h) var(--dt-color-gold-500-s) var(--dt-color-gold-500-l) / 0%) !important |
| `d-bgg-from-gold-600` | --bgg-from-opacity: var(--dt-color-gold-600-a); --bgg-from: oklch(from var(--dt-color-gold-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-600-h) var(--dt-color-gold-600-s) var(--dt-color-gold-600-l) / 0%) !important |
| `d-bgg-from-gold-700` | --bgg-from-opacity: var(--dt-color-gold-700-a); --bgg-from: oklch(from var(--dt-color-gold-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-700-h) var(--dt-color-gold-700-s) var(--dt-color-gold-700-l) / 0%) !important |
| `d-bgg-from-gold-900` | --bgg-from-opacity: var(--dt-color-gold-900-a); --bgg-from: oklch(from var(--dt-color-gold-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-900-h) var(--dt-color-gold-900-s) var(--dt-color-gold-900-l) / 0%) !important |
| `d-bgg-from-green-100` | --bgg-from-opacity: var(--dt-color-green-100-a); --bgg-from: oklch(from var(--dt-color-green-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-100-h) var(--dt-color-green-100-s) var(--dt-color-green-100-l) / 0%) !important |
| `d-bgg-from-green-1000` | --bgg-from-opacity: var(--dt-color-green-1000-a); --bgg-from: oklch(from var(--dt-color-green-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-1000-h) var(--dt-color-green-1000-s) var(--dt-color-green-1000-l) / 0%) !important |
| `d-bgg-from-green-200` | --bgg-from-opacity: var(--dt-color-green-200-a); --bgg-from: oklch(from var(--dt-color-green-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-200-h) var(--dt-color-green-200-s) var(--dt-color-green-200-l) / 0%) !important |
| `d-bgg-from-green-300` | --bgg-from-opacity: var(--dt-color-green-300-a); --bgg-from: oklch(from var(--dt-color-green-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-300-h) var(--dt-color-green-300-s) var(--dt-color-green-300-l) / 0%) !important |
| `d-bgg-from-green-350` | --bgg-from-opacity: var(--dt-color-green-350-a); --bgg-from: oklch(from var(--dt-color-green-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-350-h) var(--dt-color-green-350-s) var(--dt-color-green-350-l) / 0%) !important |
| `d-bgg-from-green-400` | --bgg-from-opacity: var(--dt-color-green-400-a); --bgg-from: oklch(from var(--dt-color-green-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-400-h) var(--dt-color-green-400-s) var(--dt-color-green-400-l) / 0%) !important |
| `d-bgg-from-green-425` | --bgg-from-opacity: var(--dt-color-green-425-a); --bgg-from: oklch(from var(--dt-color-green-425) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-425-h) var(--dt-color-green-425-s) var(--dt-color-green-425-l) / 0%) !important |
| `d-bgg-from-green-475` | --bgg-from-opacity: var(--dt-color-green-475-a); --bgg-from: oklch(from var(--dt-color-green-475) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-475-h) var(--dt-color-green-475-s) var(--dt-color-green-475-l) / 0%) !important |
| `d-bgg-from-green-50` | --bgg-from-opacity: var(--dt-color-green-50-a); --bgg-from: oklch(from var(--dt-color-green-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-50-h) var(--dt-color-green-50-s) var(--dt-color-green-50-l) / 0%) !important |
| `d-bgg-from-green-500` | --bgg-from-opacity: var(--dt-color-green-500-a); --bgg-from: oklch(from var(--dt-color-green-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-500-h) var(--dt-color-green-500-s) var(--dt-color-green-500-l) / 0%) !important |
| `d-bgg-from-green-600` | --bgg-from-opacity: var(--dt-color-green-600-a); --bgg-from: oklch(from var(--dt-color-green-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-600-h) var(--dt-color-green-600-s) var(--dt-color-green-600-l) / 0%) !important |
| `d-bgg-from-green-900` | --bgg-from-opacity: var(--dt-color-green-900-a); --bgg-from: oklch(from var(--dt-color-green-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-900-h) var(--dt-color-green-900-s) var(--dt-color-green-900-l) / 0%) !important |
| `d-bgg-from-indigo-100` | --bgg-from-opacity: var(--dt-color-indigo-100-a); --bgg-from: oklch(from var(--dt-color-indigo-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-100-h) var(--dt-color-indigo-100-s) var(--dt-color-indigo-100-l) / 0%) !important |
| `d-bgg-from-indigo-1000` | --bgg-from-opacity: var(--dt-color-indigo-1000-a); --bgg-from: oklch(from var(--dt-color-indigo-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-1000-h) var(--dt-color-indigo-1000-s) var(--dt-color-indigo-1000-l) / 0%) !important |
| `d-bgg-from-indigo-200` | --bgg-from-opacity: var(--dt-color-indigo-200-a); --bgg-from: oklch(from var(--dt-color-indigo-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-200-h) var(--dt-color-indigo-200-s) var(--dt-color-indigo-200-l) / 0%) !important |
| `d-bgg-from-indigo-300` | --bgg-from-opacity: var(--dt-color-indigo-300-a); --bgg-from: oklch(from var(--dt-color-indigo-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-300-h) var(--dt-color-indigo-300-s) var(--dt-color-indigo-300-l) / 0%) !important |
| `d-bgg-from-indigo-400` | --bgg-from-opacity: var(--dt-color-indigo-400-a); --bgg-from: oklch(from var(--dt-color-indigo-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-400-h) var(--dt-color-indigo-400-s) var(--dt-color-indigo-400-l) / 0%) !important |
| `d-bgg-from-indigo-50` | --bgg-from-opacity: var(--dt-color-indigo-50-a); --bgg-from: oklch(from var(--dt-color-indigo-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-50-h) var(--dt-color-indigo-50-s) var(--dt-color-indigo-50-l) / 0%) !important |
| `d-bgg-from-indigo-500` | --bgg-from-opacity: var(--dt-color-indigo-500-a); --bgg-from: oklch(from var(--dt-color-indigo-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-500-h) var(--dt-color-indigo-500-s) var(--dt-color-indigo-500-l) / 0%) !important |
| `d-bgg-from-indigo-600` | --bgg-from-opacity: var(--dt-color-indigo-600-a); --bgg-from: oklch(from var(--dt-color-indigo-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-600-h) var(--dt-color-indigo-600-s) var(--dt-color-indigo-600-l) / 0%) !important |
| `d-bgg-from-indigo-700` | --bgg-from-opacity: var(--dt-color-indigo-700-a); --bgg-from: oklch(from var(--dt-color-indigo-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-700-h) var(--dt-color-indigo-700-s) var(--dt-color-indigo-700-l) / 0%) !important |
| `d-bgg-from-indigo-800` | --bgg-from-opacity: var(--dt-color-indigo-800-a); --bgg-from: oklch(from var(--dt-color-indigo-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-800-h) var(--dt-color-indigo-800-s) var(--dt-color-indigo-800-l) / 0%) !important |
| `d-bgg-from-indigo-900` | --bgg-from-opacity: var(--dt-color-indigo-900-a); --bgg-from: oklch(from var(--dt-color-indigo-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-900-h) var(--dt-color-indigo-900-s) var(--dt-color-indigo-900-l) / 0%) !important |
| `d-bgg-from-indigo-950` | --bgg-from-opacity: var(--dt-color-indigo-950-a); --bgg-from: oklch(from var(--dt-color-indigo-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-950-h) var(--dt-color-indigo-950-s) var(--dt-color-indigo-950-l) / 0%) !important |
| `d-bgg-from-magenta-100` | --bgg-from-opacity: var(--dt-color-magenta-100-a); --bgg-from: oklch(from var(--dt-color-magenta-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-100-h) var(--dt-color-magenta-100-s) var(--dt-color-magenta-100-l) / 0%) !important |
| `d-bgg-from-magenta-1000` | --bgg-from-opacity: var(--dt-color-magenta-1000-a); --bgg-from: oklch(from var(--dt-color-magenta-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-1000-h) var(--dt-color-magenta-1000-s) var(--dt-color-magenta-1000-l) / 0%) !important |
| `d-bgg-from-magenta-200` | --bgg-from-opacity: var(--dt-color-magenta-200-a); --bgg-from: oklch(from var(--dt-color-magenta-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-200-h) var(--dt-color-magenta-200-s) var(--dt-color-magenta-200-l) / 0%) !important |
| `d-bgg-from-magenta-250` | --bgg-from-opacity: var(--dt-color-magenta-250-a); --bgg-from: oklch(from var(--dt-color-magenta-250) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-250-h) var(--dt-color-magenta-250-s) var(--dt-color-magenta-250-l) / 0%) !important |
| `d-bgg-from-magenta-300` | --bgg-from-opacity: var(--dt-color-magenta-300-a); --bgg-from: oklch(from var(--dt-color-magenta-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-300-h) var(--dt-color-magenta-300-s) var(--dt-color-magenta-300-l) / 0%) !important |
| `d-bgg-from-magenta-400` | --bgg-from-opacity: var(--dt-color-magenta-400-a); --bgg-from: oklch(from var(--dt-color-magenta-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-400-h) var(--dt-color-magenta-400-s) var(--dt-color-magenta-400-l) / 0%) !important |
| `d-bgg-from-magenta-425` | --bgg-from-opacity: var(--dt-color-magenta-425-a); --bgg-from: oklch(from var(--dt-color-magenta-425) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-425-h) var(--dt-color-magenta-425-s) var(--dt-color-magenta-425-l) / 0%) !important |
| `d-bgg-from-magenta-475` | --bgg-from-opacity: var(--dt-color-magenta-475-a); --bgg-from: oklch(from var(--dt-color-magenta-475) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-475-h) var(--dt-color-magenta-475-s) var(--dt-color-magenta-475-l) / 0%) !important |
| `d-bgg-from-magenta-50` | --bgg-from-opacity: var(--dt-color-magenta-50-a); --bgg-from: oklch(from var(--dt-color-magenta-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-50-h) var(--dt-color-magenta-50-s) var(--dt-color-magenta-50-l) / 0%) !important |
| `d-bgg-from-magenta-500` | --bgg-from-opacity: var(--dt-color-magenta-500-a); --bgg-from: oklch(from var(--dt-color-magenta-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-500-h) var(--dt-color-magenta-500-s) var(--dt-color-magenta-500-l) / 0%) !important |
| `d-bgg-from-magenta-600` | --bgg-from-opacity: var(--dt-color-magenta-600-a); --bgg-from: oklch(from var(--dt-color-magenta-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-600-h) var(--dt-color-magenta-600-s) var(--dt-color-magenta-600-l) / 0%) !important |
| `d-bgg-from-magenta-900` | --bgg-from-opacity: var(--dt-color-magenta-900-a); --bgg-from: oklch(from var(--dt-color-magenta-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-900-h) var(--dt-color-magenta-900-s) var(--dt-color-magenta-900-l) / 0%) !important |
| `d-bgg-from-neutral-black` | --bgg-from-opacity: var(--dt-color-neutral-black-a); --bgg-from: oklch(from var(--dt-color-neutral-black) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-neutral-black-h) var(--dt-color-neutral-black-s) var(--dt-color-neutral-black-l) / 0%) !important |
| `d-bgg-from-neutral-transparent` | --bgg-from-opacity: var(--dt-color-neutral-transparent-a); --bgg-from: oklch(from var(--dt-color-neutral-transparent) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-neutral-transparent-h) var(--dt-color-neutral-transparent-s) var(--dt-color-neutral-transparent-l) / 0%) !important |
| `d-bgg-from-neutral-white` | --bgg-from-opacity: var(--dt-color-neutral-white-a); --bgg-from: oklch(from var(--dt-color-neutral-white) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-neutral-white-h) var(--dt-color-neutral-white-s) var(--dt-color-neutral-white-l) / 0%) !important |
| `d-bgg-from-o0` | --bgg-from-opacity: 0% !important |
| `d-bgg-from-o10` | --bgg-from-opacity: 10% !important |
| `d-bgg-from-o100` | --bgg-from-opacity: 100% !important |
| `d-bgg-from-o25` | --bgg-from-opacity: 25% !important |
| `d-bgg-from-o50` | --bgg-from-opacity: 50% !important |
| `d-bgg-from-o75` | --bgg-from-opacity: 75% !important |
| `d-bgg-from-o85` | --bgg-from-opacity: 85% !important |
| `d-bgg-from-o90` | --bgg-from-opacity: 90% !important |
| `d-bgg-from-o95` | --bgg-from-opacity: 95% !important |
| `d-bgg-from-o99` | --bgg-from-opacity: 99% !important |
| `d-bgg-from-olive-100` | --bgg-from-opacity: var(--dt-color-olive-100-a); --bgg-from: oklch(from var(--dt-color-olive-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-100-h) var(--dt-color-olive-100-s) var(--dt-color-olive-100-l) / 0%) !important |
| `d-bgg-from-olive-1000` | --bgg-from-opacity: var(--dt-color-olive-1000-a); --bgg-from: oklch(from var(--dt-color-olive-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-1000-h) var(--dt-color-olive-1000-s) var(--dt-color-olive-1000-l) / 0%) !important |
| `d-bgg-from-olive-200` | --bgg-from-opacity: var(--dt-color-olive-200-a); --bgg-from: oklch(from var(--dt-color-olive-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-200-h) var(--dt-color-olive-200-s) var(--dt-color-olive-200-l) / 0%) !important |
| `d-bgg-from-olive-300` | --bgg-from-opacity: var(--dt-color-olive-300-a); --bgg-from: oklch(from var(--dt-color-olive-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-300-h) var(--dt-color-olive-300-s) var(--dt-color-olive-300-l) / 0%) !important |
| `d-bgg-from-olive-400` | --bgg-from-opacity: var(--dt-color-olive-400-a); --bgg-from: oklch(from var(--dt-color-olive-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-400-h) var(--dt-color-olive-400-s) var(--dt-color-olive-400-l) / 0%) !important |
| `d-bgg-from-olive-50` | --bgg-from-opacity: var(--dt-color-olive-50-a); --bgg-from: oklch(from var(--dt-color-olive-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-50-h) var(--dt-color-olive-50-s) var(--dt-color-olive-50-l) / 0%) !important |
| `d-bgg-from-olive-500` | --bgg-from-opacity: var(--dt-color-olive-500-a); --bgg-from: oklch(from var(--dt-color-olive-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-500-h) var(--dt-color-olive-500-s) var(--dt-color-olive-500-l) / 0%) !important |
| `d-bgg-from-olive-600` | --bgg-from-opacity: var(--dt-color-olive-600-a); --bgg-from: oklch(from var(--dt-color-olive-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-600-h) var(--dt-color-olive-600-s) var(--dt-color-olive-600-l) / 0%) !important |
| `d-bgg-from-olive-700` | --bgg-from-opacity: var(--dt-color-olive-700-a); --bgg-from: oklch(from var(--dt-color-olive-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-700-h) var(--dt-color-olive-700-s) var(--dt-color-olive-700-l) / 0%) !important |
| `d-bgg-from-olive-800` | --bgg-from-opacity: var(--dt-color-olive-800-a); --bgg-from: oklch(from var(--dt-color-olive-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-800-h) var(--dt-color-olive-800-s) var(--dt-color-olive-800-l) / 0%) !important |
| `d-bgg-from-olive-900` | --bgg-from-opacity: var(--dt-color-olive-900-a); --bgg-from: oklch(from var(--dt-color-olive-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-900-h) var(--dt-color-olive-900-s) var(--dt-color-olive-900-l) / 0%) !important |
| `d-bgg-from-olive-950` | --bgg-from-opacity: var(--dt-color-olive-950-a); --bgg-from: oklch(from var(--dt-color-olive-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-950-h) var(--dt-color-olive-950-s) var(--dt-color-olive-950-l) / 0%) !important |
| `d-bgg-from-purple-100` | --bgg-from-opacity: var(--dt-color-purple-100-a); --bgg-from: oklch(from var(--dt-color-purple-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-100-h) var(--dt-color-purple-100-s) var(--dt-color-purple-100-l) / 0%) !important |
| `d-bgg-from-purple-1000` | --bgg-from-opacity: var(--dt-color-purple-1000-a); --bgg-from: oklch(from var(--dt-color-purple-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-1000-h) var(--dt-color-purple-1000-s) var(--dt-color-purple-1000-l) / 0%) !important |
| `d-bgg-from-purple-200` | --bgg-from-opacity: var(--dt-color-purple-200-a); --bgg-from: oklch(from var(--dt-color-purple-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-200-h) var(--dt-color-purple-200-s) var(--dt-color-purple-200-l) / 0%) !important |
| `d-bgg-from-purple-250` | --bgg-from-opacity: var(--dt-color-purple-250-a); --bgg-from: oklch(from var(--dt-color-purple-250) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-250-h) var(--dt-color-purple-250-s) var(--dt-color-purple-250-l) / 0%) !important |
| `d-bgg-from-purple-300` | --bgg-from-opacity: var(--dt-color-purple-300-a); --bgg-from: oklch(from var(--dt-color-purple-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-300-h) var(--dt-color-purple-300-s) var(--dt-color-purple-300-l) / 0%) !important |
| `d-bgg-from-purple-350` | --bgg-from-opacity: var(--dt-color-purple-350-a); --bgg-from: oklch(from var(--dt-color-purple-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-350-h) var(--dt-color-purple-350-s) var(--dt-color-purple-350-l) / 0%) !important |
| `d-bgg-from-purple-400` | --bgg-from-opacity: var(--dt-color-purple-400-a); --bgg-from: oklch(from var(--dt-color-purple-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-400-h) var(--dt-color-purple-400-s) var(--dt-color-purple-400-l) / 0%) !important |
| `d-bgg-from-purple-450` | --bgg-from-opacity: var(--dt-color-purple-450-a); --bgg-from: oklch(from var(--dt-color-purple-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-450-h) var(--dt-color-purple-450-s) var(--dt-color-purple-450-l) / 0%) !important |
| `d-bgg-from-purple-50` | --bgg-from-opacity: var(--dt-color-purple-50-a); --bgg-from: oklch(from var(--dt-color-purple-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-50-h) var(--dt-color-purple-50-s) var(--dt-color-purple-50-l) / 0%) !important |
| `d-bgg-from-purple-500` | --bgg-from-opacity: var(--dt-color-purple-500-a); --bgg-from: oklch(from var(--dt-color-purple-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-500-h) var(--dt-color-purple-500-s) var(--dt-color-purple-500-l) / 0%) !important |
| `d-bgg-from-purple-550` | --bgg-from-opacity: var(--dt-color-purple-550-a); --bgg-from: oklch(from var(--dt-color-purple-550) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-550-h) var(--dt-color-purple-550-s) var(--dt-color-purple-550-l) / 0%) !important |
| `d-bgg-from-purple-600` | --bgg-from-opacity: var(--dt-color-purple-600-a); --bgg-from: oklch(from var(--dt-color-purple-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-600-h) var(--dt-color-purple-600-s) var(--dt-color-purple-600-l) / 0%) !important |
| `d-bgg-from-red-100` | --bgg-from-opacity: var(--dt-color-red-100-a); --bgg-from: oklch(from var(--dt-color-red-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-100-h) var(--dt-color-red-100-s) var(--dt-color-red-100-l) / 0%) !important |
| `d-bgg-from-red-1000` | --bgg-from-opacity: var(--dt-color-red-1000-a); --bgg-from: oklch(from var(--dt-color-red-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-1000-h) var(--dt-color-red-1000-s) var(--dt-color-red-1000-l) / 0%) !important |
| `d-bgg-from-red-200` | --bgg-from-opacity: var(--dt-color-red-200-a); --bgg-from: oklch(from var(--dt-color-red-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-200-h) var(--dt-color-red-200-s) var(--dt-color-red-200-l) / 0%) !important |
| `d-bgg-from-red-300` | --bgg-from-opacity: var(--dt-color-red-300-a); --bgg-from: oklch(from var(--dt-color-red-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-300-h) var(--dt-color-red-300-s) var(--dt-color-red-300-l) / 0%) !important |
| `d-bgg-from-red-350` | --bgg-from-opacity: var(--dt-color-red-350-a); --bgg-from: oklch(from var(--dt-color-red-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-350-h) var(--dt-color-red-350-s) var(--dt-color-red-350-l) / 0%) !important |
| `d-bgg-from-red-400` | --bgg-from-opacity: var(--dt-color-red-400-a); --bgg-from: oklch(from var(--dt-color-red-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-400-h) var(--dt-color-red-400-s) var(--dt-color-red-400-l) / 0%) !important |
| `d-bgg-from-red-450` | --bgg-from-opacity: var(--dt-color-red-450-a); --bgg-from: oklch(from var(--dt-color-red-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-450-h) var(--dt-color-red-450-s) var(--dt-color-red-450-l) / 0%) !important |
| `d-bgg-from-red-50` | --bgg-from-opacity: var(--dt-color-red-50-a); --bgg-from: oklch(from var(--dt-color-red-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-50-h) var(--dt-color-red-50-s) var(--dt-color-red-50-l) / 0%) !important |
| `d-bgg-from-red-500` | --bgg-from-opacity: var(--dt-color-red-500-a); --bgg-from: oklch(from var(--dt-color-red-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-500-h) var(--dt-color-red-500-s) var(--dt-color-red-500-l) / 0%) !important |
| `d-bgg-from-red-600` | --bgg-from-opacity: var(--dt-color-red-600-a); --bgg-from: oklch(from var(--dt-color-red-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-600-h) var(--dt-color-red-600-s) var(--dt-color-red-600-l) / 0%) !important |
| `d-bgg-from-red-700` | --bgg-from-opacity: var(--dt-color-red-700-a); --bgg-from: oklch(from var(--dt-color-red-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-700-h) var(--dt-color-red-700-s) var(--dt-color-red-700-l) / 0%) !important |
| `d-bgg-from-red-900` | --bgg-from-opacity: var(--dt-color-red-900-a); --bgg-from: oklch(from var(--dt-color-red-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-900-h) var(--dt-color-red-900-s) var(--dt-color-red-900-l) / 0%) !important |
| `d-bgg-from-tan-100` | --bgg-from-opacity: var(--dt-color-tan-100-a); --bgg-from: oklch(from var(--dt-color-tan-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-100-h) var(--dt-color-tan-100-s) var(--dt-color-tan-100-l) / 0%) !important |
| `d-bgg-from-tan-1000` | --bgg-from-opacity: var(--dt-color-tan-1000-a); --bgg-from: oklch(from var(--dt-color-tan-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-1000-h) var(--dt-color-tan-1000-s) var(--dt-color-tan-1000-l) / 0%) !important |
| `d-bgg-from-tan-200` | --bgg-from-opacity: var(--dt-color-tan-200-a); --bgg-from: oklch(from var(--dt-color-tan-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-200-h) var(--dt-color-tan-200-s) var(--dt-color-tan-200-l) / 0%) !important |
| `d-bgg-from-tan-300` | --bgg-from-opacity: var(--dt-color-tan-300-a); --bgg-from: oklch(from var(--dt-color-tan-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-300-h) var(--dt-color-tan-300-s) var(--dt-color-tan-300-l) / 0%) !important |
| `d-bgg-from-tan-400` | --bgg-from-opacity: var(--dt-color-tan-400-a); --bgg-from: oklch(from var(--dt-color-tan-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-400-h) var(--dt-color-tan-400-s) var(--dt-color-tan-400-l) / 0%) !important |
| `d-bgg-from-tan-50` | --bgg-from-opacity: var(--dt-color-tan-50-a); --bgg-from: oklch(from var(--dt-color-tan-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-50-h) var(--dt-color-tan-50-s) var(--dt-color-tan-50-l) / 0%) !important |
| `d-bgg-from-tan-500` | --bgg-from-opacity: var(--dt-color-tan-500-a); --bgg-from: oklch(from var(--dt-color-tan-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-500-h) var(--dt-color-tan-500-s) var(--dt-color-tan-500-l) / 0%) !important |
| `d-bgg-from-tan-600` | --bgg-from-opacity: var(--dt-color-tan-600-a); --bgg-from: oklch(from var(--dt-color-tan-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-600-h) var(--dt-color-tan-600-s) var(--dt-color-tan-600-l) / 0%) !important |
| `d-bgg-from-tan-700` | --bgg-from-opacity: var(--dt-color-tan-700-a); --bgg-from: oklch(from var(--dt-color-tan-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-700-h) var(--dt-color-tan-700-s) var(--dt-color-tan-700-l) / 0%) !important |
| `d-bgg-from-tan-800` | --bgg-from-opacity: var(--dt-color-tan-800-a); --bgg-from: oklch(from var(--dt-color-tan-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-800-h) var(--dt-color-tan-800-s) var(--dt-color-tan-800-l) / 0%) !important |
| `d-bgg-from-tan-900` | --bgg-from-opacity: var(--dt-color-tan-900-a); --bgg-from: oklch(from var(--dt-color-tan-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-900-h) var(--dt-color-tan-900-s) var(--dt-color-tan-900-l) / 0%) !important |
| `d-bgg-from-tan-950` | --bgg-from-opacity: var(--dt-color-tan-950-a); --bgg-from: oklch(from var(--dt-color-tan-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-950-h) var(--dt-color-tan-950-s) var(--dt-color-tan-950-l) / 0%) !important |
| `d-bgg-from-teal-100` | --bgg-from-opacity: var(--dt-color-teal-100-a); --bgg-from: oklch(from var(--dt-color-teal-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-100-h) var(--dt-color-teal-100-s) var(--dt-color-teal-100-l) / 0%) !important |
| `d-bgg-from-teal-1000` | --bgg-from-opacity: var(--dt-color-teal-1000-a); --bgg-from: oklch(from var(--dt-color-teal-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-1000-h) var(--dt-color-teal-1000-s) var(--dt-color-teal-1000-l) / 0%) !important |
| `d-bgg-from-teal-200` | --bgg-from-opacity: var(--dt-color-teal-200-a); --bgg-from: oklch(from var(--dt-color-teal-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-200-h) var(--dt-color-teal-200-s) var(--dt-color-teal-200-l) / 0%) !important |
| `d-bgg-from-teal-300` | --bgg-from-opacity: var(--dt-color-teal-300-a); --bgg-from: oklch(from var(--dt-color-teal-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-300-h) var(--dt-color-teal-300-s) var(--dt-color-teal-300-l) / 0%) !important |
| `d-bgg-from-teal-400` | --bgg-from-opacity: var(--dt-color-teal-400-a); --bgg-from: oklch(from var(--dt-color-teal-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-400-h) var(--dt-color-teal-400-s) var(--dt-color-teal-400-l) / 0%) !important |
| `d-bgg-from-teal-50` | --bgg-from-opacity: var(--dt-color-teal-50-a); --bgg-from: oklch(from var(--dt-color-teal-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-50-h) var(--dt-color-teal-50-s) var(--dt-color-teal-50-l) / 0%) !important |
| `d-bgg-from-teal-500` | --bgg-from-opacity: var(--dt-color-teal-500-a); --bgg-from: oklch(from var(--dt-color-teal-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-500-h) var(--dt-color-teal-500-s) var(--dt-color-teal-500-l) / 0%) !important |
| `d-bgg-from-teal-600` | --bgg-from-opacity: var(--dt-color-teal-600-a); --bgg-from: oklch(from var(--dt-color-teal-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-600-h) var(--dt-color-teal-600-s) var(--dt-color-teal-600-l) / 0%) !important |
| `d-bgg-from-teal-700` | --bgg-from-opacity: var(--dt-color-teal-700-a); --bgg-from: oklch(from var(--dt-color-teal-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-700-h) var(--dt-color-teal-700-s) var(--dt-color-teal-700-l) / 0%) !important |
| `d-bgg-from-teal-800` | --bgg-from-opacity: var(--dt-color-teal-800-a); --bgg-from: oklch(from var(--dt-color-teal-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-800-h) var(--dt-color-teal-800-s) var(--dt-color-teal-800-l) / 0%) !important |
| `d-bgg-from-teal-900` | --bgg-from-opacity: var(--dt-color-teal-900-a); --bgg-from: oklch(from var(--dt-color-teal-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-900-h) var(--dt-color-teal-900-s) var(--dt-color-teal-900-l) / 0%) !important |
| `d-bgg-from-teal-950` | --bgg-from-opacity: var(--dt-color-teal-950-a); --bgg-from: oklch(from var(--dt-color-teal-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-950-h) var(--dt-color-teal-950-s) var(--dt-color-teal-950-l) / 0%) !important |
| `d-bgg-none` | background-image: none !important |
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
| `d-bgg-radial` | background-image: radial-gradient(var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-b` | background-image: linear-gradient(to bottom, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-berry-100` | --bgg-to-opacity: var(--dt-color-berry-100-a); --bgg-to: oklch(from var(--dt-color-berry-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-1000` | --bgg-to-opacity: var(--dt-color-berry-1000-a); --bgg-to: oklch(from var(--dt-color-berry-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-200` | --bgg-to-opacity: var(--dt-color-berry-200-a); --bgg-to: oklch(from var(--dt-color-berry-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-300` | --bgg-to-opacity: var(--dt-color-berry-300-a); --bgg-to: oklch(from var(--dt-color-berry-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-400` | --bgg-to-opacity: var(--dt-color-berry-400-a); --bgg-to: oklch(from var(--dt-color-berry-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-50` | --bgg-to-opacity: var(--dt-color-berry-50-a); --bgg-to: oklch(from var(--dt-color-berry-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-500` | --bgg-to-opacity: var(--dt-color-berry-500-a); --bgg-to: oklch(from var(--dt-color-berry-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-600` | --bgg-to-opacity: var(--dt-color-berry-600-a); --bgg-to: oklch(from var(--dt-color-berry-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-700` | --bgg-to-opacity: var(--dt-color-berry-700-a); --bgg-to: oklch(from var(--dt-color-berry-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-800` | --bgg-to-opacity: var(--dt-color-berry-800-a); --bgg-to: oklch(from var(--dt-color-berry-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-900` | --bgg-to-opacity: var(--dt-color-berry-900-a); --bgg-to: oklch(from var(--dt-color-berry-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-950` | --bgg-to-opacity: var(--dt-color-berry-950-a); --bgg-to: oklch(from var(--dt-color-berry-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-bl` | background-image: linear-gradient(to bottom left, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-black-100` | --bgg-to-opacity: var(--dt-color-black-100-a); --bgg-to: oklch(from var(--dt-color-black-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-1000` | --bgg-to-opacity: var(--dt-color-black-1000-a); --bgg-to: oklch(from var(--dt-color-black-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-200` | --bgg-to-opacity: var(--dt-color-black-200-a); --bgg-to: oklch(from var(--dt-color-black-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-300` | --bgg-to-opacity: var(--dt-color-black-300-a); --bgg-to: oklch(from var(--dt-color-black-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-400` | --bgg-to-opacity: var(--dt-color-black-400-a); --bgg-to: oklch(from var(--dt-color-black-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-50` | --bgg-to-opacity: var(--dt-color-black-50-a); --bgg-to: oklch(from var(--dt-color-black-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-500` | --bgg-to-opacity: var(--dt-color-black-500-a); --bgg-to: oklch(from var(--dt-color-black-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-600` | --bgg-to-opacity: var(--dt-color-black-600-a); --bgg-to: oklch(from var(--dt-color-black-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-700` | --bgg-to-opacity: var(--dt-color-black-700-a); --bgg-to: oklch(from var(--dt-color-black-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-800` | --bgg-to-opacity: var(--dt-color-black-800-a); --bgg-to: oklch(from var(--dt-color-black-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-900` | --bgg-to-opacity: var(--dt-color-black-900-a); --bgg-to: oklch(from var(--dt-color-black-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-950` | --bgg-to-opacity: var(--dt-color-black-950-a); --bgg-to: oklch(from var(--dt-color-black-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-100` | --bgg-to-opacity: var(--dt-color-blue-100-a); --bgg-to: oklch(from var(--dt-color-blue-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-1000` | --bgg-to-opacity: var(--dt-color-blue-1000-a); --bgg-to: oklch(from var(--dt-color-blue-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-200` | --bgg-to-opacity: var(--dt-color-blue-200-a); --bgg-to: oklch(from var(--dt-color-blue-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-300` | --bgg-to-opacity: var(--dt-color-blue-300-a); --bgg-to: oklch(from var(--dt-color-blue-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-400` | --bgg-to-opacity: var(--dt-color-blue-400-a); --bgg-to: oklch(from var(--dt-color-blue-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-425` | --bgg-to-opacity: var(--dt-color-blue-425-a); --bgg-to: oklch(from var(--dt-color-blue-425) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-450` | --bgg-to-opacity: var(--dt-color-blue-450-a); --bgg-to: oklch(from var(--dt-color-blue-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-475` | --bgg-to-opacity: var(--dt-color-blue-475-a); --bgg-to: oklch(from var(--dt-color-blue-475) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-50` | --bgg-to-opacity: var(--dt-color-blue-50-a); --bgg-to: oklch(from var(--dt-color-blue-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-500` | --bgg-to-opacity: var(--dt-color-blue-500-a); --bgg-to: oklch(from var(--dt-color-blue-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-600` | --bgg-to-opacity: var(--dt-color-blue-600-a); --bgg-to: oklch(from var(--dt-color-blue-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-900` | --bgg-to-opacity: var(--dt-color-blue-900-a); --bgg-to: oklch(from var(--dt-color-blue-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-br` | background-image: linear-gradient(to bottom right, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-coral-100` | --bgg-to-opacity: var(--dt-color-coral-100-a); --bgg-to: oklch(from var(--dt-color-coral-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-1000` | --bgg-to-opacity: var(--dt-color-coral-1000-a); --bgg-to: oklch(from var(--dt-color-coral-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-200` | --bgg-to-opacity: var(--dt-color-coral-200-a); --bgg-to: oklch(from var(--dt-color-coral-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-300` | --bgg-to-opacity: var(--dt-color-coral-300-a); --bgg-to: oklch(from var(--dt-color-coral-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-400` | --bgg-to-opacity: var(--dt-color-coral-400-a); --bgg-to: oklch(from var(--dt-color-coral-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-50` | --bgg-to-opacity: var(--dt-color-coral-50-a); --bgg-to: oklch(from var(--dt-color-coral-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-500` | --bgg-to-opacity: var(--dt-color-coral-500-a); --bgg-to: oklch(from var(--dt-color-coral-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-600` | --bgg-to-opacity: var(--dt-color-coral-600-a); --bgg-to: oklch(from var(--dt-color-coral-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-700` | --bgg-to-opacity: var(--dt-color-coral-700-a); --bgg-to: oklch(from var(--dt-color-coral-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-800` | --bgg-to-opacity: var(--dt-color-coral-800-a); --bgg-to: oklch(from var(--dt-color-coral-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-900` | --bgg-to-opacity: var(--dt-color-coral-900-a); --bgg-to: oklch(from var(--dt-color-coral-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-950` | --bgg-to-opacity: var(--dt-color-coral-950-a); --bgg-to: oklch(from var(--dt-color-coral-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-100` | --bgg-to-opacity: var(--dt-color-gold-100-a); --bgg-to: oklch(from var(--dt-color-gold-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-1000` | --bgg-to-opacity: var(--dt-color-gold-1000-a); --bgg-to: oklch(from var(--dt-color-gold-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-200` | --bgg-to-opacity: var(--dt-color-gold-200-a); --bgg-to: oklch(from var(--dt-color-gold-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-300` | --bgg-to-opacity: var(--dt-color-gold-300-a); --bgg-to: oklch(from var(--dt-color-gold-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-350` | --bgg-to-opacity: var(--dt-color-gold-350-a); --bgg-to: oklch(from var(--dt-color-gold-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-400` | --bgg-to-opacity: var(--dt-color-gold-400-a); --bgg-to: oklch(from var(--dt-color-gold-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-450` | --bgg-to-opacity: var(--dt-color-gold-450-a); --bgg-to: oklch(from var(--dt-color-gold-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-50` | --bgg-to-opacity: var(--dt-color-gold-50-a); --bgg-to: oklch(from var(--dt-color-gold-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-500` | --bgg-to-opacity: var(--dt-color-gold-500-a); --bgg-to: oklch(from var(--dt-color-gold-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-600` | --bgg-to-opacity: var(--dt-color-gold-600-a); --bgg-to: oklch(from var(--dt-color-gold-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-700` | --bgg-to-opacity: var(--dt-color-gold-700-a); --bgg-to: oklch(from var(--dt-color-gold-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-900` | --bgg-to-opacity: var(--dt-color-gold-900-a); --bgg-to: oklch(from var(--dt-color-gold-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-100` | --bgg-to-opacity: var(--dt-color-green-100-a); --bgg-to: oklch(from var(--dt-color-green-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-1000` | --bgg-to-opacity: var(--dt-color-green-1000-a); --bgg-to: oklch(from var(--dt-color-green-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-200` | --bgg-to-opacity: var(--dt-color-green-200-a); --bgg-to: oklch(from var(--dt-color-green-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-300` | --bgg-to-opacity: var(--dt-color-green-300-a); --bgg-to: oklch(from var(--dt-color-green-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-350` | --bgg-to-opacity: var(--dt-color-green-350-a); --bgg-to: oklch(from var(--dt-color-green-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-400` | --bgg-to-opacity: var(--dt-color-green-400-a); --bgg-to: oklch(from var(--dt-color-green-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-425` | --bgg-to-opacity: var(--dt-color-green-425-a); --bgg-to: oklch(from var(--dt-color-green-425) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-475` | --bgg-to-opacity: var(--dt-color-green-475-a); --bgg-to: oklch(from var(--dt-color-green-475) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-50` | --bgg-to-opacity: var(--dt-color-green-50-a); --bgg-to: oklch(from var(--dt-color-green-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-500` | --bgg-to-opacity: var(--dt-color-green-500-a); --bgg-to: oklch(from var(--dt-color-green-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-600` | --bgg-to-opacity: var(--dt-color-green-600-a); --bgg-to: oklch(from var(--dt-color-green-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-900` | --bgg-to-opacity: var(--dt-color-green-900-a); --bgg-to: oklch(from var(--dt-color-green-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-100` | --bgg-to-opacity: var(--dt-color-indigo-100-a); --bgg-to: oklch(from var(--dt-color-indigo-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-1000` | --bgg-to-opacity: var(--dt-color-indigo-1000-a); --bgg-to: oklch(from var(--dt-color-indigo-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-200` | --bgg-to-opacity: var(--dt-color-indigo-200-a); --bgg-to: oklch(from var(--dt-color-indigo-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-300` | --bgg-to-opacity: var(--dt-color-indigo-300-a); --bgg-to: oklch(from var(--dt-color-indigo-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-400` | --bgg-to-opacity: var(--dt-color-indigo-400-a); --bgg-to: oklch(from var(--dt-color-indigo-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-50` | --bgg-to-opacity: var(--dt-color-indigo-50-a); --bgg-to: oklch(from var(--dt-color-indigo-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-500` | --bgg-to-opacity: var(--dt-color-indigo-500-a); --bgg-to: oklch(from var(--dt-color-indigo-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-600` | --bgg-to-opacity: var(--dt-color-indigo-600-a); --bgg-to: oklch(from var(--dt-color-indigo-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-700` | --bgg-to-opacity: var(--dt-color-indigo-700-a); --bgg-to: oklch(from var(--dt-color-indigo-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-800` | --bgg-to-opacity: var(--dt-color-indigo-800-a); --bgg-to: oklch(from var(--dt-color-indigo-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-900` | --bgg-to-opacity: var(--dt-color-indigo-900-a); --bgg-to: oklch(from var(--dt-color-indigo-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-950` | --bgg-to-opacity: var(--dt-color-indigo-950-a); --bgg-to: oklch(from var(--dt-color-indigo-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-l` | background-image: linear-gradient(to left, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-magenta-100` | --bgg-to-opacity: var(--dt-color-magenta-100-a); --bgg-to: oklch(from var(--dt-color-magenta-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-1000` | --bgg-to-opacity: var(--dt-color-magenta-1000-a); --bgg-to: oklch(from var(--dt-color-magenta-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-200` | --bgg-to-opacity: var(--dt-color-magenta-200-a); --bgg-to: oklch(from var(--dt-color-magenta-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-250` | --bgg-to-opacity: var(--dt-color-magenta-250-a); --bgg-to: oklch(from var(--dt-color-magenta-250) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-300` | --bgg-to-opacity: var(--dt-color-magenta-300-a); --bgg-to: oklch(from var(--dt-color-magenta-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-400` | --bgg-to-opacity: var(--dt-color-magenta-400-a); --bgg-to: oklch(from var(--dt-color-magenta-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-425` | --bgg-to-opacity: var(--dt-color-magenta-425-a); --bgg-to: oklch(from var(--dt-color-magenta-425) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-475` | --bgg-to-opacity: var(--dt-color-magenta-475-a); --bgg-to: oklch(from var(--dt-color-magenta-475) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-50` | --bgg-to-opacity: var(--dt-color-magenta-50-a); --bgg-to: oklch(from var(--dt-color-magenta-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-500` | --bgg-to-opacity: var(--dt-color-magenta-500-a); --bgg-to: oklch(from var(--dt-color-magenta-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-600` | --bgg-to-opacity: var(--dt-color-magenta-600-a); --bgg-to: oklch(from var(--dt-color-magenta-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-900` | --bgg-to-opacity: var(--dt-color-magenta-900-a); --bgg-to: oklch(from var(--dt-color-magenta-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-neutral-black` | --bgg-to-opacity: var(--dt-color-neutral-black-a); --bgg-to: oklch(from var(--dt-color-neutral-black) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-neutral-transparent` | --bgg-to-opacity: var(--dt-color-neutral-transparent-a); --bgg-to: oklch(from var(--dt-color-neutral-transparent) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-neutral-white` | --bgg-to-opacity: var(--dt-color-neutral-white-a); --bgg-to: oklch(from var(--dt-color-neutral-white) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-o0` | --bgg-to-opacity: 0% !important |
| `d-bgg-to-o10` | --bgg-to-opacity: 10% !important |
| `d-bgg-to-o100` | --bgg-to-opacity: 100% !important |
| `d-bgg-to-o25` | --bgg-to-opacity: 25% !important |
| `d-bgg-to-o50` | --bgg-to-opacity: 50% !important |
| `d-bgg-to-o75` | --bgg-to-opacity: 75% !important |
| `d-bgg-to-o85` | --bgg-to-opacity: 85% !important |
| `d-bgg-to-o90` | --bgg-to-opacity: 90% !important |
| `d-bgg-to-o95` | --bgg-to-opacity: 95% !important |
| `d-bgg-to-o99` | --bgg-to-opacity: 99% !important |
| `d-bgg-to-olive-100` | --bgg-to-opacity: var(--dt-color-olive-100-a); --bgg-to: oklch(from var(--dt-color-olive-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-1000` | --bgg-to-opacity: var(--dt-color-olive-1000-a); --bgg-to: oklch(from var(--dt-color-olive-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-200` | --bgg-to-opacity: var(--dt-color-olive-200-a); --bgg-to: oklch(from var(--dt-color-olive-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-300` | --bgg-to-opacity: var(--dt-color-olive-300-a); --bgg-to: oklch(from var(--dt-color-olive-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-400` | --bgg-to-opacity: var(--dt-color-olive-400-a); --bgg-to: oklch(from var(--dt-color-olive-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-50` | --bgg-to-opacity: var(--dt-color-olive-50-a); --bgg-to: oklch(from var(--dt-color-olive-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-500` | --bgg-to-opacity: var(--dt-color-olive-500-a); --bgg-to: oklch(from var(--dt-color-olive-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-600` | --bgg-to-opacity: var(--dt-color-olive-600-a); --bgg-to: oklch(from var(--dt-color-olive-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-700` | --bgg-to-opacity: var(--dt-color-olive-700-a); --bgg-to: oklch(from var(--dt-color-olive-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-800` | --bgg-to-opacity: var(--dt-color-olive-800-a); --bgg-to: oklch(from var(--dt-color-olive-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-900` | --bgg-to-opacity: var(--dt-color-olive-900-a); --bgg-to: oklch(from var(--dt-color-olive-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-950` | --bgg-to-opacity: var(--dt-color-olive-950-a); --bgg-to: oklch(from var(--dt-color-olive-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-100` | --bgg-to-opacity: var(--dt-color-purple-100-a); --bgg-to: oklch(from var(--dt-color-purple-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-1000` | --bgg-to-opacity: var(--dt-color-purple-1000-a); --bgg-to: oklch(from var(--dt-color-purple-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-200` | --bgg-to-opacity: var(--dt-color-purple-200-a); --bgg-to: oklch(from var(--dt-color-purple-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-250` | --bgg-to-opacity: var(--dt-color-purple-250-a); --bgg-to: oklch(from var(--dt-color-purple-250) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-300` | --bgg-to-opacity: var(--dt-color-purple-300-a); --bgg-to: oklch(from var(--dt-color-purple-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-350` | --bgg-to-opacity: var(--dt-color-purple-350-a); --bgg-to: oklch(from var(--dt-color-purple-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-400` | --bgg-to-opacity: var(--dt-color-purple-400-a); --bgg-to: oklch(from var(--dt-color-purple-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-450` | --bgg-to-opacity: var(--dt-color-purple-450-a); --bgg-to: oklch(from var(--dt-color-purple-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-50` | --bgg-to-opacity: var(--dt-color-purple-50-a); --bgg-to: oklch(from var(--dt-color-purple-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-500` | --bgg-to-opacity: var(--dt-color-purple-500-a); --bgg-to: oklch(from var(--dt-color-purple-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-550` | --bgg-to-opacity: var(--dt-color-purple-550-a); --bgg-to: oklch(from var(--dt-color-purple-550) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-600` | --bgg-to-opacity: var(--dt-color-purple-600-a); --bgg-to: oklch(from var(--dt-color-purple-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-r` | background-image: linear-gradient(to right, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-red-100` | --bgg-to-opacity: var(--dt-color-red-100-a); --bgg-to: oklch(from var(--dt-color-red-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-1000` | --bgg-to-opacity: var(--dt-color-red-1000-a); --bgg-to: oklch(from var(--dt-color-red-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-200` | --bgg-to-opacity: var(--dt-color-red-200-a); --bgg-to: oklch(from var(--dt-color-red-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-300` | --bgg-to-opacity: var(--dt-color-red-300-a); --bgg-to: oklch(from var(--dt-color-red-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-350` | --bgg-to-opacity: var(--dt-color-red-350-a); --bgg-to: oklch(from var(--dt-color-red-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-400` | --bgg-to-opacity: var(--dt-color-red-400-a); --bgg-to: oklch(from var(--dt-color-red-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-450` | --bgg-to-opacity: var(--dt-color-red-450-a); --bgg-to: oklch(from var(--dt-color-red-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-50` | --bgg-to-opacity: var(--dt-color-red-50-a); --bgg-to: oklch(from var(--dt-color-red-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-500` | --bgg-to-opacity: var(--dt-color-red-500-a); --bgg-to: oklch(from var(--dt-color-red-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-600` | --bgg-to-opacity: var(--dt-color-red-600-a); --bgg-to: oklch(from var(--dt-color-red-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-700` | --bgg-to-opacity: var(--dt-color-red-700-a); --bgg-to: oklch(from var(--dt-color-red-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-900` | --bgg-to-opacity: var(--dt-color-red-900-a); --bgg-to: oklch(from var(--dt-color-red-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-t` | background-image: linear-gradient(to top, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-tan-100` | --bgg-to-opacity: var(--dt-color-tan-100-a); --bgg-to: oklch(from var(--dt-color-tan-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-1000` | --bgg-to-opacity: var(--dt-color-tan-1000-a); --bgg-to: oklch(from var(--dt-color-tan-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-200` | --bgg-to-opacity: var(--dt-color-tan-200-a); --bgg-to: oklch(from var(--dt-color-tan-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-300` | --bgg-to-opacity: var(--dt-color-tan-300-a); --bgg-to: oklch(from var(--dt-color-tan-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-400` | --bgg-to-opacity: var(--dt-color-tan-400-a); --bgg-to: oklch(from var(--dt-color-tan-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-50` | --bgg-to-opacity: var(--dt-color-tan-50-a); --bgg-to: oklch(from var(--dt-color-tan-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-500` | --bgg-to-opacity: var(--dt-color-tan-500-a); --bgg-to: oklch(from var(--dt-color-tan-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-600` | --bgg-to-opacity: var(--dt-color-tan-600-a); --bgg-to: oklch(from var(--dt-color-tan-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-700` | --bgg-to-opacity: var(--dt-color-tan-700-a); --bgg-to: oklch(from var(--dt-color-tan-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-800` | --bgg-to-opacity: var(--dt-color-tan-800-a); --bgg-to: oklch(from var(--dt-color-tan-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-900` | --bgg-to-opacity: var(--dt-color-tan-900-a); --bgg-to: oklch(from var(--dt-color-tan-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-950` | --bgg-to-opacity: var(--dt-color-tan-950-a); --bgg-to: oklch(from var(--dt-color-tan-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-100` | --bgg-to-opacity: var(--dt-color-teal-100-a); --bgg-to: oklch(from var(--dt-color-teal-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-1000` | --bgg-to-opacity: var(--dt-color-teal-1000-a); --bgg-to: oklch(from var(--dt-color-teal-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-200` | --bgg-to-opacity: var(--dt-color-teal-200-a); --bgg-to: oklch(from var(--dt-color-teal-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-300` | --bgg-to-opacity: var(--dt-color-teal-300-a); --bgg-to: oklch(from var(--dt-color-teal-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-400` | --bgg-to-opacity: var(--dt-color-teal-400-a); --bgg-to: oklch(from var(--dt-color-teal-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-50` | --bgg-to-opacity: var(--dt-color-teal-50-a); --bgg-to: oklch(from var(--dt-color-teal-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-500` | --bgg-to-opacity: var(--dt-color-teal-500-a); --bgg-to: oklch(from var(--dt-color-teal-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-600` | --bgg-to-opacity: var(--dt-color-teal-600-a); --bgg-to: oklch(from var(--dt-color-teal-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-700` | --bgg-to-opacity: var(--dt-color-teal-700-a); --bgg-to: oklch(from var(--dt-color-teal-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-800` | --bgg-to-opacity: var(--dt-color-teal-800-a); --bgg-to: oklch(from var(--dt-color-teal-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-900` | --bgg-to-opacity: var(--dt-color-teal-900-a); --bgg-to: oklch(from var(--dt-color-teal-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-950` | --bgg-to-opacity: var(--dt-color-teal-950-a); --bgg-to: oklch(from var(--dt-color-teal-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tl` | background-image: linear-gradient(to top left, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-tr` | background-image: linear-gradient(to top right, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-unset` | background-image: unset !important |

## Color Stops

The starting stop (`d-bgg-from-{color}`) should be declared. Optionally an ending stop (`d-bgg-to-{color}`) can also be declared.

| Class | Output |
| --- | --- |
| `d-bgg-conic` | background-image: conic-gradient(var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-from-berry-100` | --bgg-from-opacity: var(--dt-color-berry-100-a); --bgg-from: oklch(from var(--dt-color-berry-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-100-h) var(--dt-color-berry-100-s) var(--dt-color-berry-100-l) / 0%) !important |
| `d-bgg-from-berry-1000` | --bgg-from-opacity: var(--dt-color-berry-1000-a); --bgg-from: oklch(from var(--dt-color-berry-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-1000-h) var(--dt-color-berry-1000-s) var(--dt-color-berry-1000-l) / 0%) !important |
| `d-bgg-from-berry-200` | --bgg-from-opacity: var(--dt-color-berry-200-a); --bgg-from: oklch(from var(--dt-color-berry-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-200-h) var(--dt-color-berry-200-s) var(--dt-color-berry-200-l) / 0%) !important |
| `d-bgg-from-berry-300` | --bgg-from-opacity: var(--dt-color-berry-300-a); --bgg-from: oklch(from var(--dt-color-berry-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-300-h) var(--dt-color-berry-300-s) var(--dt-color-berry-300-l) / 0%) !important |
| `d-bgg-from-berry-400` | --bgg-from-opacity: var(--dt-color-berry-400-a); --bgg-from: oklch(from var(--dt-color-berry-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-400-h) var(--dt-color-berry-400-s) var(--dt-color-berry-400-l) / 0%) !important |
| `d-bgg-from-berry-50` | --bgg-from-opacity: var(--dt-color-berry-50-a); --bgg-from: oklch(from var(--dt-color-berry-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-50-h) var(--dt-color-berry-50-s) var(--dt-color-berry-50-l) / 0%) !important |
| `d-bgg-from-berry-500` | --bgg-from-opacity: var(--dt-color-berry-500-a); --bgg-from: oklch(from var(--dt-color-berry-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-500-h) var(--dt-color-berry-500-s) var(--dt-color-berry-500-l) / 0%) !important |
| `d-bgg-from-berry-600` | --bgg-from-opacity: var(--dt-color-berry-600-a); --bgg-from: oklch(from var(--dt-color-berry-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-600-h) var(--dt-color-berry-600-s) var(--dt-color-berry-600-l) / 0%) !important |
| `d-bgg-from-berry-700` | --bgg-from-opacity: var(--dt-color-berry-700-a); --bgg-from: oklch(from var(--dt-color-berry-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-700-h) var(--dt-color-berry-700-s) var(--dt-color-berry-700-l) / 0%) !important |
| `d-bgg-from-berry-800` | --bgg-from-opacity: var(--dt-color-berry-800-a); --bgg-from: oklch(from var(--dt-color-berry-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-800-h) var(--dt-color-berry-800-s) var(--dt-color-berry-800-l) / 0%) !important |
| `d-bgg-from-berry-900` | --bgg-from-opacity: var(--dt-color-berry-900-a); --bgg-from: oklch(from var(--dt-color-berry-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-900-h) var(--dt-color-berry-900-s) var(--dt-color-berry-900-l) / 0%) !important |
| `d-bgg-from-berry-950` | --bgg-from-opacity: var(--dt-color-berry-950-a); --bgg-from: oklch(from var(--dt-color-berry-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-berry-950-h) var(--dt-color-berry-950-s) var(--dt-color-berry-950-l) / 0%) !important |
| `d-bgg-from-black-100` | --bgg-from-opacity: var(--dt-color-black-100-a); --bgg-from: oklch(from var(--dt-color-black-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-100-h) var(--dt-color-black-100-s) var(--dt-color-black-100-l) / 0%) !important |
| `d-bgg-from-black-1000` | --bgg-from-opacity: var(--dt-color-black-1000-a); --bgg-from: oklch(from var(--dt-color-black-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-1000-h) var(--dt-color-black-1000-s) var(--dt-color-black-1000-l) / 0%) !important |
| `d-bgg-from-black-200` | --bgg-from-opacity: var(--dt-color-black-200-a); --bgg-from: oklch(from var(--dt-color-black-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-200-h) var(--dt-color-black-200-s) var(--dt-color-black-200-l) / 0%) !important |
| `d-bgg-from-black-300` | --bgg-from-opacity: var(--dt-color-black-300-a); --bgg-from: oklch(from var(--dt-color-black-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-300-h) var(--dt-color-black-300-s) var(--dt-color-black-300-l) / 0%) !important |
| `d-bgg-from-black-400` | --bgg-from-opacity: var(--dt-color-black-400-a); --bgg-from: oklch(from var(--dt-color-black-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-400-h) var(--dt-color-black-400-s) var(--dt-color-black-400-l) / 0%) !important |
| `d-bgg-from-black-50` | --bgg-from-opacity: var(--dt-color-black-50-a); --bgg-from: oklch(from var(--dt-color-black-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-50-h) var(--dt-color-black-50-s) var(--dt-color-black-50-l) / 0%) !important |
| `d-bgg-from-black-500` | --bgg-from-opacity: var(--dt-color-black-500-a); --bgg-from: oklch(from var(--dt-color-black-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-500-h) var(--dt-color-black-500-s) var(--dt-color-black-500-l) / 0%) !important |
| `d-bgg-from-black-600` | --bgg-from-opacity: var(--dt-color-black-600-a); --bgg-from: oklch(from var(--dt-color-black-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-600-h) var(--dt-color-black-600-s) var(--dt-color-black-600-l) / 0%) !important |
| `d-bgg-from-black-700` | --bgg-from-opacity: var(--dt-color-black-700-a); --bgg-from: oklch(from var(--dt-color-black-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-700-h) var(--dt-color-black-700-s) var(--dt-color-black-700-l) / 0%) !important |
| `d-bgg-from-black-800` | --bgg-from-opacity: var(--dt-color-black-800-a); --bgg-from: oklch(from var(--dt-color-black-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-800-h) var(--dt-color-black-800-s) var(--dt-color-black-800-l) / 0%) !important |
| `d-bgg-from-black-900` | --bgg-from-opacity: var(--dt-color-black-900-a); --bgg-from: oklch(from var(--dt-color-black-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-900-h) var(--dt-color-black-900-s) var(--dt-color-black-900-l) / 0%) !important |
| `d-bgg-from-black-950` | --bgg-from-opacity: var(--dt-color-black-950-a); --bgg-from: oklch(from var(--dt-color-black-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-black-950-h) var(--dt-color-black-950-s) var(--dt-color-black-950-l) / 0%) !important |
| `d-bgg-from-blue-100` | --bgg-from-opacity: var(--dt-color-blue-100-a); --bgg-from: oklch(from var(--dt-color-blue-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-100-h) var(--dt-color-blue-100-s) var(--dt-color-blue-100-l) / 0%) !important |
| `d-bgg-from-blue-1000` | --bgg-from-opacity: var(--dt-color-blue-1000-a); --bgg-from: oklch(from var(--dt-color-blue-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-1000-h) var(--dt-color-blue-1000-s) var(--dt-color-blue-1000-l) / 0%) !important |
| `d-bgg-from-blue-200` | --bgg-from-opacity: var(--dt-color-blue-200-a); --bgg-from: oklch(from var(--dt-color-blue-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-200-h) var(--dt-color-blue-200-s) var(--dt-color-blue-200-l) / 0%) !important |
| `d-bgg-from-blue-300` | --bgg-from-opacity: var(--dt-color-blue-300-a); --bgg-from: oklch(from var(--dt-color-blue-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-300-h) var(--dt-color-blue-300-s) var(--dt-color-blue-300-l) / 0%) !important |
| `d-bgg-from-blue-400` | --bgg-from-opacity: var(--dt-color-blue-400-a); --bgg-from: oklch(from var(--dt-color-blue-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-400-h) var(--dt-color-blue-400-s) var(--dt-color-blue-400-l) / 0%) !important |
| `d-bgg-from-blue-425` | --bgg-from-opacity: var(--dt-color-blue-425-a); --bgg-from: oklch(from var(--dt-color-blue-425) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-425-h) var(--dt-color-blue-425-s) var(--dt-color-blue-425-l) / 0%) !important |
| `d-bgg-from-blue-450` | --bgg-from-opacity: var(--dt-color-blue-450-a); --bgg-from: oklch(from var(--dt-color-blue-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-450-h) var(--dt-color-blue-450-s) var(--dt-color-blue-450-l) / 0%) !important |
| `d-bgg-from-blue-475` | --bgg-from-opacity: var(--dt-color-blue-475-a); --bgg-from: oklch(from var(--dt-color-blue-475) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-475-h) var(--dt-color-blue-475-s) var(--dt-color-blue-475-l) / 0%) !important |
| `d-bgg-from-blue-50` | --bgg-from-opacity: var(--dt-color-blue-50-a); --bgg-from: oklch(from var(--dt-color-blue-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-50-h) var(--dt-color-blue-50-s) var(--dt-color-blue-50-l) / 0%) !important |
| `d-bgg-from-blue-500` | --bgg-from-opacity: var(--dt-color-blue-500-a); --bgg-from: oklch(from var(--dt-color-blue-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-500-h) var(--dt-color-blue-500-s) var(--dt-color-blue-500-l) / 0%) !important |
| `d-bgg-from-blue-600` | --bgg-from-opacity: var(--dt-color-blue-600-a); --bgg-from: oklch(from var(--dt-color-blue-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-600-h) var(--dt-color-blue-600-s) var(--dt-color-blue-600-l) / 0%) !important |
| `d-bgg-from-blue-900` | --bgg-from-opacity: var(--dt-color-blue-900-a); --bgg-from: oklch(from var(--dt-color-blue-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-blue-900-h) var(--dt-color-blue-900-s) var(--dt-color-blue-900-l) / 0%) !important |
| `d-bgg-from-coral-100` | --bgg-from-opacity: var(--dt-color-coral-100-a); --bgg-from: oklch(from var(--dt-color-coral-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-100-h) var(--dt-color-coral-100-s) var(--dt-color-coral-100-l) / 0%) !important |
| `d-bgg-from-coral-1000` | --bgg-from-opacity: var(--dt-color-coral-1000-a); --bgg-from: oklch(from var(--dt-color-coral-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-1000-h) var(--dt-color-coral-1000-s) var(--dt-color-coral-1000-l) / 0%) !important |
| `d-bgg-from-coral-200` | --bgg-from-opacity: var(--dt-color-coral-200-a); --bgg-from: oklch(from var(--dt-color-coral-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-200-h) var(--dt-color-coral-200-s) var(--dt-color-coral-200-l) / 0%) !important |
| `d-bgg-from-coral-300` | --bgg-from-opacity: var(--dt-color-coral-300-a); --bgg-from: oklch(from var(--dt-color-coral-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-300-h) var(--dt-color-coral-300-s) var(--dt-color-coral-300-l) / 0%) !important |
| `d-bgg-from-coral-400` | --bgg-from-opacity: var(--dt-color-coral-400-a); --bgg-from: oklch(from var(--dt-color-coral-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-400-h) var(--dt-color-coral-400-s) var(--dt-color-coral-400-l) / 0%) !important |
| `d-bgg-from-coral-50` | --bgg-from-opacity: var(--dt-color-coral-50-a); --bgg-from: oklch(from var(--dt-color-coral-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-50-h) var(--dt-color-coral-50-s) var(--dt-color-coral-50-l) / 0%) !important |
| `d-bgg-from-coral-500` | --bgg-from-opacity: var(--dt-color-coral-500-a); --bgg-from: oklch(from var(--dt-color-coral-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-500-h) var(--dt-color-coral-500-s) var(--dt-color-coral-500-l) / 0%) !important |
| `d-bgg-from-coral-600` | --bgg-from-opacity: var(--dt-color-coral-600-a); --bgg-from: oklch(from var(--dt-color-coral-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-600-h) var(--dt-color-coral-600-s) var(--dt-color-coral-600-l) / 0%) !important |
| `d-bgg-from-coral-700` | --bgg-from-opacity: var(--dt-color-coral-700-a); --bgg-from: oklch(from var(--dt-color-coral-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-700-h) var(--dt-color-coral-700-s) var(--dt-color-coral-700-l) / 0%) !important |
| `d-bgg-from-coral-800` | --bgg-from-opacity: var(--dt-color-coral-800-a); --bgg-from: oklch(from var(--dt-color-coral-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-800-h) var(--dt-color-coral-800-s) var(--dt-color-coral-800-l) / 0%) !important |
| `d-bgg-from-coral-900` | --bgg-from-opacity: var(--dt-color-coral-900-a); --bgg-from: oklch(from var(--dt-color-coral-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-900-h) var(--dt-color-coral-900-s) var(--dt-color-coral-900-l) / 0%) !important |
| `d-bgg-from-coral-950` | --bgg-from-opacity: var(--dt-color-coral-950-a); --bgg-from: oklch(from var(--dt-color-coral-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-coral-950-h) var(--dt-color-coral-950-s) var(--dt-color-coral-950-l) / 0%) !important |
| `d-bgg-from-gold-100` | --bgg-from-opacity: var(--dt-color-gold-100-a); --bgg-from: oklch(from var(--dt-color-gold-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-100-h) var(--dt-color-gold-100-s) var(--dt-color-gold-100-l) / 0%) !important |
| `d-bgg-from-gold-1000` | --bgg-from-opacity: var(--dt-color-gold-1000-a); --bgg-from: oklch(from var(--dt-color-gold-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-1000-h) var(--dt-color-gold-1000-s) var(--dt-color-gold-1000-l) / 0%) !important |
| `d-bgg-from-gold-200` | --bgg-from-opacity: var(--dt-color-gold-200-a); --bgg-from: oklch(from var(--dt-color-gold-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-200-h) var(--dt-color-gold-200-s) var(--dt-color-gold-200-l) / 0%) !important |
| `d-bgg-from-gold-300` | --bgg-from-opacity: var(--dt-color-gold-300-a); --bgg-from: oklch(from var(--dt-color-gold-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-300-h) var(--dt-color-gold-300-s) var(--dt-color-gold-300-l) / 0%) !important |
| `d-bgg-from-gold-350` | --bgg-from-opacity: var(--dt-color-gold-350-a); --bgg-from: oklch(from var(--dt-color-gold-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-350-h) var(--dt-color-gold-350-s) var(--dt-color-gold-350-l) / 0%) !important |
| `d-bgg-from-gold-400` | --bgg-from-opacity: var(--dt-color-gold-400-a); --bgg-from: oklch(from var(--dt-color-gold-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-400-h) var(--dt-color-gold-400-s) var(--dt-color-gold-400-l) / 0%) !important |
| `d-bgg-from-gold-450` | --bgg-from-opacity: var(--dt-color-gold-450-a); --bgg-from: oklch(from var(--dt-color-gold-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-450-h) var(--dt-color-gold-450-s) var(--dt-color-gold-450-l) / 0%) !important |
| `d-bgg-from-gold-50` | --bgg-from-opacity: var(--dt-color-gold-50-a); --bgg-from: oklch(from var(--dt-color-gold-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-50-h) var(--dt-color-gold-50-s) var(--dt-color-gold-50-l) / 0%) !important |
| `d-bgg-from-gold-500` | --bgg-from-opacity: var(--dt-color-gold-500-a); --bgg-from: oklch(from var(--dt-color-gold-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-500-h) var(--dt-color-gold-500-s) var(--dt-color-gold-500-l) / 0%) !important |
| `d-bgg-from-gold-600` | --bgg-from-opacity: var(--dt-color-gold-600-a); --bgg-from: oklch(from var(--dt-color-gold-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-600-h) var(--dt-color-gold-600-s) var(--dt-color-gold-600-l) / 0%) !important |
| `d-bgg-from-gold-700` | --bgg-from-opacity: var(--dt-color-gold-700-a); --bgg-from: oklch(from var(--dt-color-gold-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-700-h) var(--dt-color-gold-700-s) var(--dt-color-gold-700-l) / 0%) !important |
| `d-bgg-from-gold-900` | --bgg-from-opacity: var(--dt-color-gold-900-a); --bgg-from: oklch(from var(--dt-color-gold-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-gold-900-h) var(--dt-color-gold-900-s) var(--dt-color-gold-900-l) / 0%) !important |
| `d-bgg-from-green-100` | --bgg-from-opacity: var(--dt-color-green-100-a); --bgg-from: oklch(from var(--dt-color-green-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-100-h) var(--dt-color-green-100-s) var(--dt-color-green-100-l) / 0%) !important |
| `d-bgg-from-green-1000` | --bgg-from-opacity: var(--dt-color-green-1000-a); --bgg-from: oklch(from var(--dt-color-green-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-1000-h) var(--dt-color-green-1000-s) var(--dt-color-green-1000-l) / 0%) !important |
| `d-bgg-from-green-200` | --bgg-from-opacity: var(--dt-color-green-200-a); --bgg-from: oklch(from var(--dt-color-green-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-200-h) var(--dt-color-green-200-s) var(--dt-color-green-200-l) / 0%) !important |
| `d-bgg-from-green-300` | --bgg-from-opacity: var(--dt-color-green-300-a); --bgg-from: oklch(from var(--dt-color-green-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-300-h) var(--dt-color-green-300-s) var(--dt-color-green-300-l) / 0%) !important |
| `d-bgg-from-green-350` | --bgg-from-opacity: var(--dt-color-green-350-a); --bgg-from: oklch(from var(--dt-color-green-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-350-h) var(--dt-color-green-350-s) var(--dt-color-green-350-l) / 0%) !important |
| `d-bgg-from-green-400` | --bgg-from-opacity: var(--dt-color-green-400-a); --bgg-from: oklch(from var(--dt-color-green-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-400-h) var(--dt-color-green-400-s) var(--dt-color-green-400-l) / 0%) !important |
| `d-bgg-from-green-425` | --bgg-from-opacity: var(--dt-color-green-425-a); --bgg-from: oklch(from var(--dt-color-green-425) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-425-h) var(--dt-color-green-425-s) var(--dt-color-green-425-l) / 0%) !important |
| `d-bgg-from-green-475` | --bgg-from-opacity: var(--dt-color-green-475-a); --bgg-from: oklch(from var(--dt-color-green-475) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-475-h) var(--dt-color-green-475-s) var(--dt-color-green-475-l) / 0%) !important |
| `d-bgg-from-green-50` | --bgg-from-opacity: var(--dt-color-green-50-a); --bgg-from: oklch(from var(--dt-color-green-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-50-h) var(--dt-color-green-50-s) var(--dt-color-green-50-l) / 0%) !important |
| `d-bgg-from-green-500` | --bgg-from-opacity: var(--dt-color-green-500-a); --bgg-from: oklch(from var(--dt-color-green-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-500-h) var(--dt-color-green-500-s) var(--dt-color-green-500-l) / 0%) !important |
| `d-bgg-from-green-600` | --bgg-from-opacity: var(--dt-color-green-600-a); --bgg-from: oklch(from var(--dt-color-green-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-600-h) var(--dt-color-green-600-s) var(--dt-color-green-600-l) / 0%) !important |
| `d-bgg-from-green-900` | --bgg-from-opacity: var(--dt-color-green-900-a); --bgg-from: oklch(from var(--dt-color-green-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-green-900-h) var(--dt-color-green-900-s) var(--dt-color-green-900-l) / 0%) !important |
| `d-bgg-from-indigo-100` | --bgg-from-opacity: var(--dt-color-indigo-100-a); --bgg-from: oklch(from var(--dt-color-indigo-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-100-h) var(--dt-color-indigo-100-s) var(--dt-color-indigo-100-l) / 0%) !important |
| `d-bgg-from-indigo-1000` | --bgg-from-opacity: var(--dt-color-indigo-1000-a); --bgg-from: oklch(from var(--dt-color-indigo-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-1000-h) var(--dt-color-indigo-1000-s) var(--dt-color-indigo-1000-l) / 0%) !important |
| `d-bgg-from-indigo-200` | --bgg-from-opacity: var(--dt-color-indigo-200-a); --bgg-from: oklch(from var(--dt-color-indigo-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-200-h) var(--dt-color-indigo-200-s) var(--dt-color-indigo-200-l) / 0%) !important |
| `d-bgg-from-indigo-300` | --bgg-from-opacity: var(--dt-color-indigo-300-a); --bgg-from: oklch(from var(--dt-color-indigo-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-300-h) var(--dt-color-indigo-300-s) var(--dt-color-indigo-300-l) / 0%) !important |
| `d-bgg-from-indigo-400` | --bgg-from-opacity: var(--dt-color-indigo-400-a); --bgg-from: oklch(from var(--dt-color-indigo-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-400-h) var(--dt-color-indigo-400-s) var(--dt-color-indigo-400-l) / 0%) !important |
| `d-bgg-from-indigo-50` | --bgg-from-opacity: var(--dt-color-indigo-50-a); --bgg-from: oklch(from var(--dt-color-indigo-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-50-h) var(--dt-color-indigo-50-s) var(--dt-color-indigo-50-l) / 0%) !important |
| `d-bgg-from-indigo-500` | --bgg-from-opacity: var(--dt-color-indigo-500-a); --bgg-from: oklch(from var(--dt-color-indigo-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-500-h) var(--dt-color-indigo-500-s) var(--dt-color-indigo-500-l) / 0%) !important |
| `d-bgg-from-indigo-600` | --bgg-from-opacity: var(--dt-color-indigo-600-a); --bgg-from: oklch(from var(--dt-color-indigo-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-600-h) var(--dt-color-indigo-600-s) var(--dt-color-indigo-600-l) / 0%) !important |
| `d-bgg-from-indigo-700` | --bgg-from-opacity: var(--dt-color-indigo-700-a); --bgg-from: oklch(from var(--dt-color-indigo-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-700-h) var(--dt-color-indigo-700-s) var(--dt-color-indigo-700-l) / 0%) !important |
| `d-bgg-from-indigo-800` | --bgg-from-opacity: var(--dt-color-indigo-800-a); --bgg-from: oklch(from var(--dt-color-indigo-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-800-h) var(--dt-color-indigo-800-s) var(--dt-color-indigo-800-l) / 0%) !important |
| `d-bgg-from-indigo-900` | --bgg-from-opacity: var(--dt-color-indigo-900-a); --bgg-from: oklch(from var(--dt-color-indigo-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-900-h) var(--dt-color-indigo-900-s) var(--dt-color-indigo-900-l) / 0%) !important |
| `d-bgg-from-indigo-950` | --bgg-from-opacity: var(--dt-color-indigo-950-a); --bgg-from: oklch(from var(--dt-color-indigo-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-indigo-950-h) var(--dt-color-indigo-950-s) var(--dt-color-indigo-950-l) / 0%) !important |
| `d-bgg-from-magenta-100` | --bgg-from-opacity: var(--dt-color-magenta-100-a); --bgg-from: oklch(from var(--dt-color-magenta-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-100-h) var(--dt-color-magenta-100-s) var(--dt-color-magenta-100-l) / 0%) !important |
| `d-bgg-from-magenta-1000` | --bgg-from-opacity: var(--dt-color-magenta-1000-a); --bgg-from: oklch(from var(--dt-color-magenta-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-1000-h) var(--dt-color-magenta-1000-s) var(--dt-color-magenta-1000-l) / 0%) !important |
| `d-bgg-from-magenta-200` | --bgg-from-opacity: var(--dt-color-magenta-200-a); --bgg-from: oklch(from var(--dt-color-magenta-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-200-h) var(--dt-color-magenta-200-s) var(--dt-color-magenta-200-l) / 0%) !important |
| `d-bgg-from-magenta-250` | --bgg-from-opacity: var(--dt-color-magenta-250-a); --bgg-from: oklch(from var(--dt-color-magenta-250) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-250-h) var(--dt-color-magenta-250-s) var(--dt-color-magenta-250-l) / 0%) !important |
| `d-bgg-from-magenta-300` | --bgg-from-opacity: var(--dt-color-magenta-300-a); --bgg-from: oklch(from var(--dt-color-magenta-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-300-h) var(--dt-color-magenta-300-s) var(--dt-color-magenta-300-l) / 0%) !important |
| `d-bgg-from-magenta-400` | --bgg-from-opacity: var(--dt-color-magenta-400-a); --bgg-from: oklch(from var(--dt-color-magenta-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-400-h) var(--dt-color-magenta-400-s) var(--dt-color-magenta-400-l) / 0%) !important |
| `d-bgg-from-magenta-425` | --bgg-from-opacity: var(--dt-color-magenta-425-a); --bgg-from: oklch(from var(--dt-color-magenta-425) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-425-h) var(--dt-color-magenta-425-s) var(--dt-color-magenta-425-l) / 0%) !important |
| `d-bgg-from-magenta-475` | --bgg-from-opacity: var(--dt-color-magenta-475-a); --bgg-from: oklch(from var(--dt-color-magenta-475) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-475-h) var(--dt-color-magenta-475-s) var(--dt-color-magenta-475-l) / 0%) !important |
| `d-bgg-from-magenta-50` | --bgg-from-opacity: var(--dt-color-magenta-50-a); --bgg-from: oklch(from var(--dt-color-magenta-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-50-h) var(--dt-color-magenta-50-s) var(--dt-color-magenta-50-l) / 0%) !important |
| `d-bgg-from-magenta-500` | --bgg-from-opacity: var(--dt-color-magenta-500-a); --bgg-from: oklch(from var(--dt-color-magenta-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-500-h) var(--dt-color-magenta-500-s) var(--dt-color-magenta-500-l) / 0%) !important |
| `d-bgg-from-magenta-600` | --bgg-from-opacity: var(--dt-color-magenta-600-a); --bgg-from: oklch(from var(--dt-color-magenta-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-600-h) var(--dt-color-magenta-600-s) var(--dt-color-magenta-600-l) / 0%) !important |
| `d-bgg-from-magenta-900` | --bgg-from-opacity: var(--dt-color-magenta-900-a); --bgg-from: oklch(from var(--dt-color-magenta-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-magenta-900-h) var(--dt-color-magenta-900-s) var(--dt-color-magenta-900-l) / 0%) !important |
| `d-bgg-from-neutral-black` | --bgg-from-opacity: var(--dt-color-neutral-black-a); --bgg-from: oklch(from var(--dt-color-neutral-black) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-neutral-black-h) var(--dt-color-neutral-black-s) var(--dt-color-neutral-black-l) / 0%) !important |
| `d-bgg-from-neutral-transparent` | --bgg-from-opacity: var(--dt-color-neutral-transparent-a); --bgg-from: oklch(from var(--dt-color-neutral-transparent) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-neutral-transparent-h) var(--dt-color-neutral-transparent-s) var(--dt-color-neutral-transparent-l) / 0%) !important |
| `d-bgg-from-neutral-white` | --bgg-from-opacity: var(--dt-color-neutral-white-a); --bgg-from: oklch(from var(--dt-color-neutral-white) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-neutral-white-h) var(--dt-color-neutral-white-s) var(--dt-color-neutral-white-l) / 0%) !important |
| `d-bgg-from-o0` | --bgg-from-opacity: 0% !important |
| `d-bgg-from-o10` | --bgg-from-opacity: 10% !important |
| `d-bgg-from-o100` | --bgg-from-opacity: 100% !important |
| `d-bgg-from-o25` | --bgg-from-opacity: 25% !important |
| `d-bgg-from-o50` | --bgg-from-opacity: 50% !important |
| `d-bgg-from-o75` | --bgg-from-opacity: 75% !important |
| `d-bgg-from-o85` | --bgg-from-opacity: 85% !important |
| `d-bgg-from-o90` | --bgg-from-opacity: 90% !important |
| `d-bgg-from-o95` | --bgg-from-opacity: 95% !important |
| `d-bgg-from-o99` | --bgg-from-opacity: 99% !important |
| `d-bgg-from-olive-100` | --bgg-from-opacity: var(--dt-color-olive-100-a); --bgg-from: oklch(from var(--dt-color-olive-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-100-h) var(--dt-color-olive-100-s) var(--dt-color-olive-100-l) / 0%) !important |
| `d-bgg-from-olive-1000` | --bgg-from-opacity: var(--dt-color-olive-1000-a); --bgg-from: oklch(from var(--dt-color-olive-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-1000-h) var(--dt-color-olive-1000-s) var(--dt-color-olive-1000-l) / 0%) !important |
| `d-bgg-from-olive-200` | --bgg-from-opacity: var(--dt-color-olive-200-a); --bgg-from: oklch(from var(--dt-color-olive-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-200-h) var(--dt-color-olive-200-s) var(--dt-color-olive-200-l) / 0%) !important |
| `d-bgg-from-olive-300` | --bgg-from-opacity: var(--dt-color-olive-300-a); --bgg-from: oklch(from var(--dt-color-olive-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-300-h) var(--dt-color-olive-300-s) var(--dt-color-olive-300-l) / 0%) !important |
| `d-bgg-from-olive-400` | --bgg-from-opacity: var(--dt-color-olive-400-a); --bgg-from: oklch(from var(--dt-color-olive-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-400-h) var(--dt-color-olive-400-s) var(--dt-color-olive-400-l) / 0%) !important |
| `d-bgg-from-olive-50` | --bgg-from-opacity: var(--dt-color-olive-50-a); --bgg-from: oklch(from var(--dt-color-olive-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-50-h) var(--dt-color-olive-50-s) var(--dt-color-olive-50-l) / 0%) !important |
| `d-bgg-from-olive-500` | --bgg-from-opacity: var(--dt-color-olive-500-a); --bgg-from: oklch(from var(--dt-color-olive-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-500-h) var(--dt-color-olive-500-s) var(--dt-color-olive-500-l) / 0%) !important |
| `d-bgg-from-olive-600` | --bgg-from-opacity: var(--dt-color-olive-600-a); --bgg-from: oklch(from var(--dt-color-olive-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-600-h) var(--dt-color-olive-600-s) var(--dt-color-olive-600-l) / 0%) !important |
| `d-bgg-from-olive-700` | --bgg-from-opacity: var(--dt-color-olive-700-a); --bgg-from: oklch(from var(--dt-color-olive-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-700-h) var(--dt-color-olive-700-s) var(--dt-color-olive-700-l) / 0%) !important |
| `d-bgg-from-olive-800` | --bgg-from-opacity: var(--dt-color-olive-800-a); --bgg-from: oklch(from var(--dt-color-olive-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-800-h) var(--dt-color-olive-800-s) var(--dt-color-olive-800-l) / 0%) !important |
| `d-bgg-from-olive-900` | --bgg-from-opacity: var(--dt-color-olive-900-a); --bgg-from: oklch(from var(--dt-color-olive-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-900-h) var(--dt-color-olive-900-s) var(--dt-color-olive-900-l) / 0%) !important |
| `d-bgg-from-olive-950` | --bgg-from-opacity: var(--dt-color-olive-950-a); --bgg-from: oklch(from var(--dt-color-olive-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-olive-950-h) var(--dt-color-olive-950-s) var(--dt-color-olive-950-l) / 0%) !important |
| `d-bgg-from-purple-100` | --bgg-from-opacity: var(--dt-color-purple-100-a); --bgg-from: oklch(from var(--dt-color-purple-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-100-h) var(--dt-color-purple-100-s) var(--dt-color-purple-100-l) / 0%) !important |
| `d-bgg-from-purple-1000` | --bgg-from-opacity: var(--dt-color-purple-1000-a); --bgg-from: oklch(from var(--dt-color-purple-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-1000-h) var(--dt-color-purple-1000-s) var(--dt-color-purple-1000-l) / 0%) !important |
| `d-bgg-from-purple-200` | --bgg-from-opacity: var(--dt-color-purple-200-a); --bgg-from: oklch(from var(--dt-color-purple-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-200-h) var(--dt-color-purple-200-s) var(--dt-color-purple-200-l) / 0%) !important |
| `d-bgg-from-purple-250` | --bgg-from-opacity: var(--dt-color-purple-250-a); --bgg-from: oklch(from var(--dt-color-purple-250) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-250-h) var(--dt-color-purple-250-s) var(--dt-color-purple-250-l) / 0%) !important |
| `d-bgg-from-purple-300` | --bgg-from-opacity: var(--dt-color-purple-300-a); --bgg-from: oklch(from var(--dt-color-purple-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-300-h) var(--dt-color-purple-300-s) var(--dt-color-purple-300-l) / 0%) !important |
| `d-bgg-from-purple-350` | --bgg-from-opacity: var(--dt-color-purple-350-a); --bgg-from: oklch(from var(--dt-color-purple-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-350-h) var(--dt-color-purple-350-s) var(--dt-color-purple-350-l) / 0%) !important |
| `d-bgg-from-purple-400` | --bgg-from-opacity: var(--dt-color-purple-400-a); --bgg-from: oklch(from var(--dt-color-purple-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-400-h) var(--dt-color-purple-400-s) var(--dt-color-purple-400-l) / 0%) !important |
| `d-bgg-from-purple-450` | --bgg-from-opacity: var(--dt-color-purple-450-a); --bgg-from: oklch(from var(--dt-color-purple-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-450-h) var(--dt-color-purple-450-s) var(--dt-color-purple-450-l) / 0%) !important |
| `d-bgg-from-purple-50` | --bgg-from-opacity: var(--dt-color-purple-50-a); --bgg-from: oklch(from var(--dt-color-purple-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-50-h) var(--dt-color-purple-50-s) var(--dt-color-purple-50-l) / 0%) !important |
| `d-bgg-from-purple-500` | --bgg-from-opacity: var(--dt-color-purple-500-a); --bgg-from: oklch(from var(--dt-color-purple-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-500-h) var(--dt-color-purple-500-s) var(--dt-color-purple-500-l) / 0%) !important |
| `d-bgg-from-purple-550` | --bgg-from-opacity: var(--dt-color-purple-550-a); --bgg-from: oklch(from var(--dt-color-purple-550) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-550-h) var(--dt-color-purple-550-s) var(--dt-color-purple-550-l) / 0%) !important |
| `d-bgg-from-purple-600` | --bgg-from-opacity: var(--dt-color-purple-600-a); --bgg-from: oklch(from var(--dt-color-purple-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-purple-600-h) var(--dt-color-purple-600-s) var(--dt-color-purple-600-l) / 0%) !important |
| `d-bgg-from-red-100` | --bgg-from-opacity: var(--dt-color-red-100-a); --bgg-from: oklch(from var(--dt-color-red-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-100-h) var(--dt-color-red-100-s) var(--dt-color-red-100-l) / 0%) !important |
| `d-bgg-from-red-1000` | --bgg-from-opacity: var(--dt-color-red-1000-a); --bgg-from: oklch(from var(--dt-color-red-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-1000-h) var(--dt-color-red-1000-s) var(--dt-color-red-1000-l) / 0%) !important |
| `d-bgg-from-red-200` | --bgg-from-opacity: var(--dt-color-red-200-a); --bgg-from: oklch(from var(--dt-color-red-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-200-h) var(--dt-color-red-200-s) var(--dt-color-red-200-l) / 0%) !important |
| `d-bgg-from-red-300` | --bgg-from-opacity: var(--dt-color-red-300-a); --bgg-from: oklch(from var(--dt-color-red-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-300-h) var(--dt-color-red-300-s) var(--dt-color-red-300-l) / 0%) !important |
| `d-bgg-from-red-350` | --bgg-from-opacity: var(--dt-color-red-350-a); --bgg-from: oklch(from var(--dt-color-red-350) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-350-h) var(--dt-color-red-350-s) var(--dt-color-red-350-l) / 0%) !important |
| `d-bgg-from-red-400` | --bgg-from-opacity: var(--dt-color-red-400-a); --bgg-from: oklch(from var(--dt-color-red-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-400-h) var(--dt-color-red-400-s) var(--dt-color-red-400-l) / 0%) !important |
| `d-bgg-from-red-450` | --bgg-from-opacity: var(--dt-color-red-450-a); --bgg-from: oklch(from var(--dt-color-red-450) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-450-h) var(--dt-color-red-450-s) var(--dt-color-red-450-l) / 0%) !important |
| `d-bgg-from-red-50` | --bgg-from-opacity: var(--dt-color-red-50-a); --bgg-from: oklch(from var(--dt-color-red-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-50-h) var(--dt-color-red-50-s) var(--dt-color-red-50-l) / 0%) !important |
| `d-bgg-from-red-500` | --bgg-from-opacity: var(--dt-color-red-500-a); --bgg-from: oklch(from var(--dt-color-red-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-500-h) var(--dt-color-red-500-s) var(--dt-color-red-500-l) / 0%) !important |
| `d-bgg-from-red-600` | --bgg-from-opacity: var(--dt-color-red-600-a); --bgg-from: oklch(from var(--dt-color-red-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-600-h) var(--dt-color-red-600-s) var(--dt-color-red-600-l) / 0%) !important |
| `d-bgg-from-red-700` | --bgg-from-opacity: var(--dt-color-red-700-a); --bgg-from: oklch(from var(--dt-color-red-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-700-h) var(--dt-color-red-700-s) var(--dt-color-red-700-l) / 0%) !important |
| `d-bgg-from-red-900` | --bgg-from-opacity: var(--dt-color-red-900-a); --bgg-from: oklch(from var(--dt-color-red-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-red-900-h) var(--dt-color-red-900-s) var(--dt-color-red-900-l) / 0%) !important |
| `d-bgg-from-tan-100` | --bgg-from-opacity: var(--dt-color-tan-100-a); --bgg-from: oklch(from var(--dt-color-tan-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-100-h) var(--dt-color-tan-100-s) var(--dt-color-tan-100-l) / 0%) !important |
| `d-bgg-from-tan-1000` | --bgg-from-opacity: var(--dt-color-tan-1000-a); --bgg-from: oklch(from var(--dt-color-tan-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-1000-h) var(--dt-color-tan-1000-s) var(--dt-color-tan-1000-l) / 0%) !important |
| `d-bgg-from-tan-200` | --bgg-from-opacity: var(--dt-color-tan-200-a); --bgg-from: oklch(from var(--dt-color-tan-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-200-h) var(--dt-color-tan-200-s) var(--dt-color-tan-200-l) / 0%) !important |
| `d-bgg-from-tan-300` | --bgg-from-opacity: var(--dt-color-tan-300-a); --bgg-from: oklch(from var(--dt-color-tan-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-300-h) var(--dt-color-tan-300-s) var(--dt-color-tan-300-l) / 0%) !important |
| `d-bgg-from-tan-400` | --bgg-from-opacity: var(--dt-color-tan-400-a); --bgg-from: oklch(from var(--dt-color-tan-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-400-h) var(--dt-color-tan-400-s) var(--dt-color-tan-400-l) / 0%) !important |
| `d-bgg-from-tan-50` | --bgg-from-opacity: var(--dt-color-tan-50-a); --bgg-from: oklch(from var(--dt-color-tan-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-50-h) var(--dt-color-tan-50-s) var(--dt-color-tan-50-l) / 0%) !important |
| `d-bgg-from-tan-500` | --bgg-from-opacity: var(--dt-color-tan-500-a); --bgg-from: oklch(from var(--dt-color-tan-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-500-h) var(--dt-color-tan-500-s) var(--dt-color-tan-500-l) / 0%) !important |
| `d-bgg-from-tan-600` | --bgg-from-opacity: var(--dt-color-tan-600-a); --bgg-from: oklch(from var(--dt-color-tan-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-600-h) var(--dt-color-tan-600-s) var(--dt-color-tan-600-l) / 0%) !important |
| `d-bgg-from-tan-700` | --bgg-from-opacity: var(--dt-color-tan-700-a); --bgg-from: oklch(from var(--dt-color-tan-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-700-h) var(--dt-color-tan-700-s) var(--dt-color-tan-700-l) / 0%) !important |
| `d-bgg-from-tan-800` | --bgg-from-opacity: var(--dt-color-tan-800-a); --bgg-from: oklch(from var(--dt-color-tan-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-800-h) var(--dt-color-tan-800-s) var(--dt-color-tan-800-l) / 0%) !important |
| `d-bgg-from-tan-900` | --bgg-from-opacity: var(--dt-color-tan-900-a); --bgg-from: oklch(from var(--dt-color-tan-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-900-h) var(--dt-color-tan-900-s) var(--dt-color-tan-900-l) / 0%) !important |
| `d-bgg-from-tan-950` | --bgg-from-opacity: var(--dt-color-tan-950-a); --bgg-from: oklch(from var(--dt-color-tan-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-tan-950-h) var(--dt-color-tan-950-s) var(--dt-color-tan-950-l) / 0%) !important |
| `d-bgg-from-teal-100` | --bgg-from-opacity: var(--dt-color-teal-100-a); --bgg-from: oklch(from var(--dt-color-teal-100) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-100-h) var(--dt-color-teal-100-s) var(--dt-color-teal-100-l) / 0%) !important |
| `d-bgg-from-teal-1000` | --bgg-from-opacity: var(--dt-color-teal-1000-a); --bgg-from: oklch(from var(--dt-color-teal-1000) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-1000-h) var(--dt-color-teal-1000-s) var(--dt-color-teal-1000-l) / 0%) !important |
| `d-bgg-from-teal-200` | --bgg-from-opacity: var(--dt-color-teal-200-a); --bgg-from: oklch(from var(--dt-color-teal-200) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-200-h) var(--dt-color-teal-200-s) var(--dt-color-teal-200-l) / 0%) !important |
| `d-bgg-from-teal-300` | --bgg-from-opacity: var(--dt-color-teal-300-a); --bgg-from: oklch(from var(--dt-color-teal-300) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-300-h) var(--dt-color-teal-300-s) var(--dt-color-teal-300-l) / 0%) !important |
| `d-bgg-from-teal-400` | --bgg-from-opacity: var(--dt-color-teal-400-a); --bgg-from: oklch(from var(--dt-color-teal-400) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-400-h) var(--dt-color-teal-400-s) var(--dt-color-teal-400-l) / 0%) !important |
| `d-bgg-from-teal-50` | --bgg-from-opacity: var(--dt-color-teal-50-a); --bgg-from: oklch(from var(--dt-color-teal-50) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-50-h) var(--dt-color-teal-50-s) var(--dt-color-teal-50-l) / 0%) !important |
| `d-bgg-from-teal-500` | --bgg-from-opacity: var(--dt-color-teal-500-a); --bgg-from: oklch(from var(--dt-color-teal-500) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-500-h) var(--dt-color-teal-500-s) var(--dt-color-teal-500-l) / 0%) !important |
| `d-bgg-from-teal-600` | --bgg-from-opacity: var(--dt-color-teal-600-a); --bgg-from: oklch(from var(--dt-color-teal-600) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-600-h) var(--dt-color-teal-600-s) var(--dt-color-teal-600-l) / 0%) !important |
| `d-bgg-from-teal-700` | --bgg-from-opacity: var(--dt-color-teal-700-a); --bgg-from: oklch(from var(--dt-color-teal-700) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-700-h) var(--dt-color-teal-700-s) var(--dt-color-teal-700-l) / 0%) !important |
| `d-bgg-from-teal-800` | --bgg-from-opacity: var(--dt-color-teal-800-a); --bgg-from: oklch(from var(--dt-color-teal-800) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-800-h) var(--dt-color-teal-800-s) var(--dt-color-teal-800-l) / 0%) !important |
| `d-bgg-from-teal-900` | --bgg-from-opacity: var(--dt-color-teal-900-a); --bgg-from: oklch(from var(--dt-color-teal-900) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-900-h) var(--dt-color-teal-900-s) var(--dt-color-teal-900-l) / 0%) !important |
| `d-bgg-from-teal-950` | --bgg-from-opacity: var(--dt-color-teal-950-a); --bgg-from: oklch(from var(--dt-color-teal-950) l c h / var(--bgg-from-opacity)) !important; --bgg-to: hsl(var(--dt-color-teal-950-h) var(--dt-color-teal-950-s) var(--dt-color-teal-950-l) / 0%) !important |
| `d-bgg-none` | background-image: none !important |
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
| `d-bgg-radial` | background-image: radial-gradient(var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-b` | background-image: linear-gradient(to bottom, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-berry-100` | --bgg-to-opacity: var(--dt-color-berry-100-a); --bgg-to: oklch(from var(--dt-color-berry-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-1000` | --bgg-to-opacity: var(--dt-color-berry-1000-a); --bgg-to: oklch(from var(--dt-color-berry-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-200` | --bgg-to-opacity: var(--dt-color-berry-200-a); --bgg-to: oklch(from var(--dt-color-berry-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-300` | --bgg-to-opacity: var(--dt-color-berry-300-a); --bgg-to: oklch(from var(--dt-color-berry-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-400` | --bgg-to-opacity: var(--dt-color-berry-400-a); --bgg-to: oklch(from var(--dt-color-berry-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-50` | --bgg-to-opacity: var(--dt-color-berry-50-a); --bgg-to: oklch(from var(--dt-color-berry-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-500` | --bgg-to-opacity: var(--dt-color-berry-500-a); --bgg-to: oklch(from var(--dt-color-berry-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-600` | --bgg-to-opacity: var(--dt-color-berry-600-a); --bgg-to: oklch(from var(--dt-color-berry-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-700` | --bgg-to-opacity: var(--dt-color-berry-700-a); --bgg-to: oklch(from var(--dt-color-berry-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-800` | --bgg-to-opacity: var(--dt-color-berry-800-a); --bgg-to: oklch(from var(--dt-color-berry-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-900` | --bgg-to-opacity: var(--dt-color-berry-900-a); --bgg-to: oklch(from var(--dt-color-berry-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-berry-950` | --bgg-to-opacity: var(--dt-color-berry-950-a); --bgg-to: oklch(from var(--dt-color-berry-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-bl` | background-image: linear-gradient(to bottom left, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-black-100` | --bgg-to-opacity: var(--dt-color-black-100-a); --bgg-to: oklch(from var(--dt-color-black-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-1000` | --bgg-to-opacity: var(--dt-color-black-1000-a); --bgg-to: oklch(from var(--dt-color-black-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-200` | --bgg-to-opacity: var(--dt-color-black-200-a); --bgg-to: oklch(from var(--dt-color-black-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-300` | --bgg-to-opacity: var(--dt-color-black-300-a); --bgg-to: oklch(from var(--dt-color-black-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-400` | --bgg-to-opacity: var(--dt-color-black-400-a); --bgg-to: oklch(from var(--dt-color-black-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-50` | --bgg-to-opacity: var(--dt-color-black-50-a); --bgg-to: oklch(from var(--dt-color-black-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-500` | --bgg-to-opacity: var(--dt-color-black-500-a); --bgg-to: oklch(from var(--dt-color-black-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-600` | --bgg-to-opacity: var(--dt-color-black-600-a); --bgg-to: oklch(from var(--dt-color-black-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-700` | --bgg-to-opacity: var(--dt-color-black-700-a); --bgg-to: oklch(from var(--dt-color-black-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-800` | --bgg-to-opacity: var(--dt-color-black-800-a); --bgg-to: oklch(from var(--dt-color-black-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-900` | --bgg-to-opacity: var(--dt-color-black-900-a); --bgg-to: oklch(from var(--dt-color-black-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-black-950` | --bgg-to-opacity: var(--dt-color-black-950-a); --bgg-to: oklch(from var(--dt-color-black-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-100` | --bgg-to-opacity: var(--dt-color-blue-100-a); --bgg-to: oklch(from var(--dt-color-blue-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-1000` | --bgg-to-opacity: var(--dt-color-blue-1000-a); --bgg-to: oklch(from var(--dt-color-blue-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-200` | --bgg-to-opacity: var(--dt-color-blue-200-a); --bgg-to: oklch(from var(--dt-color-blue-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-300` | --bgg-to-opacity: var(--dt-color-blue-300-a); --bgg-to: oklch(from var(--dt-color-blue-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-400` | --bgg-to-opacity: var(--dt-color-blue-400-a); --bgg-to: oklch(from var(--dt-color-blue-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-425` | --bgg-to-opacity: var(--dt-color-blue-425-a); --bgg-to: oklch(from var(--dt-color-blue-425) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-450` | --bgg-to-opacity: var(--dt-color-blue-450-a); --bgg-to: oklch(from var(--dt-color-blue-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-475` | --bgg-to-opacity: var(--dt-color-blue-475-a); --bgg-to: oklch(from var(--dt-color-blue-475) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-50` | --bgg-to-opacity: var(--dt-color-blue-50-a); --bgg-to: oklch(from var(--dt-color-blue-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-500` | --bgg-to-opacity: var(--dt-color-blue-500-a); --bgg-to: oklch(from var(--dt-color-blue-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-600` | --bgg-to-opacity: var(--dt-color-blue-600-a); --bgg-to: oklch(from var(--dt-color-blue-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-blue-900` | --bgg-to-opacity: var(--dt-color-blue-900-a); --bgg-to: oklch(from var(--dt-color-blue-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-br` | background-image: linear-gradient(to bottom right, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-coral-100` | --bgg-to-opacity: var(--dt-color-coral-100-a); --bgg-to: oklch(from var(--dt-color-coral-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-1000` | --bgg-to-opacity: var(--dt-color-coral-1000-a); --bgg-to: oklch(from var(--dt-color-coral-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-200` | --bgg-to-opacity: var(--dt-color-coral-200-a); --bgg-to: oklch(from var(--dt-color-coral-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-300` | --bgg-to-opacity: var(--dt-color-coral-300-a); --bgg-to: oklch(from var(--dt-color-coral-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-400` | --bgg-to-opacity: var(--dt-color-coral-400-a); --bgg-to: oklch(from var(--dt-color-coral-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-50` | --bgg-to-opacity: var(--dt-color-coral-50-a); --bgg-to: oklch(from var(--dt-color-coral-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-500` | --bgg-to-opacity: var(--dt-color-coral-500-a); --bgg-to: oklch(from var(--dt-color-coral-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-600` | --bgg-to-opacity: var(--dt-color-coral-600-a); --bgg-to: oklch(from var(--dt-color-coral-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-700` | --bgg-to-opacity: var(--dt-color-coral-700-a); --bgg-to: oklch(from var(--dt-color-coral-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-800` | --bgg-to-opacity: var(--dt-color-coral-800-a); --bgg-to: oklch(from var(--dt-color-coral-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-900` | --bgg-to-opacity: var(--dt-color-coral-900-a); --bgg-to: oklch(from var(--dt-color-coral-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-coral-950` | --bgg-to-opacity: var(--dt-color-coral-950-a); --bgg-to: oklch(from var(--dt-color-coral-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-100` | --bgg-to-opacity: var(--dt-color-gold-100-a); --bgg-to: oklch(from var(--dt-color-gold-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-1000` | --bgg-to-opacity: var(--dt-color-gold-1000-a); --bgg-to: oklch(from var(--dt-color-gold-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-200` | --bgg-to-opacity: var(--dt-color-gold-200-a); --bgg-to: oklch(from var(--dt-color-gold-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-300` | --bgg-to-opacity: var(--dt-color-gold-300-a); --bgg-to: oklch(from var(--dt-color-gold-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-350` | --bgg-to-opacity: var(--dt-color-gold-350-a); --bgg-to: oklch(from var(--dt-color-gold-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-400` | --bgg-to-opacity: var(--dt-color-gold-400-a); --bgg-to: oklch(from var(--dt-color-gold-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-450` | --bgg-to-opacity: var(--dt-color-gold-450-a); --bgg-to: oklch(from var(--dt-color-gold-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-50` | --bgg-to-opacity: var(--dt-color-gold-50-a); --bgg-to: oklch(from var(--dt-color-gold-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-500` | --bgg-to-opacity: var(--dt-color-gold-500-a); --bgg-to: oklch(from var(--dt-color-gold-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-600` | --bgg-to-opacity: var(--dt-color-gold-600-a); --bgg-to: oklch(from var(--dt-color-gold-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-700` | --bgg-to-opacity: var(--dt-color-gold-700-a); --bgg-to: oklch(from var(--dt-color-gold-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-gold-900` | --bgg-to-opacity: var(--dt-color-gold-900-a); --bgg-to: oklch(from var(--dt-color-gold-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-100` | --bgg-to-opacity: var(--dt-color-green-100-a); --bgg-to: oklch(from var(--dt-color-green-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-1000` | --bgg-to-opacity: var(--dt-color-green-1000-a); --bgg-to: oklch(from var(--dt-color-green-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-200` | --bgg-to-opacity: var(--dt-color-green-200-a); --bgg-to: oklch(from var(--dt-color-green-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-300` | --bgg-to-opacity: var(--dt-color-green-300-a); --bgg-to: oklch(from var(--dt-color-green-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-350` | --bgg-to-opacity: var(--dt-color-green-350-a); --bgg-to: oklch(from var(--dt-color-green-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-400` | --bgg-to-opacity: var(--dt-color-green-400-a); --bgg-to: oklch(from var(--dt-color-green-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-425` | --bgg-to-opacity: var(--dt-color-green-425-a); --bgg-to: oklch(from var(--dt-color-green-425) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-475` | --bgg-to-opacity: var(--dt-color-green-475-a); --bgg-to: oklch(from var(--dt-color-green-475) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-50` | --bgg-to-opacity: var(--dt-color-green-50-a); --bgg-to: oklch(from var(--dt-color-green-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-500` | --bgg-to-opacity: var(--dt-color-green-500-a); --bgg-to: oklch(from var(--dt-color-green-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-600` | --bgg-to-opacity: var(--dt-color-green-600-a); --bgg-to: oklch(from var(--dt-color-green-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-green-900` | --bgg-to-opacity: var(--dt-color-green-900-a); --bgg-to: oklch(from var(--dt-color-green-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-100` | --bgg-to-opacity: var(--dt-color-indigo-100-a); --bgg-to: oklch(from var(--dt-color-indigo-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-1000` | --bgg-to-opacity: var(--dt-color-indigo-1000-a); --bgg-to: oklch(from var(--dt-color-indigo-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-200` | --bgg-to-opacity: var(--dt-color-indigo-200-a); --bgg-to: oklch(from var(--dt-color-indigo-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-300` | --bgg-to-opacity: var(--dt-color-indigo-300-a); --bgg-to: oklch(from var(--dt-color-indigo-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-400` | --bgg-to-opacity: var(--dt-color-indigo-400-a); --bgg-to: oklch(from var(--dt-color-indigo-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-50` | --bgg-to-opacity: var(--dt-color-indigo-50-a); --bgg-to: oklch(from var(--dt-color-indigo-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-500` | --bgg-to-opacity: var(--dt-color-indigo-500-a); --bgg-to: oklch(from var(--dt-color-indigo-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-600` | --bgg-to-opacity: var(--dt-color-indigo-600-a); --bgg-to: oklch(from var(--dt-color-indigo-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-700` | --bgg-to-opacity: var(--dt-color-indigo-700-a); --bgg-to: oklch(from var(--dt-color-indigo-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-800` | --bgg-to-opacity: var(--dt-color-indigo-800-a); --bgg-to: oklch(from var(--dt-color-indigo-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-900` | --bgg-to-opacity: var(--dt-color-indigo-900-a); --bgg-to: oklch(from var(--dt-color-indigo-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-indigo-950` | --bgg-to-opacity: var(--dt-color-indigo-950-a); --bgg-to: oklch(from var(--dt-color-indigo-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-l` | background-image: linear-gradient(to left, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-magenta-100` | --bgg-to-opacity: var(--dt-color-magenta-100-a); --bgg-to: oklch(from var(--dt-color-magenta-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-1000` | --bgg-to-opacity: var(--dt-color-magenta-1000-a); --bgg-to: oklch(from var(--dt-color-magenta-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-200` | --bgg-to-opacity: var(--dt-color-magenta-200-a); --bgg-to: oklch(from var(--dt-color-magenta-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-250` | --bgg-to-opacity: var(--dt-color-magenta-250-a); --bgg-to: oklch(from var(--dt-color-magenta-250) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-300` | --bgg-to-opacity: var(--dt-color-magenta-300-a); --bgg-to: oklch(from var(--dt-color-magenta-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-400` | --bgg-to-opacity: var(--dt-color-magenta-400-a); --bgg-to: oklch(from var(--dt-color-magenta-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-425` | --bgg-to-opacity: var(--dt-color-magenta-425-a); --bgg-to: oklch(from var(--dt-color-magenta-425) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-475` | --bgg-to-opacity: var(--dt-color-magenta-475-a); --bgg-to: oklch(from var(--dt-color-magenta-475) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-50` | --bgg-to-opacity: var(--dt-color-magenta-50-a); --bgg-to: oklch(from var(--dt-color-magenta-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-500` | --bgg-to-opacity: var(--dt-color-magenta-500-a); --bgg-to: oklch(from var(--dt-color-magenta-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-600` | --bgg-to-opacity: var(--dt-color-magenta-600-a); --bgg-to: oklch(from var(--dt-color-magenta-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-magenta-900` | --bgg-to-opacity: var(--dt-color-magenta-900-a); --bgg-to: oklch(from var(--dt-color-magenta-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-neutral-black` | --bgg-to-opacity: var(--dt-color-neutral-black-a); --bgg-to: oklch(from var(--dt-color-neutral-black) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-neutral-transparent` | --bgg-to-opacity: var(--dt-color-neutral-transparent-a); --bgg-to: oklch(from var(--dt-color-neutral-transparent) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-neutral-white` | --bgg-to-opacity: var(--dt-color-neutral-white-a); --bgg-to: oklch(from var(--dt-color-neutral-white) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-o0` | --bgg-to-opacity: 0% !important |
| `d-bgg-to-o10` | --bgg-to-opacity: 10% !important |
| `d-bgg-to-o100` | --bgg-to-opacity: 100% !important |
| `d-bgg-to-o25` | --bgg-to-opacity: 25% !important |
| `d-bgg-to-o50` | --bgg-to-opacity: 50% !important |
| `d-bgg-to-o75` | --bgg-to-opacity: 75% !important |
| `d-bgg-to-o85` | --bgg-to-opacity: 85% !important |
| `d-bgg-to-o90` | --bgg-to-opacity: 90% !important |
| `d-bgg-to-o95` | --bgg-to-opacity: 95% !important |
| `d-bgg-to-o99` | --bgg-to-opacity: 99% !important |
| `d-bgg-to-olive-100` | --bgg-to-opacity: var(--dt-color-olive-100-a); --bgg-to: oklch(from var(--dt-color-olive-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-1000` | --bgg-to-opacity: var(--dt-color-olive-1000-a); --bgg-to: oklch(from var(--dt-color-olive-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-200` | --bgg-to-opacity: var(--dt-color-olive-200-a); --bgg-to: oklch(from var(--dt-color-olive-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-300` | --bgg-to-opacity: var(--dt-color-olive-300-a); --bgg-to: oklch(from var(--dt-color-olive-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-400` | --bgg-to-opacity: var(--dt-color-olive-400-a); --bgg-to: oklch(from var(--dt-color-olive-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-50` | --bgg-to-opacity: var(--dt-color-olive-50-a); --bgg-to: oklch(from var(--dt-color-olive-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-500` | --bgg-to-opacity: var(--dt-color-olive-500-a); --bgg-to: oklch(from var(--dt-color-olive-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-600` | --bgg-to-opacity: var(--dt-color-olive-600-a); --bgg-to: oklch(from var(--dt-color-olive-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-700` | --bgg-to-opacity: var(--dt-color-olive-700-a); --bgg-to: oklch(from var(--dt-color-olive-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-800` | --bgg-to-opacity: var(--dt-color-olive-800-a); --bgg-to: oklch(from var(--dt-color-olive-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-900` | --bgg-to-opacity: var(--dt-color-olive-900-a); --bgg-to: oklch(from var(--dt-color-olive-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-olive-950` | --bgg-to-opacity: var(--dt-color-olive-950-a); --bgg-to: oklch(from var(--dt-color-olive-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-100` | --bgg-to-opacity: var(--dt-color-purple-100-a); --bgg-to: oklch(from var(--dt-color-purple-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-1000` | --bgg-to-opacity: var(--dt-color-purple-1000-a); --bgg-to: oklch(from var(--dt-color-purple-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-200` | --bgg-to-opacity: var(--dt-color-purple-200-a); --bgg-to: oklch(from var(--dt-color-purple-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-250` | --bgg-to-opacity: var(--dt-color-purple-250-a); --bgg-to: oklch(from var(--dt-color-purple-250) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-300` | --bgg-to-opacity: var(--dt-color-purple-300-a); --bgg-to: oklch(from var(--dt-color-purple-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-350` | --bgg-to-opacity: var(--dt-color-purple-350-a); --bgg-to: oklch(from var(--dt-color-purple-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-400` | --bgg-to-opacity: var(--dt-color-purple-400-a); --bgg-to: oklch(from var(--dt-color-purple-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-450` | --bgg-to-opacity: var(--dt-color-purple-450-a); --bgg-to: oklch(from var(--dt-color-purple-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-50` | --bgg-to-opacity: var(--dt-color-purple-50-a); --bgg-to: oklch(from var(--dt-color-purple-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-500` | --bgg-to-opacity: var(--dt-color-purple-500-a); --bgg-to: oklch(from var(--dt-color-purple-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-550` | --bgg-to-opacity: var(--dt-color-purple-550-a); --bgg-to: oklch(from var(--dt-color-purple-550) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-purple-600` | --bgg-to-opacity: var(--dt-color-purple-600-a); --bgg-to: oklch(from var(--dt-color-purple-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-r` | background-image: linear-gradient(to right, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-red-100` | --bgg-to-opacity: var(--dt-color-red-100-a); --bgg-to: oklch(from var(--dt-color-red-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-1000` | --bgg-to-opacity: var(--dt-color-red-1000-a); --bgg-to: oklch(from var(--dt-color-red-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-200` | --bgg-to-opacity: var(--dt-color-red-200-a); --bgg-to: oklch(from var(--dt-color-red-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-300` | --bgg-to-opacity: var(--dt-color-red-300-a); --bgg-to: oklch(from var(--dt-color-red-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-350` | --bgg-to-opacity: var(--dt-color-red-350-a); --bgg-to: oklch(from var(--dt-color-red-350) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-400` | --bgg-to-opacity: var(--dt-color-red-400-a); --bgg-to: oklch(from var(--dt-color-red-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-450` | --bgg-to-opacity: var(--dt-color-red-450-a); --bgg-to: oklch(from var(--dt-color-red-450) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-50` | --bgg-to-opacity: var(--dt-color-red-50-a); --bgg-to: oklch(from var(--dt-color-red-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-500` | --bgg-to-opacity: var(--dt-color-red-500-a); --bgg-to: oklch(from var(--dt-color-red-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-600` | --bgg-to-opacity: var(--dt-color-red-600-a); --bgg-to: oklch(from var(--dt-color-red-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-700` | --bgg-to-opacity: var(--dt-color-red-700-a); --bgg-to: oklch(from var(--dt-color-red-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-red-900` | --bgg-to-opacity: var(--dt-color-red-900-a); --bgg-to: oklch(from var(--dt-color-red-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-t` | background-image: linear-gradient(to top, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-tan-100` | --bgg-to-opacity: var(--dt-color-tan-100-a); --bgg-to: oklch(from var(--dt-color-tan-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-1000` | --bgg-to-opacity: var(--dt-color-tan-1000-a); --bgg-to: oklch(from var(--dt-color-tan-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-200` | --bgg-to-opacity: var(--dt-color-tan-200-a); --bgg-to: oklch(from var(--dt-color-tan-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-300` | --bgg-to-opacity: var(--dt-color-tan-300-a); --bgg-to: oklch(from var(--dt-color-tan-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-400` | --bgg-to-opacity: var(--dt-color-tan-400-a); --bgg-to: oklch(from var(--dt-color-tan-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-50` | --bgg-to-opacity: var(--dt-color-tan-50-a); --bgg-to: oklch(from var(--dt-color-tan-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-500` | --bgg-to-opacity: var(--dt-color-tan-500-a); --bgg-to: oklch(from var(--dt-color-tan-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-600` | --bgg-to-opacity: var(--dt-color-tan-600-a); --bgg-to: oklch(from var(--dt-color-tan-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-700` | --bgg-to-opacity: var(--dt-color-tan-700-a); --bgg-to: oklch(from var(--dt-color-tan-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-800` | --bgg-to-opacity: var(--dt-color-tan-800-a); --bgg-to: oklch(from var(--dt-color-tan-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-900` | --bgg-to-opacity: var(--dt-color-tan-900-a); --bgg-to: oklch(from var(--dt-color-tan-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tan-950` | --bgg-to-opacity: var(--dt-color-tan-950-a); --bgg-to: oklch(from var(--dt-color-tan-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-100` | --bgg-to-opacity: var(--dt-color-teal-100-a); --bgg-to: oklch(from var(--dt-color-teal-100) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-1000` | --bgg-to-opacity: var(--dt-color-teal-1000-a); --bgg-to: oklch(from var(--dt-color-teal-1000) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-200` | --bgg-to-opacity: var(--dt-color-teal-200-a); --bgg-to: oklch(from var(--dt-color-teal-200) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-300` | --bgg-to-opacity: var(--dt-color-teal-300-a); --bgg-to: oklch(from var(--dt-color-teal-300) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-400` | --bgg-to-opacity: var(--dt-color-teal-400-a); --bgg-to: oklch(from var(--dt-color-teal-400) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-50` | --bgg-to-opacity: var(--dt-color-teal-50-a); --bgg-to: oklch(from var(--dt-color-teal-50) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-500` | --bgg-to-opacity: var(--dt-color-teal-500-a); --bgg-to: oklch(from var(--dt-color-teal-500) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-600` | --bgg-to-opacity: var(--dt-color-teal-600-a); --bgg-to: oklch(from var(--dt-color-teal-600) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-700` | --bgg-to-opacity: var(--dt-color-teal-700-a); --bgg-to: oklch(from var(--dt-color-teal-700) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-800` | --bgg-to-opacity: var(--dt-color-teal-800-a); --bgg-to: oklch(from var(--dt-color-teal-800) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-900` | --bgg-to-opacity: var(--dt-color-teal-900-a); --bgg-to: oklch(from var(--dt-color-teal-900) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-teal-950` | --bgg-to-opacity: var(--dt-color-teal-950-a); --bgg-to: oklch(from var(--dt-color-teal-950) l c h / var(--bgg-to-opacity)) !important |
| `d-bgg-to-tl` | background-image: linear-gradient(to top left, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-to-tr` | background-image: linear-gradient(to top right, var(--bgg-from) 0%, var(--bgg-to) 100%) !important |
| `d-bgg-unset` | background-image: unset !important |
