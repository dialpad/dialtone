---
title: Font weight
description: Utilities to change an element's font-weight.
---

<dt-notice
  kind="warning"
  :hideClose="true"
  class="d-wmx100p"
>
  <template #default>
    <p class="d-body--md-compact">Before applying a typography utility, first consider using <router-link class="d-fw-semibold d-link d-link--muted" to="/design/typography/">Dialtone's text styles</router-link> that bundles Font family, Font weight, Font size, and Line height together.</p>
  </template>
</dt-notice>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ name, output } in weight">
        <th scope="row" class="d-code--sm d-fc-purple-400">
          .d-fw-{{ name }}
        </th>
        <td class="d-code--sm">
          font-weight: var(--fw-{{ name }}) !important;
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

## Usage

Use `d-fw-{n}` to change an element's font-weight.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 10rem 1fr">
    <div class="d-code--sm d-fc-purple-400">.d-fw-normal</div>
    <div><p class="d-fs-300 d-fw-normal">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400">.d-fw-medium</div>
    <div><p class="d-fs-300 d-fw-medium">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400">.d-fw-semibold</div>
    <div><p class="d-fs-300 d-fw-semibold">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400">.d-fw-bold</div>
    <div><p class="d-fs-300 d-fw-bold">The quick brown fox jumps over the lazy dog.</p></div>
  </div>
</code-well-header>

```html
<p class="d-fw-normal">...</p>
<p class="d-fw-medium">...</p>
<p class="d-fw-semibold">...</p>
<p class="d-fw-bold">...</p>
```

<script setup>
  import { weight } from '@data/type.json';
</script>

## Variables

<table class="d-table dialtone-doc-table">
  <thead>
      <tr>
          <th scope="col" class="d-w25p">Variable</th>
          <th scope="col">Output</th>
      </tr>
  </thead>
  <tbody>
    <tr v-for="{ name, output } in weight">
      <th scope="row" class="d-code--sm d-fc-purple-400">var(--fw-{{ name }})</th>
      <td class="d-code--sm">{{ output }}</td>
    </tr>
  </tbody>
</table>
