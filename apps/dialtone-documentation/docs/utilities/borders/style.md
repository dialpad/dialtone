---
title: Border Style
description: Utilities for controlling an element's border style.
keywords: ["solid", "dashed", "dotted", "none"]
---

## Dashed Borders

Use `d-b{a|t|r|b|l}s-dashed` to change the border style to dashed on your element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bas-dashed">d-bas-dashed</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bts-dashed">d-bts-dashed</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-brs-dashed">d-brs-dashed</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bbs-dashed">d-bbs-dashed</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bls-dashed">d-bls-dashed</div>
</dt-stack>
```

## Dotted Borders

Use `d-b{a|t|r|b|l}s-dotted` to change the border style to dotted on your element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bas-dotted">d-bas-dotted</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bts-dotted">d-bts-dotted</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-brs-dotted">d-brs-dotted</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bbs-dotted">d-bbs-dotted</div>
  <div class="d-p-200 d-ba d-baw2 d-bgc-default d-ws-nowrap d-bls-dotted">d-bls-dotted</div>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-bas-unset</th>
        <td class="d-code--sm">border-style: unset !important;</td>
      </tr>
    </tbody>
    <tbody v-for="s in ['dashed', 'dotted']">
      <tr v-for="i in ['all', 'top', 'right', 'bottom', 'left']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-b{{ i[0] }}s-{{ s }}</th>
        <td class="d-code--sm">
          <span v-if="i === 'all'">border-style: {{ s }} !important;</span>
          <span v-else>border-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}-style: {{ s }} !important;</span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
