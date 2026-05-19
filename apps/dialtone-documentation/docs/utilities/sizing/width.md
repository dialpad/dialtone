---
title: Width
description: Utilities to control an element's width.
keywords: ["size", "wide", "vw", "viewport width", "inline size", "inline-size"]
---

## Layout stops

Use `d-w-{stop}` to set a fixed width for an element using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-w-100` outputs `inline-size: var(--dt-layout-100)` (64px).

> [!INFO] Scale-indexed vs pixel-indexed stops
> Bare integer stops (`25`, `50`, `100`, …) are scale-indexed on the 64px base — `value_in_px = stop × 64 / 100`, so `25` = 16px and `100` = 64px. Stops with a `px` suffix (`1px`, `2px`, `8px`, `20px`, `24px`) are off-scale exceptions that encode the literal pixel value.

```vue demo
<div v-dt-scrollbar:always class="d-bar-400 d-d-flex d-bgc-secondary d-w100p d-hmx-500 d-ta-center">
  <dt-stack gap="100" align="start">
    <div v-for="(i, index) in layout" v-dt-tooltip="{ message: `${i.px}px`, delay: false }">
      <dt-text kind="code" size="100" class="d-w-100 d-us-all">d-w-{{i.stop}}</dt-text>
      <div class="d-h-100 d-bgc-moderate d-bar-300" :class="`d-w-${i.stop}`"></div>
    </div>
  </dt-stack>
</div>
<!-- @code -->
<div class="d-w-100">...</div>  <!-- inline-size: var(--dt-layout-100) = 64px / 6.4rem -->
<div class="d-w-200">...</div>  <!-- inline-size: var(--dt-layout-200) = 128px / 12.8rem -->
<div class="d-w-400">...</div>  <!-- inline-size: var(--dt-layout-400) = 256px / 25.6rem -->
```

## Percentages

Use `d-w{n}p` to set a percentage width for an element. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-w33p` = 33.333% and `d-w66p` = 66.667%.

```vue demo
<div v-dt-scrollbar:always class="d-bar-400 d-bgc-secondary d-w100p d-hmx-500">
  <div>
    <dt-stack as="div" gap="200" align="center" justify="center" class="d-w100p">
      <div v-for="i in percentage" v-dt-tooltip="{ message: `${i}%`, delay: false }" class="d-bgc-moderate d-w100p">
        <div class="d-bgc-moderate-opaque d-bar-300 d-p-100" :class="`d-w${i}p`">
          <dt-text kind="code" size="100" class="d-us-all">d-w{{i}}p</dt-text>
        </div>
      </div>
    </dt-stack>
  </div>
</div>
<!-- @code -->
<div class="d-w25p">25%</div>
<div class="d-w50p">50%</div>
<div class="d-w75p">75%</div>
<div class="d-w100p">100%</div>
```

## Viewport

Use viewport width utilities to size an element relative to the viewport. `d-w100vw` (no hyphen, literal CSS value) sets `inline-size: 100vw`. The dynamic viewport variants use a hyphen: `d-w-dvw`, `d-w-svw`, `d-w-lvw`.

- **dvw** (dynamic) -- adapts to mobile browser chrome appearing/disappearing.
- **svw** (small) -- minimum viewport size, when mobile browser chrome is visible.
- **lvw** (large) -- maximum viewport size, when mobile browser chrome is hidden.

```vue code-only
<div class="d-w100vw">...</div>   <!-- inline-size: 100vw -->
<div class="d-w-dvw">...</div>    <!-- inline-size: 100dvw -->
<div class="d-w-svw">...</div>    <!-- inline-size: 100svw -->
<div class="d-w-lvw">...</div>    <!-- inline-size: 100lvw -->
```

## Character width

Use `d-w{n}ch` to constrain width based on character count. Useful for limiting text line lengths for readability.

```vue code-only
<div class="d-w60ch">...</div>   <!-- inline-size: 60ch -->
<div class="d-w75ch">...</div>   <!-- inline-size: 75ch -->
<div class="d-w90ch">...</div>   <!-- inline-size: 90ch -->
```

## Keywords

Use keyword utilities to set width using CSS keyword values.

```vue code-only
<div class="d-w-auto">...</div>
<div class="d-w-unset">...</div>
<div class="d-w-fit-content">...</div>
<div class="d-w-max-content">...</div>
<div class="d-w-min-content">...</div>
```

<script setup>
  import { percentage, layout, viewport, characterWidth, keywords } from '@data/width-height.json';
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-w-{{ i.stop }}</th>
          <td class="d-code--sm">inline-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px / {{ (i.px / 10).toFixed(1) }}rem */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w{{ i }}p</th>
          <td class="d-code--sm">inline-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in viewport.width">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w{{ i.includes('vw') ? i : `-${i}` }}</th>
          <td class="d-code--sm">inline-size: {{ i.includes('vw') ? i : `100${i}` }} !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in characterWidth">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w{{ i }}</th>
          <td class="d-code--sm">inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in keywords">
          <th scope="row" class="d-code--sm d-docsite-code">.d-w-{{ i }}</th>
          <td class="d-code--sm">inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
