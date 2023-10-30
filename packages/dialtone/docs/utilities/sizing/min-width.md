---
title: Min-width
description: Utilities to control an element's minimum width.
---

## Percentages

Use `d-wmn{n}p` to set a minimum width percentage for an element. This can be combined with `d-w{n}p` and `d-wmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-flow16" custom>
  <div class="d-fl-center d-py16 d-px8 d-w64 d-wmn50p d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center">1</div>
</code-well-header>

```html
<div class="d-w64 d-wmn50p">1</div>
```

## Fixed

Use `d-wmn{n}` to set a fixed minimum width for an element. This can be combined with `d-w{n}p` and `d-wmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-flow16 d-of-x-scroll d-fs-300 d-fw-bold d-ta-center" custom>
  <div class="d-fl-center d-py16 d-px8 d-w64 d-h64 d-wmn64 d-bgc-magenta-100 d-bar4">1</div>
  <div class="d-fl-center d-py16 d-px8 d-w64 d-h64 d-wmn96 d-bgc-magenta-100 d-bar4">2</div>
  <div class="d-fl-center d-py16 d-px8 d-w64 d-h64 d-wmn332 d-bgc-magenta-100 d-bar4">3</div>
</code-well-header>

```html
<div class="d-wmn64">1</div>
<div class="d-wmn96">2</div>
<div class="d-wmn332">3</div>
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
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-wmn{{ i }}p</th>
        <td class="d-ff-mono d-fs-100">min-width: {{ i }}% !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in fixed">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-wmn{{ i }}</th>
        <td class="d-ff-mono d-fs-100">min-width: {{ i }}px !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in other">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-wmn-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">min-width: {{ i }} !important;</td>
      </tr>
    </tbody>
  </table>
</div>
