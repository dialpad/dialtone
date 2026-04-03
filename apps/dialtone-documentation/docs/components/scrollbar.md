---
title: Scrollbar
description: A directive that adds a custom overlay scrollbar to any scrollable region.
status: beta
thumb: true
image: assets/images/components/scrollbar.png
keywords: ["scrollable", "d-scrollbar", "DtScrollbar", "dt-scrollbar", "custom scrollbar", "scroll container", "v-dt", "directive"]
---

<!-- <component-combinator component-name="DtScrollbar" /> -->

## Scrollbar Directive

Allows to add overlay scrollbars that will look the same for every browser. The directive sets up the scrollbars from the library [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/).

```vue demo
<div class="d-hmx-250 d-w-400 d-bar8 d-ba" v-dt-scrollbar>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

## Usage

Import the directive and styling from dialtone

```javascript
import { DtScrollbarDirective } from "@dialpad/dialtone/vue";

// Import styling
import 'overlayscrollbars/overlayscrollbars.css';
```

Install the directive into vue instance

```javascript
app.use(DtScrollbarDirective);
```

To add a custom overlay scrollbar to a scrollable region, apply the `v-dt-scrollbar` directive to the parent element of the desired region.
This parent element should have one and only one child. In the case where there are siblings, the scrollable element should be wrapped inside a new `<div>` tag with the directive attached by adding `<div v-dt-scrollbar></div>` around the element.
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

### Enter (Default)

Show the scrollbar when the mouse enters the scrollable area. This is the default option, so no argument is needed.

```vue demo
<div class="d-hmx-250 d-w-400 d-bar8 d-ba" v-dt-scrollbar>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

### Always

Always show the scrollbar if the region is overflowing the available space.

```vue demo
<div class="d-hmx-250 d-w-400 d-bar8 d-ba" v-dt-scrollbar:never>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

### Scroll

Show the scrollbar on scroll.

```vue demo
<div class="d-hmx-250 d-w-400 d-bar8 d-ba" v-dt-scrollbar:scroll>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

### Move

Show the scrollbar when the mouse moves inside the scrollable area.

```vue demo
<div class="d-hmx-250 d-w-400 d-bar8 d-ba" v-dt-scrollbar:move>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

## Limitations

Adding this directive to a DOM element or a Vue component will alter the DOM structure, by adding four elements inside the one that the directive was attached to. If the scrollable region is a Vue component, it's recommended to wrap it in a `<div v-dt-scrollbar></div>`, to avoid altering the structure that the component needs.

The added elements are:

* One with the class `os-size-observer`
* The second one is the scrollable viewport
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
  padding: var(--dt-spacing-50) var(--dt-spacing-100);
  border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-default);
  &:last-child {
    border-block-end: none;
  }
}
</style>
