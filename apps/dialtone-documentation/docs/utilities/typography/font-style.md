---
title: Font Style
description: Utilities to change an element's font styles.
keywords: ["italic", "oblique", "normal"]
---

> [!WARNING] Use DtText over CSS Utilities
> Reach for the [DtText](/components/text) component before considering any typography utility.

## Normal

Use `d-fs-normal` to change an element's font-style.

```vue demo
<p class="d-fs-normal">The quick brown fox jumps over the lazy dog.</p>
```

## Italics

Use `d-fs-italic` to change an element's font-style.

```vue demo
<p class="d-fs-italic">The quick brown fox jumps over the lazy dog.</p>
```

## No Italics

Use `d-fs-none` to remove an element's font-style.

```vue demo
<p class="d-fs-none">The quick brown fox jumps over the lazy dog.</p>
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
