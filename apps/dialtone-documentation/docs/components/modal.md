---
title: Modal
description: A modal focuses the user's attention on a single task or message.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-modal--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=4454-10944
keywords: ["dialog", "popup", "overlay", "lightbox", "d-modal", "DtModal", "dt-modal", "alert dialog", "sheet"]
---
```vue demo-only
<example-modal />
```

<!-- <component-combinator component-name="DtModal" /> -->

## Usage

Modals disable underlying content and are used to present a short-term task the user needs to perform without losing the context of the underlying page. Users won't be able to interact with the page until they close the modal. By design, clicking outside the DtModal dialog does not close it — this is intentional behavior to prevent accidental dismissal of important tasks. Users must explicitly click the close button or trigger a close action to dismiss the modal.

Although highly versatile, this doesn't mean modal dialogs are fit for all purposes. Modals are purposefully disruptive and should be used thoughtfully and sparingly, specifically in moments where focus is required or an action must be taken.

<dialtone-usage>
<template #do>

- To complete a simple task or decision that requires their full attention outside the main workflow.
- Confirming a destructive action that is about to happen.
- Ask for a user's consent for an action.
</template>

<template #dont>

- When its content or features can be part of the page without complicating the page's intent.
- When the content or message requires interaction with other parts of the application or screen.
- Form-related critical, positive, or warning messages. Keep feedback in context to forms.
- Confirming an action took place (instead: use a [Toast](toast.md)).
- Revealing more information (instead: place content inline)
- Displaying complex forms or large amounts of information (instead: place content inline)
- Displaying content unrelated to current task (instead: place content inline as a [Link](link.md) or [Banner](banner.md)).
</template>

</dialtone-usage>

### Best Practices

- Ideally, users trigger the modal, not the system, and should not be a surprise. Its appearance should reflect user intent to invoke it.  Uninvited modals may surprise the user and result in a quick dismissal of the window.
- Treat modals as a last resort. Consider whether there's another component or UI that might be  less disruptive for the user.
- Limit the number of interactions in a modal. Remove anything that does not support the task.
- Avoid multiple steps that require navigation within the modal dialog.
- Avoid complex decision-making that requires additional sources of information unavailable in the modal.
- Use clear header and action labels. Label links and buttons with a verb that avoids ambiguity and clearly indicates what happens when it's selected. The primary action's label should complement the modal title.
- Avoid lengthy contents that require scrolling.
- Only one modal can be present at a time.

## Accessibility

