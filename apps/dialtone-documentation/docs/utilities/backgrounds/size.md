---
title: Background Size
description: Utilities for controlling an element's background size.
keywords: ["bg size", "cover", "contain"]
---

## Usage

Use `d-bgs-{n}` to control the size of element's background image.

```vue demo
<!-- @custom -->
<!-- @class d-d-grid d-g-200 d-g-cols4 d-g-200 d-p-200 d-bgc-secondary -->
<dt-stack align="center" class="d-g-50" v-for="i in sizes">
    <dt-stack direction="row" align="center" justify="center" class="d-size-200 d-bgc-moderate d-bar8 d-of-hidden d-bgr-none" style="background-image: url('/assets/images/puffin.jpg');"
      :style="i === 'var' ? '--bgg-size: 65% 65%;' : ''"
      :class="[{'d-bgp-center': i === 'auto'}, `d-bgs-${i}`]">
    </dt-stack>
    <dt-text as="code" kind="code" size="100">d-bgs-{{ i }}</dt-text>
</dt-stack>
```

<script setup>
  const sizes = ['contain', 'cover', 'var', 'auto', 'unset'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in sizes">
        <th scope="row" class="d-code--sm d-docsite-code">.d-bgp-{{ i }}</th>
        <td class="d-code--sm">
          background-size:
            <span v-if="i === 'var'"> var(--bgg-size, 100% 100%); </span>
            <span v-else >{{ i }} !important; </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
