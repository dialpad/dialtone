# Opacity

Utility classes for changing an element's opacity.

- **Keywords**: transparent, alpha, fade

## Usage

Use `d-o{n}` to change the opacity of your element.

```html
<div class="d-o100">...</div>
<div class="d-o75">...</div>
<div class="d-o50">...</div>
<div class="d-o25">...</div>
<div class="d-o0">...</div>
```

## Hover

Use `h:d-o{n}` to change an element's :hover state opacity.

```html
<dt-button kind="unstyled" class="h:d-o50">...</dt-button>
```

## Focus

Use `f:d-o{n}` to change an element's :focus and :focus-within state opacity.

```html
<dt-button kind="unstyled" class="f:d-o50">...</dt-button>
```

## Focus Visible

Use `fv:d-o{n}` to change an element's :focus-visible state opacity [only when focused by keyboard].

```html
<dt-button kind="unstyled" class="fv:d-o50">...</dt-button>
```

## Classes

| Class | Output |
| --- | --- |
| `d-o-unset` | opacity: unset !important |
| `d-o0` | opacity: 0 !important |
| `d-o10` | opacity: 0.1 !important |
| `d-o100` | opacity: 1 !important |
| `d-o20` | opacity: 0.2 !important |
| `d-o25` | opacity: 0.25 !important |
| `d-o30` | opacity: 0.3 !important |
| `d-o40` | opacity: 0.4 !important |
| `d-o5` | opacity: 0.05 !important |
| `d-o50` | opacity: 0.5 !important |
| `d-o60` | opacity: 0.6 !important |
| `d-o70` | opacity: 0.7 !important |
| `d-o75` | opacity: 0.75 !important |
| `d-o80` | opacity: 0.8 !important |
| `d-o90` | opacity: 0.9 !important |
