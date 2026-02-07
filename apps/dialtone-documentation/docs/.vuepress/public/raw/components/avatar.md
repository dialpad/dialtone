# Avatar

An avatar is a visual representation of a user or object.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-avatar--default
- **Keywords**: profile picture, user image, profile image, d-avatar, DtAvatar, dt-avatar, initials, user icon, persona

## Usage

The Avatar component is designed to prioritize different sources for content display. It will sequentially check for the availability of an image source (`image-src`) or content through the icon slot. If both are not provided, the avatar will extract and display initials from the full name (`full-name`). The resulting initials are extracted using the following logic:

* If the string contains two or more words, the result will be the first character of the first and last word capitalized. E.g.:
`full-name: "Jaqueline Nackos"` will result in: `JN`.
* If the string contains only one word, the result will be the first two characters capitalized. E.g:
`full-name: "Jaqueline"` will result in: `JA`.
`full-name: "10"` will result in: `10`.
* If full-name is not provided, the result will be an empty string.

| Type | Usage |  |
| --- | --- | --- |
|  | Icon | When no username can be associated with the Avatar. |
|  | Initials | When the user's name is known. |
|  | Image | When a custom image has been uploaded. |
|  | Group | When reflecting more than 2 participants. |

## Variants and Examples

### Icon

```vue
<dt-avatar>
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
```

### Initials

