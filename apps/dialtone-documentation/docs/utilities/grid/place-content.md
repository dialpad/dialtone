---
title: Place content
description: Utilities for controlling how grid items are aligned along both the block and inline axis directions.
---

## Stretch

Use `d-plc-stretch{-n}` to stretch grid items along the block and inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-plc-stretch d-gg16 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-plc-stretch">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-plc-start{-n}` to align grid items along the start of the block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-plc-start-center d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-green-100" style="--col-width: 6.4rem;">
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3 d-plc-start-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-plc-end{-n}` to align grid items along the end of the block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-plc-end-center d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-magenta-100" style="--col-width: 6.4rem;">
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3 d-plc-end-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-plc-center{-n}` to align grid items along the center of the block and/or inline axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-plc-center d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-red-100" style="--col-width: 6.4rem;">
    <div class="d-fl-center d-p16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3 d-plc-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Space evenly

Use `d-plc-space-evenly{-n}` to distribute grid items evenly along the block axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-plc-space-evenly d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-gold-100" style="--col-width: 6.4rem;">
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3 d-plc-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Space around

Use `d-plc-space-around{-n}` to distribute grid items so there is an equal amount of space around each row on the block axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-plc-space-around d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-magenta-100" style="--col-width: 6.4rem;">
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3 d-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Space between

Use `d-plc-space-between{-n}` to distribute grid items along the block axis so that there is an equal space between each row.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g-cols2 d-plc-space-between d-gg16 d-p16 d-w100p d-h216d-bar8 d-bgc-purple-100" style="--col-width: 6.4rem;">
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3 d-plc-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

<script setup>
  const alignments = ['center', 'end', 'start', 'stretch', 'space-around', 'space-evenly', 'space-between'];
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <div v-for="c in alignments" style="display: contents">
          <tr v-for="i in alignments">
            <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
              <span v-if="i !== c">.d-plc-{{ c }}-{{ i }}</span>
              <span v-else>.d-plc-{{ c }}</span>
            </th>
            <td class="d-ff-mono d-fs-100">
              <span v-if="i !== c">place-content: {{ c }} {{ i }} !important</span>
              <span v-else>place-content: {{ c }} !important</span>
            </td>
          </tr>
        </div>
      </tbody>
    </template>
  </utility-class-table>
</div>
