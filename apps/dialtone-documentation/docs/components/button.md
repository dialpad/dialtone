---
title: Button
description: A button is an UI element which signals key actions to take an action throughout an app. It is important a button is identifiable, consistent, communicates its actions clearly, and is appropriately sized to its action.
status: ready
thumb: true
image: assets/images/components/button.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-button--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=19800-32233
---

<div class="dialtone-playground" :class="{ 'dialtone-playground--fullscreen': isFullscreen }">
  <div class="dialtone-playground__start">
    <div class="dialtone-playground__component">
      <div class="dialtone-playground__fullscreen-toggle">
        <dt-button @click="toggleFullscreen" v-dt-tooltip="`Fullscreen`" kind="muted" importance="clear" size="sm">
          <template #icon="{ iconSize }">
            <dt-icon
              :name="isFullscreen ? 'minimize' : 'expand'"
              :size="iconSize"
            />
          </template>
        </dt-button>
      </div>
      <dt-button
        ref="component-default"
        :size="buttonSize"
        :importance="buttonImportance"
        :kind="buttonKind"
        :active="isActive"
        :iconPosition="iconPosition"
        :circle="isCircle"
        :link="isLink"
        :linkKind="linkKind"
        :linkInverted="isLinkInverted"
        :loading="isLoading"
        :disabled="isDisabled"
        :labelClass="buttonLabelClass"
      >
        <template v-if="hasIcon" #icon="{ iconSize }">
          <dt-icon
            :name="iconName"
            :size="iconSize"
          />
        </template>
        {{ buttonLabel }}
      </dt-button>
    </div>
    <div class="dialtone-playground__controls" v-dt-scrollbar>
      <dt-stack gap="500">
        <h2 v-show="isFullscreen" class="d-headline--lg">Button</h2>
        <dt-input v-model="buttonLabel" label="Label" type="text" size="sm" />
        <dt-input v-model="buttonLabelClass" label="Label class" type="text" size="sm" />
        <dt-select-menu
          :disabled="isLink"
          v-model="buttonSize"
          size="sm"
          :options="[
            { value: `xs`, label: `xs` },
            { value: `sm`, label: `sm` },
            { value: `md`, label: `md` },
            { value: `lg`, label: `lg` },
            { value: `xl`, label: `xl` },
          ]"
          label="Size"
        />
        <dt-select-menu
          :disabled="isLink"
          v-model="buttonImportance"
          size="sm"
          :options="[
            { value: `clear`, label: `clear` },
            { value: `outlined`, label: `outlined` },
            { value: `primary`, label: `primary` },
          ]"
          label="Importance"
        />
        <dt-select-menu
          :disabled="isLink"
          v-model="buttonKind"
          size="sm"
          :options="[
            { value: `default`, label: `default` },
            { value: `muted`, label: `muted` },
            { value: `danger`, label: `danger` },
            { value: `positive`, label: `positive` },
            { value: `inverted`, label: `inverted` },
            { value: `unstyled`, label: `unstyled` },
          ]"
          label="Kind"
        />
        <dt-toggle :disabled="isLink" v-model="isActive" labelClass="d-label--sm d-fc-secondary" size="sm" wrapperClass="d-jc-space-between">
          Active
        </dt-toggle>
        <dt-stack gap="400">
          <dt-toggle
            :disabled="isLink"
            v-model="hasIcon"
            labelClass="d-label--sm d-fc-secondary"
            size="sm"
            wrapperClass="d-jc-space-between"
          >
            Icon
          </dt-toggle>
          <dt-select-menu
            :disabled="isLink"
            v-model="iconName"
            v-show="hasIcon"
            size="sm"
            labelClass="d-vi-visible-sr"
            :options="[
              { value: `activity`, label: `activity` },
              { value: `add-task`, label: `add-task` },
              { value: `agent-assist`, label: `agent-assist` },
              { value: `ai-notes`, label: `ai-notes` },
              { value: `ai-write`, label: `ai-write` },
              { value: `airplay`, label: `airplay` },
              { value: `airtable`, label: `airtable` },
              { value: `alarm-check`, label: `alarm-check` },
              { value: `alarm-clock-off`, label: `alarm-clock-off` },
              { value: `alarm-minus`, label: `alarm-minus` },
              { value: `alarm-plus`, label: `alarm-plus` },
              { value: `album`, label: `album` },
              { value: `alert-circle`, label: `alert-circle` },
              { value: `alert-triangle`, label: `alert-triangle` },
              { value: `align-center`, label: `align-center` },
              { value: `align-justify`, label: `align-justify` },
              { value: `align-left`, label: `align-left` },
              { value: `align-right`, label: `align-right` },
              { value: `amex`, label: `amex` },
              { value: `app-store-badge`, label: `app-store-badge` },
              { value: `apple`, label: `apple` },
              { value: `archive`, label: `archive` },
              { value: `archive-restore`, label: `archive-restore` },
              { value: `arrow-down`, label: `arrow-down` },
              { value: `arrow-down-left`, label: `arrow-down-left` },
              { value: `arrow-down-right`, label: `arrow-down-right` },
              { value: `arrow-left`, label: `arrow-left` },
              { value: `arrow-left-right`, label: `arrow-left-right` },
              { value: `arrow-right`, label: `arrow-right` },
              { value: `arrow-up`, label: `arrow-up` },
              { value: `...`, label: `...` },
              { value: `zoom-in`, label: `zoom-in` },
              { value: `zoom-out`, label: `zoom-out` },
            ]"
            label="Icon name"
          />
        </dt-stack>
        <dt-select-menu
          :disabled="isLink"
          v-model="iconPosition"
          v-show="hasIcon"
          size="sm"
          :options="[
            { value: `left`, label: `left` },
            { value: `right`, label: `right` },
            { value: `top`, label: `top` },
            { value: `bottom`, label: `bottom` },
          ]"
          label="Icon Position"
        />
        <dt-toggle :disabled="isLink" v-model="isIconOnly" v-show="hasIcon" labelClass="d-label--sm d-fc-secondary" size="sm" wrapperClass="d-jc-space-between">
          Icon only
        </dt-toggle>
        <dt-toggle :disabled="isLink" v-model="isCircle" v-show="isIconOnly" labelClass="d-label--sm d-fc-secondary" size="sm" wrapperClass="d-jc-space-between">
          Circle
        </dt-toggle>
        <dt-toggle v-model="isLink" v-show="!hasIcon" labelClass="d-label--sm d-fc-secondary" size="sm" wrapperClass="d-jc-space-between">
          Link
        </dt-toggle>
        <dt-select-menu
          v-model="linkKind"
          v-show="isLink && !hasIcon"
          size="sm"
          :options="[
            { value: `default`, label: `default` },
            { value: `warning`, label: `warning` },
            { value: `danger`, label: `danger` },
            { value: `success`, label: `success` },
            { value: `muted`, label: `muted` },
            { value: `mention`, label: `mention` },
          ]"
          label="Link Kind"
        />
        <dt-toggle v-model="isLinkInverted" v-show="isLink && !hasIcon" labelClass="d-label--sm d-fc-secondary" size="sm" wrapperClass="d-jc-space-between">
          Link Inverted
        </dt-toggle>
        <dt-toggle :disabled="isLink" v-model="isLoading" labelClass="d-label--sm d-fc-secondary" size="sm" wrapperClass="d-jc-space-between">
          Loading
        </dt-toggle>
        <dt-toggle v-model="isDisabled" labelClass="d-label--sm d-fc-secondary" size="sm" wrapperClass="d-jc-space-between">
          Disabled
        </dt-toggle>
      </dt-stack>
    </div>
  </div>
  <div class="dialtone-playground__end">
