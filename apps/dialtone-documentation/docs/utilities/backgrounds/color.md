---
title: Background Color
description: Utilities for setting the background color.
---

<dt-notice kind="warning" class="d-wmx100p d-mt24" hideClose>
  Before using background color utilities, first consider <router-link class="d-link d-link--muted" to="/design/colors/#surface">semantic surface colors</router-link>.
</dt-notice>

## Usage

Use `d-bgc-{color}` to set an element's background color.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="color in ['primary', 'critical']"
      class="d-p16 d-bar4"
      :class="`d-bgc-${color}`"
    >
      {{ color.charAt(0).toUpperCase() + color.slice(1) }}
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-bgc-primary">...</div>
<div class="d-bgc-critical">...</div>
```

## Hover

Use `h:d-bgc-{color}` to change an element's `:hover` state background color.

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bgc-primary h:d-bgc-critical">
    Hover over me
  </dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-bgc-primary h:d-bgc-critical">
  Hover over me
</dt-button>
```

## Focus

Use `f:d-bgc-{color}` to change an element's `:focus` and `:focus-within` state background color.

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bgc-primary f:d-bgc-critical">
    Focus me
  </dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-bgc-primary f:d-bgc-critical">
  Focus me
</dt-button>
```

## Focus Visible

Use `fv:d-bgc-{color}` to change an element's `:focus-visible` state background color [only when focused by keyboard].

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bgc-primary fv:d-bgc-critical">
    Keyboard focus me
  </dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-bgc-primary fv:d-bgc-critical">
  Keyboard focus me
</dt-button>
```

## Changing Opacity

Use `d-bgo{stop}` to change an element's background color opacity. You can also change the background color opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgo{stop}`, `f:d-bgo{stop}`, `fv:d-bgo{stop}` prefixes.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="opacity in [100, 99, 95, 90, 75, 50, 25, 10, 0]"
      class="d-p8 d-bgc-critical d-bar4"
      :class="`d-bgo${opacity}`"
    >
      {{ opacity }}%
    </div>
  </dt-stack>
</code-well-header>

```html
<p class="d-bgc-critical">...</p>
<p class="d-bgc-critical d-bgo99">...</p>
<p class="d-bgc-critical d-bgo95">...</p>
<p class="d-bgc-critical d-bgo90">...</p>
<p class="d-bgc-critical d-bgo75">...</p>
<p class="d-bgc-critical d-bgo50">...</p>
<p class="d-bgc-critical d-bgo25">...</p>
<p class="d-bgc-critical d-bgo10">...</p>
<p class="d-bgc-critical d-bgo0">...</p>
```

## Classes

<new-utility-class-table :classes="backgroundColors">
  <template #example="{ className }">
    <div
      class="d-fl-shrink0 d-h42 d-w42 d-bar-circle d-ba d-bc-moderate"
      :class="className"
    />
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  /*Excluded classes that have incorrect naming, should be renamed to `d-bgclip` to avoid conflicts*/
  const excludedClasses = ['d-bgc-border-box', 'd-bgc-content-box', 'd-bgc-padding-box', 'd-bgc-text'];

  const utilityClassDocs = inject('utilityClassDocs');
  const colors = extractUtilityClasses(utilityClassDocs, 'd-bgc-');
  const backgroundColors = Object.keys(colors)
    .filter(className => !excludedClasses.includes(className))
    .reduce((obj, key) => {
      obj[key] = colors[key];
      return obj;
    }, {});
</script>
