---
title: Background Position
description: Utilities for controlling the position of an element's background image.
keywords: ["bg position", "center", "top", "bottom"]
---

## Usage

Use `d-bgp-{position}` to control where an element's background image is placed.

```vue demo
<!-- @custom -->
<!-- @class d-d-grid d-g-200 d-g-cols4 d-g-200 d-p-200 d-bgc-secondary -->
<dt-stack align="center" class="d-g-50" v-for="{ className } in positions">
    <dt-stack direction="row" align="center" justify="center" class="d-size-200 d-bgc-moderate d-bar8 d-of-hidden d-bgr-none d-bgs-var" style="--bgg-size: 65% 65%; background-image: url('/assets/images/puffin.jpg');"
      :class="`d-bgp-${className}`">
    </dt-stack>
    <dt-text as="code" kind="code" size="100">d-bgp-{{ className }}</dt-text>
</dt-stack>
```

<script setup>
  import { positions } from '@data/backgrounds.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ className, output } in positions">
          <th scope="row" class="d-code--sm d-docsite-code">.d-bgp-{{ className }}</th>
          <td class="d-code--sm">
            background-position: {{ output }} !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
