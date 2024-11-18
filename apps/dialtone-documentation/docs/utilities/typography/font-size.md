---
title: Font size
description: Utilities to change an element's font-size.
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

## Usage

Use `d-{fs|headline}-{stop}` to change an element's font-size in the product or `d-{fs|headline}-{stop}-{platform}` to
change in other platforms (mobile, tc8, tv).

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 10rem 1fr">
    <div class="d-code--sm d-fc-purple-400">.d-fs-100</div>
    <div><p class="d-fs-100">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400">.d-fs-200</div>
    <div><p class="d-fs-200">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400">.d-fs-300</div>
    <div><p class="d-fs-300">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400">.d-fs-400</div>
    <div><p class="d-fs-400">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-fc-purple-400">.d-fs-500</div>
    <div><p class="d-fs-500">The quick brown fox jumps over the lazy dog.</p></div>
  </div>
</code-well-header>

```html
<p class="d-fs-100">...</p>
<p class="d-fs-200">...</p>
<p class="d-fs-300">...</p>
<p class="d-fs-400">...</p>
<p class="d-fs-500">...</p>
```

<script setup>
  import { fontSize } from '@data/type.json';
</script>

## Classes by platform

### Product

<div class="d-hmx464 d-of-y-auto d-bb d-bc-default">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w10p">Size</th>
        <th scope="col" class="d-w20p">Class</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ stop, size, output } in fontSize.product">
        <th scope="row">{{ size }}px</th>
        <td class="d-code--sm d-fc-purple-400">.d-fs-{{ stop }}</td>
        <td>
          <div class="d-d-flex d-jc-space-between d-ai-center">
            <div class="d-fl1 d-code--sm">
              font-size: {{ output }}rem !important;
            </div>
            <div class="d-fl0 d-lh4" :class="`d-fs-${stop}`">
              Aa
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Mobile

<div class="d-hmx464 d-of-y-auto d-bb d-bc-default">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w10p">Size</th>
        <th scope="col" class="d-w20p">Class</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ stop, size, output } in fontSize.mobile">
        <th scope="row">{{ size }}px</th>
        <td class="d-code--sm d-fc-purple-400">.d-fs-{{ stop }}-mobile</td>
        <td>
          <div class="d-d-flex d-jc-space-between d-ai-center">
            <div class="d-fl1 d-code--sm">
              font-size: {{ output }}rem !important;
            </div>
            <div class="d-fl0 d-lh4" :class="`d-fs-${stop}-mobile`">
              Aa
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### TC8

<div class="d-hmx464 d-of-y-auto d-bb d-bc-default">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w10p">Size</th>
        <th scope="col" class="d-w20p">Class</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ stop, size, output } in fontSize.tc8">
        <th scope="row">{{ size }}px</th>
        <td class="d-code--sm d-fc-purple-400">.d-fs-{{ stop }}-tc8</td>
        <td>
          <div class="d-d-flex d-jc-space-between d-ai-center">
            <div class="d-fl1 d-code--sm">
              font-size: {{ output }}rem !important;
            </div>
            <div class="d-fl0 d-lh4" :class="`d-fs-${stop}-tc8`">
              Aa
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### TV

<div class="d-hmx464 d-of-y-auto d-bb d-bc-default">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w10p">Size</th>
        <th scope="col" class="d-w20p">Class</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ stop, size, output } in fontSize.tv">
        <th scope="row">{{ size }}px</th>
        <td class="d-code--sm d-fc-purple-400">.d-fs-{{ stop }}-tv</td>
        <td>
          <div class="d-d-flex d-jc-space-between d-ai-center">
            <div class="d-fl1 d-code--sm">
              font-size: {{ output }}rem !important;
            </div>
            <div class="d-fl0 d-lh4" :class="`d-fs-${stop}-tv`">
              Aa
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
