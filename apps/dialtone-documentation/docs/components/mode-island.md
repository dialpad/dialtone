---
title: Mode Island
description: Create isolated sections with independent color modes.
status: beta
---

<code-well-header>
  <dt-stack gap="500" class="d-ai-flex-start d-w100p">
    <dt-stack direction="row" gap="500" class="d-jc-space-between d-w100p">
      <h4 class="d-headline--lg">Demo</h4>
      <dt-dropdown
        navigation-type="arrow-keys"
        placement="bottom-end"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            kind="muted"
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
    </dt-stack>
    <dt-stack :direction="{ 'default': 'column', 'md': 'row' }" gap="500" class="d-w100p">
      <dt-mode-island class="d-p16 d-bar8 d-bgc-primary d-ba d-fl1">
        <dt-stack gap="400">
          <dt-stack direction="row" gap="400" class="d-jc-space-between">
            <h3 class="d-headline--md-compact">Inverted <span class="d-fw-normal">(auto)</span></h3>
            <dt-icon name="circle-half-filled" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="400" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <p>Primary</p>
            <p class="d-fc-tertiary">Tertiary</p>
            <p class="d-fc-critical">Critical</p>
          </dt-stack>
          <p>
            <dt-link>Text link</dt-link>
          </p>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
      <dt-mode-island mode="light" class="d-p16 d-bar8 d-bgc-primary d-ba d-fl1">
        <dt-stack gap="400">
          <dt-stack direction="row" gap="400" class="d-jc-space-between">
            <h3 class="d-headline--md-compact">Explicit light</h3>
            <dt-icon name="sun" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="400" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <p>Primary</p>
            <p class="d-fc-tertiary">Tertiary</p>
            <p class="d-fc-critical">Critical</p>
          </dt-stack>
          <p>
            <dt-link>Text link</dt-link>
          </p>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
      <dt-mode-island mode="dark" class="d-p16 d-bar8 d-bgc-primary d-ba d-fl1">
        <dt-stack gap="400">
          <dt-stack direction="row" gap="400" class="d-jc-space-between">
            <h3 class="d-headline--md-compact">Explicit dark</h3>
            <dt-icon name="moon" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="400" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <p>Primary</p>
            <p class="d-fc-tertiary">Tertiary</p>
            <p class="d-fc-critical">Critical</p>
          </dt-stack>
          <p>
            <dt-link>Text link</dt-link>
          </p>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
    </dt-stack>
  </dt-stack>
</code-well-header>

## Usage

Mode islands create isolated sections that can display content in a different color mode. Useful for forcing specific themes on UI sections or inverting against the overall theme for visual hierarchy.

<dialtone-usage>
<template #do>

- Use only to force a region to a controlled theme for a unique purpose
- Use sparingly for specific needs, not general theming
- Always test in both light and dark root themes
- Ensure content remains readable when mode changes

</template>

<template #dont>

- Do not overuse mode islands, respect user theme preference
- Do not use purely for decoration. Ensure Mode Island use serves a functional and unique purpose
- Avoid nesting deeply. Keep hierarchy shallow for maintainability

</template>

</dialtone-usage>

### Reactive Mode Updates

Inverted islands reactively track parent/root mode changes. User switches light ↔ dark → inverted islands flip automatically. Even directly modifying the `mode` attribute will also work.

### Contrast Inheritance

Contrast is not an option to set to a Mode Island. Contrast theme setting is inherited from the root element, i.e. `<html>`.

### Brand Protection

`data-dt-brand` (aka "Theme", e.g. "tmo", "sunflower", etc) can not be set on Mode Islands. Brand theme can only be set at root level.

## Variants

### Inverted

The default mode, inverts the container relative to the parent or theme mode. If `mode` attribute is omitted, it defaults to `inverted`.

<code-well-header>
  <dt-mode-island class="d-p16 d-bar8 d-bgc-primary">
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

Always light mode regardless of parent or root mode.

<code-well-header>
  <dt-mode-island mode="light" class="d-p16 d-bar8 d-bgc-primary">
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

Always dark mode regardless of parent or root mode.

