---
title: Background Position
description: Utilities for controlling the position of an element's background image.
---

## Usage

Use `d-bgp-{position}` to control where an element's background image is placed.

<code-well-header class="d-fl-col4 d-fw-wrap d-g12 d-p12 d-bgc-purple-100 d-bgo50" custom>
  <div
    class="d-d-flex d-fd-column d-ai-center d-stack4"
    v-for="(_, className) in positions"
    :key="className"
    >
      <div
        class="d-fl-center d-w128 d-h128 d-bgc-purple-300 d-bar8 d-bc-purple-200 d-of-hidden d-bgr-none d-bgs-var"
        style="--bgg-size: 65% 65%;"
        :style="`background-image: url(${$withBase('/assets/images/test.jpg')});`"
        :class="className"
      >
      </div>
      <code v-text="className" />
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

## Classes

<new-utility-class-table :classes="positions"/>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities'

  const utilityClassDocs = inject('utilityClassDocs');
  const positions = extractUtilityClasses(utilityClassDocs, 'd-bgp-');
</script>
