---
title: Loader
description: A loader is a visual indicator that a task is in progress.
status: beta
thumb: false
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-loader--default
keywords: ["spinner", "loading", "progress", "d-loader", "DtLoader", "dt-loader", "activity indicator", "spin"]
---

<!-- <code-well-header>
  <dt-loader></dt-loader>
</code-well-header> -->

<component-combinator component-name="DtLoader" />

## Loader vs Skeleton

**Use Loader when:**

- You need a simple, generic loading indicator
- Loading time is short or indeterminate
- You want to indicate that a process is running without showing layout structure
- You need a compact loading indicator for buttons, small components, or overlays

**Use [Skeleton](/components/skeleton.html) when:**

- Content is expected to take more than a few hundred milliseconds to load on average
- You want to show the approximate layout and structure of content being loaded
- Loading complex lists, cards, or detailed content where users benefit from seeing the expected layout
- You need to maintain visual hierarchy during loading states

## Variants

### Default

The base loader should be the go-to loader for most of your needs. When in doubt, use this style.

<code-well-header>
  <dt-loader ref="defaultExample"></dt-loader>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.defaultExample'
vueCode='
<dt-loader />
'
showHtmlWarning />

## Sizes

The base loader size is 24px and should be used in most cases.

<code-well-header>
  <dt-stack
    ref="sizesExample"
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
:htmlCode='() => $refs.sizesExample'
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
