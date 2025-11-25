---
title: Direction, Wrap, & Flow
description: Utilities for setting an object's flex direction, wrap, and flow directions.
---

<FlexStackNotice />

## Flex Direction

The `flex-direction` property declares a flex container’s main axis direction. The default value is row.

<code-well-header>
  <dt-stack class="d-fd-row-reverse d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
  <dt-stack class="d-fd-row d-w100p d-mt16 d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack class="d-fd-row-reverse">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
<dt-stack class="d-fd-row">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

### Classes

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
        <tr v-for="{ class: className, output, description } in direction">
          <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
          <td class="d-code--sm">{{ output }}</td>
          <td>{{ description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Flex Wrap

The `flex-wrap` property declares a flex container’s wrapping status. The default value is nowrap.

<code-well-header>
  <dt-stack direction="row" class="d-fw-wrap d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-m8 d-p16 d-w25p d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w50p d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w75p d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-fw-wrap">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

### Classes

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
        <tr v-for="{ class: className, output, description } in wrap">
          <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
          <td class="d-code--sm">{{ output }}</td>
          <td>{{ description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

## Flex Flow

The `flex-flow` property is a shorthand property that sets allows you to quickly set the above `flex-direction` and `flex-wrap` properties. By default all flex containers are set to `row` and `nowrap`.

<code-well-header>
  <dt-stack class="d-ff-row-reverse-wrap d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-m8 d-p16 d-w25p d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w50p d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w75p d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack class="d-ff-row-reverse-wrap">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

### Classes

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
        <tr v-for="{class: className, output, description} in flow">
          <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
          <td class="d-code--sm">{{ output }}</td>
          <td>{{ description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

<script setup>
  import { direction, wrap, flow } from '@data/flex.json';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
</script>
