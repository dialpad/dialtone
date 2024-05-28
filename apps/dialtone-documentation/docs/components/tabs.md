---
title: Tabs
status: ready
thumb: true
description: Tabs allow users to navigation between grouped content in different views while within the same page context.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tabs--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21321&viewport=306%2C-547%2C1.01&t=xHutRjwo1o5zMTgT-11
---
<code-well-header bgclass="d-bgc-primary">
  <example-tabs />
</code-well-header>

[//]: # (## Usage)
[//]: # (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa ante, tempus vitae lacus id, luctus tristique lorem. Mauris feugiat massa ex, id aliquet mi tempor non. Curabitur non tristique lectus. Fusce ut nisl non diam dignissim viverra. In posuere dui arcu, sed eleifend massa faucibus sed. Phasellus quis leo vitae erat pellentesque venenatis id vitae lectus. Suspendisse convallis, metus a congue tincidunt, velit sem tincidunt dui, eget auctor ipsum ipsum in ex. Nullam lobortis, mauris vel vestibulum rutrum, lorem elit vehicula est, nec viverra ante erat nec dolor. Proin at placerat tortor. Nam ullamcorper metus et eros porta, at lacinia leo scelerisque. Curabitur finibus sollicitudin odio tempor finibus. Donec lobortis metus vitae mollis gravida.)

## Variants and examples

### Base Styles

<code-well-header bgclass="d-bgc-primary">
  <example-tabs />
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div role="tablist" class="d-tablist">
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab d-tab--selected" id="dt-tab-1" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">
      <span class="d-btn__label base-button__label"> First </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-3" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">
      <span class="d-btn__label base-button__label"> Second </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-5`" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">
      <span class="d-btn__label base-button__label"> Third </span>
    </button>
  </div>
  <div>
    <div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false" style=""><p>First Panel</p></div>
    <div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;"><p>Second Panel</p></div>
    <div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;"><p>Third Panel</p></div>
  </div>
</div>
'
vueCode='
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

### Sizes

<code-well-header bgclass="d-bgc-primary">
  <example-tabs hide-content size="small" />
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div role="tablist" class="d-tablist d-tablist--sm">
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab d-tab--selected" id="dt-tab-1" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">
      <span class="d-btn__label base-button__label"> First </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-3" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">
      <span class="d-btn__label base-button__label"> Second </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-5`" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">
      <span class="d-btn__label base-button__label"> Third </span>
    </button>
  </div>
  <div>
    <div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false" style=""><p>First Panel</p></div>
    <div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;"><p>Second Panel</p></div>
    <div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;"><p>Third Panel</p></div>
  </div>
</div>
'
vueCode='
<dt-tab-group size="sm">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

### Borderless

Add a `d-tablist--no-border` to remove the bottom border of any tablist. Handy for small tablists and tablists serving as subtabs to a larger menu.

<code-well-header bgclass="d-bgc-primary">
  <example-tabs hide-content borderless />
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div role="tablist" class="d-tablist d-tablist--no-border">
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab d-tab--selected" id="dt-tab-1" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">
      <span class="d-btn__label base-button__label"> First </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-3" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">
      <span class="d-btn__label base-button__label"> Second </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-5`" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">
      <span class="d-btn__label base-button__label"> Third </span>
    </button>
  </div>
  <div>
    <div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false" style=""><p>First Panel</p></div>
    <div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;"><p>Second Panel</p></div>
    <div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;"><p>Third Panel</p></div>
  </div>
</div>
'
vueCode='
<dt-tab-group :borderless="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

### Inverted

Add `d-tablist--inverted` when you want to display tabs on inverted background.

<code-well-header bgclass="d-bgc-contrast">
  <example-tabs inverted />
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div role="tablist" class="d-tablist d-tablist--inverted">
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab d-tab--selected" id="dt-tab-1" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">
      <span class="d-btn__label base-button__label"> First </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-3" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">
      <span class="d-btn__label base-button__label"> Second </span>
    </button>
    <button type="button" class="base-button__button d-btn d-btn--primary d-tab" id="dt-tab-5`" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">
      <span class="d-btn__label base-button__label"> Third </span>
    </button>
  </div>
  <div>
    <div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false" style=""><p>First Panel</p></div>
    <div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;"><p>Second Panel</p></div>
    <div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;"><p>Third Panel</p></div>
  </div>
</div>
'
vueCode='
<dt-tab-group :inverted="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second
    </dt-tab>
    <dt-tab id="5`" panel-id="6">
      Third
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second Panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third Panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

## Vue API

### Tab Group

<component-vue-api component-name="tabgroup" />

### Tab Panel

<component-vue-api component-name="tabpanel" />

### Tab

<component-vue-api component-name="tab" />

## Classes

<component-class-table component-name="tabs" />

## Accessibility

To create accessible tabs, be sure to implement the <a class="d-link" href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-2/tabs.html" target="_blank">proper keyboard navigation</a> and utilize the following ARIA roles to properly declare element roles, content relationships, and current status:

<component-accessible-table component-name="tabs" />

<script setup>
  import ExampleTabs from "@exampleComponents/ExampleTabs.vue";
</script>
