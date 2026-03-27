---
title: Card
description: A card contains summary content and actions about a single subject. It can be used by itself or within a list, and is generally interactive.
status: ready
thumb: true
image: assets/images/components/card.png
figma: planned
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-card--default
keywords: ["panel", "container", "box", "d-card", "DtCard", "dt-card", "tile", "surface"]
---

<component-combinator component-name="DtCard" />

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
- The headings should set clear expectations about the card's purpose.

## Variants and Examples

### Base

<code-example>
  <dt-card class="d-w264" header-class="h:d-bgc-moderate-opaque" content-class="h:d-bgc-moderate-opaque" footer-class="h:d-bgc-moderate-opaque">
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
</code-example>

### With Header

<code-example>
  <dt-card class="d-w264">
    <template #header>
      <dt-text as="p" kind="headline" :size="300">Lorem ipsum</dt-text>
      <dt-button
        :size="100"
        importance="clear"
        kind="muted"
        aria-label="Menu button"
      >
        <template #startIcon>
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
</code-example>

### With Footer

<code-example>
  <dt-card class="d-w264">
    <template #content>
      Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
    </template>
    <template #footer>
      <dt-button
        importance="outlined"
        :size="200"
      >
        Button
      </dt-button>
    </template>
  </dt-card>
</code-example>

### Content Only

<code-example>
  <dt-card class="d-w264">
    <template #content>
      Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
    </template>
  </dt-card>
</code-example>

### With Header, Footer and Scrollable Content

<code-example>
  <dt-card class="d-w264" content-class="d-pr0">
    <template #header>
      <dt-text as="p" kind="headline" :size="300">Lorem ipsum</dt-text>
      <dt-button
        :size="100"
        importance="clear"
        kind="muted"
        aria-label="Menu button"
      >
        <template #startIcon>
          <dt-icon
            name="more-vertical"
            size="100"
          />
        </template>
      </dt-button>
    </template>
    <template #content>
      <div class="d-h72 d-pr16" v-dt-scrollbar:never>Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.</div>
    </template>
    <template #footer>
      <dt-button
        importance="outlined"
        :size="200"
      >
        Button
      </dt-button>
    </template>
  </dt-card>
</code-example>

## Vue API

<component-vue-api component-name="card" />

## Classes

At minimum, card contains body of content. It could also have header with buttons, and footer with buttons/text.

<component-class-table component-name="card"></component-class-table>
