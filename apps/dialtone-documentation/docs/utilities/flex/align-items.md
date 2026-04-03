---
title: Align Items
description: Utilities for setting how an element's is aligned along an element's cross axis.
keywords: ["flexbox", "cross axis", "center", "stretch"]
---

<FlexStackNotice />

## Stretch

Use `d-ai-stretch` to stretch items across the element's cross axis. This is the default value.

```vue demo
<dt-stack direction="row" class="d-ai-stretch d-p-100 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-100 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-50 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</dt-stack>
```

## Flex Start

Use `d-ai-flex-start` to align items to the start of the element's cross axis.

```vue demo
<dt-stack direction="row" class="d-ai-flex-start d-p-100 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-50 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-300 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</dt-stack>
```

## Center

Use `d-ai-center` to distribute items along the center of the element's cross axis.

```vue demo
<dt-stack direction="row" class="d-ai-center d-p-100 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-50 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-300 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</dt-stack>
```

## Flex End

Use `d-ai-flex-end` to distribute items from the end of the element's cross axis.

```vue demo
<dt-stack direction="row" class="d-ai-flex-end d-p-100 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-50 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-300 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m-100 d-px-200 d-py-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</dt-stack>
```

<script setup>
  import { alignItems } from '@data/flex.json';
</script>

## Classes

<utility-class-table>
 <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in alignItems">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
