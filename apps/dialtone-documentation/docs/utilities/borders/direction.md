---
title: Border Directions
description: Utilities for controlling an element's border.
---

## All Sides

Use `d-ba` to add a border to all sides of your element.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="width in [0, 1, 2, 4]"
      class="d-p16 d-ba d-bc-default d-bgc-primary"
      :class="`d-baw${width}`"
    >
      d-baw{{ width }}
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-p16 d-ba d-baw0 d-bc-default d-bgc-primary">d-baw0</div>
<div class="d-p16 d-ba d-baw1 d-bc-default d-bgc-primary">d-baw1</div>
<div class="d-p16 d-ba d-baw2 d-bc-default d-bgc-primary">d-baw2</div>
<div class="d-p16 d-ba d-baw4 d-bc-default d-bgc-primary">d-baw4</div>
```

## Individual Sides

Use `d-b{t|r|b|l|x|y}` to add a border to only specific sides of your element.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="side in ['t', 'r', 'b', 'l', 'x', 'y', 'a']"
      class="d-p16 d-baw4 d-bc-default d-bgc-primary"
      :class="`d-b${side}`"
    >
      d-b{{ side }}
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-p16 d-bt d-baw4 d-bc-default d-bgc-primary">d-bt</div>
<div class="d-p16 d-br d-baw4 d-bc-default d-bgc-primary">d-br</div>
<div class="d-p16 d-bb d-baw4 d-bc-default d-bgc-primary">d-bb</div>
<div class="d-p16 d-bl d-baw4 d-bc-default d-bgc-primary">d-bl</div>
<div class="d-p16 d-bx d-baw4 d-bc-default d-bgc-primary">d-bx</div>
<div class="d-p16 d-by d-baw4 d-bc-default d-bgc-primary">d-by</div>
<div class="d-p16 d-ba d-baw4 d-bc-default d-bgc-primary">d-ba</div>
```

<script setup>
  import { directions } from '@data/borders.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in directions">
        <th scope="row" class="d-code--sm d-docsite-code">.d-b{{ i[0] }}</th>
        <td class="d-code--sm">
          <span v-if="i === 'y'">
            border-top: var(--dt-space-100) solid !important;<br/>
            border-bottom: var(--dt-space-100) solid !important;
          </span>
          <span v-else-if="i === 'x'">
            border-right: var(--dt-space-100) solid !important;<br/>
            border-left: var(--dt-space-100) solid !important;
          </span>
          <span v-else>
            border-{{i}}: var(--dt-space-100) solid !important;
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
