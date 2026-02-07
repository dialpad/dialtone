# Justify Content

Utilities for setting how an element's space around and between content is distributed along its main axis.

- **Keywords**: flexbox, main axis, space between, space around

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Flex Start

Use `d-jc-flex-start` to justify items against the start of the element's main axis. This is the default value.

```html
<dt-stack direction="row" gap="400" class="d-jc-flex-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Center

Use `d-jc-center` to justify items along the center of the element's main axis.

```html
<dt-stack direction="row" gap="400" class="d-jc-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-jc-flex-end` to justify items against the end of the element's main axis.

```html
<dt-stack direction="row" gap="400" class="d-jc-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Around

Use `d-jc-space-around` to justify items along the element's main axis so that there is an equal amount of space on each side of the item. This effectively takes all available space, divides it for each child element, placing half of available space on either side of the child. This is why the space appears doubled for interior objects versus end objects.

```html
<dt-stack direction="row" gap="400" class="d-jc-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Between

Use `d-jc-space-between` to justify items along the element's main axis so that there is an equal amount of space between each item without inserting any space between the first or last object.

```html
<dt-stack direction="row" gap="400" class="d-jc-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Evenly

Use `d-jc-space-evenly` to justify items along the element's main axis so that there is an equal amount of space on each side of the item, but unlike `d-jc-space-around` visually evenly spaces objects.

```html
<dt-stack direction="row" gap="400" class="d-jc-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-jc-baseline` | justify-content: baseline !important |
| `d-jc-center` | justify-content: center !important |
| `d-jc-flex-end` | justify-content: flex-end !important |
| `d-jc-flex-start` | justify-content: flex-start !important |
| `d-jc-normal` | justify-content: normal !important |
| `d-jc-space-around` | justify-content: space-around !important |
| `d-jc-space-between` | justify-content: space-between !important |
| `d-jc-space-evenly` | justify-content: space-evenly !important |
| `d-jc-unset` | justify-content: unset !important |
