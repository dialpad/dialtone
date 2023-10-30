---
title: Place self
description: Utilities for controlling a grid item's alignment along their block and inline axis directions.
---

## Stretch

Use `d-pls-stretch{-n}` to stretch grid items along their block and inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-gg16 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-pls-stretch d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-o50">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-stretch">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-pls-start{-n}` to align a grid item along the start of their block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-pls-start d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold d-o50">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-start">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-pls-end{-n}` to align a grid item along the end of their block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-pls-end d-p16 d-w64 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-o50">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-stretch">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-pls-center{-n}` to align a grid item along the center of their block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-gold-100">
    <div class="d-fl-center d-pls-center d-p16 d-w64 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold d-o50">2</div>
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold d-o50">3</div>
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold d-o50">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-center">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

<script setup>
  const alignments = ['center', 'end', 'start', 'stretch'];
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <div v-for="c in alignments" style="display: contents">
          <tr v-for="i in alignments">
            <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
              <span v-if="i !== c">.d-pls-{{ c }}-{{ i }}</span>
              <span v-else>.d-pls-{{ c }}</span>
            </th>
            <td class="d-ff-mono d-fs-100">
              <span v-if="i !== c">place-self: {{ c }} {{ i }} !important;</span>
              <span v-else>place-self: {{ c }} !important;</span>
            </td>
          </tr>
        </div>
      </tbody>
    </template>
  </utility-class-table>
</div>
