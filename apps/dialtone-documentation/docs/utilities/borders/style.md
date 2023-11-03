---
title: Border style.
description: Utilities for controlling an element's border style.
---

## Dashed borders

Use `d-b{a|t|r|b|l}s-dashed` to change the border style to dashed on your element.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-bas-dashed d-baw4 d-bgc-magenta-100 d-fs-100 d-ff-mono">.d-bas-dashed</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-bts-dashed d-baw4 d-bgc-magenta-100 d-fs-100 d-ff-mono">.d-bts-dashed</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-brs-dashed d-baw4 d-bgc-magenta-100 d-fs-100 d-ff-mono">.d-brs-dashed</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-bbs-dashed d-baw4 d-bgc-magenta-100 d-fs-100 d-ff-mono">.d-bbs-dashed</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-bls-dashed d-baw4 d-bgc-magenta-100 d-fs-100 d-ff-mono">.d-bls-dashed</div>
</code-well-header>

```html

<div class="d-ba d-bc-magenta-200 d-bas-dashed d-baw4">...</div>
<div class="d-ba d-bc-magenta-200 d-bts-dashed d-baw4">...</div>
<div class="d-ba d-bc-magenta-200 d-brs-dashed d-baw4">...</div>
<div class="d-ba d-bc-magenta-200 d-bbs-dashed d-baw4">...</div>
<div class="d-ba d-bc-magenta-200 d-bls-dashed d-baw4">...</div>
```

## Dotted borders

Use `d-b{a|t|r|b|l}s-dotted` to change the border style to dotted on your element.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-ba d-bc-purple-400 d-bas-dotted d-baw4 d-bgc-purple-100 d-fs-100 d-ff-mono">.d-bas-dotted</div>
  <div class="d-fl-center d-p16 d-ba d-bc-purple-400 d-bts-dotted d-baw4 d-bgc-purple-100 d-fs-100 d-ff-mono">.d-bts-dotted</div>
  <div class="d-fl-center d-p16 d-ba d-bc-purple-400 d-brs-dotted d-baw4 d-bgc-purple-100 d-fs-100 d-ff-mono">.d-brs-dotted</div>
  <div class="d-fl-center d-p16 d-ba d-bc-purple-400 d-bbs-dotted d-baw4 d-bgc-purple-100 d-fs-100 d-ff-mono">.d-bbs-dotted</div>
  <div class="d-fl-center d-p16 d-ba d-bc-purple-400 d-bls-dotted d-baw4 d-bgc-purple-100 d-fs-100 d-ff-mono">.d-bls-dotted</div>
</code-well-header>

```html

<div class="d-ba d-bc-purple-400 d-bas-dotted d-baw4">...</div>
<div class="d-ba d-bc-purple-400 d-bts-dotted d-baw4">...</div>
<div class="d-ba d-bc-purple-400 d-brs-dotted d-baw4">...</div>
<div class="d-ba d-bc-purple-400 d-bbs-dotted d-baw4">...</div>
<div class="d-ba d-bc-purple-400 d-bls-dotted d-baw4">...</div>
```

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr>
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bas-unset</th>
          <td class="d-ff-mono d-fs-100">border-style: unset !important;</td>
        </tr>
      </tbody>
      <tbody v-for="s in ['dashed', 'dotted']">
        <tr v-for="i in ['all', 'top', 'right', 'bottom', 'left']">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-b{{ i[0] }}s-{{ s }}</th>
          <td class="d-ff-mono d-fs-100">
            <span v-if="i === 'all'">border-style: {{ s }} !important;</span>
            <span v-else>border-{{i}}-style: {{ s }} !important;</span>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
