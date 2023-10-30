---
title: Tabs
status: ready
thumb: true
description: Tabs allow users to navigation between grouped content in different views while within the same page context.
storybook: https://vue.dialpad.design/?path=/story/components-tabs--default
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

```html
<div class="d-tablist js-tablist" role="tablist" aria-label="Label Example Group">
  <button class="d-tab d-tab--selected js-tab" role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" tabindex="0">First tab</button>
  <button class="d-tab js-tab" role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="-1">Second tab</button>
  <button class="d-tab js-tab" role="tab" aria-selected="false" aria-controls="panel-3" id="tab-3" tabindex="-1">Third tab</button>
</div>
<div id="panel-1" class="js-tab-panel" role="tabpanel" tabindex="0" aria-labelledby="tab-1">
  <p>First tab content panel</p>
</div>
<div id="panel-2" class="js-tab-panel" role="tabpanel" tabindex="0" aria-labelledby="tab-2" hidden>
  <p>Second tab content panel</p>
</div>
<div id="panel-3" class="js-tab-panel" role="tabpanel" tabindex="0" aria-labelledby="tab-3" hidden>
  <p>Third tab content panel</p>
</div>
```

### Sizes

<code-well-header bgclass="d-bgc-primary">
  <example-tabs hide-content />
  <example-tabs hide-content size="small" />
</code-well-header>

```html
<div class="d-tablist">…</div>
<div class="d-tablist d-tablist--sm">…</div>
```

### Borderless

Add a `d-tablist--no-border` to remove the bottom border of any tablist. Handy for small tablists and tablists serving as subtabs to a larger menu.

<code-well-header bgclass="d-bgc-primary">
  <example-tabs hide-content borderless />
  <example-tabs hide-content size="small" borderless />
</code-well-header>

```html
<div class="d-tablist d-tablist--no-border">…</div>
<div class="d-tablist d-tablist--sm d-tablist--no-border">…</div>
```

### Inverted

Add `d-tablist--inverted` when you want to display tabs on a darker background.

<code-well-header bgclass="d-bgc-contrast">
  <example-tabs inverted />
</code-well-header>

```html
<div class="d-tablist d-tablist--inverted">…</div>
```

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
