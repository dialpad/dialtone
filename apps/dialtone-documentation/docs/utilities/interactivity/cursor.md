---
title: Cursor
description: Utilities for setting the type of mouse cursor, if any, to show when the mouse pointer is over an element.
---
## Usage

<code-well-header class="d-fl-col5 d-ta-center d-flg8 d-fw-wrap d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-fw-wrap d-ac-center d-p8 d-w100p d-hmn216 d-bar8">
    <div v-for="{ class: className, output } in cursor" class="d-fl-center d-m8 d-p16 d-bgc-purple-300 d-fs-100 d-ff-mono d-bar4" :class="className">.{{ className }}</div>
  </div>
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

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr v-for="{ class: className, output } in cursor">
          <th scope="row" class="d-ff-mono d-fw-normal d-fc-purple-400 d-fs-100">.{{ className }}</th>
          <td class="d-ff-mono d-fs-100">{{ output }}</td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
