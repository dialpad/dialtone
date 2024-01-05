---
title: Hovercard
description: The Hovercard component provides a popover-like experience for displaying additional information.
status: ready
thumb: true
image: assets/images/components/hovercard.png
storybook: https://vue.dialpad.design/?path=/story/components-hovercard--default
figma_url: https://www.figma.com/file/lGKE93k5Ydn16NF6fLe5r9/%5BDP-39438%5D-Call-Workflow?type=design&node-id=3946-162532&mode=design&t=OK9HFlRz8HJ5UjuF-0
---

<code-well-header bgclass="d-bgc-primary" class="d-h264 d-jc-flex-end">
  <dt-hovercard id="hovercard-1">
    <template #anchor>
      <dt-button>Hover me</dt-button>
    </template>
    <template #content>
      <div>Main content</div>
    </template>
    <template #headerContent>
      <div class="d-pr16">Header content</div>
    </template>
    <template #footerContent>
      <div class="d-pr16">Footer content</div>
    </template>
  </dt-hovercard>
</code-well-header>

## Usage

A Hovercard contains a dialog that will appear above other content when activated. It will always appear in a location relative to the anchor.
The difference with Popover is that the dialog appears when the mouse enters the anchor, instead of on click, or other interactions that the
Popover supports.

### Best practices

- Trigger using an anchor element, such as a button.
- Render the dialog at the body element.
- Focus the first interactive element within the dialog after it is opened.

## Vue API

<component-vue-api component-name="hovercard" />
