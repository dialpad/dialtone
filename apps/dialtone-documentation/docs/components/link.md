---
title: Link
description: A link is a navigational element that can be found on its own, within other text, or directly following content.
status: ready
thumb: true
image: assets/images/components/link.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-link--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21226&viewport=-746%2C-197%2C1.41&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
  <a href="#link" class="d-link">Base link</a>
</code-well-header>

<!-- <component-combinator component-name="DtLink" /> -->

## Usage

`button` and link (`<a>`) HTML elements each describe a specific intent. Understanding the distinction is important: if it goes somewhere, use a Link. If an action occurs, use a [Button](button.md).

<dialtone-usage>
<template #do>

- Use for navigating between destinations.
</template>

<template #dont>

- Use for actions, instead use a [Button](button.md).
</template>

</dialtone-usage>

### Best practices

- Use useful, actionable, and descriptive text clearly conveying the hyperlink’s destination. For example, a generic label like "click here" doesn’t convey its target content.
- Too many links can be overwhelming. Be selective about the number of links in a context.
- Clearly identify links that target an external source.

## Accessibility

- Allow keyboard navigation. Users must be able to navigate between links, i.e. keypress of tab, and activate it by pressing ‘Enter’.
- Users must be able to identify links without relying on color alone.
- Users must be able to activate hover and focus states with both a mouse and a keyboard.

## Variants and examples

### Default

<code-well-header>
  <a href="#link" class="d-link">Base link</a>
  <a href="#link" class="d-link d-link--danger">Danger link</a>
  <a href="#link" class="d-link d-link--muted">Muted link</a>
  <a href="#link" class="d-link d-link--success">Success link</a>
  <a href="#link" class="d-link d-link--warning">Warning link</a>
  <a href="#link" class="d-link d-link--mention">Mention link</a>
</code-well-header>

<code-example-tabs
htmlCode='
<a href="#link" class="d-link">Link</a>
<a href="#link" class="d-link d-link--danger">Danger link</a>
<a href="#link" class="d-link d-link--muted">Muted link</a>
<a href="#link" class="d-link d-link--success">Success link</a>
<a href="#link" class="d-link d-link--warning">Warning link</a>
<a href="#link" class="d-link d-link--mention">Mention link</a>
'
vueCode='
<dt-link :href="#link">Link</dt-link>
<dt-link :href="#link" kind="danger">Danger link</dt-link>
<dt-link :href="#link" kind="muted">Muted link</dt-link>
<dt-link :href="#link" kind="success">Success link</dt-link>
<dt-link :href="#link" kind="warning">Warning link</dt-link>
<dt-link :href="#link" kind="mention">Mention link</dt-link>
'
showHtmlWarning />

### Inverted

<code-well-header bgclass="d-bgc-contrast">
  <a href="#link" class="d-link d-link--inverted">Inverted base link</a>
  <a href="#link" class="d-link d-link--inverted-danger">Inverted danger link</a>
  <a href="#link" class="d-link d-link--inverted-success">Inverted success link</a>
  <a href="#link" class="d-link d-link--inverted-warning">Inverted warning link</a>
  <a href="#link" class="d-link d-link--inverted-muted">Inverted muted link</a>
  <a href="#link" class="d-link d-link--inverted-mention">Inverted mention link</a>
</code-well-header>

<code-example-tabs
htmlCode='
<a href="#link" class="d-link d-link--inverted">Inverted link</a>
<a href="#link" class="d-link d-link--inverted-danger">Inverted danger link</a>
<a href="#link" class="d-link d-link--inverted-success">Inverted success link</a>
<a href="#link" class="d-link d-link--inverted-warning">Inverted warning link</a>
<a href="#link" class="d-link d-link--inverted-muted">Inverted muted link</a>
<a href="#link" class="d-link d-link--inverted-mention">Inverted muted link</a>
'
vueCode='
<dt-link :href="#link" inverted>Inverted link</dt-link>
<dt-link :href="#link" kind="danger" inverted>Inverted danger link</dt-link>
<dt-link :href="#link" kind="success" inverted>Inverted success link</dt-link>
<dt-link :href="#link" kind="warning" inverted>Inverted warning link</dt-link>
<dt-link :href="#link" kind="muted" inverted>Inverted muted link</dt-link>
<dt-link :href="#link" kind="mention" inverted>Inverted mention link</dt-link>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="link" />

## Classes

<component-class-table component-name="link"></component-class-table>
