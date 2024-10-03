---
title: Popover
description: A Popover displays a content overlay when its anchor element is activated.
status: ready
thumb: true
image: assets/images/components/popover.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-popover--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8921%3A22411&viewport=831%2C-269%2C0.43&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <example-popover modal />
</code-well-header>

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

<dialtone-usage>
<template #do>

- Smaller sized dialogs that trigger on user activation of an anchor element.
- Dialogs that should be positioned relative to the anchor.
- Dialogs that contain interactive components.
</template>

<template #dont>

- Content that is displayed on hover. Instead, use a [Tooltip](tooltip.md).
- Dialogs that should be positioned in the center of the screen.
- Dialogs that are very large.
- Alerts.
</template>

</dialtone-usage>

### Best practices

- Popovers should be fairly small. If you are looking for more of a full size dialog solution see [Modal](modal.md)
- Trigger using an anchor element, such as a button.
- Render the dialog at the body element.
- Focus the first interactive element within the dialog after it is opened.
- Close the dialog when ESC is pressed.
- Close non-modal dialogs if they are scrolled out of visibility.
- Set the z-index of the dialog to var(--zi-modal-element) if modal, var(--zi-popover) if not.

## Variants and examples

### Popover - Modal

<code-well-header>
  <example-popover modal />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover">
  <div id="DtPopover__anchor1">
    <button type="button" class="base-button__button d-btn d-btn--primary" aria-expanded="false">
      <span class="d-btn__label base-button__label"> View Popover </span>
    </button>
  </div>
</div>
<div class="tippy-box d-ps-absolute" id="tippy-1" style="z-index: 650; position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(-593px, 197px, 0px);" data-popper-placement="bottom-end">
  <div id="dt0" role="dialog" aria-hidden="false" aria-labelledby="DtPopover__anchor1" aria-modal="false" tabindex="-1" class="d-popover__dialog d-popover__dialog--modal" style="">
    <div class="d-popover__content d-p16">
      <div>
        <p class="d-mb4">This is content rendered within the popover.</p>
        <button type="button" class="base-button__button d-btn d-btn--primary">
          <span class="d-btn__label base-button__label"> Button </span>
        </button>
      </div>
    </div>
  </div>
</div>
'
vueCode='
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
'
showHtmlWarning />

### Popover - Non Modal

<code-well-header>
  <example-popover />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover">
  <div id="DtPopover__anchor1">
    <button type="button" class="base-button__button d-btn d-btn--primary" aria-expanded="false">
      <span class="d-btn__label base-button__label"> View Popover </span>
    </button>
  </div>
</div>
<div class="tippy-box d-ps-absolute" data-tippy-root="" id="tippy-1" data-popper-placement="bottom-end" style="z-index: 300; position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(-593px, 197px, 0px);">
  <div id="dt0" role="dialog" aria-hidden="false" aria-labelledby="DtPopover__anchor1" aria-modal="true" tabindex="-1" class="d-popover__dialog" style="">
    <div class="d-popover__content d-p16">
      <div>
        <p class="d-mb4">This is content rendered within the popover.</p>
        <button type="button" class="base-button__button d-btn d-btn--primary">
          <span class="d-btn__label base-button__label"> Button </span>
        </button>
      </div>
    </div>
  </div>
</div>
'
vueCode='
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
'
showHtmlWarning />

### With Header - Modal

<code-well-header>
  <example-popover modal header>
    <template #content>
      <div class="d-mb8">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<br></div>
    </template>
  </example-popover>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover">
  <div id="DtPopover__anchor1">
    <button type="button" class="base-button__button d-btn d-btn--primary" aria-expanded="false">
      <span class="d-btn__label base-button__label"> View Popover </span>
    </button>
  </div>
</div>
<div class="tippy-box d-ps-absolute" data-tippy-root="" id="tippy-1" data-popper-placement="bottom-end" style="z-index: 650; position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(5px, 197px, 0px);">
  <div
    id="dt0"
    role="dialog"
    aria-hidden="false"
    aria-labelledby="DtPopover__anchor1"
    aria-modal="false"
    tabindex="-1"
    class="d-popover__dialog d-popover__dialog--modal"
    style="max-height: calc(100vh - var(--dt-space-300));"
  >
    <div class="d-popover__header d-pl16">
      <div class="d-popover__header__content"><div class="d-w100p">This is the header</div></div>
    </div>
    <div class="d-popover__content d-p16">
      <div>
        <div class="d-mb8">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam
          repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis
          obcaecati quibusdam repudiandae.<br />
        </div>
        <button type="button" class="base-button__button d-btn d-btn--primary">
          <span class="d-btn__label base-button__label"> Button </span>
        </button>
      </div>
    </div>
  </div>
</div>
'
vueCode='
<dt-popover
  :open="onOpen"
>
  <template #anchor>
    <dt-button>
      View Popover
    </dt-button>
  </template>
  <template slot="headerContent">
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
'
showHtmlWarning />

### With Footer - Modal

