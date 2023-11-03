---
title: Box shadows
description: Utilities for controlling an element's box shadows.
---

## Outer shadow

Use `d-bs-{n}` to add an outer box shadow to an element.

<code-well-header class="d-fl-col4 d-flg16 d-bgc-neutral-white d-fw-wrap d-p24 d-w100p d-hmn102" custom>
  <div v-for="className in boxShadowSizes" class="d-fl-center d-p16 d-bar8 d-bgc-secondary d-fs-200 d-fw-bold" :class="`d-bs-${className}`">.d-bs-{{ className }}</div>
</code-well-header>

```html

<div class="d-bs-sm">...</div>
<div class="d-bs-md">...</div>
<div class="d-bs-lg">...</div>
<div class="d-bs-xl">...</div>
<div class="d-bs-card">...</div>
```

## No shadow

Use `d-bs-none` to remove a box shadow to an element.

<code-well-header class="d-fl-center d-p24 d-bgc-neutral-white d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-bar8 d-bgc-secondary d-fs-200 d-fw-bold d-bs-none">.d-bs-none</div>
</code-well-header>

```html

<div class="d-bs-none">...</div>
```

## Hover

Use `h:d-bs-{n}` to change an element's `:hover` state box shadow.

<code-well-header class="d-fl-center d-p24 d-bgc-neutral-white d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-bar8 d-bgc-secondary d-fs-200 d-fw-bold d-bs-none h:d-bs-lg">Hover over me</div>
</code-well-header>

```html

<div class="d-bs-none h:d-bs-lg">Hover over me</div>
```

## Focus

Use `f:d-bs-{n}` to change an element's `:focus` and `:focus-within` state box shadow.

<code-well-header class="d-fl-center d-p24 d-bgc-neutral-white d-w100p d-hmn102" custom>
  <div tabindex="0" class="d-fl-center d-p16 d-bar8 d-bgc-secondary d-fs-200 d-fw-bold d-bs-none f:d-bs-lg">Click on me</div>
</code-well-header>

```html

<div tabindex="0" class="d-bs-none f:d-bs-lg">Click on me</div>
```

## Focus visible

Use `fv:d-bs-{n}` to change an element's `:focus-visible` state box shadow [only when focused by keyboard].

<code-well-header class="d-fl-center d-p24 d-bgc-neutral-white d-w100p d-hmn102" custom>
  <div tabindex="0" class="d-fl-center d-p16 d-bar8 d-bgc-secondary d-fs-200 d-fw-bold d-bs-none fv:d-bs-lg">Focus on me</div>
</code-well-header>

```html

<div tabindex="0" class="d-bs-none fv:d-bs-lg">Click on me</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="size in boxShadowSizes">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bs-{{ size }}</th>
        <td v-if="size !== 'card'" class="d-ff-mono d-fs-100">
            box-shadow: var(--dt-shadow-{{ size }}-0-x) var(--dt-shadow-{{ size }}-0-y) var(--dt-shadow-{{ size }}-0-blur) var(--dt-shadow-{{ size }}-0-spread) var(--dt-shadow-{{ size }}-0-color) !important;
        </td>
        <td v-else class="d-ff-mono d-fs-100">
            box-shadow: var(--dt-shadow-card-0-x) var(--dt-shadow-card-0-y) var(--dt-shadow-card-0-blur) var(--dt-shadow-card-0-spread) var(--dt-shadow-card-0-color),<br/>
            var(--dt-shadow-card-1-x) var(--dt-shadow-card-1-y) var(--dt-shadow-card-1-blur) var(--dt-shadow-card-1-spread) var(--dt-shadow-card-1-color),<br/>
            var(--dt-shadow-card-2-x) var(--dt-shadow-card-2-y) var(--dt-shadow-card-2-blur) var(--dt-shadow-card-2-spread) var(--dt-shadow-card-2-color)<br/>
            !important
        </td>
      </tr>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bs-none</th>
        <td class="d-ff-mono d-fs-100">box-shadow: none !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bs-unset</th>
        <td class="d-ff-mono d-fs-100">box-shadow: unset !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
const boxShadowSizes = ['sm', 'md', 'lg', 'xl', 'card'];
</script>
