---
title: Font Size
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

<code-well-header>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 10rem 1fr">
    <div class="d-code--sm d-docsite-code">.d-fs-100</div>
    <div><p class="d-fs-100">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code">.d-fs-200</div>
    <div><p class="d-fs-200">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code">.d-fs-300</div>
    <div><p class="d-fs-300">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code">.d-fs-400</div>
    <div><p class="d-fs-400">The quick brown fox jumps over the lazy dog.</p></div>
    <div class="d-code--sm d-docsite-code">.d-fs-500</div>
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
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>

## Classes by Platform

### Product

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w10p"><div class="d-p16 d-bb d-bc-default d-bbw1">Size</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
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
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w10p"><div class="d-p16 d-bb d-bc-default d-bbw1">Size</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
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
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w10p"><div class="d-p16 d-bb d-bc-default d-bbw1">Size</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
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
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w10p"><div class="d-p16 d-bb d-bc-default d-bbw1">Size</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
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
