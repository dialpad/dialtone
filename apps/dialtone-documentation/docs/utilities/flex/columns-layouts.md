---
title: Columns & Layouts
description: Utilities for flex columns and common flex layouts.
keywords: ["flexbox","flex columns","flex layout","column layout"]
---

<FlexStackNotice />

## Creating Flex Columns

Use `d-fl-col{n}` to create uniformly sized children within an element.

```vue demo
<dt-stack gap="200" class="d-w100p">
  <div v-for="(i, index) in columns" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col{{i}}</dt-text>
    <div class="d-cg-100 d-of-auto" :class="`d-fl-col${i}`">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque" v-for="(col) in columns.slice(0, i)">{{ col }}</dt-stack>
    </div>
  </div>
</dt-stack>
```

## Flex Column Gaps

Use `d-cg{n}` to create uniform gaps between flex columns within an element.

```vue demo
<dt-stack gap="200" class="d-w100p">
  <dt-stack v-for="i in gaps" gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg{{ i }}</dt-text>
    <div class="d-fl-col3 d-of-auto" :class="`d-cg${i}`">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
</dt-stack>
```

## Centering Objects

This used to be accomplished with `d-fl-center`, which is deprecated in favor of using [Stack](/utilities/stack).

By default flexed items align to `flex-start` both horizontally and vertically (effectively top, left). Combine Stack's `align` and `justify` utilities to center-center child items within an element.

```vue demo
<dt-stack direction="row" align="center" justify="center" class="d-w100p d-hmn216 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-size-75 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-size-100 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-size-75 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</dt-stack>
```

<script setup>
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const gaps = [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64];
  const calcFlexBasis = (columns) => {
    return Math.round(100/columns);
  };
  const calcGap = (gap) => {
    return `${gap/10}rem`;
  };
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in columns">
        <th scope="row" class="d-code--sm d-docsite-code">.d-fl-col{{ i }}</th>
        <td class="d-code--sm d-ws-pre">> *{ flex-basis: calc({{ calcFlexBasis(i) }}% - (var(--fl-gap)* 2)); }</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in gaps">
        <th scope="row" class="d-code--sm d-docsite-code">.d-cg{{ i }}</th>
        <td class="d-code--sm d-ws-pre">> * { --fl-gap: {{ calcGap(i) }} !important; }</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
