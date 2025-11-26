---
title: Display
description: Utilities for controlling the display box type of an element.
---

## Examples

<code-well-header>
  <dt-stack gap="500" class="d-w100p">
    <div class="d-p8 d-ba d-baw4 d-bar4 d-bc-default d-bgc-moderate d-d-block">
      <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-block</dt-stack>
    </div>
    <div class="d-d-contents">
      <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-contents</dt-stack>
    </div>
    <dt-stack direction="row" gap="400" class="d-p8 d-ba d-baw4 d-bar4 d-bc-default d-bgc-moderate">
      <div>
        <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline-block" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-inline-block</dt-stack>
      </div>
      <div>
        <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline-block" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-inline-block</dt-stack>
      </div>
      <div>
        <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p8 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline-block" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-inline-block</dt-stack>
      </div>
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-p8 d-ba d-baw4 d-bar4 d-bc-default d-bgc-moderate">
      <div>
        <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p4 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-inline</dt-stack>
      </div>
      <div>
        <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p4 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-inline</dt-stack>
      </div>
      <div>
        <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-as-stretch d-p4 d-bgc-moderate-opaque d-bar2 d-code--sm d-d-inline" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">d-d-inline</dt-stack>
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

## Flex Display

<FlexStackNotice class="d-mb16" />

While `d-d-flex` and `d-d-inline-flex` technically are `display` utilities, use the [DtStack](/components/stack) component instead.

<code-well-header>
  <dt-stack
    gap="500"
    direction="row"
    class="d-bgc-moderate-opaque d-bar8"
  >
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 1
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 2
    </div>
    <div class="d-bgc-moderate-opaque d-p16 d-bar8">
      Stack item 3
    </div>
  </dt-stack>
</code-well-header>

```html
<dt-stack
  gap="500"
  direction="row"
>
  <div>
    Stack item 1
  </div>
  <div>
    Stack item 2
  </div>
  <div>
    Stack item 3
  </div>
</dt-stack>
```

## Classes

<new-utility-class-table :classes="display"></new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const display = extractUtilityClasses(utilityClassDocs, 'd-d-');
</script>
