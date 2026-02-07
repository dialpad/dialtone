# Popover

A Popover displays a content overlay when its anchor element is activated.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-popover--default
- **Keywords**: popup, overlay, floating, d-popover, DtPopover, dt-popover, flyout, tooltip panel

## Usage

A Popover contains a dialog that will appear above other content when activated. It will always appear in a location relative to the anchor.
If you are looking for a dialog that does not display relative to the anchor, see [Modal](modal.md).
Some common examples of popover usage: dropdown list, emoji picker dialog, add comment dialog.
A popover can be modal or non-modal. Below are some guidelines on when to use a modal vs non-modal popover.

Your popover should be modal when:

- It contains scrollable content.
- It contains components that hold user input state (input, checkbox).

Your popover should be non-modal when:

- It is not scrollable.
- It contains only components that do not hold state (link, button).

The content slot will be rendered lazily when the popover is open. By default, the popover content will be opened when the anchor is clicked, and closed when clicking outside the content or on `ESC` key press. You may override this behaviour by using `.sync` on the open prop (or `v-model:open` in Vue 3) in which you can open or close the content using whichever condition you wish.

**Do:**

- Smaller sized dialogs that trigger on user activation of an anchor element.
- Dialogs that should be positioned relative to the anchor.
- Dialogs that contain interactive components.

**Don't:**

- Content that is displayed on hover. Instead, use a [Tooltip](tooltip.md).
- Dialogs that should be positioned in the center of the screen.
- Dialogs that are very large.
- Alerts.

### Best Practices

- Popovers should be fairly small. If you are looking for more of a full size dialog solution see [Modal](modal.md)
- Trigger using an anchor element, such as a button.
- Render the dialog at the body element.
- Focus the first interactive element within the dialog after it is opened.
- Close the dialog when ESC is pressed.
- Close non-modal dialogs if they are scrolled out of visibility.
- Set the z-index of the dialog to var(--zi-modal-element) if modal, var(--zi-popover) if not.

## Variants and Examples

### Popover - Modal

```vue
<dt-popover
  :open="onOpen"
>
  <template #anchor>
    <dt-button>
       View Popover
    </dt-button>
  </template>
  <template
    #content="{ close }"
  >
    <div>
      <p class="d-mb4">
        This is content rendered within the popover.
      </p>
      <dt-button
        @click="close"
      >
        Button
      </dt-button>
    </div>
  </template>
</dt-popover>
```

### Popover - Non Modal

```vue
<dt-popover
  :open="onOpen"
  :modal="false"
>
  <template #anchor>
    <dt-button>
      View Popover
    </dt-button>
  </template>
  <template
    #content="{ close }"
  >
    <div>
      <p class="d-mb4">
        This is content rendered within the popover.
      </p>
      <dt-button
        @click="close"
      >
        Button
      </dt-button>
    </div>
  </template>
</dt-popover>
```

### With Header - Modal

```vue
<dt-popover
  :open="onOpen"
>
  <template #anchor>
    <dt-button>
      View Popover
    </dt-button>
  </template>
  <template #headerContent>
    <div class="d-w100p">
      This is the header
    </div>
  </template>
  <template
    #content="{ close }"
  >
    <div>
      <div class="d-mb8">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<br>
      </div>
      <dt-button
        @click="close"
      >
        Button
      </dt-button>
    </div>
  </template>
</dt-popover>
```

### With Footer - Modal

```vue
<dt-popover
  :open="onOpen"
>
  <template #anchor>
    <dt-button>
      View Popover
    </dt-button>
  </template>
  <template
    #content="{ close }"
  >
    <div>
      <div class="d-mb8">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<br>
      </div>
      <dt-button
        @click="close"
      >
        Button
      </dt-button>
    </div>
  </template>
  <template #footerContent>
    <div class="d-w100p">
      This is the footer
    </div>
  </template>
</dt-popover>
```

### Fallback Placements

