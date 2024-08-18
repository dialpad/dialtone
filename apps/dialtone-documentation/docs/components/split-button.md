---
title: Split Button
description: A Split Button offers a default action paired with a secondary action to reveal alternate or related actions.
status: beta
thumb: true
image: assets/images/components/split-button.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-split-button--default
figma_url: https://www.figma.com/design/2adf7JhZOncRyjYiy2joil/DT9-Component-Library?node-id=17597-8212&t=zQhkLLjFhis5qtDn-11
---

<code-well-header>
  <dt-split-button
    omega-tooltip-text="More calling options"
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

This dual-functionality allows for surfacing variations of the default action. It conserves space in the interface and reduces cognitive load. While versatile, they should be used judiciously to avoild ovewhelming users or cluttering the UI.

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
      <dt-split-button omega-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
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
<dt-split-button omega-tooltip-text="More calling options"> Place Call </dt-button>
<dt-split-button importance="outlined" omega-tooltip-text="More calling options"> Place Call </dt-button>
<dt-split-button importance="clear" omega-tooltip-text="More calling options"> Place Call </dt-button>
'
showHtmlWarning />

### Danger

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
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
<dt-split-button kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-button>
<dt-split-button importance="outlined" kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-button>
<dt-split-button importance="clear" kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-button>
'
showHtmlWarning />

### Inverted

<code-well-header bgclass="d-bgc-contrast">
  <dt-stack direction="row" gap="400">
      <dt-split-button kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
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
<dt-split-button kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="outlined" kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
'
showHtmlWarning />

### Muted

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button importance="outlined" kind="muted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="muted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
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
<dt-split-button importance="outlined" kind="muted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="muted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
'
showHtmlWarning />

### Disabled

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-split-button disabled omega-tooltip-text="More calling options"> Place Call (disable attribute)</dt-split-button>
      <span class="d-c-not-allowed">
        <dt-split-button class="d-btn--disabled" omega-tooltip-text="More calling options"> Place Call (disabled class) </dt-split-button>
      </span>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button" disabled>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button" disabled>
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md d-btn--disabled" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md d-btn--disabled" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button disabled> Place Call (disable attribute)</dt-split-button>
<span class="d-c-not-allowed">
  <dt-split-button class="d-btn--disabled"> Place Call (disabled class) </dt-split-button>
</span>
'
showHtmlWarning />

### Active

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button alpha-active omega-tooltip-text="More calling options"> Alpha active </dt-split-button>
    <dt-split-button omega-active omega-tooltip-text="More calling options"> Omega active </dt-split-button>
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
<dt-split-button alpha-active omega-tooltip-text="More calling options"> Alpha active </dt-split-button>
<dt-split-button omega-active omega-tooltip-text="More calling options"> Omega active </dt-split-button>
'
showHtmlWarning />

## Sizes

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button size="xs" omega-tooltip-text="More calling options"> xs </dt-split-button>
    <dt-split-button size="sm" omega-tooltip-text="More calling options"> sm </dt-split-button>
    <dt-split-button size="md" omega-tooltip-text="More calling options"> md </dt-split-button>
    <dt-split-button size="lg" omega-tooltip-text="More calling options"> lg </dt-split-button>
    <dt-split-button size="xl" omega-tooltip-text="More calling options"> xl </dt-split-button>
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
<dt-split-button size="xs" omega-tooltip-text="More calling options"> xs </dt-split-button>
<dt-split-button size="sm" omega-tooltip-text="More calling options"> sm </dt-split-button>
<dt-split-button size="md" omega-tooltip-text="More calling options"> md </dt-split-button>
<dt-split-button size="lg" omega-tooltip-text="More calling options"> lg </dt-split-button>
<dt-split-button size="xl" omega-tooltip-text="More calling options"> xl </dt-split-button>
'
showHtmlWarning />

## Loading

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button alpha-loading omega-tooltip-text="More calling options"> Place call </dt-split-button>
    <dt-split-button alpha-loading importance="outlined" omega-tooltip-text="More calling options"> Place call </dt-split-button>
    <dt-split-button alpha-loading importance="clear" omega-tooltip-text="More calling options"> Place call </dt-split-button>
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
<dt-split-button alpha-loading omega-tooltip-text="More calling options"> Place call </dt-split-button>
<dt-split-button alpha-loading importance="outlined" omega-tooltip-text="More calling options"> Place call </dt-split-button>
<dt-split-button alpha-loading importance="clear" omega-tooltip-text="More calling options"> Place call </dt-split-button>
'
showHtmlWarning />

## Icon support

### Icon and label

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button importance="outlined" omega-tooltip-text="More calling options">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" alpha-icon-position="top" omega-tooltip-text="More calling options">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" alpha-icon-position="right" omega-tooltip-text="More calling options">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" alpha-icon-position="bottom" omega-tooltip-text="More calling options">
      <template #alphaIcon="{ size }">
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
<dt-split-button importance="outlined" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="top" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="right" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="bottom" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
'
showHtmlWarning />

### Icon only

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-split-button omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="outlined" kind="muted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="clear" kind="danger" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
      <template #alphaIcon="{ size }">
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
<dt-split-button omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="muted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="danger" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
'
showHtmlWarning />

<code-well-header bgclass="d-bgc-contrast">
  <dt-stack direction="row" gap="400">
    <dt-split-button kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="outlined" kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="clear" kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
      <template #alphaIcon="{ size }">
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
<dt-split-button kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="splitButton" />

## Accessibility

In addition to the [Button component's](button.md#accessibility) accessibility documentation:

- An icon-only primary action and the secondary action require a [Tooltip](tooltip.md) to indicate its function.
- While the secondary action is focused, pressing `Enter` or `Space` triggers its action, displaying a [Dropdown component](dropdown.md) or [Popover component](popover.md).z

## Classes

<component-class-table component-name="split-button" />
