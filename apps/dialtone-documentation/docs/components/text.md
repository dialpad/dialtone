---
title: Text
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
status: beta
image: assets/images/components/text.png
---

<code-well-header>
  <dt-text kind="headline" size="md" as="h2">Typography primitive</dt-text>
</code-well-header>

<!-- <component-combinator component-name="DtText" /> -->

## Usage

- Prefer `DtText` over individual typography utility classes to keep implementations aligned with token updates.
- Use the default slot for rich content. The `text` prop provides a simple fallback string when no slot content is present.
- Choose the `as` prop to match the semantic HTML element (e.g., `h1`, `label`, `p`).
- Match responsive layout needs by combining `DtText` with layout primitives like [`DtStack`](stack.md).

<dialtone-usage>
<template #do>

- Replace multiple `d-` typography classes with a single `dt-text` instance.
- Pick the smallest `kind`/`size` combination that conveys the desired hierarchy.
- Use `tone` for semantic color tokens instead of standalone `d-fc-*` classes.

</template>
<template #dont>

- Mix `DtText` with conflicting typography utilities (e.g., `d-fs-*`, `d-fw-*`, `d-lh-*`).
- Render headings with non-heading tags (e.g., avoid `as="div"` for top-level titles).
- Depend on the `text` prop when the content requires inline formatting; slot it instead.

</template>
</dialtone-usage>

## Variants

### Kind

<code-well-header>
  <dt-stack gap="400" direction="row" class="d-ai-baseline">
    <dt-text kind="headline">Headline</dt-text>
    <dt-text kind="body">Body</dt-text>
    <dt-text kind="label">Label</dt-text>
    <dt-text kind="helper">Helper</dt-text>
    <dt-text kind="code">Code</dt-text>
  </dt-stack>
</code-well-header>

### Size

All kinds support `size` prop, but not all sizes are available for each kind.

<code-well-header>
  <dt-stack class="d-w100p">
    <dt-text kind="headline" size="lg" class="d-fc-muted">Headline</dt-text>
    <dt-stack gap="400" direction="row" class="d-ai-baseline">
      <dt-text kind="headline" size="eyebrow">eyebrow</dt-text>
      <dt-text kind="headline" size="sm">sm</dt-text>
      <dt-text kind="headline" size="md">md</dt-text>
      <dt-text kind="headline" size="lg">lg</dt-text>
      <dt-text kind="headline" size="xl">xl</dt-text>
      <dt-text kind="headline" size="xxl">xxl</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack class="d-w100p">
    <dt-text kind="headline" size="lg" class="d-fc-muted">Body</dt-text>
    <dt-stack gap="400" direction="row" class="d-ai-baseline">
      <dt-text kind="body" size="sm">sm</dt-text>
      <dt-text kind="body" size="md">md</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack class="d-w100p">
    <dt-text kind="headline" size="lg" class="d-fc-muted">Label</dt-text>
    <dt-stack gap="400" direction="row" class="d-ai-baseline">
      <dt-text kind="label" size="sm">sm</dt-text>
      <dt-text kind="label" size="md">md</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack class="d-w100p">
    <dt-text kind="headline" size="lg" class="d-fc-muted">Helper</dt-text>
    <dt-stack gap="400" direction="row" class="d-ai-baseline">
      <dt-text kind="helper" size="sm">sm</dt-text>
      <dt-text kind="helper" size="md">md</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack class="d-w100p">
    <dt-text kind="headline" size="lg" class="d-fc-muted">Code</dt-text>
    <dt-stack gap="400" direction="row" class="d-ai-baseline">
      <dt-text kind="code" size="sm">sm</dt-text>
      <dt-text kind="code" size="md">md</dt-text>
    </dt-stack>
  </dt-stack>
</code-well-header>

### Density

Density prop only applies to `headline` and `body` kinds.

<code-well-header>
  <dt-stack class="d-w100p d-ba d-bar4">
    <table class="d-w100p d-table">
      <colgroup>
        <col>
        <col class="d-w50p">
        <col class="d-w50p">
      </colgroup>
      <tr>
        <th></th>
        <th>
          <dt-text as="code" kind="code">Default</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">density="<strong>compact</strong>"</dt-text>
        </th>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">headline</dt-text>
        </th>
        <td>
          <dt-text kind="headline" as="h2" size="lg" tone="primary" density="default" class="d-bgc-moderate-opaque">First in AI. Best in Agentic.</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" size="lg" tone="primary" density="compact" class="d-bgc-moderate-opaque">First in AI. Best in Agentic.</dt-text>
        </td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">body</dt-text>
        </th>
        <td>
          <dt-text kind="body" as="p" tone="primary" density="default" class="d-bgc-moderate-opaque">Welcome to Dialpad, the most modern, AI-powered business communications platform. </dt-text>
        </td>
        <td>
          <dt-text kind="body" as="p" tone="primary" density="compact" class="d-bgc-moderate-opaque">Welcome to Dialpad, the most modern, AI-powered business communications platform. </dt-text>
        </td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">label</dt-text>
        </th>
        <td>
          <dt-text kind="label" as="p" tone="primary" density="default" class="d-bgc-moderate-opaque">Choose your time zone</dt-text>
        </td>
        <td>
          <dt-text kind="label" as="p" tone="primary" density="compact" class="d-bgc-moderate-opaque">Choose your time zone</dt-text>
        </td>
      </tr>
    </table>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text density="default" kind="headline|body|label">....</dt-text>
