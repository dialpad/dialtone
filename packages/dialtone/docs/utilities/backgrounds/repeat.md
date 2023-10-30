---
title: Background repeat
description: Utilities for controlling if or how an element's background image repeats.
---

## Usage

Use `d-bgr-{n}` to how an element's background image repeats.

<code-well-header class="d-fl-col4 d-fw-wrap d-flg12 d-p12 d-bgc-green-100 d-bgo50" custom>
  <div class="d-d-flex d-fd-column d-ai-center d-stack4" v-for="i in repeat">
      <div
        class="d-fl-center d-w128 d-h128 d-bgc-green-200 d-bar8 d-bc-purple-200 d-of-hidden d-bgp-tl d-bgs-var" style="--bgg-size: 65% 65%; background-image: url('https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg');"
        :class="`d-bgr-${i}`"
      >
      </div>
      `.d-bgr-{{ i }}`
  </div>
</code-well-header>

```html
<div class="d-bgr-repeat d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-repeat-x d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-repeat-y d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-space d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-unset d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
```

<script setup>
const repeat = ['repeat', 'repeat-x', 'repeat-y', 'space', 'none', 'unset'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in repeat">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bgr-{{ i }}</th>
          <td class="d-ff-mono d-fs-100">
            background-repeat: {{ i }} !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
