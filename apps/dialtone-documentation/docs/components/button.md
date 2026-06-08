---
title: Button
description: A button is an UI element which signals key actions to take an action throughout an app. It is important a button is identifiable, consistent, communicates its actions clearly, and is appropriately sized to its action.
status: ready
thumb: true
image: assets/images/components/button.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-button--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=19800-32233
---

<code-well-header>
  <dt-button> Place Call </dt-button>
</code-well-header>

<!-- <component-combinator component-name="DtButton" /> -->

## Usage

- `<button>` and link (`<a>`) HTML elements each describe a specific intent. Understanding the distinction is important: if it goes somewhere, it's a link (`<a>`). If an action occurs, use a Button (`<button>`). When you need **button styling with navigation behavior** (CTAs, toolbar actions that navigate), use DtButton's `href` or `to` props — see [Navigation](#navigation).
- Avoid using too many buttons on a page.
- Set the `type` attribute to define its purpose: `submit`, `button`, or `reset`. Browsers default to `submit` if it isn't defined, and that cannot be assumed as the preferred behavior.

<dialtone-usage>
<template #do>

- Conveying that an action that will occur when invoked.
- To trigger an action or behavior, such as submitting a form or spawning a [Modal](modal.md).

</template>
<template #dont>

- Avoid using to navigate between destinations, deferring to a [Link](link.md) instead. Exception: use DtButton with `href` or `to` when button styling is intentional (e.g. CTAs, toolbar actions).

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

Dialtone provides five options for `kind`, with three levels of `importance`. Use `kind="primary"` for the main call to action, `kind="danger"` for destructive actions, `kind="muted"` for secondary actions, `kind="clear"` for low-emphasis actions, and `kind="link"` for navigation-style buttons. The DtButton `kind` prop controls the visual hierarchy and semantic meaning of the action.

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

Buttons can be disabled using the `disabled` attribute or the Dialtone class, `d-btn--disabled`. Use the attribute when a button should appear disabled and not receive focus; use the class when a button should appear disabled but still receive focus (i.e. a disabled button with a tooltip).

When using the raw HTML instead of the Vue component , it requires `aria-disabled`, and additional javascript implementation is required to prevent events.

<code-well-header>
  <dt-stack gap="500">
    <dt-toggle v-model="isDisabled" size="sm" wrapperClass="d-g8 d-m-auto">Disabled</dt-toggle>
    <dt-stack gap="400" ref="disabledButtons">
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled"> Place Call </dt-button>
        <dt-button :disabled="isDisabled" importance="outlined"> Place Call </dt-button>
        <dt-button :disabled="isDisabled" importance="clear"> Place Call </dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="danger"> Place Call </dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="outlined"> Place Call </dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="clear"> Place Call </dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="positive">Place Call</dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="outlined">Place Call</dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="clear">Place Call</dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="muted" importance="clear"> Place Call </dt-button>
        <dt-button :disabled="isDisabled" kind="muted" importance="outlined"> Place Call </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledButtons'
vueCode='
<dt-button disabled {props}>Place Call</dt-button>
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

## Navigation

DtButton can render as an `<a>` or `<router-link>` for cases where you need button styling with navigation behavior.

- **Navigating within the app?** Use `to`. Renders `<router-link>` for client-side navigation without page reloads.
- **Linking to an external site?** Use `href`. Renders `<a>` for standard browser navigation.
- **Triggering an action?** Use neither. Renders `<button>` (default).

### href

Pass `href` to render as an `<a>` element. Use `target="_blank"` and `rel="noopener noreferrer"` for external links.

<code-well-header>
  <dt-button
    href="https://dialtone.dialpad.com"
    target="_blank"
    rel="noopener noreferrer"
    kind="muted"
    importance="outlined"
    size="sm"
    icon-position="right"
    ref="hrefExample1"
  >
    <template #icon="{ iconSize }">
      <dt-icon name="external-link" :size="iconSize" />
    </template>
    Dialtone
  </dt-button>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.hrefExample1'
vueCode='
<dt-button
  href="<https://dialtone.dialpad.com>"
  target="_blank"
  rel="noopener noreferrer"
  kind="muted"
  importance="outlined"
  size="sm"
  icon-position="right"
>
  <template #icon="{ iconSize }">
    <dt-icon name="external-link" :size="iconSize" />
  </template>
  Dialtone
</dt-button>
'
showHtmlWarning />

### to

Pass `to` to render as `<router-link>` for internal client-side SPA navigation. Use `replace` to navigate without adding a history entry.

<code-well-header>
  <dt-button to="/" kind="default" size="xs" ref="toExample2">
    Home
  </dt-button>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.toExample1'
vueCode='
<dt-button to="/" kind="default" size="xs">
  Home
</dt-button>
'
/>

### Migration

If you have existing `<a class="d-btn">` or `<router-link class="d-btn">` workarounds, replace them with DtButton props:

<code-example-tabs
vueCode='
<!-- Before: raw <a> with manual d-btn classes -->
<a
  class="d-btn d-btn--primary d-btn--outlined d-btn--sm"
  href="<https://example.com>"
  target="_blank"
  rel="noopener noreferrer"
>
  Link Text
</a>

<!-- After: DtButton with href prop -->
<dt-button
  href="<https://example.com>"
  target="_blank"
  rel="noopener noreferrer"
  importance="outlined"
  size="sm"
>
  Link Text
</dt-button>
'
/>

<code-example-tabs
vueCode='
<!-- Before: raw <router-link> with manual d-btn classes -->
<router-link
  class="d-btn d-btn--primary d-btn--sm"
  :to="roomPath"
>
  Join Room
</router-link>

<!-- After: DtButton with to prop -->
<dt-button :to="roomPath" size="sm">
  Join Room
</dt-button>
'
/>

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

The default button size is `md`, but does not need to be explicitly specified.

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

## Loading

Loading buttons are useful for communicating a delay between the button interaction and its action taking place. Every button style can accept the loading button class, though we only provide a few possible examples. When `loading` is true, DtButton replaces the label with a spinner animation, indicating an async operation (such as form submit) is in progress. The spinner is centered within the button and the button remains disabled until loading is false.

### Replace button label

The width of the button remains determined by the length of the label, which is visually hidden in this state.

<code-well-header>
  <dt-stack gap="500" align="center">
    <dt-toggle size="sm" v-model="loading" wrapperClass="d-g8">
      Loading
    </dt-toggle>
    <dt-stack
      gap="600"
      :direction="{ 'default': 'column', 'md': 'row' }"
    >
      <dt-stack direction="row" gap="400">
        <dt-button :loading="loading"> Place Call </dt-button>
        <dt-button v-dt-tooltip="`Tooltip`" :loading="loading">
          <template #icon>
            <dt-icon
              name="phone"
              size="300"
            />
          </template>
        </dt-button>
        <dt-button v-dt-tooltip="`Tooltip`" circle :loading="loading">
          <template #icon>
            <dt-icon
              name="phone"
              size="300"
            />
          </template>
        </dt-button>
      </dt-stack>
      <dt-stack direction="row" gap="400">
        <dt-button kind="muted" importance="outlined" :loading="loading"> Place Call </dt-button>
        <dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" :loading="loading">
          <template #icon>
            <dt-icon
              name="phone"
              size="300"
            />
          </template>
        </dt-button>
        <dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" circle :loading="loading">
          <template #icon>
            <dt-icon
              name="phone"
              size="300"
            />
          </template>
        </dt-button>
      </dt-stack>
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

### With label

<code-well-header>
  <dt-stack
    gap="400"
    direction="row"
  >
  <dt-button
    icon-position="right"
    size="xs"
  >
    Validating
    <template #icon="{ iconSize }">
      <dt-loader
        :size="iconSize"
      />
    </template>
  </dt-button>
  <dt-button
    icon-position="right"
    size="sm"
  >
    Validating
    <template #icon="{ iconSize }">
      <dt-loader
        :size="iconSize"
      />
    </template>
  </dt-button>
  <dt-button
    icon-position="right"
    size="md"
  >
    Validating
    <template #icon="{ iconSize }">
      <dt-loader
        :size="iconSize"
      />
    </template>
  </dt-button>
  <dt-button
    icon-position="right"
    size="lg"
  >
    Validating
    <template #icon="{ iconSize }">
      <dt-loader
        :size="iconSize"
      />
    </template>
  </dt-button>
</dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--primary d-btn--sm" type="button">
  <span class="d-btn__icon d-btn__icon--right">
    <div class="d-loader" aria-label="loading">
      <svg class="d-icon--size-200 d-icon d-icon--loading d-loader__icon" ...>
        ...
      </svg>
    </div>
  </span>
  <span class="d-btn__label">
    Validating
  </span>
</button>
'
vueCode='
<dt-button icon-position="right">
  Validating
  <template #icon="{ iconSize }">
    <dt-loader :size="iconSize" />
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
- When using DtButton with `href` or `to`, the component automatically handles Spacebar activation and disabled state (`aria-disabled`, `tabindex="-1"`). Navigating elements keep their native link role — `role="button"` is not added because the element navigates rather than performing an in-page action.

## Classes

<component-class-table component-name="button"></component-class-table>

<script setup>
import { ref } from 'vue';
import ButtonVariantsTable from '@baseComponents/ButtonVariantsTable.vue';

const isDisabled = ref(true);
const loading = ref(true);
</script>
