---
title: Background position
description: Utilities for controlling the position of an element's background image.
---

## Usage

Use `d-bgp-{position}` to control where an element's background image is placed.

<code-well-header class="d-fl-col4 d-fw-wrap d-flg12 d-p12 d-bgc-purple-100 d-bgo50" custom>
  <div class="d-d-flex d-fd-column d-ai-center d-stack4" v-for="{ className } in positions">
      <div
        class="d-fl-center d-w128 d-h128 d-bgc-purple-300 d-bar8 d-bc-purple-200 d-of-hidden d-bgr-none d-bgs-var" style="--bgg-size: 65% 65%; background-image: url('https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg');"
        :class="`d-bgp-${className}`"
      >
      </div>
      <code>.d-bgp-{{ className }}</code>
  </div>
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
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bgp-{{ className }}</th>
          <td class="d-ff-mono d-fs-100">
            background-position: {{ output }} !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
