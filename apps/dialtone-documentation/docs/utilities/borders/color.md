---
title: Border Colors
description: Utilities for controlling an element's border color.
keywords: ["border colour"]
---

> [!WARNING]
> Before using border color utilities, first consider [semantic border colors](/design/colors/palette/#borders).

## Usage

Use `d-bc-{color}` to set an element's border color.

```vue demo
<!-- @wrapper -->
<dt-stack gap="200" :direction="{ 'default': 'column', 'md': 'row' }" class="d-fw-wrap">
  <div class="d-p-200 d-ba d-baw2 d-bc-subtle">Subtle</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-default">Default</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-moderate">Moderate</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-bold">Bold</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical">Critical</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-positive">Positive</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-warning">Warning</div>
</dt-stack>
```

## Hover

Use `h:d-bc-{color}` to change an element's border color spot on `:hover`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 h:d-bc-moderate">
    Hover over me
  </dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 h:d-bc-critical">
    Hover over me
  </dt-button>
</dt-stack>
```

## Focus

Use `f:d-bc-{color}` to change an element's border color when in `:focus` or `:focus-within` states.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 f:d-bc-moderate">
    Focus me
  </dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 f:d-bc-critical">
    Focus me
  </dt-button>
</dt-stack>
```

## Focus Visible

Use `fv:d-bc-{color}` to change an element's border color when in `:focus-visible` state [only when focused by keyboard]
.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 fv:d-bc-moderate">
    Keyboard focus me
  </dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 fv:d-bc-critical">
    Keyboard focus me
  </dt-button>
</dt-stack>
```

## Changing Opacities

Use `d-bco{n}` to change the border color opacity value.

```vue demo
<!-- @wrapper -->
<dt-stack gap="200" :direction="{ 'default': 'column', 'md': 'row' }">
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco100">100%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco99">99%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco95">95%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco90">90%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco75">75%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco50">50%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco25">25%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco10">10%</div>
  <div class="d-p-200 d-ba d-baw2 d-bc-critical d-bco0">0%</div>
</dt-stack>
```

You can also change the border color opacity value on `:hover`
, `:focus`, `:focus-visible` by using the respective `h:d-bco{n}`, `f:d-bco{n}`, `fv:d-bco{n}` prefixes.

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="200"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 d-bc-critical h:d-bco50">
    Hover me to see 50%
  </dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 d-bc-critical f:d-bco50">
    Focus me with mouse to see 50%
  </dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-ba d-baw2 d-bc-critical fv:d-bco50">
    Focus me via keyboard to see 50%
  </dt-button>
</dt-stack>
```

> [!INFO] Tip
> Prefer using the [v-dt-mode directive](/components/mode-island.html#inverting) with base utility classes instead of `-inverted` variants. For example, use `<div v-dt-mode:invert class="d-bc-critical">` instead of `<div class="d-bc-critical-inverted">`.

## Classes

<new-utility-class-table :classes="borderColors">
  <template #example="{ className }">
    <div :class="['d-d-inline-flex', {'d-bgc-contrast': className.endsWith('inverted')}]" >
      <div
        class="d-fl-shrink0 d-m-50 d-size-75 d-bar-300 d-ba d-baw2"
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
