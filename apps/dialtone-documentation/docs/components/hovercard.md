---
title: Hovercard
description: A Hovercard toggles a content overlay when its anchor element is hovered for a minimum amount of time.
status: ready
thumb: true
image: assets/images/components/hovercard.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-hovercard--default
figma_url: https://www.figma.com/design/2adf7JhZOncRyjYiy2joil/DT9-Component-Library?node-id=14395-441&t=l9JqN3TZt1kqjnzE-0
---

The hovercard will appear upon the mouse entering the anchor, with a delay of 300 milliseconds. It will remain open as long as the mouse cursor is over either the open card or the anchor.

<code-well-header bgclass="d-bgc-primary" class="d-h264 d-jc-flex-start">
  <example-hovercard />
</code-well-header>

<code-example-tabs
htmlCode='
<div data-qa="dt-hovercard">
  <div class="d-popover d-popover__anchor--opened" data-qa="dt-popover-container">
    <div id="DtPopover__anchor21" data-qa="dt-hovercard-anchor">
      <button class="base-button__button d-btn d-btn--outlined d-btn--muted" data-qa="dt-button" type="button" aria-expanded="true">
        <span data-qa="dt-button-label" class="d-btn__label base-button__label">
          Hover over me
        </span>
      </button>
    </div>
  </div>
</div>
<div class="tippy-box d-ps-absolute" data-tippy-root="" id="tippy-11" style="z-index: 300; position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(874px, 365px, 0px);" data-popper-placement="bottom-start">
  <div id="dt20" role="dialog" data-qa="dt-hovercard__dialog" aria-hidden="false" aria-labelledby="DtPopover__anchor21" aria-modal="true" class="d-popover__dialog" tabindex="-1" style="">
    <div data-qa="dt-popover-header-footer" class="d-popover__header d-pl16">
      <div data-qa="dt-popover-header-footer-content" class="d-popover__header__content">
        <div>Header</div>
      </div>
    </div>
    <div data-qa="dt-hovercard-content" class="d-popover__content d-p16">
      <div>Content</div>
    </div>
    <div data-qa="dt-popover-header-footer" class="d-popover__footer d-pl16">
      <div data-qa="dt-popover-header-footer-content" class="d-popover__footer__content">
        <div>Footer</div>
      </div>
    </div>
  </div>
</div>
'
vueCode='
<dt-hovercard placement="bottom-start">
  <template #anchor>
    <dt-button kind="muted" importance="outlined">
      Hover over me
    </dt-button>
  </template>
  <template #content>
    <div>Content</div>
  </template>
  <template #headerContent>
    <div>Header</div>
  </template>
  <template #footerContent>
    <div>Footer</div>
  </template>
</dt-hovercard>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="hovercard" />

<script setup>
  import ExampleHovercard from '@exampleComponents/ExampleHovercard.vue';
</script>
