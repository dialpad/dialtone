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

<code-well-header>
  <dt-card class="d-w264" header-class="d-bb d-bc-subtle d-py8 d-pr8" footer-class="d-bt d-bc-subtle d-py12">
    <template #header>
      <dt-stack gap="350" direction="row" align="center">
        <dt-icon class="d-fc-tertiary" name="branch" size="300" />
        <dt-text as="h3" kind="headline" size="md" tone="secondary">Lorem ipsum</dt-text>
      </dt-stack>
      <dt-dropdown navigation-type="arrow-keys" placement="bottom-end">
        <template #anchor="{ attrs }">
          <dt-button
            v-bind="attrs"
            size="sm"
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
        <template #list="{ close }">
          <dt-list-item role="menuitem" navigation-type="arrow-keys" @click="close">Edit</dt-list-item>
          <dt-list-item role="menuitem" navigation-type="arrow-keys" @click="close">Share</dt-list-item>
          <dt-dropdown-separator />
          <dt-list-item role="menuitem" navigation-type="arrow-keys" @click="close">Delete</dt-list-item>
        </template>
      </dt-dropdown>
    </template>
    <template #content>
      <dt-stack gap="400">
        <dt-text as="p" kind="body" text-box-trim="start">Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit, donec fermentum molestie semper.</dt-text>
        <dt-text as="p" kind="body" text-box-trim="end">Morbi finibus nulla turpis, nec molestie mi rutrum</dt-text>
      </dt-stack>
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
</code-well-header>

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

## Variants and Examples

### Base

<code-well-header>
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
</code-well-header>

<code-example-tabs
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
  <dt-card class="d-w264">
    <template #header>
      <dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>
      <dt-button
        size="xs"
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
</code-well-header>

<code-example-tabs
vueCode='
<dt-card class="d-w264">
  <template #header>
    <dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>
    <dt-button
      size="xs"
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
'
showHtmlWarning />

### With Footer

<code-well-header>
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
</code-well-header>

<code-example-tabs
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

### Content Only

<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__content">
      Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-card d-w264">
  <div class="d-card__content">
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
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

### With Header, Footer and Scrollable Content

<code-well-header>
  <dt-card class="d-w264" content-class="d-pr0">
    <template #header>
      <dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>
      <dt-button
        size="xs"
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
        size="sm"
      >
        Button
      </dt-button>
    </template>
  </dt-card>
</code-well-header>

<code-example-tabs
vueCode='
<dt-card class="d-w264" content-class="d-pr0">
  <template #header>
    <dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>
    <dt-button
      size="xs"
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
