---
title: Height
description: Utilities to control an element's height.
keywords: ["size", "tall", "vh", "viewport height", "block size", "block-size"]
---

## Layout stops

Use `d-h-{stop}` to set a fixed height for an element using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-h-100` outputs `block-size: var(--dt-layout-100)` (64px).

<code-well-header class="d-d-flex d-p-300 d-bgc-secondary d-w100p d-hmx-800 d-flow16 d-of-scroll d-ta-center" v-dt-scrollbar:never custom>
  <dt-stack gap="100" class="d-pls-start" v-for="(i, index) in layout" :key="index">
    <span class="d-code--md">d-h-{{i.stop}}</span>
    <dt-stack direction="row" align="center" justify="center" class="d-w-100 d-bgc-bold d-bar4" :class="`d-h-${i.stop}`"></dt-stack>
  </dt-stack>
</code-well-header>

```html
<div class="d-h-100">...</div>  <!-- block-size: var(--dt-layout-100) = 64px / 6.4rem -->
<div class="d-h-200">...</div>  <!-- block-size: var(--dt-layout-200) = 128px / 12.8rem -->
<div class="d-h-400">...</div>  <!-- block-size: var(--dt-layout-400) = 256px / 25.6rem -->
```

## Percentages

Use `d-h{n}p` to set a percentage height for an element. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-h33p` = 33.333% and `d-h66p` = 66.667%.

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
  <div class="d-h25p">25%</div>
  <div class="d-h50p">50%</div>
  <div class="d-h75p">75%</div>
  <div class="d-h100p">100%</div>
</div>
```

## Viewport

Use viewport height utilities to size an element relative to the viewport. `d-h100vh` (no hyphen, literal CSS value) sets `block-size: 100vh`. The dynamic viewport variants use a hyphen: `d-h-dvh`, `d-h-svh`, `d-h-lvh`.

- **dvh** (dynamic) -- adapts to mobile browser chrome appearing/disappearing.
- **svh** (small) -- minimum viewport size, when mobile browser chrome is visible.
- **lvh** (large) -- maximum viewport size, when mobile browser chrome is hidden.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-h-25 d-flow16 d-of-y-scroll" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100vw d-h100vh d-bgc-moderate d-bar4 d-ta-center">Viewport</dt-stack>
</code-well-header>

```html
<div class="d-h100vh">...</div>   <!-- block-size: 100vh -->
<div class="d-h-dvh">...</div>    <!-- block-size: 100dvh -->
<div class="d-h-svh">...</div>    <!-- block-size: 100svh -->
<div class="d-h-lvh">...</div>    <!-- block-size: 100lvh -->
```

## Keywords

Use keyword utilities to set height using CSS keyword values.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-hmn-350 d-flow16" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-auto d-bgc-moderate d-bar4 d-ta-center">auto</dt-stack>
</code-well-header>

```html
<div class="d-h-auto">...</div>
<div class="d-h-unset">...</div>
<div class="d-h-fit-content">...</div>
<div class="d-h-max-content">...</div>
<div class="d-h-min-content">...</div>
```

<script setup>
  import { percentage, layout, viewport, keywords } from '@data/width-height.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Classes

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w30p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in layout">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h-{{ i.stop }}</th>
          <td class="d-code--sm">block-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px / {{ (i.px / 10).toFixed(1) }}rem */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h{{ i }}p</th>
          <td class="d-code--sm">block-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in viewport.height">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h{{ i.includes('vh') ? i : `-${i}` }}</th>
          <td class="d-code--sm">block-size: {{ i.includes('vh') ? i : `100${i}` }} !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in keywords">
          <th scope="row" class="d-code--sm d-docsite-code">.d-h-{{ i }}</th>
          <td class="d-code--sm">block-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
