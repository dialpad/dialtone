---
title: Text Transform
description: Utilities for controlling an element's text transform.
---

## Uppercase

Use `d-tt-uppercase` to uppercase an element's text.

<code-well-header>
  <p class="d-tt-uppercase">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-tt-uppercase">...</p>
```

## Lowercase

Use `d-tt-lowercase` to lowercase an element's text.

<code-well-header>
  <p class="d-tt-lowercase">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-tt-lowercase">...</p>
```

## Capitalize

Use `d-tt-capitalize` to capitalize an element's text.

<code-well-header>
  <p class="d-tt-capitalize">The quick brown fox jumps over the lazy dog.</p>
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
        <th scope="row" class="d-code--sm d-docsite-code">.d-tt-{{ i }}</th>
        <td class="d-code--sm">text-transform: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
