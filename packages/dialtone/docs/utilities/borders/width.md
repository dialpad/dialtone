---
title: Border widths
description: Utilities for controlling an element's border width.
---

## All sides

Use `d-baw{n}` to change the border width on your element.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw0 d-bgc-magenta-100 d-fs-200 d-ff-mono">.d-baw0</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw1 d-bgc-magenta-100 d-fs-200 d-ff-mono">.d-baw1</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw2 d-bgc-magenta-100 d-fs-200 d-ff-mono">.d-baw2</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw4 d-bgc-magenta-100 d-fs-200 d-ff-mono">.d-baw4</div>
  <div class="d-fl-center d-p16 d-ba d-bc-magenta-200 d-baw6 d-bgc-magenta-100 d-fs-200 d-ff-mono">.d-baw6</div>
</code-well-header>

```html

<div class="d-ba d-baw0">...</div>
<div class="d-ba d-baw1">...</div>
<div class="d-ba d-baw2">...</div>
<div class="d-ba d-baw4">...</div>
<div class="d-ba d-baw6">...</div>
```

## Individual sides

Use `d-b{a|t|r|b|l}w{n}` to change the border width of your direction on your element.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-gold-100 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-bt d-bc-gold-200 d-btw1 d-bgc-gold-100 d-fs-200 d-ff-mono">.d-btw1</div>
  <div class="d-fl-center d-p16 d-br d-bc-gold-200 d-brw2 d-bgc-gold-100 d-fs-200 d-ff-mono">.d-brw2</div>
  <div class="d-fl-center d-p16 d-bb d-bc-gold-200 d-bbw4 d-bgc-gold-100 d-fs-200 d-ff-mono">.d-bbw4</div>
  <div class="d-fl-center d-p16 d-bl d-bc-gold-200 d-blw6 d-bgc-gold-100 d-fs-200 d-ff-mono">.d-blw6</div>
</code-well-header>

```html

<div class="d-bt d-btw1">...</div>
<div class="d-br d-brw2">...</div>
<div class="d-bb d-bbw4">...</div>
<div class="d-bl d-blw6">...</div>
```

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody v-for="i in ['all', 'top', 'right', 'bottom', 'left']">
        <tr v-for="(val, key) in {0: '0', 1: '100', 2: '200', 4: '300', 6: '350'}">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-b{{ i[0] }}w{{ key }}</th>
          <td class="d-ff-mono d-fs-100">
            <span v-if="i === 'all'">border-width: var(--dt-size-{{ val }}) !important;</span>
            <span v-else>border-{{i}}-width: var(--dt-size-{{ val }}) !important;</span>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
