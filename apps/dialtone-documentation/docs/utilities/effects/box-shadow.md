---
title: Box Shadows
description: Utilities for controlling an element's box shadows.
keywords: ["drop shadow", "elevation"]
---

## Outer Shadow

```vue demo
<!-- @wrapper -->
<dt-stack class="d-py-500" gap="600" justify="space-evenly" :direction="{ 'default': 'column', 'lg': 'row' }">
  <DtBox padding="200" border-radius="400" surface="raised" shadow="raised">d-bs-raised</DtBox>
  <DtBox padding="200" border-radius="400" surface="overlay" shadow="overlay">d-bs-overlay</DtBox>
  <DtBox padding="200" border-radius="400" surface="modal" shadow="modal">d-bs-modal</DtBox>
</dt-stack>
```

## No Shadow

Use `d-bs-none` to remove a box shadow to an element.

```vue demo
<div class="d-p-200 d-bar-400 d-bgc-raised d-bs-none">d-bs-none</div>
```

## Hover

Use `h:d-bs-{n}` to change an element's `:hover` state box shadow.

```vue demo
<dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-raised h:d-bs-raised">Hover over me</dt-button>
```

## Focus

Use `f:d-bs-{n}` to change an element's `:focus` and `:focus-within` state box shadow.

```vue demo
<dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-raised f:d-bs-raised">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-bs-{n}` to change an element's `:focus-visible` state box shadow [only when focused by keyboard].

```vue demo
<dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-raised fv:d-bs-raised">Keyboard focus me</dt-button>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="name in boxShadowNames">
        <th scope="row" class="d-code--sm d-docsite-code">.d-bs-{{ name }}</th>
        <td class="d-code--sm">box-shadow: var(--dt-shadow-{{ name }}) !important;</td>
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
const boxShadowNames = ['raised', 'overlay', 'modal'];
</script>
