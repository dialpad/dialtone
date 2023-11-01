---
title: Toggle
status: ready
thumb: true
image: assets/images/components/toggle.png
description: A toggle, or "switch", is a button control element that allows the user to make a binary selection.
storybook: https://vue.dialpad.design/?path=/story/components-toggle--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21460&viewport=-359%2C250%2C0.49&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <div class="d-toggle-group d-d-flex d-ai-center">
    <example-toggle label="Label" id="Dialtone-Toggle-Preview"/>
  </div>
</code-well-header>

<!-- <component-combinator component-name="DtToggle" /> -->

## Usage

The Toggle component acts as a way to allow the User to switch between two mutually exclusive options. While it technically mirrors a [Checkbox](checkbox.md) state, its effect on the system is immediate&mdash;much like a light switch immediately turns on or off the lights. In contrast, the checked state of a [Checkbox](checkbox.md) won't be applied until a separate action to confirm the selection is taken.

<dialtone-usage>
<template #do>

- When its action has an instantaneous effect.
</template>
<template #dont>

- When its action does not have an immediate effect on the application.
- Selecting between 2 options. Instead, utilize a [Checkbox](checkbox.md).
- As an alternative to a [Checkbox](checkbox.md) or [Radio](radio.md) within a Form.
</template>
</dialtone-usage>

### Best practices

- A Toggle component should be used as a control within an application and provide a way to toggle between two states like a household light switch.
- An `indeterminate` Toggle convey a "mixed" state that neither qualifies as toggled or not toggled. An example use case is when a Toggle acts as a "parent" of a collection of child Toggle components:
  - Toggled: all children are toggled.
  - Not toggled: all children are not toggled.
  - `indeterminate`: children are a mix of toggled and not toggled.

## Variants and examples

### Base Styles

<code-well-header>
  <fieldset class="d-stack8">
    <div class="d-toggle-group d-d-flex d-ai-center">
      <example-toggle label="Unchecked Toggle" id="Dialtone-Toggle1"/>
    </div>
    <div class="d-toggle-group d-d-flex d-ai-center">
      <example-toggle label="Checked Toggle" checked id="Dialtone-Toggle2"/>
    </div>
    <div class="d-toggle-group d-d-flex d-ai-center">
      <example-toggle label="Unchecked Disabled" disabled id="Dialtone-Toggle3"/>
    </div>
    <div class="d-toggle-group d-d-flex d-ai-center">
      <example-toggle label="Checked Disabled" checked disabled id="Dialtone-Toggle4"/>
    </div>
    <div class="d-toggle-group d-d-flex d-ai-center">
      <example-toggle label="Indeterminate Toggle" indeterminate id="Dialtone-Toggle5"/>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-stack8">
  <div class="d-toggle-group d-d-flex d-ai-center">
    <div class="d-toggle-copy">
      <label class="d-toggle-label" for="Dialtone-Toggle1">Unchecked Toggle</label>
    </div>
    <div class="d-toggle-button">
      <button class="d-toggle" type="button" role="switch" id="Dialtone-Toggle1" >
        <span class="d-toggle__inner" />
      </button>
    </div>
  </div>
  <div class="d-toggle-group d-d-flex d-ai-center">
    <div class="d-toggle-copy">
      <label class="d-toggle-label" for="Dialtone-Toggle2">Checked Toggle</label>
    </div>
    <div class="d-toggle-button">
      <button class="d-toggle d-toggle--checked" type="button" role="switch" id="Dialtone-Toggle2" >
        <span class="d-toggle__inner" />
      </button>
    </div>
  </div>
  <div class="d-toggle-group d-d-flex d-ai-center">
    <div class="d-toggle-copy">
      <label class="d-toggle-label" for="Dialtone-Toggle3">Unchecked Disabled</label>
    </div>
    <div class="d-toggle-button">
      <button class="d-toggle" type="button" role="switch" disabled id="Dialtone-Toggle3" >
        <span class="d-toggle__inner" />
      </button>
    </div>
  </div>
  <div class="d-toggle-group d-d-flex d-ai-center">
    <div class="d-toggle-copy">
      <label class="d-toggle-label" for="Dialtone-Toggle4">Checked Disabled</label>
    </div>
    <div class="d-toggle-button">
      <button class="d-toggle d-toggle--checked" type="button" role="switch" disabled id="Dialtone-Toggle4" >
        <span class="d-toggle__inner" />
      </button>
    </div>
  </div>
  <div class="d-toggle-group d-d-flex d-ai-center">
    <div class="d-toggle-copy">
      <label class="d-toggle-label" for="Dialtone-Toggle5">Indeterminate Toggle</label>
    </div>
    <div class="d-toggle-button">
      <button class="d-toggle d-toggle--indeterminate" type="button" role="checkbox" aria-checked="mixed" id="Dialtone-Toggle5">
        <span class="d-toggle__inner" />
      </button>
    </div>
  </div>
