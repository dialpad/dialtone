---
title: Scrollbar
description: A directive that adds a custom overlay scrollbar to any scrollable region.
status: beta
thumb: true
image: assets/images/components/scroller.png
---

## Scrollbar directive

Allows to add overlay scrollbars that will look the same for every browser. The directive sets up the scrollbars from the library [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/).

<code-well-header>
  <div class="d-hmx164 d-w30p d-bar8 d-ba d-bc-default" v-dt-scrollbar>
    <dt-stack>
      <div v-for="item in items" class="item">
        {{ item}}
      </div>
    </dt-stack>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-hmx164 d-w30p d-bar8 d-ba d-bc-default scrollbar" data-overlayscrollbars="host"
  data-overlayscrollbars-initialize="true">
  <div class="os-size-observer">
    <div class="os-size-observer-listener"></div>
  </div>
  <div data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYScroll" tabindex="-1">
    <div class="item">user 1</div>
    ...
  </div>
  <div class="os-scrollbar os-scrollbar-horizontal os-theme-dark os-scrollbar-auto-hide
  os-scrollbar-handle-interactive os-scrollbar-cornerless os-scrollbar-unusable">
    <div class="os-scrollbar-track">
      <div class="os-scrollbar-handle"></div>
    </div>
  </div>
  <div class="os-scrollbar os-scrollbar-vertical os-theme-dark os-scrollbar-auto-hide
  os-scrollbar-handle-interactive os-scrollbar-visible os-scrollbar-cornerless">
    <div class="os-scrollbar-track">
      <div class="os-scrollbar-handle"></div>
    </div>
  </div>
</div>
'
vueCode='
<div class="d-hmx164 d-w30p d-bar8 d-ba d-bc-default" v-dt-scrollbar>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
'
/>

## Usage

Import the directive from dialtone-vue

```javascript
import { DtScrollbarDirective } from "@dialpad/dialtone-vue";
```

Install the directive into vue instance

```javascript
Vue.use(DtScrollbarDirective);
```

To add a custom overlay scrollbar to a scrollable region, apply the `v-dt-scrollbar` directive to the desired region.
There is no need to explicitly add an `overflow` property. If the section overflows the available vertical space, a vertical scrollbar will be present. Similarly, if it exceeds the horizontal space, a horizontal scrollbar will appear.

## Characteristics

* Has an overlay style: it appears on top of the content rather than the scrollbar taking up space within the container.
* It grows when hovering the scrollbar handle for better accessibility.
* Appears when the mouse enters the scrollable area and disappears on mouse out after a certain time. This can be customized,
see [variants](#variants).
* The look and feel will be the same for every browser and OS.
* Emulates a browser's native scrollbar keyboard and mouse events.

## Variants

To customize the behavior of the scrollbar, you can use different arguments with the directive. The allowed arguments are 'leave' (default), 'never', 'scroll', and 'move'.

### Enter (default)

Show the scrollbar when the mouse enters the scrollable area. This is the default option, so no argument is needed.

```javascript
<div v-dt-scrollbar></div>
```

<code-well-header>
  <dt-stack class="d-hmx164 d-w30p d-bar8 d-ba d-bc-default" v-dt-scrollbar>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</code-well-header>

### Always

Always show the scrollbar if the region is overflowing the available space.

```javascript
<div v-dt-scrollbar:never></div>
```

<code-well-header>
  <dt-stack class="d-hmx164 d-w30p d-bar8 d-ba d-bc-default" v-dt-scrollbar:never>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</code-well-header>

### Scroll

Show the scrollbar on scroll.

```javascript
<div v-dt-scrollbar:scroll></div>
```

<code-well-header>
  <dt-stack class="d-hmx164 d-w30p d-bar8 d-ba d-bc-default" v-dt-scrollbar:scroll>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</code-well-header>

### Move

Show the scrollbar when the mouse moves inside the scrollable area.

```javascript
<div v-dt-scrollbar:move></div>
```

<code-well-header>
  <dt-stack class="d-hmx164 d-w30p d-bar8 d-ba d-bc-default" v-dt-scrollbar:move>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</code-well-header>

## Limitations

Adding this directive to a DOM element or a Vue component will alter the DOM structure, by adding four elements inside the one that the directive was attached to. If the scrollable region is a Vue component, it's recommended to wrap it in a `<div v-dt-scrollbars></div>`, to avoid altering the structure
that the component needs.

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
  padding: var(--dt-space-300) var(--dt-space-400);
  border-bottom: var(--dt-size-border-100) solid var(--dt-color-border-default);
  &:last-child {
    border-bottom: none;
  }
}
</style>
