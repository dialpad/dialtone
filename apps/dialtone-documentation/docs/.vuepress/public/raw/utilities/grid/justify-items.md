# Justify Items

Utilities for controlling how grid items align along their inline axis.

- **Keywords**: css grid, inline axis

## Auto

Use `d-ji-auto` to justify grid items automatically along their inline axis. This is the default value.

```html
<div class="d-d-grid d-g-cols2 d-ji-auto">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-ji-start` to justify items against the start of their inline axis. Note that this does not work on flexed objects, only grid objects.

```html
<div class="d-d-grid d-g-cols2 d-ji-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-ji-end` to justify items against the end of their inline axis. Note that this does not work on flexed objects, only grid objects.

```html
<div class="d-d-grid d-g-cols2 d-ji-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-ji-center` to justify items to the center of their inline axis.

```html
<div class="d-d-grid d-g-cols2 d-ji-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ji-auto` | justify-items: auto !important |
| `d-ji-baseline` | justify-items: baseline !important |
| `d-ji-center` | justify-items: center !important |
| `d-ji-end` | justify-items: end !important |
| `d-ji-first-baseline` | justify-items: first-baseline !important |
| `d-ji-last-baseline` | justify-items: last-baseline !important |
| `d-ji-left` | justify-items: left !important |
| `d-ji-legacy` | justify-items: legacy !important |
| `d-ji-normal` | justify-items: normal !important |
| `d-ji-right` | justify-items: right !important |
| `d-ji-safe` | justify-items: safe !important |
| `d-ji-start` | justify-items: start !important |
| `d-ji-stretch` | justify-items: stretch !important |
| `d-ji-unsafe` | justify-items: unsafe !important |
| `d-ji-unset` | justify-items: unset !important |