</fieldset>
```

### Sizes

<code-well-header>
  <fieldset class="d-stack8">
    <div class="d-toggle-group d-d-flex d-ai-center">
      <example-toggle label="Small size" size="small" id="Dialtone-Toggle6"/>
    </div>
    <div class="d-toggle-group d-d-flex d-ai-center">
      <example-toggle label="Default size" id="Dialtone-Toggle7"/>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-stack8">
  <div class="d-toggle-group d-d-flex d-ai-center">
    <div class="d-toggle-copy">
      <label class="d-toggle-label" for="Dialtone-Toggle6">Small size</label>
    </div>
    <div class="d-toggle-button">
      <button class="d-toggle d-toggle--small" type="button" role="switch" id="Dialtone-Toggle6" >
        <span class="d-toggle__inner" />
      </button>
    </div>
  </div>
  <div class="d-toggle-group d-d-flex d-ai-center">
    <div class="d-toggle-copy">
      <label class="d-toggle-label" for="Dialtone-Toggle7">Default size</label>
    </div>
    <div class="d-toggle-button">
      <button class="d-toggle" type="button" role="switch" id="Dialtone-Toggle7" >
        <span class="d-toggle__inner" />
      </button>
    </div>
  </div>
</fieldset>
```

### Example: Stacked Group

<code-well-header>
  <fieldset class="d-w25p d-stack8">
    <legend class="d-headline-large">DND Settings</legend>
    <div class="d-toggle-wrapper d-d-flex d-fd-column d-stack8">
      <div class="row d-d-flex d-ai-center d-jc-space-between">
        <div class="d-headline-medium">Status</div>
        <div class="d-headline-medium">DND</div>
      </div>
      <div class="row d-d-flex d-ai-center d-jc-space-between">
        <example-toggle label="Acorn Test" id="Dialtone-Toggle8" />
      </div>
      <div class="row d-d-flex d-ai-center d-jc-space-between">
        <example-toggle label="California Zoo" id="Dialtone-Toggle9" />
      </div>
      <div class="row d-d-flex d-ai-center d-jc-space-between">
        <example-toggle label="Montana Centre" id="Dialtone-Toggle10" />
      </div>
      <div class="row d-d-flex d-ai-center d-jc-space-between">
        <example-toggle label="Wilson Centre" id="Dialtone-Toggle11" />
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-w25p d-stack8">
  <legend class="d-headline-large">DND Settings</legend>
  <div class="d-toggle-wrapper d-d-flex d-fd-column d-stack8">
    <div class="row d-d-flex d-ai-center d-jc-space-between">
      <div class="d-headline-medium">Status</div>
      <div class="d-headline-medium">DND</div>
    </div>
    <div class="row d-d-flex d-ai-center d-jc-space-between">
      <div class="d-toggle-copy"><label class="d-toggle-label" for="Dialtone-Toggle8">Acorn Test</label></div>
      <div class="d-toggle-button"><button id="Dialtone-Toggle8" class="d-toggle d-toggle--checked" aria-checked="true" type="button" role="switch"><span class="d-toggle__inner"></span></button></div>
    </div>
    <div class="row d-d-flex d-ai-center d-jc-space-between">
      <div class="d-toggle-copy"><label class="d-toggle-label" for="Dialtone-Toggle9">California Zoo</label></div>
      <div class="d-toggle-button"><button id="Dialtone-Toggle9" class="d-toggle" aria-checked="false" type="button" role="switch"><span class="d-toggle__inner"></span></button></div>
    </div>
    <div class="row d-d-flex d-ai-center d-jc-space-between">
      <div class="d-toggle-copy"><label class="d-toggle-label" for="Dialtone-Toggle10">Montana Centre</label></div>
      <div class="d-toggle-button"><button id="Dialtone-Toggle10" class="d-toggle" aria-checked="false" type="button" role="switch"><span class="d-toggle__inner"></span></button></div>
    </div>
    <div class="row d-d-flex d-ai-center d-jc-space-between">
      <div class="d-toggle-copy"><label class="d-toggle-label" for="Dialtone-Toggle11">Wilson Centre</label></div>
      <div class="d-toggle-button"><button id="Dialtone-Toggle11" class="d-toggle" aria-checked="false" type="button" role="switch"><span class="d-toggle__inner"></span></button></div>
    </div>
  </div>
</fieldset>
```

## Vue API

<component-vue-api component-name="toggle" />

## Classes

<component-class-table component-name="toggle" />

## Accessibility

The best accessibility is semantic HTML. Most screen readers understand how to parse buttons if they’re correctly formatted. When it comes to toggles, there are a few things to keep in mind:

- All toggle buttons should have an `id` attribute.
- Associate toggle labels with their buttons using the `for` attribute. This correlates with the toggle's `id`.
- If you have a group of related toggles, use a `fieldset` to group them and a `legend` to title the group. For further information, please visit Gov.UK’s article, ["Using the fieldset and legend elements"](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements).

<script setup>
  import ExampleToggle from '@exampleComponents/ExampleToggle.vue';
  import DialtoneUsage from '@baseComponents/DialtoneUsage.vue';
</script>
