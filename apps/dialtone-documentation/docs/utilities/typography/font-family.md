---
title: Font Family
description: Utilities to change an element's font-family.
---

<FontUtilitiesNotice />

## Sans-Serif

Use `d-ff-sans` to apply a Sans-Serif font stack.

<code-well-header>
  <p class="d-ff-sans">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-ff-sans">...</p>
```

## Mono

Use `d-ff-mono` to apply a Monospace font stack.

<code-well-header>
  <p class="d-ff-mono">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-ff-mono">...</p>
```

## Marketing

Dialtone supports select marketing fonts and weights. Use the following combinations to apply the marketing font stack.

<code-well-header>
  <p class="d-ff-marketing">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-ff-marketing">...</p>
```

<script setup>
  import { fontFamily } from '@data/type.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
  import FontUtilitiesNotice from '@baseComponents/FontUtilitiesNotice.vue';
</script>

## CSS Variables

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w40p"><div class="d-p16 d-bb d-bbw1">Variable</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bbw1">Output</div></th>
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
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w40p"><div class="d-p16 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bbw1">Output</div></th>
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