The popover uses [headless-tippy](https://atomiks.github.io/tippyjs/v6/headless-tippy/) and
[popper](https://popper.js.org/docs/v2/modifiers/flip/), if the popover opens in a placement where it will
be clipped, it will move to a new position. It will do this automatically by default, but if you want to
manually specify which position it will move to in what order you can do so via the `fallbackPlacements` prop.

```vue
<dt-popover
  :open="onOpen"
  :fallback-placements="[`top`]"
>
  <template #anchor>
    <dt-button>
       fallback placement: top
    </dt-button>
  </template>
  <template
    #content="{ close }"
  >
    <div>
      <p class="d-mb4">
        This is content rendered within the popover.
      </p>
      <dt-button
        @click="close"
      >
        Button
      </dt-button>
    </div>
  </template>
</dt-popover>
```

### Padding

Padding options for the popover content are provided via size classes "small", "medium" or "large" in order to standardize the look of the popover content between usages. To remove the padding from the content, you can pass "none". Setting none will also allow you to set custom padding via utility classes (Ex: you only want padding on the left.).

```vue
<dt-popover
  :open="onOpen"
  padding="small"
>
  <template #anchor>
    <dt-button>
       View Popover
    </dt-button>
  </template>
  <template
    #content="{ close }"
  >
    <div>
      <p class="d-mb4">
        This is content rendered within the popover.
      </p>
      <dt-button
        @click="close"
      >
        Button
      </dt-button>
    </div>
  </template>
</dt-popover>
```

### Force Close All Opened Instances

When the popover is open, it will attach an event listener into the window object, so you can close the instances dispatching the `dt-popover-close` event in the window object:

```js
const e = new Event('dt-popover-close');
window.dispatchEvent(e);
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `open` | Controls whether the popover is shown. Leaving this null will have the popover trigger on click by default. If you set this value, the default trigger behavior will be disabled, and you can control it as you need. Supports v-model | `boolean` | `null` |
| `openOnContext` | Opens the popover on right click (context menu). If you set this value to `true`, the default trigger behavior will be disabled. | `boolean` | `false` |
| `elementType` | Element type (tag name) of the root element of the component. | `string` | `'div'` |
| `transition` | Named transition when the content display is toggled. | `string` | `'fade'` |
| `role` | ARIA role for the content of the popover. Defaults to "dialog". <a class="d-link" href="https://www.w3.org/TR/wai-aria/#aria-haspopup" target="_blank">aria-haspopup</a> | `string` | `'dialog'` |
| `ariaLabelledby` | ID of the element that serves as the label for the popover content. Defaults to the "anchor" element; this exists to provide a different ID of the label element if, for example, the anchor slot contains other items that do not serve as a label. You should provide this or ariaLabel, but not both. | `string` | `null` |
| `ariaLabel` | Descriptive label for the popover content. You should provide this or ariaLabelledby, but not both. | `string` | `null` |
| `padding` | Padding size class for the popover content. | `string` | `'large'` |
| `contentClass` | Additional class name for the content wrapper element. | `string\|array\|object` | `''` |
| `contentWidth` | Width configuration for the popover content. When its value is 'anchor', the popover content will have the same width as the anchor. | `string` | `''` |
| `contentAppear` | Whether to apply transition on initial render in the content lazy show component. | `boolean` | `null` |
| `contentTabindex` | Tabindex value for the content. Passing null, no tabindex attribute will be set. | `Number \|\| null` | `-1` |
| `externalAnchor` | External anchor id to use in those cases the anchor can't be provided via the slot. For instance, using the combobox's input as the anchor for the popover. | `string` | `''` |
| `id` | The id of the tooltip | `string` | `(function)` |
| `offset` | Displaces the content box from its anchor element by the specified number of pixels. <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#offset" target="_blank" > Tippy.js docs </a> | `array` | `[0, 4]` |
| `hideOnClick` | Determines if the popover hides upon clicking the anchor or outside the content box. | `boolean` | `true` |
| `modal` | Determines modal state. If enabled popover has a modal overlay preventing interaction with elements below it, but it is invisible. | `boolean` | `true` |
| `fallbackPlacements` | If the popover does not fit in the direction described by "placement", it will attempt to change its direction to the "fallbackPlacements". <a class="d-link" href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements" target="_blank" > Popper.js docs </a> | `array` | `['auto']` |
| `placement` | The direction the popover displays relative to the anchor. <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#placement" target="_blank" > Tippy.js docs </a> | `string` | `'bottom-end'` |
| `tether` | If set to false the dialog will display over top of the anchor when there is insufficient space. If set to true it will never move from its position relative to the anchor and will clip instead. <a class="d-link" href="https://popper.js.org/docs/v2/modifiers/prevent-overflow/#tether" target="_blank" > Popper.js docs </a> | `boolean` | `true` |
| `sticky` | If the popover sticks to the anchor. This is usually not needed, but can be needed if the reference element's position is animating, or to automatically update the popover position in those cases the DOM layout changes the reference element's position. `true` enables it, `reference` only checks the "reference" rect for changes and `popper` only checks the "popper" rect for changes. <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#sticky" target="_blank" > Tippy.js docs </a> | `boolean\|string` | `false` |
| `maxHeight` | Determines maximum height for the popover before overflow. Possible units rem\|px\|em | `string` | `''` |
| `maxWidth` | Determines maximum width for the popover before overflow. Possible units rem\|px\|%\|em | `string` | `''` |
| `showCloseButton` | Determines visibility for close button | `boolean` | `false` |
| `headerClass` | Additional class name for the header content wrapper element. | `string\|array\|object` | `''` |
| `footerClass` | Additional class name for the footer content wrapper element. | `string\|array\|object` | `''` |
| `dialogClass` | Additional class name for the dialog element. | `string\|array\|object` | `''` |
| `initialFocusElement` | The element that is focused when the popover is opened. This can be an HTMLElement within the popover, a string starting with '#' which will find the element by ID. 'first' which will automatically focus the first element, or 'dialog' which will focus the dialog window itself. If the dialog is modal this prop cannot be 'none'. | `string\|HTMLElement` | `'first'` |
| `openWithArrowKeys` | If the popover should open pressing up or down arrow key on the anchor element. This can be set when not passing open prop. | `boolean` | `false` |
| `appendTo` | Sets the element to which the popover is going to append to. 'body' will append to the nearest body (supports shadow DOM). 'root' will try append to the iFrame's parent body if it is contained in an iFrame and has permissions to access it, else, it'd default to 'parent'. | `HTMLElement\|string` | `'body'` |

### Slots

| Name | Description |
| --- | --- |
| `anchor` | Anchor element that activates the popover. Usually a button. |
| `headerContent` | Slot for popover header content |
| `content` | Slot for the content that is displayed in the popover when it is open. |
| `footerContent` | Slot for the footer content. |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `keydown` | Native keydown event | `KeyboardEvent` |
| `update:open` | Event fired to sync the open prop with the parent component | `undefined` |
| `opened` | Emitted when popover is shown or hidden | `Boolean \| Array` |
| `mouseenter-popover` | Emitted when the mouse enters the popover | `` |
| `mouseleave-popover` | Emitted when the mouse leaves the popover | `` |
| `mouseenter-popover-anchor` | Emitted when the mouse enters the popover anchor | `` |
| `mouseleave-popover-anchor` | Emitted when the mouse leaves the popover anchor | `` |

## Classes

Popover must contain an anchor and content element. d-modal--transparent can be used as a sibling before the popover container if you wish to make the popover modal.

| Class | Applies to | Description |
| --- | --- | --- |
| `d-popover` | N/A | Parent popover container. |
| `d-popover__dialog` | Child of .d-popover | Base dialog container for popover content. Should be rendered at the body. |
| `d-popover__content` | Child of .d-popover__dialog | Contains the main content of the dialog |
| `d-popover__header` | Child of .d-popover__dialog | Contains the header content. |
| `d-popover__footer` | Child of .d-popover__dialog | Contains the footer content. |

## Accessibility

If your popover is modal, please see the accessibility section of this page regarding "focus trapping": [Modal Accessibility](./modal.md#accessibility). The same rules will apply here if your popover is modal.

Popovers, in their current implementation, are accessible when used as interactive components. Content will be read to screen reader users, and the popover markup by is appended to the `<body>`.

There are a few important considerations to ensure popover controls are accessible:

- The popover content will have a generic role of "dialog" ( "menu" and "listbox" are also possible roles as well).
- On open, focus will be transferred to the first focusable element within the popover, after close the triggering element will be focused.
- A screen reader visible only close button is added by default when setting the `showCloseButton` prop to `false`.

| Item | Applies to | Description |
| --- | --- | --- |
| `aria-expanded=[true\|false]` | anchor element | aria-expanded must be set to true when the dialog is opened and false when it is not. |
| `aria-controls=[id]` | anchor element | aria-controls must contain the id of the dialog that is opened when it is clicked. |
| `aria-haspopup=[role]` | anchor element | must contain the role of popup that it displays. |
| `aria-modal=[true\|false]` | .d-popover__dialog | true if the dialog is modal, false if not. |
| `aria-hidden=[true\|false]` | .d-popover__dialog | true if the dialog is currently open, false if not. |
| `aria-labelledby=[id]` | .d-popover__dialog | the element labelling the dialog. Should point to the anchor element. |

### Anchor

The anchor element that activates the popover should be fully accessible by keyboard. The easiest way to do this is by using an element like an `DtButton` that is already accessible. The user should also be able to close the popover content using the `ESC` key for most ARIA roles.

There are some required ARIA attributes for the anchor element (such as `aria-expanded` set based on `open` and `aria-haspopup` that matches the `role`). To make this as straightforward as possible, these ARIA attributes are passed with the correct values as the `attrs` slot-scope to the anchor slot. Applying them is as simple as using `v-bind`:

```vue
<template #anchor="{ attrs }">
  <dt-button v-bind="attrs">I'm accessible now!</dt-button>
</template>
```

By default, the dialog content will be labeled by the entire anchor element. To change this, you can do one of 2 things:

- Pass `aria-label`, which is the text label that will be applied to the dialog content.
- Pass `aria-labelledby`, which is an ID of the element that should be used as the descriptive label.

### Keyboard Support

The below keyboard functionality is automatically implemented when using the popover component:

- The user can dismiss the popover pressing the `ESC` key, after that the focus will be returned to the element that launched it.
- The user can traverse focusable elements using the `TAB` key. If the popover has a defined header, the focus will be moved to the header buttons after the last focusable element inside content's container.

Additionally you must use the "initialFocusElement" prop to set which element is initially focused when the popover opens. You can set this to "first" to focus the first focusable element, "dialog" to focus the dialog itself, a string starting with '#' to focus an element by id within the dialog or you may pass in an HTMLElement directly. If set to "none" the focus will remain on the anchor, however this is invalid behavior if the popover is modal.

## References

- [tippyjs](https://atomiks.github.io/tippyjs/)
- [popper.js](https://popper.js.org/)
- [Apple. Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/views/popovers/)
- [Spectrum. Accessibility overlay trigger](https://react-spectrum.adobe.com/react-aria/useOverlayTrigger.html)
- [Slack Design. Accessibility, a powerful design tool](https://slack.design/articles/accessibility-a-powerful-design-tool/)
