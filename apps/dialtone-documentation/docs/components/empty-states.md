---
title: Empty state
description: When there's no data to display in a list, table, or other information container, we use an ‘Empty State’ component to guide users, clarifying the expected information and suggesting ways to populate it.
status: ready
thumb: true
image: assets/images/components/card.png
figma: planned
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-card--default
---

<code-well-header>
 <!-- Empty state storybook-->
</code-well-header>

## Morphology & Anatomy

Image with bullets

1. Illustrations*
2. Title
3. Description*
4. Actions
5. Primary (this primary action, can be a primary button or a muted one)
6. Secondary*
7. Background

The empty state uses all the space of the container it's replacing, always keeping the content in the middle.
*optionals

The space taken by the empty state can vary, the padding will be minimum 24px and can be flexible and adapt the container size.

## Usage

Cards are surfaces that display content and actions on a single topic.
They should be easy to scan for relevant and actionable information. Elements, like text and images, should be placed on them in a way that clearly indicates hierarchy.

<dialtone-usage>
<template #do>

- To display content and actions on a single topic.
</template>

<template #dont>

- Add too many call-to-action elements to the same card. A card should only contain a single primary action.
- Inform users about important changes.
</template>

</dialtone-usage>

### Best Practices

- It should only contain a single idea that may feature a call-to-action, or the option to navigate to more detailed content.
- The content of a card should be concise and offer only a preview of detailed content.
- The headings should set clear expectations about the card’s purpose.

## Variants and examples

### Base

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__header">
      <div>(header slot)</div>
    </div>
    <div class="d-card__content">
      <div>(content slot)</div>
    </div>
    <div class="d-card__footer">
      <div>(footer slot)</div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__header">
    <div>(header slot)</div>
  </div>
  <div class="d-card__content">
    <div>(content slot)</div>
  </div>
  <div class="d-card__footer">
    <div>(footer slot)</div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #header>
    (header slot)
  </template>
  <template #content>
    (content slot)
  </template>
  <template #footer>
    (footer slot)
  </template>
</dt-card>
'
showHtmlWarning />

### With Header

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__header">
      <div class="d-headline--md">
        Lorem ipsum
      </div>
      <button type="button" class="d-btn d-btn--xs d-btn--circle">
        <dt-icon name="more-vertical" size="200" />
      </button>
    </div>
    <div class="d-card__content">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__header">
    <div class="d-headline--md">
      Lorem ipsum
    </div>
    <button type="button" class="d-btn d-btn--xs d-btn--circle">
      <dt-icon name="more-vertical" size="200" />
    </button>
  </div>
  <div class="d-card__content">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #header>
    <p class="d-headline-medium">Lorem ipsum</p>
      <dt-button
        size="xs"
        importance="clear"
        aria-label="Menu button"
      >
        <template #icon>
          <dt-icon
            name="more-vertical"
            size="100"
          />
        </template>
      </dt-button>
  </template>
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
</dt-card>
'
showHtmlWarning />

### With Footer

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__content">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
    <div class="d-card__footer">
      <div class="d-d-flex d-gg8">
        <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
      </div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__content">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
  <div class="d-card__footer">
    <div class="d-d-flex d-gg8">
      <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
    </div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
  <template #footer>
    <dt-button
      importance="outlined"
      size="sm"
    >
      Button
    </dt-button>
  </template>
</dt-card>
'
showHtmlWarning />

### Content only

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__content">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__content">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
</div>
'
vueCode='
<dt-card class="d-w264">
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
</dt-card>
'
showHtmlWarning />

### With Header, Footer and scrollable content

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__header">
      <div class="d-headline--md">
        Lorem ipsum
      </div>
      <button type="button" class="d-btn d-btn--xs d-btn--circle">
        <dt-icon name="more-vertical" size="200" />
      </button>
    </div>
    <div class="d-card__content d-h72">
      <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </div>
    <div class="d-card__footer">
      <div class="d-d-flex d-gg8">
        <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
      </div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__header">
    <div class="d-headline--md">
      Lorem ipsum
    </div>
    <button type="button" class="d-btn d-btn--xs d-btn--circle">
      <dt-icon name="more-vertical" size="200" />
    </button>
  </div>
  <div class="d-card__content d-h84">
    <div>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
  </div>
  <div class="d-card__footer">
    <div class="d-d-flex d-gg8">
      <button type="button" class="d-btn d-btn--sm d-btn--outlined">Button</button>
    </div>
  </div>
</div>
'
vueCode='
<dt-card max-height="50px" class="d-w264">
  <template #header>
    <p class="d-headline-medium">Lorem ipsum</p>
      <dt-button
        size="xs"
        importance="clear"
        aria-label="Menu button"
      >
        <template #icon>
          <dt-icon
            name="more-vertical"
            size="100"
          />
        </template>
      </dt-button>
  </template>
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
  <template #footer>
    <dt-button
      importance="outlined"
      size="sm"
    >
      Button
    </dt-button>
  </template>
</dt-card>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="card" />

## Classes

At minimum, card contains body of content. It could also have header with buttons, and footer with buttons/text.

<component-class-table component-name="card"></component-class-table>
