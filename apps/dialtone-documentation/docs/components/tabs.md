---
title: Tabs
status: ready
thumb: true
description: Tabs allow users to navigation between grouped content in different views while within the same page context.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tabs--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2129-4760
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
<div class="d-tablist" role="tablist" aria-label="Label Example Group">
  <button id="dt-tab-1" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">First tab</button>
  <button id="dt-tab-3" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">Second tab</button>
  <button id="dt-tab-5" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">Third tab</button>
</div>
<div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false">
  <p>First tab content panel</p>
</div>
<div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;">
  <p>Second tab content panel</p>
</div>
<div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;">
  <p>Third tab content panel</p>
</div>
'
vueCode='
<dt-tab-group label="Label Example Group">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First tab
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second tab
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      Third tab
    </dt-tab>
  </template>
  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third tab content panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

### Borderless

Add a `d-tablist--no-border` to remove the bottom border of any tablist. Handy for small tablists and tablists serving as subtabs to a larger menu.

<code-well-header>
  <example-tabs borderless />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist d-tablist--no-border" role="tablist" aria-label="Label Example Group">
  <button id="dt-tab-1" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">First tab</button>
  <button id="dt-tab-3" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">Second tab</button>
  <button id="dt-tab-5" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">Third tab</button>
</div>
<div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false">
  <p>First tab content panel</p>
</div>
<div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;">
  <p>Second tab content panel</p>
</div>
<div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;">
  <p>Third tab content panel</p>
</div>
'
vueCode='
<dt-tab-group label="Label Example Group" :borderless="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First tab
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second tab
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      Third tab
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third tab content panel</p>
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
<div class="d-tablist d-tablist--inverted" role="tablist" aria-label="Label Example Group">
  <button id="dt-tab-1" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">First tab</button>
  <button id="dt-tab-3" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">Second tab</button>
  <button id="dt-tab-5" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">Third tab</button>
</div>
<div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false">
  <p>First tab content panel</p>
</div>
<div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;">
  <p>Second tab content panel</p>
</div>
<div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;">
  <p>Third tab content panel</p>
</div>
'
vueCode='
<dt-tab-group label="Label Example Group" :inverted="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First tab
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second tab
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      Third tab
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third tab content panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

### Disabled

<code-well-header>
  <example-tabs disabled />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist" role="tablist" aria-label="Label Example Group">
  <button id="dt-tab-1" class="d-tab d-tab--selected" role="tab" disabled aria-selected="true" aria-controls="dt-panel-2" tabindex="0">First tab</button>
  <button id="dt-tab-3" class="d-tab" role="tab" disabled aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">Second tab</button>
  <button id="dt-tab-5" class="d-tab" role="tab" disabled aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">Third tab</button>
</div>
<div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false">
  <p>First tab content panel</p>
</div>
<div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;">
  <p>Second tab content panel</p>
</div>
<div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;">
  <p>Third tab content panel</p>
</div>
'
vueCode='
<dt-tab-group label="Label Example Group" :disabled="true">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First tab
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second tab
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      Third tab
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third tab content panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
/>

## Sizes

### Default

<code-well-header>
  <example-tabs />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist" role="tablist" aria-label="Label Example Group">
  <button id="dt-tab-1" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">First tab</button>
  <button id="dt-tab-3" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">Second tab</button>
  <button id="dt-tab-5" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">Third tab</button>
</div>
<div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false">
  <p>First tab content panel</p>
</div>
<div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;">
  <p>Second tab content panel</p>
</div>
<div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;">
  <p>Third tab content panel</p>
</div>
'
vueCode='
<dt-tab-group label="Label Example Group">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First tab
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second tab
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      Third tab
    </dt-tab>
  </template>
  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third tab content panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

### Small

<code-well-header>
  <example-tabs size="sm" />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist d-tablist--sm" role="tablist" aria-label="Label Example Group">
  <button id="dt-tab-1" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">First tab</button>
  <button id="dt-tab-3" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">Second tab</button>
  <button id="dt-tab-5" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">Third tab</button>
</div>
<div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false">
  <p>First tab content panel</p>
</div>
<div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;">
  <p>Second tab content panel</p>
</div>
<div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;">
  <p>Third tab content panel</p>
</div>
'
vueCode='
<dt-tab-group label="Label Example Group" size="sm">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First tab
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second tab
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      Third tab
    </dt-tab>
  </template>

  <div>
    <dt-tab-panel id="2" tab-id="1">
      <p>First tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <p>Second tab content panel</p>
    </dt-tab-panel>
    <dt-tab-panel id="6" tab-id="5">
      <p>Third tab content panel</p>
    </dt-tab-panel>
  </div>
</dt-tab-group>
'
showHtmlWarning />

## Advanced Usages

### Validation Before Changing Tabs

If you need to do some validation before changing tabs, you can use the `before-change` event. If the event handler is prevented, the tab change will be cancelled.

<code-well-header>
  <example-tabs validate />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-tablist" role="tablist" aria-label="Label Example Group">
  <button id="dt-tab-1" class="d-tab d-tab--selected" role="tab" aria-selected="true" aria-controls="dt-panel-2" tabindex="0">First tab</button>
  <button id="dt-tab-3" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-4" tabindex="-1">Second tab</button>
  <button id="dt-tab-5" class="d-tab" role="tab" aria-selected="false" aria-controls="dt-panel-6" tabindex="-1">Third tab</button>
</div>
<div id="dt-panel-2" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-1" aria-hidden="false">
  <p>First tab content panel</p>
</div>
<div id="dt-panel-4" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-3" aria-hidden="true" style="display: none;">
  <p>Second tab content panel</p>
</div>
<div id="dt-panel-6" role="tabpanel" tabindex="0" aria-labelledby="dt-tab-5" aria-hidden="true" style="display: none;">
  <p>Third tab content panel</p>
</div>
'
vueCode='
<dt-tab-group
  label="Label Example Group"
  @before-change="confirmBeforeLeave"
>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      First tab
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Second tab
    </dt-tab>
    <dt-tab id="5" panel-id="6">
      Third tab
    </dt-tab>
  </template>
  <template #default>
    <div>
      <dt-tab-panel id="2" tab-id="1">
        <p>First tab content panel</p>
      </dt-tab-panel>
      <dt-tab-panel id="4" tab-id="3">
        <p>Second tab content panel</p>
      </dt-tab-panel>
      <dt-tab-panel id="6" tab-id="5">
        <p>Third tab content panel</p>
      </dt-tab-panel>
    </div>
  </template>
</dt-tab-group>
<script setup>
  function confirmBeforeLeave (event) {
    const confirmed = confirm("Are you sure to change tab?");
    if (!confirmed) {
      event.preventDefault();
    }
  }
</script>
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
