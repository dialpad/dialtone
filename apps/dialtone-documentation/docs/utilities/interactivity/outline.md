---
title: Outline
description: Utilities for controlling an element's outline.
keywords: ["focus ring", "focus outline", "focus style"]
---

## Usage

Use `d-ol-{focusring|focusring-inset|none}` to change an elements' outline.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--sm d-ol-focusring">
    .d-ol-focusring
  </dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--sm d-ol-focusring-inset">
    .d-ol-focusring-inset
  </dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--sm d-ol-none">
    .d-ol-none
  </dt-stack>
</dt-stack>
```

* Use `d-ol-focusring` to add a focus ring that will render **outside** of the element.
* Use `d-ol-focusring-inset` to add a focus ring that renders **within** the edge of the element. This is particularly useful when the containing element bleeds to the edge of its parent or its `overflow` property is set to `hidden`.

<script setup>
  import { outline } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in outline">
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
