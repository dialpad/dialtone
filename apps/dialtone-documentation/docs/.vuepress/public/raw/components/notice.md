# Notice

A notice is an informational and assistive message that appears inline with content.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-notice--default
- **Keywords**: alert, message, notification, d-notice, DtNotice, dt-notice, callout, inline alert

## Usage

A notice delivers informational and assistive messages that inform the user about product or account statuses and related actions. It can suggest an action or dismissed by the user, though neither are required. For time-based notifications, see [Toast](toast.md).

## Variants and Examples

### Base Styles

Used in most scenarios when the message should be noticeable but not dominate.

```vue
<dt-notice
  title="Base title (optional)"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Info title (optional)"
  kind="info"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Error title (optional)"
  kind="error"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Success title (optional)"
  kind="success"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Warning title (optional)"
  kind="warning"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
```

### Important

Used occasionally in scenarios when the message needs to dominate.

```vue
<dt-notice
  title="Base title (optional)"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Info title (optional)"
  kind="info"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Error title (optional)"
  kind="error"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Success title (optional)"
  kind="success"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Warning title (optional)"
  kind="warning"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
```

### Truncate Text

Truncates the text instead of wrapping it. Useful when the Notice needs to have a fixed height.

```vue
<dt-notice
  :truncate-text="true"
  title="Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
>
  <span>
    Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur.
  </span>
</dt-notice>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `titleId` | Sets an ID on the title element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the title. | `string` | `''` |
| `contentId` | Sets an ID on the content element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the content. | `string` | `''` |
| `title` | Title header of the notice. This can be left blank to remove the title from the notice entirely. | `string` | `''` |
| `role` | Provides a role for the notice. 'status' is used to communicate a message. 'alert' is used to communicate an important message that does not contain any interactive elements. 'alertdialog' is used to communicate an important message that does contain interactive elements. | `string` | `'status'` |
| `important` | Used in scenarios where the message needs to visually dominate the screen. This will also change the aria role from status to alert. | `boolean` | `false` |
| `kind` | Severity level of the notice, sets the icon and background | `string` | `'base'` |
| `hideClose` | Hides the close button from the notice | `boolean` | `false` |
| `hideIcon` | Hides the icon from the notice | `boolean` | `false` |
| `hideAction` | Hides the action from the notice | `boolean` | `false` |
| `truncateText` | Truncates the content instead of wrapping. Used when the notice needs to have a fixed height. | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `icon` | Slot for custom icon |
| `titleOverride` | Allows you to override the title, only use this if you need |
| `default` | the main textual content of the notice |
| `action` | Enter a possible action for the user to take, such as a link to another page |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `close` | Close button click event | `` |
| `click` | Native button click event | `PointerEvent \| KeyboardEvent` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-notice` | N/A | Base parent notice class. This defaults to the system notice style. |
| `d-notice--error` | .d-notice | Applies error visual style. |
| `d-notice--info` | .d-notice | Applies info visual style. |
| `d-notice--success` | .d-notice | Applies success visual style. |
| `d-notice--warning` | .d-notice | Applies warning visual style. |
| `d-notice--important` | .d-notice | Adds the higher importance style by emboldening the background color. These should only be used for pressing information that needs to be noticed by the user. |
| `d-notice__icon` | N/A | Contains the notice icon. |
| `d-notice__content` | N/A | Contains the notice content. |
| `d-notice__title` | N/A | Contains the notice title. |
| `d-notice__message` | N/A | Contains the notice message. |
| `d-notice__actions` | N/A | Contains the notice actions. |

## Accessibility

| Item | Applies to | Description |
| --- | --- | --- |
| `role="status"` | .d-notice | Defines a live region with advisory information for the user, but not important enough to warrant an alert (Source) |
| `role="alert"` | .d-notice--important | A form of live region which contains important, usually time-sensitive, information. Elements with an alert role have an implicit aria-live value of assertive and implicit aria-atomic value of true. (Source) |
| `aria-hidden="[true \| false]"` | .d-notice | Informs assistive technologies, such as screen readers, if they should ignore the element. This should not be confused with the HTML hidden attribute which tells the browser to not display an element. (Source) |
| `aria-labelledby="[id]"` | .d-notice | Only used if a title is present, it provides assistive technologies with a title for the dialog. (Source) |
| `aria-label="[title]"` | .d-notice | If aria-labelledby is not used (because no title is present) and role="alert" is in use, this must be used to provides assistive technologies with a title for the dialog. (Source) |
| `aria-describedby="[id]"` | .d-notice | Provides assistive technologies with the alert's descriptive copy (Source) |
