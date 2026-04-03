---
title: Pointer events
description: Utilities for controlling how an element responds to mouse/touch events.
keywords: ["click through", "mouse events", "touch events"]
---

## Pointer Event Classes

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <div class="d-p-200 d-bgc-moderate d-code--sm" v-for="{ class: className } in pointerEvents.slice(0, 3)" :class="className">.{{ className }}</div>
</dt-stack>
```

## User Select Classes

Use the `user-select` property to control whether the user can select text.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <div v-for="{ class: className } in pointerEvents.slice(3)" class="d-p-200 d-bgc-moderate d-code--sm" :class="className">
    <dt-stack gap="100" class="d-ta-center">
      <div>.{{ className }}</div>
      <div>Try to select my text.</div>
    </dt-stack>
  </div>
</dt-stack>
```

<script setup>
  import { pointerEvents } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in pointerEvents">
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
