---
title: Auto Spacing
description: Utilities for controlling the space between child elements.
keywords: ["margin","padding","gap","whitespace"]
---

> [!ERROR]
> `d-stack` and `d-flow` utilities are deprecated. Please use the [Stack](/components/stack) component instead.

## Adding Space Vertically

<code-well-header>
  <div class="d-bgc-bold d-stack16 d-bar8 lg:d-w-150 d-w-200">
    <div class="d-p-200 d-bar8 d-bgc-moderate d-ta-center">1</div>
    <div class="d-p-200 d-bar8 d-bgc-moderate d-ta-center">2</div>
    <div class="d-p-200 d-bar8 d-bgc-moderate d-ta-center">3</div>
  </div>
</code-well-header>

```html
<div class="d-stack16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Adding Space Horizontally

<code-well-header>
  <div class="d-fl-center d-bgc-bold d-flow24 d-bar8 d-ta-center">
    <div class="lg:d-w-150 d-w-200 d-p-200 d-bar8 d-bgc-moderate">1</div>
    <div class="lg:d-w-150 d-w-200 d-p-200 d-bar8 d-bgc-moderate">2</div>
    <div class="lg:d-w-150 d-w-200 d-p-200 d-bar8 d-bgc-moderate">3</div>
  </div>
</code-well-header>

```html
<div class="d-flow24">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

<script setup>
  import { values } from '@data/auto-spacing.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Classes

The Stack and Flow layouts work by using the adjacent sibling combinator (`+`) to apply a top or left margin to sibling elements. This means it will only work when there are more than two sibling items. To allow for differing nesting spacing values, these margins are scoped to apply **only** to direct children of the parent (e.g. `.d-stack[#] > * + *`).

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w25p"><div class="d-p-200 d-bb d-bbw1">Value</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Vertical Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Horizontal Class</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ value: val } in values">
          <th scope="row">{{ val }}px</th>
          <td class="d-code--sm d-docsite-code">.d-stack{{ val }}</td>
          <td class="d-code--sm d-docsite-code">.d-flow{{ val }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
