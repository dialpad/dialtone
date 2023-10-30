---
title: Justify items
description: Utilities for controlling how grid items align along their inline axis.
---

## Auto

Use `d-ji-auto` to justify grid items automatically along their inline axis. This is the default value.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-ji-auto d-w100p d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-auto">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-ji-start` to justify items against the start of their inline axis. Note that this does not work on flexed objects, only grid objects.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-ji-start d-w100p d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-ji-end` to justify items against the end of their inline axis. Note that this does not work on flexed objects, only grid objects.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-ji-end d-w100p d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-ji-center` to justify items to the center of their inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-ji-center d-w100p d-bar8 d-bgc-red-100">
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-red-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-red-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-red-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-wmn64 d-bgc-red-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['center', 'end', 'start', 'left', 'right', 'baseline', 'first-baseline', 'last-baseline', 'stretch', 'safe', 'unsafe', 'normal', 'legacy', 'auto', 'unset']">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-ji-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">justify-items: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
