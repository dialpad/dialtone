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
  <div class="d-p-200 d-bar-400 d-bgc-primary d-bs-raised">d-bs-raised</div>
  <div class="d-p-200 d-bar-400 d-bgc-primary d-bs-overlay">d-bs-overlay</div>
  <div class="d-p-200 d-bar-400 d-bgc-primary d-bs-modal">d-bs-modal</div>
</dt-stack>
```

## No Shadow

Use `d-bs-none` to remove a box shadow to an element.

```vue demo
<div class="d-p-200 d-bar-400 d-bgc-primary d-bs-none">.d-bs-none</div>
```

## Hover

Use `h:d-bs-{n}` to change an element's `:hover` state box shadow.

```vue demo
<!-- @custom -->
<!-- @class d-fl-center d-p-300 d-bgc-secondary d-w100p -->
<dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary h:d-bs-overlay">Hover over me</dt-button>
```

## Focus

Use `f:d-bs-{n}` to change an element's `:focus` and `:focus-within` state box shadow.

```vue demo
<!-- @custom -->
<!-- @class d-fl-center d-p-300 d-bgc-secondary d-w100p -->
<dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary f:d-bs-overlay">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-bs-{n}` to change an element's `:focus-visible` state box shadow [only when focused by keyboard].

```vue demo
<!-- @custom -->
<!-- @class d-fl-center d-p-300 d-bgc-secondary d-w100p -->
<dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary fv:d-bs-overlay">Keyboard focus me</dt-button>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="size in boxShadowSizes">
        <th scope="row" class="d-code--sm d-docsite-code">.d-bs-{{ size }}</th>
        <td class="d-code--sm">box-shadow: var(--dt-shadow-{{ size }}) !important;</td>
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
const boxShadowSizes = ['raised', 'overlay', 'modal'];
</script>
