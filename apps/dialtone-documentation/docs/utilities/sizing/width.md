---
title: Width
description: Utilities to control an element's width.
---

## Percentages

Use `d-w{n}p` to set a percentage width for an element.

<code-well-header class="d-d-flex d-fd-column d-p24 d-bgc-secondary d-w100p d-hmx332 d-stack16 d-code--md d-ta-center d-of-y-scroll" v-dt-scrollbar:never custom>
  <dt-stack direction="row" align="center" justify="center" class="d-ps-relative" v-for="i in percentage" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">
    <dt-stack as="span" direction="row" align="center" class="d-zi-active d-h64" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-w{{i}}p</dt-stack>
    <div class="d-w100p d-h64 d-ps-absolute d-bgc-moderate">
      <div class="d-h64 d-bgc-moderate-opaque d-bar4" :class="`d-w${i}p`"></div>
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-w10p">d-w10p</div>
<div class="d-w20p">d-w20p</div>
<div class="d-w25p">d-w25p</div>
<div class="d-w30p">d-w30p</div>
<div class="d-w40p">d-w40p</div>
<div class="d-w50p">d-w50p</div>
<div class="d-w60p">d-w60p</div>
<div class="d-w70p">d-w70p</div>
<div class="d-w75p">d-w75p</div>
<div class="d-w80p">d-w80p</div>
<div class="d-w90p">d-w90p</div>
<div class="d-w100p">d-w100p</div>
```

## Fixed

Use `d-w{n}` to set a fixed width for an element.

<code-well-header class="d-d-flex d-fd-column d-p24 d-bgc-secondary d-w100p d-hmx332 d-stack16 d-ta-center d-of-scroll" v-dt-scrollbar:never custom>
  <dt-stack direction="row" align="center" class="d-pls-start" v-for="(i, index) in fixed" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">
    <span class="d-w72">d-w{{i}}</span>
    <div class="d-h64 d-bgc-moderate d-bar4" :class="`d-w${i}`"></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-w0">...</div>
<div class="d-w1">...</div>
<div class="d-w2">...</div>
<div class="d-w4">...</div>
<div class="d-w6">...</div>
<div class="d-w8">...</div>
<div class="d-w12">...</div>
<div class="d-w16">...</div>
<div class="d-w20">...</div>
<div class="d-w24">...</div>
<div class="d-w32">...</div>
<div class="d-w42">...</div>
<div class="d-w48">...</div>
<div class="d-w64">...</div>
<div class="d-w72">...</div>
<div class="d-w84">...</div>
<div class="d-w96">...</div>
<div class="d-w102">...</div>
<div class="d-w114">...</div>
<div class="d-w128">...</div>
<div class="d-w164">...</div>
<div class="d-w216">...</div>
<div class="d-w264">...</div>
<div class="d-w332">...</div>
<div class="d-w464">...</div>
<div class="d-w512">...</div>
<div class="d-w628">...</div>
<div class="d-w764">...</div>
<div class="d-w828">...</div>
<div class="d-w912">...</div>
<div class="d-w1024">...</div>
<div class="d-w1140">...</div>
<div class="d-w1268">...</div>
<div class="d-w1340">...</div>
```

## Screen

Use `d-w100vw` to have an element cover the user's viewport.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-h3 d-stack16 d-of-y-scroll" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py16 d-px8 d-w100vw d-h100vh d-bgc-moderate d-bar4 d-ta-center" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">Viewport</dt-stack>
</code-well-header>

```html
<div class="d-h100vh d-w100vw">...</div>
```

## Auto

Use `d-w-auto` have the browser calculate and select a width.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-hmn102 d-stack16" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py16 d-px8 d-h72 d-w-auto d-bgc-moderate d-bar4 d-ta-center" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">Auto</dt-stack>
</code-well-header>

```html
<div class="d-w-auto">...</div>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-w{{ i }}p</th>
          <td class="d-code--sm">width: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in fixed">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w{{ i }}</th>
          <td class="d-code--sm">width: {{ i }}px !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-w100vw</th>
          <td class="d-code--sm">width: 100vw !important;</td>
        </tr>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w-{{ i }}</th>
          <td class="d-code--sm">width: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
