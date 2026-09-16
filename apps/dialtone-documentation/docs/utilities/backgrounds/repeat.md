---
title: Background Repeat
description: Utilities for controlling if or how an element's background image repeats.
keywords: ["bg repeat", "no repeat", "tile"]
---

## Usage

Use `d-bgr-{n}` to how an element's background image repeats.

```vue demo
<!-- @custom -->
<!-- @class d-d-grid d-g-200 d-g-cols4 d-p-200 d-bgc-secondary -->
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgp-tl d-bgs-var d-bgr-repeat" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgr-repeat</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgp-tl d-bgs-var d-bgr-repeat-x" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgr-repeat-x</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgp-tl d-bgs-var d-bgr-repeat-y" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgr-repeat-y</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgp-tl d-bgs-var d-bgr-space" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgr-space</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgp-tl d-bgs-var d-bgr-none" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgr-none</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgp-tl d-bgs-var d-bgr-unset" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgr-unset</dt-text>
</dt-stack>
```

<script setup>
const repeat = ['repeat', 'repeat-x', 'repeat-y', 'space', 'none', 'unset'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in repeat">
          <th scope="row" class="d-code--sm d-docsite-code">.d-bgr-{{ i }}</th>
          <td class="d-code--sm">
            background-repeat: {{ i }} !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
