---
title: Min-height
description: Utilities to control an element's minimum height.
keywords: ["minimum height", "mnh"]
---

## Percentages

Use `d-hmn{n}p` to set a minimum height percentage for an element. This can be combined with `d-h{n}p` and `d-hmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p-300 d-bgc-secondary d-bgo50 d-w100p d-h216 d-flow16" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-hmn100p d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
</code-well-header>

```html
<div class="d-h216">
    <div class="d-hmn100p">1</div>
</div>
```

## Fixed

Use `d-hmn{n}` to set a fixed minimum height for an element. This can be combined with `d-h{n}p` and `d-hmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-hmn264 d-flow16 d-of-y-scroll" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-h-75 d-hmn-100 d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-h-75 d-hmn-150 d-bgc-moderate d-bar4 d-ta-center">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-hmn332 d-bgc-moderate d-bar4 d-ta-center">3</dt-stack>
</code-well-header>

```html
<div class="d-hmn-100">1</div>
<div class="d-hmn-150">2</div>
<div class="d-hmn332">3</div>
```

<script setup>
  import { percentage, fixed, other } from '@data/width-height.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Classes

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w30p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmn{{ i }}p</th>
          <td class="d-code--sm">min-block-size: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in fixed">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmn{{ i }}</th>
          <td class="d-code--sm">min-block-size: {{ i }}px !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmn-{{ i }}</th>
          <td class="d-code--sm">min-block-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
