---
title: Button
description: A button is an UI element which signals key actions to take an action throughout an app. It is important a button is identifiable, consistent, communicates its actions clearly, and is appropriately sized to its action.
status: ready
thumb: true
image: assets/images/components/button.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-button--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8923%3A20208&viewport=-1695%2C219%2C0.19&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
  <dt-button> Place Call </dt-button>
</code-well-header>

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

## Writing guidelines

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

Dialtone provides four core button **types**, each with three levels of **importance**.

<table class="d-table dialtone-doc-table d-mb16">
  <colgroup>
    <col>
    <col class="d-w25p">
    <col class="d-w25p">
    <col class="d-w25p">
  </colgroup>
  <thead>
    <tr>
      <th class="d-ta-left d-va-top"></th>
      <th class="d-ta-left d-va-top">
        Clear
        <div class="d-fw-normal d-tt-none d-fs-200 d-lh-200">Default level of importance. Typically used for secondary or minimally important actions.</div>
      </th>
      <th class="d-ta-left d-va-top">
        Outlined
        <div class="d-fw-normal d-tt-none d-fs-200 d-lh-200">Slightly more important than clear, presenting a contrasting border and transparent background.</div>
      </th>
      <th class="d-ta-left d-va-top">
        Primary
        <div class="d-fw-normal d-tt-none d-fs-200 d-lh-200">Highest level of importance, presenting a solid background color.</div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th class="d-ta-left d-pl0" scope="row">
        <a class="d-link d-fs-100 d-fw-medium d-d-block d-mb4 d-tt-uppercase" href="#base"><strong>Base</strong></a>
        <div class="d-fw-normal d-lh-200">Our default button colors.</div>
      </th>
      <td class="d-ta-center">
        <button class="d-btn" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-ta-center">
        <button class="d-btn d-btn--outlined" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-ta-center">
        <button class="d-btn d-btn--primary" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
    </tr>
    <tr>
      <th class="d-ta-left d-pl0" scope="row">
        <a class="d-link d-fs-100 d-fw-medium d-d-block d-mb4 d-tt-uppercase" href="#danger"><strong>Danger</strong></a>
        <div class="d-fw-normal d-lh-200">Potentially destructive or otherwise critical actions.</div>
      </th>
      <td class="d-ta-center">
        <button class="d-btn d-btn--danger" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-ta-center">
        <button class="d-btn d-btn--outlined d-btn--danger" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-ta-center">
        <button class="d-btn d-btn--primary d-btn--danger" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
    </tr>
    <tr>
      <th class="d-ta-left d-pl0" scope="row">
        <a class="d-link d-fs-100 d-fw-medium d-d-block d-mb4 d-tt-uppercase" href="#inverted"><strong>Inverted</strong></a>
        <div class="d-fw-normal d-lh-200">Use for placement on non-white, dark backgrounds.</div>
      </th>
      <td class="d-bgc-contrast d-ta-center">
        <button class="d-btn d-btn--inverted" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-bgc-contrast d-ta-center">
        <button class="d-btn d-btn--outlined d-btn--inverted" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-bgc-contrast d-ta-center">
        <button class="d-btn d-btn--primary d-btn--inverted" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
    </tr>
    <tr>
      <th class="d-ta-left d-pl0" scope="row">
        <a class="d-link d-fs-100 d-fw-medium d-d-block d-mb4 d-tt-uppercase" href="#muted"><strong>Muted</strong></a>
        <div class="d-fw-normal">For non-primary actions and contexts where base style may not work.</div>
      </th>
      <td class="d-ta-center">
        <button class="d-btn d-btn--muted" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-ta-center">
        <button class="d-btn d-btn--muted d-btn--outlined" type="button"> <span class="d-btn__label">Place Call</span> </button>
      </td>
      <td class="d-ta-center d-lh-200">
        <abbr class="d-fc-black-400 d-td-none d-fs-100" title="Not applicable">N/A</abbr>
      </td>
    </tr>
  </tbody>
</table>

### Base

The base button should be the go-to button for most of your needs. When in doubt, use this style. To help provide clarity to users, it is generally recommended to use only one primary button style within a section or page.

<code-well-header>
  <div class="d-d-flex d-flow8">
      <div>
          <button class="d-btn d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
      </div>
      <div>
          <button class="d-btn d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
      </div>
      <div>
          <button class="d-btn" type="button"><span class="d-btn__label">Place Call</span></button>
      </div>
  </div>
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
  <div class="d-d-flex d-flow8">
    <div>
      <button class="d-btn d-btn--danger d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--danger d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--danger" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
  </div>
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

