---
title: Max-height
description: Utilities to control an element's maximum height.
---

## Example

Use `d-hmx{n}p` or `d-hmx{n}` to set a maximum height percentage for an element. This can be combined with `d-h{n}p` and `d-hmn{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-hmx216" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-h72 d-hmx100p d-bgc-moderate d-bar4 d-ta-center">1</div>
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

<div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w30p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx{{ i }}p</th>
          <td class="d-code--sm">max-height: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in fixed">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx{{ i }}</th>
          <td class="d-code--sm">max-height: {{ i }}px !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx-{{ i }}</th>
          <td class="d-code--sm">max-height: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
