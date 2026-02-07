# Gap

Utilities to control the spacing between columns, rows, or both.

- **Keywords**: flexbox,flex gap,spacing,gutter

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Adding Universal Row and Column Gaps

Use `d-g{#}` to universally change the row and column gap space.

```html
<dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-g16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Row Gap

Use `d-rg{#}` to change the row gap space.

```html
<dt-stack class="d-rg16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Column Gap

Use `d-cg{#}` to change the column gap space.

```html
<dt-stack direction="row" class="d-fl-col4 d-cg16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Independently Changing Row and Column Gaps

```html
<dt-stack direction="row" class="d-rg32 d-cg8">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-cg-unset` | -webkit-column-gap: unset !important; -moz-column-gap: unset !important; column-gap: unset !important |
| `d-cg0` | --fl-gap: var(--dt-size-0); margin: unset |
| `d-cg1` | --fl-gap: var(--dt-size-100); margin: unset |
| `d-cg12` | --fl-gap: var(--dt-size-450); margin: unset |
| `d-cg16` | --fl-gap: var(--dt-size-500); margin: unset |
| `d-cg2` | --fl-gap: var(--dt-size-200); margin: unset |
| `d-cg20` | --fl-gap: var(--dt-size-525); margin: unset |
| `d-cg24` | --fl-gap: var(--dt-size-550); margin: unset |
| `d-cg32` | --fl-gap: var(--dt-size-600); margin: unset |
| `d-cg4` | --fl-gap: var(--dt-size-300); margin: unset |
| `d-cg48` | --fl-gap: var(--dt-size-650); margin: unset |
| `d-cg6` | --fl-gap: var(--dt-size-350); margin: unset |
| `d-cg64` | --fl-gap: var(--dt-size-700); margin: unset |
| `d-cg8` | --fl-gap: var(--dt-size-400); margin: unset |
| `d-g-unset` | gap: unset !important |
| `d-g0` | --fl-gap: var(--dt-size-0); margin: unset |
| `d-g1` | --fl-gap: var(--dt-size-100); margin: unset |
| `d-g12` | --fl-gap: var(--dt-size-450); margin: unset |
| `d-g16` | --fl-gap: var(--dt-size-500); margin: unset |
| `d-g2` | --fl-gap: var(--dt-size-200); margin: unset |
| `d-g20` | --fl-gap: var(--dt-size-525); margin: unset |
| `d-g24` | --fl-gap: var(--dt-size-550); margin: unset |
| `d-g32` | --fl-gap: var(--dt-size-600); margin: unset |
| `d-g4` | --fl-gap: var(--dt-size-300); margin: unset |
| `d-g48` | --fl-gap: var(--dt-size-650); margin: unset |
| `d-g6` | --fl-gap: var(--dt-size-350); margin: unset |
| `d-g64` | --fl-gap: var(--dt-size-700); margin: unset |
| `d-g8` | --fl-gap: var(--dt-size-400); margin: unset |
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
| `d-rg-unset` | row-gap: unset !important |
| `d-rg0` | row-gap: var(--dt-size-0) !important |
| `d-rg1` | row-gap: var(--dt-size-100) !important |
| `d-rg12` | row-gap: var(--dt-size-450) !important |
| `d-rg16` | row-gap: var(--dt-size-500) !important |
| `d-rg2` | row-gap: var(--dt-size-200) !important |
| `d-rg20` | row-gap: var(--dt-size-525) !important |
| `d-rg24` | row-gap: var(--dt-size-550) !important |
| `d-rg32` | row-gap: var(--dt-size-600) !important |
| `d-rg4` | row-gap: var(--dt-size-300) !important |
| `d-rg48` | row-gap: var(--dt-size-650) !important |
| `d-rg6` | row-gap: var(--dt-size-350) !important |
| `d-rg64` | row-gap: var(--dt-size-700) !important |
| `d-rg8` | row-gap: var(--dt-size-400) !important |
