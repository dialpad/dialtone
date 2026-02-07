# Border Radius

Utilities for controlling an element's border radius.

- **Keywords**: rounded, corner, pill, circle

## All Corners

Use `d-bar{n}` to change the border radius on all corners of your element.

```html
<div class="d-bar0">...</div>
<div class="d-bar1">...</div>
<div class="d-bar2">...</div>
<div class="d-bar4">...</div>
<div class="d-bar8">...</div>
<div class="d-bar12">...</div>
<div class="d-bar16">...</div>
<div class="d-bar24">...</div>
<div class="d-bar32">...</div>
```

## Rounded Sides

Use `d-b{t|r|b|l}r{n}` to change the border radius on a side of your element.

```html
<div class="d-btr4">...</div>
<div class="d-brr8">...</div>
<div class="d-bbr12">...</div>
<div class="d-blr16">...</div>
```

## Pills

Use `d-b{a|t|r|b|l}r-pill` to change the border radius of your element to a pill shape.

```html
<div class="d-bar-pill">...</div>
```

## Circles

Use `d-b{a|t|r|b|l}r-circle` to change the border radius of your element to a circle shape.

```html
<div class="d-bar-circle">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bar-circle` | border-radius: var(--dt-size-radius-circle) !important |
| `d-bar-pill` | border-radius: var(--dt-size-radius-pill) !important |
| `d-bar-unset` | border-radius: unset !important |
| `d-bar0` | border-radius: var(--dt-size-radius-0) !important |
| `d-bar1` | border-radius: var(--dt-size-radius-100) !important |
| `d-bar12` | border-radius: var(--dt-size-radius-450) !important |
| `d-bar16` | border-radius: var(--dt-size-radius-500) !important |
| `d-bar2` | border-radius: var(--dt-size-radius-200) !important |
| `d-bar24` | border-radius: var(--dt-size-550) !important |
| `d-bar32` | border-radius: var(--dt-size-radius-600) !important |
| `d-bar4` | border-radius: var(--dt-size-radius-300) !important |
| `d-bar8` | border-radius: var(--dt-size-radius-400) !important |
| `d-bbr-circle` | border-end-end-radius: var(--dt-size-radius-circle) !important; border-end-start-radius: var(--dt-size-radius-circle) !important |
| `d-bbr-pill` | border-end-end-radius: var(--dt-size-radius-pill) !important; border-end-start-radius: var(--dt-size-radius-pill) !important |
| `d-bbr0` | border-end-start-radius: var(--dt-size-radius-0) !important; border-end-end-radius: var(--dt-size-radius-0) !important |
| `d-bbr1` | border-end-start-radius: var(--dt-size-radius-100) !important; border-end-end-radius: var(--dt-size-radius-100) !important |
| `d-bbr12` | border-end-start-radius: var(--dt-size-radius-450) !important; border-end-end-radius: var(--dt-size-radius-450) !important |
| `d-bbr16` | border-end-start-radius: var(--dt-size-radius-500) !important; border-end-end-radius: var(--dt-size-radius-500) !important |
| `d-bbr2` | border-end-start-radius: var(--dt-size-radius-200) !important; border-end-end-radius: var(--dt-size-radius-200) !important |
| `d-bbr24` | border-end-start-radius: var(--dt-size-550) !important; border-end-end-radius: var(--dt-size-550) !important |
| `d-bbr32` | border-end-start-radius: var(--dt-size-radius-600) !important; border-end-end-radius: var(--dt-size-radius-600) !important |
| `d-bbr4` | border-end-start-radius: var(--dt-size-radius-300) !important; border-end-end-radius: var(--dt-size-radius-300) !important |
| `d-bbr8` | border-end-start-radius: var(--dt-size-radius-400) !important; border-end-end-radius: var(--dt-size-radius-400) !important |
| `d-blr-circle` | border-start-start-radius: var(--dt-size-radius-circle) !important; border-end-start-radius: var(--dt-size-radius-circle) !important |
| `d-blr-pill` | border-start-start-radius: var(--dt-size-radius-pill) !important; border-end-start-radius: var(--dt-size-radius-pill) !important |
| `d-blr0` | border-start-start-radius: var(--dt-size-radius-0) !important; border-end-start-radius: var(--dt-size-radius-0) !important |
| `d-blr1` | border-start-start-radius: var(--dt-size-radius-100) !important; border-end-start-radius: var(--dt-size-radius-100) !important |
| `d-blr12` | border-start-start-radius: var(--dt-size-radius-450) !important; border-end-start-radius: var(--dt-size-radius-450) !important |
| `d-blr16` | border-start-start-radius: var(--dt-size-radius-500) !important; border-end-start-radius: var(--dt-size-radius-500) !important |
| `d-blr2` | border-start-start-radius: var(--dt-size-radius-200) !important; border-end-start-radius: var(--dt-size-radius-200) !important |
| `d-blr24` | border-start-start-radius: var(--dt-size-550) !important; border-end-start-radius: var(--dt-size-550) !important |
| `d-blr32` | border-start-start-radius: var(--dt-size-radius-600) !important; border-end-start-radius: var(--dt-size-radius-600) !important |
| `d-blr4` | border-start-start-radius: var(--dt-size-radius-300) !important; border-end-start-radius: var(--dt-size-radius-300) !important |
| `d-blr8` | border-start-start-radius: var(--dt-size-radius-400) !important; border-end-start-radius: var(--dt-size-radius-400) !important |
| `d-brr-circle` | border-start-end-radius: var(--dt-size-radius-circle) !important; border-end-end-radius: var(--dt-size-radius-circle) !important |
| `d-brr-pill` | border-start-end-radius: var(--dt-size-radius-pill) !important; border-end-end-radius: var(--dt-size-radius-pill) !important |
| `d-brr0` | border-start-end-radius: var(--dt-size-radius-0) !important; border-end-end-radius: var(--dt-size-radius-0) !important |
| `d-brr1` | border-start-end-radius: var(--dt-size-radius-100) !important; border-end-end-radius: var(--dt-size-radius-100) !important |
| `d-brr12` | border-start-end-radius: var(--dt-size-radius-450) !important; border-end-end-radius: var(--dt-size-radius-450) !important |
| `d-brr16` | border-start-end-radius: var(--dt-size-radius-500) !important; border-end-end-radius: var(--dt-size-radius-500) !important |
| `d-brr2` | border-start-end-radius: var(--dt-size-radius-200) !important; border-end-end-radius: var(--dt-size-radius-200) !important |
| `d-brr24` | border-start-end-radius: var(--dt-size-550) !important; border-end-end-radius: var(--dt-size-550) !important |
| `d-brr32` | border-start-end-radius: var(--dt-size-radius-600) !important; border-end-end-radius: var(--dt-size-radius-600) !important |
| `d-brr4` | border-start-end-radius: var(--dt-size-radius-300) !important; border-end-end-radius: var(--dt-size-radius-300) !important |
| `d-brr8` | border-start-end-radius: var(--dt-size-radius-400) !important; border-end-end-radius: var(--dt-size-radius-400) !important |
| `d-btr-circle` | border-start-start-radius: var(--dt-size-radius-circle) !important; border-start-end-radius: var(--dt-size-radius-circle) !important |
| `d-btr-pill` | border-start-start-radius: var(--dt-size-radius-pill) !important; border-start-end-radius: var(--dt-size-radius-pill) !important |
| `d-btr0` | border-start-start-radius: var(--dt-size-radius-0) !important; border-start-end-radius: var(--dt-size-radius-0) !important |
| `d-btr1` | border-start-start-radius: var(--dt-size-radius-100) !important; border-start-end-radius: var(--dt-size-radius-100) !important |
| `d-btr12` | border-start-start-radius: var(--dt-size-radius-450) !important; border-start-end-radius: var(--dt-size-radius-450) !important |
| `d-btr16` | border-start-start-radius: var(--dt-size-radius-500) !important; border-start-end-radius: var(--dt-size-radius-500) !important |
| `d-btr2` | border-start-start-radius: var(--dt-size-radius-200) !important; border-start-end-radius: var(--dt-size-radius-200) !important |
| `d-btr24` | border-start-start-radius: var(--dt-size-550) !important; border-start-end-radius: var(--dt-size-550) !important |
| `d-btr32` | border-start-start-radius: var(--dt-size-radius-600) !important; border-start-end-radius: var(--dt-size-radius-600) !important |
| `d-btr4` | border-start-start-radius: var(--dt-size-radius-300) !important; border-start-end-radius: var(--dt-size-radius-300) !important |
| `d-btr8` | border-start-start-radius: var(--dt-size-radius-400) !important; border-start-end-radius: var(--dt-size-radius-400) !important |
