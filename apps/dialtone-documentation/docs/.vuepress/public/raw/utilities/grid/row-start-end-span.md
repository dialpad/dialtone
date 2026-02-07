# Row Start / End / Span

Utilities for controlling how elements are placed across grid rows.

- **Keywords**: css grid, grid row, row span, row end

## Spanning Rows

Use `d-gr{#}` to span an element across multiple rows. This can be combined with `d-gc{#}` classes to span a set of columns.

```html
<div class="d-d-grid d-g16 d-g-cols3 d-g-rows3">
  <div class="d-gc2 d-gr2">1</div>
  <div>2</div>
  <div class="d-gr2">3</div>
  <div class="d-gc2">4</div>
</div>
```

## Setting the Starting and Ending Rows

Use `d-grs{#}` to set the starting point for an element. This can be combined with `d-gc{#}` classes to span a set of columns.

Use `d-gre{#}` to set an element's ending point. A reminder that CSS grid rows start at 1 and end at the number of rows + 1. For example in a 4-row grid, the starting line would be 1 and the ending line would be 5.

```html
<div class="d-d-grid d-g16 d-g-cols3 d-g-rows4">
  <div class="d-gc2 d-grs1 d-gre3">1</div>
  <div>2</div>
  <div class="d-grs2 d-gre5">3</div>
  <div class="d-gc2 d-gr2">4</div>
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-gr-auto` | grid-row: auto !important |
| `d-gr-full` | grid-row: 1 / -1 !important |
| `d-gr-unset` | grid-row: unset !important |
| `d-gr1` | grid-row: span 1 / span 1 !important |
| `d-gr10` | grid-row: span 10 / span 10 !important |
| `d-gr11` | grid-row: span 11 / span 11 !important |
| `d-gr12` | grid-row: span 12 / span 12 !important |
| `d-gr2` | grid-row: span 2 / span 2 !important |
| `d-gr3` | grid-row: span 3 / span 3 !important |
| `d-gr4` | grid-row: span 4 / span 4 !important |
| `d-gr5` | grid-row: span 5 / span 5 !important |
| `d-gr6` | grid-row: span 6 / span 6 !important |
| `d-gr7` | grid-row: span 7 / span 7 !important |
| `d-gr8` | grid-row: span 8 / span 8 !important |
| `d-gr9` | grid-row: span 9 / span 9 !important |
| `d-gre-auto` | grid-row-end: auto !important |
| `d-gre-unset` | grid-row-end: unset !important |
| `d-gre1` | grid-row-end: 1 !important |
| `d-gre10` | grid-row-end: 10 !important |
| `d-gre11` | grid-row-end: 11 !important |
| `d-gre12` | grid-row-end: 12 !important |
| `d-gre2` | grid-row-end: 2 !important |
| `d-gre3` | grid-row-end: 3 !important |
| `d-gre4` | grid-row-end: 4 !important |
| `d-gre5` | grid-row-end: 5 !important |
| `d-gre6` | grid-row-end: 6 !important |
| `d-gre7` | grid-row-end: 7 !important |
| `d-gre8` | grid-row-end: 8 !important |
| `d-gre9` | grid-row-end: 9 !important |
| `d-grs-auto` | grid-row-start: auto !important |
| `d-grs-unset` | grid-row-start: unset !important |
| `d-grs1` | grid-row-start: 1 !important |
| `d-grs10` | grid-row-start: 10 !important |
| `d-grs11` | grid-row-start: 11 !important |
| `d-grs12` | grid-row-start: 12 !important |
| `d-grs2` | grid-row-start: 2 !important |
| `d-grs3` | grid-row-start: 3 !important |
| `d-grs4` | grid-row-start: 4 !important |
| `d-grs5` | grid-row-start: 5 !important |
| `d-grs6` | grid-row-start: 6 !important |
| `d-grs7` | grid-row-start: 7 !important |
| `d-grs8` | grid-row-start: 8 !important |
| `d-grs9` | grid-row-start: 9 !important |
