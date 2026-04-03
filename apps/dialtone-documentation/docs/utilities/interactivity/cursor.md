---
title: Cursor
description: Utilities for setting the type of mouse cursor, if any, to show when the mouse pointer is over an element.
keywords: ["pointer", "hover", "focus"]
---
## Usage

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" class="d-fw-wrap d-w100p d-bar8 d-plc-center">
  <div v-for="{ class: className, output } in cursor" class="d-p-200 d-bgc-moderate d-code--sm d-bar4" :class="className">{{ className }}</div>
</dt-stack>
```

<script setup>
  import { cursor } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in cursor">
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
