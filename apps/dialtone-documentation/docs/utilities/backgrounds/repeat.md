---
title: Background Repeat
description: Utilities for controlling if or how an element's background image repeats.
---

## Usage

Use `d-bgr-{n}` to how an element's background image repeats.

<code-well-header class="d-fl-col3 d-fw-wrap d-g16 d-p16 d-bgc-secondary" custom>
  <div class="d-d-flex d-fd-column d-ai-center d-stack4" v-for="i in repeat">
      <dt-stack direction="row" align="center" justify="center" class="d-w128 d-h128 d-bgc-moderate d-bar8 d-of-hidden d-bgp-tl d-bgs-var" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"
        :class="`d-bgr-${i}`" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">
      </dt-stack>
      <code class="d-code--sm d-bgc-transparent">.d-bgr-{{ i }}</code>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-bgr-{{ i }}</th>
          <td class="d-code--sm">
            background-repeat: {{ i }} !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
