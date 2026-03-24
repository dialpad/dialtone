---
title: Height
description: Utilities to control an element's height.
keywords: ["size", "tall", "vh", "viewport height"]
---

## Percentages

Use `d-h{n}p` to set a percentage height for an element.

<code-well-header class="d-d-flex d-p-300 d-bgc-secondary d-w100p d-h-500 d-flow16 d-code--md d-ta-center" v-dt-scrollbar:never custom>
  <dt-stack direction="row" align="center" justify="center" class="d-h100p d-ps-relative" v-for="i in percentage">
    <span class="d-zi-active d-w-100">d-h{{i}}p</span>
    <div class="d-w-100 d-h-350 d-ps-absolute d-bgc-moderate">
      <div class="d-w-100 d-bgc-bold d-bar4" :class="`d-h${i}p`"></div>
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-h-350">
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

Use `d-h-{stop}` to set a fixed height for an element using layout token stops.

<code-well-header class="d-d-flex d-p-300 d-bgc-secondary d-w100p d-hmx-800 d-flow16 d-of-scroll d-ta-center" v-dt-scrollbar:never custom>
  <dt-stack gap="100" class="d-pls-start" v-for="(i, index) in layout" :key="index">
    <span class="d-code--md">d-h-{{i.stop}}</span>
    <dt-stack direction="row" align="center" justify="center" class="d-w-100 d-bgc-bold d-bar4" :class="`d-h-${i.stop}`"></dt-stack>
  </dt-stack>
</code-well-header>

```html
<div class="d-h-25">...</div>
<div class="d-h-50">...</div>
<div class="d-h-75">...</div>
<div class="d-h-100">...</div>
<div class="d-h-125">...</div>
<div class="d-h-150">...</div>
<div class="d-h-175">...</div>
<div class="d-h-200">...</div>
<div class="d-h-250">...</div>
<div class="d-h-300">...</div>
<div class="d-h-350">...</div>
<div class="d-h-400">...</div>
<div class="d-h-450">...</div>
<div class="d-h-500">...</div>
<div class="d-h-550">...</div>
<div class="d-h-600">...</div>
<div class="d-h-650">...</div>
<div class="d-h-700">...</div>
<div class="d-h-750">...</div>
<div class="d-h-800">...</div>
<div class="d-h-850">...</div>
<div class="d-h-900">...</div>
<div class="d-h-950">...</div>
<div class="d-h-1000">...</div>
<div class="d-h-1050">...</div>
<div class="d-h-1100">...</div>
<div class="d-h-1150">...</div>
<div class="d-h-1200">...</div>
<div class="d-h-1250">...</div>
<div class="d-h-1300">...</div>
<div class="d-h-1350">...</div>
<div class="d-h-1400">...</div>
<div class="d-h-1450">...</div>
<div class="d-h-1500">...</div>
<div class="d-h-1550">...</div>
<div class="d-h-1600">...</div>
```

## Screen

Use `d-h100vh` to have an element cover the user's viewport.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-h-25 d-flow16 d-of-y-scroll" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100vw d-h100vh d-bgc-moderate d-bar4 d-ta-center">Viewport</dt-stack>
</code-well-header>

```html
<div class="d-h100vh d-w100vw">...</div>
```

## Auto

Use `d-h-auto` have the browser calculate and select a height.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-hmn-350 d-flow16" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-auto d-bgc-moderate d-bar4 d-ta-center">Auto</dt-stack>
</code-well-header>

```html
<div class="d-h-auto">...</div>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-h{{ i }}p</th>
          <td class="d-code--sm">block-size: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in layout">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h-{{ i.stop }}</th>
          <td class="d-code--sm">block-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px */</span></td>
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
</clamped-table-wrapper>
