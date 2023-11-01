---
title: Border radius
description: Utilities for controlling an element's border radius.
---

## All corners

Use `d-bar{n}` to change the border radius on all corners of your element.

<code-well-header class="d-fl-col4 d-flg8 d-fw-wrap d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div
    v-for="r in [0, 2, 4, 8, 12, 16, 24, 32]"
    class="d-fl-center d-p16 d-hmn48 d-bgc-purple-300 d-fs-200 d-fw-bold"
    :class="`d-bar${r}`"
  >
    .d-bar{{ r }}
  </div>
</code-well-header>

```html
<div class="d-bar0">...</div>
<div class="d-bar2">...</div>
<div class="d-bar4">...</div>
<div class="d-bar8">...</div>
<div class="d-bar12">...</div>
<div class="d-bar16">...</div>
<div class="d-bar24">...</div>
<div class="d-bar32">...</div>
```

## Rounded sides

Use `d-b{t|r|b|l}r{n}` to change the border radius on a side of your element.

<code-well-header class="d-fl-center d-flg8 d-fw-wrap d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102 lg:d-stack8 d-flow8" custom>
  <div class="d-fl-center d-p16 d-h48 d-btr4 d-bgc-magenta-100 d-fs-300 d-fw-bold">.d-btr4</div>
  <div class="d-fl-center d-p16 d-h48 d-brr8 d-bgc-magenta-100 d-fs-300 d-fw-bold">.d-brr8</div>
  <div class="d-fl-center d-p16 d-h48 d-bbr12 d-bgc-magenta-100 d-fs-300 d-fw-bold">.d-bbr12</div>
  <div class="d-fl-center d-p16 d-h48 d-blr16 d-bgc-magenta-100 d-fs-300 d-fw-bold">.d-blr16</div>
</code-well-header>

```html
<div class="d-btr4">...</div>
<div class="d-brr8">...</div>
<div class="d-bbr12">...</div>
<div class="d-blr16">...</div>
```

## Pills

Use `d-b{a|t|r|b|l}r-pill` to change the border radius of your element to a pill shape.

<code-well-header class="d-fl-center d-flg8 d-fw-wrap d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
            <div class="d-fl-center d-p16 d-h64 d-wmn264 d-bar-pill d-bgc-green-200 d-fs-300 d-fw-bold">.d-bar-pill</div>
</code-well-header>

```html
<div class="d-bar-pill">...</div>
```

## Circles

Use `d-b{a|t|r|b|l}r-circle` to change the border radius of your element to a circle shape.

<code-well-header class="d-fl-center d-flg8 d-fw-wrap d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-h264 d-w264 d-bar-circle d-bgc-red-200 d-fs-300 d-fw-bold d-fc-primary-inverted">.d-bar-circle</div>
</code-well-header>

```html
<div class="d-bar-circle">...</div>
```

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr>
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bar-unset</th>
          <td class="d-ff-mono d-fs-100">border-radius: unset !important;</td>
        </tr>
      </tbody>
      <tbody v-for="i in ['a', 't', 'r', 'b', 'l']">
        <tr v-for="r in [0, 2, 4, 8, 12, 16, 24, 32, '-circle', '-pill']">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-b{{ i }}r{{ r }}</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl-grow1 d-ff-mono d-fs-100">
                <span v-if="i === 'a'">border-radius: var(--br{{ r }}) !important;</span>
                <span v-else-if="i === 't'">
                  border-top-left-radius: var(--br{{ r }}) !important;<br/>
                  border-top-right-radius: var(--br{{ r }}) !important;
                </span>
                <span v-else-if="i === 'r'">
                  border-top-right-radius: var(--br{{ r }}) !important;<br/>
                  border-bottom-right-radius: var(--br{{ r }}) !important;
                </span>
                <span v-else-if="i === 'b'">
                  border-bottom-left-radius: var(--br{{ r }}) !important;<br/>
                  border-bottom-right-radius: var(--br{{ r }}) !important;
                </span>
                <span v-else-if="i === 'l'">
                  border-bottom-left-radius: var(--br{{ r }}) !important;
                  border-top-left-radius: var(--br{{ r }}) !important;<br/>
                </span>
              </div>
              <div
                class="d-fl-shrink0 d-m4 d-ml16 d-h32 d-bgc-black-300"
                :class="[r === '-circle' ? 'd-w32' : 'd-w64', `d-b${i}r${r}`]"
              >
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
