# Modal

A modal focuses the user’s attention on a single task or message.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-modal--default
- **Keywords**: dialog, popup, overlay, lightbox, d-modal, DtModal, dt-modal, alert dialog, sheet

## Usage

Modals disable underlying content and are used to present a short-term task the user needs to perform without losing the context of the underlying page. Users won't be able to interact with the page until they close the modal.

Although highly versatile, this doesn't mean modal dialogs are fit for all purposes. Modals are purposefully disruptive and should be used thoughtfully and sparingly, specifically in moments where focus is required or an action must be taken.

**Do:**

- To complete a simple task or decision that requires their full attention outside the main workflow.
- Confirming a destructive action that is about to happen.
- Ask for a user’s consent for an action.

**Don't:**

- When its content or features can be part of the page without complicating the page’s intent.
- When the content or message requires interaction with other parts of the application or screen.
- Form-related error, success, or warning messages. Keep feedback in context to forms.
- Confirming an action took place (instead: use a [Toast](toast.md)).
- Revealing more information (instead: place content inline)
- Displaying complex forms or large amounts of information (instead: place content inline)
- Displaying content unrelated to current task (instead: place content inline as a [Link](link.md) or [Banner](banner.md)).

### Best Practices

- Ideally, users trigger the modal, not the system, and should not be a surprise. Its appearance should reflect user intent to invoke it.  Uninvited modals may surprise the user and result in a quick dismissal of the window.
- Treat modals as a last resort. Consider whether there’s another component or UI that might be  less disruptive for the user.
- Limit the number of interactions in a modal. Remove anything that does not support the task.
- Avoid multiple steps that require navigation within the modal dialog.
- Avoid complex decision-making that requires additional sources of information unavailable in the modal.
- Use clear header and action labels. Label links and buttons with a verb that avoids ambiguity and clearly indicates what happens when it’s selected. The primary action’s label should complement the modal title.
- Avoid lengthy contents that require scrolling.
- Only one modal can be present at a time.

## Accessibility

