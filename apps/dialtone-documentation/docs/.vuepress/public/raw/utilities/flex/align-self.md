# Align Self

Utilities for setting how an element's is aligned along a parent's cross axis.

- **Keywords**: flexbox, cross axis, override

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Stretch

Use `d-as-stretch` to stretch an item along a parent's cross axis.

```html
<dt-stack direction="row" align="start">
  <div>1</div>
  <div class="d-as-stretch">2</div>
  <div>3</div>
</dt-stack>
```

## Flex Start

Use `d-as-flex-start` to align an item to the start of the parent's cross axis.

```html
<dt-stack direction="row">
    <div>1</div>
    <div class="d-as-flex-start">2</div>
    <div>3</div>
</dt-stack>
```

## Center

Use `d-as-center` to align an item along the center of the parent's cross axis.

```html
<dt-stack direction="row">
  <div>1</div>
  <div class="d-as-center">2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-as-flex-end` to align an item from the end of the parent's cross axis.

```html
<dt-stack direction="row">
  <div>1</div>
  <div class="d-as-flex-end">2</div>
  <div>3</div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-as-auto` | align-self: auto !important |
| `d-as-baseline` | align-self: baseline !important |
| `d-as-center` | align-self: center !important |
| `d-as-flex-end` | align-self: flex-end !important |
| `d-as-flex-start` | align-self: flex-start !important |
| `d-as-normal` | align-self: normal !important |
| `d-as-stretch` | align-self: stretch !important |
| `d-as-unset` | align-self: unset !important |
