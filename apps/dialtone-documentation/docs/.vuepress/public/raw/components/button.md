# Button

A button is an UI element which signals key actions to take an action throughout an app. It is important a button is identifiable, consistent, communicates its actions clearly, and is appropriately sized to its action.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-button--default
- **Keywords**: btn,click,action,cta,d-button,DtButton,dt-button

## Usage

- `<button>` and link (`<a>`) HTML elements each describe a specific intent. Understanding the distinction is important: if it goes somewhere, it's a link (`<a>`). If an action occurs, use a Button (`<button>`).
- Avoid using too many buttons on a page.
- Set the `type` attribute to define its purpose: `submit`, `button`, or `reset`. Browsers default to `submit` if it isn't defined, and that cannot be assumed as the preferred behavior.

**Do:**

- Conveying that an action that will occur when invoked.
- To trigger an action or behavior, such as submitting a form or spawning a [Modal](modal.md).

**Don't:**

- Avoid using to navigate between destinations, deferring to a [Link](link.md) instead).

## Writing Guidelines

Button labels should be clear and predictable so users have confidence in their actions.

- Lead with a strong verb and use **verb + noun** structure except for common actions like “Done,” “Close,” “Cancel,” or “OK”
- Should be sentence case
- Do not use punctuation
- Avoid unnecessary articles such as “the,” “an,” and “a.”

**Do:**

- Add number
- Create menu

**Don't:**

- Add Number
- Create a menu

## Variants

Dialtone provides five options for `kind`, with three levels of `importance`.

| | clear | outlined | primary |
| --- | --- | --- | --- |
| **default** — Our default button colors. | Default level of importance. Typically used for secondary or minimally important actions. | Slightly more important than clear, presenting a contrasting border and transparent background. | Highest level of importance, presenting a solid background color. |
| **danger** — Potentially destructive or otherwise critical actions. | clear danger | outlined danger | primary danger |
| **positive** — Used to communicate positive actions. | clear positive | outlined positive | primary positive |
| **inverted** — Use for placement on non-white, dark backgrounds. | clear inverted | outlined inverted | primary inverted |
| **muted** — For non-primary actions and contexts where base style may not work. | clear muted | outlined muted | N/A |
| **unstyled** — Raw button devoid of any style. | N/A | N/A | N/A |

### Default

The base button should be the go-to button for most of your needs. When in doubt, use this style. To help provide clarity to users, it is generally recommended to use only one primary button style within a section or page.

```vue
<dt-button> Place Call </dt-button>
<dt-button importance="outlined"> Place Call </dt-button>
<dt-button importance="clear"> Place Call </dt-button>
```

### Danger

The danger button style is used to communicate critical or destructive actions such as deleting content, accounts, or canceling services.

```vue
<dt-button kind="danger"> Place Call </dt-button>
<dt-button kind="danger" importance="outlined"> Place Call </dt-button>
<dt-button kind="danger" importance="clear"> Place Call </dt-button>
```

### Positive

The positive button style is used to communicate positive actions.

```vue
<dt-button kind="positive"> Place Call </dt-button>
<dt-button kind="positive" importance="outlined"> Place Call </dt-button>
<dt-button kind="positive" importance="clear"> Place Call </dt-button>
```

### Inverted

The inverted button style is used to visually separate buttons set on darker backgrounds.

```vue
<dt-button kind="inverted"> Place Call </dt-button>
<dt-button kind="inverted" importance="outlined"> Place Call </dt-button>
<dt-button kind="inverted" importance="clear"> Place Call </dt-button>
```

### Muted

