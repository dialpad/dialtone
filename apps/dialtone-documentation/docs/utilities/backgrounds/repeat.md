---
title: Background Repeat
description: Utilities for controlling if or how an element's background image repeats.
---
## Usage

Use `d-bgr-{n}` to how an element's background image repeats.

<code-well-header class="d-fl-col4 d-fw-wrap d-g12 d-p12 d-bgc-green-100 d-bgo50" custom>
  <div
    class="d-d-flex d-fd-column d-ai-center d-stack4"
    v-for="(_, className) in backgroundRepeat"
    :key="className"
  >
      <div
        class="d-fl-center d-w128 d-h128 d-bgc-green-200 d-bar8 d-bc-purple-200 d-of-hidden d-bgp-tl d-bgs-var"
        style="--bgg-size: 65% 65%;"
        :style="`background-image: url(${$withBase('/assets/images/test.jpg')});`"
        :class="className"
      >
      </div>
      <code v-text="className" />
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

## Classes

<new-utility-class-table :classes="backgroundRepeat" />

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const backgroundRepeat = extractUtilityClasses(utilityClassDocs, 'd-bgr-');
</script>
