---
title: Pointer events
description: Utilities for controlling how an element responds to mouse/touch events.
keywords: ["click through", "mouse events", "touch events"]
---

## Pointer Event Classes

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <div class="d-p-200 d-bgc-moderate d-code--sm d-pe-auto">.d-pe-auto</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-pe-inherit">.d-pe-inherit</div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-pe-none">.d-pe-none</div>
</dt-stack>
```

## User Select Classes

Use the `user-select` property to control whether the user can select text.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <div class="d-p-200 d-bgc-moderate d-code--sm d-us-all">
    <dt-stack gap="100" class="d-ta-center">
      <div>.d-us-all</div>
      <div>Try to select my text.</div>
    </dt-stack>
  </div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-us-auto">
    <dt-stack gap="100" class="d-ta-center">
      <div>.d-us-auto</div>
      <div>Try to select my text.</div>
    </dt-stack>
  </div>
  <div class="d-p-200 d-bgc-moderate d-code--sm d-us-none">
    <dt-stack gap="100" class="d-ta-center">
      <div>.d-us-none</div>
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
