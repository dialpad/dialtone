# Columns & Layouts

Utilities for flex columns and common flex layouts.

- **Keywords**: flexbox,flex columns,flex layout,column layout

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Creating Flex Columns

Use `d-fl-col{n}` to create uniformly sized children within an element.

```html
<div class="d-fl-col1">...</div>
<div class="d-fl-col2 d-cg8">...</div>
<div class="d-fl-col3 d-cg8">...</div>
<div class="d-fl-col4 d-cg8">...</div>
<div class="d-fl-col5 d-cg8">...</div>
<div class="d-fl-col6 d-cg8">...</div>
<div class="d-fl-col7 d-cg8">...</div>
<div class="d-fl-col8 d-cg8">...</div>
<div class="d-fl-col9 d-cg8">...</div>
<div class="d-fl-col10 d-cg8">...</div>
<div class="d-fl-col11 d-cg8">...</div>
<div class="d-fl-col12 d-cg8">...</div>
```

## Flex Column Gaps

Use `d-cg{n}` to create uniform gaps between flex columns within an element.

```html
<div class="d-fl-col3 d-cg0">...</div>
<div class="d-fl-col3 d-cg1">...</div>
<div class="d-fl-col3 d-cg2">...</div>
<div class="d-fl-col3 d-cg4">...</div>
<div class="d-fl-col3 d-cg6">...</div>
<div class="d-fl-col3 d-cg8">...</div>
<div class="d-fl-col3 d-cg12">...</div>
<div class="d-fl-col3 d-cg16">...</div>
<div class="d-fl-col3 d-cg24">...</div>
<div class="d-fl-col3 d-cg32">...</div>
<div class="d-fl-col3 d-cg48">...</div>
<div class="d-fl-col3 d-cg64">...</div>
```

## Centering Objects

This used to be accomplished with `d-fl-center`, which is deprecated in favor of using [Stack](../stack.md).

By default flexed items align to `flex-start` both horizontally and vertically (effectively top, left). Combine Stack's `align` and `justify` utilities to center-center child items within an element.

```html
<dt-stack direction="row" align="center" justify="center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-fl-col1` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col1.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col10` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col10.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col11` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col11.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col12` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col12.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col2` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col2.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col3` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col3.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col4` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col4.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col5` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col5.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col6` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col6.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col7` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col7.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col8` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col8.d-fd-column` | margin: var(--fl-gap) 0 |
| `d-fl-col9` | -webkit-margin-before: var(--dt-size-0); margin-block-start: var(--dt-size-0) |
| `d-fl-col9.d-fd-column` | margin: var(--fl-gap) 0 |
