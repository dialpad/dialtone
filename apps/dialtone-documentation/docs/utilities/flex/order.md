---
title: Order
description: Utilities for controlling an element's order within a parent container.
---

## Example

By default, items are ordered by their position in the DOM. To re-order an element, use `d-order{#}`.

<code-well-header>
  <div class="d-d-flex d-ai-center d-jc-space-between d-w100p d-bar8 d-bgc-moderate">
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4">2</div>
    <div class="d-fl-center d-p16 d-w64 d-h64 d-bgc-moderate-opaque d-bar4 d-order-first d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ai-center d-jc-space-between">
  <div>1</div>
  <div>2</div>
  <div class="d-order-first">3</div>
</div>
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