<code-well-header>
  <example-popover modal footer>
    <template #content>
      <div class="d-mb8">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<br></div>
    </template>
  </example-popover>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover">
  <div id="DtPopover__anchor1">
    <button type="button" class="base-button__button d-btn d-btn--primary" aria-expanded="false">
      <span class="d-btn__label base-button__label"> View Popover </span>
    </button>
  </div>
</div>
<div class="tippy-box d-ps-absolute" data-tippy-root="" id="tippy-5" style="z-index: 650; position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate3d(5px, 197px, 0px);" data-popper-placement="bottom-end">
  <div
    id="dt0"
    role="dialog"
    aria-hidden="false"
    aria-labelledby="DtPopover__anchor1"
    aria-modal="false"
    tabindex="-1"
    class="d-popover__dialog d-popover__dialog--modal"
    style="max-height: calc(100vh - var(--dt-space-300));"
  >
    <div class="d-popover__content d-p16">
      <div>
        <div class="d-mb8">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam
          repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis
          obcaecati quibusdam repudiandae.<br />
        </div>
        <button type="button" class="base-button__button d-btn d-btn--primary">
          <span class="d-btn__label base-button__label"> Button </span>
        </button>
      </div>
    </div>
    <div class="d-popover__footer d-pl16">
      <div class="d-popover__footer__content"><div class="d-w100p">This is the footer</div></div>
    </div>
  </div>
</div>
'
vueCode='
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
  <template slot="footerContent">
    <div class="d-w100p">
      This is the footer
    </div>
  </template>
</dt-popover>
'
showHtmlWarning />

### Fallback placements

The popover uses [headless-tippy](https://atomiks.github.io/tippyjs/v6/headless-tippy/) and
[popper](https://popper.js.org/docs/v2/modifiers/flip/), if the popover opens in a placement where it will
be clipped, it will move to a new position. It will do this automatically by default, but if you want to
manually specify which position it will move to in what order you can do so via the fallbackPlacements prop.

<code-well-header>
  <example-popover :fallback-placements="['top']" />
</code-well-header>

<code-example-tabs
vueCode='
<dt-popover
  :open="onOpen"
  :fallback-placements="[`top`]"
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
'
/>

### Padding

Padding options for the popover content are provided via size classes "small", "medium" or "large" in order to standardize the look of the popover content between usages. To remove the padding from the content, you can pass "none". Setting none will also allow you to set custom padding via utility classes (Ex: you only want padding on the left.).

<code-well-header>
  <example-popover padding="small" />
</code-well-header>

<code-example-tabs
vueCode='
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
'
/>

### Force close all opened instances

When the popover is open, it will attach an event listener into the window object, so you can close the instances dispatching the `dt-popover-close` event in the window object:

```js
const e = new Event('dt-popover-close');
window.dispatchEvent(e);
```

## Vue API

<component-vue-api component-name="popover" />

## Classes

Popover must contain an anchor and content element. d-modal--transparent can be used as a sibling before the popover container if you wish to make the popover modal.

<component-class-table component-name="popover" />

## Accessibility

If your popover is modal, please see the accessibility section of this page regarding "focus trapping": <a href="components/modal/#accessibility">Modal Accessibility</a>. The same rules will apply here if your popover is modal.

Popovers, in their current implementation, are accessible when used as interactive components. Content will be read to screen reader users, and the popover markup by is appended to the `<body>`.

There are a few important considerations to ensure popover controls are accessible:

- The popover content will have a generic role of "dialog" ( "menu" and "listbox" are also possible roles as well).
- On open, focus will be transferred to the first focusable element within the popover, after close the triggering element will be focused.
- It is possible to include a screen reader visible only close button setting "visually-hidden-close" and "visually-hidden-close-label" props.

<component-accessible-table component-name="popover"/>

## Anchor

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

### Keyboard support

The below keyboard functionality is automatically implemented when using the popover component:

- The user can dismiss the popover pressing the `ESC` key, after that the focus will be returned to the element that launched it.
- The user can traverse focusable elements using the `TAB` key. If the popover has a defined header, the focus will be moved to the header buttons after the last focusable element inside content's container.

Additionally you must use the "initialFocusElement" prop to set which element is initially focused when the popover opens. You can set this to "first" to focus the first focusable element, "dialog" to focus the dialog itself, a string starting with '#' to focus an element by id within the dialog or you may pass in an HTMLElement directly. If set to "none" the focus will remain on the anchor, however this is invalid behavior if the popover is modal.

### References

- [tippyjs](https://atomiks.github.io/tippyjs/)
- [popper.js](https://popper.js.org/)
- [Apple. Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/views/popovers/)
- [Spectrum. Accessibility overlay trigger](https://react-spectrum.adobe.com/react-aria/useOverlayTrigger.html)
- [Slack Design. Accessibility, a powerful design tool](https://slack.design/articles/accessibility-a-powerful-design-tool/)

<script setup>
  import ExamplePopover from '@exampleComponents/ExamplePopover.vue';
</script>
