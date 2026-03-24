---
title: Background Position
description: Utilities for controlling the position of an element's background image.
keywords: ["bg position", "center", "top", "bottom"]
---

## Usage

Use `d-bgp-{position}` to control where an element's background image is placed.

<code-well-header class="d-fl-col5 d-fw-wrap d-g-200 d-p-200 d-bgc-secondary" custom>
  <dt-stack align="center" class="d-g-50" v-for="{ className } in positions">
      <dt-stack direction="row" align="center" justify="center" class="d-w-200 d-h-200 d-bgc-moderate d-bar8 d-of-hidden d-bgr-none d-bgs-var" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"
        :class="`d-bgp-${className}`">
      </dt-stack>
      <code class="d-code--sm d-bgc-transparent">.d-bgp-{{ className }}</code>
  </dt-stack>
</code-well-header>

```html
<div class="d-bgr-none d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-t" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-tr" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-r" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-bl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-b" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-br" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-l" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
```

<script setup>
  import { positions } from '@data/backgrounds.json';
</script>

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
