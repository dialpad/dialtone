---
title: Width
description: Utilities to control an element's width.
keywords: ["size", "wide", "vw", "viewport width"]
---

## Percentages

Use `d-w{n}p` to set a percentage width for an element.

<code-well-header class="d-d-flex d-fd-column d-p-300 d-bgc-secondary d-w100p d-hmx-500 d-stack16 d-code--md d-ta-center d-of-y-scroll" v-dt-scrollbar:never custom>
  <dt-stack direction="row" align="center" justify="center" class="d-ps-relative" v-for="i in percentage">
    <dt-stack as="span" direction="row" align="center" class="d-zi-active d-h-100">d-w{{i}}p</dt-stack>
    <div class="d-w100p d-h-100 d-ps-absolute d-bgc-moderate">
      <div class="d-h-100 d-bgc-moderate-opaque d-bar4" :class="`d-w${i}p`"></div>
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

Use `d-w-{stop}` to set a fixed width for an element using layout token stops.

<code-well-header class="d-d-flex d-fd-column d-p-300 d-bgc-secondary d-w100p d-hmx-500 d-stack16 d-ta-center d-of-scroll" v-dt-scrollbar:never custom>
  <dt-stack direction="row" align="center" class="d-pls-start" v-for="(i, index) in layout">
    <span class="d-w-100">d-w-{{i.stop}}</span>
    <div class="d-h-100 d-bgc-moderate d-bar4" :class="`d-w-${i.stop}`"></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-w-25">...</div>
<div class="d-w-50">...</div>
<div class="d-w-75">...</div>
<div class="d-w-100">...</div>
<div class="d-w-125">...</div>
<div class="d-w-150">...</div>
<div class="d-w-175">...</div>
<div class="d-w-200">...</div>
<div class="d-w-250">...</div>
<div class="d-w-300">...</div>
<div class="d-w-350">...</div>
<div class="d-w-400">...</div>
<div class="d-w-450">...</div>
<div class="d-w-500">...</div>
<div class="d-w-550">...</div>
<div class="d-w-600">...</div>
<div class="d-w-650">...</div>
<div class="d-w-700">...</div>
<div class="d-w-750">...</div>
<div class="d-w-800">...</div>
<div class="d-w-850">...</div>
<div class="d-w-900">...</div>
<div class="d-w-950">...</div>
<div class="d-w-1000">...</div>
<div class="d-w-1050">...</div>
<div class="d-w-1100">...</div>
<div class="d-w-1150">...</div>
<div class="d-w-1200">...</div>
<div class="d-w-1250">...</div>
<div class="d-w-1300">...</div>
<div class="d-w-1350">...</div>
<div class="d-w-1400">...</div>
<div class="d-w-1450">...</div>
<div class="d-w-1500">...</div>
<div class="d-w-1550">...</div>
<div class="d-w-1600">...</div>
```

## Screen

Use `d-w100vw` to have an element cover the user's viewport.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-h-25 d-stack16 d-of-y-scroll" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100vw d-h100vh d-bgc-moderate d-bar4 d-ta-center">Viewport</dt-stack>
</code-well-header>

```html
<div class="d-h100vh d-w100vw">...</div>
```

## Auto

Use `d-w-auto` have the browser calculate and select a width.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-hmn-150 d-stack16" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-h-100 d-w-auto d-bgc-moderate d-bar4 d-ta-center">Auto</dt-stack>
</code-well-header>

```html
<div class="d-w-auto">...</div>
```

<script setup>
  import { percentage, layout, other } from '@data/width-height.json';
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-w{{ i }}p</th>
          <td class="d-code--sm">inline-size: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in layout">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w-{{ i.stop }}</th>
          <td class="d-code--sm">inline-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-w100vw</th>
          <td class="d-code--sm">inline-size: 100vw !important;</td>
        </tr>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w-{{ i }}</th>
          <td class="d-code--sm">inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
