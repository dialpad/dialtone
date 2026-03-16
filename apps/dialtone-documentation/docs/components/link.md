---
title: Link
description: A link is a navigational element that can be found on its own, within other text, or directly following content.
status: ready
thumb: true
image: assets/images/components/link.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-link--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=5531-26862
keywords: ["anchor", "hyperlink", "url", "d-link", "DtLink", "dt-link", "text link", "href"]
---

<!-- <code-well-header>
  <dt-link href="#link">Base link</dt-link>
</code-well-header> -->

<component-combinator component-name="DtLink" />

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

### Best Practices

- Use useful, actionable, and descriptive text clearly conveying the hyperlink’s destination. For example, a generic label like "click here" doesn’t convey its target content.
- Too many links can be overwhelming. Be selective about the number of links in a context.
- Clearly identify links that target an external source.

## Accessibility

- Allow keyboard navigation. Users must be able to navigate between links, i.e. keypress of tab, and activate it by pressing ‘Enter’.
- Users must be able to identify links without relying on color alone.
- Users must be able to activate hover and focus states with both a mouse and a keyboard.

## Variants and Examples

### Default

<code-well-header>
  <DtStack gap="400" ref="linkExample1">
    <dt-link href="#link">Base link</dt-link>
    <dt-link href="#link" kind="danger">Danger link</dt-link>
    <dt-link href="#link" kind="muted">Muted link</dt-link>
    <dt-link href="#link" kind="success">Success link</dt-link>
    <dt-link href="#link" kind="warning">Warning link</dt-link>
    <dt-link href="#link" kind="mention">Mention link</dt-link>
  </DtStack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.linkExample1'
vueCode='
<dt-link :href="#link">Link</dt-link>
<dt-link :href="#link" kind="danger">Danger link</dt-link>
<dt-link :href="#link" kind="muted">Muted link</dt-link>
<dt-link :href="#link" kind="success">Success link</dt-link>
<dt-link :href="#link" kind="warning">Warning link</dt-link>
<dt-link :href="#link" kind="mention">Mention link</dt-link>
'
showHtmlWarning />

### No underline

This inverts the underline behavior. With `underline="false"`, the link will not have an underline by default, but will show one on hover.

<code-well-header>
  <dt-link href="#link" :underline="false">No underline link</dt-link>
</code-well-header>

<code-example-tabs
htmlCode='
<a href="#link" class="d-link d-link--no-underline">No underline link</a>
'
vueCode='
<dt-link href="#link" :underline="false">No underline link</dt-link>
'
showHtmlWarning />

### Inverted

<dt-notice
  title="Deprecated"
  kind="error"
  class="d-wmx100p d-my16"
>
  The <code>inverted</code> prop has been deprecated. Use the
  <dt-link to="mode-island.html#inverting">v-dt-mode directive</dt-link>
  instead.
</dt-notice>

In place of the `inverted` prop, use the [v-dt-mode directive](mode-island.html#inverting) on the component element.

<code-well-header>
  <DtStack gap="400" ref="linkInvertedExample" class="d-bgc-contrast d-p8">
    <dt-link v-dt-mode:invert href="#link">Base link</dt-link>
    <dt-link v-dt-mode:invert href="#link" kind="danger">Danger link</dt-link>
    <dt-link v-dt-mode:invert href="#link" kind="success">Success link</dt-link>
    <dt-link v-dt-mode:invert href="#link" kind="warning">Warning link</dt-link>
    <dt-link v-dt-mode:invert href="#link" kind="muted">Muted link</dt-link>
    <dt-link v-dt-mode:invert href="#link" kind="mention">Mention link</dt-link>
  </DtStack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.linkInvertedExample'
vueCode='
<dt-link v-dt-mode:invert {props}>Link</dt-link>
'
showHtmlWarning />

## Navigation

DtLink supports both external links and internal SPA navigation via Vue Router.

### href

Use `href` for standard anchor links — external URLs, hash links, etc.

<code-example-tabs
vueCode='
<dt-link href="https://github.com/dialpad/dialtone" target="_blank" rel="noopener noreferrer">
  GitHub
</dt-link>
<dt-link href="#section">Jump to section</dt-link>
'
showHtmlWarning />

### to

Use `to` for Vue Router navigation. DtLink renders as a `<router-link>` when `to` is provided.

<code-example-tabs
vueCode='
<dt-link to="/components/">Browse Components</dt-link>
<dt-link to="/components/button">Button docs</dt-link>
<dt-link :to="{ name: &apos;component&apos;, params: { id: &apos;button&apos; } }">Button docs</dt-link>
'
showHtmlWarning />

### Replace history

Use the `replace` prop to replace the current history entry instead of pushing a new one. Only applies when `to` is provided.

<code-example-tabs
vueCode='
<dt-link to="/components/" replace>Browse Components</dt-link>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="link" />

## Classes

<component-class-table component-name="link"></component-class-table>
