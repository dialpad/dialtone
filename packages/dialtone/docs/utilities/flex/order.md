---
title: Order
description: Utilities for controlling an element's order within a parent container.
---

## Example

By default, items are ordered by their position in the DOM. To re-order an element, use `d-order{#}`.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-ai-center d-jc-space-between d-p8 d-w100p d-hmn102 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-o50 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-o50 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-order-first d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">3</div>
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
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-order{{ i }}</th>
        <td class="d-ff-mono d-fs-100">
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