The muted button style is used to communicate non-primary actions for contexts in which the base style may not work
(e.g. colored backgrounds, validation components, etc).
This style’s use should be rare. When in doubt, use the [default button style](#default).

```vue
<dt-button kind="muted" importance="clear"> Place Call </dt-button>
<dt-button kind="muted" importance="outlined"> Place Call </dt-button>
```

### Disabled

Buttons can be disabled using either the `disabled` attribute or a Dialtone class. Use the attribute when a button should appear disabled and not recieve focus; use the class when a button should appear disabled but still recieve focus (i.e. a disabled button with a tooltip). Using the class also requires `aria-disabled` and a wrapper to display the "not allowed" pointer. Additional javascript implementation is required to prevent the click event.
All button styles and variations appear the same when disabled.

```vue
<!-- disabled attribute -->
<dt-button disabled>Place Call</dt-button>
<!-- disabled class -->
<span class="d-c-not-allowed">
  <dt-button class="d-btn--disabled">Place Call</dt-button>
</span>
```

### Active

Buttons can be set to active state using the `active` prop or `.d-btn--active` Dialtone class.

```vue
<dt-button importance="clear" active>Place Call</dt-button>
<dt-button active>Place Call</dt-button>
<dt-button kind="danger" importance="clear" active>Place Call</dt-button>
<dt-button kind="positive" importance="clear" active>Place Call</dt-button>
<dt-button kind="inverted" active>Place Call</dt-button>
<dt-button kind="muted" active>Place Call</dt-button>
```

### Link

Buttons can be styled as a [Link](link.md) in situations for which you need the appearance of a link but behavior of a button. Using the `button` element provides a better accessibility experience.

```vue
<dt-button link>Place Call</dt-button>
<dt-button link linkKind="warning">Place Call</dt-button>
<dt-button link linkKind="danger">Place Call</dt-button>
<dt-button link linkKind="success">Place Call</dt-button>
<dt-button link linkKind="muted">Place Call</dt-button>
<dt-button link disabled>Place Call</dt-button>
```

### Unstyled

The unstyled button removes all default Dialtone styling while preserving the semantic HTML `<button>` element and maintaining proper button behavior and accessibility.

```vue
<dt-button kind="unstyled">Place Call</dt-button>
```

## Split Button

The [Split Button](split-button.md) is its own component containing multiple buttons.

## Sizes

The default button size is `md`, but does not need to be explicitly specified.

```vue
<dt-button size="xs"> Place Call </dt-button>
<dt-button size="sm"> Place Call </dt-button>
<dt-button> Place Call </dt-button>
<dt-button size="lg"> Place Call </dt-button>
<dt-button size="xl"> Place Call </dt-button>
```

## Icon Support

### Icon and Label

Button labels can include an icon next to the text. Every button style can accept icon classes, though we only provide a few possible examples. `icon-position` can be `left` (default), `right`, `top`, `bottom`.

```vue
<dt-button importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
<dt-button importance="outlined" icon-position="top">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
<dt-button importance="outlined" icon-position="bottom">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
<dt-button importance="outlined" icon-position="right">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
  Label
</dt-button>
```

### Icon Only

Icon-only buttons are commonly used for toggling actions, navigation, or closing UI elements.

```vue
<dt-button v-dt-tooltip="`Tooltip`" kind="muted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="muted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="danger" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="danger" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="danger">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="clear" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" importance="outlined" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="inverted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="inverted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" kind="inverted">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
```

#### Circle

The following styles are available as a circle shape.

```vue
<dt-button v-dt-tooltip="`Tooltip`" circle kind="muted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="muted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="danger" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="danger" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="danger">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle importance="clear" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle importance="outlined" kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="positive">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted" importance="clear">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted" importance="outlined">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle kind="inverted">
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
```

## Loading

Loading buttons are useful for communicating a delay between the button interaction and its action taking place. Every button style can accept the loading button class, though we only provide a few possible examples.

### Replace button label

The width of the button remains determined by the length of the label, which is visually hidden in this state.

```vue
<dt-button loading> Place Call </dt-button>
<dt-button v-dt-tooltip="`Tooltip`" loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button v-dt-tooltip="`Tooltip`" circle loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button kind="muted" importance="outlined" loading> Place Call </dt-button>
<dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
<dt-button kind="muted" importance="outlined" v-dt-tooltip="`Tooltip`" circle loading>
  <template #icon>
    <dt-icon
      name="phone"
      size="300"
    />
  </template>
</dt-button>
```

### With label

```vue
<dt-button icon-position="right">
  Validating
  <template #icon="{ iconSize }">
    <dt-loader :size="iconSize" />
  </template>
</dt-button>
```

## Branded

We provide the following branded buttons for log-in and sign-up workflows.

```html
<button class="d-btn d-btn--brand d-btn--google" type="button">
  <span class="d-btn__icon"><icon-google-glyph /></span>
  <span class="d-btn__label">Log in with Google</span>
</button>
<button class="d-btn d-btn--brand d-btn--o365" type="button">
  <span class="d-btn__icon"><icon-google-glyph /></span>
  <span class="d-btn__label">Log in with Office365</span>
</button>
<button class="d-btn d-btn--brand d-btn--linkedin" type="button">
  <span class="d-btn__icon"><icon-google-glyph /></span>
  <span class="d-btn__label">Log in with LinkedIn</span>
</button>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `circle` | Whether the button is a circle or not. | `boolean` | `false` |
| `iconPosition` | The position of the icon slot within the button. | `string` | `'left'` |
| `importance` | The fill and outline of the button associated with its visual importance. | `string` | `'primary'` |
| `link` | Whether the button should be styled as a link or not. | `boolean` | `false` |
| `linkKind` | The color of the link and button if the button is styled as a link. | `string` | `'default'` |
| `linkInverted` | Determines whether the link should have inverted styling if the button is styled as a link. | `boolean` | `false` |
| `disabled` | HTML button disabled attribute <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank"> (Reference) </a> | `boolean` | `false` |
| `type` | HTML button type attribute <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type" target="_blank" > (Reference) </a> | `string` | `'button'` |
| `width` | Button width, accepts <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/CSS/width" target="_blank"> CSS width attribute </a> values | `string` | `null` |
| `size` | The size of the button. | `string` | `'md'` |
| `labelClass` | Used to customize the label container | `string\|array\|object` | `''` |
| `loading` | Whether the button should display a loading animation or not. | `boolean` | `false` |
| `kind` | The color of the button. | `string` | `'default'` |
| `assertiveOnFocus` | Determines whether a screenreader reads live updates of the button content to the user while the button is in focus. default is to not. | `boolean` | `false` |
| `active` | Determines whether the button should have active styling default is false. | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `icon` | Button icon |
| `default` | Content within button |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `focusin` | Native button focus in event | `FocusEvent` |
| `focusout` | Native button focus out event | `FocusEvent` |

## Accessibility

- Choosing between Link and Button elements is paramount for screenreaders to inform the user what will occur. For example: will it go somewhere (Link) or will something happen (Button)?
- Do not rely on color alone to convey the intent of the button. Defer to the button text as primary way to convey the buttons intent.
- Display a visible focus state when users tab to them.
- Use standard semantic usage of HTML elements.
- Be aware of how screenreaders handle buttons and links differently. For example, both the `Enter` and `Space` keys triggers a button, while links are triggered only by the `Enter` key.
- If it is a button type while focused:
  - Pressing the `Enter` or `Space` key should trigger the action.
  - Pressing the `Tab` key moves focus to the next focusable element.
  - Pressing the `Shift+Tab` key moves focus to the previous focusable element.
- If a button cannot be used for an action and it must be an anchor link, two things are required:
  - Add `role="button"` to the `<a>` to allow screenreaders to announce it as a `button`.
  - Attach an event handler to detect Spacebar keypress. Buttons react to both Enter and Spacebar, but Link reacts only to Enter.

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-btn` | N/A | Base button style. |
| `d-btn--unstyled` | .d-btn | Unsets all button styles. Renders as raw text. |
| `d-btn--primary` | .d-btn | Primary button style. |
| `d-btn--outlined` | .d-btn | Outline button style. |
| `d-btn--danger` | .d-btn | Base danger button style. |
| `d-btn--inverted` | .d-btn | Base inverted button style. |
| `d-btn--loading` | .d-btn | Loading button style. |
| `d-btn--circle` | .d-btn | Circle button style. |
| `d-btn--brand` | .d-btn | Branded button style. |
| `d-btn--xs` | .d-btn | Applies extra small size. |
| `d-btn--sm` | .d-btn | Applies small size. |
| `d-btn--lg` | .d-btn | Applies large size. |
| `d-btn--xl` | .d-btn | Applies extra large size. |
| `d-btn--disabled` | .d-btn | Applies disabled style. |
| `d-btn--active` | .d-btn | Applies active style. |
| `d-btn--muted` | .d-btn | Applies muted style. |
| `d-btn--vertical` | .d-btn | To be applied when the icon will be positioned using --top or --bottom. |
| `d-btn__icon` | Child of .d-btn | Base style for including an icon with a label. |
| `d-btn__label` | Child of .d-btn | Wraps the button text label. |
| `d-btn__icon--left` | .d-btn__icon | Positions the icon to the left of the text label. |
| `d-btn__icon--right` | .d-btn__icon | Positions the icon to the right of the text label. |
| `d-btn__icon--top` | .d-btn__icon | Positions the icon above the text label. |
