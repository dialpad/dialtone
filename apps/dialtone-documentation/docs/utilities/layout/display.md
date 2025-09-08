---
title: Display
description: Utilities for controlling the display box type of an element.
---

## Examples

<code-well-header>
  <dt-stack gap="500" class="d-w100p">
    <div class="d-p8 d-ba d-baw4 d-bar4 d-bc-default d-bgc-moderate d-d-block">
      <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm">d-d-block</div>
    </div>
    <div class="d-d-contents">
      <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm">d-d-contents</div>
    </div>
    <dt-stack direction="row" gap="400" class="d-p8 d-ba d-baw4 d-bar4 d-bc-default d-bgc-moderate">
      <div>
        <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline-block">d-d-inline-block</div>
      </div>
      <div>
        <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline-block">d-d-inline-block</div>
      </div>
      <div>
        <div class="d-fl-center d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline-block">d-d-inline-block</div>
      </div>
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-p8 d-ba d-baw4 d-bar4 d-bc-default d-bgc-moderate">
      <div>
        <div class="d-fl-center d-fl1 d-as-stretch d-p4 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline">d-d-inline</div>
      </div>
      <div>
        <div class="d-fl-center d-fl1 d-as-stretch d-p4 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline">d-d-inline</div>
      </div>
      <div>
        <div class="d-fl-center d-fl1 d-as-stretch d-p4 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline">d-d-inline</div>
      </div>
    </dt-stack>
  </dt-stack>

</code-well-header>

```html
<div class="d-d-block">…</div>
<div class="d-d-contents">…</div>
<div class="d-d-inline-block">…</div>
<div class="d-d-inline">…</div>
<div class="d-d-none">…</div>
<div class="d-d-unset">…</div>
```

## Classes

<new-utility-class-table :classes="display"></new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const display = extractUtilityClasses(utilityClassDocs, 'd-d-');
</script>
