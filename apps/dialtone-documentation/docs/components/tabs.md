---
title: Tabs
status: ready
thumb: true
description: Tabs allow users to navigation between grouped content in different views while within the same page context.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-tabs--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2129-4760
keywords: ["tab panel", "tab navigation", "d-tabs", "DtTabs", "dt-tabs", "segmented control", "tabbar"]
---

<code-well-header>
  <div class="d-w100p">
    <example-tabs />
  </div>
</code-well-header>

## Variants

### Default

<code-well-header>
  <div class="d-w100p">
    <example-tabs ref="defaultTabsExample" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.defaultTabsExample'
vueCode='
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Borderless

Add a `d-tablist--no-border` to remove the bottom border of any tablist. Handy for small tablists and tablists serving as subtabs to a larger menu.

<code-well-header>
  <div class="d-w100p">
    <example-tabs ref="borderlessTabsExample" borderless />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.borderlessTabsExample'
vueCode='
<dt-tab-group borderless>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Disabled

Add `disabled` to a specific tab.

<code-well-header>
<dt-tab-group>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
    <dt-tab id="5" panel-id="6" disabled>Fourth</dt-tab>
  </template>
</dt-tab-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledTabsExample'
vueCode='
<dt-tab-group disabled>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

Add `disabled` to the tab group to disable all.

<code-well-header>
  <example-tabs ref="disabledTabsExample" disabled />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledTabsExample'
vueCode='
<dt-tab-group disabled>
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
  </template>
</dt-tab-group>
'
showHtmlWarning />

### Inverted

<dt-notice title="Deprecated" kind="error" class="d-wmx100p d-my16">
  The <code>inverted</code> prop has been deprecated in favor of using <router-link to="mode-island.html"><DtLink>DtModeIsland</DtLink></router-link> as a wrapper.
</dt-notice>

In place of the <code>inverted</code> prop, use the <router-link to="mode-island.html"><DtLink>DtModeIsland</DtLink></router-link> component as a wrapper.

<code-well-header>
  <dt-mode-island class="d-p16 d-bar8">
    <example-tabs ref="invertedTabsExample" />
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.invertedTabsExample'
vueCode='
<dt-mode-island>
  <dt-tab-group>
    <template #tabs>
      <dt-tab id="1" panel-id="2" selected>First</dt-tab>
      <dt-tab id="3" panel-id="4">Second</dt-tab>
    </template>
  </dt-tab-group>
</dt-mode-island>
'
showHtmlWarning />

## Sizes

<code-example-tabs
vueCode='
<dt-tab-group size="{{ size }}">
  ...
</dt-tab-group>
'
showHtmlWarning />

## Advanced Usages

### Validation Before Changing Tabs

If you need to do some validation before changing tabs, you can use the `before-change` event. If the event handler is prevented, the tab change will be cancelled.

<code-well-header>
  <example-tabs ref="validateTabsExample" validate />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.validateTabsExample'
vueCode='
<dt-tab-group @before-change="confirmBeforeLeave">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>First</dt-tab>
    <dt-tab id="3" panel-id="4">Second</dt-tab>
    <dt-tab id="5" panel-id="6">Third</dt-tab>
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

<component-vue-api component-name="tabgroup" :also-import="['tab', 'tabpanel']" />

### Tab Panel

<component-vue-api component-name="tabpanel" :show-import="false" />

### Tab

<component-vue-api component-name="tab" :show-import="false" />

## Classes

<component-class-table component-name="tabs" />

## Accessibility

To create accessible tabs, be sure to implement the <a class="d-link" href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-2/tabs.html" target="_blank">proper keyboard navigation</a> and utilize the following ARIA roles to properly declare element roles, content relationships, and current status:

<component-accessible-table component-name="tabs" />

<script setup>
  import ExampleTabs from "@exampleComponents/ExampleTabs.vue";
</script>