<code-example-tabs
:vueCode="dynamicVueCode"
:htmlCode="dynamicHtmlCode"
showHtmlWarning />
  </div>
</div>

<!-- <component-combinator component-name="DtButton" /> -->

## Usage

- `<button>` and link (`<a>`) HTML elements each describe a specific intent. Understanding the distinction is important: if it goes somewhere, it's a link (`<a>`). If an action occurs, use a Button (`<button>`).
- Avoid using too many buttons on a page.
- Set the `type` attribute to define its purpose: `submit`, `button`, or `reset`. Browsers default to `submit` if it isn't defined, and that cannot be assumed as the preferred behavior.

<dialtone-usage>
<template #do>

- Conveying that an action that will occur when invoked.
- To trigger an action or behavior, such as submitting a form or spawning a [Modal](modal.md).

</template>
<template #dont>

- Avoid using to navigate between destinations, deferring to a [Link](link.md) instead).

</template>
</dialtone-usage>

## Writing Guidelines

Button labels should be clear and predictable so users have confidence in their actions.

- Lead with a strong verb and use **verb + noun** structure except for common actions like “Done,” “Close,” “Cancel,” or “OK”
- Should be sentence case
- Do not use punctuation
- Avoid unnecessary articles such as “the,” “an,” and “a.”

