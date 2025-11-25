---
title: Align Self
description: Utilities for setting how an element's is aligned along a parent's cross axis.
---

<FlexStackNotice />

## Stretch

Use `d-as-stretch` to stretch an item along a parent's cross axis.

<code-well-header>
  <dt-stack direction="row" align="start" class="d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-fl1 d-as-stretch d-m8 d-p16 d-bgc-bold-opaque d-bar4">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" align="start">
  <div>1</div>
  <div class="d-as-stretch">2</div>
  <div>3</div>
</dt-stack>
```

## Flex Start

Use `d-as-flex-start` to align an item to the start of the parent's cross axis.

<code-well-header>
  <dt-stack direction="row" class="d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-fl1 d-as-flex-start d-m8 d-p16 d-bgc-bold-opaque d-bar4">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row">
    <div>1</div>
    <div class="d-as-flex-start">2</div>
    <div>3</div>
</dt-stack>
```

## Center

Use `d-as-center` to align an item along the center of the parent's cross axis.

<code-well-header>
  <dt-stack direction="row" class="d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-fl1 d-as-center d-m8 d-p16 d-bgc-bold-opaque d-bar4">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row">
  <div>1</div>
  <div class="d-as-center">2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-as-flex-end` to align an item from the end of the parent's cross axis.

<code-well-header>
  <dt-stack direction="row" class="d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-fl1 d-as-flex-end d-m8 d-p16 d-bgc-bold-opaque d-bar4">2</div>
    <div class="d-fl-center d-fl1 d-m8 d-p16 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row">
  <div>1</div>
  <div class="d-as-flex-end">2</div>
  <div>3</div>
</dt-stack>
```

<script setup>
  import { alignSelf } from '@data/flex.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for=" { class: className, output } in alignSelf">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
</template>
</utility-class-table>
