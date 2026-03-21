---
title: Button Group
description: Used for grouping buttons that share a relationship or perform similar actions.
thumb: true
image: assets/images/components/button-group.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-button-group--default
keywords: ["button set", "btn group", "action group", "d-btn-group", "DtButtonGroup", "dt-button-group", "toolbar", "segmented button"]
---

<!-- <code-well-header class="d-d-block">
  <dt-button-group alignment="start">
    <dt-button importance="primary">Confirm</dt-button>
    <dt-button importance="outlined">Cancel</dt-button>
  </dt-button-group>
</code-well-header> -->

<component-combinator component-name="DtButtonGroup" />

## Variants

The alignment and the order of buttons within it can be customized to suit the specific use case.

### Start

When aligned to `start`, the `primary` button is on the **left** side of the group.
<code-well-header class="d-d-block">
  <dt-button-group ref="startExample" alignment="start">
    <dt-button importance="primary">Confirm</dt-button>
    <dt-button importance="outlined">Cancel</dt-button>
  </dt-button-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.startExample'
vueCode='
<dt-button-group>
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
'
showHtmlWarning />

### End

When aligned to `end`, the `primary` button is on the **right** side of the group.
<code-well-header class="d-d-block">
  <dt-button-group ref="endExample" alignment="end">
    <dt-button importance="outlined">Cancel</dt-button>
    <dt-button importance="primary">Confirm</dt-button>
  </dt-button-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.endExample'
vueCode='
<dt-button-group alignment="end">
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
'
showHtmlWarning />

### Space-Between

When set to `space-between`, the elements are evenly distributed within the row, creating a directional flow where the `primary` button is either on the **left** (regressive) or on the **right** (progressive).
<code-well-header class="d-d-block">
  <dt-button-group ref="spaceBetweenExample" alignment="space-between">
    <dt-button importance="outlined">Previous</dt-button>
    <dt-button importance="primary">Next</dt-button>
  </dt-button-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.spaceBetweenExample'
vueCode='
<dt-button-group alignment="space-between">
  <dt-button importance="outlined">Previous</dt-button>
  <dt-button importance="primary">Next</dt-button>
</dt-button-group>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="buttongroup" />
