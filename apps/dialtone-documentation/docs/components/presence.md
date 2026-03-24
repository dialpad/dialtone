---
title: Presence
description: A visual control element indicating the current status of a user.
status: ready
thumb: true
image: assets/images/components/presence.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-presence--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=9628-58458
keywords: ["status", "online", "availability", "d-presence", "DtPresence", "dt-presence", "status indicator", "status dot"]
---

<component-combinator component-name="DtPresence" />

## Usage

Located at the bottom right of an avatar, the `presence` indicator displays a user's current availablity. At a glance, check if a user is available, in a meeting, on a call, away, offline, or set to 'Do Not Disturb'. It's important to note that this indicator is automatically set and cannot be changed manually by the user.

## Variants and Examples

### Active

When a user is available.
<code-example vueCode='
<dt-presence presence="active" />
'>
  <example-presence presence="active" />
</code-example>

### Busy

When a user is unavailable, either due to being **'On a call'**, **'In a meeting'**, or set to **'DND (Do Not Disturb)'**. Additionally, a text label indicating their specific status will appear under the user's name.
<code-example vueCode='
<dt-presence presence="busy" />
'>
  <example-presence presence="busy" />
</code-example>

### Away

When a user has a scheduled meeting on their synced calendar (Google G Suite or Microsoft Office 365) and is not actively participating in it through the app. Additionally, **'In a meeting'** will appear under the user's name.
<code-example vueCode='
<dt-presence presence="away" />
'>
  <example-presence presence="away" />
</code-example>

### Offline

When a user has not logged in for their first time.
<code-example vueCode='
<dt-presence presence="offline" />
'>
  <example-presence presence="offline" />
</code-example>

## Vue API

<component-vue-api component-name="presence" />

## Classes

<component-class-table component-name="presence" />

## Accessibility

You may wish to announce any live changes to this component via the screen reader since this is only a visual indicator.

If you'd like for a screen reader to read out any changes to Presence, you should pass the `srText` prop so it is
read by AT and set the `aria-live` attribute to either 'polite' or 'assertive'.
Even though the component has a role of "status" to assist SR apps in reading out status changes, its default
'aria-live' value is set to 'off'.

[See W3C guidelines](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22) for more information.

Example:

```html
<dt-presence
  presence="active"
  sr-text="User {{ user }} is active"
/>
```

Abbreviations / symbols should be read out in full for voiceover / screen readers.

<script setup>
  import ExamplePresence from '@exampleComponents/ExamplePresence.vue';
</script>
