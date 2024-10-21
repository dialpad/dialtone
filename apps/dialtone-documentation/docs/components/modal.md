---
title: Modal
description: A modal focuses the user’s attention on a single task or message.
status: ready
thumb: true
image: assets/images/components/modal.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-modal--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8923%3A20396&viewport=-724%2C-52%2C0.38&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <example-modal />
</code-well-header>

## Usage

Modals disable underlying content and are used to present a short-term task the user needs to perform without losing the context of the underlying page. Users won't be able to interact with the page until they close the modal.

Although highly versatile, this doesn't mean modal dialogs are fit for all purposes. Modals are purposefully disruptive and should be used thoughtfully and sparingly, specifically in moments where focus is required or an action must be taken.

<dialtone-usage>
<template #do>

- To complete a simple task or decision that requires their full attention outside the main workflow.
- Confirming a destructive action that is about to happen.
- Ask for a user’s consent for an action.
</template>

<template #dont>

- When its content or features can be part of the page without complicating the page’s intent.
- When the content or message requires interaction with other parts of the application or screen.
- Form-related error, success, or warning messages. Keep feedback in context to forms.
- Confirming an action took place (instead: use a [Toast](toast.md)).
- Revealing more information (instead: place content inline)
- Displaying complex forms or large amounts of information (instead: place content inline)
- Displaying content unrelated to current task (instead: place content inline as a [Link](link.md) or [Banner](banner.md)).
</template>

</dialtone-usage>

### Best practices

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

<component-accessible-table component-name="modal"></component-accessible-table>

## Variants and examples

### Base Style

<code-well-header>
  <example-modal />
</code-well-header>

<code-example-tabs
htmlCode='
<button type="button" class="base-button__button d-btn d-btn--primary">
  <span class="d-btn__label base-button__label"> Click to open </span>
</button>
<aside id="modal-base" class="d-modal d-m0 d-modal--animate-in" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="false">
  <div class="d-modal__dialog d-modal__dialog--animate-in" role="document">
    <h2 class="d-modal__header">
      Example title
    </h2>
    <div class="d-modal__content">
      <p id="modal-description">
        Sed at orci quis nunc finibus gravida eget vitae est...
      </p>
      <p class="d-mt16"><a href="#" class="d-link">Show me a modal banner</a></p>
    </div>
    <footer class="d-modal__footer">
      <button class="d-btn d-btn--primary" type="button">
        Save changes
      </button>
      <button class="d-btn" type="button">
        Cancel
      </button>
    </footer>
    <button class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close">
      <span class="d-btn__icon">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
'
vueCode='
<dt-modal
  title="Example title"
  close-button-props="Close"
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
'
showHtmlWarning />

### Fixed header and footer

This is the default behavior that adds the scroll automatically in the modal content and leaves the header and footer fixed.

<code-well-header>
  <example-modal fixed-header-footer :copy="fixedHeaderFooterCopy" />
</code-well-header>

<code-example-tabs
htmlCode='
<button type="button" class="base-button__button d-btn d-btn--primary">
  <span class="d-btn__label base-button__label"> Click to open </span>
</button>
<aside id="modal-base" class="d-modal d-m0 d-modal--animate-in" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="false">
  <div class="d-modal__dialog d-modal__dialog--animate-in d-modal__dialog--scrollable d-hmx764" role="document">
    <h2 class="d-modal__header">
      Example title
    </h2>
    <div class="d-modal__content">
      <p id="modal-description">
        Sed at orci quis nunc finibus gravida eget vitae est...
      </p>
      <p class="d-mt16"><a href="#" class="d-link">Show me a modal banner</a></p>
    </div>
    <footer class="d-modal__footer">
      <button class="d-btn d-btn--primary" type="button">
        Save changes
      </button>
      <button class="d-btn" type="button">
        Cancel
      </button>
    </footer>
    <button class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close">
      <span class="d-btn__icon">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
'
vueCode='
<dt-modal
  title="Example title"
  close-button-props="Close"
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
'
showHtmlWarning />

### Danger

A modal style for destructive or irreversible actions.

<code-well-header>
  <example-modal kind="danger" />
</code-well-header>

<code-example-tabs
htmlCode='
<button type="button" class="base-button__button d-btn d-btn--primary">
  <span class="d-btn__label base-button__label"> Click to open </span>
</button>
<aside id="modal-base" class="d-modal d-m0 d-modal--danger d-modal--animate-in" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="false">
  <div class="d-modal__dialog d-modal__dialog--animate-in" role="document">
    <h2 class="d-modal__header">
      Example title
    </h2>
    <div class="d-modal__content">
      <p id="modal-description">
        Sed at orci quis nunc finibus gravida eget vitae est...
      </p>
      <p class="d-mt16"><a href="#" class="d-link">Show me a modal banner</a></p>
    </div>
    <footer class="d-modal__footer">
      <button class="d-btn d-btn--primary d-btn--danger" type="button">
        Save changes
      </button>
      <button class="d-btn d-btn--muted" type="button">
        Cancel
      </button>
    </footer>
    <button class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close">
      <span class="d-btn__icon">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
'
vueCode='
<dt-modal
  title="Example title"
  close-button-props="Close"
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
'
showHtmlWarning />

### Full Screen

To make this modal take up as much of the screen as possible.

<code-well-header>
  <example-modal size="full" />
</code-well-header>

<code-example-tabs
htmlCode='
<button type="button" class="base-button__button d-btn d-btn--primary">
  <span class="d-btn__label base-button__label"> Click to open </span>
