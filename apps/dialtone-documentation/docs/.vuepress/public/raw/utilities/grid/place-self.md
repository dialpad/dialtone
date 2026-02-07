# Place Self

Utilities for controlling a grid item's alignment along their block and inline axis directions.

- **Keywords**: css grid, align, justify

## Stretch

Use `d-pls-stretch{-n}` to stretch grid items along their block and inline axis.

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-stretch">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-pls-start{-n}` to align a grid item along the start of their block and/or inline axis.

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-start">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-pls-end{-n}` to align a grid item along the end of their block and/or inline axis.

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-stretch">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-pls-center{-n}` to align a grid item along the center of their block and/or inline axis.

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-center">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-pls-auto` | place-self: auto !important |
| `d-pls-center` | place-self: center !important |
| `d-pls-center-end` | place-self: center end !important |
| `d-pls-center-start` | place-self: center start !important |
| `d-pls-center-stretch` | place-self: center stretch !important |
| `d-pls-end` | place-self: end !important |
| `d-pls-end-center` | place-self: end center !important |
| `d-pls-end-start` | place-self: end start !important |
| `d-pls-end-stretch` | place-self: end stretch !important |
| `d-pls-legacy` | place-self: legacy !important |
| `d-pls-normal` | place-self: normal !important |
| `d-pls-start` | place-self: start !important |
| `d-pls-start-center` | place-self: start center !important |
| `d-pls-start-end` | place-self: start end !important |
| `d-pls-start-stretch` | place-self: start stretch !important |
| `d-pls-stretch` | place-self: stretch !important |
| `d-pls-stretch-center` | place-self: stretch center !important |
| `d-pls-stretch-end` | place-self: stretch end !important |
| `d-pls-stretch-start` | place-self: stretch start !important |
| `d-pls-unset` | place-self: unset !important |
