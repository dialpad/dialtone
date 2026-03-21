---
title: Hovercard
description: A Hovercard toggles a content overlay when its anchor element is hovered for a minimum amount of time.
status: ready
thumb: true
image: assets/images/components/hovercard.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-hovercard--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=14395-441
keywords: ["hover tooltip", "popover", "card overlay", "d-hovercard", "DtHovercard", "dt-hovercard", "preview card", "user card"]
---

The hovercard will appear upon the mouse entering the anchor, with a delay of 300 milliseconds. It will remain open as long as the mouse cursor is over either the open card or the anchor.

<code-well-header>
  <div ref="baseExample">
    <example-hovercard />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.baseExample'
vueCode='
<dt-hovercard placement="bottom-start">
  <template #anchor>
    <dt-button kind="muted" importance="outlined">
      Hover over me
    </dt-button>
  </template>
  <template #content>
    <div>Content</div>
  </template>
  <template #headerContent>
    <div>Header</div>
  </template>
  <template #footerContent>
    <div>Footer</div>
  </template>
</dt-hovercard>
'
showHtmlWarning />

<!-- <component-combinator component-name="DtHovercard" /> -->

## Variants

### Many Hovercards

<code-well-header>
  <dt-stack direction="row" gap="500">
    <example-hovercard v-for="data in exampleData" :label="data.label" :content="data.content" />
  </dt-stack>
</code-well-header>

## Content Mode

Hovercard content renders outside the DOM tree. Use the `contentMode` prop to apply color mode (invert, light, dark) to the positioned content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

<code-well-header>
  <div ref="contentModeExample">
    <dt-hovercard content-mode="invert" placement="bottom-start">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined">Hover for Inverted Hovercard</dt-button>
      </template>
      <template #content>
        <dt-text as="p">This hovercard content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
      </template>
    </dt-hovercard>
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.contentModeExample'
vueCode='
<dt-hovercard content-mode="invert">...</dt-hovercard>
<dt-hovercard content-mode="dark">...</dt-hovercard>
<dt-hovercard content-mode="light">...</dt-hovercard>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="hovercard" />

<script setup>
  import ExampleHovercard from '@exampleComponents/ExampleHovercard.vue';

  const exampleData = [
    {
      label: 'Example 1',
      content: 'Content 1',
    },
    {
      label: 'Example 2',
      content: 'Content 2',
    },
    {
      label: 'Example 3',
      content: 'Content 3',
    },
  ];
</script>
