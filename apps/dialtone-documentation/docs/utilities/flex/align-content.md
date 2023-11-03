---
title: Align content
description: Utilities for setting how rows are distributed along it's cross axis. This property only works when a parent container has more than one line.
---

## Flex start

Use `d-ac-flex-start` to pack rows against the start of the element's cross axis. This is the default value.

<code-well-header bgclass="d-bgc-purple-100">
  <div class="d-fl-col3 d-flg16 d-fw-wrap d-ac-flex-start d-p8 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">5</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ac-flex-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
```

## Center

Use `d-ac-center` to pack rows along the center of the element's cross axis.

<code-well-header bgclass="d-bgc-magenta-100">
  <div class="d-fl-col3 d-flg16 d-fw-wrap d-ac-center d-p8 d-w100p d-hmn216 d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">5</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ac-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
```

## Flex end

Use `d-ac-flex-end` to rack rows against the end of the element's main axis.

<code-well-header bgclass="d-bgc-green-100" >
  <div class="d-fl-col3 d-fw-wrap d-flg16 d-ac-flex-end d-p8 d-w100p d-hmn216 d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">5</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ac-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
```

## Space around

Use `d-ac-space-around` to pack rows along the element's cross axis so that there is an equal amount of space on each side of the item. This effectively takes all available space, divides it for each row, placing half of alotted space on either side of the row. This is why the space appears doubled for interior rows versus end rows.

<code-well-header bgclass="d-bgc-red-100" >
  <div class="d-fl-col3 d-fw-wrap d-flg16 d-ac-space-around d-p8 d-w100p d-hmn3 d-bar8 d-bgc-red-100">
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">5</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ac-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
```

## Space between

Use `d-ac-space-between` to distribute rows along the element's cross axis so that there is an equal amount of space between each row without inserting any space between the first or last object.

<code-well-header bgclass="d-bgc-gold-100" >
  <div class="d-fl-col3 d-fw-wrap d-flg16 d-ac-space-between d-p8 d-w100p d-hmn3 d-bar8 d-bgc-gold-100">
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">5</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ac-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
```

## Space evenly

Use `d-ac-space-evenly` to distribute rows along the element's cross axis so that there is an equal amount of space on each side of the rows, but unlike `d-ac-space-around` the space visually looks evenly distributed between objects.

<code-well-header bgclass="d-bgc-blue-100" >
  <div class="d-fl-col3 d-fw-wrap d-flg16 d-ac-space-evenly d-p8 d-w100p d-hmn3 d-bar8 d-bgc-blue-100">
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">3</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">4</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">5</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">6</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">7</div>
    <div class="d-fl-center d-m8 d-p16 d-h64 d-bgc-blue-300 d-bar4 d-fs-300 d-fw-bold">8</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ac-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
</div>
```

<script setup>
import { alignContent } from '@data/flex.json';
</script>

## Classes

<utility-class-table>
 <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in alignContent">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ className }}</th>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
