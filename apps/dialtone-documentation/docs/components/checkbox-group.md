---
title: Checkbox Group
description: Checkbox groups are convenient components for a grouping of related Checkboxes.
status: ready
thumb: true
image: assets/images/components/checkbox-group.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-checkbox-group--default
keywords: ["checkboxes","multi select","form fields","d-checkbox-group","DtCheckboxGroup","dt-checkbox-group"]
---

<component-combinator component-name="DtCheckboxGroup" />

Checkbox Groups are typically paired with a legend which identifies the group. If no legend is provided then it is expected that an `aria-label` will be given in order to provide an invisible label to screen readers. Each Checkbox Group should contain one or more Checkboxes which users can make selections from.

## Variants

### Default

<code-example>
  <dt-checkbox-group
    name="fruits-checkbox-group"
    legend="Fruits"
    :selectedValues="[]"
  >
    <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
    <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
    <dt-checkbox value="other"><span>Other</span></dt-checkbox>
  </dt-checkbox-group>
</code-example>

### With Selected Values

<code-example>
  <dt-checkbox-group
    name="my-group-name"
    legend="My Legend"
    :selected-values="['option1']"
  >
    <dt-checkbox
      value="option1"
      label="Option 1"
    />
    <dt-checkbox
      value="option2"
      label="Option 2"
    />
  </dt-checkbox-group>
</code-example>

### Disabled

<code-example>
  <dt-checkbox-group
    name="my-group-name"
    legend="My Legend"
    disabled
  >
    <dt-checkbox
      value="option1"
      label="Option 1"
    />
    <dt-checkbox
      value="option2"
      label="Option 2"
    />
  </dt-checkbox-group>
</code-example>

### With Validation States

<code-example vueCode='
<dt-checkbox-group
  name="fruits-checkbox-group"
  legend="Fruits"
  validation-state="success"
  :messages="[{ message: `Success validation message.`, type: `success` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
<dt-checkbox-group
  name="fruits-checkbox-group"
  legend="Fruits"
  validation-state="warning"
  :messages="[{ message: `Warning validation message.`, type: `warning` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
<dt-checkbox-group
  name="fruits-checkbox-group"
  legend="Fruits"
  validation-state="error"
  :messages="[{ message: `Error validation message.`, type: `error` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
'>
  <dt-stack gap="200">
    <div>
      <dt-checkbox-group
        name="checkbox-group-with-success-message"
        legend="Fruits"
        :messages='[{"message":"Success validation message","type":"success"}]'
      >
        <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
        <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
        <dt-checkbox value="other"><span>Other</span></dt-checkbox>
      </dt-checkbox-group>
    </div>
    <div>
      <dt-checkbox-group
        name="checkbox-group-with-warning-message"
        legend="Fruits"
        :messages='[{"message":"Warning validation message","type":"warning"}]'
      >
        <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
        <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
        <dt-checkbox value="other"><span>Other</span></dt-checkbox>
      </dt-checkbox-group>
    </div>
    <div>
      <dt-checkbox-group
        name="checkbox-group-with-error-message"
        legend="Fruits"
        :messages='[{"message":"Error validation message","type":"error"}]'
      >
        <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
        <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
        <dt-checkbox value="other"><span>Other</span></dt-checkbox>
      </dt-checkbox-group>
    </div>
  </dt-stack>
</code-example>

### With Validation Messages Hidden

<code-example>
  <dt-checkbox-group
    name="my-group-name"
    legend="My Legend"
    :messages="[{ message: 'My Success Message', type: `success` }]"
    :show-messages="false"
  >
    <dt-checkbox
      value="option1"
      label="Option 1"
    />
    <dt-checkbox
      value="option2"
      label="Option 2"
    />
  </dt-checkbox-group>
</code-example>

## Vue API

<component-vue-api component-name="checkboxgroup" />
