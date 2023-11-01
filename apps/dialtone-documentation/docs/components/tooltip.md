---
title: Tooltip
status: ready
thumb: true
image: assets/images/components/tooltip.png
description: A tooltip is a floating label that briefly explains an action, function, or an element. Its content is exclusively text and shouldn't be vital information for users. If richer media is desired, consider using a popover instead.
storybook: https://vue.dialpad.design/?path=/story/components-tooltip--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21626&viewport=-614%2C359%2C0.86&t=xHutRjwo1o5zMTgT-11
---
<code-well-header class='d-hmn164'>
  <button class="d-btn d-btn--outlined d-tooltip--hover" type="button">
    <div class="d-tooltip d-tooltip__arrow--bottom-center d-ps-absolute">
      <span>Simple tooltip</span>
    </div>
    <span>Hover over me to see a tooltip</span>
  </button>
</code-well-header>

[//]: # (## Usage)
[//]: # (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa ante, tempus vitae lacus id, luctus tristique lorem. Mauris feugiat massa ex, id aliquet mi tempor non. Curabitur non tristique lectus. Fusce ut nisl non diam dignissim viverra. In posuere dui arcu, sed eleifend massa faucibus sed. Phasellus quis leo vitae erat pellentesque venenatis id vitae lectus. Suspendisse convallis, metus a congue tincidunt, velit sem tincidunt dui, eget auctor ipsum ipsum in ex. Nullam lobortis, mauris vel vestibulum rutrum, lorem elit vehicula est, nec viverra ante erat nec dolor. Proin at placerat tortor. Nam ullamcorper metus et eros porta, at lacinia leo scelerisque. Curabitur finibus sollicitudin odio tempor finibus. Donec lobortis metus vitae mollis gravida.)

## Variants and examples

### Base Styles

<code-well-header class="d-hmn164">
  <div class="d-tooltip d-tooltip__arrow--bottom-center d-tooltip--show">
    <span>Tooltip</span>
  </div>
</code-well-header>

```html
<div class="d-tooltip d-tooltip__arrow--bottom-center d-tooltip--show">
    <span>Tooltip</span>
</div>
```

<code-well-header bgclass="d-bgc-contrast" class="d-hmn164">
  <div class="d-tooltip d-tooltip__arrow--bottom-center d-tooltip--inverted d-tooltip--show">
    <span>Tooltip</span>
  </div>
</code-well-header>

```html
<div class="d-tooltip d-tooltip__arrow--bottom-center d-tooltip--inverted d-tooltip--show">
    <span>Tooltip</span>
</div>
```

### Arrow Directions

No arrow direction is assigned by default. You must select a direction. Twelve directions are offered: three on each face of the tooltip.

<div class="d-d-grid d-gg16 d-g-cols3 sm:d-g-cols1 md:d-g-cols2">
  <div v-for="dir in directions" class="d-p32 d-bgc-secondary d-bar8">
    <div class="d-tooltip d-tooltip--show" :class="'d-tooltip__arrow--'+dir">
      <div class="d-tt-capitalize d-mb4">{{ capitalizeDirection(dir) }}</div>
      <div class="d-code-small d-fc-black-400">.d-tooltip__arrow--{{ dir }}</div>
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
