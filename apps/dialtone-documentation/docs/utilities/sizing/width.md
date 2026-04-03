---
title: Width
description: Utilities to control an element's width.
keywords: ["size", "wide", "vw", "viewport width"]
---

## Layout stops

Use `d-w-{stop}` to set a fixed width for an element using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-w-100` outputs `inline-size: var(--dt-layout-100)` (64px).

```vue demo
<!-- @custom -->
<!-- @class d-d-flex d-fd-column d-p-300 d-bgc-secondary d-w100p d-hmx-500 d-stack16 d-ta-center d-of-scroll -->
<div v-dt-scrollbar:never>
  <dt-stack direction="row" align="center" class="d-pls-start" v-for="(i, index) in layout">
    <span class="d-w-100">d-w-{{i.stop}}</span>
    <div class="d-h-100 d-bgc-moderate d-bar4" :class="`d-w-${i.stop}`"></div>
  </dt-stack>
</div>
```

## Percentages

Use `d-w{n}p` to set a percentage width for an element. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-w33p` = 33.333% and `d-w66p` = 66.667%.

```vue demo
<!-- @custom -->
<!-- @class d-d-flex d-fd-column d-p-300 d-bgc-secondary d-w100p d-hmx-500 d-stack16 d-code--md d-ta-center d-of-y-scroll -->
<div v-dt-scrollbar:never>
  <dt-stack direction="row" align="center" justify="center" class="d-ps-relative" v-for="i in percentage">
    <dt-stack as="span" direction="row" align="center" class="d-zi-active d-h-100">d-w{{i}}p</dt-stack>
    <div class="d-w100p d-h-100 d-ps-absolute d-bgc-moderate">
      <div class="d-h-100 d-bgc-moderate-opaque d-bar4" :class="`d-w${i}p`"></div>
    </div>
  </dt-stack>
</div>
```

## Viewport

Use viewport width utilities to size an element relative to the viewport. `d-w100vw` (no hyphen, literal CSS value) sets `inline-size: 100vw`. The dynamic viewport variants use a hyphen: `d-w-dvw`, `d-w-svw`, `d-w-lvw`.

- **dvw** (dynamic) -- adapts to mobile browser chrome appearing/disappearing.
- **svw** (small) -- minimum viewport size, when mobile browser chrome is visible.
- **lvw** (large) -- maximum viewport size, when mobile browser chrome is hidden.

```vue demo
<!-- @custom -->
<!-- @class d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-h-25 d-stack16 d-of-y-scroll -->
<dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100vw d-h100vh d-bgc-moderate d-bar4 d-ta-center">Viewport</dt-stack>
```

## Character width

Use `d-w{n}ch` to constrain width based on character count. Useful for limiting text line lengths for readability.

```html
<div class="d-w60ch">...</div>   <!-- inline-size: 60ch -->
<div class="d-w75ch">...</div>   <!-- inline-size: 75ch -->
<div class="d-w90ch">...</div>   <!-- inline-size: 90ch -->
```

## Keywords

Use keyword utilities to set width using CSS keyword values.

```vue demo
<!-- @custom -->
<!-- @class d-ps-relative d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-hmn-150 d-stack16 -->
<dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-h-100 d-w-auto d-bgc-moderate d-bar4 d-ta-center">auto</dt-stack>
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
