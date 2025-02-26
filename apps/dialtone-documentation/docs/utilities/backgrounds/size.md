---
title: Background Size
description: Utilities for controlling an element's background size.
---

## Usage

Use `d-bgs-{n}` to control the size of element's background image.

<code-well-header class="d-fl-col4 d-fw-wrap d-g12 d-p12 d-bgc-black-200 d-bgo50" custom>
  <div
    class="d-d-flex d-fd-column d-ai-center d-stack4"
    v-for="(_, className) in sizes"
    :key="className"
  >
      <div
        class="d-fl-center d-w128 d-h128 d-bgc-magenta-200 d-bar8 d-bc-purple-200 d-of-hidden d-bgr-none"
        style="background-image: url('https://4.bp.blogspot.com/-EVbXg5iW6qY/ULcKZEC-bnI/AAAAAAAACCI/kZDtjeKwQlo/s1600/puffin1.jpg');"
        :style="className.endsWith('var') ? '--bgg-size: 65% 65%;' : ''"
        :class="[{'d-bgp-center': className.endsWith('auto')}, className]"
      >
      </div>
      <code v-text="className" />
  </div>
</code-well-header>

```html
<div class="d-bgr-none d-bgs-contain" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-cover" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-auto d-bgp-center" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-unset" style="background-image: url(...);">...</div>
```

## Classes

<new-utility-class-table :classes="sizes"/>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const sizes = extractUtilityClasses(utilityClassDocs, 'd-bgs-');
</script>
