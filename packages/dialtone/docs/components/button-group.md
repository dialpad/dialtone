---
title: Button group
description: Used for grouping buttons that share a relationship or perform similar actions.
thumb: true
image: assets/images/components/button-group.png
storybook: https://vue.dialpad.design/?path=/story/components-button-group--default
---

<code-well-header class="d-d-block">
  <dt-button-group alignment="start" class="d-gg8">
    <dt-button importance="primary">Confirm</dt-button>
    <dt-button importance="outlined">Cancel</dt-button>
  </dt-button-group>
</code-well-header>

```html
<dt-button-group alignment="start" class="d-gg8">
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
```

## Variants

The alignment and the order of buttons within it can be customized to suit the specific use case.

### Start

When aligned to `start`, the `primary` button is on the **left** side of the group.
<code-well-header class="d-d-block">
  <dt-button-group alignment="start" class="d-gg8">
    <dt-button importance="primary">Confirm</dt-button>
    <dt-button importance="outlined">Cancel</dt-button>
  </dt-button-group>
</code-well-header>

```html
<dt-button-group alignment="start" class="d-gg8">
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
```

### End

When aligned to `end`, the `primary` button is on the **right** side of the group.
<code-well-header class="d-d-block">
  <dt-button-group alignment="end" class="d-gg8">
    <dt-button importance="outlined">Cancel</dt-button>
    <dt-button importance="primary">Confirm</dt-button>
  </dt-button-group>
</code-well-header>

```html
<dt-button-group alignment="end" class="d-gg8">
  <dt-button importance="outlined">Cancel</dt-button>
  <dt-button importance="primary">Confirm</dt-button>
</dt-button-group>
```

### Space-between

When set to `space-between`, the elements are evenly distributed within the row, creating a directional flow where the `primary` button is either on the **left** (regressive) or on the **right** (progressive).
<code-well-header class="d-d-block">
  <dt-button-group alignment="space-between" class="d-gg8">
    <dt-button importance="primary">Confirm</dt-button>
    <dt-button importance="outlined">Cancel</dt-button>
  </dt-button-group>
</code-well-header>

```html
<dt-button-group alignment="space-between" class="d-gg8">
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
```

## Vue API

<component-vue-api component-name="buttongroup" />
