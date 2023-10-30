---
title: Display
description: Utilities for controlling the display box type of an element.
---

## Examples

<code-well-header  class="d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216 d-stack12" custom>
  <div class="d-p8 d-ba d-baw4 d-bar4 d-bc-purple-300 d-bgc-purple-200 d-d-block">
    <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100">d-d-block</div>
  </div>

  <div class="d-p8 d-ba d-baw4 d-bar4 d-bc-purple-300 d-bgc-purple-200 d-stack4 d-flow4">
    <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100 d-d-inline-block">d-d-inline-block</div>
    <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100 d-d-inline-block">d-d-inline-block</div>
    <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100 d-d-inline-block">d-d-inline-block</div>
  </div>

  <div class="d-p8 d-ba d-baw4 d-bar4 d-bc-purple-300 d-bgc-purple-200 d-flow4">
    <div class="d-fl-center d-fl1 d-as-stretch d-p4 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100 d-d-inline">d-d-inline</div>
    <div class="d-fl-center d-fl1 d-as-stretch d-p4 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100 d-d-inline">d-d-inline</div>
    <div class="d-fl-center d-fl1 d-as-stretch d-p4 d-bgc-purple-300 d-bar2 d-ff-mono d-fs-100 d-d-inline">d-d-inline</div>
  </div>
</code-well-header>

```html
<div class="d-d-block">…</div>
<div class="d-d-inline-block">…</div>
<div class="d-d-inline">…</div>
<div class="d-d-none">…</div>
<div class="d-d-unset">…</div>
```

<script setup>
  import display from '@data/display.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for=" { name, output } in display">
        <th class="d-ff-mono d-fc-purple-400 d-fs-100 d-fw-normal">{{ name }}</th>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
