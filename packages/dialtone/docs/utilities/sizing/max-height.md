---
title: Max-height
description: Utilities to control an element's maximum height.
---

## Example

Use `d-hmx{n}p` or `d-hmx{n}` to set a maximum height percentage for an element. This can be combined with `d-h{n}p` and `d-hmn{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmx216" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-h72 d-hmx100p d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center">1</div>
</code-well-header>

```html
<div class="d-h216">
    <div class="d-h72 d-hmx50p">1</div>
</div>
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
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-hmx{{ i }}p</th>
        <td class="d-ff-mono d-fs-100">max-height: {{ i }}% !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in fixed">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-hmx{{ i }}</th>
        <td class="d-ff-mono d-fs-100">max-height: {{ i }}px !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in other">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-hmx-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">max-height: {{ i }} !important;</td>
      </tr>
    </tbody>
  </table>
</div>
