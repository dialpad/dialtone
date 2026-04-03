---
title: Cursor
description: Utilities for setting the type of mouse cursor, if any, to show when the mouse pointer is over an element.
keywords: ["pointer", "hover", "focus"]
---
## Usage

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" class="d-fw-wrap d-w100p d-bar8 d-plc-center">
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-all-scroll">d-c-all-scroll</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-auto">d-c-auto</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-col-resize">d-c-col-resize</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-copy">d-c-copy</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-crosshair">d-c-crosshair</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-default">d-c-default</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-grab">d-c-grab</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-grabbing">d-c-grabbing</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-help">d-c-help</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-menu">d-c-menu</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-move">d-c-move</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-none">d-c-none</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-not-allowed">d-c-not-allowed</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-pointer">d-c-pointer</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-progress">d-c-progress</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-row-resize">d-c-row-resize</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-text">d-c-text</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-wait">d-c-wait</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-zoom-in">d-c-zoom-in</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-bar4 d-c-zoom-out">d-c-zoom-out</div>
</dt-stack>
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
