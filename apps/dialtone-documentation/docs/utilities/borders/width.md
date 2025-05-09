---
title: Border Widths
description: Utilities for controlling an element's border width.
---

## All Sides

Use `d-baw{n}` to change the border width on your element.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="r in [0, 1, 2, 4, 6]"
      class="d-p16 d-ba d-baw2 d-bc-default"
      :class="`d-baw${r}`"
    >
      d-baw{{r}}
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-ba d-baw0">...</div>
<div class="d-ba d-baw1">...</div>
<div class="d-ba d-baw2">...</div>
<div class="d-ba d-baw4">...</div>
<div class="d-ba d-baw6">...</div>
```

## Individual Sides

Use `d-b{a|t|r|b|l}w{n}` to change the border width of your direction on your element.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="r in [0, 1, 2, 4, 6]"
      class="d-p16 d-ba d-baw0 d-bc-default d-bgc-primary"
      :class="`d-btw${r}`"
    >
      d-btw{{r}}
    </div>
  </dt-stack>
</code-well-header>

```html

<div class="d-bt d-btw1">...</div>
<div class="d-br d-btw2">...</div>
<div class="d-bb d-btw4">...</div>
<div class="d-bl d-btw6">...</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody v-for="i in ['all', 'top', 'right', 'bottom', 'left']">
      <tr v-for="(val, key) in {0: '0', 1: '100', 2: '200', 4: '300', 6: '350'}">
        <th scope="row" class="d-code--sm d-docsite-code">.d-b{{ i[0] }}w{{ key }}</th>
        <td class="d-code--sm">
          <span v-if="i === 'all'">border-width: var(--dt-size-{{ val }}) !important;</span>
          <span v-else>border-{{i}}-width: var(--dt-size-{{ val }}) !important;</span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
