---
title: Tooltip
status: ready
thumb: true
image: assets/images/components/tooltip.png
description: A tooltip is a floating label that briefly explains an action, function, or an element. Its content is exclusively text and shouldn't be vital information for users. If richer media is desired, consider using a popover instead.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tooltip--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=261-0
keywords: ["hint", "help text", "d-tooltip", "DtTooltip", "dt-tooltip"]
---

<code-example only-show="demo">
  <dt-button v-dt-tooltip="`Simple tooltip`">Hover me</dt-button>
</code-example>

<!-- <component-combinator component-name="DtTooltip" /> -->

## Tooltip as a Directive

### Usage

#### Default

Default tooltip directive uses top as default placement

<code-example>
  <dt-button v-dt-tooltip="`Tooltip text`">Hover me</dt-button>
</code-example>

#### With Placement

It's possible to change the tooltip default placement with directive arguments, possible values: bottom, bottom-start, bottom-end, right, right-start, right-end, left, left-start, left-end, top, top-start, top-end.

<code-example>
  <dt-button v-dt-tooltip:bottom-start="`Tooltip text`">Placeholder Button</dt-button>
</code-example>

#### With Object Syntax

It's possible to change any property of the tooltip with object syntax.

<code-example>
  <dt-button v-dt-tooltip="{ message: 'Tooltip text', placement: 'bottom-start', delay: false }">Placeholder Button</dt-button>
</code-example>

#### Content Mode

Tooltip content renders outside the DOM tree via Tippy.js. Use the `contentMode` modifier or object property to apply a color mode to the tooltip content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

<code-example bgclass="d-bgc-contrast d-py-800">
  <dt-stack direction="row" gap="400" data-demo-wrapper>
    <dt-button v-dt-tooltip.invert="`Tooltip`">Invert via Modifier</dt-button>
    <dt-button v-dt-tooltip="{ message: 'Tooltip', contentMode: 'invert' }">Invert via Object</dt-button>
  </dt-stack>
</code-example>

### Import

Import the directive from dialtone-vue

```javascript
import { DtTooltipDirective } from "@dialpad/dialtone-vue";
```

Install the directive into vue instance

```javascript
Vue.use(DtTooltipDirective);
```

## Tooltip as a Component

The tooltip, also known as infotip or hint, is a common graphical user interface element in which, when hovering over a
screen element or component, a text box displays information about that element (such as a description of a button's
function, or what an abbreviation stands for). The tooltip is displayed continuously as long as the user hovers over the
element

A tooltip has two slots:

1. **the anchor** required slot
2. **the default** slot (which could be replaced with prop message)

### Base Styles

<code-example>
  <dt-tooltip message="tooltip">
    <template #anchor>
      <dt-button>
        Hover me
      </dt-button>
    </template>
  </dt-tooltip>
</code-example>

### Placement

<code-example vueCode='
<dt-tooltip
  message="This is a simple tooltip. The tooltip can be positioned in different directions."
  :placement="placement"
>
  <template #anchor>
    <dt-button>
      {{ placement }}
    </dt-button>
  </template>
</dt-tooltip>
'>
  <example-tooltip-directions :directions="directions" />
</code-example>

### External anchor

<code-example>
  <dt-button
    id="external-tooltip-anchor"
    importance="outlined"
  >
    External anchor
  </dt-button>
  <dt-tooltip
    external-anchor="#external-tooltip-anchor"
  >
    This is a tooltip with external anchor
  </dt-tooltip>
</code-example>

### Fallback Placements

The tooltip uses [headless-tippy](https://atomiks.github.io/tippyjs/v6/headless-tippy/) and
[popper](https://popper.js.org/docs/v2/modifiers/flip/), if the tooltip opens in a placement where it will
be clipped, it will move to a new position. It will do this automatically by default, but if you want to
manually specify which position it will move to in what order you can do so via the fallbackPlacements prop.

### Content Mode

Tooltip content renders outside the DOM tree via Tippy.js. Use the `contentMode` prop to apply a color mode to the tooltip content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

<code-example bgclass="d-bgc-contrast" vueCode='
<dt-tooltip content-mode="invert|dark|light" message="Tooltip">
  <template #anchor>
    <dt-button>
      Anchor
    </dt-button>
  </template>
</dt-tooltip>
'>
  <dt-tooltip content-mode="invert" message="Inverted tooltip">
    <template #anchor>
      <dt-button>
        Inverted
      </dt-button>
    </template>
  </dt-tooltip>
</code-example>

## Vue API

<component-vue-api component-name="tooltip" />

## Classes

<component-class-table component-name="tooltip" />

## Accessibility

Reads out the tooltip content as a supplementary description for its trigger when the trigger is focused.
See also [wai aria practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip).

### Anchor

The anchor element that activates the tooltip should be fully accessible by keyboard. The easiest way to do this is by
using an element like an `DtButton` that is already accessible. When pressing the `ESC` key in a focused tooltip,
tooltip will be closed.

There are some required ARIA attributes for the anchor element (such as `aria-hidden` set based on `open`).
To make this as straightforward as possible, these ARIA attributes are passed
with the correct values as the `attrs` to the anchor slot. Applying them is as simple as using `v-bind`.

### Focus & Keyboard

Due to the different contexts in which a tooltip can be used, focus management and
keyboard shortcut `ESC` is provided.
You are encouraged to consult the ARIA documentation for the particular role.

<component-accessible-table component-name="tooltip" />

<script setup>
import ExampleTooltipDirections from '@exampleComponents/ExampleTooltipDirections.vue';

const directions = window.DIALTONE_CONSTANTS.TOOLTIP_DIRECTIONS;
</script>
