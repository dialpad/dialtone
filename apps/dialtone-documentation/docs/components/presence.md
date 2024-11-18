---
title: Presence
description: A visual control element indicating the current status of a user.
status: ready
thumb: true
image: assets/images/components/presence.png
storybook: https://dialtone.dialpad.com/vue/?path=/docs/components-presence--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=9628%3A59018&viewport=-1353%2C1919%2C1.91&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <example-presence presence="active"/>
</code-well-header>

## Usage

Located at the bottom right of an avatar, the `presence` indicator displays a user's current availablity. At a glance, check if a user is available, in a meeting, on a call, away, offline, or set to 'Do Not Disturb'. It's important to note that this indicator is automatically set and cannot be changed manually by the user.

## Variants and examples

### Active

When a user is available.
<code-well-header>
  <example-presence presence="active"/>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-presence">
  <div class="d-presence__inner d-presence__inner--active"></div>
</div>
'
vueCode='
<dt-presence
  presence="active"
/>
'
showHtmlWarning />

### Busy

When a user is unavailable, either due to being **'On a call'**, **'In a meeting'**, or set to **'DND (Do Not Disturb)'**. Additionally, a text label indicating their specific status will appear under the user's name.
<code-well-header>
  <example-presence presence="busy"/>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-presence">
  <div class="d-presence__inner d-presence__inner--busy"></div>
</div>
'
vueCode='
<dt-presence
  presence="busy"
/>
'
showHtmlWarning />

### Away

When a user has a scheduled meeting on their synced calendar (Google G Suite or Microsoft Office 365) and is not actively participating in it through the app. Additionally, **'In a meeting'** will appear under the user's name.
<code-well-header>
  <example-presence presence="away"/>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-presence">
  <div class="d-presence__inner d-presence__inner--away"></div>
</div>
'
vueCode='
<dt-presence
  presence="away"
/>
'
showHtmlWarning />

### Offline

When a user has not logged in for their first time.
<code-well-header>
  <example-presence presence="offline"/>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-presence">
  <div class="d-presence__inner d-presence__inner--offline"></div>
</div>
'
vueCode='
<dt-presence
  presence="offline"
/>
'
showHtmlWarning />

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
