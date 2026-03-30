---
title: Badge
description: A badge is a compact UI element providing brief, descriptive information about an element and its surrounding context. It is terse, ideally one word.
status: ready
thumb: true
image: assets/images/components/badge.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-badge--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2128-0
keywords: ["label","tag","indicator","count","d-badge","DtBadge","dt-badge"]
---

<component-combinator component-name="DtBadge" />

## Usage

<dialtone-usage>
<template #do>

- To flag and draw awareness to a specific element or feature of focus. For example, something is unique about that separates it from other like content.
- As a notification system with minimal footprint.
</template>

<template #dont>

- To indicate that interaction by the user is required.
</template>

</dialtone-usage>

### Best Practices

- While the color variant used should not be the sole indicator of information, choose color patterns that users can quickly scan and identify its intention.
- Avoid long values, favoring a brief scannable word.

## Accessibility

- Since a Badge may often reflect a value within an implied label, ensure a label is announced. For example, via `aria-label` or `aria-labeledby`.

## Kind

### Label

<code-example>
  <dt-badge text="Label" />
</code-example>

### Count

<code-example>
  <dt-badge kind="count" text="1" />
</code-example>

## Type

<table class="d-table dialtone-doc-table d-mbe-200">
  <thead>
    <tr>
      <th>Type</th>
      <th class="d-ws-nowrap">Kind: <span class="d-fw-normal">Label</span></th>
      <th class="d-ws-nowrap">Kind: <span class="d-fw-normal">Count</span></th>
      <th>Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="d-ta-left">Default</th>
      <td>
        <dt-badge text="Label"></dt-badge>
      </td>
      <td>
        <dt-badge kind="count" text="1"></dt-badge>
      </td>
      <td>Default general purpose callout when no implicit semantic meaning applies.</td>
    </tr>
    <tr>
      <th class="d-ta-left">Info</th>
      <td>
        <dt-badge type="info" text="Label"></dt-badge>
      </td>
      <td>
        <dt-badge kind="count" type="info" text="2"></dt-badge>
      </td>
      <td>Used to convey general information that isn't critical or requires action on the user's part.</td>
    </tr>
    <tr>
      <th class="d-ta-left">Success</th>
      <td>
        <dt-badge type="success" text="Label"></dt-badge>
      </td>
      <td>
        <dt-badge kind="count" type="success" text="3"></dt-badge>
      </td>
      <td>Accompanying a successful or otherwise positive action or message</td>
    </tr>
    <tr>
      <th class="d-ta-left">Warning</th>
      <td>
        <dt-badge type="warning" text="Label"></dt-badge>
      </td>
      <td>
        <dt-badge kind="count" type="warning" text="4"></dt-badge>
      </td>
      <td>When a users attention is needed, or action may be required.</td>
    </tr>
    <tr>
      <th class="d-ta-left">Critical</th>
      <td>
        <dt-badge type="critical" text="Label"></dt-badge>
      </td>
      <td>
        <dt-badge kind="count" type="critical" text="5"></dt-badge>
      </td>
      <td>To communicate conditions deemed critical, negative, or dangerous. For example, sensitive state (e.g. recording), must be resolved, or something has failed.</td>
    </tr>
    <tr>
      <th class="d-ta-left">Bulletin</th>
      <td>
        <dt-badge type="bulletin" text="Label"></dt-badge>
      </td>
      <td>
        <dt-badge kind="count" type="bulletin" text="6"></dt-badge>
      </td>
      <td>Used to provide temporary feedback to specific items in the interface, like live activity, notifications, and unread counts. </td>
    </tr>
    <tr>
      <th class="d-ta-left">Ai</th>
      <td>
        <dt-badge type="ai" text="Label" kind="label"></dt-badge>
      </td>
      <td><abbr class="d-fc-muted d-td-none d-fs-100" title="Not applicable">N/A</abbr></td>
      <td>To call out Dialpad Ai features.</td>
    </tr>
  </tbody>
</table>

