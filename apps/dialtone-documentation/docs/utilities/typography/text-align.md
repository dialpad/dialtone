---
title: Text Align
description: Utilities for controlling an element's text alignment.
keywords: ["left", "center", "right", "justify"]
---

> [!WARNING] Use DtText over CSS Utilities
> Reach for the [DtText](/components/text) component before considering any typography utility.

## Usage

Use `d-ta-{n}` to change an element's text alignment.

```vue demo
<!-- @wrapper -->
<div class="d-w100p d-d-grid d-g-200 d-ai-center lg:d-fs-100" style="grid-template-columns: auto 1fr">
  <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-left</div>
  <div><p class="d-bgc-moderate d-ta-left">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-center</div>
  <div><p class="d-bgc-moderate d-ta-center">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-right</div>
  <div><p class="d-bgc-moderate d-ta-right">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-justify</div>
  <div><p class="d-bgc-moderate d-ta-justify d-w-500">The quick brown fox jumps over the lazy dog. This needs a width applied to it to work.</p></div>
  <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-ta-unset</div>
  <div><p class="d-bgc-moderate d-ta-unset">The quick brown fox jumps over the lazy dog.</p></div>
</div>
```

<script setup>
  import { align } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in align">
        <th class="d-code--sm d-docsite-code">.d-ta-{{ i.class }}</th>
        <td class="d-code--sm">text-align: {{ i.value }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
