# Place Content

Utilities for controlling how grid items are aligned along both the block and inline axis directions.

- **Keywords**: css grid, align, justify

## Stretch

Use `d-plc-stretch{-n}` to stretch grid items along the block and inline axis.

```html
<div class="d-d-grid d-g-cols2 d-plc-stretch">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-plc-start{-n}` to align grid items along the start of the block and/or inline axis.

```html
<div class="d-d-grid d-g-cols3 d-plc-start-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-plc-end{-n}` to align grid items along the end of the block and/or inline axis.

```html
<div class="d-d-grid d-g-cols3 d-plc-end-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-plc-center{-n}` to align grid items along the center of the block and/or inline axis.

```html
<div class="d-d-grid d-g-cols3 d-plc-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Space Evenly

Use `d-plc-space-evenly{-n}` to distribute grid items evenly along the block axis.

```html
<div class="d-d-grid d-g-cols3 d-plc-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Space Around

Use `d-plc-space-around{-n}` to distribute grid items so there is an equal amount of space around each row on the block axis.

```html
<div class="d-d-grid d-g-cols3 d-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Space Between

Use `d-plc-space-between{-n}` to distribute grid items along the block axis so that there is an equal space between each row.

```html
<div class="d-d-grid d-g-cols3 d-plc-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-plc-auto` | place-content: auto !important |
| `d-plc-center` | place-content: center !important |
| `d-plc-center-end` | place-content: center end !important |
| `d-plc-center-space-around` | place-content: center space-around !important |
| `d-plc-center-space-between` | place-content: center space-between !important |
| `d-plc-center-space-evenly` | place-content: center space-evenly !important |
| `d-plc-center-start` | place-content: center start !important |
| `d-plc-center-stretch` | place-content: center stretch !important |
| `d-plc-end` | place-content: end !important |
| `d-plc-end-center` | place-content: end center !important |
| `d-plc-end-space-around` | place-content: end space-around !important |
| `d-plc-end-space-between` | place-content: end space-between !important |
| `d-plc-end-space-evenly` | place-content: end space-evenly !important |
| `d-plc-end-start` | place-content: end start !important |
| `d-plc-end-stretch` | place-content: end stretch !important |
| `d-plc-legacy` | place-content: legacy !important |
| `d-plc-normal` | place-content: normal !important |
| `d-plc-space-around` | place-content: space-around !important |
| `d-plc-space-around-center` | place-content: space-around center !important |
| `d-plc-space-around-end` | place-content: space-around end !important |
| `d-plc-space-around-space-between` | place-content: space-around space-between !important |
| `d-plc-space-around-space-evenly` | place-content: space-around space-evenly !important |
| `d-plc-space-around-start` | place-content: space-around start !important |
| `d-plc-space-between` | place-content: space-between !important |
| `d-plc-space-between-center` | place-content: space-between center !important |
| `d-plc-space-between-end` | place-content: space-between end !important |
| `d-plc-space-between-space-around` | place-content: space-between space-around !important |
| `d-plc-space-between-space-evenly` | place-content: space-between space-evenly !important |
| `d-plc-space-between-start` | place-content: space-between start !important |
| `d-plc-space-evenly` | place-content: space-evenly !important |
| `d-plc-space-evenly-center` | place-content: space-evenly center !important |
| `d-plc-space-evenly-end` | place-content: space-evenly end !important |
| `d-plc-space-evenly-space-around` | place-content: space-evenly space-around !important |
| `d-plc-space-evenly-space-between` | place-content: space-evenly space-between !important |
| `d-plc-space-evenly-start` | place-content: space-evenly start !important |
| `d-plc-start` | place-content: start !important |
| `d-plc-start-center` | place-content: start center !important |
| `d-plc-start-end` | place-content: start end !important |
| `d-plc-start-space-around` | place-content: start space-around !important |
| `d-plc-start-space-between` | place-content: start space-between !important |
| `d-plc-start-space-evenly` | place-content: start space-evenly !important |
| `d-plc-start-stretch` | place-content: start stretch !important |
| `d-plc-stretch` | place-content: stretch !important |
| `d-plc-stretch-center` | place-content: stretch center !important |
| `d-plc-stretch-end` | place-content: stretch end !important |
| `d-plc-stretch-space-around` | place-content: stretch space-around !important |
| `d-plc-stretch-space-between` | place-content: stretch space-between !important |
| `d-plc-stretch-space-evenly` | place-content: stretch space-evenly !important |
| `d-plc-stretch-start` | place-content: stretch start !important |
| `d-plc-unset` | place-content: unset !important |
