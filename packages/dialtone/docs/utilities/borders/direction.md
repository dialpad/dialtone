---
title: Border directions
description: Utilities for controlling an element's border.
---

## All sides

Use `d-ba` to add a border to all sides of your element.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102">
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw0 d-bgc-magenta-100 d-fs-200 d-fw-bold">.d-baw0</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw1 d-bgc-magenta-100 d-fs-200 d-fw-bold">.d-baw1</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw2 d-bgc-magenta-100 d-fs-200 d-fw-bold">.d-baw2</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw4 d-bgc-magenta-100 d-fs-200 d-fw-bold">.d-baw4</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw6 d-bgc-magenta-100 d-fs-200 d-fw-bold">.d-baw6</div>
</code-well-header>

```html
<div class="d-ba d-bc-magenta-200 d-baw0">...</div>
<div class="d-ba d-bc-magenta-200 d-baw1">...</div>
<div class="d-ba d-bc-magenta-200 d-baw2">...</div>
<div class="d-ba d-bc-magenta-200 d-baw4">...</div>
<div class="d-ba d-bc-magenta-200 d-baw6">...</div>
```

## Individual sides

Use `d-b{t|r|b|l|x|y}` to add a border to only specific sides of your element.

<code-well-header class="d-fl-col4 d-flg8 d-fw-wrap d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102">
  <div class="d-fl-center d-p16 d-bt d-bc-purple-400 d-baw2 d-bgc-purple-100 d-fs-200 d-fw-bold">.d-bt</div>
  <div class="d-fl-center d-p16 d-br d-bc-purple-400 d-baw2 d-bgc-purple-100 d-fs-200 d-fw-bold">.d-br</div>
  <div class="d-fl-center d-p16 d-bb d-bc-purple-400 d-baw2 d-bgc-purple-100 d-fs-200 d-fw-bold">.d-bb</div>
  <div class="d-fl-center d-p16 d-bl d-bc-purple-400 d-baw2 d-bgc-purple-100 d-fs-200 d-fw-bold">.d-bl</div>
  <div class="d-fl-center d-p16 d-bx d-bc-purple-400 d-baw2 d-bgc-purple-100 d-fs-200 d-fw-bold">.d-bx</div>
  <div class="d-fl-center d-p16 d-by d-bc-purple-400 d-baw2 d-bgc-purple-100 d-fs-200 d-fw-bold">.d-by</div>
  <div class="d-fl-center d-p16 d-ba d-bc-purple-400 d-baw2 d-btw0 d-bgc-purple-100 d-fs-200 d-fw-bold">.d-ba d-btw0</div>
</code-well-header>

```html
<div class="d-bt d-bc-purple-400 d-baw2 ">...</div>
<div class="d-br d-bc-purple-400 d-baw2 ">...</div>
<div class="d-bb d-bc-purple-400 d-baw2 ">...</div>
<div class="d-bl d-bc-purple-400 d-baw2 ">...</div>
<div class="d-bx d-bc-purple-400 d-baw2 ">...</div>
<div class="d-by d-bc-purple-400 d-baw2 ">...</div>
<div class="d-ba d-bc-purple-400 d-baw2 d-btw0 ">...</div>
```

<script setup>
  import { directions } from '@data/borders.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in directions">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-b{{ i[0] }}</th>
        <td class="d-ff-mono d-fs-100">
          <span v-if="i === 'y'">
            border-top: var(--dt-space-100) solid !important;<br/>
            border-bottom: var(--dt-space-100) solid !important;
          </span>
          <span v-else-if="i === 'x'">
            border-right: var(--dt-space-100) solid !important;<br/>
            border-left: var(--dt-space-100) solid !important;
          </span>
          <span v-else>
            border-{{i}}: var(--dt-space-100) solid !important;
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
