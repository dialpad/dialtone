---
title: Border Colors
description: Utilities for controlling an element's border color.
keywords: ["border","outline","border radius","rounded"]
---

<dt-notice kind="warning" class="d-wmx100p d-mt24" hideClose>
  Before using border color utilities, first consider <router-link class="d-link d-link--muted" to="/foundations/colors/palette/#borders">semantic border colors</router-link>.
</dt-notice>

## Usage

Use `d-bc-{color}` to set an element's border color.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="color in ['subtle', 'default', 'moderate', 'bold', 'critical', 'success', 'warning']"
      class="d-p16 d-ba d-baw2"
      :class="`d-bc-${color}`"
    >
      {{ color.charAt(0).toUpperCase() + color.slice(1) }}
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-ba d-bc-{color}">...</div>
```

## Hover

Use `h:d-bc-{color}` to change an element's border color spot on `:hover`.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 h:d-bc-moderate">
      Hover over me
    </dt-button>
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 h:d-bc-critical">
      Hover over me
    </dt-button>
  </dt-stack>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 h:d-bc-moderate">
  Hover over me
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 h:d-bc-critical">
  Hover over me
</dt-button>
```

## Focus

Use `f:d-bc-{color}` to change an element's border color when in `:focus` or `:focus-within` states.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 f:d-bc-moderate">
      Focus me
    </dt-button>
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 f:d-bc-critical">
      Focus me
    </dt-button>
  </dt-stack>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 f:d-bc-moderate">
  Focus me
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 f:d-bc-critical">
  Focus me
</dt-button>
```

## Focus Visible

Use `fv:d-bc-{color}` to change an element's border color when in `:focus-visible` state [only when focused by keyboard]
.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 fv:d-bc-moderate">
      Keyboard focus me
    </dt-button>
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 fv:d-bc-critical">
      Keyboard focus me
    </dt-button>
  </dt-stack>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 fv:d-bc-moderate">
  Keyboard focus me
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 fv:d-bc-critical">
  Keyboard focus me
</dt-button>
```

## Changing Opacities

Use `d-bco{n}` to change the border color opacity value.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="opacity in [100, 99, 95, 90, 75, 50, 25, 10, 0]"
      class="d-p16 d-ba d-baw2 d-bc-critical"
      :class="`d-bco${opacity}`"
    >
      {{ opacity }}%
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-ba d-bc-critical d-bco100">100%</div>
<div class="d-ba d-bc-critical d-bco99">99%</div>
<div class="d-ba d-bc-critical d-bco95">95%</div>
<div class="d-ba d-bc-critical d-bco90">90%</div>
<div class="d-ba d-bc-critical d-bco75">75%</div>
<div class="d-ba d-bc-critical d-bco50">50%</div>
<div class="d-ba d-bc-critical d-bco25">25%</div>
<div class="d-ba d-bc-critical d-bco10">10%</div>
<div class="d-ba d-bc-critical d-bco0">0%</div>
```

You can also change the border color opacity value on `:hover`
, `:focus`, `:focus-visible` by using the respective `h:d-bco{n}`, `f:d-bco{n}`, `fv:d-bco{n}` prefixes.

<code-well-header>
  <dt-stack
    gap="500"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical h:d-bco50">
      Hover me to see 50%
    </dt-button>
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical f:d-bco50">
      Focus me with mouse to see 50%
    </dt-button>
    <dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical fv:d-bco50">
      Focus me via keyboard to see 50%
    </dt-button>
  </dt-stack>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical h:d-bco50">
  Hover me to see 50%
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical f:d-bco50">
  Focus me with mouse to see 50%
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical fv:d-bco50">
  Focus me via keyboard to see 50%
</dt-button>
```

## Classes

<new-utility-class-table :classes="borderColors">
  <template #example="{ className }">
    <div :class="['d-d-inline-flex', {'d-bgc-contrast': className.endsWith('inverted')}]" >
      <div
        class="d-fl-shrink0 d-m4 d-h42 d-w42 d-bar4 d-ba d-baw2"
        :class="className"
      />
    </div>
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const borderColors = extractUtilityClasses(utilityClassDocs, 'd-bc-');
</script>
