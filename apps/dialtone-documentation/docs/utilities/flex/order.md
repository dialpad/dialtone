---
title: Order
description: Utilities for controlling an element's order within a parent container.
keywords: ["flexbox","flex order","reorder","sort"]
---

> [!WARNING] Use DtStack in favor of Flex CSS Utilities
> Use the [DtStack](/components/stack) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Example

By default, items are ordered by their position in the DOM. To re-order an element, use `d-order{#}`.

```vue demo
<dt-stack direction="row" gap="200" align="center" justify="between" class="d-w100p d-bar-400 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-bold-opaque d-bar-300 d-order-first">3</dt-stack>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, '-first', '-last']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-order{{ i }}</th>
        <td class="d-code--sm">
          order:
          <span v-if="i === '-first'">-9999</span>
          <span v-else-if="i === '-last'">9999</span>
          <span v-else>{{ i }}</span>
          !important;
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
