# Presence

A visual control element indicating the current status of a user.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-presence--default
- **Keywords**: status, online, availability, d-presence, DtPresence, dt-presence, status indicator, status dot

## Usage

Located at the bottom right of an avatar, the `presence` indicator displays a user's current availablity. At a glance, check if a user is available, in a meeting, on a call, away, offline, or set to 'Do Not Disturb'. It's important to note that this indicator is automatically set and cannot be changed manually by the user.

## Variants and Examples

### Active

When a user is available.

```vue
<dt-presence presence="active"  />
```

### Busy

When a user is unavailable, either due to being **'On a call'**, **'In a meeting'**, or set to **'DND (Do Not Disturb)'**. Additionally, a text label indicating their specific status will appear under the user's name.

```vue
<dt-presence presence="busy" />
```

### Away

When a user has a scheduled meeting on their synced calendar (Google G Suite or Microsoft Office 365) and is not actively participating in it through the app. Additionally, **'In a meeting'** will appear under the user's name.

```vue
<dt-presence presence="away" />
```

### Offline

When a user has not logged in for their first time.

```vue
<dt-presence presence="offline" />
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `presence` | Determines the color of the inner presence circle, indicating status. Accepts one of 4 values: 'busy', 'away', 'active', 'offline' | `string` | `PRESENCE_STATES.ACTIVE` |
| `srText` | Since Presence is a visual element, we need SRs to read out any state changes that occur. Text entered here will be read by assistive technology. If null this component will be ignored by AT. | `string` | `null` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-presence` | N/A | Styles the outer border circle (default styling). |
| `d-presence__inner` | N/A | Styles the inner (colored) status circle. |
| `d-presence__inner--active` | d-presence__inner | Updates the background color of the inner Presence circle to be active color. |
| `d-presence__inner--away` | d-presence__inner | Updates the background color of the inner Presence circle to be away color. |
| `d-presence__inner--busy` | d-presence__inner | Updates the background color of the inner Presence circle to be away color. |
| `d-presence__inner--offline` | d-presence__inner | Updates the background color of the inner Presence circle to be offline color. |

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
