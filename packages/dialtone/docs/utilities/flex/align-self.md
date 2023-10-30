---
title: Align self
description: Utilities for setting how an element's is aligned along a parent's cross axis.
---

## Stretch

Use `d-as-stretch` to stretch an item along a parent's cross axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-ai-flex-start d-p8 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-as-stretch d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ai-flex-start">
  <div>1</div>
  <div class="d-as-stretch">2</div>
  <div>3</div>
</div>
```

## Flex start

Use `d-as-flex-start` to align an item to the start of the parent's cross axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-p8 d-w100p d-hmn216 d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-as-flex-start d-m8 d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
    <div>1</div>
    <div class="d-as-flex-start">2</div>
    <div>3</div>
</div>
```

## Center

Use `d-as-center` to align an item along the center of the parent's cross axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-p8 d-w100p d-hmn216 d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-as-center d-m8 d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>1</div>
  <div class="d-as-center">2</div>
  <div>3</div>
</div>
```

## Flex end

Use `d-as-flex-end` to align an item from the end of the parent's cross axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-p8 d-w100p d-hmn216 d-bar8 d-bgc-red-100">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-as-flex-end d-m8 d-p16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>1</div>
  <div class="d-as-flex-end">2</div>
  <div>3</div>
</div>
```

<script setup>
  import { alignSelf } from '@data/flex.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for=" { class: className, output } in alignSelf">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ className }}</th>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
</template>
</utility-class-table>
