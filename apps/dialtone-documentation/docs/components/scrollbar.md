---
title: Scrollbar
description: A directive that adds a custom overlay scrollbar to any scrollable region.
status: ready
thumb: true
keywords: ["scrollable", "d-scrollbar", "DtScrollbar", "dt-scrollbar", "custom scrollbar", "scroll container", "v-dt", "directive"]
---

## Scrollbar Directive

Allows to add overlay scrollbars that will look the same for every browser. The directive sets up the scrollbars from the library [OverlayScrollbars](https://kingsora.github.io/OverlayScrollbars/).

```vue demo
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar>
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
import { DtScrollbarDirective } from "@dialpad/dialtone/vue3";

// Import styling
import "overlayscrollbars/overlayscrollbars.css";
```

Install the directive into vue instance

```javascript
app.use(DtScrollbarDirective);
```

To add a custom overlay scrollbar to a scrollable region, apply the `v-dt-scrollbar` directive to the parent element of the desired region.
This parent element should have one and only one child. In the case where there are siblings, the scrollable element should be wrapped inside a new `<div>` tag with the directive attached by adding `<div v-dt-scrollbar></div>` around the element.
There is no need to explicitly add an `overflow` property. If the section overflows the available vertical space, a vertical scrollbar will be present. Similarly, if it exceeds the horizontal space, a horizontal scrollbar will appear.

## Characteristics

- Has an overlay style: it appears on top of the content rather than the scrollbar taking up space within the container.
- It grows when hovering the scrollbar handle for better accessibility.
- Appears when the mouse enters the scrollable area and disappears on mouse out after a certain time. This can be customized,
  see [variants](#variants).
- The look and feel will be the same for every browser and OS.
- Emulates a browser's native scrollbar keyboard and mouse events.

## Variants

To customize the behavior of the scrollbar, you can use different show modes with the directive. The allowed values are `'enter'` (default), `'always'`, `'scroll'`, and `'move'`.

### Enter (Default)

Show the scrollbar when the mouse enters the scrollable area. This is the default option, so no configuration is needed.

```vue demo
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar>
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
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar:always>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

The object syntax is also supported:

```vue code-only
<div v-dt-scrollbar="{ showScrollbar: 'always' }">
  <div>content</div>
</div>
```

### Scroll

Show the scrollbar on scroll.

```vue demo
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar:scroll>
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
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar:move>
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

## Configuration Object

In addition to using directive arguments for scrollbar visibility (`:always`, `:scroll`, `:move`), you can pass a configuration object to the directive that supports additional options like offsets, CSS classes, and explicit show behavior.

### Basic Syntax

```vue code-only
<div v-dt-scrollbar="{ showScrollbar: 'always', offset: { blockStart: 64 } }">
  <div>Scrollable content</div>
</div>
```

### Configuration Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `showScrollbar` | `'enter' \| 'always' \| 'scroll' \| 'move'` | `'enter'` | Scrollbar visibility mode |
| `offset` | `Object` | `null` | Offset configuration for scrollbar positioning |
| `offset.blockStart` | `number \| string` | `undefined` | Insets vertical scrollbar from the block-start (aka top) edge |
| `offset.blockEnd` | `number \| string` | `undefined` | Insets horizontal scrollbar from the block-end (aka bottom) edge |
| `offset.inlineStart` | `number \| string` | `undefined` | Insets horizontal scrollbar from the inline-start (aka left) edge |
| `offset.inlineEnd` | `number \| string` | `undefined` | Insets vertical scrollbar from the inline-end (aka right) edge |
| `blockClasses` | `string` | `undefined` | CSS classes to apply to the vertical scrollbar |
| `inlineClasses` | `string` | `undefined` | CSS classes to apply to the horizontal scrollbar |

### Offset Option

The `offset` option allows you to adjust the positioning of scrollbars to accommodate fixed headers, footers, or other UI elements that overlap with the scrollable region. This eliminates the need for manual CSS overrides.

```vue demo
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar="{ offset: { blockStart: 20, blockEnd: 20 }, showScrollbar: 'always' }">
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

#### Offset Properties

| Property | Type | Description |
| --- | --- | --- |
| `blockStart` | `number \| string` | Insets vertical scrollbar from the block-start (aka top) edge |
| `blockEnd` | `number \| string` | Insets horizontal scrollbar from the block-end (aka bottom) edge |
| `inlineStart` | `number \| string` | Insets horizontal scrollbar from the inline-start (aka left) edge |
| `inlineEnd` | `number \| string` | Insets vertical scrollbar from the inline-end (aka right) edge |

#### Numeric Values (Auto-converted to px)

```vue code-only
<div v-dt-scrollbar="{ offset: { blockStart: 64, blockEnd: 32 } }">
  <div>Content with 64px block-start offset and 32px block-end offset</div>
</div>
```

#### String Values (Supports any CSS unit)

```vue code-only
<div v-dt-scrollbar="{ offset: { blockStart: '4rem', blockEnd: '2em' } }">
  <div>Content with rem/em offsets</div>
</div>
```

#### CSS Variables

```vue code-only
<div v-dt-scrollbar="{ offset: { blockStart: 'var(--header-height)' } }">
  <div>Content with CSS variable offset</div>
</div>
```

#### Calc() Expressions

```vue code-only
<div v-dt-scrollbar="{ offset: { blockStart: 'calc(100% - 64px)' } }">
  <div>Content with calculated offset</div>
</div>
```

### CSS Classes

The directive supports applying custom CSS classes to scrollbar elements, allowing you to use utility classes or custom styles for scrollbar appearance.

#### Block Axis (Vertical) Scrollbar Classes

```vue demo
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar="{ blockClasses: 'd-w12 d-bgc-purple-300', showScrollbar: 'always' }">
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

#### Inline Axis (Horizontal) Scrollbar Classes

```vue code-only
<div v-dt-scrollbar="{ inlineClasses: 'd-h8 d-bgc-blue-300' }">
  <div>Scrollable content with styled horizontal scrollbar</div>
</div>
```

#### Both Scrollbars

```vue code-only
<div v-dt-scrollbar="{
  blockClasses: 'd-w12',
  inlineClasses: 'd-h8'
}">
  <div>Different classes for each scrollbar</div>
</div>
```

#### Combined with Offset

```vue demo
<div class="d-hmx164 d-w30p d-bar8 d-ba" v-dt-scrollbar="{ offset: { blockStart: 20, blockEnd: 20 }, blockClasses: 'd-w12 d-bgc-magenta-300', showScrollbar: 'always' }">
  <dt-stack>
    <div v-for="item in items" class="item">
      {{ item}}
    </div>
  </dt-stack>
</div>
```

### ShowScrollbar Validation

The `showScrollbar` property is validated to ensure only valid values are used. If an invalid value is provided, the directive will log an informational message and fall back to the default `'enter'` mode.

**Valid values:** `'enter'`, `'always'`, `'scroll'`, `'move'`

```vue code-only
<!-- Valid -->
<div v-dt-scrollbar="{ showScrollbar: 'always' }"></div>

<!-- Invalid - falls back to 'enter' with console message -->
<div v-dt-scrollbar="{ showScrollbar: 'invalid' }"></div>
```

### Common Use Cases

#### Fixed Header

When you have a fixed header that overlaps the scrollable region:

```vue code-only
<div class="page">
  <header class="fixed-header">Fixed Header (64px tall)</header>
  <div v-dt-scrollbar="{ offset: { blockStart: 64 } }" class="content">
    <div>Scrollable content</div>
  </div>
</div>
```

#### Fixed Header and Footer

When you have both fixed header and footer:

```vue code-only
<div class="page">
  <header class="fixed-header">Header</header>
  <div v-dt-scrollbar="{ offset: { blockStart: 64, blockEnd: 48 } }" class="content">
    <div>Scrollable content</div>
  </div>
  <footer class="fixed-footer">Footer</footer>
</div>
```

#### Dynamic Offsets (Reactive)

Offsets can be reactive and will update automatically:

```vue code-only
<template>
  <div v-dt-scrollbar="scrollbarConfig">
    <div>Scrollable content</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerVisible: true
    }
  },
  computed: {
    scrollbarConfig() {
      return {
        offset: {
          blockStart: this.headerVisible ? 64 : 0
        },
        showScrollbar: 'always'
      }
    }
  }
}
</script>
```

## Limitations

Adding this directive to a DOM element or a Vue component will alter the DOM structure, by adding four elements inside the one that the directive was attached to. If the scrollable region is a Vue component, it's recommended to wrap it in a `<div v-dt-scrollbar></div>`, to avoid altering the structure that the component needs.

The added elements are:

- One with the class `os-size-observer`
- The second one is the scrollable viewport
- The horizontal scrollbar
- The vertical scrollbar

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
  padding: var(--dt-size-300) var(--dt-size-400);
  border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-default);
  &:last-child {
    border-block-end: none;
  }
}
</style>
