# Display

Utilities for controlling the display box type of an element.

- **Keywords**: block, inline, flex, grid, none, hidden

## Examples

```html
<div class="d-d-block">…</div>
<div class="d-d-contents">…</div>
<div class="d-d-inline-block">…</div>
<div class="d-d-inline">…</div>
<div class="d-d-none">…</div>
<div class="d-d-unset">…</div>
```

## Flex Display

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

While `d-d-flex` and `d-d-inline-flex` technically are `display` utilities, use the [DtStack](../../components/stack.md) component instead.

```html
<dt-stack
  gap="500"
  direction="row"
>
  <div>
    Stack item 1
  </div>
  <div>
    Stack item 2
  </div>
  <div>
    Stack item 3
  </div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-d-block` | display: block !important |
| `d-d-contents` | display: contents !important |
| `d-d-flex` | display: flex !important |
| `d-d-grid` | display: grid !important |
| `d-d-inline` | display: inline !important |
| `d-d-inline-block` | display: inline-block !important |
| `d-d-inline-flex` | display: inline-flex !important |
| `d-d-inline-grid` | display: inline-grid !important |
| `d-d-none` | display: none !important |
| `d-d-unset` | display: unset !important |
