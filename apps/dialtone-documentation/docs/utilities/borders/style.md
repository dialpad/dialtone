---
title: Border Style
description: Utilities for controlling an element's border style.
---

## Dashed Borders

Use `d-b{a|t|r|b|l}s-dashed` to change the border style to dashed on your element.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="style in ['bas', 'bts', 'brs', 'bbs', 'bls']"
      class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap"
      :class="`d-${style}-dashed`"
    >
      d-{{ style }}-dashed
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bas-dashed">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bts-dashed">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-brs-dashed">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bbs-dashed">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bls-dashed">...</div>
```

## Dotted Borders

Use `d-b{a|t|r|b|l}s-dotted` to change the border style to dotted on your element.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="style in ['bas', 'bts', 'brs', 'bbs', 'bls']"
      class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap"
      :class="`d-${style}-dotted`"
    >
      d-{{ style }}-dotted
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bas-dotted">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bts-dotted">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-brs-dotted">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bbs-dotted">...</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bls-dotted">...</div>
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
