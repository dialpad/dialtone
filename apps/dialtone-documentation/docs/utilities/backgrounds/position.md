---
title: Background Position
description: Utilities for controlling the position of an element's background image.
keywords: ["bg position", "center", "top", "bottom"]
---

## Usage

Use `d-bgp-{position}` to control where an element's background image is placed.

```vue demo
<!-- @custom -->
<!-- @class d-d-grid d-g-200 d-g-cols4 d-p-200 d-bgc-secondary -->
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-tl</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-t" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-t</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-tr" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-tr</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-r" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-r</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-br" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-br</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-b" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-b</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-bl" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-bl</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-l" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-l</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-center" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-center</dt-text>
</dt-stack>
<dt-stack align="center" class="d-g-50">
  <div class="d-size-200 d-bgc-moderate d-bar-400 d-of-hidden d-bgr-none d-bgs-var d-bgp-unset" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"></div>
  <dt-text as="code" kind="code" size="100">d-bgp-unset</dt-text>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ className, output } in positions">
          <th scope="row" class="d-code--sm d-docsite-code">.d-bgp-{{ className }}</th>
          <td class="d-code--sm">
            background-position: {{ output }} !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
