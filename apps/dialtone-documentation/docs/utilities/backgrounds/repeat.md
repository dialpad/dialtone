---
title: Background Repeat
description: Utilities for controlling if or how an element's background image repeats.
keywords: ["bg repeat", "no repeat", "tile"]
---

## Usage

Use `d-bgr-{n}` to how an element's background image repeats.

```vue demo
<!-- @custom -->
<!-- @class d-d-grid d-g-200 d-g-cols4 d-g-200 d-p-200 d-bgc-secondary -->
<dt-stack align="center" class="d-g-50" v-for="i in repeat">
    <dt-stack direction="row" align="center" justify="center" class="d-size-200 d-bgc-moderate d-bar8 d-of-hidden d-bgp-tl d-bgs-var" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"
      :class="`d-bgr-${i}`">
    </dt-stack>
    <dt-text as="code" kind="code" size="100">d-bgr-{{ i }}</dt-text>
</dt-stack>
```

<script setup>
const repeat = ['repeat', 'repeat-x', 'repeat-y', 'space', 'none', 'unset'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in repeat">
          <th scope="row" class="d-code--sm d-docsite-code">.d-bgr-{{ i }}</th>
          <td class="d-code--sm">
            background-repeat: {{ i }} !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
