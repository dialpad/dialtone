---
title: Font Size
description: Utilities to change an element's font-size.
keywords: ["text size", "type size", "type scale"]
---

> [!WARNING] Use DtText over CSS Utilities
> Reach for the [DtText](/components/text) component before considering any typography utility.

## Usage

```vue demo
<div class="d-d-grid d-g-200 d-ai-baseline" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">d-fs-50</div><div><p class="d-lc-1 d-fs-50">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-75</div><div><p class="d-lc-1 d-fs-75">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-100</div><div><p class="d-lc-1 d-fs-100">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-125</div><div><p class="d-lc-1 d-fs-125">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-150</div><div><p class="d-lc-1 d-fs-150">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-200</div><div><p class="d-lc-1 d-fs-200">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-250</div><div><p class="d-lc-1 d-fs-250">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-300</div><div><p class="d-lc-1 d-fs-300">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-350</div><div><p class="d-lc-1 d-fs-350">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-400</div><div><p class="d-lc-1 d-fs-400">The quick brown fox jumps over the lazy dog.</p></div>
  <div class="d-code--sm d-docsite-code">d-fs-500</div><div><p class="d-lc-1 d-fs-500">The quick brown fox jumps over the lazy dog.</p></div>
</div>
<!-- @code -->
<p class="d-fs-{stop}">...</p>
```

<script setup>
  import { fontSize } from '@data/type.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Classes by Platform

### Product

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w10p"><div class="d-p-200 d-bb d-bbw1">Size</div></th>
          <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ stop, size, output } in fontSize.product">
          <th scope="row">{{ size }}px</th>
          <td class="d-code--sm d-docsite-code">.d-fs-{{ stop }}</td>
          <td>
            <dt-stack direction="row" justify="between" align="center">
              <div class="d-fl1 d-code--sm">
                font-size: {{ output }}rem !important;
              </div>
              <div class="d-fl0 d-lh4" :class="`d-fs-${stop}`">
                Aa
              </div>
            </dt-stack>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

### Mobile

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w10p"><div class="d-p-200 d-bb d-bbw1">Size</div></th>
          <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ stop, size, output } in fontSize.mobile">
          <th scope="row">{{ size }}px</th>
          <td class="d-code--sm d-docsite-code">.d-fs-{{ stop }}-mobile</td>
          <td>
            <dt-stack direction="row" justify="between" align="center">
              <div class="d-fl1 d-code--sm">
                font-size: {{ output }}rem !important;
              </div>
              <div class="d-fl0 d-lh4" :class="`d-fs-${stop}-mobile`">
                Aa
              </div>
            </dt-stack>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

### TC8

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w10p"><div class="d-p-200 d-bb d-bbw1">Size</div></th>
          <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ stop, size, output } in fontSize.tc8">
          <th scope="row">{{ size }}px</th>
          <td class="d-code--sm d-docsite-code">.d-fs-{{ stop }}-tc8</td>
          <td>
            <dt-stack direction="row" justify="between" align="center">
              <div class="d-fl1 d-code--sm">
                font-size: {{ output }}rem !important;
              </div>
              <div class="d-fl0 d-lh4" :class="`d-fs-${stop}-tc8`">
                Aa
              </div>
            </dt-stack>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

### TV

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w10p"><div class="d-p-200 d-bb d-bbw1">Size</div></th>
          <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ stop, size, output } in fontSize.tv">
          <th scope="row">{{ size }}px</th>
          <td class="d-code--sm d-docsite-code">.d-fs-{{ stop }}-tv</td>
          <td>
            <dt-stack direction="row" justify="between" align="center">
              <div class="d-fl1 d-code--sm">
                font-size: {{ output }}rem !important;
              </div>
              <div class="d-fl0 d-lh4" :class="`d-fs-${stop}-tv`">
                Aa
              </div>
            </dt-stack>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
