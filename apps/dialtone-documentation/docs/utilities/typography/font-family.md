---
title: Font Family
description: Utilities to change an element's font-family.
keywords: ["typeface", "sans serif", "monospace"]
---

> [!WARNING] Use DtText over CSS Utilities
> Reach for the [DtText](/components/text) component before considering any typography utility.

## Sans-Serif

Use `d-ff-sans` to apply a Sans-Serif font stack.

```vue demo
<p class="d-ff-sans">The quick brown fox jumps over the lazy dog.</p>
```

## Mono

Use `d-ff-mono` to apply a Monospace font stack.

```vue demo
<p class="d-ff-mono">The quick brown fox jumps over the lazy dog.</p>
```

## Marketing

Dialtone supports select marketing fonts and weights. Use the following combinations to apply the marketing font stack.

```vue demo
<p class="d-ff-marketing">The quick brown fox jumps over the lazy dog.</p>
```

<script setup>
  import { fontFamily } from '@data/type.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## CSS Variables

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-default d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w40p"><div class="d-p-200 d-bb d-bbw1">Variable</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ var: varName, output } in fontFamily.slice(0, -1)">
          <td class="d-code--sm d-docsite-code">var(--ff-{{ varName }})</td>
          <td class="d-code--sm">{{ output }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Classes

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-default d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w40p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ var: varName, output } in fontFamily">
          <td class="d-code--sm d-docsite-code">.d-ff-{{ varName }}</td>
          <td class="d-code--sm">font-family: {{ output }} !important;</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>
