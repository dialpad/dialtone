---
title: Pointer events
description: Utilities for controlling how an element responds to mouse/touch events.
---

## Pointer event classes

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <button v-for="{ class: className } in pointerEvents.slice(0, 3)" class="d-btn d-btn--filled d-fs-100 d-ff-mono" :class="className">.{{ className }}</button>
</code-well-header>

```html
<div class="d-pe-auto">...</div>
<div class="d-pe-inherit">...</div>
<div class="d-pe-none">...</div>
```

## User select classes

Use the `user-select` property to control whether the user can select text.

<code-well-header class="d-fl-col5 d-flg8 d-fw-wrap d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div v-for="{ class: className } in pointerEvents.slice(3)" class="d-fl-center d-m8 d-p16 d-w332 d-bgc-purple-300 d-fs-100 d-ff-mono" :class="className">.{{ className }}</div>
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
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fs-100">.{{ className }}</th>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
