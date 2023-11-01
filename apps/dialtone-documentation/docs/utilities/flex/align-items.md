---
title: Align items
description: Utilities for setting how an element's is aligned along an element's cross axis.
---

## Stretch

Use `d-ai-stretch` to stretch items across the element's cross axis. This is the default value.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-flex d-ai-stretch d-p8 d-w100p d-hmn216 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py8 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py4 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ai-stretch">
  <div class="d-py8">1</div>
  <div class="d-py16">2</div>
  <div class="d-py4">3</div>
</div>
```

## Flex start

Use `d-ai-flex-start` to align items to the start of the element's cross axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-flex d-ai-flex-start d-p8 d-w100p d-hmn216 d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py4 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py24 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ai-flex-start">
  <div class="d-h32">1</div>
  <div class="d-h64">2</div>
  <div class="d-h16">3</div>
</div>
```

## Center

Use `d-ai-center` to distribute items along the center of the element's cross axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-flex d-ai-center d-p8 d-w100p d-hmn216 d-bar8 d-bgc-green-100">
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py4 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py24 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ai-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Flex end

Use `d-ai-flex-end` to distribute items from the end of the element's cross axis.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-ai-flex-end d-p8 d-w100p d-hmn216 d-bar8 d-bgc-red-100">
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py4 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py24 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-px16 d-py16 d-bgc-red-100 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ai-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
```

<script setup>
  import { alignItems } from '@data/flex.json';
</script>

## Classes

<utility-class-table>
 <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in alignItems">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ className }}</th>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
