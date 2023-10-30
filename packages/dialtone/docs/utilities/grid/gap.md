---
title: Gap
description: Utilities to control the spacing between columns, rows, or both in grids.
---

## Adding universal row and column gaps

Use `d-gg{#}` to universally change the row and column gap space in grid layouts.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-grid d-gg16 d-g-cols2 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-gg16 d-g-cols2">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Independently changing row and column gaps

Use `d-gcg{#}` or `d-grg{#}` to independently change the row and column gap space in grid layouts.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-grid d-gcg24 d-grg8 d-g-cols3 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">5</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">6</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">7</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">8</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">9</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-gcg24 d-grg8 d-g-cols3">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
</div>
```

<script setup>
  import { gap } from '@data/grid.json';
  import { values } from '@data/spacing.json';
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody v-for="{ direction: dir } in gap">
        <tr v-for="{ output: rem, value: px } in values">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="dir === 'both'">.d-gg{{ px }}</span>
            <span v-else-if="dir === 'column'">.d-gcg{{ px }}</span>
            <span v-else-if="dir === 'row'">.d-grg{{ px }}</span>
          </th>
          <td class="d-ff-mono d-fs-100">
            <span v-if="dir !== 'both'">grid-{{ dir }}-gap: {{ rem }}</span>
            <span v-else>grid-gap: {{ rem }}</span>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
