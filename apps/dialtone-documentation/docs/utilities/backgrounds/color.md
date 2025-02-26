---
title: Background Color
description: Utilities for setting the background color.
---

<aside class="d-notice d-notice--warning d-mt24 d-wmx100p" role="status" aria-hidden="false">
  <div class="d-notice__icon">
    <dt-icon name="alert-triangle"></dt-icon>
  </div>
  <div class="d-notice__content d-stack4">
    <p class="d-notice__message">
      Before using background color utilities, first consider <router-link class="d-link d-link--muted" to="/design/colors/#surface">semantic surface colors</router-link>.
    </p>
  </div>
</aside>

## Usage

Use `d-bgc-{color}` to set an element's background color.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fs-200 d-p16 d-bar4 d-bgc-purple-300">The quick brown fox jumps over the lazy dog.</div>
</code-well-header>

```html
<div class="d-bgc-purple-300">...</div>
```

## Changing Opacity

Use `d-bgo{stop}` to change an element's background color opacity. You can also change the background color opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgo{stop}`, `f:d-bgo{stop}`, `fv:d-bgo{stop}` prefixes.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102 d-stack8" custom>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">100%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo99 d-bar4 d-fs-300 d-fw-bold">99%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo95 d-bar4 d-fs-300 d-fw-bold">95%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo90 d-bar4 d-fs-300 d-fw-bold">90%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo75 d-bar4 d-fs-300 d-fw-bold">75%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo50 d-bar4 d-fs-300 d-fw-bold">50%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo25 d-bar4 d-fs-300 d-fw-bold">25%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo10 d-bar4 d-fs-300 d-fw-bold">10%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo0 d-bar4 d-fs-300 d-fw-bold">0%</div>
</code-well-header>

```html
<p class="d-bgc-green-200">...</p>
<p class="d-bgc-green-200 d-bgo99">...</p>
<p class="d-bgc-green-200 d-bgo95">...</p>
<p class="d-bgc-green-200 d-bgo90">...</p>
<p class="d-bgc-green-200 d-bgo75">...</p>
<p class="d-bgc-green-200 d-bgo50">...</p>
<p class="d-bgc-green-200 d-bgo25">...</p>
<p class="d-bgc-green-200 d-bgo10">...</p>
<p class="d-bgc-green-200 d-bgo0">...</p>
```

## Hover

Use `h:d-bgc-{color}` to change an element's `:hover` state background color.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <button type="button" class="d-p16 d-bar4 d-fs-200 d-bgc-green-100 h:d-bgc-green-200 d-ba d-bc-transparent">Hover over me</button>
</code-well-header>

```html
<button class="d-bgc-green-100 h:d-bgc-green-200">...</button>
```

## Focus

Use `f:d-bgc-{color}` to change an element's `:focus` and `:focus-within` state background color.

<code-well-header class="d-fl-center d-bgc-red-100 d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-black-800 d-bgc-transparent f:d-fc-red-300 f:d-bgc-red-300 f:d-bgo25 d-ba d-bc-transparent">Click on me</button>
</code-well-header>

```html
<button class="d-bgc-transparent f:d-fc-red-300 f:d-bgc-red-300 f:d-bgo25">...</button>
```

## Focus Visible

Use `fv:d-bgc-{color}` to change an element's `:focus-visible` state background color [only when focused by keyboard].

<code-well-header class="d-fl-center d-bgc-red-100 d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-black-800 d-bgc-transparent fv:d-fc-red-300 fv:d-bgc-red-300 fv:d-bgo25 d-ba d-bc-transparent">Focus on me</button>
</code-well-header>

```html
<button class="d-bgc-transparent fv:d-fc-red-300 fv:d-bgc-red-300 fv:d-bgo25">...</button>
```

## Classes

<new-utility-class-table :classes="colors">
  <template #example="{ className }">
    <div
      class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-ba d-bc-black-200"
      :class="className"
    />
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const colors = extractUtilityClasses(utilityClassDocs, 'd-bgc-');
</script>