</button>
<aside id="modal-base" class="d-modal d-m0 d-modal--full d-modal--animate-in" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="false">
  <div class="d-modal__dialog d-modal__dialog--animate-in" role="document">
    <h2 class="d-modal__header">
      Example title
    </h2>
    <div class="d-modal__content">
      <p id="modal-description">
        Sed at orci quis nunc finibus gravida eget vitae est...
      </p>
      <p class="d-mt16"><a href="#" class="d-link">Show me a modal banner</a></p>
    </div>
    <footer class="d-modal__footer">
      <button class="d-btn d-btn--primary" type="button">
        Save changes
      </button>
      <button class="d-btn" type="button">
        Cancel
      </button>
    </footer>
    <button class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close">
      <span class="d-btn__icon">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
'
vueCode='
<dt-modal
  title="Example title"
  close-button-props="Close"
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
'
showHtmlWarning />

### Has Banner

When there is a need of more context information regarding the content of the Modal

<code-well-header>
  <dt-stack direction="row" gap="500" class="d-ai-flex-end">
    <dt-select-menu
      label="Kind of Banner"
      size="md"
      @change="changeBannerKind"
    >
      <option
        v-for="option in bannerKinds()"
        :key="option"
        :selected="option === selectedBannerKind"
        :value="option"
        v-text="option"
      />
    </dt-select-menu>
    <example-modal kind="default" :banner-kind="selectedBannerKind" banner-title="This banner can have different kinds." />
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<button type="button" class="base-button__button d-btn d-btn--primary">
  <span class="d-btn__label base-button__label"> Click to open </span>
</button>
<aside id="modal-base" class="d-modal d-m0 d-modal--animate-in" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="false">
  <div class="d-modal__banner d-modal__banner--success">This banner can have different kinds.</div>
  <div class="d-modal__dialog d-modal__dialog--animate-in" role="document">
    <h2 class="d-modal__header">
      Example title
    </h2>
    <div class="d-modal__content">
      <p id="modal-description">
        Sed at orci quis nunc finibus gravida eget vitae est...
      </p>
    </div>
    <footer class="d-modal__footer">
      <button class="d-btn d-btn--primary" type="button">
        Save changes
      </button>
      <button class="d-btn" type="button">
        Cancel
      </button>
    </footer>
    <button class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close">
      <span class="d-btn__icon">
        <span class="d-icon__wrapper">
          <div aria-busy="true" role="status" aria-label="" class="d-icon d-icon--size-300" style="display: none;">
            <div
              class="skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
              style="animation-delay: 0ms; animation-duration: 1000ms; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%;"
            ></div>
          </div>
          <svg>...</svg>
        </span>
      </span>
    </button>
  </div>
</aside>
'
vueCode='
<dt-modal
  title="Example title"
  close-button-props="Close"
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
'
showHtmlWarning />

### Custom header and content

You're not limited to using plain title and copy text.

In addition to the footer, custom elements can be inserted into the header and body sections of the dialog via slots.

**Please note:** supplied header or body slots will take the place of any provided "title" or "copy" text, respectively.

<code-well-header>
  <dt-modal
    :close-button-props="{ ariaLabel: 'Close' }"
    :show="isOpen"
    @update:show="updateShow"
  >
    <template #header>
      <div class="d-fl-center d-p12 d-bgc-purple-100">
        <div>Custom header</div>
      </div>
    </template>
    <div class="d-fl-center d-p32 d-bgc-gold-200">
      <h2>Custom content</h2>
    </div>
  </dt-modal>
  <dt-button
    @click="openModal"
  >
    Click to open
  </dt-button>
</code-well-header>

<code-example-tabs
vueCode='
<dt-modal
  :close-button-props="{ ariaLabel: `Close` }"
  :show="isOpen"
  @update:show="updateShow"
>
  <template #header>
    <div class="d-fl-center d-p12 d-bgc-purple-100">
      <div>Custom header</div>
    </div>
  </template>
  <div class="d-fl-center d-p32 d-bgc-gold-200">
    <h2>Custom content</h2>
  </div>
</dt-modal>
'
/>

## Vue API

<component-vue-api component-name="modal" />

## Classes

At minimum, modals contain a title and one button. They could also contain body text, brand illustrations, product wireframes, or multiple buttons.

<component-class-table component-name="modal"></component-class-table>

<script setup>
  import ExampleModal from '@exampleComponents/ExampleModal.vue';
  import { ref } from 'vue';

  const isOpen = ref(false);
  const selectedBannerKind = ref('success');
  const fixedHeaderFooterCopy = ref(`Sed at orci quis nunc finibus gravida eget vitae est. Praesent
          ac laoreet mi. Cras porttitor mauris ex. Integer convallis tellus a ex egestas, id laoreet elit mollis. Mauris
          ut elementum velit. Nam vel consectetur turpis. Aenean consequat purus non nunc tincidunt rutrum. In semper
          pretium dui vel tempus. Proin et mi id mi egestas iaculis. Sed lacinia libero non molestie consequat. Sed
          efficitur purus eget lacus viverra volutpat. Nam luctus ac eros eu iaculis. Fusce non condimentum lorem.`.repeat(10))

  const openModal = () => {
    isOpen.value = true;
  };

  const updateShow = (value) => {
    if (!value) isOpen.value = false;
  };

  const changeBannerKind = (kind) => {
    selectedBannerKind.value = kind;
  };

  const bannerKinds = () => {
    return Object.keys(window.DIALTONE_CONSTANTS.MODAL_BANNER_KINDS);
  };
</script>
