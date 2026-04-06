---
title: Flex, Grow, & Shrink
description: Utilities for setting an object's flex, grow, and shrink flex properties.
keywords: ["flexbox", "flex shrink", "flex basis"]
---

<FlexStackNotice />

## Flex

The `flex` property is a shorthand property for `flex-grow`, `flex-shrink`, and `flex-basis` properties. You can also
control the grow and shrink flex values separately with their own utility classes.

```vue demo
<dt-stack direction="row" class="d-w-1000 d-bar8 d-bgc-moderate">
  <div class="d-fl-none d-p-200 d-ps-relative">Content cannot flex</div>
  <div class="d-fl1 d-p-200 d-bgc-moderate-opaque d-ps-relative">Text that will flex</div>
  <div class="d-fl-none d-p-200 d-ps-relative">Content cannot flex</div>
</dt-stack>
```

<clamped-table-wrapper class="d-mbe-200">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0 d-w30p"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Description</div></th>
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

```vue demo
<dt-stack direction="row" class="d-w-1000 d-bar8 d-bgc-moderate">
  <div class="d-fl-none d-p-200">Content cannot flex</div>
  <div class="d-fl-grow1 d-p-200 d-bgc-moderate-opaque">Text that will grow</div>
  <div class="d-fl-none d-p-200">Content cannot flex</div>
</dt-stack>
```

<clamped-table-wrapper class="d-mbe-200">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0 d-w30p"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in properties[1].values" valign="baseline">
          <th scope="row" class="d-code--sm d-docsite-code">.d-{{ properties[1].class }}{{ v }}</th>
          <td><dt-text as="code" kind="code" size="100">flex-grow: {{ v }} !important;</dt-text></td>
          <td><dt-text as="p" kind="body" size="200">{{ properties[1].description }} {{ v }}.</dt-text></td>
        </tr>
        <tr valign="baseline">
          <th scope="row" class="d-code--sm d-docsite-code">.d-fl-grow-unset</th>
          <td><dt-text as="code" kind="code" size="100">flex-grow: unset !important;</dt-text></td>
          <td><dt-text as="p" kind="body" size="200">Resets the flex-grow value to the initial value (0).</dt-text></td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Flex Shrink

The `flex-shrink` sets the flex container’s shrink factor relative to the parent's main size. The default value is 1.

```vue demo
<dt-stack direction="row" class="d-bar8 d-bgc-moderate">
  <div class="d-bar8 d-fl-none d-p-200 d-bgc-moderate-opaque">Longer text that cannot flex</div>
  <div class="d-bar8 d-fl-shrink1 d-p-200 d-bgc-moderate-opaque">Text that will shrink even if it causes text to wrap</div>
  <div class="d-bar8 d-fl-none d-p-200 d-bgc-moderate-opaque">Longer text that cannot flex</div>
</dt-stack>
```

<clamped-table-wrapper class="d-mbe-200">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0 d-w20p"><div class="d-p-200 d-bb d-bbw1">Class</div></th>
          <th scope="col" class="d-p-0 d-bbw0 d-w30p"><div class="d-p-200 d-bb d-bbw1">Output</div></th>
          <th scope="col" class="d-p-0 d-bbw0"><div class="d-p-200 d-bb d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in properties[2].values" valign="baseline">
          <th scope="row" class="d-code--sm d-docsite-code">.d-{{ properties[2].class }}{{ v }}</th>
          <td><dt-text as="code" kind="code" size="100">flex-shrink: {{ v }} !important;</dt-text></td>
          <td><dt-text as="p" kind="body" size="200">{{ properties[2].description }} {{ v }}.</dt-text></td>
        </tr>
        <tr valign="baseline">
          <th scope="row" class="d-code--sm d-docsite-code">.d-fl-shrink-unset</th>
          <td><dt-text as="code" kind="code" size="100">flex-shrink: unset !important;</dt-text></td>
          <td><dt-text as="p" kind="body" size="200">Resets the flex-shrink value to the initial value (1).</dt-text></td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

<script setup>
  import { properties } from '@data/flex.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>
