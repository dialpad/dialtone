# Banner

A banner is a type of Notice, delivering system and engagement messaging. It is highly intrusive and should be used sparingly and appropriately.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-banner--default
- **Keywords**: alert,notification,message,d-banner,DtBanner,dt-banner

## Usage

System banners are used for **system** messaging. They are full-width notices placed in one of two locations:

1. **Above everything else:** If the banner is related to the entire app (e.g. the user lost internet service), place the banner first. <em>These should not be dismissable until the issue is resolved.</em> To pin the banner to the top of the app, add the `.d-notice--pinned` class.
2. **Below the top bar:** This is the default location for system banners. Use these when it affects only a particular area of the product (e.g. when the user is in Do Not Disturb mode).

Banners are a type of notice and so you can use the following [Notice](notice.md) styles in conjunction with `.d-banner`.

## Variants and Examples

### Kind

  :pinned="pinned"
  :important="important"
  :kind="selectedKind"
  title="Optional banner title"
  v-show="shownBanner === 'example-kind'"
  @close="closeBanner"
>
  Message body

```vue
<dt-banner kind="base" title="Optional banner title"> Message body </dt-banner>
<dt-banner kind="error" title="Optional banner title"> Message body </dt-banner>
<dt-banner kind="info" title="Optional banner title"> Message body </dt-banner>
<dt-banner kind="success" title="Optional banner title"> Message body </dt-banner>
<dt-banner kind="warning" title="Optional banner title"> Message body </dt-banner>
<dt-banner background-image="{$background-image}" background-size="contain"> Message body </dt-banner>
<dt-banner pinned="true" kind="warning" title="Optional banner title"> Message body </dt-banner>
<dt-banner important="true" kind="warning" title="Optional banner title"> Message body </dt-banner>
```

### Pinned

Pins the banner to the top of the window.

  :pinned="true"
  title="Optional banner title"
  v-show="shownBanner === 'example-pinned'"
  @close="closeBanner"
>
  Detailed description goes here.

```vue
<dt-banner
  :pinned="true"
  title="Optional banner title"
>
  Detailed description goes here.
  <template #action>
    <dt-button size="sm" kind="muted" importance="outlined">Action</dt-button>
  </template>
</dt-banner>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `titleId` | Sets an ID on the title element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the title. | `string` | `(function)` |
| `contentId` | Sets an ID on the content element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the content. | `string` | `(function)` |
| `title` | Title header of the notice. This can be left blank to remove the title from the notice entirely. | `string` | `''` |
| `important` | Used in scenarios where the message needs to visually dominate the screen. This will also change the aria role from status to alertdialog. and will modally trap the keyboard focus in the dialog as soon as it displays. | `boolean` | `false` |
| `pinned` | Pins the banner to the top of the window and pushes all app content down. | `boolean` | `false` |
| `kind` | Severity level of the notice, sets the icon and background | `string` | `'base'` |
| `hideClose` | Hides the close button from the notice | `boolean` | `false` |
| `hideIcon` | Hides the icon from the notice | `boolean` | `false` |
| `hideAction` | Hides the action from the notice | `boolean` | `false` |
| `dialogClass` | Inner dialog class | `string` | `''` |
| `backgroundImage` | Banner background image | `string` | `''` |
| `backgroundSize` | Background image size, follows the background-size CSS property values <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-size" target="_blank"> CSS background-sizes </a> | `string` | `'cover'` |

### Slots

| Name | Description |
| --- | --- |
| `icon` | Slot for custom icon |
| `titleOverride` | Allows you to override the title, only use this if you need to override with something other than text. Otherwise use the "title" prop. |
| `default` | the main textual content of the banner |
| `action` | Enter a possible action for the user to take, such as a link to another page |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `close` | Close button click event | `` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-banner` | N/A | Base parent banner class. This defaults to the system banner style. |
| `d-banner__dialog` | N/A | Contains the banner content. |
| `d-banner--error` | .d-banner | Applies error visual style. |
| `d-banner--info` | .d-banner | Applies info visual style. |
| `d-banner--success` | .d-banner | Applies success visual style. |
| `d-banner--warning` | .d-banner | Applies warning visual style. |
| `d-banner--important` | .d-banner | Adds the higher importance style by emboldening the background color. These should only be used for pressing information that needs to be noticed by the user. |
| `d-banner--pinned` | .d-banner | Pins the banner to the top of the window and pushes all app content down. |

## Accessibility

| Item | Applies to | Description |
| --- | --- | --- |
| `role="alert"` | .d-banner | Provides the user with important, and usually time-sensitive information, often telling the user an element has been updated. (Source) |
| `aria-hidden="[true\|false]"` | .d-banner | Informs assistive technologies, such as screen readers, if they should ignore the element. This should not be confused with the HTML hidden attribute which tells the browser to not display an element. (Source) |
| `role="alertdialog"` | .d-banner__dialog | Dialog which contains the alert message and where the initial focus goes to in an element within a dialog. (Source) |
| `aria-labelledby="[id]"` | .d-banner__dialog | Only used if a title is present, it provides assistive technologies with a title for the dialog. (Source) |
| `aria-label="[title]"` | .d-banner__dialog | If aria-labelledby is not used (because no title is present), this must be used to provides assistive technologies with a title for the dialog. (Source) |
| `aria-describedby="[id]"` | .d-banner__dialog | Provides assistive technologies with the alert's descriptive copy. (Source) |
