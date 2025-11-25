---
title: Justify Content
description: Utilities for setting how an element's space around and between content is distributed along its main axis.
---

<FlexStackNotice />

## Flex Start

Use `d-jc-flex-start` to justify items against the start of the element's main axis. This is the default value.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-jc-flex-start d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-jc-flex-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Center

Use `d-jc-center` to justify items along the center of the element's main axis.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-jc-center d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-jc-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-jc-flex-end` to justify items against the end of the element's main axis.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-jc-flex-end d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-jc-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Around

Use `d-jc-space-around` to justify items along the element's main axis so that there is an equal amount of space on each side of the item. This effectively takes all available space, divides it for each child element, placing half of available space on either side of the child. This is why the space appears doubled for interior objects versus end objects.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-jc-space-around d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-jc-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Between

Use `d-jc-space-between` to justify items along the element's main axis so that there is an equal amount of space between each item without inserting any space between the first or last object.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-jc-space-between d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-jc-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Evenly

Use `d-jc-space-evenly` to justify items along the element's main axis so that there is an equal amount of space on each side of the item, but unlike `d-jc-space-around` visually evenly spaces objects.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-jc-space-evenly d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-jc-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in justifyContent">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { justifyContent } from '@data/flex.json';
</script>
