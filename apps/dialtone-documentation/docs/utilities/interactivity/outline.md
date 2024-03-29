---
title: Outline
description: Utilities for controlling an element's outline.
---

## Usage

Use `d-ol-{focusring|focusring-inset|none}` to change an elements' outline.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-bold d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p16 d-bgc-bold d-code--sm d-ol-focusring">
    .d-ol-focusring
  </div>
  <div class="d-fl-center d-p16 d-bgc-bold d-code--sm d-ol-focusring-inset">
    .d-ol-focusring-inset
  </div>
  <div class="d-fl-center d-p16 d-bgc-bold d-code--sm d-ol-none">
    .d-ol-none
  </div>
</code-well-header>

```html
<div class="d-ol-focusring">...</div>
<div class="d-ol-none">...</div>
```

<script setup>
  import { outline } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in outline">
        <th scope="row" class="d-code--sm d-fc-purple-400">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
