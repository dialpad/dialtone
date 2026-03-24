---
title: Columns & Layouts
description: Utilities for flex columns and common flex layouts.
keywords: ["flexbox","flex columns","flex layout","column layout"]
---

<FlexStackNotice />

## Creating Flex Columns

Use `d-fl-col{n}` to create uniformly sized children within an element.

<code-well-header>
  <dt-stack gap="200" class="d-w100p">
    <div v-for="(i, index) in columns" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
      <code class="d-bgc-transparent">.d-fl-col{{i}}</code>
      <div class="d-cg-100 d-of-auto" :class="`d-fl-col${i}`">
        <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque" v-for="(col) in columns.slice(0, i)">{{ col }}</dt-stack>
      </div>
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-fl-col1">...</div>
<div class="d-fl-col2 d-cg-100">...</div>
<div class="d-fl-col3 d-cg-100">...</div>
<div class="d-fl-col4 d-cg-100">...</div>
<div class="d-fl-col5 d-cg-100">...</div>
<div class="d-fl-col6 d-cg-100">...</div>
<div class="d-fl-col7 d-cg-100">...</div>
<div class="d-fl-col8 d-cg-100">...</div>
<div class="d-fl-col9 d-cg-100">...</div>
<div class="d-fl-col10 d-cg-100">...</div>
<div class="d-fl-col11 d-cg-100">...</div>
<div class="d-fl-col12 d-cg-100">...</div>
```

## Flex Column Gaps

Use `d-cg{n}` to create uniform gaps between flex columns within an element.

<code-well-header>
  <dt-stack gap="200" class="d-w100p">
    <dt-stack v-for="i in gaps" gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
      <code class="d-bgc-transparent">.d-cg{{ i }}</code>
      <div class="d-fl-col3 d-of-auto" :class="`d-cg${i}`">
        <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
        <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
        <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      </div>
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<div class="d-fl-col3 d-cg-0">...</div>
<div class="d-fl-col3 d-cg-1">...</div>
<div class="d-fl-col3 d-cg-25">...</div>
<div class="d-fl-col3 d-cg-50">...</div>
<div class="d-fl-col3 d-cg-75">...</div>
<div class="d-fl-col3 d-cg-100">...</div>
<div class="d-fl-col3 d-cg-150">...</div>
<div class="d-fl-col3 d-cg-200">...</div>
<div class="d-fl-col3 d-cg-300">...</div>
<div class="d-fl-col3 d-cg-400">...</div>
<div class="d-fl-col3 d-cg-600">...</div>
<div class="d-fl-col3 d-cg-800">...</div>
```

## Centering Objects

This used to be accomplished with `d-fl-center`, which is deprecated in favor of using [Stack](/utilities/stack).

By default flexed items align to `flex-start` both horizontally and vertically (effectively top, left). Combine Stack's `align` and `justify` utilities to center-center child items within an element.

<code-well-header>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-hmn216 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-w-75 d-h-75 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-w-100 d-h-100 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-w-75 d-h-75 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" align="center" justify="center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
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
