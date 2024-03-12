---
title: Chip
description: A Chip is a compact UI element that provides brief, descriptive information about an element. It is terse, ideally one word.
status: ready
thumb: true
image: assets/images/components/chip.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-chip--default
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

<code-example-tabs
htmlCode='
<span class="d-chip">
  <button type="button" aria-labelledby="dt0-content" aria-label="" class="d-chip__label">
    <span class="d-chip__text"> Chip </span>
  </button>
  <button type="button" aria-label="close" class="base-button__button d-btn d-btn--primary d-btn--icon-only d-chip__close">
    <span data-qa="dt-button-icon" class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg>...</svg>
    </span>
  </button>
</span>
'
vueCode='
<dt-chip>
  Chip
</dt-chip>
'
showHtmlWarning />

### Without close button

<code-well-header>
  <example-chip label="Chip" hide-close-btn/>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-chip__text">Chip</span>
  </button>
</span>
'
vueCode='
<dt-chip :hide-close="true">
  Chip
</dt-chip>
'
showHtmlWarning />

### With icon

<code-well-header>
  <example-chip label="Chip" with-icon hide-close-btn/>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-chip">
  <button class="d-chip__label" type="button">
    <span class="d-chip__icon">
      <svg>...</svg>
    </span>
    <span class="d-chip__text">Chip</span>
  </button>
</span>
'
vueCode='
<dt-chip :hide-close="true">
  <template #icon>
    <dt-icon
      name="phone"
      size="200"
    />
  </template>
  <template #default>
    Chip
  </template>
</dt-chip>
'
showHtmlWarning />

### With icon and close button

<code-well-header>
  <example-chip label="Chip" with-icon/>
</code-well-header>

<code-example-tabs
htmlCode='
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
'
vueCode='
<dt-chip>
  <template #icon>
    <dt-icon
      name="phone"
      size="200"
    />
  </template>
  <template #default>
    Chip
  </template>
</dt-chip>
'
showHtmlWarning />

### With Avatar and close button

<code-well-header>
  <example-chip label="Chip" with-avatar/>
</code-well-header>

<code-example-tabs
htmlCode='
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
'
vueCode='
<dt-chip>
  <template #avatar>
    <dt-avatar
      full-name="Jaqueline Nackos"
    />
  </template>
  <template #default>
    Chip
  </template>
</dt-chip>
'
showHtmlWarning />

### Non Interactive

To make Chip non-interactive, change the d-chip element from a button to a span. Note
the close button can still be interactive even if the chip is non-interactive.

<code-well-header>
  <example-chip label="Chip" :interactive="false"/>
</code-well-header>

<code-example-tabs
htmlCode='
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
'
vueCode='
<dt-chip :interactive="false">
    Chip
</dt-chip>
'
showHtmlWarning />

### Truncated

To truncate text, add `.d-truncate` to the content element, and set the width of the `.d-chip` element.

<code-well-header>
  <example-chip label="Chip loooooong name" truncate/>
</code-well-header>

<code-example-tabs
htmlCode='
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
'
vueCode='
<dt-chip content-class="d-w102">
  <span class="d-chip__text d-truncate">Chip loooooong name</span>
</dt-chip>
'
showHtmlWarning />

### Sizes

<code-well-header>
  <example-chip label="Chip" size="xs"/>
  <example-chip label="Chip" size="sm"/>
  <example-chip label="Chip" />
</code-well-header>

<code-example-tabs
htmlCode='
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
'
vueCode='
<dt-chip size="xs">
  chip
</dt-chip>
<dt-chip size="sm">
  chip
</dt-chip>
<dt-chip>
  chip
</dt-chip>
'
showHtmlWarning />

<script setup>
  import ExampleChip from '@exampleComponents/ExampleChip.vue';
</script>

## Vue API

<component-vue-api component-name="chip" />

## Classes

<component-class-table component-name="chip" />

[//]: # (## Accessibility)
[//]: # (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa ante, tempus vitae lacus id, luctus tristique lorem. Mauris feugiat massa ex, id aliquet mi tempor non. Curabitur non tristique lectus. Fusce ut nisl non diam dignissim viverra. In posuere dui arcu, sed eleifend massa faucibus sed. Phasellus quis leo vitae erat pellentesque venenatis id vitae lectus. Suspendisse convallis, metus a congue tincidunt, velit sem tincidunt dui, eget auctor ipsum ipsum in ex. Nullam lobortis, mauris vel vestibulum rutrum, lorem elit vehicula est, nec viverra ante erat nec dolor. Proin at placerat tortor. Nam ullamcorper metus et eros porta, at lacinia leo scelerisque. Curabitur finibus sollicitudin odio tempor finibus. Donec lobortis metus vitae mollis gravida.)
