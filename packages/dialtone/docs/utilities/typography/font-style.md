---
title: Font style
description: Utilities to change an element's font styles.
---

## Italics

Use `d-fs-italic` to change an element's font-style.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-purple-400 d-fs-italic">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fs-300 d-fs-italic">...</p>
```

## No italics

Use `d-fs-none` to remove an element's font-style.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-purple-400 d-fs-none">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fs-300 d-fs-none">...</p>
```

<script setup>
  import { style } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in style">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-fs-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">font-style: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
