---
title: Gap
description: Utilities to control the spacing between columns, rows, or both.
---

## Adding universal row and column gaps

Use `d-g{#}` to universally change the row and column gap space.

<code-well-header class="d-p24 d-bgc-purple-100 d-bgo50" custom>
  <div class="d-fl-col2 d-fw-wrap d-g16 d-p16 d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-fl-col2 d-fw-wrap d-g16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Row gap

Use `d-rg{#}` to change the row gap space.

<code-well-header class="d-p24 d-bgc-green-100 d-bgo50" custom>
  <div class="d-d-flex d-fd-column d-rg8 d-p16 d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-fd-column d-rg8">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Column gap

Use `d-cg{#}` to change the column gap space.

<code-well-header class="d-p24 d-bgc-green-100 d-bgo50" custom>
  <div class="d-fl-col4 d-cg16 d-p16 d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-fl-col4 d-cg16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

<script setup>
  import { directions, values } from '@data/gap.json';
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody v-for="dir in directions">
        <tr v-for="{ output: rem, value: px } in values">
          <th scope="row" class="d-code--sm d-fc-purple-400">
            <span v-if="dir === 'both'">.d-g{{ px }}</span>
            <span v-else-if="dir === 'column'">.d-cg{{ px }}</span>
            <span v-else-if="dir === 'row'">.d-rg{{ px }}</span>
          </th>
          <td class="d-code--sm">
            <span v-if="dir !== 'both'">{{ dir }}-gap: {{ rem }}</span>
            <span v-else>gap: {{ rem }}</span>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
