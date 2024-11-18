---
title: Root layout
description: A root layout provides a standardized group of containers to display content at the root level.
status: ready
thumb: true
image: assets/images/components/root-layout.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-root-layout--default
---

<code-well-header>
<dt-root-layout
  :fixed="false"
  class="d-w100p d-h332"
>
  <template
    #header
  >
    <div class="d-h64 d-bgc-purple-100">Header</div>
  </template>
  <template
    #sidebar
  >
    <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
  </template>
  <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
  <template
    #footer
  >
    <div class="d-h64 d-bgc-gold-100">Footer</div>
  </template>
</dt-root-layout>
</code-well-header>

## Base Style

A root layout consists of a header, body, sidebar and footer. Content can optionally be passed into the slots which
will be displayed in the respective area. The sidebar is designed to be responsive and will reposition above the
body according to the `responsiveBreakpoint` prop.

<code-well-header>
<dt-root-layout
  :fixed="false"
  class="d-w100p d-h332"
>
  <template
    #header
  >
    <div class="d-h64 d-bgc-purple-100">Header</div>
  </template>
  <template
    #sidebar
  >
    <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
  </template>
  <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
  <template
    #footer
  >
    <div class="d-h64 d-bgc-gold-100">Footer</div>
  </template>
</dt-root-layout>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="root-layout d-root-layout d-w100p d-h332">
  <header class="d-root-layout__header"><div class="d-h64 d-bgc-purple-100">Header</div></header>
  <aside tabindex="0" class="d-root-layout__sidebar">
    <div class="d-w128 d-h100p d-bgc-black-100">
      <div>Sidebar item 1</div>
      <div>Sidebar item 2</div>
      <div>Sidebar item 3</div>
    </div>
  </aside>
  <main class="d-root-layout__content" tabindex="0"><div class="d-bgc-green-100 d-w100p d-h100p">Content</div></main>
  <footer class="d-root-layout__footer"><div class="d-h64 d-bgc-gold-100">Footer</div></footer>
</div>
'
vueCode='
<dt-root-layout
  :fixed="false"
  class="d-w100p d-h332"
>
  <template
    #header
  >
    <div class="d-h64 d-bgc-purple-100">Header</div>
  </template>
  <template
    #sidebar
  >
    <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
  </template>
  <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
  <template
    #footer
  >
    <div class="d-h64 d-bgc-gold-100">Footer</div>
  </template>
</dt-root-layout>
'
showHtmlWarning />

## Variants and examples

### Header Sticky

<div
  class="d-h332 d-of-scroll"
>
  <dt-root-layout
    header-sticky
    class="d-w100p d-h332"
  >
    <template
      #header
    >
      <div class="d-h64 d-bgc-purple-100">Header</div>
    </template>
    <template
      #sidebar
    >
      <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
    </template>
      <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
    <template
      #footer
    >
      <div class="d-h64 d-bgc-gold-100">Footer</div>
    </template>
  </dt-root-layout>
</div>

<code-example-tabs
htmlCode='
<div class="d-h332 d-of-scroll">
  <div class="root-layout d-root-layout d-root-layout--fixed d-w100p d-h332">
    <header class="d-root-layout__header d-root-layout__header--sticky"><div class="d-h64 d-bgc-purple-100">Header</div></header>
    <aside tabindex="0" class="d-root-layout__sidebar">
      <div class="d-w128 d-h100p d-bgc-black-100">
        <div>Sidebar item 1</div>
        <div>Sidebar item 2</div>
        <div>Sidebar item 3</div>
      </div>
    </aside>
    <main class="d-root-layout__content" tabindex="0"><div class="d-bgc-green-100 d-w100p d-h100p">Content</div></main>
    <footer class="d-root-layout__footer"><div class="d-h64 d-bgc-gold-100">Footer</div></footer>
  </div>
</div>
'
vueCode='
<div
  class="d-h332 d-of-scroll"
>
  <dt-root-layout
    header-sticky
    class="d-w100p d-h332"
  >
    <template
      #header
    >
      <div class="d-h64 d-bgc-purple-100">Header</div>
    </template>
    <template
      #sidebar
    >
      <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
    </template>
      <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
    <template
      #footer
    >
      <div class="d-h64 d-bgc-gold-100">Footer</div>
    </template>
  </dt-root-layout>
</div>
'
showHtmlWarning />

## Usage

Root Layout should be used as the top level component for a route. All other components on the page should be nested
within one of the root layout's slots. The root layout should not be nested within any other elements or components.

## Vue API

<component-vue-api component-name="rootlayout" />

## Accessibility

The RootLayout component uses
[Content Sectioning](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning)
elements `<header>`, `<aside>`, `<main>`, and `<footer>` which automatically define
[ARIA Landmark Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#landmark_roles)
on the page.

If you have navigation links contained within any of the slots Root Layout provides these should be enclosed in a `<nav>`
[Nav Section](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav).
The RootLayout component will not do this for you.

The sidebar will not automatically wrap to be above the main content by default.
This can be changed via the `responsiveBreakpoint` prop if desired.
