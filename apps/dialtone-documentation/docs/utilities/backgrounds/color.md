---
title: Background Color
description: Utilities for setting the background color.
keywords: ["bg color","background colour","bgc"]
---

<dt-notice kind="warning" class="d-wmx100p d-my-200" hideClose>
  Before using background color utilities, first consider <dt-link to="/design/colors/palette/#surface" kind="muted">semantic surface colors</dt-link>.
</dt-notice>

## Usage

Use `d-bgc-{color}` to set an element's background color.

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="200"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <div
    v-for="color in ['primary', 'critical']"
    class="d-p-200 d-bar4"
    :class="`d-bgc-${color}`"
  >
    {{ color.charAt(0).toUpperCase() + color.slice(1) }}
  </div>
</dt-stack>
```

## Hover

Use `h:d-bgc-{color}` to change an element's `:hover` state background color.

```vue demo
<dt-button kind="unstyled" class="d-p-200 d-bgc-primary h:d-bgc-critical">
  Hover over me
</dt-button>
```

## Focus

Use `f:d-bgc-{color}` to change an element's `:focus` and `:focus-within` state background color.

```vue demo
<dt-button kind="unstyled" class="d-p-200 d-bgc-primary f:d-bgc-critical">
  Focus me
</dt-button>
```

## Focus Visible

Use `fv:d-bgc-{color}` to change an element's `:focus-visible` state background color [only when focused by keyboard].

```vue demo
<dt-button kind="unstyled" class="d-p-200 d-bgc-primary fv:d-bgc-critical">
  Keyboard focus me
</dt-button>
```

## Changing Opacity

Use `d-bgo{stop}` to change an element's background color opacity. You can also change the background color opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgo{stop}`, `f:d-bgo{stop}`, `fv:d-bgo{stop}` prefixes.

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="200"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <div
    v-for="opacity in [100, 99, 95, 90, 75, 50, 25, 10, 0]"
    class="d-p-100 d-bgc-critical d-bar4"
    :class="`d-bgo${opacity}`"
  >
    {{ opacity }}%
  </div>
</dt-stack>
```

## Inverted

<dt-notice title="Tip" kind="info" class="d-wmx100p d-my-200">
  Avoid <code>-inverted</code> utility variants. Use the <dt-link to="/components/mode-island.html#inverting">v-dt-mode directive</dt-link> with base classes instead — it automatically resolves the correct colors for the current mode.
</dt-notice>

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="200"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <div
    v-dt-mode:invert
    v-for="color in ['primary', 'critical']"
    class="d-p-200 d-bar4"
    :class="`d-bgc-${color}`"
  >
    {{ color.charAt(0).toUpperCase() + color.slice(1) }}
  </div>
</dt-stack>
```

## Classes

<new-utility-class-table :classes="backgroundColors">
  <template #example="{ className }">
    <div
      class="d-fl-shrink0 d-size-75 d-bar-circle d-ba d-bc-moderate"
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
  const backgroundColors = extractUtilityClasses(utilityClassDocs, 'd-bgc-');
</script>
