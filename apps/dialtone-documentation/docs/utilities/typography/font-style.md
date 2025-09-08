---
title: Font Style
description: Utilities to change an element's font styles.
---

## Normal

Use `d-fs-normal` to change an element's font-style.

<code-well-header>
  <p class="d-fs-normal">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fs-normal">...</p>
```

## Italics

Use `d-fs-italic` to change an element's font-style.

<code-well-header>
  <p class="d-fs-italic">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fs-italic">...</p>
```

## No Italics

Use `d-fs-none` to remove an element's font-style.

<code-well-header>
  <p class="d-fs-none">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fs-none">...</p>
```

<script setup>
  import { style } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in style">
        <th scope="row" class="d-code--sm d-docsite-code">.d-fs-{{ i }}</th>
        <td class="d-code--sm">font-style: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
