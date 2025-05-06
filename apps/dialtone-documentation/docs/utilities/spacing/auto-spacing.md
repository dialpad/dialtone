---
title: Auto Spacing
description: Utilities for controlling the space between child elements.
---

## Adding Space Vertically

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-w100p d-hmn216" custom>
  <div class="d-fl-center d-fd-column d-bgc-tan-200 d-stack16 d-bar8">
    <div class="d-w128 d-p16 d-bar8 d-bgc-purple-300 d-fs-300 d-fw-bold d-ta-center">1</div>
    <div class="d-w128 d-p16 d-bar8 d-bgc-purple-300 d-fs-300 d-fw-bold d-ta-center">2</div>
    <div class="d-w128 d-p16 d-bar8 d-bgc-purple-300 d-fs-300 d-fw-bold d-ta-center">3</div>
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

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-w100p d-hmn216" custom>
  <div class="d-fl-center d-bgc-tan-200 d-flow24 d-bar8 d-fs-300 d-fw-bold d-ta-center">
    <div class="d-w96 lg:d-w128 d-p16 d-bar8 d-bgc-purple-300">1</div>
    <div class="d-w96 lg:d-w128 d-p16 d-bar8 d-bgc-purple-300">2</div>
    <div class="d-w96 lg:d-w128 d-p16 d-bar8 d-bgc-purple-300">3</div>
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
</script>

## Classes

The Stack and Flow layouts work by using the adjacent sibling combinator (`+`) to apply a top or left margin to sibling elements. This means it will only work when there are more than two sibling items. To allow for differing nesting spacing values, these margins are scoped to apply **only** to direct children of the parent (e.g. `.d-stack[#] > * + *`).

<div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w25p"><div class="d-p16 d-bb d-bc-default d-bbw1">Value</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Vertical Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Horizontal Class</div></th>
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
</div>
