---
title: Background Size
description: Utilities for controlling an element's background size.
keywords: ["bg size", "cover", "contain"]
---

## Usage

Use `d-bgs-{n}` to control the size of element's background image.

```vue demo
<!-- @custom -->
<!-- @class d-d-grid d-g-200 d-g-cols4 d-p-200 d-bgc-sunken -->
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-contain" style="background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgs-contain</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-cover" style="background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgs-cover</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var" style="background-image: url('/assets/images/puffin.jpg'); --bgg-size: 65% 65%;"></div>
  <dt-text as="code" kind="code" size="100">d-bgs-var</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-auto d-bgp-center" style="background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgs-auto</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-unset" style="background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgs-unset</dt-text>
</dt-stack>
```

<script setup>
  const sizes = ['contain', 'cover', 'var', 'auto', 'unset'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in sizes">
        <th scope="row" class="d-code--sm d-docsite-code">.d-bgp-{{ i }}</th>
        <td class="d-code--sm">
          background-size:
            <span v-if="i === 'var'"> var(--bgg-size, 100% 100%); </span>
            <span v-else >{{ i }} !important; </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
