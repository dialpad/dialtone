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

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-g16 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <div v-for="{ class: stop } in relative" class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
    <div class="d-code--sm d-docsite-code">.d-lh-{{stop}}</div>
    <div>
        <p :class="`d-lh-${stop} d-fs-300 d-bgc-purple-200 d-bgo25`">The quick brown fox jumps over the lazy dog.</p>
    </div>
  </div>
</code-well-header>

```html
<p class="d-lh-unset">...</p>
<p class="d-lh-100">...</p>
<p class="d-lh-200">...</p>
<p class="d-lh-300">...</p>
<p class="d-lh-400">...</p>
<p class="d-lh-500">...</p>
<p class="d-lh-600">...</p>
```

## Fixed line-heights

Use `d-lh{n}` to fix an element's line-height. This allows you to target a specific line-height based on the font-size. For example if a target 20px line-height is desired and the current font-size is 14px, apply `.d-lh6` to achieve this target (14px font-size + 6px = 20px target line-height).

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-g16 d-bgc-gold-100 d-w100p d-hmn102" custom>
  <div v-for="{ class: stop } in fixed" class="d-d-grid d-ai-center" style="grid-template-columns: 10rem 1fr">
    <div class="d-code--sm d-fc-gold-300">.d-lh{{stop}}</div>
    <div>
        <p :class="`d-lh${stop} d-fs-300 d-bgc-gold-200 d-bgo25`">The quick brown fox jumps over the lazy dog.</p>
    </div>
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

## CSS variables

<div class="d-h332 d-of-y-scroll d-bb d-bc-black-200">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col">Variable</th>
        <th scope="col">Output</th>
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

## Classes

<div class="d-h332 d-of-y-scroll d-bb d-bc-black-200">
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
</div>

<script setup>
  import { lineHeight } from '@data/type.json';
  const { relative, fixed } = lineHeight;
</script>