- Opened modals "trap focus," meaning keyboard navigation controls are constrained to elements within the modal. Tabbing to the modal's last focusable element, and then pressing tab again would loop the focus back to the first element on the page. Focus doesn't return to the underlying page until the user explicitly dismisses the modal, in which case it would return to the place it was before the dialog opened.
- To ensure maximum compatibility, all `a` tags must have an `href`attribute. Also, any elements which you don't want to be focusable (but might be focusable by default) must have their `tabindex` set to `-1`.
- Focus should always begin on the first actionable element within the dialog. This could be an OK button, or the first field in the form. An X button in the top right corner should be last in the tab order even though it may be visually above the other elements.
- Check out the "Focus management" section of the following [MDN Dialog document](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role#focus_management) if you'd like to know more.
- Use `aria-labelledby` on its root element to associate a title to the modal to announce its to accessible technology. The value of aria-labelledby is to the `id` value of its heading element (e.g. `h2`).
- Dismissing Modal returns focus to the originating element that spawned the modal's display.

<component-accessible-table component-name="modal"></component-accessible-table>

## Variants and Examples

### Base Style

```vue demo
<example-modal />
<!-- @code -->
<dt-modal
  header-text="Example title"
  :open="isOpen"
  @update:open="updateOpen"
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

```vue demo
<example-modal fixed-header-footer :copy="fixedHeaderFooterCopy" />
<!-- @code -->
<dt-modal
  header-text="Example title"
  :open="isOpen"
  @update:open="updateOpen"
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

### Critical

A modal style for destructive or irreversible actions.

```vue demo
<example-modal kind="critical" />
<!-- @code -->
<dt-modal
  header-text="Example title"
  :open="isOpen"
  kind="critical"
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
  @update:open="updateOpen"
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
      kind="critical"
      importance="primary"
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

```vue demo
<example-modal fullscreen />
<!-- @code -->
<dt-modal
  header-text="Example title"
  :open="isOpen"
  fullscreen
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
  @update:open="updateOpen"
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

### Transparent Backdrop

By default, modals render a dimming overlay behind the dialog box. Set `transparent-backdrop` to render the surrounding backdrop fully transparent. The dialog box itself keeps its solid background. Use this when the underlying UI should remain visible behind the modal.

```vue demo
<example-modal transparent-backdrop />
<!-- @code -->
<dt-modal
  header-text="Example title"
  :open="isOpen"
  transparent-backdrop
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
  @update:open="updateOpen"
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

```vue demo
<dt-stack direction="row" gap="200" align="end">
  <dt-select-menu
    v-model="selectedBannerKind"
    label="Kind of Banner"
    :size="300"
    :options="bannerKinds"
  />
  <example-modal kind="default" :banner-kind="selectedBannerKind" banner-title="This banner can have different kinds." />
</dt-stack>
<!-- @code -->
<dt-modal
  header-text="Example title"
  :open="isOpen"
  banner-header-text="This banner can have different kinds."
  :bannerKind="selectedBannerKind"
  copy="Sed at orci quis nunc finibus gravida eget vitae est..."
  @update:open="updateOpen"
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

```vue demo
<div>
  <dt-modal
    :open="isOpen"
    @update:open="updateOpen"
  >
    <template #header>
      <dt-stack direction="row" align="center" justify="center" class="d-p-150 d-bgc-purple-100">
        <div>Custom header</div>
      </dt-stack>
    </template>
    <dt-stack direction="row" align="center" justify="center" class="d-p-400 d-bgc-gold-200">
      <h2>Custom content</h2>
    </dt-stack>
  </dt-modal>
  <dt-button
    @click="openModal"
  >
    Click to open
  </dt-button>
</div>
<!-- @code -->
<dt-modal
  :open="isOpen"
  @update:open="updateOpen"
>
  <template #header>
    <dt-stack direction="row" align="center" justify="center" class="d-p-150 d-bgc-purple-100">
      <div>Custom header</div>
    </dt-stack>
  </template>
  <dt-stack direction="row" align="center" justify="center" class="d-p-400 d-bgc-gold-200">
    <h2>Custom content</h2>
  </dt-stack>
</dt-modal>
```

## Content Mode

Modal content renders outside the DOM tree. Use the `contentMode` prop to apply color mode (invert, light, dark) to the positioned content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

```vue demo
<div>
  <dt-button @click="invertedModalOpen = true">Open Inverted Modal</dt-button>
  <dt-modal
    content-mode="invert"
    header-text="Inverted Modal"
    copy="This modal's content is in the inverted mode."
    :open="invertedModalOpen"
    @update:open="invertedModalOpen = $event"
  />
</div>
<!-- @code -->
<dt-modal content-mode="invert">...</dt-modal>
<dt-modal content-mode="dark">...</dt-modal>
<dt-modal content-mode="light">...</dt-modal>
```

## Vue API

<component-vue-api component-name="modal" />

## Classes

At minimum, modals contain a title and one button. They could also contain body text, brand illustrations, product wireframes, or multiple buttons.

<component-class-table component-name="modal"></component-class-table>

<script setup>
  import ExampleModal from '@exampleComponents/ExampleModal.vue';
  import { ref, inject } from 'vue';

  const isOpen = ref(false);
  const invertedModalOpen = ref(false);
  const selectedBannerKind = ref('positive');
  const fixedHeaderFooterCopy = ref(`Sed at orci quis nunc finibus gravida eget vitae est. Praesent
          ac laoreet mi. Cras porttitor mauris ex. Integer convallis tellus a ex egestas, id laoreet elit mollis. Mauris
          ut elementum velit. Nam vel consectetur turpis. Aenean consequat purus non nunc tincidunt rutrum. In semper
          pretium dui vel tempus. Proin et mi id mi egestas iaculis. Sed lacinia libero non molestie consequat. Sed
          efficitur purus eget lacus viverra volutpat. Nam luctus ac eros eu iaculis. Fusce non condimentum lorem.`.repeat(10))

  const openModal = () => {
    isOpen.value = true;
  };

  const updateOpen = (value) => {
    if (!value) isOpen.value = false;
  };

  const dialtoneConstants = inject('dialtoneConstants', {});
  const bannerKinds = Object.keys(dialtoneConstants.MODAL_BANNER_KINDS ?? {})
    .map(kind => ({ value: kind, label: kind }));
</script>
