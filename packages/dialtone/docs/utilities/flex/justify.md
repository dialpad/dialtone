---
title: Justify content
description: Utilities for setting how an element's space around and between content is distributed along it's main axis.
---

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in justifyContent">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ className }}</th>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

## Flex start

Use `d-jc-flex-start` to justify items against the start of the element's main axis. This is the default value.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-jc-flex-start d-w100p d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-jc-flex-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Center

Use `d-jc-center` to justify items along the center of the element's main axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-jc-center d-w100p d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-jc-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Flex end

Use `d-jc-flex-end` to justify items against the end of the element's main axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-jc-flex-end d-w100p d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-jc-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Space around

Use `d-jc-space-around` to justify items along the element's main axis so that there is an equal amount of space on each side of the item. This effectively takes all available space, divides it for each child element, placing half of available space on either side of the child. This is why the space appears doubled for interior objects versus end objects.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-jc-space-around d-w100p d-bar8 d-bgc-red-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-jc-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Space between

Use `d-jc-space-between` to justify items along the element's main axis so that there is an equal amount of space between each item without inserting any space between the first or last object.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-jc-space-between d-w100p d-bar8 d-bgc-gold-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-jc-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Space evenly

Use `d-jc-space-evenly` to justify items along the element's main axis so that there is an equal amount of space on each side of the item, but unlike `d-jc-space-around` visually evenly spaces objects.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-blue-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-jc-space-evenly d-w100p d-bar8 d-bgc-blue-200">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-jc-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

<script setup>
  import { justifyContent } from '@data/flex.json';
</script>
