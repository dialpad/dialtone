---
title: Height
description: Utilities to control an element's height.
keywords: ["width","height","size","dimensions"]
---

## Percentages

Use `d-h{n}p` to set a percentage height for an element.

<code-well-header class="d-d-flex d-p24 d-bgc-secondary d-w100p d-h332 d-flow16 d-code--md d-ta-center" v-dt-scrollbar:never custom>
  <div v-for="i in percentage" class="d-d-flex d-fl-center d-h100p d-ps-relative">
    <span class="d-zi-active d-w72">d-h{{i}}p</span>
    <div class="d-w72 d-h216 d-ps-absolute d-bgc-moderate">
      <div class="d-w72 d-bgc-bold d-bar4" :class="`d-h${i}p`"></div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-h216">
  <div class="d-h10p">d-h10p</div>
  <div class="d-h20p">d-h20p</div>
  <div class="d-h25p">d-h25p</div>
  <div class="d-h30p">d-h30p</div>
  <div class="d-h40p">d-h40p</div>
  <div class="d-h50p">d-h50p</div>
  <div class="d-h60p">d-h60p</div>
  <div class="d-h70p">d-h70p</div>
  <div class="d-h75p">d-h75p</div>
  <div class="d-h80p">d-h80p</div>
  <div class="d-h90p">d-h80p</div>
  <div class="d-h100p">d-h100p</div>
</div>
```

## Fixed

Use `d-h{n}` to set a fixed height for an element.

<code-well-header class="d-d-flex d-p24 d-bgc-secondary d-w100p d-hmx512 d-flow16 d-of-scroll d-ta-center" v-dt-scrollbar:never custom>
  <div v-for="(i, index) in fixed" class="d-d-flex d-fd-column d-pls-start d-g8" :key="index">
    <span class="d-code--md">d-h{{i}}</span>
    <div class="d-fl-center d-w64 d-bgc-bold d-bar4" :class="`d-h${i}`"></div>
  </div>
</code-well-header>

```html
<div class="d-hmn264">
  <div class="d-h0">...</div>
  <div class="d-h1">...</div>
  <div class="d-h2">...</div>
  <div class="d-h4">...</div>
  <div class="d-h6">...</div>
  <div class="d-h8">...</div>
  <div class="d-h12">...</div>
  <div class="d-h16">...</div>
  <div class="d-h20">...</div>
  <div class="d-h24">...</div>
  <div class="d-h32">...</div>
  <div class="d-h42">...</div>
  <div class="d-h48">...</div>
  <div class="d-h64">...</div>
  <div class="d-h72">...</div>
  <div class="d-h84">...</div>
  <div class="d-h96">...</div>
  <div class="d-h102">...</div>
  <div class="d-h114">...</div>
  <div class="d-h128">...</div>
  <div class="d-h164">...</div>
  <div class="d-h216">...</div>
  <div class="d-h264">...</div>
  <div class="d-h332">...</div>
  <div class="d-h464">...</div>
  <div class="d-h512">...</div>
  <div class="d-h628">...</div>
  <div class="d-h764">...</div>
  <div class="d-h828">...</div>
  <div class="d-h912">...</div>
  <div class="d-h1024">...</div>
  <div class="d-h1140">...</div>
  <div class="d-h1268">...</div>
  <div class="d-h1340">...</div>
</div>
```

## Screen

Use `d-h100vh` to have an element cover the user's viewport.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-h3 d-flow16 d-of-y-scroll" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100vw d-h100vh d-bgc-moderate d-bar4 d-ta-center">Viewport</div>
</code-well-header>

```html
<div class="d-h100vh d-w100vw">...</div>
```

## Auto

Use `d-h-auto` have the browser calculate and select a height.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-secondary d-w100p d-hmn216 d-flow16" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-h-auto d-bgc-moderate d-bar4 d-ta-center">Auto</div>
</code-well-header>

```html
<div class="d-h-auto">...</div>
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
          <th scope="col" class="d-p0 d-bbw0 d-w30p"><div class="d-p16 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h{{ i }}p</th>
          <td class="d-code--sm">block-size: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in fixed">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h{{ i }}</th>
          <td class="d-code--sm">block-size: {{ i }}px !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-h100vh</th>
          <td class="d-code--sm">block-size: 100vh !important;</td>
        </tr>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h-{{ i }}</th>
          <td class="d-code--sm">block-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
