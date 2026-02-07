# Place Items

Utilities for controlling how grid items are aligned along their block and inline axis directions.

- **Keywords**: css grid, align, justify

## Stretch

Use `d-pli-stretch{-n}` to stretch grid items along their block and inline axis.

```html
<div class="d-d-grid d-g-cols2 d-pli-stretch">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-pli-start{-n}` to align grid items along the start of their block and/or inline axis.

```html
<div class="d-d-grid d-g-cols2 d-pli-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-pli-end{-n}` to align grid items along the end of their block and/or inline axis.

```html
<div class="d-d-grid d-g-cols2 d-pli-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-pli-center{-n}` to align grid items along the center of their block and/or inline axis.

```html
<div class="d-d-grid d-g-cols2 d-pli-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-pli-auto` | place-items: auto !important |
| `d-pli-center` | place-items: center !important |
| `d-pli-center-end` | place-items: center end !important |
| `d-pli-center-start` | place-items: center start !important |
| `d-pli-center-stretch` | place-items: center stretch !important |
| `d-pli-end` | place-items: end !important |
| `d-pli-end-center` | place-items: end center !important |
| `d-pli-end-start` | place-items: end start !important |
| `d-pli-end-stretch` | place-items: end stretch !important |
| `d-pli-legacy` | place-items: legacy !important |
| `d-pli-normal` | place-items: normal !important |
| `d-pli-start` | place-items: start !important |
| `d-pli-start-center` | place-items: start center !important |
| `d-pli-start-end` | place-items: start end !important |
| `d-pli-start-stretch` | place-items: start stretch !important |
| `d-pli-stretch` | place-items: stretch !important |
| `d-pli-stretch-center` | place-items: stretch center !important |
| `d-pli-stretch-end` | place-items: stretch end !important |
| `d-pli-stretch-start` | place-items: stretch start !important |
| `d-pli-unset` | place-items: unset !important |
