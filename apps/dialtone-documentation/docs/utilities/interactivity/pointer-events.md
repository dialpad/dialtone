---
title: Pointer events
description: Utilities for controlling how an element responds to mouse/touch events.
---

## Pointer Event Classes

<code-well-header>
  <dt-stack direction="row" gap="400">
    <div class="d-p16 d-bgc-moderate d-code--sm" v-for="{ class: className } in pointerEvents.slice(0, 3)" :class="className">.{{ className }}</div>
  </dt-stack>
</code-well-header>

```html
<el class="d-pe-auto">...</el>
<el class="d-pe-inherit">...</el>
<el class="d-pe-none">...</el>
```

## User Select Classes

Use the `user-select` property to control whether the user can select text.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <div v-for="{ class: className } in pointerEvents.slice(3)" class="d-p16 d-bgc-moderate d-code--sm" :class="className">
      <dt-stack gap="400" class="d-ta-center">
        <div>.{{ className }}</div>
        <div>Try to select my text.</div>
      </dt-stack>
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-us-auto">...</div>
<div class="d-us-none">...</div>
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
