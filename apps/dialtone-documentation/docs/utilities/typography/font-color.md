---
title: Font Color
description: Utilities to change an element's font-color.
---

All font colors pass the WCAG 2.1 Level AA contrast ratio requirements (ratio >= 4.5:1) and most pass WCAG 2.1 Level AAA
requirements (ratio >= 7:1).
The contrast ratio value is noted with the colors below.
Please use **only** these colors or variations of these colors which pass WCAG 2.1 Level AA contrast ratio requirements.

<dt-notice kind="warning" class="d-wmx100p d-mt24" hideClose>
  Before using a Color utility, consider <router-link class="d-link d-link--muted" to="/design/colors/palette/#foreground">semantic colors</router-link>.
</dt-notice>

## Usage

Use `d-fc-{color}` to change an element's text color.

<code-well-header >
  <p class="d-fc-critical">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-critical">...</p>
```

## Hover

Use `h:d-fc-{color}` to change an element's text color `:hover` state.

<code-well-header>
  <dt-button kind="unstyled" class="d-fc-critical h:d-fc-success">Hover over me</dt-button>
</code-well-header>

```html

<dt-button kind="unstyled" class="d-fc-critical h:d-fc-success">Hover over me</dt-button>
```

## Focus

Use `f:d-fc-{color}` to change an element's text color `:focus` and `:focus-within` state.

<code-well-header>
  <dt-button kind="unstyled" class="d-fc-critical f:d-fc-success">Focus me</dt-button>
</code-well-header>

```html

<dt-button kind="unstyled" class="d-fc-critical f:d-fc-success">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-fc-{color}` to change an element's text color on `:focus-visible` state [only when focused by keyboard].

<code-well-header>
  <dt-button kind="unstyled" class="d-fc-critical fv:d-fc-success">Keyboard focus me</dt-button>
</code-well-header>

```html

<dt-button kind="unstyled" class="d-fc-critical fv:d-fc-success">Keyboard focus me</dt-button>
```

## Changing Opacity

Use `d-fco{n}` to change an element's text color opacity. You can also change font color opacity on `:hover`, `:focus`,
`:focus-visible` by using the respective `h:d-fco{n}`, `f:d-fco{n}`, `fv:d-fco{n}` prefixes.

<code-well-header>
  <p class="d-fc-critical">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco99">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco95">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco90">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco75">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco50">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco25">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco10">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco0">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-critical">...</p>
<p class="d-fc-critical d-fco99">...</p>
<p class="d-fc-critical d-fco95">...</p>
<p class="d-fc-critical d-fco90">...</p>
<p class="d-fc-critical d-fco75">...</p>
<p class="d-fc-critical d-fco50">...</p>
<p class="d-fc-critical d-fco25">...</p>
<p class="d-fc-critical d-fco10">...</p>
<p class="d-fc-critical d-fco0">...</p>
```

## Classes

<new-utility-class-table :classes="fontColors">
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
  import { extractUtilityClasses, sortBaseColors } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const colors = extractUtilityClasses(utilityClassDocs, 'd-fc-');
  const fontColors = sortBaseColors(colors);
</script>
