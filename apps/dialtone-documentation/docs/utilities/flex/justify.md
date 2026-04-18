---
title: Justify Content
description: Utilities for setting how an element's space around and between content is distributed along its main axis.
keywords: ["flexbox", "main axis", "space between", "space around"]
---

> [!WARNING] Use DtStack in favor of Flex CSS Utilities
> Use the [DtStack](/components/stack) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Flex Start

Use `d-jc-flex-start` to justify items against the start of the element's main axis. This is the default value.

```vue demo
<dt-stack direction="row" gap="100" class="d-jc-flex-start d-w-1000 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</dt-stack>
```

## Center

Use `d-jc-center` to justify items along the center of the element's main axis.

```vue demo
<dt-stack direction="row" gap="100" class="d-jc-center d-w-1000 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</dt-stack>
```

## Flex End

Use `d-jc-flex-end` to justify items against the end of the element's main axis.

```vue demo
<dt-stack direction="row" gap="100" class="d-jc-flex-end d-w-1000 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</dt-stack>
```

## Space Around

Use `d-jc-space-around` to justify items along the element's main axis so that there is an equal amount of space on each side of the item. This effectively takes all available space, divides it for each child element, placing half of available space on either side of the child. This is why the space appears doubled for interior objects versus end objects.

```vue demo
<dt-stack direction="row" gap="100" class="d-jc-space-around d-w-1000 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</dt-stack>
```

## Space Between

Use `d-jc-space-between` to justify items along the element's main axis so that there is an equal amount of space between each item without inserting any space between the first or last object.

```vue demo
<dt-stack direction="row" gap="100" class="d-jc-space-between d-w-1000 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</dt-stack>
```

## Space Evenly

Use `d-jc-space-evenly` to justify items along the element's main axis so that there is an equal amount of space on each side of the item, but unlike `d-jc-space-around` visually evenly spaces objects.

```vue demo
<dt-stack direction="row" gap="100" class="d-jc-space-evenly d-w-1000 d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">3</dt-stack>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output, deprecated } in justifyContent" >
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }} <dt-badge v-if="deprecated" type="critical" class="d-ff-sans">Deprecated</dt-badge></th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { justifyContent } from '@data/flex.json';
</script>
