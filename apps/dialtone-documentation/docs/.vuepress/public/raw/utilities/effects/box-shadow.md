# Box Shadows

Utilities for controlling an element's box shadows.

- **Keywords**: drop shadow, elevation

## Outer Shadow

Use `d-bs-{n}` to add an outer box shadow to an element.

```html
<div class="d-bs-sm">...</div>
<div class="d-bs-md">...</div>
<div class="d-bs-lg">...</div>
<div class="d-bs-xl">...</div>
<div class="d-bs-card">...</div>
```

## No Shadow

Use `d-bs-none` to remove a box shadow to an element.

```html
<div class="d-bs-none">...</div>
```

## Hover

Use `h:d-bs-{n}` to change an element's `:hover` state box shadow.

```html
<dt-button kind="unstyled" class="h:d-bs-md">Hover over me</dt-button>
```

## Focus

Use `f:d-bs-{n}` to change an element's `:focus` and `:focus-within` state box shadow.

```html
<dt-button kind="unstyled" class="f:d-bs-md">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-bs-{n}` to change an element's `:focus-visible` state box shadow [only when focused by keyboard].

```html
<dt-button kind="unstyled" class="fv:d-bs-md">Keyboard focus me</dt-button>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bs-card` | box-shadow: var(--dt-shadow-card) !important |
| `d-bs-lg` | box-shadow: var(--dt-shadow-large) !important |
| `d-bs-md` | box-shadow: var(--dt-shadow-medium) !important |
| `d-bs-none` | box-shadow: none !important |
| `d-bs-sm` | box-shadow: var(--dt-shadow-small) !important |
| `d-bs-unset` | box-shadow: unset !important |
| `d-bs-xl` | box-shadow: var(--dt-shadow-extra-large) !important |
