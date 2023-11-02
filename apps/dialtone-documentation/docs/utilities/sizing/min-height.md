---
title: Min-height
description: Utilities to control an element's minimum height.
---

## Percentages

Use `d-hmn{n}p` to set a minimum height percentage for an element. This can be combined with `d-h{n}p` and `d-hmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-h216 d-flow16" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-hmn100p d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center">1</div>
</code-well-header>

```html
<div class="d-h216">
    <div class="d-hmn100p">1</div>
</div>
```

## Fixed

Use `d-hmn{n}` to set a fixed minimum height for an element. This can be combined with `d-h{n}p` and `d-hmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn264 d-flow16 d-of-y-scroll" custom>
  <div class="d-fl-center d-py16 d-px8 d-w64 d-h48 d-hmn64 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-ta-center">1</div>
  <div class="d-fl-center d-py16 d-px8 d-w64 d-h48 d-hmn96 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-ta-center">2</div>
  <div class="d-fl-center d-py16 d-px8 d-w64 d-hmn332 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold d-ta-center">3</div>
</code-well-header>

```html
<div class="d-hmn64">1</div>
<div class="d-hmn96">2</div>
<div class="d-hmn332">3</div>
```

<script setup>
  import { percentage, fixed, other } from '@data/width-height.json';
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w30p">Class</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in percentage">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-hmn{{ i }}p</th>
        <td class="d-ff-mono d-fs-100">min-height: {{ i }}% !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in fixed">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-hmn{{ i }}</th>
        <td class="d-ff-mono d-fs-100">min-height: {{ i }}px !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in other">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-hmn-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">min-height: {{ i }} !important;</td>
      </tr>
    </tbody>
  </table>
</div>
