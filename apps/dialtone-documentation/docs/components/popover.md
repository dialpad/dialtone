---
title: Popover
description: A Popover displays a content overlay when its anchor element is activated.
status: ready
thumb: true
image: assets/images/components/popover.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-popover--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8921%3A22411&viewport=831%2C-269%2C0.43&t=xHutRjwo1o5zMTgT-11
---
<code-well-header bgclass="d-bgc-primary">
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

<code-well-header bgclass="d-bgc-primary">
  <example-popover modal />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover d-fl-center d-fd-column d-p24 d-w100p d-of-auto">
  <button id="anchor1" class="d-btn d-btn--primary" aria-expanded="true" aria-controls="dialog1" aria-haspopup="dialog">
    View Popover
  </button>
  <div id="dialog1" class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164 d-vi-hidden" role="dialog" aria-modal="true" aria-hidden="false" aria-labelledby="anchor1">
    <div class="d-popover__content d-p16">
      <div class="d-mb8">
        This is content rendered within the popover.
      </div>
      <button class="d-btn d-btn--primary">
        Button
      </button>
    </div>
  </div>
</div>
'
vueCode='
<dt-popover
  :open="onOpen"
  class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164"
>
  <template slot="anchor">
    <dt-button>
       View Popover
    </dt-button>
  </template>
  <template
    slot="content"
    slot-scope="{ close }"
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

<code-well-header bgclass="d-bgc-primary">
  <example-popover />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover d-fl-center d-fd-column d-p24 d-w100p d-of-auto">
  <button id="anchor1" class="d-btn d-btn--primary" aria-expanded="false" aria-controls="dialog1" aria-haspopup="dialog">
    View Popover
  </button>
  <div id="dialog1" class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164 d-vi-visible" role="dialog" aria-modal="false" aria-hidden="true" aria-labelledby="anchor1">
    <div class="d-popover__content d-p16">
      <div class="d-mb8">
        This is content rendered within the popover.
      </div>
      <button class="d-btn d-btn--primary">
        Button
      </button>
    </div>
  </div>
</div>
'
vueCode='
<dt-popover
  :open="onOpen"
  :modal="false"
  class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164"
>
  <template slot="anchor">
    <dt-button>
      View Popover
    </dt-button>
  </template>
  <template
    slot="content"
    slot-scope="{ close }"
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

<code-well-header bgclass="d-bgc-primary">
  <example-popover modal header>
    <template #content>
      <div class="d-mb8">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<br></div>
    </template>
  </example-popover>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover d-fl-center d-fd-column d-p24 d-w100p d-of-auto">
  <button id="anchor1" class="d-btn d-btn--primary" aria-expanded="false" aria-controls="dialog1" aria-haspopup="dialog">
    View Popover
  </button>
  <div id="dialog1" class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164 d-vi-visible" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="anchor1">
    <div class="d-popover__header d-px16">
      <div class="d-w100p">
        This is the header
      </div>
    </div>
    <div class="d-popover__content d-p16">
      <div class="d-mb8">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam
        repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati
        quibusdam repudiandae.<br />
      </div>
      <button class="d-btn d-btn--primary">
        Button
      </button>
    </div>
  </div>
</div>
'
vueCode='
<dt-popover
  :open="onOpen"
  class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164"
>
  <template slot="anchor">
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
    slot="content"
    slot-scope="{ close }"
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

<code-well-header bgclass="d-bgc-primary">
  <example-popover modal footer>
    <template #content>
      <div class="d-mb8">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam repudiandae.<br></div>
    </template>
  </example-popover>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-popover d-fl-center d-fd-column d-p24 d-w100p d-of-auto">
  <button id="anchor1" class="d-btn d-btn--primary" aria-expanded="false" aria-controls="dialog1" aria-haspopup="dialog">
    View Popover
  </button>
  <div id="dialog1" class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164 d-vi-visible" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="anchor1">
    <div class="d-popover__content d-p16">
      <div class="d-mb8">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati quibusdam
        repudiandae. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore, maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis obcaecati
        quibusdam repudiandae.<br />
      </div>
      <button class="d-btn d-btn--primary">
        Button
      </button>
    </div>
    <div class="d-popover__footer d-px16">
      <div class="d-w100p">
        This is the footer
      </div>
    </div>
  </div>
</div>
'
vueCode='
<dt-popover
  :open="onOpen"
  class="d-popover__dialog d-popover__dialog--modal d-ps-relative d-t4 d-w264 d-hmx164"
>
  <template slot="anchor">
    <dt-button>
      View Popover
    </dt-button>
  </template>
  <template
    slot="content"
    slot-scope="{ close }"
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

## Vue API

<component-vue-api component-name="popover" />

## Classes

Popover must contain an anchor and content element. d-modal--transparent can be used as a sibling before the popover container if you wish to make the popover modal.

<component-class-table component-name="popover" />

## Accessibility

If your popover is modal, please see the accessibility section of this page regarding "focus trapping": <a href="components/modal/#accessibility">Modal Accessibility</a>. The same rules will apply here if your popover is modal.

<component-accessible-table component-name="popover"/>

<script setup>
  import ExamplePopover from '@exampleComponents/ExamplePopover.vue';
</script>
