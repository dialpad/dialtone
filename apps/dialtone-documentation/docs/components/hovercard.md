---
title: Hovercard
description: A Hovercard toggles a content overlay when its anchor element is hovered for a minimum amount of time.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-hovercard--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=14395-441
keywords: ["hover tooltip", "popover", "card overlay", "d-hovercard", "DtHovercard", "dt-hovercard", "preview card", "user card"]
---

The hovercard will appear upon the mouse entering the anchor, with a delay of 300 milliseconds. It will remain open as long as the mouse cursor is over either the open card or the anchor.

```vue demo
<example-hovercard />
<!-- @code -->
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
```

<!-- <component-combinator component-name="DtHovercard" /> -->

## Usage

- Hovercard is a **progressive enhancement**. It surfaces supplementary information about an entity or provides convenience shortcuts on hover, without navigating away from the current view. Its content or functionality **must also be reachable by another route** (a dedicated page, a menu, or an inline button).
- Keep content concise. Hovercards are transient overlays, and are not appropriate for deep interactions, multi-step flows, or extensive content.
- Use Hovercard for contextual content with structure or actions. Use [Tooltip](tooltip.md) for brief, text-only descriptions of a control. Use [Popover](popover.md) when the content is triggered by a deliberate click and should persist until dismissed.
- `enterDelay` is used to prevent the card from triggering on accidental cursor passes. The default delay of 300 ms is recommended for most contexts.

<dialtone-usage>
<template #do>

- Surface contextual details like a user's status, avatar, and quick-action shortcuts.
- Treat hovercard actions as shortcuts — ensure the same actions are reachable elsewhere in the UI.

</template>
<template #dont>

- Use Hovercard as the only way to reach content or perform an action.
- Place critical or destructive actions exclusively inside a hovercard.
- Use for deep interactions or lengthy content — prefer a dedicated UI or a [Modal](modal.md).

</template>
</dialtone-usage>

## Accessibility

When focus moves into an open hovercard, focus is trapped within. The user can Tab between focusable elements inside the card without accidentally leaving. Clicking outside the hovercard or keypress of `esc` will dismiss the card and restore focus to the element that had focus before the card opened.

## Variants

### Many Hovercards

After opening one hovercard, moving to another skips the entrance delay — a "warm-up" pattern for faster navigation between targets.

```vue demo-only
<dt-stack direction="row" gap="200">
  <example-hovercard v-for="data in exampleData" :label="data.label" :content="data.content" />
</dt-stack>
```

## Content Mode

Hovercard content renders outside the DOM tree. Use the `contentMode` prop to apply color mode (invert, light, dark) to the positioned content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

```vue demo
<dt-hovercard content-mode="invert" placement="bottom-start">
  <template #anchor>
    <dt-button :size="200" kind="muted" importance="outlined">Hover for Inverted Hovercard</dt-button>
  </template>
  <template #content>
    <dt-text as="p">This hovercard content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
  </template>
</dt-hovercard>
<!-- @code -->
<dt-hovercard content-mode="invert">...</dt-hovercard>
<dt-hovercard content-mode="dark">...</dt-hovercard>
<dt-hovercard content-mode="light">...</dt-hovercard>
```

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
