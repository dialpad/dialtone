# Align Content

Utilities for setting how rows are distributed along its cross axis. This property only works when a parent container has more than one line.

- **Keywords**: flexbox, cross axis, flex wrap

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Flex Start

Use `d-ac-flex-start` to pack multiple rows against the start of the element's cross axis. This is the default value.

```html
<dt-stack class="d-ac-flex-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Center

Use `d-ac-center` to pack rows along the center of the element's cross axis.

```html
<dt-stack class="d-ac-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-ac-flex-end` to rack rows against the end of the element's main axis.

```html
<dt-stack class="d-ac-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Around

Use `d-ac-space-around` to pack rows along the element's cross axis so that there is an equal amount of space on each side of the item. This effectively takes all available space, divides it for each row, placing half of alotted space on either side of the row. This is why the space appears doubled for interior rows versus end rows.

```html
<dt-stack class="d-ac-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</dt-stack>
```

## Space Between

Use `d-ac-space-between` to distribute rows along the element's cross axis so that there is an equal amount of space between each row without inserting any space between the first or last object.

```html
<dt-stack class="d-ac-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</dt-stack>
```

## Space Evenly

Use `d-ac-space-evenly` to distribute rows along the element's cross axis so that there is an equal amount of space on each side of the rows, but unlike `d-ac-space-around` the space visually looks evenly distributed between objects.

```html
<dt-stack class="d-ac-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ac-baseline` | align-content: baseline !important |
| `d-ac-center` | align-content: center !important |
| `d-ac-flex-end` | align-content: flex-end !important |
| `d-ac-flex-start` | align-content: flex-start !important |
| `d-ac-normal` | align-content: normal !important |
| `d-ac-space-around` | align-content: space-around !important |
| `d-ac-space-between` | align-content: space-between !important |
| `d-ac-space-evenly` | align-content: space-evenly !important |
| `d-ac-stretch` | align-content: stretch !important |
| `d-ac-unset` | align-content: unset !important |
