---
title: Mode Island
description: Create isolated sections with independent color modes.
status: beta
---

<code-well-header>
  <dt-mode-island mode="dark" class="d-p16 d-bar8">
    <p class="d-body--md">Dark mode island in light theme</p>
  </dt-mode-island>
</code-well-header>

## Usage

Mode islands create isolated sections that can display content in a different color mode than the surrounding page. Useful for forcing specific themes on UI sections or inverting the current theme for visual hierarchy.

<dialtone-usage>
<template #do>

- Force sections to light or dark mode regardless of user theme
- Invert current theme for emphasis or hierarchy
- Build components with consistent appearance across themes
- Create nested theme contexts

</template>

<template #dont>

- Overuse mode islands - respect user theme preference
- Use purely for decoration - ensure functional purpose
- Nest deeply - keep hierarchy shallow for maintainability

</template>

</dialtone-usage>

### Best Practices

- Use sparingly for specific needs, not general theming
- Always test in both light and dark root themes
- Ensure content remains readable when mode changes
- Provide functional reason for mode change

## Mode Values

### Inverted

Default mode. Automatically inverts parent mode or root theme. Reacts to theme changes.

<code-well-header>
  <dt-mode-island class="d-p16 d-bar8">
    <p class="d-body--md">Inverted mode (opposite of parent)</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
htmlCode='
<div data-dt-theme="light" data-mode-island-inverted class="d-p16 d-bar8">
  <p class="d-body--md">Inverted mode (opposite of parent)</p>
</div>
'
vueCode='
<dt-mode-island class="d-p16 d-bar8">
  <p class="d-body--md">Inverted mode (opposite of parent)</p>
</dt-mode-island>
'
showHtmlWarning />

### Light

Always light mode regardless of parent or root theme.

<code-well-header>
  <dt-mode-island mode="light" class="d-p16 d-bar8">
    <p class="d-body--md">Always light mode</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
htmlCode='
<div data-dt-theme="light" class="d-p16 d-bar8">
  <p class="d-body--md">Always light mode</p>
</div>
'
vueCode='
<dt-mode-island mode="light" class="d-p16 d-bar8">
  <p class="d-body--md">Always light mode</p>
</dt-mode-island>
'
showHtmlWarning />

### Dark

Always dark mode regardless of parent or root theme.

<code-well-header>
  <dt-mode-island mode="dark" class="d-p16 d-bar8">
    <p class="d-body--md">Always dark mode</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
htmlCode='
<div data-dt-theme="dark" class="d-p16 d-bar8">
  <p class="d-body--md">Always dark mode</p>
</div>
'
vueCode='
<dt-mode-island mode="dark" class="d-p16 d-bar8">
  <p class="d-body--md">Always dark mode</p>
</dt-mode-island>
'
showHtmlWarning />

## Features

### Nesting

Mode islands can be nested. `mode="inverted"` detects parent island and inverts accordingly.

<code-well-header>
  <dt-mode-island mode="dark" class="d-p16 d-bar8">
    <p class="d-body--md d-mb8">Dark island</p>
    <dt-mode-island mode="inverted" class="d-p16 d-bar8">
      <p class="d-body--md d-mb8">Inverted → Light island</p>
      <dt-mode-island mode="inverted" class="d-p16 d-bar8">
        <p class="d-body--md">Inverted again → Dark island</p>
      </dt-mode-island>
    </dt-mode-island>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
vueCode='
<dt-mode-island mode="dark" class="d-p16 d-bar8">
  <p class="d-body--md d-mb8">Dark island</p>
  <dt-mode-island mode="inverted" class="d-p16 d-bar8">
    <p class="d-body--md d-mb8">Inverted → Light island</p>
    <dt-mode-island mode="inverted" class="d-p16 d-bar8">
      <p class="d-body--md">Inverted again → Dark island</p>
    </dt-mode-island>
  </dt-mode-island>
</dt-mode-island>
'
/>

### Reactive Mode Updates

Inverted islands auto-react to parent/root theme changes. When user switches light ↔ dark, all inverted islands flip to maintain opposite mode. No page refresh needed.

**Note:** Inverted islands get `data-mode-island-inverted` attribute to track original `mode="inverted"` setting.

### Contrast Inheritance

Auto-inherits `data-dt-contrast` from root element, updates reactively. High contrast mode works correctly within islands.

### Brand Protection

`data-dt-brand` prohibited on islands to avoid mixing color themes. Set brand at root level only. Attempting to set throws error.

## Semantic HTML

Use `as` prop to control rendered element. Default is `div`.

<code-well-header>
  <dt-mode-island as="section" mode="dark" class="d-p16 d-bar8">
    <p class="d-body--md">Rendered as section element</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
htmlCode='
<section data-dt-theme="dark" class="d-p16 d-bar8">
  <p class="d-body--md">Rendered as section element</p>
</section>
'
vueCode='
<dt-mode-island as="section" mode="dark" class="d-p16 d-bar8">
  <p class="d-body--md">Rendered as section element</p>
</dt-mode-island>
'
showHtmlWarning />

**Common values:** `div` (default), `section`, `article`, `nav`, `aside`, `header`, `footer`, `main`

## Vue API

<component-vue-api component-name="modeisland" />

## Accessibility

Purely visual. No semantic HTML impact. Supports high contrast mode via auto contrast inheritance.
