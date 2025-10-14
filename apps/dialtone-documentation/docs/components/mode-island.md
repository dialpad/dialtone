---
title: Mode Island
description: Create isolated sections with independent color modes.
status: beta
---

<code-well-header>
  <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
    <template #anchor>
      <dt-button
        importance="outlined"
        kind="muted"
        class="dialtone-shell-btn"
      >
        <dt-stack gap="400" direction="row">
          <span><strong>Mode:</strong> {{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}</span>
          <span><strong>Contrast:</strong> {{ currentContrast.charAt(0).toUpperCase() + currentContrast.slice(1) }}</span>
        </dt-stack>
        <template #icon>
          <dt-icon
            size="300"
            :name="currentModeIconName"
          />
        </template>
      </dt-button>
    </template>
    <template #list>
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
        heading="Mode"
      >
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="setMode('system')"
        >
          System
          <template #right>
            <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
          </template>
        </dt-list-item>
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="setMode('light')"
        >
          Light
          <template #right>
            <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
          </template>
        </dt-list-item>
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="setMode('dark')"
        >
          Dark
          <template #right>
            <dt-icon :class="{ 'd-o0': currentMode !== 'dark' }" name="check" size="200" />
          </template>
        </dt-list-item>
      </dt-list-item-group>
      <dt-dropdown-separator />
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
        heading="Contrast"
      >
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="setContrast('default')"
        >
          Default
          <template #right>
            <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
          </template>
        </dt-list-item>
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="setContrast('high')"
        >
          High
          <template #right>
            <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
          </template>
        </dt-list-item>
      </dt-list-item-group>
    </template>
  </dt-dropdown>
  <dt-stack gap="500">
    <dt-mode-island class="d-p16 d-bar8 d-bgc-primary">
      <h3 class="d-headline--lg">Inverted mode island</h3>
      <dt-stack gap="400" direction="row">
        <p class="d-body--md">Primary Text</p>
        <p class="d-fc-tertiary">Tertiary Text</p>
        <p class="d-fc-critical">Critical Text</p>
      </dt-stack>
    </dt-mode-island>
  </dt-stack>
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