<dialtone-usage>
<template #do>

- Add number
- Create menu

</template>
<template #dont>

- Add Number
- Create a menu

</template>
</dialtone-usage>

## Variants

Dialtone provides five options for `kind`, with three levels of `importance`.

<ButtonVariantsTable></ButtonVariantsTable>

### Default

The base button should be the go-to button for most of your needs. When in doubt, use this style. To help provide clarity to users, it is generally recommended to use only one primary button style within a section or page.

<code-well-header>
  <dt-stack direction="row" gap="400">
      <button class="d-btn d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
      <button class="d-btn d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
      <button class="d-btn" type="button"><span class="d-btn__label">Place Call</span></button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--primary" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--outlined" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button> Place Call </dt-button>
<dt-button importance="outlined"> Place Call </dt-button>
<dt-button importance="clear"> Place Call </dt-button>
'
showHtmlWarning />

### Danger

The danger button style is used to communicate critical or destructive actions such as deleting content, accounts, or canceling services.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <button class="d-btn d-btn--danger d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
    <button class="d-btn d-btn--danger d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
    <button class="d-btn d-btn--danger" type="button"><span class="d-btn__label">Place Call</span></button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--danger d-btn--primary" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--danger d-btn--outlined" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--danger" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button kind="danger"> Place Call </dt-button>
<dt-button kind="danger" importance="outlined"> Place Call </dt-button>
<dt-button kind="danger" importance="clear"> Place Call </dt-button>
'
showHtmlWarning />

### Positive

The positive button style is used to communicate positive actions.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-button kind="positive">Place Call</dt-button>
    <dt-button kind="positive" importance="outlined">Place Call</dt-button>
    <dt-button kind="positive" importance="clear">Place Call</dt-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--positive d-btn--primary" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--positive d-btn--outlined" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--positive" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button kind="positive"> Place Call </dt-button>
<dt-button kind="positive" importance="outlined"> Place Call </dt-button>
<dt-button kind="positive" importance="clear"> Place Call </dt-button>
'
showHtmlWarning />

### Inverted

The inverted button style is used to visually separate buttons set on darker backgrounds.

<code-well-header bgclass="d-bgc-contrast">
  <dt-stack direction="row" gap="400">
    <button class="d-btn d-btn--inverted d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
    <button class="d-btn d-btn--inverted d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
    <button class="d-btn d-btn--inverted" type="button"><span class="d-btn__label">Place Call</span></button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--inverted d-btn--primary" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--inverted d-btn--outlined" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--inverted" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button kind="inverted"> Place Call </dt-button>
<dt-button kind="inverted" importance="outlined"> Place Call </dt-button>
<dt-button kind="inverted" importance="clear"> Place Call </dt-button>
'
showHtmlWarning />

### Muted

