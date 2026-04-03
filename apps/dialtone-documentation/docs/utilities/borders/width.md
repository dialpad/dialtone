---
title: Border Widths
description: Utilities for controlling an element's border width.
keywords: ["border size", "border thickness"]
---

## All Sides

Use `d-baw{n}` to change the border width on your element.

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="200"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <div
    v-for="r in [0, 1, 2, 4]"
    class="d-p-200 d-ba"
    :class="`d-baw${r}`"
  >
    d-baw{{r}}
  </div>
</dt-stack>
```

## Individual Sides

Use `d-b{a|t|r|b|l}w{n}` to change the border width of your direction on your element.

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="200"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <div
    v-for="r in [0, 1, 2, 4]"
    class="d-p-200 d-ba d-baw0 d-bgc-primary"
    :class="`d-btw${r}`"
  >
    d-btw{{r}}
  </div>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody v-for="i in ['all', 'top', 'right', 'bottom', 'left']">
      <tr v-for="(val, key) in {0: '0', 1: '100', 2: '200', 4: '300'}">
        <th scope="row" class="d-code--sm d-docsite-code">.d-b{{ i[0] }}w{{ key }}</th>
        <td class="d-code--sm">
          <span v-if="i === 'all'">border-width: var(--dt-size-border-{{ val }}) !important;</span>
          <span v-else>border-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}-width: var(--dt-size-border-{{ val }}) !important;</span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
