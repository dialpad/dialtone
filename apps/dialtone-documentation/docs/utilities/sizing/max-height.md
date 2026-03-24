---
title: Max-height
description: Utilities to control an element's maximum height.
keywords: ["maximum height", "mxh"]
---

## Example

Use `d-hmx{n}p` or `d-hmx-{stop}` to set a maximum height for an element. This can be combined with `d-h{n}p` and `d-hmn-{stop}` to have an element fill a certain height range.

<code-well-header class="d-d-flex d-jc-center d-p-300 d-bgc-secondary d-w100p d-hmx-350" custom>
  <dt-stack direction="row" align="center" justify="center" class="d-py-200 d-px-100 d-w100p d-h-100 d-hmx100p d-bgc-moderate d-bar4 d-ta-center">1</dt-stack>
</code-well-header>

```html
<div class="d-h-350">
    <div class="d-h-100 d-hmx50p">1</div>
</div>
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
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx{{ i }}p</th>
          <td class="d-code--sm">max-block-size: {{ i }}% !important;</td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in layout">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx-{{ i.stop }}</th>
          <td class="d-code--sm">max-block-size: var(--dt-layout-{{ i.stop }}) !important; <span class="d-fc-tertiary">/* {{ i.px }}px */</span></td>
        </tr>
      </tbody>
      <tbody>
        <tr v-for="i in other">
          <th scope="row" class="d-code--sm d-docsite-code">.d-hmx-{{ i }}</th>
          <td class="d-code--sm">max-block-size: {{ i }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