The muted button style is used to communicate non-primary actions for contexts in which the base style may not work
(e.g. colored backgrounds, validation components, etc).
This style’s use should be rare. When in doubt, use the [default button style](#default).

<code-well-header>
  <dt-stack direction="row" gap="400">
    <button class="d-btn d-btn--muted" type="button"><span class="d-btn__label">Place Call</span></button>
    <button class="d-btn d-btn--muted d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--muted" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--muted d-btn--outlined" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button kind="muted" importance="clear"> Place Call </dt-button>
<dt-button kind="muted" importance="outlined"> Place Call </dt-button>
'
showHtmlWarning />

### Disabled

Buttons can be disabled using either the `disabled` attribute or a Dialtone class. Use the attribute when a button should appear disabled and not recieve focus; use the class when a button should appear disabled but still recieve focus (i.e. a disabled button with a tooltip). Using the class also requires `aria-disabled` and a wrapper to display the "not allowed" pointer. Additional javascript implementation is required to prevent the click event.
All button styles and variations appear the same when disabled.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <span>
      <dt-button disabled>Place Call (disabled attribute)</dt-button>
    </span>
    <span>
      <span class="d-c-not-allowed">
        <dt-button class="d-btn--disabled">Place Call (disabled class)</dt-button>
      </span>
    </span>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<!-- disabled attribute -->
<button class="d-btn" type="button" disabled><span class="d-btn__label">...</span></button>
<!-- disabled class -->
<span class="d-c-not-allowed">
  <button type="button" class="base-button__button d-btn d-btn--primary d-btn--disabled"><span class="d-btn__label base-button__label">...</span></button>
</span>
'
vueCode='
<!-- disabled attribute -->
<dt-button disabled>Place Call</dt-button>
<!-- disabled class -->
<span class="d-c-not-allowed">
  <dt-button class="d-btn--disabled">Place Call</dt-button>
</span>
'
showHtmlWarning />

### Active

Buttons can be set to active state using the `active` prop or `.d-btn--active` Dialtone class.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <dt-button importance="clear" active>Place Call</dt-button>
    <dt-button active>Place Call</dt-button>
    <dt-button kind="danger" importance="clear" active>Place Call</dt-button>
    <dt-button kind="positive" importance="clear" active>Place Call</dt-button>
    <dt-button kind="inverted" active>Place Call</dt-button>
    <dt-button kind="muted" active>Place Call</dt-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--danger d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--positive d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--inverted d-btn--primary d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary d-btn--muted d-btn--active" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button importance="clear" active>Place Call</dt-button>
<dt-button active>Place Call</dt-button>
<dt-button kind="danger" importance="clear" active>Place Call</dt-button>
<dt-button kind="positive" importance="clear" active>Place Call</dt-button>
<dt-button kind="inverted" active>Place Call</dt-button>
<dt-button kind="muted" active>Place Call</dt-button>
'
showHtmlWarning />

### Link

Buttons can be styled as a [Link](link.md) in situations for which you need the appearance of a link but behavior of a button. Using the `button` element provides a better accessibility experience.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <dt-button link>Place Call</dt-button>
    <dt-button link linkKind="warning">Place Call</dt-button>
    <dt-button link linkKind="danger">Place Call</dt-button>
    <dt-button link linkKind="success">Place Call</dt-button>
    <dt-button link linkKind="muted">Place Call</dt-button>
    <dt-button link disabled>Place Call</dt-button>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-link" type="button"> <span class="d-btn__label">Place Call</span></button>
<button class="d-link d-link--warning" type="button"> <span class="d-btn__label">Place Call</span></button>
<button class="d-link d-link--danger" type="button"> <span class="d-btn__label">Place Call</span></button>
<button class="d-link d-link--success" type="button"> <span class="d-btn__label">Place Call</span></button>
<button class="d-link d-link--muted" type="button"> <span class="d-btn__label">Place Call</span></button>
<button class="d-link" type="button" disabled=""> <span class="d-btn__label">Place Call</span></button>
'
vueCode='
<dt-button link>Place Call</dt-button>
<dt-button link linkKind="warning">Place Call</dt-button>
<dt-button link linkKind="danger">Place Call</dt-button>
<dt-button link linkKind="success">Place Call</dt-button>
<dt-button link linkKind="muted">Place Call</dt-button>
<dt-button link disabled>Place Call</dt-button>
'
showHtmlWarning />

### Unstyled

The unstyled button removes all default Dialtone styling while preserving the semantic HTML `<button>` element and maintaining proper button behavior and accessibility.

<code-well-header>
    <dt-button kind="unstyled">Place Call</dt-button>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn--unstyled" type="button">Place Call</button>
'
vueCode='
<dt-button kind="unstyled">Place Call</dt-button>
'
showHtmlWarning />

## Split Button

The [Split Button](split-button.md) is its own component containing multiple buttons.

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

## Sizes

The base button font size is 16px and should be used in most cases. Every button style can accept size classes, though we only provide a few possible examples.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <span>
      <dt-button size="xs"> Place Call </dt-button>
    </span>
    <span>
      <dt-button size="sm"> Place Call </dt-button>
    </span>
    <span>
      <dt-button> Place Call </dt-button>
    </span>
    <span>
      <dt-button size="lg"> Place Call </dt-button>
    </span>
    <span>
      <dt-button size="xl"> Place Call </dt-button>
    </span>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--primary d-btn--xs" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary d-btn--sm" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary d-btn--lg" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary d-btn--xl" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button size="xs"> Place Call </dt-button>
<dt-button size="sm"> Place Call </dt-button>
<dt-button> Place Call </dt-button>
<dt-button size="lg"> Place Call </dt-button>
<dt-button size="xl"> Place Call </dt-button>
'
showHtmlWarning />

## Loading

Loading buttons are useful for communicating a delay between the button interaction and its action taking place. Every button style can accept the loading button class, though we only provide a few possible examples.

<code-well-header>
  <dt-stack
    gap="600"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <dt-stack direction="row" gap="400">
      <dt-button loading> Place Call </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" loading>
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle loading>
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-button kind="muted" importance="outlined" loading> Place Call </dt-button>
      <dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" loading>
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" circle loading>
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--loading d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
<button class="d-btn d-btn--loading d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
<button class="d-btn d-btn--danger d-btn--loading" type="button"><span class="d-btn__label">Place Call</span></button>
'
vueCode='
<dt-button loading> Place Call </dt-button>
<dt-button v-dt-tooltip="`Tooltip`" loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button kind="muted" importance="outlined" loading> Place Call </dt-button>
<dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" circle loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
'
showHtmlWarning />

## Icon Support

### Icon and Label

Button labels can include an icon next to the text. Every button style can accept icon classes, though we only provide a few possible examples. `icon-position` can be `left` (default), `right`, `top`, `bottom`.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <span>
      <dt-button importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
        Label
      </dt-button>
    </span>
    <span>
      <dt-button importance="outlined" icon-position="top">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
        Label
      </dt-button>
    </span>
    <span>
      <dt-button importance="outlined" icon-position="bottom">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
        Label
      </dt-button>
    </span>
    <span>
      <dt-button importance="outlined" icon-position="right">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
        Label
      </dt-button>
    </span>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--outlined" type="button">
  <span class="d-btn__icon d-btn__icon--left">...</span>
  <span class="d-btn__label">...</span>
</button>
<button class="d-btn d-btn--vertical d-btn--outlined" type="button">
  <span class="d-btn__icon d-btn__icon--top">...</span>
  <span class="d-btn__label">...</span>
</button>
<button class="d-btn d-btn--outlined" type="button">
  <span class="d-btn__icon d-btn__icon--right">...</span>
  <span class="d-btn__label">...</span>
</button>
'
vueCode='
<dt-button importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
<dt-button importance="outlined" icon-position="top">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
<dt-button importance="outlined" icon-position="bottom">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
<dt-button importance="outlined" icon-position="right">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
'
showHtmlWarning />

### Icon Only

Icon-only buttons are commonly used for toggling actions, navigation, or closing UI elements.

<code-well-header>
  <dt-stack
    gap="600"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <dt-stack direction="row" gap="400">
      <dt-button v-dt-tooltip="`Tooltip`" kind="muted" importance="clear">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" kind="muted" importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-button v-dt-tooltip="`Tooltip`" importance="clear">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-button v-dt-tooltip="`Tooltip`" kind="danger" importance="clear">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" kind="danger" importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" kind="danger">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-button v-dt-tooltip="`Tooltip`" importance="clear" kind="positive">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" importance="outlined" kind="positive">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" kind="positive">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-bgc-contrast d-p8">
      <dt-button v-dt-tooltip="`Tooltip`" kind="inverted" importance="clear">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" kind="inverted" importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" kind="inverted">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--icon-only" type="button">...</button>
<button class="d-btn d-btn--icon-only d-btn--outlined" type="button">...</button>
'
vueCode='
<dt-button v-dt-tooltip="`Tooltip`" kind="muted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="muted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="danger" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="danger" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="danger">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="clear" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="outlined" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="inverted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="inverted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="inverted">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
'
showHtmlWarning />

#### Circle

The following styles are available as a circle shape.

<code-well-header>
  <dt-stack
    gap="600"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <dt-stack direction="row" gap="400">
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="muted" importance="clear">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="muted" importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="danger" importance="clear">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="danger" importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="danger">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-button v-dt-tooltip="`Tooltip`" circle importance="clear" kind="positive">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle importance="outlined" kind="positive">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="positive">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-bgc-contrast d-p8">
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted" importance="clear">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted" importance="outlined">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
      <dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted">
        <template #icon>
          <dt-icon
            name="phone"
            size="300"
          />
        </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--circle btn--inverted" type="button">...</button>
<button class="d-btn d-btn--circle btn--inverted d-btn--outlined" type="button">...</button>
<button class="d-btn d-btn--circle btn--inverted d-btn--primary" type="button">...</button>
'
vueCode='
<dt-button v-dt-tooltip="`Tooltip`" circle kind="muted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="muted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="danger" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="danger" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="danger">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle importance="clear" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle importance="outlined" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
'
showHtmlWarning />

## Branded

We provide the following branded buttons for log-in and sign-up workflows.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <span><button class="d-btn d-btn--brand d-btn--google d-w100p" type="button"><span class="d-btn__icon"><dt-icon name="google-glyph" /></span><span class="d-btn__label">Log in with Google</span></button></span>
    <span><button class="d-btn d-btn--brand d-btn--o365 d-w100p" type="button"><span class="d-btn__icon"><dt-icon name="office-365" /></span><span class="d-btn__label">Log in with Office365</span></button></span>
    <span><button class="d-btn d-btn--brand d-btn--linkedin d-w100p" type="button"><span class="d-btn__icon"><dt-icon name="linkedin" /></span><span class="d-btn__label">Log in with LinkedIn</span></button></span>
  </dt-stack>
</code-well-header>

```html
<button class="d-btn d-btn--brand d-btn--google" type="button">
  <span class="d-btn__icon"><icon-google-glyph /></span>
  <span class="d-btn__label">Log in with Google</span>
</button>
<button class="d-btn d-btn--brand d-btn--o365" type="button">
  <span class="d-btn__icon"><icon-google-glyph /></span>
  <span class="d-btn__label">Log in with Office365</span>
</button>
<button class="d-btn d-btn--brand d-btn--linkedin" type="button">
  <span class="d-btn__icon"><icon-google-glyph /></span>
  <span class="d-btn__label">Log in with LinkedIn</span>
</button>
```

## Vue API

<component-vue-api component-name="button" />

## Accessibility

- Choosing between Link and Button elements is paramount for screenreaders to inform the user what will occur. For example: will it go somewhere (Link) or will something happen (Button)?
- Do not rely on color alone to convey the intent of the button. Defer to the button text as primary way to convey the buttons intent.
- Display a visible focus state when users tab to them.
- Use standard semantic usage of HTML elements.
- Be aware of how screenreaders handle buttons and links differently. For example, both the `Enter` and `Space` keys triggers a button, while links are triggered only by the `Enter` key.
- If it is a button type while focused:
  - Pressing the `Enter` or `Space` key should trigger the action.
  - Pressing the `Tab` key moves focus to the next focusable element.
  - Pressing the `Shift+Tab` key moves focus to the previous focusable element.
- If a button cannot be used for an action and it must be an anchor link, two things are required:
  - Add `role="button"` to the `<a>` to allow screenreaders to announce it as a `button`.
  - Attach an event handler to detect Spacebar keypress. Buttons react to both Enter and Spacebar, but Link reacts only to Enter.

## Classes

<component-class-table component-name="button"></component-class-table>

<script setup>
import ButtonVariantsTable from '@baseComponents/ButtonVariantsTable.vue';
import { ref, watch, computed } from 'vue';

// Playground reactive data
const hasIcon = ref(false);
const isLink = ref(false);
const isFullscreen = ref(false);
const buttonLabel = ref('Place Call');
const buttonLabelClass = ref('');
const buttonSize = ref('xs');
const buttonImportance = ref('primary');
const buttonKind = ref('default');
const iconName = ref('activity');
const iconPosition = ref('left');
const linkKind = ref('default');
const isActive = ref(false);
const isIconOnly = ref(false);
const isCircle = ref(false);
const isLinkInverted = ref(false);
const isLoading = ref(false);
const isDisabled = ref(false);

// Store previous label for restoration
let previousLabel = '';

// Toggle fullscreen mode
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// Two-way sync between icon only and button label
watch(isIconOnly, (newValue) => {
  if (newValue) {
    // When icon only is turned on, save current label and clear it
    previousLabel = buttonLabel.value;
    buttonLabel.value = '';
  } else {
    // When icon only is turned off, restore the previous label and turn off circle
    if (previousLabel) {
      buttonLabel.value = previousLabel;
    }
    isCircle.value = false;
  }
});

watch(buttonLabel, (newValue) => {
  if (newValue && newValue.trim() !== '') {
    // When label has content, turn off icon only
    isIconOnly.value = false;
  }
});

// Computed property for dynamic Vue code generation
const dynamicVueCode = computed(() => {
  const props = [];

  // Always show core button props
  props.push(`  size="${buttonSize.value}"`);
  props.push(`  importance="${buttonImportance.value}"`);
  props.push(`  kind="${buttonKind.value}"`);

  // Add active if true
  if (isActive.value) {
    props.push(`  active`);
  }

  // Add icon-related props
  if (hasIcon.value) {
    if (iconPosition.value !== 'left') {
      props.push(`  iconPosition="${iconPosition.value}"`);
    }
    if (isCircle.value) {
      props.push(`  circle`);
    }
  }

  // Add link-related props
  if (isLink.value) {
    props.push(`  link`);
    if (linkKind.value !== 'default') {
      props.push(`  linkKind="${linkKind.value}"`);
    }
    if (isLinkInverted.value) {
      props.push(`  linkInverted`);
    }
  }

  // Add loading if true
  if (isLoading.value) {
    props.push(`  loading`);
  }

  // Add disabled if true
  if (isDisabled.value) {
    props.push(`  disabled`);
  }

  // Add labelClass if not empty
  if (buttonLabelClass.value && buttonLabelClass.value.trim() !== '') {
    props.push(`  labelClass="${buttonLabelClass.value}"`);
  }

  const propsString = props.length > 0 ? '\n' + props.join('\n') + '\n' : '';
  const iconTemplate = hasIcon.value ? `\n  <template #icon="{ iconSize }">\n    <dt-icon\n      name="${iconName.value}"\n      :size="iconSize"\n    />\n  </template>` : '';
  const labelContent = buttonLabel.value || 'Place Call';

  return `<dt-button${propsString}>${iconTemplate}\n  ${labelContent}\n</dt-button>`;
});

// Computed property for dynamic HTML code generation
const dynamicHtmlCode = computed(() => {
  const classNames = ['base-button', 'base-button__button'];

  // Add size class
  if (buttonSize.value) {
    classNames.push(`d-btn--${buttonSize.value}`);
  }

  // Add importance class
  if (buttonImportance.value && buttonImportance.value !== 'primary') {
    classNames.push(`d-btn--${buttonImportance.value}`);
  } else if (buttonImportance.value === 'primary') {
    classNames.push('d-btn--primary');
  }

  // Add kind class
  if (buttonKind.value && buttonKind.value !== 'default') {
    classNames.push(`d-btn--${buttonKind.value}`);
  }

  // Add state classes
  if (isActive.value) {
    classNames.push('d-btn--active');
  }

  if (isCircle.value) {
    classNames.push('d-btn--circle');
  }

  if (isLink.value) {
    classNames.push('d-btn--link');
    if (linkKind.value && linkKind.value !== 'default') {
      classNames.push(`d-btn--link-${linkKind.value}`);
    }
    if (isLinkInverted.value) {
      classNames.push('d-btn--link-inverted');
    }
  }

  if (isLoading.value) {
    classNames.push('d-btn--loading');
  }

  // Build attributes
  const attributes = [];
  if (isDisabled.value) {
    attributes.push('disabled="disabled"');
  }
  attributes.push('type="button"');

  const classAttr = `class="${classNames.join(' ')}"`;
  const attributesString = [classAttr, ...attributes].join(' ');

  // Build content
  let content = '';
  if (hasIcon.value) {
    const iconHtml = `<svg>...</svg>`;
    if (isIconOnly.value) {
      content = iconHtml;
    } else {
      const labelSpan = `<span class="base-button__label${buttonLabelClass.value ? ' ' + buttonLabelClass.value : ''}">${buttonLabel.value || 'Place Call'}</span>`;
      content = iconPosition.value === 'right' ? `${labelSpan}\n  ${iconHtml}` : `${iconHtml}\n  ${labelSpan}`;
    }
  } else {
    content = `<span class="base-button__label${buttonLabelClass.value ? ' ' + buttonLabelClass.value : ''}">${buttonLabel.value || 'Place Call'}</span>`;
  }

  return `<button ${attributesString}>\n  ${content}\n</button>`;
});
</script>

<style lang="less">
.dialtone-playground {
  & {
    display: flex;
    flex-direction: column;
  }

  &__start {
    flex-grow: 1;
  }

  &__end {
    .dialtone-playground--fullscreen & {
      background-color: var(--dt-color-surface-secondary-opaque);
      height: 33vh;
    }
  }

  &--fullscreen {
    position: fixed;
    inset: 0;
    z-index: var(--zi-modal-element);
    background-color: var(--dt-color-surface-secondary);
  }

  &__start {
    background-color: var(--dt-color-surface-secondary);
    display: flex;
    flex-direction: row;
    border-radius: var(--dt-size-radius-400);
    overflow: hidden;

    .dialtone-playground--fullscreen & {
      border-bottom: 1px solid var(--dt-color-border-subtle)
    }
  }

  &__component {
    padding: var(--dt-space-500);
    display: grid;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-height: var(--dt-size-925);
    position: relative;
  }

  &__fullscreen-toggle {
    position: absolute;
    inset-block-start: var(--dt-space-400);
    inset-inline-end: var(--dt-space-400);
  }

  &__controls {
    padding: var(--dt-space-500);
    background-color: var(--dt-color-surface-secondary-opaque);
    width: var(--dt-size-875);
    max-height: var(--dt-size-950);

    .dialtone-playground--fullscreen & {
      max-height: 100%;
      width: var(--dt-size-900);
    }
  }
}
</style>