<dt-text density="compact" kind="headline|body|label">....</dt-text>
' />

### Strength

`strength="soft"` only applies to select sizes of `headline` kind, and `strength="plain"` only applies to select sizes of `label` kind.

<code-well-header>
  <dt-stack class="d-w100p d-ba d-bar4">
    <table class="d-w100p d-table">
      <tr>
        <th></th>
        <th>
          <dt-text as="code" kind="code">Default</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">strength="<strong>soft</strong>"</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">strength="<strong>plain</strong>"</dt-text>
        </th>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code" class="d-ws-nowrap">headline sm</dt-text>
        </th>
        <td>
          <dt-text kind="headline" as="h2" size="sm" tone="primary">First in AI. Best in Agentic.</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" size="sm" tone="primary" strength="soft">First in AI. Best in Agentic.</dt-text>
        </td>
        <td>
          <dt-text tone="muted" size="sm" title="not available">-</dt-text>
        </td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code" class="d-ws-nowrap">headline lg</dt-text>
        </th>
        <td>
          <dt-text kind="headline" as="h2" size="lg" tone="primary">First in AI. Best in Agentic.</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" size="lg" tone="primary" strength="soft">First in AI. Best in Agentic.</dt-text>
        </td>
        <td>
          <dt-text tone="muted" size="sm" title="not available">-</dt-text>
        </td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code" class="d-ws-nowrap">label sm</dt-text>
        </th>
        <td>
          <dt-text kind="label" as="p" tone="primary" size="sm">Choose your time zone</dt-text>
        </td>
        <td>
          <dt-text tone="muted" size="sm" title="not available">-</dt-text>
        </td>
        <td>
          <dt-text kind="label" as="p" tone="primary" strength="plain" size="sm">Choose your time zone</dt-text>
        </td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code" class="d-ws-nowrap">label md</dt-text>
        </th>
        <td>
          <dt-text kind="label" as="p" tone="primary" size="md">Choose your time zone</dt-text>
        </td>
        <td>
          <dt-text tone="muted" size="sm" title="not available">-</dt-text>
        </td>
        <td>
          <dt-text kind="label" as="p" tone="primary" strength="plain" size="md">Choose your time zone</dt-text>
        </td>
      </tr>
    </table>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text kind="headline" size="sm|lg" strength="soft">....</dt-text>
<dt-text kind="label" strength="plain">....</dt-text>
' />

### Align

Since `DtText`'s default element is a `<span>`, the `align` prop will only work if its element is in block or inline-block context, e.g. `<div>...</div>`.

<code-well-header>
  <dt-stack class="d-w100p" gap="500">
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text kind="body" as="p" align="start">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text kind="body" as="p" align="center">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text kind="body" as="p" align="end">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text kind="body" as="p" align="justify">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text align="start" kind="body">....</dt-text>
<dt-text align="center" kind="body">....</dt-text>
<dt-text align="end" kind="body">....</dt-text>
<dt-text align="justify" kind="body">....</dt-text>
' />

### Truncate

Since `DtText`'s default element is a `<span>`, the `truncate` will only work if its element is in block or inline-block context, e.g. `<div>...</div>`.

<code-well-header>
  <dt-stack class="d-w100p">
    <dt-text kind="body" as="p" truncate>Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app.</dt-text>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text kind="body" as="p" truncate>....</dt-text>
' />

## Accessibility

- Maintain semantic structure via `as` (e.g., screen readers expect heading levels to be sequential).
- When using `truncate`, provide another way to access the full content (tooltip, detail view, or explicit `aria-label`). `DtText` does not apply a `title` attribute automatically, so consuming applications should opt in.
- Allow numeric content to remain readable by enabling the `numeric` prop when aligning tables or counters.

## Vue API

<component-vue-api component-name="text" />

## Classes

<component-class-table component-name="text"></component-class-table>
