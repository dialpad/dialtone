---
title: Text Align
description: Utilities for controlling an element's text alignment.
---

## Usage

Use `d-ta-{n}` to change an element's text alignment.

<code-well-header class="d-w100p">
  <div class="d-w100p d-d-grid d-g16 d-ai-center lg:d-fs-100" style="grid-template-columns: auto 1fr">
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-left</div>
    <div><p class="d-bgc-moderate d-ta-left">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-center</div>
    <div><p class="d-bgc-moderate d-ta-center">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-right</div>
    <div><p class="d-bgc-moderate d-ta-right">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-justify</div>
    <div><p class="d-bgc-moderate d-ta-justify d-w332">The quick brown fox jumps over the lazy dog. This needs a width applied to it to work.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-unset</div>
    <div><p class="d-bgc-moderate d-ta-unset">The quick brown fox jumps over the lazy dog.</p></div>
  </div>
</code-well-header>

```html
<p class="d-ta-left">...</p>
<p class="d-ta-center">...</p>
<p class="d-ta-right">...</p>
<p class="d-ta-justify d-w332">...</p>
<p class="d-ta-unset">...</p>
```

<script setup>
  import { align } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in align">
        <th class="d-code--sm d-docsite-code">.d-ta-{{ i }}</th>
        <td class="d-code--sm">text-align: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
