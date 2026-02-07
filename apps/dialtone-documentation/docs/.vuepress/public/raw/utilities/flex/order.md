# Order

Utilities for controlling an element's order within a parent container.

- **Keywords**: flexbox,flex order,reorder,sort

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Example

By default, items are ordered by their position in the DOM. To re-order an element, use `d-order{#}`.

```html
<dt-stack align="center" justify="between">
  <div>1</div>
  <div>2</div>
  <div class="d-order-first">3</div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-order-first` | order: -9999 !important |
| `d-order-last` | order: 9999 !important |
| `d-order1` | order: 1 !important |
| `d-order10` | order: 10 !important |
| `d-order11` | order: 11 !important |
| `d-order12` | order: 12 !important |
| `d-order2` | order: 2 !important |
| `d-order3` | order: 3 !important |
| `d-order4` | order: 4 !important |
| `d-order5` | order: 5 !important |
| `d-order6` | order: 6 !important |
| `d-order7` | order: 7 !important |
| `d-order8` | order: 8 !important |
| `d-order9` | order: 9 !important |
