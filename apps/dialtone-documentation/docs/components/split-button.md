---
title: Split Button
description: A Split Button offers a default action paired with a secondary action to reveal alternate or related actions.
status: beta
thumb: true
image: assets/images/components/split-button.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-split-button--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=19800-32233
keywords: ["dropdown button", "button with menu", "d-split-button", "DtSplitButton", "dt-split-button", "menu button", "combo button"]
---

<code-well-header>
  <dt-split-button
    end-tooltip-text="More calling options"
  >
    Place call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
</code-well-header>

## Usage

This dual-functionality allows for surfacing variations of the default action. It conserves space in the interface and reduces cognitive load. While versatile, they should be used judiciously to avoid overwhelming users or cluttering the UI.

In addition to the [Button component's](button.md) documentation:

- The default button supports text or icons, while the secondary action is always an icon.
- The secondary action selected from its menu replaces the primary action.
- Ensure that primary and secondary actions are clearly labeled to avoid user confusion.

<dialtone-usage>
<template #do>

- Use Split Buttons when you need to offer a default action paired with closely related actions, such as "Save" with secondary actions like "Save as Draft" or “Save all.”
- Reserve for scenarios where multiple related actions can reasonably be grouped within the same context via the secondary action.

</template>
<template #dont>

- Avoid using if the secondary action is unrelated or distantly related.
- Refrain from grouping multiple Split Buttons together, as this can lead to a cluttered and confusing interface.

</template>
</dialtone-usage>

## Variants

### Base

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" end-tooltip-text="More calling options"> Place Call </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="outlined" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" end-tooltip-text="More calling options"> Place Call </dt-split-button>
'
showHtmlWarning />

### Danger

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button kind="danger" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" kind="danger" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="danger" end-tooltip-text="More calling options"> Place Call </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--danger d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--danger d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--danger d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button kind="danger" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="outlined" kind="danger" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="danger" end-tooltip-text="More calling options"> Place Call </dt-split-button>
'
showHtmlWarning />

### Positive

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button kind="positive" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" kind="positive" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="positive" end-tooltip-text="More calling options"> Place Call </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
<button class="base-button__button d-btn d-btn--primary d-btn--positive d-split-btn__alpha d-split-btn__alpha--md" type="button">
<span class="d-btn__label base-button__label"> Place Call </span>
</button>
<button class="base-button__button d-btn d-btn--primary d-btn--positive d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
<span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
</button>
</span>
<span class="d-split-btn">
<button class="base-button__button d-btn d-btn--outlined d-btn--positive d-split-btn__alpha d-split-btn__alpha--md" type="button">
<span class="d-btn__label base-button__label"> Place Call </span>
</button>
<button class="base-button__button d-btn d-btn--outlined d-btn--positive d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
<span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
</button>
</span>
<span class="d-split-btn">
<button class="base-button__button d-btn d-btn--positive d-split-btn__alpha d-split-btn__alpha--md" type="button">
<span class="d-btn__label base-button__label"> Place Call </span>
</button>
<button class="base-button__button d-btn d-btn--positive d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
<span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
</button>
</span>
'
vueCode='
<dt-split-button kind="positive" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button kind="positive" importance="outlined" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button kind="positive" importance="clear" end-tooltip-text="More calling options"> Place Call </dt-split-button>
'
showHtmlWarning />

### Inverted

<code-well-header bgclass="d-bgc-contrast">
  <dt-stack direction="row" gap="400">
      <dt-split-button kind="inverted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" kind="inverted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="inverted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button kind="inverted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="outlined" kind="inverted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="inverted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
'
showHtmlWarning />

### Muted

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button importance="outlined" kind="muted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="muted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--muted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--muted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--muted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button importance="outlined" kind="muted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="muted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
'
showHtmlWarning />

### Disabled

Use the `disabled` prop to disable both buttons, or use `start-disabled` and `end-disabled` to disable each button independently.

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button disabled end-tooltip-text="More calling options"> Both disabled </dt-split-button>
      <dt-split-button start-disabled end-tooltip-text="More calling options"> Start disabled </dt-split-button>
      <dt-split-button end-disabled end-tooltip-text="More calling options"> End disabled </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button" disabled>
    <span class="d-btn__label base-button__label"> Both disabled </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button" disabled>
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button" disabled>
    <span class="d-btn__label base-button__label"> Start disabled </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> End disabled </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button" disabled>
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button disabled end-tooltip-text="More calling options"> Both disabled </dt-split-button>
<dt-split-button start-disabled end-tooltip-text="More calling options"> Start disabled </dt-split-button>
<dt-split-button end-disabled end-tooltip-text="More calling options"> End disabled </dt-split-button>
'
showHtmlWarning />

### Active

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button start-active end-tooltip-text="More calling options"> Start active </dt-split-button>
    <dt-split-button end-active end-tooltip-text="More calling options"> End active </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button start-active end-tooltip-text="More calling options"> Start active </dt-split-button>
<dt-split-button end-active end-tooltip-text="More calling options"> End active </dt-split-button>
'
showHtmlWarning />

## Sizes

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button size="xs" end-tooltip-text="More calling options"> xs </dt-split-button>
    <dt-split-button size="sm" end-tooltip-text="More calling options"> sm </dt-split-button>
    <dt-split-button size="md" end-tooltip-text="More calling options"> md </dt-split-button>
    <dt-split-button size="lg" end-tooltip-text="More calling options"> lg </dt-split-button>
    <dt-split-button size="xl" end-tooltip-text="More calling options"> xl </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--xs d-split-btn__alpha d-split-btn__alpha--xs" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--xs d-btn--icon-only d-split-btn__omega d-split-btn__omega--xs" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--sm d-split-btn__alpha d-split-btn__alpha--sm" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--sm d-btn--icon-only d-split-btn__omega d-split-btn__omega--sm" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--lg d-split-btn__alpha d-split-btn__alpha--lg" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--lg d-btn--icon-only d-split-btn__omega d-split-btn__omega--lg" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--xl d-split-btn__alpha d-split-btn__alpha--xl" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--xl d-btn--icon-only d-split-btn__omega d-split-btn__omega--xl" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button size="xs" end-tooltip-text="More calling options"> xs </dt-split-button>
<dt-split-button size="sm" end-tooltip-text="More calling options"> sm </dt-split-button>
<dt-split-button size="md" end-tooltip-text="More calling options"> md </dt-split-button>
<dt-split-button size="lg" end-tooltip-text="More calling options"> lg </dt-split-button>
<dt-split-button size="xl" end-tooltip-text="More calling options"> xl </dt-split-button>
'
showHtmlWarning />

## Loading

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button start-loading end-tooltip-text="More calling options"> Place call </dt-split-button>
    <dt-split-button start-loading importance="outlined" end-tooltip-text="More calling options"> Place call </dt-split-button>
    <dt-split-button start-loading importance="clear" end-tooltip-text="More calling options"> Place call </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--loading d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--loading d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--loading d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button start-loading end-tooltip-text="More calling options"> Place call </dt-split-button>
<dt-split-button start-loading importance="outlined" end-tooltip-text="More calling options"> Place call </dt-split-button>
<dt-split-button start-loading importance="clear" end-tooltip-text="More calling options"> Place call </dt-split-button>
'
showHtmlWarning />

## Icon Support

### Icon and Label

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-fw-wrap">
    <dt-split-button importance="outlined" end-tooltip-text="More calling options">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" start-icon-position="blockStart" end-tooltip-text="More calling options">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" start-icon-position="end" end-tooltip-text="More calling options">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" start-icon-position="blockEnd" end-tooltip-text="More calling options">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--top">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--right">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--bottom">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button importance="outlined" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" start-icon-position="blockStart" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" start-icon-position="end" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" start-icon-position="blockEnd" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
'
showHtmlWarning />

### Dual Icons on Start Button

Use `#startIcon` and `#startEndIcon` together to place icons at both the start and end positions
within the start button. This uses the same dual-icon pattern as [DtButton](/components/button.html#start-and-end-icons).

<code-well-header>
  <dt-split-button importance="outlined" end-tooltip-text="More calling options">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
    <template #startEndIcon="{ size }">
      <dt-icon name="arrow-down" :size="size" />
    </template>
    Place call
  </dt-split-button>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place call </span>
    <span class="base-button__icon d-btn__icon d-btn__icon--right">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button importance="outlined" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  <template #startEndIcon="{ size }">
    <dt-icon name="arrow-down" :size="size" />
  </template>
  Place call
</dt-split-button>
'
showHtmlWarning />

### Custom End Button Icon

Use `#endIcon` to replace the default chevron icon on the end (omega) button.

<code-well-header>
  <dt-split-button importance="outlined" end-tooltip-text="More calling options">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
    <template #endIcon="{ size }">
      <dt-icon name="more-vertical" :size="size" />
    </template>
    Place call
  </dt-split-button>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
</span>
'
vueCode='
<dt-split-button importance="outlined" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  <template #endIcon="{ size }">
    <dt-icon name="more-vertical" :size="size" />
  </template>
  Place call
</dt-split-button>
'
showHtmlWarning />

### Icon Only

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button end-tooltip-text="More calling options" start-tooltip-text="Place call">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="outlined" kind="muted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="clear" kind="danger" end-tooltip-text="More calling options" start-tooltip-text="Place call">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button end-tooltip-text="More calling options" start-tooltip-text="Place call">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="muted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="danger" end-tooltip-text="More calling options" start-tooltip-text="Place call">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
'
showHtmlWarning />

<code-well-header bgclass="d-bgc-contrast">
  <dt-stack direction="row" gap="400">
    <dt-split-button kind="inverted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="outlined" kind="inverted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="clear" kind="inverted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
      <template #startIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button kind="inverted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="inverted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="inverted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
'
showHtmlWarning />

## Leading & Trailing

The `#leading` and `#trailing` slots are forwarded to the alpha button. Use `alpha-leading-class` and `alpha-trailing-class` to style the containers.

<code-well-header>
  <dt-stack direction="row" gap="400" ref="leadingTrailingExample">
    <dt-split-button
      importance="outlined"
      omega-tooltip-text="More calling options"
      alpha-trailing-class="d-pr8"
    >
      Place Call
      <template #trailing>
        <dt-keyboard-shortcut shortcut="{cmd}+N" />
      </template>
    </dt-split-button>
    <dt-split-button
      importance="outlined"
      omega-tooltip-text="More calling options"
      alpha-leading-class="d-pl8"
    >
      Place Call
      <template #leading>
        <dt-badge kind="count" text="3" />
      </template>
    </dt-split-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.leadingTrailingExample'
vueCode='
<dt-split-button
  importance="outlined"
  omega-tooltip-text="More options"
  alpha-trailing-class="d-pr8"
>
  Place Call
  <template #trailing>
    <dt-badge text="Label" />
  </template>
</dt-split-button>
<dt-split-button
  importance="outlined"
  omega-tooltip-text="More options"
  alpha-leading-class="d-pl8"
>
  Place Call
  <template #leading>
    <dt-badge kind="count" text="3" />
  </template>
</dt-split-button>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="splitButton" />

## Accessibility

In addition to the [Button component's](button.md#accessibility) accessibility documentation:

- An icon-only primary action and the secondary action require a [Tooltip](tooltip.md) to indicate its function.
- While the secondary action is focused, pressing `Enter` or `Space` triggers its action, displaying a [Dropdown component](dropdown.md) or [Popover component](popover.md).

## Classes

<component-class-table component-name="split-button" />