<code-well-header>
  <dt-mode-island mode="dark" class="d-p16 d-bar8 d-bgc-primary">
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

## Custom element

Polymorphic rendering via `as` prop—controls which HTML element wraps content. Ensures proper document structure and semantic markup. Example values: `section` for thematic grouping, `article` for self-contained content. Defaults to `div` where semantics aren't a concern.

<code-well-header>
  <dt-mode-island as="section" mode="dark" class="d-p16 d-bar8 d-bgc-primary">
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

## Nesting

Mode islands can be nested, though should rarely occur.

<code-well-header>
  <dt-mode-island mode="light" class="d-p16 d-bar8 d-bgc-primary">
    <p class="d-body--md d-mb8">Light island</p>
    <dt-mode-island class="d-p16 d-bar8 d-bgc-primary">
      <p class="d-body--md d-mb8">Inverted → Dark island</p>
      <dt-mode-island class="d-p16 d-bar4 d-bgc-primary">
        <p class="d-body--md">Inverted again → Light island</p>
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

## Vue API

<component-vue-api component-name="modeisland" />

## Accessibility

Purely visual. No semantic HTML impact. Supports high contrast mode via auto contrast inheritance.

<script setup>
import { inject, computed, onMounted, onUnmounted } from 'vue';

const currentMode = inject('currentMode');
const currentTheme = inject('currentTheme');
const currentContrast = inject('currentContrast');
const themes = inject('themes');
const modes = ['system', 'light', 'dark'];
const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const currentModeIconName = computed(() => {
  switch (currentMode.value) {
    case 'dark':
      return 'moon';
    case 'light':
      return 'sun';
    default:
      return 'circle-half-filled';
  }
});

const setMode = (mode) => {
  currentMode.value = mode;
  setCss();
  localStorage.setItem('preferredMode', mode);
};

const setContrast = (contrast) => {
  currentContrast.value = contrast;
  setCss();
  localStorage.setItem('preferredContrast', contrast);
};

const setCss = () => {
  if (!modes.includes(currentMode.value)) {
    currentMode.value = 'system';
    localStorage.setItem('preferredMode', currentMode.value);
  }

  const mode = currentMode.value === 'system' ? (prefersDarkMediaQuery.matches ? 'dark' : 'light') : currentMode.value;
  const brandName = currentTheme.value || 'dp';
  const contrast = currentContrast.value || 'default';

  document.documentElement.setAttribute('data-dt-mode', mode);
  document.documentElement.setAttribute('data-dt-brand', brandName);
  document.documentElement.setAttribute('data-dt-contrast', contrast);

  let brandOverrideTag = document.getElementById('dialtone-css-brand-override');
  if (brandName === 'dp') {
    if (brandOverrideTag) {
      brandOverrideTag.remove();
    }
  } else {
    const theme = themes && themes[brandName];
    if (theme && theme.brand && theme.brand.css) {
      if (!brandOverrideTag) {
        brandOverrideTag = document.createElement('style');
        brandOverrideTag.id = 'dialtone-css-brand-override';
        brandOverrideTag.type = 'text/css';
        document.head.appendChild(brandOverrideTag);
      }
      brandOverrideTag.innerHTML = theme.brand.css;
    }
  }

  let contrastTag = document.getElementById('dialtone-css-contrast');
  if (contrast === 'high') {
    const contrastTheme = themes && themes['high-contrast'];
    if (contrastTheme && contrastTheme.contrast && contrastTheme.contrast.css) {
      if (!contrastTag) {
        contrastTag = document.createElement('style');
        contrastTag.id = 'dialtone-css-contrast';
        contrastTag.type = 'text/css';
        document.head.appendChild(contrastTag);
      }
      contrastTag.innerHTML = contrastTheme.contrast.css;
    }
  } else {
    if (contrastTag) {
      contrastTag.remove();
    }
  }
};

onMounted(() => {
  setCss();
  prefersDarkMediaQuery.addEventListener('change', setCss);
});

onUnmounted(() => {
  prefersDarkMediaQuery.removeEventListener('change', setCss);
});
</script>
