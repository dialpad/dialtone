---
title: Place items
description: Utilities for controlling how grid items are aligned along their block and inline axis directions.
---

## Stretch

Use `d-pli-stretch{-n}` to stretch grid items along their block and inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-pli-stretch d-gg16 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-pli-stretch">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-pli-start{-n}` to align grid items along the start of their block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-pli-start d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-pli-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-pli-end{-n}` to align grid items along the end of their block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-pli-end d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-pli-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-pli-center{-n}` to align grid items along the center of their block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-pli-center d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-red-100">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-pli-center">
  <div>1</div>
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
              <span v-if="i !== c">.d-pli-{{ c }}-{{ i }}</span>
              <span v-else>.d-pli-{{ c }}</span>
            </th>
            <td class="d-ff-mono d-fs-100">
              <span v-if="i !== c">place-items: {{ c }} {{ i }} !important;</span>
              <span v-else>place-items: {{ c }} !important;</span>
            </td>
          </tr>
        </div>
      </tbody>
    </template>
  </utility-class-table>
</div>
