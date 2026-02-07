# Icon

Collection of customizable symbols and sizes

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-icon--default
- **Keywords**: svg,glyph,symbol,d-icon,DtIcon,dt-icon

Check out our complete icon collection in the [icon catalog](../foundations/icons.md#icon-catalog).

## Usage

Here is an example that demonstrates how you can use the icon component in your project:

### With Tree Shaking (Preferred)

```js
import { DtIconUserPlus } from '@dialpad/dialtone-icons/vue3';

<dt-icon-user-plus size="500" />
```

### Without Tree Shaking (Deprecated)

```js
import { DtIcon } from '@dialpad/dialtone'

<dt-icon name="user-plus" size="500" />
```

## Changing Sizes

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

Adjust the size using the `size` prop. Note that sizes 600, 700, and 800 are exclusively for devices.

<div class="d-gc2">

```js
<dt-icon-settings size="500" />
```

</div>
</div>

## Changing Color

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

The icon's color inherits from the parent's foreground color.

<div class="d-gc2">

```js
<dt-stack class="d-fc-success">
  <dt-icon-settings size="300" />
  <dt-text>Settings</dt-text>
</dt-stack>
```

</div>
</div>

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

When setting the color of an icon take these into consideration:

<div class="d-gc1">

- Match the icon color with the text color when pairing them.
- All icons are monochrome.

</div>

<div class="d-gc1">

- Don’t use different colors for text and icons.
- Don’t use more than one color within an icon.

</div>
</div>

## Icon and Text Alignment

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

We encourage utilizing the [Stack component](./stack.md) for aligning elements both horizontally and vertically.

<div class="d-gc2">

```html
<dt-stack direction="row" class="d-fl-center" gap="300">
  <dt-icon-settings size="300" />
  <dt-text>Settings</dt-text>
</dt-stack>
```

</div>
</div>

## Accessibility

- If the icon serves a purpose beyond its visual representation, provide a clear description in the `aria-label` prop. This ensures all users understand its function, regardless of how they interact with it, e.g: `<dt-icon-settings aria-label="Edit your profile" />`

- Icons contrast guidelines are the same as Typography.

- Avoid using icons as clickable elements; instead, use the [Icon Button](./button.md#icon-only) for interactive actions.

## Sizes

Dialtone provides eight sizes for icons. Each of the sizes represents the width and a height the icon is going to have:

<div class="d-bar8 d-ba d-bc-subtle">
| Size | Dimensions | Class |  |
| --- | --- | --- | --- |
| {{ size }} |  | {{ width_height }} | .{{ className }} |

</div>

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `size` | The size of the icon. | `string` | `'500'` |
| `name` | The icon name in kebab-case | `string` | `''` |
| `ariaLabel` | The label of the icon as read out by a screen-reader. Leave this unset if your icon is purely presentational | `string` | `''` |
