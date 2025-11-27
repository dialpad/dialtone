---
title: Max-width
description: Utilities to control an element's maximum width.
---

## Percentages

Use `d-wmx{n}p` to set a minimum width percentage for an element. This can be combined with `d-w{n}p` and `d-wmn{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-flow16" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-wmx50p d-bgc-moderate d-bar4 d-ta-center">1</div>
</code-well-header>

```html
<div class="d-w100p d-wmx50p">1</div>
```

## Fixed

Use `d-wmx{n}` to set a fixed minimum width for an element. This can be combined with `d-w{n}p` and `d-wmn{n}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-flow16 d-of-y-scroll" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-h64 d-wmx64 d-bgc-moderate d-bar4 d-ta-center">1</div>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-h64 d-wmx96 d-bgc-moderate d-bar4 d-ta-center">2</div>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-h64 d-wmx332 d-bgc-moderate d-bar4 d-ta-center">3</div>
</code-well-header>

```html
<div class="d-w100p d-wmx64">1</div>
<div class="d-w100p d-wmx96">2</div>
<div class="d-w100p d-wmx332">3</div>
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
          <th scope="col" class="d-p0 d-bbw0 d-w30p"><div class="d-p16 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmx{{ i }}p</th>
          <td class="d-code--sm">max-inline-size: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in fixed">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmx{{ i }}</th>
          <td class="d-code--sm">max-inline-size: {{ i }}px !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmx-{{ i }}</th>
          <td class="d-code--sm">max-inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
