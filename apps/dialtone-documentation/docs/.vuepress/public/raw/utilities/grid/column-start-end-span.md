# Column Start / End / Span

Utilities for controlling how elements are placed across grid columns.

- **Keywords**: css grid,layout,columns,rows

## Spanning Columns

Use `d-gc{#}` to span an element across multiple columns. This can be combined with `d-gc{#}` classes to span a set of columns. Use `d-gce{#}` to set an element's ending point. A reminder that CSS grid columns start at 1 and end at the number of columns + 1. For example in a 3-column grid, the starting line would be 1 and the ending line would be 4.

```html
<div class="d-d-grid d-g16 d-g-cols4">
  <div>1</div>
  <div>2</div>
  <div class="d-gc2">3</div>
  <div class="d-gc2">4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div class="d-gc3">8</div>
  <div class="d-gc-full">9</div>
</div>
```

## Setting the Starting and Ending Column

Use `d-gcs{#}` to set the starting point for an element. This can be combined with `d-gc{#}` classes to span a set of columns.

```html
<div class="d-d-grid d-g16 d-g-cols6">
  <div class="d-gcs2 d-gce6">1</div>
  <div class="d-gcs1 d-gce5">2</div>
  <div class="d-gcs1 d-gce7">3</div>
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-gc-auto` | grid-column: auto !important |
| `d-gc-full` | grid-column: 1 / -1 !important |
| `d-gc-unset` | grid-column: unset !important |
| `d-gc1` | grid-column: span 1 / span 1 !important |
| `d-gc10` | grid-column: span 10 / span 10 !important |
| `d-gc11` | grid-column: span 11 / span 11 !important |
| `d-gc12` | grid-column: span 12 / span 12 !important |
| `d-gc2` | grid-column: span 2 / span 2 !important |
| `d-gc3` | grid-column: span 3 / span 3 !important |
| `d-gc4` | grid-column: span 4 / span 4 !important |
| `d-gc5` | grid-column: span 5 / span 5 !important |
| `d-gc6` | grid-column: span 6 / span 6 !important |
| `d-gc7` | grid-column: span 7 / span 7 !important |
| `d-gc8` | grid-column: span 8 / span 8 !important |
| `d-gc9` | grid-column: span 9 / span 9 !important |
| `d-gce-auto` | grid-column-end: auto !important |
| `d-gce-unset` | grid-column-end: unset !important |
| `d-gce1` | grid-column-end: 1 !important |
| `d-gce10` | grid-column-end: 10 !important |
| `d-gce11` | grid-column-end: 11 !important |
| `d-gce12` | grid-column-end: 12 !important |
| `d-gce2` | grid-column-end: 2 !important |
| `d-gce3` | grid-column-end: 3 !important |
| `d-gce4` | grid-column-end: 4 !important |
| `d-gce5` | grid-column-end: 5 !important |
| `d-gce6` | grid-column-end: 6 !important |
| `d-gce7` | grid-column-end: 7 !important |
| `d-gce8` | grid-column-end: 8 !important |
| `d-gce9` | grid-column-end: 9 !important |
| `d-gcs-auto` | grid-column-start: auto !important |
| `d-gcs-unset` | grid-column-start: unset !important |
| `d-gcs1` | grid-column-start: 1 !important |
| `d-gcs10` | grid-column-start: 10 !important |
| `d-gcs11` | grid-column-start: 11 !important |
| `d-gcs12` | grid-column-start: 12 !important |
| `d-gcs2` | grid-column-start: 2 !important |
| `d-gcs3` | grid-column-start: 3 !important |
| `d-gcs4` | grid-column-start: 4 !important |
| `d-gcs5` | grid-column-start: 5 !important |
| `d-gcs6` | grid-column-start: 6 !important |
| `d-gcs7` | grid-column-start: 7 !important |
| `d-gcs8` | grid-column-start: 8 !important |
| `d-gcs9` | grid-column-start: 9 !important |
