---
title: Flex, Grow, & Shrink
description: Utilities for setting an object's flex, grow, and shrink flex properties.
---

<FlexStackNotice />

## Flex

The `flex` property is a shorthand property for `flex-grow`, `flex-shrink`, and `flex-basis` properties. You can also
control the grow and shrink flex values separately with their own utility classes.

<code-well-header>
  <div class="d-d-flex d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-none d-p16 d-ps-relative">Content cannot flex</div>
    <div class="d-fl1 d-p16 d-bgc-moderate-opaque d-ps-relative">Text that will flex</div>
    <div class="d-fl-none d-p16 d-ps-relative">Content cannot flex</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>...</div>
  <div class="d-fl1">...</div>
  <div>...</div>
</div>
```

<clamped-table-wrapper class="d-mb16">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w30p"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in properties[0].values">
          <th scope="row" class="d-code--sm d-docsite-code">.d-fl{{ v }}</th>
          <td class="d-code--sm">flex: {{ v }} auto !important;</td>
          <td>{{ properties[0].description }} {{ v }}, flex-shrink to 1 and flex-basis to auto.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-fl-unset</th>
          <td class="d-code--sm">flex: unset;</td>
          <td>Resets the flex value to the initial value (0 1 auto).</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Flex Grow

The `flex-grow` sets the flex container’s grow factor relative to the parent's main size. The default value is 0.

<code-well-header>
  <div class="d-d-flex d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-none d-p16">Content cannot flex</div>
    <div class="d-fl-grow1 d-p16 d-bgc-moderate-opaque">Text that will grow</div>
    <div class="d-fl-none d-p16">Content cannot flex</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>...</div>
  <div class="d-fl-grow1">...</div>
  <div>...</div>
</div>
```

<clamped-table-wrapper class="d-mb16">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w30p"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in properties[1].values">
          <th scope="row" class="d-code--sm d-docsite-code">.d-{{ properties[1].class }}{{ v }}</th>
          <td class="d-code--sm">flex-grow: {{ v }} !important;</td>
          <td>{{ properties[1].description }} {{ v }}.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-fl-grow-unset</th>
          <td class="d-code--sm">flex-grow: unset !important;</td>
          <td>Resets the flex-grow value to the initial value (0).</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Flex Shrink

The `flex-shrink` sets the flex container’s shrink factor relative to the parent's main size. The default value is 1.

<code-well-header>
  <div class="d-d-flex d-w5 d-bar8 d-bgc-moderate">
    <div class="d-fl-none d-p16">Longer text that cannot flex</div>
    <div class="d-fl-shrink1 d-p16 d-bgc-moderate-opaque">Text that will shrink even if it causes text to wrap</div>
    <div class="d-fl-none d-p16">Longer text that cannot flex</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>...</div>
  <div class="d-fl-shrink1">...</div>
  <div>...</div>
</div>
```

<clamped-table-wrapper class="d-mb16">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w20p"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w30p"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in properties[2].values">
          <th scope="row" class="d-code--sm d-docsite-code">.d-{{ properties[2].class }}{{ v }}</th>
          <td class="d-code--sm">flex-shrink: {{ v }} !important;</td>
          <td>{{ properties[2].description }} {{ v }}.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.d-fl-shrink-unset</th>
          <td class="d-code--sm">flex-shrink: unset !important;</td>
          <td>Resets the flex-shrink value to the initial value (1).</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

<script setup>
  import { properties } from '@data/flex.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>
