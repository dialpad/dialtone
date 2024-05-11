---
title: Radio group
description: Radio groups are control elements that allow the user to make a single selection from a list of options.
status: ready
thumb: true
image: assets/images/components/radio-group.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-radio-group--default
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

<code-example-tabs
htmlCode='
<fieldset class="d-input-group__fieldset">
  <legend class="d-label">Fruits</legend>
  <div>
    <div>
      <label>
        <div class="d-radio-group">
          <div class="d-radio__input"><input name="radio-group-with-legend" type="radio" class="d-radio" value="apple" /></div>
          <div class="d-radio__copy d-radio__label">
            <div class=""><span>Apple</span></div>
          </div>
        </div>
      </label>
    </div>
    <div>
      <label>
        <div class="d-radio-group">
          <div class="d-radio__input"><input name="radio-group-with-legend" type="radio" class="d-radio" value="banana" /></div>
          <div class="d-radio__copy d-radio__label">
            <div class=""><span>Banana</span></div>
          </div>
        </div>
      </label>
    </div>
    <div>
      <label>
        <div class="d-radio-group">
          <div class="d-radio__input"><input name="radio-group-with-legend" type="radio" class="d-radio" value="other" /></div>
          <div class="d-radio__copy d-radio__label">
            <div class=""><span>Other</span></div>
          </div>
        </div>
      </label>
    </div>
  </div>
</fieldset>
'
vueCode='
<dt-radio-group
  value=""
  name="fruits-radio-group-01"
  legend="Fruits"
>
  <dt-radio value="apple"><span >Apple</span></dt-radio>
  <dt-radio value="banana"><span >Banana</span></dt-radio>
  <dt-radio value="other"><span >Other</span></dt-radio>
</dt-radio-group>
'
showHtmlWarning />

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

<code-example-tabs
htmlCode='
<div class="d-stack16">
  <div>
    <fieldset class="d-input-group__fieldset d-input-group__fieldset">
      <legend class="d-label">With Success Message</legend>
      <dt-radio value="apple"><span>Apple</span></dt-radio><dt-radio value="banana"><span>Banana</span></dt-radio><dt-radio value="other"><span>Other</span></dt-radio>
      <div class="base-input__messages d-validation-message__container">
        <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--success d-validation-message--success"><p>Success validation message</p></div>
      </div>
    </fieldset>
  </div>
  <div>
    <fieldset class="d-input-group__fieldset d-input-group__fieldset">
      <legend class="d-label">With Warning Message</legend>
      <dt-radio value="apple"><span>Apple</span></dt-radio><dt-radio value="banana"><span>Banana</span></dt-radio><dt-radio value="other"><span>Other</span></dt-radio>
      <div class="base-input__messages d-validation-message__container">
        <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--warning d-validation-message--warning"><p>Warning validation message</p></div>
      </div>
    </fieldset>
  </div>
  <div>
    <fieldset class="d-input-group__fieldset d-input-group__fieldset">
      <legend class="d-label">With Error Message</legend>
      <dt-radio value="apple"><span>Apple</span></dt-radio><dt-radio value="banana"><span>Banana</span></dt-radio><dt-radio value="other"><span>Other</span></dt-radio>
      <div class="base-input__messages d-validation-message__container">
        <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--error d-validation-message--error"><p>Error validation message</p></div>
      </div>
    </fieldset>
  </div>
</div>
'
vueCode='
<div class="d-stack16">
  <div>
    <dt-radio-group
      name="radio-group-with-success-message"
      legend="With Success Message"
      :messages=`[{"message":"Success validation message","type":"success"}]`
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
      :messages=`[{"message":"Warning validation message","type":"warning"}]`
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
      :messages=`[{"message":"Error validation message","type":"error"}]`
    >
      <dt-radio value="apple"><span >Apple</span></dt-radio>
      <dt-radio value="banana"><span >Banana</span></dt-radio>
      <dt-radio value="other"><span >Other</span></dt-radio>
    </dt-radio-group>
  </div>
</div>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="radiogroup" />
