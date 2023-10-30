---
title: Modal
description: A modal focuses the user’s attention on a single task or message.
status: ready
thumb: true
image: assets/images/components/modal.png
storybook: https://vue.dialpad.design/?path=/story/components-modal--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8923%3A20396&viewport=-724%2C-52%2C0.38&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <div class="d-d-grid d-gg16 d-g-cols4 md:d-g-cols2 d-fs-200">
    <a class="d-link" href="#base-style">
      <figure class="d-m0">
        <img class="d-bar4 d-w100p" alt="Modal screen: Base" :src="$withBase('/assets/images/screen-modal--base.png')">
        <figcaption>Base Style</figcaption>
      </figure>
    </a>
    <a class="d-link" href="#fixed-header-and-footer">
      <figure class="d-m0">
        <img class="d-bar4 d-w100p" alt="Modal screen: Fixed header and footer" :src="$withBase('/assets/images/screen-modal--fixed-header-and-footer.png')">
        <figcaption>
          Fixed header and footer
        </figcaption>
      </figure>
    </a>
    <a class="d-link" href="#danger">
      <figure class="d-m0">
        <img class="d-bar4 d-w100p" alt="Modal screen: Danger" :src="$withBase('/assets/images/screen-modal--danger.png')">
        <figcaption>
          Danger
        </figcaption>
      </figure>
    </a>
    <a class="d-link" href="#full-screen">
      <figure class="d-m0">
        <img class="d-bar4 d-w100p" alt="Modal screen: Full Screen" :src="$withBase('/assets/images/screen-modal--fullscreen.png')">
        <figcaption>
          Full Screen
        </figcaption>
      </figure>
    </a>
  </div>
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
  <example-modal kind="base" />
</code-well-header>

```html
<aside class="d-modal" id="modal-base" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="true">
  <div class="d-modal__dialog" role="document">
    <h2 class="d-modal__header" id="modal-title">…</h2>
    <p class="d-modal__content" id="modal-description">…</p>
    <footer class="d-modal__footer">
      <button class="d-btn" type="button">…</button>
      <button class="d-btn d-btn--primary" type="button">…</button>
    </footer>
    <button href="#" class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close"><IconClose /></button>
  </div>
</aside>
```

### Fixed header and footer

<code-well-header>
  <example-modal kind="fixed" />
</code-well-header>

```html
<aside class="d-modal" id="modal-base" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="true">
  <div class="d-modal__dialog d-modal__dialog--scrollable" role="document">
    <h2 class="d-modal__header" id="modal-title">…</h2>
    <p class="d-modal__content" id="modal-description">…</p>
    <footer class="d-modal__footer">
      <button class="d-btn" type="button">…</button>
      <button class="d-btn d-btn--primary" type="button">…</button>
    </footer>
    <button href="#" class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close"><IconClose /></button>
  </div>
</aside>
```

### Danger

<code-well-header>
  <example-modal kind="danger" />
</code-well-header>

```html
<aside class="d-modal d-modal--danger" id="modal-base" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="true">
  <div class="d-modal__dialog" role="document">
    <h2 class="d-modal__header" id="modal-title">…</h2>
    <p class="d-modal__content" id="modal-description">…</p>
    <footer class="d-modal__footer">
      <button class="d-btn" type="button">…</button>
      <button class="d-btn d-btn--danger d-btn--primary" type="button">…</button>
    </footer>
    <button href="#" class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close"><IconClose \></button>
  </div>
</aside>
```

### Full Screen

<code-well-header>
  <example-modal kind="full-screen" />
</code-well-header>

```html
<aside class="d-modal d-modal--full" id="modal-base" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="true">
  <div class="d-modal__dialog" role="document">
    <h2 class="d-modal__header" id="modal-title">…</h2>
    <p class="d-modal__content" id="modal-description">…</p>
    <footer class="d-modal__footer">
      <button class="d-btn" type="button">…</button>
      <button class="d-btn d-btn--primary" type="button">…</button>
    </footer>
    <button href="#" class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close"><IconClose \></button>
  </div>
</aside>
```

### Has Banner

When there is a need of more context information regarding the content of the Modal

<code-well-header>
  <example-modal kind="default" bannerKind="success" bannerTitle="This banner can have different kinds." />
</code-well-header>

```html
<aside class="d-modal" id="modal-base" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="true">
  <div class="d-modal__banner d-modal__banner--success">...</div>
  <div class="d-modal__dialog" role="document">
    <h2 class="d-modal__header" id="modal-title">…</h2>
    <p class="d-modal__content" id="modal-description">…</p>
    <footer class="d-modal__footer">
      <button class="d-btn" type="button">…</button>
      <button class="d-btn d-btn--primary" type="button">…</button>
    </footer>
    <button href="#" class="d-modal__close d-btn d-btn--circle d-btn--lg" aria-label="Close"><IconClose /></button>
  </div>
</aside>
```

## Vue API

<component-vue-api component-name="modal" />

## Classes

At minimum, modals contain a title and one button. They could also contain body text, brand illustrations, product wireframes, or multiple buttons.

<component-class-table component-name="modal"></component-class-table>

<script setup>
  import IconCheckmark from '@svgIcons/IconCheckmark.vue';
  import IconClose from '@svgIcons/IconClose.vue';
  import ExampleModal from '@exampleComponents/ExampleModal.vue';
  import DialtoneUsage from '@baseComponents/DialtoneUsage.vue';
</script>
