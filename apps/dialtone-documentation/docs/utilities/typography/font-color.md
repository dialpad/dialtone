---
title: Font Color
description: Utilities to change an element's font-color.
---

All font colors pass the WCAG 2.1 Level AA contrast ratio requirements (ratio >= 4.5:1) and most pass WCAG 2.1 Level AAA requirements (ratio >= 7:1).
The contrast ratio value is noted with the colors below.
Please use **only** these colors or variations of these colors which pass WCAG 2.1 Level AA contrast ratio requirements.

<aside class="d-notice d-notice--warning d-mt24 d-wmx100p" role="status" aria-hidden="false">
  <div class="d-notice__icon">
    <dt-icon name="alert-triangle"></dt-icon>
  </div>
  <div class="d-notice__content d-stack4">
    <p class="d-notice__message">
      Before using a Color utility, consider <router-link class="d-link d-link--muted" to="/design/colors/#text">semantic colors</router-link>.
    </p>
  </div>
</aside>

## Usage

Use `d-fc-{color}` to change an element's text color.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-200 d-fc-purple-400">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-purple-400">...</p>
```

## Changing Opacity

Use `d-fco{n}` to change an element's text color opacity. You can also change font color opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-fco{n}`, `f:d-fco{n}`, `fv:d-fco{n}` prefixes.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102 d-stack8" custom>
  <p class="d-fs-200 d-fc-purple-400">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco99">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco95">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco90">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco75">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco50">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco25">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco10">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco0">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-purple-400">...</p>
<p class="d-fc-purple-400 d-fco99">...</p>
<p class="d-fc-purple-400 d-fco95">...</p>
<p class="d-fc-purple-400 d-fco90">...</p>
<p class="d-fc-purple-400 d-fco75">...</p>
<p class="d-fc-purple-400 d-fco50">...</p>
<p class="d-fc-purple-400 d-fco25">...</p>
<p class="d-fc-purple-400 d-fco10">...</p>
<p class="d-fc-purple-400 d-fco0">...</p>
```

## Hover

Use `h:d-fc-{color}` to change an element's text color `:hover` state.

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-purple-400 h:d-fc-neutral-white d-bgc-transparent h:d-bgc-purple-500 d-ba d-bc-transparent">Hover over me</button>
</code-well-header>

```html
<button class="d-fc-purple-400 h:d-fc-neutral-white">...</button>
```

## Focus

Use `f:d-fc-{color}` to change an element's text color `:focus` and `:focus-within` state.

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-magenta-300 f:d-fc-neutral-white d-bgc-transparent f:d-bgc-magenta-400 d-ba d-bc-transparent">Click or focus on me</button>
</code-well-header>

```html
<button class="d-fc-magenta-300 f:d-fc-neutral-white d-bgc-transparent f:d-bgc-magenta-400">...</button>
```

## Focus Visible

Use `fv:d-fc-{color}` to change an element's text color on `:focus-visible` state [only when focused by keyboard].

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-magenta-300 fv:d-fc-neutral-white d-bgc-transparent fv:d-bgc-magenta-400 d-ba d-bc-transparent">Focus on me</button>
</code-well-header>

```html
<button class="d-fc-magenta-300 fv:d-fc-neutral-white d-bgc-transparent fv:d-bgc-magenta-400">...</button>
```

<!--
## Dark Mode
Use `d:d-fc-{color}` to set a different text color when the user prefers dark mode.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-black-200 d-w100p d-hmn102 d-stack16">
  <button type="button" class="d-p16 d-bar4 d-fs-200 d-fc-purple-400 d-bgc-magenta-100 d-ba d-bc-transparent js-theme-switcher">Click on me toggle dark mode</button>
</code-well-header>

```html
<button class="d-fc-purple-400">...</button>
```
 -->

## Classes

<new-utility-class-table :classes="colors">
  <template #example="{ className }">
    <div
      class="d-fl-shrink0 d-h42 d-w42 d-bar-circle d-ba d-bc-moderate d-d-flex d-ai-center d-jc-center"
      :class="[
        {'d-bgc-primary': !className.endsWith('inverted')},
        {'d-bgc-contrast': className.endsWith('inverted')},
        className
      ]"
    >
      <span>Aa</span>
    </div>
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const colors = extractUtilityClasses(utilityClassDocs, 'd-fc-');
</script>
