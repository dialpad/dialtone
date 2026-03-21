---
title: Notice
description: A notice is an informational and assistive message that appears inline with content.
status: ready
thumb: true
image: assets/images/components/notice.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-notice--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=4492-7076
keywords: ["alert", "message", "notification", "d-notice", "DtNotice", "dt-notice", "callout", "inline alert"]
---

<!-- <code-well-header bgclass="d-bgc-primary">
  <example-notice kind="base" title="Base title (optional)" />
</code-well-header> -->

<component-combinator component-name="DtNotice" />

## Usage

A notice delivers informational and assistive messages that inform the user about product or account statuses and related actions. It can suggest an action or dismissed by the user, though neither are required. For time-based notifications, see [Toast](toast.md).

## Variants and Examples

### Base Styles

Used in most scenarios when the message should be noticeable but not dominate.

<code-well-header bgclass="d-bgc-primary">
  <dt-stack ref="baseStylesExample" gap="400">
    <example-notice kind="base" title="Base title (optional)" />
    <example-notice kind="error" title="Error title (optional)" />
    <example-notice kind="info" title="Info title (optional)" />
    <example-notice kind="success" title="Success title (optional)" />
    <example-notice kind="warning" title="Warning title (optional)" />
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.baseStylesExample'
vueCode='
<dt-notice
  title="Base title (optional)"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Info title (optional)"
  kind="info"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Error title (optional)"
  kind="error"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Success title (optional)"
  kind="success"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Warning title (optional)"
  kind="warning"
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
'
showHtmlWarning />

### Important

Used occasionally in scenarios when the message needs to dominate.

<code-well-header>
  <dt-stack ref="importantExample" gap="400">
    <example-notice important kind="base" title="Base title (optional)" />
    <example-notice important kind="error" title="Error title (optional)" />
    <example-notice important kind="info" title="Info title (optional)" />
    <example-notice important kind="success" title="Success title (optional)" />
    <example-notice important kind="warning" title="Warning title (optional)" />
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.importantExample'
vueCode='
<dt-notice
  title="Base title (optional)"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Info title (optional)"
  kind="info"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Error title (optional)"
  kind="error"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Success title (optional)"
  kind="success"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
<dt-notice
  title="Warning title (optional)"
  kind="warning"
  important
>
  <span>
    Message body with
    <a
      href="#"
      class="d-link"
      :class="linkClass"
    >a link</a>.
  </span>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="inverted"
      @click="onClick"
    >
      Action
    </dt-button>
  </template>
</dt-notice>
'
showHtmlWarning />

### Truncate Text

Truncates the text instead of wrapping it. Useful when the Notice needs to have a fixed height.

<code-well-header bgclass="d-bgc-primary">
  <dt-notice
    ref="htmlTruncateText"
    :truncate-text="true"
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  >
    <span>
      Duis aute irure dolor in reprehenderit in voluptate velit
      esse cillum dolore eu fugiat nulla pariatur.
    </span>
  </dt-notice>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.htmlTruncateText'
vueCode='
<dt-notice
  :truncate-text="true"
  title="Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
>
  <span>
    Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur.
  </span>
</dt-notice>
'
/>

## Vue API

<component-vue-api component-name="notice" />

## Classes

<component-class-table component-name="notice" />

## Accessibility

<component-accessible-table component-name="notice" />

<script setup>
  import ExampleNotice from '@exampleComponents/ExampleNotice.vue';
</script>