<code-example only-show="code">
  <dt-badge kind="label" text="Label" />
  <dt-badge type="info" kind="label" text="Label" />
  <dt-badge type="success" kind="label" text="Label" />
  <dt-badge type="warning" kind="label" text="Label" />
  <dt-badge type="critical" kind="label" text="Label" />
  <dt-badge type="bulletin" kind="label" text="Label" />
  <dt-badge type="ai" text="Label" kind="label" />
  <dt-badge type="default" text="1" kind="count" />
  <dt-badge type="info" text="2" kind="count" />
  <dt-badge type="success" text="3" kind="count" />
  <dt-badge type="warning" text="4" kind="count" />
  <dt-badge type="critical" text="5" kind="count" />
  <dt-badge type="bulletin" text="6" kind="count" />
</code-example>

## Outlined

<code-example>
  <dt-stack direction="row" gap="400" data-demo-wrapper>
    <dt-badge text="Label" outlined />
    <dt-badge text="Label" type="info" outlined />
    <dt-badge text="Label" type="success" outlined />
    <dt-badge text="Label" type="warning" outlined />
    <dt-badge text="Label" type="critical" outlined />
    <dt-badge text="1" kind="count" outlined />
    <dt-badge text="1" type="info" kind="count" outlined />
    <dt-badge text="1" type="success" kind="count" outlined />
    <dt-badge text="1" type="warning" kind="count" outlined />
    <dt-badge text="1" type="critical" kind="count" outlined />
  </dt-stack>
</code-example>

## Subtle

At the moment, only the `bulletin` type has a subtle variant.

<code-example>
  <dt-stack direction="row" gap="400" data-demo-wrapper>
    <dt-badge text="Label" type="bulletin" subtle />
    <dt-badge text="Label" type="bulletin" subtle outlined />
    <dt-badge text="1" type="bulletin" subtle kind="count" />
    <dt-badge text="1" type="bulletin" subtle kind="count" outlined />
  </dt-stack>
</code-example>

## Icon

<code-example>
  <dt-stack direction="row" gap="400" data-demo-wrapper>
    <dt-badge type="default" text="Label" kind="label">
      <template #startIcon="{ iconSize }">
        <dt-icon-lightning-bolt :size="iconSize" />
      </template>
    </dt-badge>
    <dt-badge type="default" text="Label" kind="label">
      <template #endIcon="{ iconSize }">
        <dt-icon-lightning-bolt :size="iconSize" />
      </template>
    </dt-badge>
    <dt-badge type="default" text="Label" kind="label">
      <template #startIcon="{ iconSize }">
        <dt-icon-lightning-bolt :size="iconSize" />
      </template>
      <template #endIcon="{ iconSize }">
        <dt-icon-lightning-bolt :size="iconSize" />
      </template>
    </dt-badge>
  </dt-stack>
</code-example>

## Decorative

Decorative badges label and classify items for quick recognition.

<code-example vueCode='
<dt-badge text="Label" decoration="black-400" />
<dt-badge text="Label" decoration="black-500" />
<dt-badge text="Label" decoration="black-900" />
<dt-badge text="Label" decoration="red-200" />
...
'>
  <dt-stack direction="row" gap="500" align="baseline">
    <dt-stack gap="500">
      <dt-text kind="label" :size="300" density="200">Black</dt-text>
      <dt-badge text="Label" decoration="black-400" />
      <dt-badge text="Label" decoration="black-500" />
      <dt-badge text="Label" decoration="black-900" />
    </dt-stack>
    <dt-stack gap="500">
      <dt-text kind="label" :size="300" density="200">Red</dt-text>
      <dt-badge text="Label" decoration="red-200" />
      <dt-badge text="Label" decoration="red-300" />
      <dt-badge text="Label" decoration="red-400" />
    </dt-stack>
    <dt-stack gap="500">
      <dt-text kind="label" :size="300" density="200">Purple</dt-text>
      <dt-badge text="Label" decoration="purple-200" />
      <dt-badge text="Label" decoration="purple-300" />
      <dt-badge text="Label" decoration="purple-400" />
      <dt-badge text="Label" decoration="purple-500" />
    </dt-stack>
    <dt-stack gap="500">
      <dt-text kind="label" :size="300" density="200">Blue</dt-text>
      <dt-badge text="Label" decoration="blue-200" />
      <dt-badge text="Label" decoration="blue-300" />
      <dt-badge text="Label" decoration="blue-400" />
    </dt-stack>
    <dt-stack gap="500">
      <dt-text kind="label" :size="300" density="200">Green</dt-text>
      <dt-badge text="Label" decoration="green-300" />
      <dt-badge text="Label" decoration="green-400" />
      <dt-badge text="Label" decoration="green-500" />
    </dt-stack>
    <dt-stack gap="500">
      <dt-text kind="label" :size="300" density="200">Gold</dt-text>
      <dt-badge text="Label" decoration="gold-300" />
      <dt-badge text="Label" decoration="gold-400" />
      <dt-badge text="Label" decoration="gold-500" />
    </dt-stack>
    <dt-stack gap="500">
      <dt-text kind="label" :size="300" density="200">Magenta</dt-text>
      <dt-badge text="Label" decoration="magenta-200" />
      <dt-badge text="Label" decoration="magenta-300" />
      <dt-badge text="Label" decoration="magenta-400" />
    </dt-stack>
  </dt-stack>
