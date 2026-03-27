---
title: Size
description: Utilities to set both width and height simultaneously.
keywords: ["size", "square", "aspect", "both dimensions"]
---

Size utilities set both `inline-size` (width) and `block-size` (height) at once. Useful for icons, avatars, thumbnails, and any element that needs to be square or have matching dimensions.

## Layout stops

Use `d-size-{stop}` to set both width and height using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-size-100` outputs both `inline-size: var(--dt-layout-100)` and `block-size: var(--dt-layout-100)` (64px).

<code-well-header class="d-d-flex d-p-300 d-bgc-secondary d-w100p d-hmx-800 d-flow16 d-of-scroll d-ta-center" v-dt-scrollbar:never custom>
  <dt-stack gap="100" class="d-pls-start" v-for="(i, index) in layout" :key="index">
    <span class="d-code--md">d-size-{{i.stop}}</span>
    <dt-stack direction="row" align="center" justify="center" class="d-bgc-bold d-bar4" :class="`d-size-${i.stop}`"></dt-stack>
  </dt-stack>
</code-well-header>

```html
<div class="d-size-100">...</div>  <!-- 64px square -->
<div class="d-size-200">...</div>  <!-- 128px square -->
<div class="d-size-400">...</div>  <!-- 256px square -->
```

## Percentages

Use `d-size{n}p` to set both width and height to the same percentage. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-size33p` = 33.333% and `d-size66p` = 66.667%.

```html
<div class="d-size50p">...</div>   <!-- 50% width and height -->
<div class="d-size100p">...</div>  <!-- 100% width and height -->
```

## Viewport

Use viewport utilities to size an element relative to the viewport in both dimensions. The dynamic viewport variants adapt to mobile browser chrome changes.

- **dvh/dvw** (dynamic) -- adapts to mobile browser chrome appearing/disappearing.
- **svh/svw** (small) -- minimum viewport size, when mobile browser chrome is visible.
- **lvh/lvw** (large) -- maximum viewport size, when mobile browser chrome is hidden.

```html
<div class="d-size-dvh">...</div>   <!-- inline-size: 100dvw; block-size: 100dvh -->
<div class="d-size-svh">...</div>   <!-- inline-size: 100svw; block-size: 100svh -->
<div class="d-size-lvh">...</div>   <!-- inline-size: 100lvw; block-size: 100lvh -->
```

## Keywords

Use keyword utilities to set both width and height using CSS keyword values.

```html
<div class="d-size-auto">...</div>
<div class="d-size-unset">...</div>
<div class="d-size-fit-content">...</div>
<div class="d-size-max-content">...</div>
<div class="d-size-min-content">...</div>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-size-{{ i.stop }}</th>
          <td class="d-code--sm">inline-size: var(--dt-layout-{{ i.stop }}) !important; block-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px / {{ (i.px / 10).toFixed(1) }}rem */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-size{{ i }}p</th>
          <td class="d-code--sm">inline-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important; block-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-size-dvh</th>
          <td class="d-code--sm">inline-size: 100dvw !important; block-size: 100dvh !important;</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-size-svh</th>
          <td class="d-code--sm">inline-size: 100svw !important; block-size: 100svh !important;</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-size-lvh</th>
          <td class="d-code--sm">inline-size: 100lvw !important; block-size: 100lvh !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in keywords">
          <th scope="row" class="d-code--sm d-docsite-code">.d-size-{{ i }}</th>
          <td class="d-code--sm">inline-size: {{ i }} !important; block-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
