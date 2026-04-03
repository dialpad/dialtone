---
title: Min-height
description: Utilities to control an element's minimum height.
keywords: ["minimum height", "mnh"]
---

## Layout stops

Use `d-hmn-{stop}` to set a fixed minimum height for an element using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-hmn-100` outputs `min-block-size: var(--dt-layout-100)` (64px). This can be combined with `d-h{n}p` and `d-hmx-{stop}` to have an element fill a certain height range.

```vue demo
<dt-stack direction="row" gap="200" align="start" justify="center" class="d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-h-75 d-hmn-100 d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-h-75 d-hmn-150 d-bgc-moderate d-bar4 d-ta-center">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-hmn-500 d-bgc-moderate d-bar4 d-ta-center">3</dt-stack>
</dt-stack>
<!-- @code -->
<div class="d-hmn-100">...</div>  <!-- min-block-size: var(--dt-layout-100) = 64px / 6.4rem -->
<div class="d-hmn-150">...</div>  <!-- min-block-size: var(--dt-layout-150) = 96px / 9.6rem -->
<div class="d-hmn-500">...</div>  <!-- min-block-size: var(--dt-layout-500) = 320px / 32rem -->
```

## Percentages

Use `d-hmn{n}p` to set a minimum height percentage for an element. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-hmn33p` = 33.333% and `d-hmn66p` = 66.667%.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200" align="start" justify="center" class="d-w100p d-h-400">
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-hmn33p d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-hmn66p d-bgc-moderate d-bar4 d-ta-center">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w-100 d-hmn100p d-bgc-moderate d-bar4 d-ta-center">3</dt-stack>
</dt-stack>
<!-- @code -->
<div class="d-hmn33p">...</div>  <!-- min-block-size: 33.333% -->
<div class="d-hmn66p">...</div>  <!-- min-block-size: 66.667% -->
<div class="d-hmn100p">...</div> <!-- min-block-size: 100% -->
```

## Keywords

Use keyword utilities to set minimum height using CSS keyword values.

```vue code-only
<div class="d-hmn-auto">...</div>
<div class="d-hmn-unset">...</div>
<div class="d-hmn-fit-content">...</div>
<div class="d-hmn-max-content">...</div>
<div class="d-hmn-min-content">...</div>
```

<script setup>
  import { percentage, layout, keywords } from '@data/width-height.json';
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmn-{{ i.stop }}</th>
          <td class="d-code--sm">min-block-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px / {{ (i.px / 10).toFixed(1) }}rem */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmn{{ i }}p</th>
          <td class="d-code--sm">min-block-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in keywords">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmn-{{ i }}</th>
          <td class="d-code--sm">min-block-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
