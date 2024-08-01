---
title: Tooltip
status: ready
thumb: true
image: assets/images/components/tooltip.png
description: A tooltip is a floating label that briefly explains an action, function, or an element. Its content is exclusively text and shouldn't be vital information for users. If richer media is desired, consider using a popover instead.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tooltip--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21626&viewport=-614%2C359%2C0.86&t=xHutRjwo1o5zMTgT-11
---
<code-well-header class='d-hmn164'>
  <button class="d-btn d-btn--outlined d-tooltip--hover" type="button">
    <div class="d-tooltip d-tooltip__arrow--bottom-center d-ps-absolute">
      <span>Simple tooltip</span>
    </div>
    <span>Hover for Tooltip Example</span>
  </button>
</code-well-header>

## Tooltip as a directive

### Usage

#### Default

Default tooltip directive uses top as default placement

<code-well-header class="d-hmn164">
  <div class="d-tooltip d-tooltip__arrow--bottom-center d-tooltip--show">
    <span>Tooltip</span>
  </div>
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
<dt-button v-dt-tooltip="Tooltip text">Placeholder Button</dt-button>
'
showHtmlWarning />

#### With Placement

It's possible to change the tooltip default placement with directive arguments, possible values: bottom, bottom-start, bottom-end, right, right-start, right-end, left, left-start, left-end, top, top-start, top-end.

<code-well-header class='d-hmn164'>
<dt-button v-dt-tooltip:bottom-start="`Tooltip text`">Placeholder Button</dt-button>
</code-well-header>

```javascript
<dt-button v-dt-tooltip:bottom-start="Tooltip text">Placeholder Button</dt-button>
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

## Tooltip as a component

### Base Styles

<code-well-header class="d-hmn164">
  <div class="d-tooltip d-tooltip__arrow--bottom-center d-tooltip--show">
    <span>Tooltip</span>
  </div>
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
      Hover to show tooltip
    </dt-button>
  </template>
</dt-tooltip>
'
showHtmlWarning />

<code-well-header bgclass="d-bgc-contrast" class="d-hmn164">
  <div class="d-tooltip d-tooltip__arrow--bottom-center d-tooltip--inverted d-tooltip--show">
    <span>Tooltip</span>
  </div>
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
      Hover to show tooltip
    </dt-button>
  </template>
</dt-tooltip>
'
showHtmlWarning />

### Arrow Directions

No arrow direction is assigned by default. You must select a direction. Twelve directions are offered: three on each face of the tooltip.

<div class="d-d-grid d-gg16 d-g-cols3 sm:d-g-cols1 md:d-g-cols2">
  <div v-for="dir in directions" class="d-p32 d-bgc-secondary d-bar8">
    <div class="d-tooltip d-tooltip--show" :class="'d-tooltip__arrow--'+dir">
      <div class="d-tt-capitalize d-mb4">{{ capitalizeDirection(dir) }}</div>
      <div class="d-code--sm d-fc-muted-inverted">.d-tooltip__arrow--{{ dir }}</div>
    </div>
  </div>
</div>

## Vue API

<component-vue-api component-name="tooltip" />

## Classes

<component-class-table component-name="tooltip" />

## Accessibility

<component-accessible-table component-name="tooltip" />

<script>
export default {
  data() {
    return {
      directions: [
        'top-left',
        'top-center',
        'top-right',
        'right-top',
        'right-center',
        'right-bottom',
        'bottom-left',
        'bottom-center',
        'bottom-right',
        'left-top',
        'left-center',
        'left-bottom',
      ]
    }
  },
  methods: {
    capitalizeDirection(direction) {
      return direction.split('-').join(' ');
    },
  },
}
</script>
