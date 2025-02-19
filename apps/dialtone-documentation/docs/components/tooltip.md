---
title: Tooltip
status: ready
thumb: true
image: assets/images/components/tooltip.png
description: A tooltip is a floating label that briefly explains an action, function, or an element. Its content is exclusively text and shouldn't be vital information for users. If richer media is desired, consider using a popover instead.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tooltip--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21626&viewport=-614%2C359%2C0.86&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
  <dt-button v-dt-tooltip="`Simple tooltip`">Hover me</dt-button>
</code-well-header>

## Tooltip as a Directive

### Usage

#### Default

Default tooltip directive uses top as default placement

<code-well-header class="d-hmn164">
  <dt-button v-dt-tooltip="`Tooltip text`">Hover me</dt-button>
</code-well-header>

<code-example-tabs
htmlCode='
<span data-dt-tooltip-id="dt0" aria-describedby="tippy-1">Span with tooltip</span>
<div data-tippy-root="" id="tippy-1" style="pointer-events: none; z-index: 400; visibility: visible; position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(64.5px, -378px, 0px);">
  <div class="tippy-box" data-state="visible" tabindex="-1" data-animation="fade" role="tooltip" data-placement="top" style="max-width: 350px; transition-duration: 180ms;">
    <div class="tippy-content" data-state="visible" style="transition-duration: 180ms;"><div id="dt4" class="d-tooltip">Default placement</div></div>
    <div class="tippy-svg-arrow" style="position: absolute; left: 0px; transform: translate3d(59px, 0px, 0px);">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="7"><path d="M 14.5,7 8,0 1.5,7 Z"></path></svg>
    </div>
  </div>
</div>
'
vueCode='
<dt-button v-dt-tooltip="`Tooltip text`">Hover me</dt-button>
'
showHtmlWarning />

#### With Placement

It's possible to change the tooltip default placement with directive arguments, possible values: bottom, bottom-start, bottom-end, right, right-start, right-end, left, left-start, left-end, top, top-start, top-end.

<code-well-header class='d-hmn164'>
<dt-button v-dt-tooltip:bottom-start="`Tooltip text`">Placeholder Button</dt-button>
</code-well-header>

```javascript
<dt-button v-dt-tooltip:bottom-start="`Tooltip text`">Placeholder Button</dt-button>
```

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

<code-well-header class="d-hmn164">
  <dt-tooltip message="tooltip">
    <template #anchor>
      <dt-button>
        Hover me
      </dt-button>
    </template>
  </dt-tooltip>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <span>
    <button type="button" class="base-button__button d-btn d-btn--primary" aria-describedby="tippy-1">
      <span class="d-btn__label base-button__label"> Hover to show tooltip </span>
    </button>
  </span>
</div>
<div data-tippy-root="" id="tippy-1" style="pointer-events: none; z-index: 400; visibility: visible; position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(129px, -322px, 0px);">
  <div class="tippy-box" data-state="visible" tabindex="-1" data-animation="fade" role="tooltip" data-placement="top" data-theme="inverted" style="max-width: 350px; transition-duration: 180ms;">
    <div class="tippy-content" data-state="visible" style="transition-duration: 180ms;"><div id="dt0" class="d-tooltip">tooltip</div></div>
    <div class="tippy-svg-arrow" style="position: absolute; left: 0px; transform: translate3d(23.5px, 0px, 0px);">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="7"><path d="M 14.5,7 8,0 1.5,7 Z"></path></svg>
    </div>
  </div>
</div>
'
vueCode='
<dt-tooltip message="tooltip">
  <template #anchor>
    <dt-button>
      Hover me
    </dt-button>
  </template>
</dt-tooltip>
'
showHtmlWarning />

### Inverted

<code-well-header bgclass="d-bgc-contrast" class="d-hmn164">
  <dt-tooltip inverted message="tooltip">
    <template #anchor>
      <dt-button>
        Hover me
      </dt-button>
    </template>
  </dt-tooltip>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <span>
    <button type="button" class="base-button__button d-btn d-btn--primary" aria-describedby="tippy-1">
      <span class="d-btn__label base-button__label"> Hover to show tooltip </span>
    </button>
  </span>
</div>
<div data-tippy-root="" id="tippy-1" style="pointer-events: none; z-index: 400; visibility: visible; position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(129px, -322px, 0px);">
  <div class="tippy-box" data-state="visible" tabindex="-1" data-animation="fade" role="tooltip" data-placement="top" data-theme="inverted" style="max-width: 350px; transition-duration: 180ms;">
    <div class="tippy-content" data-state="visible" style="transition-duration: 180ms;"><div id="dt0" class="d-tooltip d-tooltip--inverted">tooltip</div></div>
    <div class="tippy-svg-arrow" style="position: absolute; left: 0px; transform: translate3d(23.5px, 0px, 0px);">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="7"><path d="M 14.5,7 8,0 1.5,7 Z"></path></svg>
    </div>
  </div>
</div>
'
vueCode='
<dt-tooltip inverted message="tooltip">
  <template #anchor>
    <dt-button>
      Hover me
    </dt-button>
  </template>
</dt-tooltip>
'
showHtmlWarning />

### Placement

<code-well-header>
  <example-tooltip-directions :directions="directions" />
</code-well-header>

<code-example-tabs
vueCode='
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
'
/>

### External anchor

<code-well-header>
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
</code-well-header>

<code-example-tabs
vueCode='
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
'
/>

### Fallback Placements

The tooltip uses [headless-tippy](https://atomiks.github.io/tippyjs/v6/headless-tippy/) and
[popper](https://popper.js.org/docs/v2/modifiers/flip/), if the tooltip opens in a placement where it will
be clipped, it will move to a new position. It will do this automatically by default, but if you want to
manually specify which position it will move to in what order you can do so via the fallbackPlacements prop.

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
