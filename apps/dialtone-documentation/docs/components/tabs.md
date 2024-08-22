---
title: Tabs
status: ready
thumb: true
description: Tabs allow users to navigation between grouped content in different views while within the same page context.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tabs--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21321&viewport=306%2C-547%2C1.01&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <example-tabs />
</code-well-header>

## Variants

### Default

<code-well-header>
  <example-tabs />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist" role="tablist" aria-label="Label Example Group" tabindex="0">
  <button id="base-tab-0" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="base-panel-0" tabindex="0">First tab </button>
  <button id="base-tab-1" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-1" tabindex="-1">Second tab </button>
  <button id="base-tab-2" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-2" tabindex="-1">Third tab </button>
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

### Borderless

Add a `d-tablist--no-border` to remove the bottom border of any tablist. Handy for small tablists and tablists serving as subtabs to a larger menu.

<code-well-header>
  <example-tabs hide-content borderless />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist d-tablist--no-border" role="tablist" aria-label="Label Example Group" tabindex="0">
  <button id="base-tab-0" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="base-panel-0" tabindex="0">First tab </button>
  <button id="base-tab-1" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-1" tabindex="-1">Second tab </button>
  <button id="base-tab-2" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-2" tabindex="-1">Third tab </button>
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
<div class="d-tablist d-tablist--inverted" role="tablist" aria-label="Label Example Group" tabindex="0">
  <button id="base-tab-0" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="base-panel-0" tabindex="0">First tab </button>
  <button id="base-tab-1" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-1" tabindex="-1">Second tab </button>
  <button id="base-tab-2" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-2" tabindex="-1">Third tab </button>
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

## Sizes

### Default

<code-well-header>
  <example-tabs />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist" role="tablist" aria-label="Label Example Group" tabindex="0">
  <button id="base-tab-0" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="base-panel-0" tabindex="0">First tab </button>
  <button id="base-tab-1" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-1" tabindex="-1">Second tab </button>
  <button id="base-tab-2" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-2" tabindex="-1">Third tab </button>
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

### Small

<code-well-header>
  <example-tabs hide-content size="small" />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist d-tablist--sm" role="tablist" aria-label="Label Example Group" tabindex="0">
  <button id="base-tab-0" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="base-panel-0" tabindex="0">First tab </button>
  <button id="base-tab-1" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-1" tabindex="-1">Second tab </button>
  <button id="base-tab-2" class="d-tab" role="tab" aria-selected="false" aria-controls="base-panel-2" tabindex="-1">Third tab </button>
</div>'
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
