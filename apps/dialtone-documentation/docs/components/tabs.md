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
  <example-tabs ref="defaultExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.defaultExample"
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
  <example-tabs borderless ref="borderlessExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.borderlessExample"
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
  <example-tabs inverted ref="invertedExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.invertedExample"
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
  <example-tabs disabled ref="disabledExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.disabledExample"
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
  <example-tabs ref="defaultSizeExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.defaultSizeExample"
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
  <example-tabs size="sm" ref="smallExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.smallExample"
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
  <example-tabs validate ref="validationExample" />
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.validationExample"
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
