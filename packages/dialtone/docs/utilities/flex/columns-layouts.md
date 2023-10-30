---
title: Columns & layouts
description: Utilities for flex columns and common flex layouts.
---

## Creating flex columns

Use `d-fl-col{n}` to create uniformly sized children within an element.

<code-well-header class="d-d-flex d-fd-column d-p16 d-bgc-purple-100 d-bgo50 d-w100p d-hmx464 d-of-y-scroll d-stack8" custom>
  <div v-for="(i, index) in columns" class="d-d-flex d-fd-column d-p8 d-bar8 d-bgc-purple-100">
    <code>.d-fl-col{{i}}</code>
    <div class="d-flg8 d-of-auto" :class="`d-fl-col${i}`">
      <div v-for="(col) in columns.slice(0, i)" class="d-fl-center d-p16 d-bar4 d-bgc-purple-300 d-fs-200 d-fw-bold">{{ col }}</div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-fl-col1">...</div>
<div class="d-fl-col2">...</div>
<div class="d-fl-col3">...</div>
<div class="d-fl-col4">...</div>
<div class="d-fl-col5">...</div>
<div class="d-fl-col6">...</div>
<div class="d-fl-col7">...</div>
<div class="d-fl-col8">...</div>
<div class="d-fl-col9">...</div>
<div class="d-fl-col10">...</div>
<div class="d-fl-col11">...</div>
<div class="d-fl-col12">...</div>
```

## Flex column gaps

Use `d-flg{n}` to create uniform gaps between flex columns within an element.

<code-well-header class="d-d-flex d-fd-column d-p16 d-bgc-purple-100 d-bgo50 d-w100p d-hmx464 d-of-y-scroll d-stack8" custom>
  <div class="d-d-flex d-fd-column d-p8 d-bar8 d-bgc-purple-100" v-for="i in gaps">
    <code>.d-flg{{ i }}</code>
    <div class="d-fl-col3 d-of-auto" :class="`d-flg${i}`">
      <div class="d-fl-center d-p16 d-bar4 d-bgc-purple-300 d-fs-200 d-fw-bold">1</div>
      <div class="d-fl-center d-p16 d-bar4 d-bgc-purple-300 d-fs-200 d-fw-bold">2</div>
      <div class="d-fl-center d-p16 d-bar4 d-bgc-purple-300 d-fs-200 d-fw-bold">3</div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-fl-col3 d-flg0">...</div>
<div class="d-fl-col3 d-flg1">...</div>
<div class="d-fl-col3 d-flg2">...</div>
<div class="d-fl-col3 d-flg4">...</div>
<div class="d-fl-col3 d-flg6">...</div>
<div class="d-fl-col3 d-flg8">...</div>
<div class="d-fl-col3 d-flg12">...</div>
<div class="d-fl-col3 d-flg16">...</div>
<div class="d-fl-col3 d-flg24">...</div>
<div class="d-fl-col3 d-flg32">...</div>
<div class="d-fl-col3 d-flg48">...</div>
<div class="d-fl-col3 d-flg64">...</div>
```

## Centering objects

By default flexed items align to `flex-start` both horizontally and vertically (effectively top, left). Use `d-fl-center` to center-center child items within an element.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-fl-center d-w48 d-h48 d-m8 d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
  <div class="d-fl-center d-w64 d-h64 d-m8 d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
  <div class="d-fl-center d-w48 d-h48 d-m8 d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
</code-well-header>

```html
<div class="d-fl-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

<script setup>
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const gaps = [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64];
  const calcFlexBasis = (columns) => {
    return Math.round(100/columns);
  };
  const calcGap = (gap) => {
    const res = (gap/10);
    return res !== 0 ? res+'rem' : res;
  };
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr v-for="i in columns">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-fl-col{{ i }}</th>
          <td class="d-ff-mono d-fs-100 d-ws-pre">> *{ flex-basis: calc({{ calcFlexBasis(i) }}% - (var(--fl-gap)* 2)); }</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in gaps">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-flg{{ i }}</th>
          <td class="d-ff-mono d-fs-100 d-ws-pre">> * { --fl-gap: {{ calcGap(i) }} !important; }</td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
