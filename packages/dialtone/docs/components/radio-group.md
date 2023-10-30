---
title: Radio group
description: Radio groups are control elements that allow the user to make a single selection from a list of options.
status: ready
thumb: true
image: assets/images/components/radio-group.png
storybook: https://vue.dialpad.design/?path=/story/components-radio-group--default
---

<code-well-header>
  <dt-radio-group
    value=""
    class="d-input-group__fieldset"
    name="fruits-radio-group-00"
    legend="Fruits"
  >
    <dt-radio value="apple"><span >Apple</span></dt-radio>
    <dt-radio value="banana"><span >Banana</span></dt-radio>
    <dt-radio value="other"><span >Other</span></dt-radio>
  </dt-radio-group>
</code-well-header>

## Variants

### Default

<code-well-header>
  <dt-radio-group
    value=""
    name="fruits-radio-group-01"
    class="d-input-group__fieldset"
    legend="Fruits"
  >
    <dt-radio value="apple"><span >Apple</span></dt-radio>
    <dt-radio value="banana"><span >Banana</span></dt-radio>
    <dt-radio value="other"><span >Other</span></dt-radio>
  </dt-radio-group>
</code-well-header>

```html
<dt-radio-group
    value=""
    name="fruits-radio-group-01"
    class="d-input-group__fieldset"
    legend="Fruits"
  >
    <dt-radio value="apple"><span >Apple</span></dt-radio>
    <dt-radio value="banana"><span >Banana</span></dt-radio>
    <dt-radio value="other"><span >Other</span></dt-radio>
  </dt-radio-group>
```

### With validation states

<code-well-header>
  <div class="d-stack16">
    <div>
      <dt-radio-group
        name="radio-group-with-success-message"
        legend="With Success Message"
        class="d-input-group__fieldset"
        :messages='[{"message":"Success validation message","type":"success"}]'
      >
        <dt-radio value="apple"><span >Apple</span></dt-radio>
        <dt-radio value="banana"><span >Banana</span></dt-radio>
        <dt-radio value="other"><span >Other</span></dt-radio>
      </dt-radio-group>
    </div>
    <div>
      <dt-radio-group
        name="radio-group-with-warning-message"
        legend="With Warning Message"
        class="d-input-group__fieldset"
        :messages='[{"message":"Warning validation message","type":"warning"}]'
      >
        <dt-radio value="apple"><span >Apple</span></dt-radio>
        <dt-radio value="banana"><span >Banana</span></dt-radio>
        <dt-radio value="other"><span >Other</span></dt-radio>
      </dt-radio-group>
    </div>
    <div>
      <dt-radio-group
        name="radio-group-with-error-message"
        legend="With Error Message"
        class="d-input-group__fieldset"
        :messages='[{"message":"Error validation message","type":"error"}]'
      >
        <dt-radio value="apple"><span >Apple</span></dt-radio>
        <dt-radio value="banana"><span >Banana</span></dt-radio>
        <dt-radio value="other"><span >Other</span></dt-radio>
      </dt-radio-group>
    </div>
  </div>
</code-well-header>

## Vue API

<component-vue-api component-name="radiogroup" />