- Opened modals “trap focus,” meaning keyboard navigation controls are constrained to elements within the modal. Tabbing to the modal's last focusable element, and then pressing tab again would loop the focus back to the first element on the page. Focus doesn't return to the underlying page until the user explicitly dismisses the modal, in which case it would return to the place it was before the dialog opened.
- To ensure maximum compatibility, all `a` tags must have an `href`attribute. Also, any elements which you don't want to be focusable (but might be focusable by default) must have their `tabindex` set to `-1`.
- Focus should always begin on the first actionable element within the dialog. This could be an OK button, or the first field in the form. An X button in the top right corner should be last in the tab order even though it may be visually above the other elements.
- Check out the "Focus management" section of the following [MDN Dialog document](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role#focus_management) if you'd like to know more.
- Use `aria-labelledby` on its root element to associate a title to the modal to announce its to accessible technology. The value of aria-labelledby is to the `id` value of its heading element (e.g. `h2`).
- Dismissing Modal returns focus to the originating element that spawned the modal’s display.

| Item | Applies to | Description |
| --- | --- | --- |
| `aria-describedby=[id]` | .d-modal | Provide the modal's copy ID here. Assistive technologies, such as screen readers, use this to associate text with a widget, elements groups, headings, definitions, etc. (Source) |
| `aria-hidden=[true\|false]` | .d-modal | Informs assistive technologies, such as screen readers, if they should ignore the element. This should not be confused with the HTML hidden attribute which tells the browser to not display an element. (Source) |
| `aria-label=[text]` | .d-modal__close | Labels the close element for assistive technologies. (Source) |
| `aria-labelledby=[id]` | .d-modal | Supply the modal's title ID here. Assistive technologies, such as screen readers, use this attribute to catalog the document objects correctly. (Source) |
| `role="dialog"` | .d-modal | Identifies the modal as a dialog element for assistive technologies (Source) |
| `role="document"` | .d-modal__dialog | Helps assistive technologies to switch their reading mode from the larger document to a focused dialog window (Source) |

## Variants and Examples

### Base Style

```vue
<dt-modal
  title="Example title"
  :show="isOpen"
  @update:show="updateShow"
  copy="Lorem ipsum ..."
>
  <template
    #footer
  >
    <dt-button
      id="cancel-button"
      :kind="secondaryButtonKind"
      importance="clear"
    >
      Cancel
    </dt-button>
    <dt-button
      id="confirm-button"
      importance="primary"
      class="d-ml6"
    >
      Confirm
    </dt-button>
  </template>
</dt-modal>
<dt-button
  @click="isOpen = !isOpen"
>
  Click to open
</dt-button>
```

### Fixed Header and Footer

This is the default behavior that adds the scroll automatically in the modal content and leaves the header and footer fixed.

```vue
<dt-modal
  title="Example title"
  :show="isOpen"
  @update:show="updateShow"
  :showFooter="true"
  :fixed-header-footer="true"
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
>
  <template
    #footer
  >
    <dt-button
      id="cancel-button"
      :kind="secondaryButtonKind"
      importance="clear"
    >
      Cancel
    </dt-button>
    <dt-button
      id="confirm-button"
      importance="primary"
      class="d-ml6"
    >
      Confirm
    </dt-button>
  </template>
</dt-modal>
<dt-button
  @click="isOpen = !isOpen"
>
  Click to open
</dt-button>
```

### Danger

A modal style for destructive or irreversible actions.

```vue
<dt-modal
  title="Example title"
  :show="isOpen"
  kind="danger"
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
  @update:show="updateShow"
>
  <template
    #footer
  >
    <dt-button
      id="cancel-button"
      :kind="secondaryButtonKind"
      importance="clear"
    >
      Cancel
    </dt-button>
    <dt-button
      id="confirm-button"
      kind="danger"
      importance="primary"
      class="d-ml6"
    >
      Confirm
    </dt-button>
  </template>
</dt-modal>
<dt-button
  @click="isOpen = !isOpen"
>
  Click to open
</dt-button>
```

### Full Screen

To make this modal take up as much of the screen as possible.

```vue
<dt-modal
  title="Example title"
  :show="isOpen"
  size="full"
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
  @update:show="updateShow"
>
  <template
    #footer
  >
    <dt-button
      id="cancel-button"
      :kind="secondaryButtonKind"
      importance="clear"
    >
      Cancel
    </dt-button>
    <dt-button
      id="confirm-button"
      importance="primary"
      class="d-ml6"
    >
      Confirm
    </dt-button>
  </template>
</dt-modal>
<dt-button
  @click="isOpen = !isOpen"
>
  Click to open
</dt-button>
```

### Has Banner

When there is a need of more context information regarding the content of the Modal

```vue
<dt-modal
  title="Example title"
  :show="isOpen"
  banner-title="This banner can have different kinds."
  :bannerKind="selectedBannerKind"
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
  @update:show="updateShow"
>
  <template
    #footer
  >
    <dt-button
      id="cancel-button"
      :kind="secondaryButtonKind"
      importance="clear"
    >
      Cancel
    </dt-button>
    <dt-button
      id="confirm-button"
      importance="primary"
      class="d-ml6"
    >
      Confirm
    </dt-button>
  </template>
</dt-modal>
<dt-button
  @click="isOpen = !isOpen"
>
  Click to open
</dt-button>
```

### Custom Header and Content

You're not limited to using plain title and copy text.

In addition to the footer, custom elements can be inserted into the header and body sections of the dialog via slots.

**Please note:** supplied header or body slots will take the place of any provided "title" or "copy" text, respectively.

```vue
<dt-modal
  :show="isOpen"
  @update:show="updateShow"
>
  <template #header>
    <dt-stack direction="row" align="center" justify="center" class="d-p12 d-bgc-purple-100">
      <div>Custom header</div>
    </dt-stack>
  </template>
  <dt-stack direction="row" align="center" justify="center" class="d-p32 d-bgc-gold-200">
    <h2>Custom content</h2>
  </dt-stack>
</dt-modal>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `copy` | Body text to display as the modal's main content. | `string` | `''` |
| `describedById` | Id to use for the dialog's aria-describedby. Recommended only if the dialog content itself isn't enough to give full context, as screen readers should recite the dialog contents by default before any aria-description. | `string` | `''` |
| `labelledById` | Id to use for the dialog's aria-labelledby. | `string` | `(function)` |
| `show` | Whether the modal should be shown. Parent component can sync on this value to control the modal's visibility. | `boolean` | `false` |
| `title` | Title text to display in the modal header. | `string` | `''` |
| `bannerTitle` | Title text to display in the modal banner. | `string` | `''` |
| `kind` | The theme of the modal. kind - default or danger, | `string` | `'default'` |
| `size` | The size of the modal. size - default or full, | `string` | `'default'` |
| `modalClass` | Additional class name for the root modal element. Can accept String, Object, and Array, i.e. has the same API as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `dialogClass` | Additional class name for the dialog element within the modal. Can accept String, Object, and Array, i.e. has the same API as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `contentClass` | Additional class name for the content element within the modal. Can accept String, Object, and Array, i.e. has the same API as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `bannerKind` | Sets the color of the banner. | `string` | `'warning'` |
| `bannerClass` | Additional class name for the banner element within the modal. Can accept String, Object, and Array, i.e. has the same API as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `hideClose` | Hides the close button on the modal | `boolean` | `false` |
| `closeOnClick` | Whether the modal will close when you click outside of the dialog on the overlay. | `boolean` | `true` |
| `fixedHeaderFooter` | Scrollable modal that allows scroll the modal content keeping the header and footer fixed | `boolean` | `true` |
| `initialFocusElement` | The element that is focused when the modal is opened. This can be an HTMLElement within the modal, a string starting with '#' which will find the element by ID. 'first' which will automatically focus the first element, or 'dialog' which will focus the dialog window itself. If the dialog is modal this prop cannot be 'none'. | `string\|HTMLElement` | `'first'` |
| `appendTo` | A CSS selector string for the element to portal the modal to. If not provided, the modal will be rendered in its default location. | `string` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `banner` | Slot for the banner, defaults to bannerTitle prop |
| `header` | Slot for dialog header section, taking the place of any "title" text prop |
| `default` | Default slot for dialog body section, taking the place of any "copy" text prop |
| `footer` | Slot for dialog footer content, often containing cancel and confirm buttons. |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `click` | Native button click event | `PointerEvent \| KeyboardEvent` |
| `keydown` | Native keydown event | `KeyboardEvent` |
| `update:show` | The modal will emit a "false" boolean value for this event when the user performs a modal-closing action. Parent components can sync on this value to create a 2-way binding to control modal visibility. | `Boolean` |

## Classes

At minimum, modals contain a title and one button. They could also contain body text, brand illustrations, product wireframes, or multiple buttons.

| Class | Applies to | Description |
| --- | --- | --- |
| `d-modal` | N/A | Parent modal container. |
| `d-modal__dialog` | Child of .d-modal | Base dialog container for modal content. |
| `d-modal__banner` | Child of .d-modal__dialog | Optional banner docked above d-modal__dialog. |
| `d-modal_banner--warning` | d-modal__banner | Styles d-modal__banner for Warning messaging. |
| `d-modal_banner--info` | d-modal__banner | Styles d-modal__banner for Info messaging. |
| `d-modal_banner--critical` | d-modal__banner | Styles d-modal__banner for Critical messaging. |
| `d-modal_banner--success` | d-modal__banner | Styles d-modal__banner for Success messaging. |
| `d-modal_banner--general` | d-modal__banner | Styles d-modal__banner for General messaging. |
| `d-modal__header` | Child of .d-modal__dialog | Adds proper styling for the modal's header. |
| `d-modal__content` | Child of .d-modal__dialog | Adds proper styling for the modal's content area. |
| `d-modal__footer` | Child of .d-modal__dialog | Adds proper styling for the modal's footer. |
| `d-modal__close` | Child of .d-modal__dialog | Adds proper styling for the modal's dismiss button. |
| `d-modal__dialog--scrollable` | .d-modal__dialog | Adds vertical scroll to the modal content keeping fixed the header and footer. |
| `d-modal--full` | .d-modal | Makes .d-modal__dialog take up as much of the screen as possible. |
| `d-modal--danger` | .d-modal | Adds styling for destructive actions. |
| `d-modal--animate-in` | .d-modal | Adds transition styles for modal appearance. |
| `d-modal--animate-out` | .d-modal | Adds transition styles for modal exit. |
| `d-modal__dialog--animate-in` | .d-modal__dialog | Adds transition styles for modal dialog appearance. |
| `d-modal__dialog--animate-out` | .d-modal__dialog | Adds transition styles for modal dialog exit. |
