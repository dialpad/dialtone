---
title: Justify self
description: Utilities for controlling how a grid item is aligned along its inline axis.
---

## Auto

Use `d-js-auto` to justify an item automatically along its inline axis. This is the default value.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols3 d-w100p d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-js-auto d-m8 d-p16 d-wmn64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-auto">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Start

Use `d-js-start` to justify an item to the start of its inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols3 d-w100p d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-js-start d-m8 d-p16 d-wmn64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-start">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## End

Use `d-js-end` to justify an item to the end of its inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols3 d-w100p d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-js-end d-m8 d-p16 d-wmn64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-end">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Center

Use `d-js-center` to justify an item to the center of its inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols3 d-w100p d-bar8 d-bgc-red-100">
    <div class="d-fl-center d-js-center d-m8 d-p16 d-wmn64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-center">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['center', 'end', 'start', 'left', 'right', 'baseline', 'first-baseline', 'last-baseline', 'stretch', 'safe', 'unsafe', 'normal', 'legacy', 'auto', 'unset']">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-js-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">justify-self: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
