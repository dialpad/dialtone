---
title: Line height
description: Utilities to change an element's line-height.
---

<dt-notice
  kind="warning"
  :hideClose="true"
  class="d-wmx100p"
>
  <template #default>
    <p class="d-body--md-compact">Before applying a typography utility, first consider using <router-link class="d-fw-bold d-link d-link--muted" to="/design/typography/">Dialtone's text styles</router-link> that bundles Font family, Font weight, Font size, and Line height together.</p>
  </template>
</dt-notice>

## Relative line-heights

Use `d-lh-{n}` to change an element's line-height relatively. This means no unit is set with the line-height. Instead the line-height value is a multiple of the font-size.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 10rem 1fr">
    <div class="d-code--sm d-fc-purple-400 d-fco75">.d-lh-100</div>
    <div><p class="d-fs-300 d-lh-100 d-bgc-purple-200 d-bgo25">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400 d-fco75">.d-lh-200</div>
    <div><p class="d-fs-300 d-lh-200 d-bgc-purple-200 d-bgo25">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400 d-fco75">.d-lh-300</div>
    <div><p class="d-fs-300 d-lh-300 d-bgc-purple-200 d-bgo25">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400 d-fco75">.d-lh-400</div>
    <div><p class="d-fs-300 d-lh-400 d-bgc-purple-200 d-bgo25">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400 d-fco75">.d-lh-500</div>
    <div><p class="d-fs-300 d-lh-500 d-bgc-purple-200 d-bgo25">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400 d-fco75">.d-lh-600</div>
    <div><p class="d-fs-300 d-lh-600 d-bgc-purple-200 d-bgo25">The quick brown fox jumps over the lazy dog.</p></div>
  </div>
</code-well-header>

```html
<p class="d-lh-100">...</p>
<p class="d-lh-200">...</p>
<p class="d-lh-300">...</p>
<p class="d-lh-400">...</p>
<p class="d-lh-500">...</p>
<p class="d-lh-600">...</p>
```

## Fixed line-heights

Use `d-lh{n}` to fix an element's line-height. This allows you to target a specific line-height based on the font-size. For example if a target 20px line-height is desired and the current font-size is 14px, apply `.d-lh6` to achieve this target (14px font-size + 6px = 20px target line-height).

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-gold-100 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 10rem 1fr">
    <div class="d-code--sm d-fc-gold-300">.d-lh0</div>
    <div><p class="d-fs-300 d-lh0 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh1</div>
    <div><p class="d-fs-300 d-lh1 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh2</div>
    <div><p class="d-fs-300 d-lh2 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh4</div>
    <div><p class="d-fs-300 d-lh4 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh6</div>
    <div><p class="d-fs-300 d-lh6 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh8</div>
    <div><p class="d-fs-300 d-lh8 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh12</div>
    <div><p class="d-fs-300 d-lh12 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh16</div>
    <div><p class="d-fs-300 d-lh16 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh20</div>
    <div><p class="d-fs-300 d-lh20 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-gold-300">.d-lh24</div>
    <div><p class="d-fs-300 d-lh24 d-fc-gold-500 d-bgc-gold-100 d-bgo50">The quick brown fox jumps over the lazy dog.</p></div>
  </div>
</code-well-header>

```html
<p class="d-lh0">...</p>
<p class="d-lh1">...</p>
<p class="d-lh2">...</p>
<p class="d-lh4">...</p>
<p class="d-lh6">...</p>
<p class="d-lh8">...</p>
<p class="d-lh12">...</p>
<p class="d-lh16">...</p>
<p class="d-lh20">...</p>
<p class="d-lh24">...</p>
```

<script setup>
  import { lineHeight } from '@data/type.json';
</script>

## CSS variables

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w25p">Variable</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ class: className, output } in lineHeight.slice(0, -1)">
        <th scope="row" class="d-code--sm d-fc-purple-400">
          var(--dt-font-line-height{{ className }})
        </th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </table>
</div>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr v-for="{ class: className, output } in lineHeight.slice(0, -1)">
          <th scope="row" class="d-code--sm d-fc-purple-400">
            .d-lh{{ className }}
          </th>
          <td class="d-code--sm">
            line-height: var(--lh{{ className }}) !important;
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
