---
title: Border Directions
description: Utilities for controlling an element's border.
keywords: ["border top", "border bottom", "border left", "border right"]
---

## All Sides

Use `d-ba` to add a border to all sides of your element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="200" :direction="{ 'default': 'column', 'md': 'row' }">
  <div class="d-p-200 d-ba d-bgc-primary d-baw0">d-baw0</div>
  <div class="d-p-200 d-ba d-bgc-primary d-baw1">d-baw1</div>
  <div class="d-p-200 d-ba d-bgc-primary d-baw2">d-baw2</div>
  <div class="d-p-200 d-ba d-bgc-primary d-baw4">d-baw4</div>
</dt-stack>
```

## Individual Sides

Use `d-b{t|r|b|l|x|y}` to add a border to only specific sides of your element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="200" :direction="{ 'default': 'column', 'md': 'row' }">
  <div class="d-p-200 d-baw4 d-bgc-primary d-bt">d-bt</div>
  <div class="d-p-200 d-baw4 d-bgc-primary d-br">d-br</div>
  <div class="d-p-200 d-baw4 d-bgc-primary d-bb">d-bb</div>
  <div class="d-p-200 d-baw4 d-bgc-primary d-bl">d-bl</div>
  <div class="d-p-200 d-baw4 d-bgc-primary d-bx">d-bx</div>
  <div class="d-p-200 d-baw4 d-bgc-primary d-by">d-by</div>
  <div class="d-p-200 d-baw4 d-bgc-primary d-ba">d-ba</div>
</dt-stack>
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
            border-block-start: var(--dt-size-border-100) solid !important;<br/>
            border-block-end: var(--dt-size-border-100) solid !important;
          </span>
          <span v-else-if="i === 'x'">
            border-inline-end: var(--dt-size-border-100) solid !important;<br/>
            border-inline-start: var(--dt-size-border-100) solid !important;
          </span>
          <span v-else-if="i === 'all'">
            border: var(--dt-size-border-100) solid !important;
          </span>
          <span v-else>
            border-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}: var(--dt-size-border-100) solid !important;
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
