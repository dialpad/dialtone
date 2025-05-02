---
title: Divide Color
description: Utilities for controlling the border color between an element's child items.
---

## Vertical Dividers

Use `d-divide-y{n}` to create a divider between an element's child items.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-d-flex d-fd-column d-divide-y d-divide-green-300">
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-divide-y d-divide-purple-400">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Horizontal Dividers

Use `d-divide-x{n}` to create a divider between an element's child items.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-fl-col3 d-divide-x d-divide-purple-400">
    <div class="d-fl-center d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-divide-x d-divide-purple-400">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Changing Opacities

Use `d-dco{n}` to change a divider opacity value.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-d-flex d-fd-column d-divide-y d-divide-magenta-200 d-dco75">
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-divide-y1 d-divide-magenta-200 d-dco75">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Classes

<new-utility-class-table :classes="divideColors">
  <template #example="{ className }">
    <div
      class="d-d-flex d-fl-shrink0 d-w42 d-h42 d-w24 d-ta-center"
      :class="[
        className.startsWith('d-divide-x') ? 'd-divide-x d-fl-col2' : 'd-divide-y d-fd-column',
        className
      ]"
    >
      <div class="d-fl-center">1</div>
      <div class="d-fl-center">2</div>
    </div>
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const divideColors = extractUtilityClasses(utilityClassDocs, 'd-divide-');
</script>
