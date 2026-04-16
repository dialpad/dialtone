---
title: Max-height
description: Utilities to control an element's maximum height.
keywords: ["maximum height", "mxh", "max block size", "max block-size"]
---

## Layout stops

Use `d-hmx-{stop}` to set a fixed maximum height for an element using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-hmx-100` outputs `max-block-size: var(--dt-layout-100)` (64px). This can be combined with `d-h{n}p` and `d-hmn-{stop}` to have an element fill a certain height range.

> [!INFO] Scale-indexed vs pixel-indexed stops
> Bare integer stops (`25`, `50`, `100`, …) are scale-indexed on the 64px base — `value_in_px = stop × 64 / 100`, so `25` = 16px and `100` = 64px. Stops with a `px` suffix (`1px`, `2px`, `8px`, `20px`, `24px`) are off-scale exceptions that encode the literal pixel value, for hairlines and tight gutters that don't fit the 16px-step scale.

```vue demo
<dt-stack direction="row" gap="200" align="start" justify="center" class="d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-100 d-hmx100p d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-200 d-hmx200p d-bgc-moderate d-bar4 d-ta-center">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-400 d-hmx400p d-bgc-moderate d-bar4 d-ta-center">3</dt-stack>
</dt-stack>
<!-- @code -->
<div class="d-hmx-100">...</div>  <!-- max-block-size: var(--dt-layout-100) = 64px / 6.4rem -->
<div class="d-hmx-200">...</div>  <!-- max-block-size: var(--dt-layout-200) = 128px / 12.8rem -->
<div class="d-hmx-400">...</div>  <!-- max-block-size: var(--dt-layout-400) = 256px / 25.6rem -->
```

## Percentages

Use `d-hmx{n}p` to set a maximum height percentage for an element. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-hmx33p` = 33.333% and `d-hmx66p` = 66.667%.

```vue code-only
<div class="d-h-350">
  <div class="d-h-100 d-hmx50p">1</div>
</div>
```

## Keywords

Use keyword utilities to set maximum height using CSS keyword values.

```vue code-only
<div class="d-hmx-auto">...</div>
<div class="d-hmx-unset">...</div>
<div class="d-hmx-fit-content">...</div>
<div class="d-hmx-max-content">...</div>
<div class="d-hmx-min-content">...</div>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx-{{ i.stop }}</th>
          <td class="d-code--sm">max-block-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px / {{ (i.px / 10).toFixed(1) }}rem */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx{{ i }}p</th>
          <td class="d-code--sm">max-block-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in keywords">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx-{{ i }}</th>
          <td class="d-code--sm">max-block-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
