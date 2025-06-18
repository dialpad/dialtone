---
title: Loader
description: A loader is a visual indicator that a task is in progress.
status: beta
thumb: false
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-loader--default
---

<code-well-header>
  <dt-loader></dt-loader>
</code-well-header>

### Default

The base loader should be the go-to loader for most of your needs. When in doubt, use this style.

<code-well-header>
  <dt-loader></dt-loader>
</code-well-header>

<code-example-tabs
htmlCode='
<div aria-label="loading" class="d-loader" size="500">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-500">...</svg>
</div>
'
vueCode='
<dt-loader />
'
showHtmlWarning />

## Sizes

The base loader size is 24px and should be used in most cases.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <dt-loader size="100"></dt-loader>
    <dt-loader size="200"></dt-loader>
    <dt-loader size="300"></dt-loader>
    <dt-loader size="400"></dt-loader>
    <dt-loader size="500"></dt-loader>
    <dt-loader size="600"></dt-loader>
    <dt-loader size="700"></dt-loader>
    <dt-loader size="800"></dt-loader>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div aria-label="loading" class="d-loader" size="100">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-100">...</svg>
</div>
<div aria-label="loading" class="d-loader" size="200">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-200">...</svg>
</div>
<div aria-label="loading" class="d-loader" size="300">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-300">...</svg>
</div>
<div aria-label="loading" class="d-loader" size="400">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-400">...</svg>
</div>
<div aria-label="loading" class="d-loader" size="500">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-500">...</svg>
</div>
<div aria-label="loading" class="d-loader" size="600">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-600">...</svg>
</div>
<div aria-label="loading" class="d-loader" size="700">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-700">...</svg>
</div>
<div aria-label="loading" class="d-loader" size="800">
  <svg class="d-icon d-icon--loading d-loader-icon d-icon--size-800">...</svg>
</div>
'
vueCode='
<dt-loader size="100"></dt-loader>
<dt-loader size="200"></dt-loader>
<dt-loader size="300"></dt-loader>
<dt-loader size="400"></dt-loader>
<dt-loader></dt-loader>
<dt-loader size="600"></dt-loader>
<dt-loader size="700"></dt-loader>
<dt-loader size="800"></dt-loader>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="loader" />

## Accessibility

- You can add an `aria-label` attribute to the loader to indicate a custom label.
- If no `aria-label` is provided, the default value is "loading".
