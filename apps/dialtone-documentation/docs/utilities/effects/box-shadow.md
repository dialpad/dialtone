---
title: Box Shadows
description: Utilities for controlling an element's box shadows.
keywords: ["drop shadow", "elevation"]
---

## Outer Shadow

Use `d-bs-{n}` to add an outer box shadow to an element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" :direction="{ 'default': 'column', 'lg': 'row' }">
  <div class="d-p-200 d-bar8 d-bgc-primary d-bs-sm">d-bs-sm</div>
  <div class="d-p-200 d-bar8 d-bgc-primary d-bs-md">d-bs-md</div>
  <div class="d-p-200 d-bar8 d-bgc-primary d-bs-lg">d-bs-lg</div>
  <div class="d-p-200 d-bar8 d-bgc-primary d-bs-xl">d-bs-xl</div>
  <div class="d-p-200 d-bar8 d-bgc-primary d-bs-card">d-bs-card</div>
</dt-stack>
```

## No Shadow

Use `d-bs-none` to remove a box shadow to an element.

```vue demo
<div class="d-p-200 d-bar8 d-bgc-primary d-bs-none">.d-bs-none</div>
```

## Hover

Use `h:d-bs-{n}` to change an element's `:hover` state box shadow.

```vue demo
<!-- @custom -->
<!-- @class d-fl-center d-p-300 d-bgc-secondary d-w100p -->
<dt-button kind="unstyled" class="d-p-200 d-bar8 d-bgc-primary h:d-bs-md">Hover over me</dt-button>
```

## Focus

Use `f:d-bs-{n}` to change an element's `:focus` and `:focus-within` state box shadow.

```vue demo
<!-- @custom -->
<!-- @class d-fl-center d-p-300 d-bgc-secondary d-w100p -->
<dt-button kind="unstyled" class="d-p-200 d-bar8 d-bgc-primary f:d-bs-md">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-bs-{n}` to change an element's `:focus-visible` state box shadow [only when focused by keyboard].

```vue demo
<!-- @custom -->
<!-- @class d-fl-center d-p-300 d-bgc-secondary d-w100p -->
<dt-button kind="unstyled" class="d-p-200 d-bar8 d-bgc-primary fv:d-bs-md">Keyboard focus me</dt-button>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="size in boxShadowSizes">
        <th scope="row" class="d-code--sm d-docsite-code">.d-bs-{{ size }}</th>
        <td v-if="size !== 'card'" class="d-code--sm">
            box-shadow: var(--dt-shadow-{{ size }}-0-x) var(--dt-shadow-{{ size }}-0-y) var(--dt-shadow-{{ size }}-0-blur) var(--dt-shadow-{{ size }}-0-spread) var(--dt-shadow-{{ size }}-0-color) !important;
        </td>
        <td v-else class="d-code--sm">
            box-shadow: var(--dt-shadow-card-0-x) var(--dt-shadow-card-0-y) var(--dt-shadow-card-0-blur) var(--dt-shadow-card-0-spread) var(--dt-shadow-card-0-color),<br/>
            var(--dt-shadow-card-1-x) var(--dt-shadow-card-1-y) var(--dt-shadow-card-1-blur) var(--dt-shadow-card-1-spread) var(--dt-shadow-card-1-color),<br/>
            var(--dt-shadow-card-2-x) var(--dt-shadow-card-2-y) var(--dt-shadow-card-2-blur) var(--dt-shadow-card-2-spread) var(--dt-shadow-card-2-color)<br/>
            !important
        </td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-bs-none</th>
        <td class="d-code--sm">box-shadow: none !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-bs-unset</th>
        <td class="d-code--sm">box-shadow: unset !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
const boxShadowSizes = ['sm', 'md', 'lg', 'xl', 'card'];
</script>
