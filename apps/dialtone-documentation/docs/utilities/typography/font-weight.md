---
title: Font Weight
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

## Usage

Use `d-fw-{n}` to change an element's font-weight.

<code-well-header>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 11rem 1fr">
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-fw-normal</div>
    <div><p class="d-fw-normal">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-fw-medium</div>
    <div><p class="d-fw-medium">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-fw-semibold</div>
    <div><p class="d-fw-semibold">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-fw-bold</div>
    <div><p class="d-fw-bold">The quick brown fox jumps over the lazy dog.</p></div>
  </div>
</code-well-header>

```html
<p class="d-fw-normal">...</p>
<p class="d-fw-medium">...</p>
<p class="d-fw-semibold">...</p>
<p class="d-fw-bold">...</p>
```

## Variables

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
              <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Variable</div></th>
              <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="{ name, output } in weight">
          <th scope="row" class="d-code--sm d-docsite-code">var(--dt-font-weight-{{ name }})</th>
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
      <tr v-for="{ name, class: className, output } in weight">
        <th scope="row" class="d-code--sm d-docsite-code">
          .d-fw-{{ className }}
        </th>
        <td class="d-code--sm">
          font-weight: var(--dt-font-weight-{{ name }}) !important;
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { weight } from '@data/type.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>
