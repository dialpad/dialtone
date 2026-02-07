# Toast

A toast notice, sometimes called a snackbar, is a time-based message that appears based on users' actions. It contains at-a-glance information about outcomes and can be paired with actions.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-toast--default
- **Keywords**: notification, snackbar, alert, message, d-toast, DtToast, dt-toast, flash message

## Variants and Examples

  class="d-zi-notification"
  :show="showToast"
  title="Title"
  :important="important"
  :kind="selectedKind"
  @close="toggleToast"
/>

```vue
<dt-toast
  title="Title"
  :show="showToast"
  :important="important"
  :kind="selectedKind"
  @close="closeEvent"
>
  Message body with
  <dt-link>
    a link
  </dt-link>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
    >
      Action
    </dt-button>
  </template>
</dt-toast>
```

### With Duration

It's recommended to use a time of at least 6000 ms (minimum duration validated in the component) to give users enough time to read the toast. Take into account that the time necessary to read and comprehend the message could vary in users. For instance, users using assistive technology, or users with language barriers could potentially need more time to read and understand the message.
If the duration is not provided the toast won't disappear automatically.

```vue
<dt-toast
  title="Title"
  :show="showDurationToast"
  @close="closeEvent"
  :duration="7500"
>
  Message body with
  <dt-link>
    a link
  </dt-link>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
    >
      Action
    </dt-button>
  </template>
</dt-toast>
```

### With Self-Positioning

If you need to self-position the toast at the top center, use the `d-toast-wrapper` Dialtone class:

```html
<aside class="d-toast-wrapper">
  <dt-toast
    :title="title"
    :message="message"
    :show="isShown"
  ></dt-toast>
</aside>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `titleId` | Sets an ID on the title element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the title. | `string` | `''` |
| `contentId` | Sets an ID on the content element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the content. | `string` | `''` |
| `title` | Title header of the toast. This can be left blank to remove the title from the toast entirely. | `string` | `''` |
| `message` | Message of the toast. Overridden by default slot. | `string` | `''` |
| `role` | Provides a role for the toast. 'status' is used by default to communicate a message. 'alert' is used to communicate an important message like an error that does not contain any interactive elements. | `string` | `'status'` |
| `kind` | Severity level of the toast, could be different depending on which toast layout is used. | `string` | `''` |
| `important` | Used in scenarios where the message needs to visually dominate the screen. | `boolean` | `false` |
| `show` | Controls whether the toast is shown. If a valid duration is provided, the toast will disappear after reaching the duration time, so it's convenient to use `v-model` with this prop to update the data in your component. Supports v-model | `boolean` | `false` |
| `hideClose` | Hides the close button from the toast | `boolean` | `''` |
| `hideIcon` | Hides the icon from the notice | `boolean` | `''` |
| `hideAction` | Hides the action from the notice | `boolean` | `''` |
| `duration` | The duration in ms the toast will display before disappearing. The toast won't disappear if the duration is not provided. If it's provided, it should be equal to or greater than 6000. | `number` | `null` |
| `layout` | The layout / styling you wish to use for the toast. | `string` | `'default'` |

### Slots

| Name | Description |
| --- | --- |
| `icon` |  |
| `titleOverride` | Allows you to override the title, only use this if you need to override |
| `default` | the main textual content of the toast |
| `action` |  |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `close` | Close button click event | `` |
| `update:show` | Sync show value | `undefined` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-toast` | N/A | Default toast style |
| `d-toast__dialog` | N/A | Contains the toast content. |
| `d-toast--error` | .d-toast | Applies error visual style. |
| `d-toast--info` | .d-toast | Applies info visual style. |
| `d-toast--success` | .d-toast | Applies success visual style. |
| `d-toast--warning` | .d-toast | Applies warning visual style. |
| `d-toast--important` | .d-toast | Adds the higher importance style by emboldening the background color. These should only be used for pressing information that needs to be noticed by the user. |

## Accessibility

Avoid using toast for critical information since toast disappears automatically and make sure
to provide enough time to read the message and act consequently. For best accessible user experience, the amount of
time a toast displays for should be user configurable.

Using `role="alert"`, it sets `aria-live="assertive"` which
means it will immediately interrupt anything currently being read by the screen reader, so use it for things
that require immediate attention such as:

- An invalid value was entered into a form field
- The user's login session is about to expire
- The connection to the server was lost, local changes will not be saved

Meanwhile `role="status"` implies `aria-live="polite"` which
means the toast will be read out after what's currently being has finished.

A screen reader visible only close button is added by default.

| Item | Applies to | Description |
| --- | --- | --- |
| `role="alert"` | .d-toast | Provides the user with important, and usually time-sensitive information, often telling the user an element has been updated (Source) |
| `role="status"` | .d-toast | When using multiple toasts simultaneously, use the role="status" which does not clear the screen reader's speech queue. (Source) |
| `aria-hidden="[true\|false]"` | .d-toast | Informs assistive technologies, such as screen readers, if they should ignore the element. This should not be confused with the HTML hidden attribute which tells the browser to not display an element. (Source) |
