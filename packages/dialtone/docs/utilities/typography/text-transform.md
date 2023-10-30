---
title: Text transform
description: Utilities for controlling an element's text transform.
---

## Uppercase

Use `d-tt-uppercase` to uppercase an element's text.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-green-400 d-tt-uppercase">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-tt-uppercase">...</p>
```

## Lowercase

Use `d-tt-lowercase` to lowercase an element's text.

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-purple-400 d-tt-lowercase">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-tt-lowercase">...</p>
```

## Capitalize

Use `d-tt-capitalize` to capitalize an element's text.

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-magenta-300 d-tt-capitalize">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-tt-capitalize">...</p>
```

<script setup>
  import { transform } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in transform">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-tt-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">text-transform: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
