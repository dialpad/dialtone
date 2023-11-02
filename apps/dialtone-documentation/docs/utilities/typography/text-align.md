---
title: Text align
description: Utilities for controlling an element's text alignment.
---

## Usage

Use `d-ta-{n}` to change an element's text alignment.

<code-well-header class="d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102 d-of-auto" custom>
  <div class="d-d-grid d-gg16 d-ai-center lg:d-fs-100" style="grid-template-columns: auto 1fr">
    <div class="d-ff-mono d-fc-purple-400 d-ws-nowrap">.d-ta-left</div>
    <div><p class="d-ta-left d-pr12">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-ff-mono d-fc-purple-400 d-ws-nowrap">.d-ta-center</div>
    <div><p class="d-ta-center d-pr12">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-ff-mono d-fc-purple-400 d-ws-nowrap">.d-ta-right</div>
    <div><p class="d-ta-right d-pr12">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-ff-mono d-fc-purple-400 d-ws-nowrap">.d-ta-justify</div>
    <div><p class="d-ta-justify d-pr12 d-w332">The quick brown fox jumps over the lazy dog. This needs a width applied to it to work.</p></div>
    <div class="d-ff-mono d-fc-purple-400 d-ws-nowrap">.d-ta-unset</div>
    <div><p class="d-ta-unset d-pr12">The quick brown fox jumps over the lazy dog.</p></div>
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
        <th class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-ta-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">text-align: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
