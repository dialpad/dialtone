---
title: Resize
description: Utilities for controlling the resize of an element.
---

## Usage

<code-well-header>
  <dt-stack gap="400" class="d-w50p">
    <div v-for="{ class: className } in resize.slice(0, 4)" :class="className" class="d-of-auto d-p16 d-ba d-bc-default d-bgc-moderate">
      .{{ className }}
    </div>
  </dt-stack>
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
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
