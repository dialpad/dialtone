---
title: Max-width
description: Utilities to control an element's maximum width.
keywords: ["maximum width", "mxw"]
---

## Layout stops

Use `d-wmx-{stop}` to set a fixed maximum width for an element using layout token stops. The hyphen before the number indicates a layout token reference, e.g. `d-wmx-100` outputs `max-inline-size: var(--dt-layout-100)` (64px). This can be combined with `d-w{n}p` and `d-wmn-{stop}` to have an element fill a certain width range.

```vue demo
<!-- @custom -->
<!-- @class d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-flow16 d-of-y-scroll -->
<dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-100 d-wmx-100 d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
<dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-100 d-wmx-150 d-bgc-moderate d-bar4 d-ta-center">2</dt-stack>
<dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-100 d-wmx-500 d-bgc-moderate d-bar4 d-ta-center">3</dt-stack>
```

## Percentages

Use `d-wmx{n}p` to set a maximum width percentage for an element. No hyphen before the number, `p` suffix indicates a literal percentage value. Note: `d-wmx33p` = 33.333% and `d-wmx66p` = 66.667%.

```vue demo
<!-- @custom -->
<!-- @class d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-flow16 -->
<dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-wmx50p d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
```

## Character width

Use `d-wmx{n}ch` to set a maximum width based on character count. Useful for limiting text line lengths for optimal readability.

```html
<div class="d-wmx60ch">...</div>   <!-- max-inline-size: 60ch -->
<div class="d-wmx75ch">...</div>   <!-- max-inline-size: 75ch -->
<div class="d-wmx90ch">...</div>   <!-- max-inline-size: 90ch -->
```

## Keywords

Use keyword utilities to set maximum width using CSS keyword values.

```html
<div class="d-wmx-auto">...</div>
<div class="d-wmx-unset">...</div>
<div class="d-wmx-fit-content">...</div>
<div class="d-wmx-max-content">...</div>
<div class="d-wmx-min-content">...</div>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmx-{{ i.stop }}</th>
          <td class="d-code--sm">max-inline-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px / {{ (i.px / 10).toFixed(1) }}rem */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in percentage">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmx{{ i }}p</th>
          <td class="d-code--sm">max-inline-size: {{ i === 33 ? '33.333' : i === 66 ? '66.667' : i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in characterWidth">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmx{{ i }}</th>
          <td class="d-code--sm">max-inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in keywords">
          <th scope="row" class="d-code--sm d-docsite-code">.d-wmx-{{ i }}</th>
          <td class="d-code--sm">max-inline-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
