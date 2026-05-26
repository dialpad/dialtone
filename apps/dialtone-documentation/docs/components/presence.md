---
title: Presence
description: A visual control element indicating the current status of a user.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-presence--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=9628-58458
keywords: ["status", "online", "availability", "d-presence", "DtPresence", "dt-presence", "status indicator", "status dot"]
---

<component-combinator component-name="DtPresence" />

## Usage

Located at the bottom right of an avatar, the `presence` indicator displays a user's current availability. At a glance, check if a user is available, on a call, in a meeting, away, set to Do Not Disturb, or offline. Most states are inferred automatically from user activity; Do Not Disturb is a state the user explicitly opts into.

By default, the dot contains a state-specific glyph so state isn't conveyed by color alone: a checkmark for active, a minus dash for busy and dnd. Consumers who want a dot-only treatment can opt out with `:show-icon="false"`. The `away` and `offline` states do not render a glyph.

## Variants and Examples

### Active

When a user is available.

```vue demo
<dt-presence presence="active" />
<!-- @code -->
<dt-presence presence="active" />
```

### Busy

When a user is unavailable due to being **'On a call'** or **'In a meeting'**. Additionally, a text label indicating their specific status will appear under the user's name.

```vue demo
<dt-presence presence="busy" />
<!-- @code -->
<dt-presence presence="busy" />
```

### Do not Disturb

When a user has explicitly silenced themselves. The dot uses a border-only treatment in the unavailable color with a minus dash glyph.

```vue demo
<dt-presence presence="dnd" />
<!-- @code -->
<dt-presence presence="dnd" />
```

### Away

When a user has a scheduled meeting on their synced calendar (Google G Suite or Microsoft Office 365) and is not actively participating in it through the app. Additionally, **'In a meeting'** will appear under the user's name.

```vue demo
<dt-presence presence="away" />
<!-- @code -->
<dt-presence presence="away" />
```

### Offline

When a user has not logged in for their first time.

```vue demo
<dt-presence presence="offline" />
<!-- @code -->
<dt-presence presence="offline" />
```

### Without icon

Pass `:show-icon="false"` for a dot-only treatment across all states. The `offline` state never renders a glyph regardless of `showIcon`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-presence presence="active" :show-icon="false" />
  <dt-presence presence="away" :show-icon="false" />
  <dt-presence presence="busy" :show-icon="false" />
  <dt-presence presence="dnd" :show-icon="false" />
  <dt-presence presence="offline" :show-icon="false" />
</dt-stack>
<!-- @code -->
<dt-presence presence="active" :show-icon="false" />
<dt-presence presence="away" :show-icon="false" />
<dt-presence presence="busy" :show-icon="false" />
<dt-presence presence="dnd" :show-icon="false" />
<dt-presence presence="offline" :show-icon="false" />
```

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

```vue code-only
<dt-presence
  presence="active"
  sr-text="User {{ user }} is active"
/>
```

Abbreviations / symbols should be read out in full for voiceover / screen readers.
