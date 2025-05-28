---
title: Font Style
description: Utilities to change an element's font styles.
---

## Normal

Use `d-font-style-normal` to change an element's font-style.

<code-well-header>
  <p class="d-font-style-normal">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-font-style-normal">...</p>
```

## Italics

Use `d-font-style-italic` to change an element's font-style.

<code-well-header>
  <p class="d-font-style-italic">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-font-style-italic">...</p>
```

## No Italics

Use `d-font-style-none` to remove an element's font-style.

<code-well-header>
  <p class="d-font-style-none">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-font-style-none">...</p>
```

<script setup>
  import { style } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in style">
        <th scope="row" class="d-code--sm d-docsite-code">.d-font-style-{{ i }}</th>
        <td class="d-code--sm">font-style: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
