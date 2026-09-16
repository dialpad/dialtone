---
title: Min-width
description: Utilities to control an element's minimum width.
keywords: ["minimum width", "mnw", "min inline size", "min inline-size"]
---

## Layout stops

Use `d-wmn-{stop}` to set a fixed minimum width for an element using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-wmn-100` outputs `min-inline-size: var(--dt-layout-100)` (64px). This can be combined with `d-w{n}p` and `d-wmx-{stop}` to have an element fill a certain width range.

> [!INFO] Scale-indexed vs pixel-indexed stops
> Bare integer stops (`25`, `50`, `100`, …) are scale-indexed on the 64px base — `value_in_px = stop × 64 / 100`, so `25` = 16px and `100` = 64px. Stops with a `px` suffix (`1px`, `2px`, `8px`, `20px`, `24px`) are off-scale exceptions that encode the literal pixel value.

```vue demo
<dt-stack direction="row" justify="center" gap="200" class="d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-size-100 d-wmn-100 d-bgc-moderate d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-size-100 d-wmn-150 d-bgc-moderate d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-size-100 d-wmn-500 d-bgc-moderate d-bar-300">3</dt-stack>
</dt-stack>
<!-- @code -->
<div class="d-wmn-100">1</div>
<div class="d-wmn-150">2</div>
<div class="d-wmn-500">3</div>
```

## Percentages

Use `d-wmn{n}p` to set a minimum width percentage for an element. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-wmn33p` = 33.333% and `d-wmn66p` = 66.667%.

```vue demo code-only
<div class="d-wmn-50p">1</div>
<div class="d-wmn-75p">2</div>
<div class="d-wmn-100p">3</div>
```

## Character width

Use `d-wmn{n}ch` to set a minimum width based on character count. Useful for ensuring text containers maintain a minimum readable width.

```vue code-only
<div class="d-wmn60ch">...</div>   <!-- min-inline-size: 60ch -->
<div class="d-wmn75ch">...</div>   <!-- min-inline-size: 75ch -->
<div class="d-wmn90ch">...</div>   <!-- min-inline-size: 90ch -->
```

## Keywords

Use keyword utilities to set minimum width using CSS keyword values.

```vue code-only
<div class="d-wmn-auto">...</div>
<div class="d-wmn-unset">...</div>
<div class="d-wmn-fit-content">...</div>
<div class="d-wmn-max-content">...</div>
<div class="d-wmn-min-content">...</div>
```

<script setup>
  import { percentage, layout, characterWidth, keywords } from '@data/width-height.json';
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmn-{{ i.stop }}</th>
          <td class="d-code--sm">min-inline-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px / {{ (i.px / 10).toFixed(1) }}rem */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmn{{ i }}p</th>
          <td class="d-code--sm">min-inline-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in characterWidth">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmn{{ i }}</th>
          <td class="d-code--sm">min-inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in keywords">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmn-{{ i }}</th>
          <td class="d-code--sm">min-inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
