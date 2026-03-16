---
title: Font Color
description: Utilities to change an element's font-color.
keywords: ["text color", "foreground color", "font colour"]
---

<FontUtilitiesNotice />

## Use DtText's `tone` prop

Use [DtText's](/components/text.html#tone) `tone` prop to declare the text's tone, which will map to a foreground color. By default, the tone is inherited from its parent.

<code-well-header>
  <dt-stack gap="500" direction="row">
    <dt-stack gap="300" class="d-py8 d-px16 d-bgc-primary d-bar4">
      <dt-text tone="primary">primary</dt-text>
      <dt-text tone="secondary">secondary</dt-text>
      <dt-text tone="tertiary">tertiary</dt-text>
      <dt-text tone="muted">muted</dt-text>
      <dt-text tone="disabled">disabled</dt-text>
      <dt-text tone="placeholder">placeholder</dt-text>
      <dt-text tone="success">success</dt-text>
      <dt-text tone="success-strong">success-strong</dt-text>
      <dt-text tone="warning">warning</dt-text>
      <dt-text tone="critical">critical</dt-text>
      <dt-text tone="critical-strong">critical-strong</dt-text>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text tone="{{tone}}">...</dt-text>
'/>

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

## Inverted

<dt-notice
  title="Tip"
  kind="info"
  class="d-wmx100p d-my16"
>
  Avoid <code>-inverted</code> utility variants, which will be sunset. Use the
  <dt-link to="/components/mode-island.html#inverting">v-dt-mode directive</dt-link>
  with base classes instead — it automatically resolves the correct colors for
  the current mode.
</dt-notice>

<code-well-header>
  <dt-stack direction="row" gap="600">
    <dt-stack gap="300" class="d-py8 d-px16 d-bgc-primary d-bar4">
      <dt-text tone="primary">primary</dt-text>
      <dt-text tone="secondary">secondary</dt-text>
      <dt-text tone="tertiary">tertiary</dt-text>
      <dt-text tone="muted">muted</dt-text>
      <dt-text tone="disabled">disabled</dt-text>
      <dt-text tone="placeholder">placeholder</dt-text>
      <dt-text tone="success">success</dt-text>
      <dt-text tone="success-strong">success-strong</dt-text>
      <dt-text tone="warning">warning</dt-text>
      <dt-text tone="critical">critical</dt-text>
      <dt-text tone="critical-strong">critical-strong</dt-text>
    </dt-stack>
    <dt-stack gap="300" class="d-py8 d-px16 d-bgc-contrast d-bar4">
      <dt-text v-dt-mode:invert tone="primary">primary</dt-text>
      <dt-text v-dt-mode:invert tone="secondary">secondary</dt-text>
      <dt-text v-dt-mode:invert tone="tertiary">tertiary</dt-text>
      <dt-text v-dt-mode:invert tone="muted">muted</dt-text>
      <dt-text v-dt-mode:invert tone="disabled">disabled</dt-text>
      <dt-text v-dt-mode:invert tone="placeholder">placeholder</dt-text>
      <dt-text v-dt-mode:invert tone="success">success</dt-text>
      <dt-text v-dt-mode:invert tone="success-strong">success-strong</dt-text>
      <dt-text v-dt-mode:invert tone="warning">warning</dt-text>
      <dt-text v-dt-mode:invert tone="critical">critical</dt-text>
      <dt-text v-dt-mode:invert tone="critical-strong">critical-strong</dt-text>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-stack gap="300" class="d-py8 d-px16 d-bgc-contrast d-bar4">
  <dt-text v-dt-mode:invert tone="primary">primary</dt-text>
  <dt-text v-dt-mode:invert tone="secondary">secondary</dt-text>
  <dt-text v-dt-mode:invert tone="tertiary">tertiary</dt-text>
  <dt-text v-dt-mode:invert tone="muted">muted</dt-text>
  <dt-text v-dt-mode:invert tone="disabled">disabled</dt-text>
  <dt-text v-dt-mode:invert tone="placeholder">placeholder</dt-text>
  <dt-text v-dt-mode:invert tone="success">success</dt-text>
  <dt-text v-dt-mode:invert tone="success-strong">success-strong</dt-text>
  <dt-text v-dt-mode:invert tone="warning">warning</dt-text>
  <dt-text v-dt-mode:invert tone="critical">critical</dt-text>
  <dt-text v-dt-mode:invert tone="critical-strong">critical-strong</dt-text>
</dt-stack>
'/>

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
    <dt-stack direction="row" align="center" justify="center" class="d-fl-shrink0 d-h42 d-w42 d-bar-circle d-ba d-bc-moderate" :class="[
        {'d-bgc-primary': !className.endsWith('inverted')},
        {'d-bgc-contrast': className.endsWith('inverted')},
        className
      ]">
      <span>Aa</span>
    </dt-stack>
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';
  import FontUtilitiesNotice from '@baseComponents/FontUtilitiesNotice.vue';

  const utilityClassDocs = inject('utilityClassDocs');
  const fontColors = extractUtilityClasses(utilityClassDocs, 'd-fc-');
</script>
