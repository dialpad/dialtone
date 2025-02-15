---
title: Background Pattern
description: Utilities for adding distinctive background pattern for Department and Call Centers.
---

## Usage

Use `d-bgg-pattern-{pattern}-{dark|light}` to apply a pattern.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-black-200 d-w100p d-hmn102 d-stack8" custom>
  <div class="d-d-flex d-ai-center d-w100p d-h32 d-bar4 d-bgg-to-br d-bgg-from-gold-200 d-bgg-to-gold-200 d-bgg-pattern d-bgg-pattern-slanted-stripes-dark d-fs-200 d-fw-bold d-fc-primary">Ted's Call Center</div>
  <div class="d-d-flex d-ai-center d-w100p d-h32 d-bar4 d-bgg-to-br d-bgg-from-purple-400 d-bgg-to-purple-500 d-bgg-pattern d-bgg-pattern-dots-circles-light d-fs-200 d-fw-bold d-fc-neutral-white">Vicky's Department</div>
</code-well-header>

```html

<div class="... d-bgg-pattern d-bgg-pattern-slanted-stripes-dark">...</div>
<div class="... d-bgg-pattern d-bgg-pattern-dots-circles-light">...</div>
```

## Classes

<new-utility-class-table :classes="patterns">
  <template #example="{ className }">
    <div
      class="d-w24 d-h24 d-bgg-pattern d-ba d-bc-black-900 d-bar4"
      :class="[
          {'d-bgc-neutral-white': className.endsWith('dark')},
          {'d-bgc-neutral-black': className.endsWith('light')},
          className
      ]"
    />
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const patterns = extractUtilityClasses(utilityClassDocs, 'd-bgg-pattern-');
</script>
