---
title: Resize
description: Utilities for controlling the resize of an element.
---

## Usage

<code-well-header class="d-p32 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div v-for="{ class: className } in resize.slice(0, 4)" :class="className" class="d-of-auto d-mb8 d-py8 d-px16 d-bar8 d-ba d-bc-purple-400 d-bgc-neutral-white d-bgo50 d-fc-black-700 d-fs-200">
    .{{ className }}
  </div>
</code-well-header>

```html
<div class="d-r-both">...</div>
<div class="d-r-horizontal">...</div>
<div class="d-r-vertical">...</div>
<div class="d-r-none">...</div>
```

<script setup>
  import { resize } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in resize">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fs-100">.{{ className }}</th>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
