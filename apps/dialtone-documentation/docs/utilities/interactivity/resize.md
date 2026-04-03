---
title: Resize
description: Utilities for controlling the resize of an element.
keywords: ["resizable", "drag to resize"]
---

## Usage

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" class="d-w50p">
  <div v-for="{ class: className } in resize.slice(0, 4)" :class="className" class="d-of-auto d-p-200 d-ba">
    .{{ className }}
  </div>
</dt-stack>
```

<script setup>
  import { resize } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in resize">
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
