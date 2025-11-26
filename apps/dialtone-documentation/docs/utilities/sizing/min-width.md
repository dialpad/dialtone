---
title: Min-width
description: Utilities to control an element's minimum width.
---

## Percentages

Use `d-wmn{n}p` to set a minimum width percentage for an element. This can be combined with `d-w{n}p` and `d-wmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-flow16" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py16 d-px8 d-w64 d-wmn50p d-bgc-moderate d-bar4 d-ta-center" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
</code-well-header>

```html
<div class="d-w64 d-wmn50p">1</div>
```

## Fixed

Use `d-wmn{n}` to set a fixed minimum width for an element. This can be combined with `d-w{n}p` and `d-wmx{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-flow16 d-of-x-scroll" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py16 d-px8 d-w64 d-h64 d-wmn64 d-bgc-moderate d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py16 d-px8 d-w64 d-h64 d-wmn96 d-bgc-moderate d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py16 d-px8 d-w64 d-h64 d-wmn332 d-bgc-moderate d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
</code-well-header>

```html
<div class="d-wmn64">1</div>
<div class="d-wmn96">2</div>
<div class="d-wmn332">3</div>
```

<script setup>
  import { percentage, fixed, other } from '@data/width-height.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Classes

<clamped-table-wrapper>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmn{{ i }}p</th>
          <td class="d-code--sm">min-width: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in fixed">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmn{{ i }}</th>
          <td class="d-code--sm">min-width: {{ i }}px !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmn-{{ i }}</th>
          <td class="d-code--sm">min-width: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
