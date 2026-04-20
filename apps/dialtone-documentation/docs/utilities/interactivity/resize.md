---
title: Resize
description: Utilities for controlling the resize of an element.
keywords: ["resizable", "drag to resize"]
---

## Usage

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" class="d-w50p">
  <div class="d-of-auto d-p-200 d-ba d-r-both">.d-r-both</div>
  <div class="d-of-auto d-p-200 d-ba d-r-inline">.d-r-inline</div>
  <div class="d-of-auto d-p-200 d-ba d-r-block">.d-r-block</div>
  <div class="d-of-auto d-p-200 d-ba d-r-none">.d-r-none</div>
</dt-stack>
```

<script setup>
  import { resize } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output, deprecated } in resize">
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }} <dt-badge v-if="deprecated" type="critical" class="d-ff-sans">Deprecated</dt-badge></th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
