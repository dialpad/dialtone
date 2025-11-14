---
title: Cursor
description: Utilities for setting the type of mouse cursor, if any, to show when the mouse pointer is over an element.
keywords: ["cursor","pointer","hover","focus"]
---
## Usage

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-fw-wrap d-w100p d-bar8 d-plc-center">
    <div v-for="{ class: className, output } in cursor" class="d-p16 d-bgc-moderate d-code--sm d-bar4" :class="className">{{ className }}</div>
  </dt-stack>
</code-well-header>

```html
<div class="d-c-all-scroll">...</div>
<div class="d-c-auto">...</div>
<div class="d-c-col-resize">...</div>
<div class="d-c-copy">...</div>
<div class="d-c-crosshair">...</div>
<div class="d-c-default">...</div>
<div class="d-c-grab">...</div>
<div class="d-c-grabbing">...</div>
<div class="d-c-help">...</div>
<div class="d-c-menu">...</div>
<div class="d-c-move">...</div>
<div class="d-c-none">...</div>
<div class="d-c-not-allowed">...</div>
<div class="d-c-pointer">...</div>
<div class="d-c-progress">...</div>
<div class="d-c-row-resize">...</div>
<div class="d-c-text">...</div>
<div class="d-c-wait">...</div>
<div class="d-c-zoom-in">...</div>
<div class="d-c-zoom-out">...</div>
```

<script setup>
  import { cursor } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in cursor">
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