</code-example>

<dialtone-usage>
<template #do>

- Use for categories of items with a limited number of options (eg. call categories, AI moments).
</template>

<template #dont>

- Use for categories of items with an unlimited or unknown number of options (eg. user-defined contact labels, RTA cards, contact centers).
- Use for single items that are not part of a larger group.
- Use for decoration only, to bring attention to part of the UI by using colors.
- Use with `kind=count`, nor with any `type` that is not `default`.
- Use in combination with an icon.
- Change the customize the Badge's background color text style,
- Extend the decorative slot color beyond what Dialtone provides.
</template>

</dialtone-usage>

### Best Practices

- Favor lighter shades over darker ones.
- Use each color hue before using the next available shade.

## Examples

### Label

<code-example only-show="demo">
  <dt-stack gap="500">
    <dt-stack direction="row" gap="400">
      <dt-badge text="Co-host" />
      <dt-badge text="Customer" />
      <dt-badge text="Locked">
        <template #startIcon="{ iconSize }">
          <dt-icon-lock :size="iconSize" />
        </template>
      </dt-badge>
      <dt-badge text="Chat log">
        <template #startIcon="{ iconSize }">
          <dt-icon-message :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge text="In progress" type="info" />
      <dt-badge text="Beta" type="info" />
      <dt-badge text="Draft" type="info" />
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge text="Overdue" type="warning" />
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge text="Resolved" type="success" />
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge text="Recording" type="critical">
        <template #startIcon="{ iconSize }">
          <dt-icon-record-filled :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge text="Live" type="bulletin" />
      <dt-badge text="Presenter" type="bulletin" />
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge type="ai" text="Ai Notes" />
      <dt-badge type="ai" text="Ai Suggestion" />
      <dt-badge type="ai" text="Ai enabled" />
      <dt-badge type="ai" text="Ai Transcript" />
    </dt-stack>
  </dt-stack>
</code-example>

### Count

<code-example only-show="demo">
  <dt-stack gap="500">
    <dt-stack direction="row" gap="400">
      <dt-badge kind="count" type="success" text="5%">
        <template #startIcon="{ iconSize }">
          <dt-icon-arrow-up :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge kind="count" type="critical" text="-12%">
        <template #startIcon="{ iconSize }">
          <dt-icon-arrow-down :size="iconSize" />
        </template>
      </dt-badge>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-badge kind="count" type="bulletin" text="1" />
      <dt-badge kind="count" type="bulletin" text="18" />
      <dt-badge kind="count" type="bulletin" text="99+" />
    </dt-stack>
  </dt-stack>
</code-example>

## Vue API

<component-vue-api component-name="badge"></component-vue-api>

## Classes

<component-class-table component-name="badge"></component-class-table>

<script setup>
  import {
    DtIconLightningBolt,
    DtIconLock,
    DtIconMessage,
    DtIconRecordFilled,
    DtIconArrowUp,
    DtIconArrowDown,
  } from '@dialpad/dialtone-icons/vue';
</script>
