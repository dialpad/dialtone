# Gap

Utilities to control the spacing between columns, rows, or both in grids.

- **Keywords**: css grid,grid gap,gutter,spacing

## Adding Universal Row and Column Gaps

Use `d-g{#}` to universally change the row and column gap space in grid layouts.

```html
<div class="d-d-grid d-g16 d-g-cols2">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Independently Changing Row and Column Gaps

Use `d-cg{#}` or `d-rg{#}` to independently change the row and column gap space in grid layouts.

```html
<div class="d-d-grid d-cg24 d-rg8 d-g-cols3">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-gcg-unset` | -webkit-column-gap: unset !important; -moz-column-gap: unset !important; column-gap: unset !important |
| `d-gcg0` | grid-column-gap: var(--dt-size-0) !important |
| `d-gcg1` | grid-column-gap: var(--dt-size-100) !important |
| `d-gcg12` | grid-column-gap: var(--dt-size-450) !important |
| `d-gcg16` | grid-column-gap: var(--dt-size-500) !important |
| `d-gcg2` | grid-column-gap: var(--dt-size-200) !important |
| `d-gcg20` | grid-column-gap: var(--dt-size-525) !important |
| `d-gcg24` | grid-column-gap: var(--dt-size-550) !important |
| `d-gcg32` | grid-column-gap: var(--dt-size-600) !important |
| `d-gcg4` | grid-column-gap: var(--dt-size-300) !important |
| `d-gcg48` | grid-column-gap: var(--dt-size-650) !important |
| `d-gcg6` | grid-column-gap: var(--dt-size-350) !important |
| `d-gcg64` | grid-column-gap: var(--dt-size-700) !important |
| `d-gcg8` | grid-column-gap: var(--dt-size-400) !important |
| `d-gg-unset` | gap: unset !important |
| `d-gg0` | grid-gap: var(--dt-size-0) !important |
| `d-gg1` | grid-gap: var(--dt-size-100) !important |
| `d-gg12` | grid-gap: var(--dt-size-450) !important |
| `d-gg16` | grid-gap: var(--dt-size-500) !important |
| `d-gg2` | grid-gap: var(--dt-size-200) !important |
| `d-gg20` | grid-gap: var(--dt-size-525) !important |
| `d-gg24` | grid-gap: var(--dt-size-550) !important |
| `d-gg32` | grid-gap: var(--dt-size-600) !important |
| `d-gg4` | grid-gap: var(--dt-size-300) !important |
| `d-gg48` | grid-gap: var(--dt-size-650) !important |
| `d-gg6` | grid-gap: var(--dt-size-350) !important |
| `d-gg64` | grid-gap: var(--dt-size-700) !important |
| `d-gg8` | grid-gap: var(--dt-size-400) !important |
| `d-grg-unset` | row-gap: unset !important |
| `d-grg0` | grid-row-gap: var(--dt-size-0) !important |
| `d-grg1` | grid-row-gap: var(--dt-size-100) !important |
| `d-grg12` | grid-row-gap: var(--dt-size-450) !important |
| `d-grg16` | grid-row-gap: var(--dt-size-500) !important |
| `d-grg2` | grid-row-gap: var(--dt-size-200) !important |
| `d-grg20` | grid-row-gap: var(--dt-size-525) !important |
| `d-grg24` | grid-row-gap: var(--dt-size-550) !important |
| `d-grg32` | grid-row-gap: var(--dt-size-600) !important |
| `d-grg4` | grid-row-gap: var(--dt-size-300) !important |
| `d-grg48` | grid-row-gap: var(--dt-size-650) !important |
| `d-grg6` | grid-row-gap: var(--dt-size-350) !important |
| `d-grg64` | grid-row-gap: var(--dt-size-700) !important |
| `d-grg8` | grid-row-gap: var(--dt-size-400) !important |
