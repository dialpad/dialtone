---
title: Dropdown
description: A Dropdown presents a list of options or actions.
status: planned
thumb: true
image: assets/images/components/dropdown.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-dropdown--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=10732%3A69099
---

<code-well-header bgclass="d-bgc-neutral-white">
  <video class="d-w60p" src="/assets/images/components/preview--dropdown.mp4" autoplay loop></video>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div class="d-popover">
    <div id="DtPopover__anchor2">
      <button class="base-button__button d-btn d-btn--primary">
        <span class="d-btn__label base-button__label"> Click to open </span>
      </button>
    </div>
  </div>
</div>
'
vueCode='
<dt-dropdown>
  <template #anchor>
    <dt-button>
      Click to open
    </dt-button>
  </template>
  <template #list>
    <dt-list-item>
      Menu item 1
    </dt-list-item>
    <dt-list-item>
      Menu item 2
    </dt-list-item>
  </template>
</dt-dropdown>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="dropdown" />
