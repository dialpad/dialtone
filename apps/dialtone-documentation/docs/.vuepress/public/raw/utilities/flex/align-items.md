# Align Items

Utilities for setting how an element's is aligned along an element's cross axis.

- **Keywords**: flexbox, cross axis, center, stretch

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Stretch

Use `d-ai-stretch` to stretch items across the element's cross axis. This is the default value.

```html
<dt-stack direction="row" class="d-ai-stretch">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Flex Start

Use `d-ai-flex-start` to align items to the start of the element's cross axis.

```html
<dt-stack direction="row" class="d-ai-flex-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Center

Use `d-ai-center` to distribute items along the center of the element's cross axis.

```html
<dt-stack direction="row" class="d-ai-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-ai-flex-end` to distribute items from the end of the element's cross axis.

```html
<dt-stack direction="row" class="d-ai-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ai-baseline` | align-items: baseline !important |
| `d-ai-center` | align-items: center !important |
| `d-ai-flex-end` | align-items: flex-end !important |
| `d-ai-flex-start` | align-items: flex-start !important |
| `d-ai-normal` | align-items: normal !important |
| `d-ai-stretch` | align-items: stretch !important |
| `d-ai-unset` | align-items: unset !important |
