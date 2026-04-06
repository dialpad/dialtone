---
title: Line Height
description: Utilities to change an element's line-height.
keywords: ["leading", "line spacing"]
---

<FontUtilitiesNotice />

## Relative Line-Heights

Use `d-lh-{n}` to change an element's line-height relatively. This means no unit is set with the line-height. Instead the line-height value is a multiple of the font-size.

```vue demo
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh-unset</div>
  <p class="d-lh-unset d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh-100</div>
  <p class="d-lh-100 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh-200</div>
  <p class="d-lh-200 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh-300</div>
  <p class="d-lh-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh-400</div>
  <p class="d-lh-400 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh-500</div>
  <p class="d-lh-500 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh-600</div>
  <p class="d-lh-600 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
</div>
<!-- @code -->
<p class="d-lh-{stop}">...</p>
```

## Fixed Line-Heights

Use `d-lh{n}` to fix an element's line-height. This allows you to target a specific line-height based on the font-size. For example if a target 20px line-height is desired and the current font-size is 14px, apply `.d-lh6` to achieve this target (14px font-size + 6px = 20px target line-height).

```vue demo
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh0</div>
  <div>
      <p class="d-lh0 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh1</div>
  <div>
      <p class="d-lh1 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh2</div>
  <div>
      <p class="d-lh2 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh4</div>
  <div>
      <p class="d-lh4 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh6</div>
  <div>
      <p class="d-lh6 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh8</div>
  <div>
      <p class="d-lh8 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh12</div>
  <div>
      <p class="d-lh12 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh16</div>
  <div>
      <p class="d-lh16 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh20</div>
  <div>
      <p class="d-lh20 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<div class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
  <div class="d-code--sm d-docsite-code">.d-lh24</div>
  <div>
      <p class="d-lh24 d-fs-300 d-bgc-moderate">The quick brown fox jumps over the lazy dog.</p>
  </div>
</div>
<!-- @code -->
<p class="d-lh{stop}">...</p>
```

## CSS Variables

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Variable</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ class: className, output } in relative.slice(1)">
          <th scope="row" class="d-code--sm d-docsite-code">
            var(--dt-font-line-height-{{ className }})
          </th>
          <td class="d-code--sm">{{ output }}</td>
        </tr>
        <tr v-for="{ class: className, output } in fixed">
          <th scope="row" class="d-code--sm d-docsite-code">
            var(--lh{{ className }})
          </th>
          <td class="d-code--sm">{{ output }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in relative">
        <th scope="row" class="d-code--sm d-docsite-code">
          .d-lh-{{ className }}
        </th>
        <td class="d-code--sm">
          <span v-if="className !== 'unset'">
              line-height: var(--dt-font-line-height-{{ className }}) !important;
          </span>
          <span v-else>
              {{ output }}
          </span>
        </td>
      </tr>
      <tr v-for="{ class: className, output } in fixed">
        <th scope="row" class="d-code--sm d-docsite-code">
          .d-lh{{ className }}
        </th>
        <td class="d-code--sm">
          line-height: var(--lh{{ className }}) !important;
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { lineHeight } from '@data/type.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
  import FontUtilitiesNotice from '@baseComponents/FontUtilitiesNotice.vue';
  const { relative, fixed } = lineHeight;
</script>
