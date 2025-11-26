---
title: Columns & Layouts
description: Utilities for flex columns and common flex layouts.
---

<FlexStackNotice />

## Creating Flex Columns

Use `d-fl-col{n}` to create uniformly sized children within an element.

<code-well-header>
  <dt-stack gap="500" class="d-w100p">
    <div v-for="(i, index) in columns" class="d-p8 d-bar8 d-bgc-moderate d-w100p">
      <code class="d-bgc-transparent">.d-fl-col{{i}}</code>
      <div class="d-cg8 d-of-auto" :class="`d-fl-col${i}`">
        <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bar4 d-bgc-moderate-opaque" v-for="(col) in columns.slice(0, i)" data-migrate-outline>{{ col }}</dt-stack>
      </div>
    </div>
  </dt-stack>
</code-well-header>

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

<code-well-header>
  <dt-stack gap="500" class="d-w100p">
    <dt-stack v-for="i in gaps" gap="400" class="d-p8 d-bar8 d-bgc-moderate d-w100p">
      <code class="d-bgc-transparent">.d-cg{{ i }}</code>
      <div class="d-fl-col3 d-of-auto" :class="`d-cg${i}`">
        <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bar4 d-bgc-moderate-opaque" data-migrate-outline>1</dt-stack>
        <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bar4 d-bgc-moderate-opaque" data-migrate-outline>2</dt-stack>
        <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bar4 d-bgc-moderate-opaque" data-migrate-outline>3</dt-stack>
      </div>
    </dt-stack>
  </dt-stack>
</code-well-header>

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

This used to be accomplished with `d-fl-center`, which is deprecated in favor of using [Stack](/utilities/stack).

By default flexed items align to `flex-start` both horizontally and vertically (effectively top, left). Combine Stack's `align` and `justify` utilities to center-center child items within an element.

<code-well-header>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-hmn216 d-bgc-moderate" data-migrate-outline>
    <dt-stack direction="row" align="center" justify="center" class="d-w48 d-h48 d-m8 d-p16 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-w64 d-h64 d-m8 d-p16 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-w48 d-h48 d-m8 d-p16 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" align="center" justify="center" data-migrate-outline>
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
