---
title: Scrollbars
description: A directive that adds customized overlay scrollbars to any scrollable section.
status: beta
thumb: true
image: assets/images/components/scroller.png
---

## Scrollbars directive

Allows to add overlay scrollbars that will look the same for every browser. The directive sets up the scrollbars from the library [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/).

<code-well-header>
  <div class="d-hmx164 d-w30p d-bar8 d-ba d-bc-black-300" v-dt-scrollbars>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-hmx164 d-w30p d-bar8 d-ba d-bc-black-300 custom-scrollbars" data-overlayscrollbars="host" data-overlayscrollbars-initialize="true">
  <div class="os-size-observer">
    <div class="os-size-observer-listener"></div>
  </div>
  <div data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll" tabindex="-1">
    <div class="item">user 1</div>
    ...
  </div>
  <div class="os-scrollbar os-scrollbar-horizontal os-theme-dark os-scrollbar-auto-hide os-scrollbar-handle-interactive os-scrollbar-cornerless os-scrollbar-unusable">
    <div class="os-scrollbar-track">
      <div class="os-scrollbar-handle"></div>
    </div>
  </div>
  <div class="os-scrollbar os-scrollbar-vertical os-theme-dark os-scrollbar-auto-hide os-scrollbar-handle-interactive os-scrollbar-visible os-scrollbar-cornerless">
    <div class="os-scrollbar-track">
      <div class="os-scrollbar-handle"></div>
    </div>
  </div>
</div>
'
vueCode='
<div class="d-hmx164 d-w30p d-bar8 d-ba d-bc-black-300" v-dt-scrollbars>
  <div v-for="item in items" class="item">
    {{ item}}
  </div>
</div>
'
/>

## Usage

Import the directive from dialtone-vue

```javascript
import { DtTooltipScrollbars } from "@dialpad/dialtone-vue";
```

Install the directive into vue instance

```javascript
Vue.use(DtTooltipScrollbars);
```

To add customized overlay scrollbars to a scrollable section, simply include the `v-dt-scrollbars` directive on the desired element.
Add a `max-height` to the element if you want to set up a vertical scrollbar, or a `max-width` if you want to set up a horizontal scrollbar.

## Characteristics

* Has an overlay style: it appears on top of the content rather than the scrollbar taking up space within the container
* It grows when hovering the scrollbar handle for better accessibility
* Appears on scroll over the scrollable area
* The look and feel will be the same for every browser and OS
* Responds to the keyword events just like the native scrollbar.

## Limitations

Adding this directive to a DOM element or a Vue component will alter the DOM structure, by adding four elements inside the one that the directive was attached to.

The added elements are:

* One with the class `os-size-observer`
* The second one is the actual scrollable element
* The horizontal scrollbar
* The vertical scrollbar

This can make it challenging to use with components that rely on event listeners or may even render it unusable.

<script setup>
  const items = [
    'user 1',
    'user 2',
    'user 3',
    'user 4',
    'user 5',
    'user 6',
    'user 7',
    'user 8',
    'user 9',
    'user 10',
    'user 11',
    'user 12',
    'user 13',
    'user 14',
    'user 15',
  ]
</script>

<style lang="less" scoped>
.item {
  height: 25px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--dt-color-black-300);
  &:last-child {
    border-bottom: none;
  }
}
</style>