### Inverted

The inverted button style is used to visually separate buttons set on darker backgrounds.

<code-well-header bgclass="d-bgc-contrast">
  <div class="d-d-flex d-flow8">
    <div>
      <button class="d-btn d-btn--inverted d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--inverted d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--inverted" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
  </div>
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

The muted button style is used to communicate non-primary actions for contexts in which the base style may not work (e.g. colored backgrounds, validation components, etc). This style’s use should be rare. When in doubt, use the [base button style](#base).

<code-well-header>
  <div class="d-d-flex d-flow8">
    <div>
      <button class="d-btn d-btn--muted" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--muted d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
  </div>
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
  <div class="d-d-flex d-flow8">
    <div>
      <dt-button disabled>Place Call (disabled attribute)</dt-button>
    </div>
    <div>
      <span class="d-c-not-allowed">
        <dt-button class="d-btn--disabled" v-dt-tooltip="`Optional Tooltip`">Place Call (disabled class )</dt-button>
      </span>
    </div>
  </div>
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
  <dt-button class="d-btn--disabled" v-dt-tooltip="`Optional Tooltip`">Place Call (disabled class)</dt-button>
</span>
'
showHtmlWarning />

### Active

Buttons can be set to active state using the `.d-btn--active` Dialtone class.
Different button styles and variations appear different when active.

<code-well-header>
  <div class="d-d-flex d-flow8">
    <div>
      <button class="d-btn d-btn--active" type="button">
        <span class="d-btn__label">Place Call</span>
      </button>
    </div>
    <div>
      <button class="d-btn d-btn--primary d-btn--active" type="button">
        <span class="d-btn__label">Place Call</span>
      </button>
    </div>
    <div>
      <button class="d-btn d-btn--danger d-btn--active" type="button">
        <span class="d-btn__label">Place Call</span>
      </button>
    </div>
    <div>
      <button class="d-btn d-btn--inverted d-btn--primary d-btn--active" type="button">
        <span class="d-btn__label">Place Call</span>
      </button>
    </div>
    <div>
      <button class="d-btn d-btn--muted d-btn--active" type="button">
        <span class="d-btn__label">Place Call</span>
      </button>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--danger d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--inverted d-btn--primary d-btn--active" type="button"><span class="d-btn__label">...</span></button>
<button class="d-btn d-btn--primary d-btn--muted d-btn--active" type="button"><span class="d-btn__label">...</span></button>
'
vueCode='
<dt-button active importance="clear"> Place Call </dt-button>
<dt-button active> Place Call </dt-button>
<dt-button active kind="danger" importance="clear"> Place Call </dt-button>
<dt-button active kind="inverted"> Place Call </dt-button>
<dt-button active kind="muted"> Place Call </dt-button>
'
showHtmlWarning />

### Link

Buttons can be styled as a [Link](link.md) in situations for which you need the appearance of a link but behavior of a button. Using the `button` element provides a better accessibility experience.

<code-well-header>
  <div class="d-d-flex d-flow8">
    <button type="button" class="d-link">Place Call</button>
    <button type="button" class="d-link" disabled>Place Call</button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<button type="button" class="d-link">...</button>
<button type="button" class="d-link" disabled>...</button>
'
vueCode='
<dt-button link> Place Call </dt-button>
<dt-button link disabled> Place Call </dt-button>
'
showHtmlWarning />

### Split Button

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
  <div class="d-d-flex d-flow8 d-ai-center">
    <div>
      <button class="d-btn d-btn--primary d-btn--xs" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--primary d-btn--sm" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--primary d-btn--lg" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--primary d-btn--xl" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
  </div>
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
  <div class="d-d-flex d-flow8">
    <div>
      <button class="d-btn d-btn--loading d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--loading d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
    <div>
      <button class="d-btn d-btn--danger d-btn--loading" type="button"><span class="d-btn__label">Place Call</span></button>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--loading d-btn--primary" type="button"><span class="d-btn__label">Place Call</span></button>
<button class="d-btn d-btn--loading d-btn--outlined" type="button"><span class="d-btn__label">Place Call</span></button>
<button class="d-btn d-btn--danger d-btn--loading" type="button"><span class="d-btn__label">Place Call</span></button>
'
vueCode='
<dt-button loading> Place Call </dt-button>
<dt-button loading importance="outlined"> Place Call </dt-button>
<dt-button loading importance="clear" kind="danger"> Place Call </dt-button>
'
showHtmlWarning />

## Icon support

### Icon and label

Button labels can include an icon next to the text. Every button style can accept icon classes, though we only provide a few possible examples.

<code-well-header>
  <div class="d-d-flex d-flow8">
    <div>
      <button class="d-btn d-btn--outlined" type="button">
        <span class="d-btn__icon d-btn__icon--left"><dt-icon name="phone" size="300" /></span>
        <span class="d-btn__label">Label</span>
      </button>
    </div>
    <div>
      <button class="d-btn d-btn--outlined d-btn--vertical" type="button">
        <span class="d-btn__icon d-btn__icon--top"><dt-icon name="phone" size="300" /></span>
        <span class="d-btn__label">Label</span>
      </button>
    </div>
    <div>
      <button class="d-btn d-btn--outlined" type="button">
        <span class="d-btn__icon d-btn__icon--right"><dt-icon name="phone" size="300" /></span>
        <span class="d-btn__label">Label</span>
      </button>
    </div>
  </div>
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
<!-- icon-position can be "right/top/bottom" ,
     no icon-position will be left -->
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

### Icon only

Sometimes an icon-only, circle button is desired. These buttons are used for toggling actions, navigation, or closing UI elements. Only the following styles accept circle button classes.

<code-well-header>
  <div class="d-d-flex d-flow8">
    <button class="d-btn d-btn--circle" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
    <button class="d-btn d-btn--circle d-btn--outlined" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
    <button class="d-btn d-btn--circle d-btn--danger" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
    <button class="d-btn d-btn--circle d-btn--danger d-btn--outlined" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
    <button class="d-btn d-btn--circle d-btn--danger d-btn--primary" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--circle" type="button">...</button>
<button class="d-btn d-btn--circle d-btn--outlined" type="button">...</button>
<button class="d-btn d-btn--circle d-btn--danger" type="button">...</button>
<button class="d-btn d-btn--circle d-btn--danger d-btn--outlined" type="button">...</button>
<button class="d-btn d-btn--circle d-btn--danger d-btn--primary" type="button">...</button>
'
vueCode='
<!-- circle clear-->
<dt-button circle importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<!-- circle outlined-->
<dt-button circle importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<!-- circle clear danger-->
<dt-button circle kind="danger" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<!-- circle outlined danger-->
<dt-button circle kind="danger" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<!-- circle danger-->
<dt-button circle kind="danger">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
'
showHtmlWarning />

<code-well-header bgclass="d-bgc-contrast">
  <div class="d-d-flex d-flow8">
    <button class="d-btn d-btn--circle d-btn--inverted" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
    <button class="d-btn d-btn--circle d-btn--inverted d-btn--outlined" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
    <button class="d-btn d-btn--circle d-btn--inverted d-btn--primary" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--circle btn--inverted" type="button">...</button>
<button class="d-btn d-btn--circle btn--inverted d-btn--outlined" type="button">...</button>
<button class="d-btn d-btn--circle btn--inverted d-btn--primary" type="button">...</button>
'
vueCode='
<!-- circle inverted clear-->
<dt-button circle kind="inverted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
     />
  </template>
</dt-button>
<!-- circle inverted outlined-->
<dt-button circle kind="inverted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
     />
  </template>
</dt-button>
<!-- circle inverted primary-->
<dt-button circle kind="inverted">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
     />
  </template>
</dt-button>
'
showHtmlWarning />

If you want to use the rectangular button, use the icon only styles.

<code-well-header>
  <div class="d-d-flex d-flow8">
    <button class="d-btn d-btn--icon-only" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
    <button class="d-btn d-btn--icon-only d-btn--outlined" type="button"><span class="d-btn__icon"><dt-icon name="phone" size="300" /></span></button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<button class="d-btn d-btn--icon-only" type="button">...</button>
<button class="d-btn d-btn--icon-only d-btn--outlined" type="button">...</button>
'
vueCode='
<!-- clear-->
<dt-button importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<!-- outlined-->
<dt-button importance="outlined">
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
  <div class="d-stack8">
    <button class="d-btn d-btn--brand d-btn--google d-w100p" type="button"><span class="d-btn__icon"><dt-icon name="google-glyph" /></span><span class="d-btn__label">Log in with Google</span></button>
    <button class="d-btn d-btn--brand d-btn--o365 d-w100p" type="button"><span class="d-btn__icon"><dt-icon name="office-365" /></span><span class="d-btn__label">Log in with Office365</span></button>
    <button class="d-btn d-btn--brand d-btn--linkedin d-w100p" type="button"><span class="d-btn__icon"><dt-icon name="linkedin" /></span><span class="d-btn__label">Log in with LinkedIn</span></button>
  </div>
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
