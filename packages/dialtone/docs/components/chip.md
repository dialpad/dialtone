---
title: Chip
description: A Chip is a compact UI element that provides brief, descriptive information about an element. It is terse, ideally one word.
status: ready
thumb: true
image: assets/images/components/chip.png
storybook: https://vue.dialpad.design/?path=/story/components-chip--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=9937%3A64802
---

<code-well-header>
  <example-chip label="Chip" with-avatar/>
</code-well-header>

<!-- <component-combinator component-name="DtChip" /> -->

## Variants and examples

### Base

The base chip should be the go-to chip for most of your needs.
<code-well-header>
  <example-chip label="Chip"/>
</code-well-header>

```html
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-chip__text">Chip</span>
  </button>
  <button class="d-chip__close" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
```

### Without close button

<code-well-header>
  <example-chip label="Chip" hide-close-btn/>
</code-well-header>

```html
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-chip__text">Chip</span>
  </button>
</span>
```

### With icon

<code-well-header>
  <example-chip label="Chip" with-icon hide-close-btn/>
</code-well-header>

```html
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-chip__icon">
      <svg>...</svg>
    </span>
    <span class="d-chip__text">Chip</span>
  </button>
</span>
```

### With icon and close button

<code-well-header>
  <example-chip label="Chip" with-icon/>
</code-well-header>

```html
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-chip__icon">
      <svg>...</svg>
    </span>
    <span class="d-chip__text">Chip</span>
  </button>
  <button class="d-chip__close" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
```

### With Avatar and close button

<code-well-header>
  <example-chip label="Chip" with-avatar/>
</code-well-header>

```html
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-avatar">...</span>
    <span class="d-chip__text">Chip</span>
  </button>
  <button class="d-chip__close" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
```

### Non Interactive

To make Chip non-interactive, change the d-chip element from a button to a span. Note
the close button can still be interactive even if the chip is non-interactive.

<code-well-header>
  <example-chip label="Chip" :interactive="false"/>
</code-well-header>

```html
<span class="d-chip">
  <span class="d-chip__label">
    <span class="d-chip__text">Chip</span>
  </span>
  <button class="d-chip__close" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
```

### Truncated

To truncate text, add `.d-truncate` to the content element, and set the width of the `.d-chip` element.

<code-well-header>
  <example-chip label="Chip loooooong name" truncate/>
</code-well-header>

```html
<span class="d-chip">
  <button class="d-chip__label d-w102" type="button">
    <span class="d-chip__text d-truncate">Chip loooooong name</span>
  </button>
  <button class="d-chip__close" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
```

### Sizes

<code-well-header>
  <example-chip label="Chip" with-icon size="xs"/>
  <example-chip label="Chip" with-avatar size="sm"/>
  <example-chip label="Chip" with-icon/>
</code-well-header>

```html
<span class="d-chip">
  <button class="d-chip__label d-chip__label--xs" type="button">
    <span class="d-chip__icon">
      <svg>...</svg>
    </span>
    <span class="d-chip__text">Chip</span>
  </button>
  <button class="d-chip__close d-chip__close--xs" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
<span class="d-chip">
  <button class="d-chip__label d-chip__label--sm" type="button">
    <span class="d-avatar">...</span>
    <span class="d-chip__text">Chip</span>
  </button>
  <button class="d-chip__close d-chip__close--sm" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-chip__icon">
      <svg>...</svg>
    </span>
    <span class="d-chip__text">Chip</span>
  </button>
  <button class="d-chip__close" type="button" aria-label="close">
    <span class="d-btn__icon">
      <svg>...</svg>
    </span>
  </button>
</span>
```

<script setup>
  import ExampleChip from '@exampleComponents/ExampleChip.vue';
</script>

## Vue API

<component-vue-api component-name="chip" />

## Classes

<component-class-table component-name="chip" />

[//]: # (## Accessibility)
[//]: # (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa ante, tempus vitae lacus id, luctus tristique lorem. Mauris feugiat massa ex, id aliquet mi tempor non. Curabitur non tristique lectus. Fusce ut nisl non diam dignissim viverra. In posuere dui arcu, sed eleifend massa faucibus sed. Phasellus quis leo vitae erat pellentesque venenatis id vitae lectus. Suspendisse convallis, metus a congue tincidunt, velit sem tincidunt dui, eget auctor ipsum ipsum in ex. Nullam lobortis, mauris vel vestibulum rutrum, lorem elit vehicula est, nec viverra ante erat nec dolor. Proin at placerat tortor. Nam ullamcorper metus et eros porta, at lacinia leo scelerisque. Curabitur finibus sollicitudin odio tempor finibus. Donec lobortis metus vitae mollis gravida.)