If `color` is not provided, the avatar will display a random color. This can be deterministic, see [seeded](#seeded). The default color '000' is not included in randomized colors and can only be set manually.

```vue
<!-- colors 000 to 1800 are valid, note 000 is the default grey color. -->
<dt-avatar
  full-name="DP"
  color="100"
/>
```

### Image

If `image-src` is not provided, or if image fails to load, the avatar will fall back to the initials extracted from the `full-name`.

```vue
<dt-avatar image-src="/assets/images/person.png" image-alt="avatar user" />
```

### Sizes

```vue
<dt-avatar size="xs">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="sm" icon-name="user">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="md" icon-name="user">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="lg" icon-name="user">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="xl" icon-name="user">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
```

### Group

Adds a count badge and CSS mask to the avatar based on the number of digits (1, 2, or 3). Currently available only with the `xs` avatar size.

```vue
<dt-avatar :group="100" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar :group="11" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar :group="3" image-src="/assets/images/person.png" image-alt="Person Avatar" />
```

### Presence

Positions the [Presence](./presence.md) component at each size and applies a CSS mask to the avatar.

```vue
<dt-avatar size="xs" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="sm" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="md" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="lg" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="xl" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="xs" presence="active" color="1200" full-name="Test Name" />
<dt-avatar size="sm" presence="away" color="500" full-name="William Steele" />
<dt-avatar size="md" presence="busy" color="800" full-name="Frank Richard" />
<dt-avatar size="lg" presence="offline" color="1200" full-name="John Hawkins" />
<dt-avatar size="xl" presence="active" color="1500" full-name="Alice Edwards" />
```

### Overlay

```vue
<dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user">
  <template #overlayIcon>
    <dt-icon-hear />
  </template>
</dt-avatar>
<dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" overlay-text="+3" />
```

### Clickable

If you need to create a clickable avatar you can set the clickable prop. This will make the avatar a clickable component, set some styling and will be navigable by keyboard. In order for the clickable avatar to be fully accessible, you need to either set `full-name`, `image-alt` or `icon-aria-label` attributes.

```vue
<dt-avatar clickable icon-aria-label="user">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
```

### Seeded

You may use a seed to make the randomly generated color be the same every time for that seed. This is useful if you want users to always have the same color, just pass in their unique user ID as the seed.

```vue
<dt-avatar full-name="Jaqueline Nackos" seed="X5G3D7D3DS3WL7" />
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | Id of the avatar content wrapper element | `string` | `(function)` |
| `seed` | Pass in a seed to get the random color generation based on that string. For example if you pass in a user ID as the string it will return the same randomly generated colors every time for that user. | `string` | `''` |
| `color` | Set the avatar background to a specific color. If undefined will randomize the color which can be deterministic if the seed prop is set. | `string` | `''` |
| `size` | The size of the avatar | `string` | `'md'` |
| `avatarClass` | Used to customize the avatar container | `string\|array\|object` | `''` |
| `canvasClass` | Set classes on the avatar canvas. Wrapper around the core avatar image. | `string\|array\|object` | `''` |
| `iconClass` | Pass through classes. Used to customize the avatar icon | `string\|array\|object` | `''` |
| `presence` | Determines whether to show the presence indicator for Avatar - accepts PRESENCE_STATES values: 'busy', 'away', 'offline', or 'active'. By default, it's null and nothing is shown. | `string` | `AVATAR_PRESENCE_STATES.NONE` |
| `presenceProps` | A set of props to be passed into the presence component. | `object` | `{}` |
| `group` | Determines whether to show a group avatar. Limit to 2 digits max, more than 99 will be rendered as “99+”. if the number is 1 or less it would just show the regular avatar as if group had not been set. | `number` | `''` |
| `overlayText` | The text that overlays the avatar | `string` | `''` |
| `overlayClass` | Used to customize the avatar overlay | `string\|array\|object` | `''` |
| `imageSrc` | Source of the image | `string` | `''` |
| `imageAlt` | Alt attribute of the image, required if imageSrc is provided. Can be set to '' (empty string) if the image is described in text nearby | `string` | `''` |
| `iconSize` | Icon size to be displayed on the avatar | `string` | `''` |
| `fullName` | Full name used to extract initials. | `string` | `''` |
| `clickable` | Makes the avatar focusable and clickable, emits a click event when clicked. | `boolean` | `false` |
| `iconAriaLabel` | Descriptive label for the icon. To avoid a11y issues, set this prop if clickable and iconName are set. | `string` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `icon` | Slot for avatar icon. It will display if no imageSrc is provided |
| `overlayIcon` | Slot for overlay icon. |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `click` | Avatar click event | `PointerEvent \| KeyboardEvent` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-avatar` | n/a | Root level of Avatar. |
| `d-avatar--xs` | .d-avatar | Applies extra-small size. |
| `d-avatar--sm` | .d-avatar | Applies small size. |
| `d-avatar--md` | .d-avatar | Applies medium size. |
| `d-avatar--lg` | .d-avatar | Applies large size. |
| `d-avatar--xl` | .d-avatar | Applies extra-large size. |
| `d-avatar--color-000` | .d-avatar | Applies the default grey color. |
| `d-avatar--color-100` | .d-avatar | Applies a unique color. |
| `d-avatar--color-200` | .d-avatar | Applies a unique color. |
| `d-avatar--color-300` | .d-avatar | Applies a unique color. |
| `d-avatar--color-400` | .d-avatar | Applies a unique color. |
| `d-avatar--color-500` | .d-avatar | Applies a unique color. |
| `d-avatar--color-600` | .d-avatar | Applies a unique color. |
| `d-avatar--color-700` | .d-avatar | Applies a unique color. |
| `d-avatar--color-800` | .d-avatar | Applies a unique color. |
| `d-avatar--color-900` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1000` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1100` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1200` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1300` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1400` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1500` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1600` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1700` | .d-avatar | Applies a unique color. |
| `d-avatar--color-1800` | .d-avatar | Applies a unique color. |
| `d-avatar--group` | .d-avatar | Adjust size of Avatar and positions group count. |
| `d-avatar--group-digits-2` | .d-avatar | Adjust size of CSS mask to display 2 digits in group count. |
| `d-avatar--group-digits-3` | .d-avatar | Adjust size of CSS mask to display 3 digits in group count. |
| `d-avatar--presence` | .d-avatar | Applies CSS mask to the avatar based on the size. |
| `d-avatar__canvas` | Child of .d-avatar | The containing shape of image, initials, or icon. |
| `d-avatar__presence` | Child of .d-avatar | Displays availability of person. |
| `d-avatar__image` | Child of .d-avatar__canvas | Image of person, if applicable |
| `d-avatar__initials` | Child of .d-avatar__canvas | Initials of the person. |
| `d-avatar__icon` | Child of .d-avatar__canvas | Dialtone icon. |
| `d-avatar__count` | Child of .d-avatar--group | Displays number of people in a group. |

## Accessibility

Initial avatars' background and font color combinations have been paired to ensure minimum contrast is met.

When it comes to voiceover, avatars accompanying a label should generally be considered decorative,
is not focusable, nor is it read out. An example is a user's avatar next to their name.

Avatars unaccompanied by labels, especially those representing functionality or navigation, should be focusable and
read out in voiceover. Please refer
to [WCAG](https://www.w3.org/WAI/tutorials/images/decorative) references for
your specific usage.
