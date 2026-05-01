---
title: Auto Spacing
description: Utilities for controlling the space between child elements.
keywords: ["margin","padding","gap","whitespace"]
---

> [!CRITICAL] Deprecated
> `d-stack` and `d-flow` utilities are deprecated. Please use the [Stack](/components/stack) component with the equivalent `gap` prop instead. New usages are flagged by the [`deprecated-stack-flow-classes`](https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/deprecated-stack-flow-classes.md) ESLint rule, which includes a px to `gap` prop mapping.

## Adding Space Vertically

```vue demo
<div class="d-bgc-bold d-stack16 d-bar-400 lg:d-w-150 d-w-200">
  <div class="d-p-200 d-bar-400 d-bgc-moderate d-ta-center">1</div>
  <div class="d-p-200 d-bar-400 d-bgc-moderate d-ta-center">2</div>
  <div class="d-p-200 d-bar-400 d-bgc-moderate d-ta-center">3</div>
</div>
```

## Adding Space Horizontally

```vue demo
<div class="d-fl-center d-bgc-bold d-flow24 d-bar-400 d-ta-center">
  <div class="lg:d-w-150 d-w-200 d-p-200 d-bar-400 d-bgc-moderate">1</div>
  <div class="lg:d-w-150 d-w-200 d-p-200 d-bar-400 d-bgc-moderate">2</div>
  <div class="lg:d-w-150 d-w-200 d-p-200 d-bar-400 d-bgc-moderate">3</div>
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
