---
title: Text
description: Consistent typography styling through semantic text kinds and sizes.
status: beta
image: assets/images/components/text.png
---

<code-well-header>
  <dt-stack>
    <dt-text kind="headline" size="lg" as="h2">Large headline</dt-text>
    <dt-text size="md" as="p">Medium Body</dt-text>
  </dt-stack>
</code-well-header>

<!-- <component-combinator component-name="DtText" /> -->

## Usage

<code-example-tabs
vueCode='
<dt-text {{props}}> ... </dt-text>
'
/>

Use in place of manually applying Text Styles. Examples of manual application you should avoid include:

* Applying Text Styles classes, e.g. `class="d-body--md"`
* Combinations of CSS Utilities, e.g. `class="d-fs-300 d-fw-semibold d-lh-300"`
* Custom CSS, e.g. `.foo { font: var(--dt-typography-body-md); }`.

### Guidance

* Prefer `DtText` over individual typography utility classes to keep implementations aligned with token updates.
* Use the default slot for rich content. The `text` prop provides a simple fallback string when no slot content is present.
* Choose the `as` prop to match the semantic HTML element (e.g., `h1`, `label`, `p`).
* All properties are optional, as they layer in on top of each other.

<dialtone-usage>
<template #do>

* Replace multiple `d-` typography classes with a single `dt-text` instance.
* Pick the smallest `kind`/`size` combination that conveys the desired hierarchy.
* Use `tone` for semantic color tokens instead of standalone `d-fc-*` classes.

</template>
<template #dont>

* Mix `DtText` with conflicting typography utilities (e.g., `d-fs-*`, `d-fw-*`, `d-lh-*`).
* Render headings with non-heading tags (e.g., avoid `as="div"` for top-level titles).
* Depend on the `text` prop when the content requires inline formatting; slot it instead.

</template>
</dialtone-usage>

## Variants

### Kind

Declare the role of the content. Default will inherit text styles from the parent.

<code-well-header>
  <dt-stack gap="400" direction="row" class="d-ai-baseline">
    <dt-text kind="headline">Headline</dt-text>
    <dt-text kind="body">Body</dt-text>
    <dt-text kind="label">Label</dt-text>
    <dt-text kind="helper">Helper</dt-text>
    <dt-text kind="code">Code</dt-text>
    <dt-text>Default (inherits)</dt-text>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text kind="headline">Headline</dt-text>
<dt-text kind="body">Body</dt-text>
<dt-text kind="label">Label</dt-text>
<dt-text kind="helper">Helper</dt-text>
<dt-text kind="code">Code</dt-text>
<dt-text>Default (inherits)</dt-text>
'
/>

### Size

All kinds support `size` prop, but not all sizes are available for each kind. Default size is `md`.

<code-well-header>
  <dt-stack class="d-w100p d-ba d-bar4">
    <table class="d-w100p d-table">
      <tr>
        <th></th>
        <th>
          <dt-text as="code" kind="code">eyebrow</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">sm</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">md</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">lg</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">xl</dt-text>
        </th>
        <th>
          <dt-text as="code" kind="code">xxl</dt-text>
        </th>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">headline</dt-text>
        </th>
        <td>
          <dt-text kind="headline" as="h2" size="eyebrow" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" size="sm" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" size="lg" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" size="xl" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="headline" as="h2" size="xxl" tone="primary">Text</dt-text>
        </td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">body</dt-text>
        </th>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td>
          <dt-text kind="body" as="p" size="sm" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="body" as="p" tone="primary">Text</dt-text>
        </td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">label</dt-text>
        </th>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td>
          <dt-text kind="label" as="p" size="sm" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="label" as="p" tone="primary">Text</dt-text>
        </td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">helper</dt-text>
        </th>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td>
          <dt-text kind="helper" as="p" size="sm" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="helper" as="p" tone="primary">Text</dt-text>
        </td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
      </tr>
      <tr class="d-va-baseline">
        <th scope="row">
          <dt-text as="code" align="end" kind="code">code</dt-text>
        </th>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td>
          <dt-text kind="code" as="code" size="sm" tone="primary">Text</dt-text>
        </td>
        <td>
          <dt-text kind="code" as="code" tone="primary">Text</dt-text>
        </td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
        <td><dt-text tone="muted" size="sm" title="not available">-</dt-text></td>
      </tr>
    </table>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text size="{{size}}">....</dt-text>
' />

### Density

The `density` prop maps to the `line-height` style property, and only applies to `headline` and `body` kinds.

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

The `strength` prop maps to the `font-weight` style property.

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
          <dt-text kind="label" as="p" tone="primary">Choose your time zone</dt-text>
        </td>
        <td>
          <dt-text tone="muted" size="sm" title="not available">-</dt-text>
        </td>
        <td>
          <dt-text kind="label" as="p" tone="primary" strength="plain">Choose your time zone</dt-text>
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

### Numeric

The `numeric` prop applies styles that ensure that each number is set with consistent width, making them align properly when displayed together. Ideal for displaying aligned data such as phone numbers or numbers in a table.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <dt-stack gap="500" class="d-jc-space-between d-ai-baseline">
      <dt-text kind="label" size="sm" tone="critical">Without numeric</dt-text>
      <dt-text>(913) 555-3170</dt-text>
      <dt-text>(908) 555-1111</dt-text>
      <dt-text>(805) 555-8413</dt-text>
      <dt-text>(816) 555-1203</dt-text>
      <dt-text>(886) 555-8888</dt-text>
    </dt-stack>
    <dt-stack gap="500" class="d-jc-space-between d-ai-baseline">
      <dt-text kind="label" size="sm" tone="success">With numeric</dt-text>
      <dt-text numeric>(913) 555-3170</dt-text>
      <dt-text numeric>(908) 555-1111</dt-text>
      <dt-text numeric>(805) 555-8413</dt-text>
      <dt-text numeric>(816) 555-1203</dt-text>
      <dt-text numeric>(886) 555-8888</dt-text>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text numeric>(913) 555-3170</dt-text>
'
/>

## Tone

Use `tone` to declare the text's tone, which will map to a foreground color. By default, the tone is inherited from its parent.

<code-well-header>
  <dt-stack gap="500" direction="row">
    <dt-stack gap="300" class="d-py8 d-px16 d-bgc-primary d-bar4">
      <dt-text tone="primary">primary</dt-text>
      <dt-text tone="secondary">secondary</dt-text>
      <dt-text tone="tertiary">tertiary</dt-text>
      <dt-text tone="muted">muted</dt-text>
      <dt-text tone="disabled">disabled</dt-text>
      <dt-text tone="placeholder">placeholder</dt-text>
      <dt-text tone="success">success</dt-text>
      <dt-text tone="success-strong">success-strong</dt-text>
      <dt-text tone="warning">warning</dt-text>
      <dt-text tone="critical">critical</dt-text>
      <dt-text tone="critical-strong">critical-strong</dt-text>
    </dt-stack>
    <dt-stack gap="300" class="d-py8 d-px16 d-bgc-primary-inverted d-bar4">
      <dt-text tone="primary-inverted">primary-inverted</dt-text>
      <dt-text tone="secondary-inverted">secondary-inverted</dt-text>
      <dt-text tone="tertiary-inverted">tertiary-inverted</dt-text>
      <dt-text tone="muted-inverted">muted-inverted</dt-text>
      <dt-text tone="disabled-inverted">disabled-inverted</dt-text>
      <dt-text tone="placeholder-inverted">placeholder-inverted</dt-text>
      <dt-text tone="success-inverted">success-inverted</dt-text>
      <dt-text tone="success-strong-inverted">success-strong-inverted</dt-text>
      <dt-text tone="warning-inverted">warning-inverted</dt-text>
      <dt-text tone="critical-inverted">critical-inverted</dt-text>
      <dt-text tone="critical-strong-inverted">critical-strong-inverted</dt-text>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text tone="{{tone}}">...</dt-text>
' />

## As

Use `as` to declare the underlying HTML tag that the component should render, independent of the visual styling. Defaults to `span`.

<code-well-header>
  <dt-stack class="d-w100p" gap="500">
    <dt-stack gap="400">
      <dt-text kind="headline" as="h1" size="xl" density="compact">The Complete Agentic AI Platform</dt-text>
      <dt-text kind="body" as="p">Our AI Agents come equipped with the core skills businesses need to deliver seamless customer experiences.</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="500" class="d-ai-flex-start">
      <dt-stack gap="400">
        <dt-text kind="headline" as="h2" size="lg" density="compact">Try before you AI</dt-text>
        <dt-text kind="body" as="p">Build, run and optimize your agents - no code, just your expertise and our built-in intelligence.</dt-text>
      </dt-stack>
      <dt-stack gap="400">
        <dt-text kind="headline" as="h2" size="lg" density="compact">Great minds sync alike</dt-text>
        <dt-text kind="body" as="p">Our AI learns and balances speed with quality using one data plane that keeps customers coming back.</dt-text>
      </dt-stack>
      <dt-stack gap="400">
        <dt-text kind="headline" as="h2" size="lg" density="compact">History repeats itself. Customers shouldn’t.</dt-text>
        <dt-text kind="body" as="p">Whatever your customer types or says, our AI and your human agents stay in sync.</dt-text>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text kind="headline" as="h1" size="xl" density="compact">...</dt-text>
<dt-text kind="body" as="p">...</dt-text>
<dt-text kind="headline" as="h2" size="lg" density="compact">...</dt-text>
<dt-text kind="body" as="p">...</dt-text>
<dt-text kind="headline" as="h2" size="lg" density="compact">...</dt-text>
<dt-text kind="body" as="p">...</dt-text>
<dt-text kind="headline" as="h2" size="lg" density="compact">...</dt-text>
<dt-text kind="body" as="p">...</dt-text>
' />

## Align

Since `DtText`'s default element is a `<span>`, which is inline by default, the `align` prop will only work if its element is styled in a block context.

<code-well-header>
  <dt-stack class="d-w100p" gap="600">
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text as="p" align="start">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text as="p" align="center">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text as="p" align="end">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
    <div class="d-ba d-bc-subtle d-bas-dashed">
      <dt-text as="p" align="justify">Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app. </dt-text>
    </div>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text align="start">....</dt-text>
<dt-text align="center">....</dt-text>
<dt-text align="end">....</dt-text>
<dt-text align="justify">....</dt-text>
' />

## Truncate

Since `DtText`'s default element is a `<span>`, the `truncate` will only work if its element is in block or inline-block context, e.g. `<div>...</div>`.

<code-well-header>
  <dt-stack class="d-w100p">
    <dt-text as="p" truncate>Welcome to Dialpad, the most modern, AI-powered business communications platform. We've taken every form of communication that you rely on and unified it into one app.</dt-text>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text as="p" truncate>....</dt-text>
' />

## Max Lines

<code-well-header>
  <dt-stack class="d-w100p d-ai-flex-start" gap="500" direction="row">
    <dt-text as="p" maxLines="2">Welcome to Dialpad, the most modern, AI-powered business communications platform. We’ve taken every form of communication that you rely on and unified it into one app. Calling a client? Meeting with your team? Texting a colleague? It’s all here, on all your devices. AI is by your side to transform your conversations into something you can see and use, giving you and your team a deeper look into action items and insights. Dialpad AI does the legwork to capture the details that matter most while you make and receive calls, send messages, and join meetings in an instant.</dt-text>
    <dt-text as="p" maxLines="4">Welcome to Dialpad, the most modern, AI-powered business communications platform. We’ve taken every form of communication that you rely on and unified it into one app. Calling a client? Meeting with your team? Texting a colleague? It’s all here, on all your devices. AI is by your side to transform your conversations into something you can see and use, giving you and your team a deeper look into action items and insights. Dialpad AI does the legwork to capture the details that matter most while you make and receive calls, send messages, and join meetings in an instant.</dt-text>
    <dt-text as="p" maxLines="6">Welcome to Dialpad, the most modern, AI-powered business communications platform. We’ve taken every form of communication that you rely on and unified it into one app. Calling a client? Meeting with your team? Texting a colleague? It’s all here, on all your devices. AI is by your side to transform your conversations into something you can see and use, giving you and your team a deeper look into action items and insights. Dialpad AI does the legwork to capture the details that matter most while you make and receive calls, send messages, and join meetings in an instant.</dt-text>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text as="p" :max-lines="maxLines">....</dt-text>
' />

<code-well-header>
  <dt-stack gap="400">
    <dt-stack direction="row" gap="400" class="d-jc-space-between d-ai-center">
      <dt-text kind="headline" size="lg">Demo</dt-text>
      <dt-stack direction="row" gap="400" class="d-ai-center">
        <dt-button
          size="sm"
          importance="outlined"
          kind="muted"
          @click="toggleMaxLines"
        >
          Toggle
        </dt-button>
        <dt-stack direction="row" gap="200" class="d-ai-center">
          <dt-stack direction="row">
            <dt-button
              v-dt-tooltip="`Fewer`"
              class="d-as-stretch d-g0 d-brr0 d-brw0"
              size="sm"
              importance="outlined"
              kind="muted"
              :disabled="!canDecreaseMaxLines"
              @click="decrementMaxLines"
            >
              <template #icon>
                <dt-icon name="dash" size="200" />
              </template>
            </dt-button>
            <dt-button
              v-dt-tooltip="`More`"
              class="d-as-stretch d-g0 d-blr0"
              size="sm"
              importance="outlined"
              kind="muted"
              :disabled="!canIncreaseMaxLines"
              @click="incrementMaxLines"
            >
              <template #icon>
                <dt-icon name="plus" size="200" />
              </template>
            </dt-button>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </dt-stack>
    <dt-stack class="d-w100p d-ai-flex-start" gap="500">
      <dt-text :max-lines="maxLinesBinding" as="p">Welcome to Dialpad, the most modern, AI-powered business communications platform. We’ve taken every form of communication that you rely on and unified it into one app. Calling a client? Meeting with your team? Texting a colleague? It’s all here, on all your devices. AI is by your side to transform your conversations into something you can see and use, giving you and your team a deeper look into action items and insights. Dialpad AI does the legwork to capture the details that matter most while you make and receive calls, send messages, and join meetings in an instant. Welcome to Dialpad, the most modern, AI-powered business communications platform. We’ve taken every form of communication that you rely on and unified it into one app. Calling a client? Meeting with your team? Texting a colleague? It’s all here, on all your devices. AI is by your side to transform your conversations into something you can see and use, giving you and your team a deeper look into action items and insights. Dialpad AI does the legwork to capture the details that matter most while you make and receive calls, send messages, and join meetings in an instant. Welcome to Dialpad, the most modern, AI-powered business communications platform. We’ve taken every form of communication that you rely on and unified it into one app. Calling a client? Meeting with your team? Texting a colleague? It’s all here, on all your devices. AI is by your side to transform your conversations into something you can see and use, giving you and your team a deeper look into action items and insights. Dialpad AI does the legwork to capture the details that matter most while you make and receive calls, send messages, and join meetings in an instant.</dt-text>
    </dt-stack>
  </dt-stack>
</code-well-header>

## Wrap

Control text wrapping behavior. Particularly useful for headlines where balanced line lengths improve readability.

<code-well-header>
  <dt-stack class="d-w100p" gap="500">
    <dt-stack gap="600" align="start">
      <dt-text as="p"><strong>Default</strong>. Lorem ipsum dolor sit amet consectetur adipisicing consequatur deleniti non doloremque autem adipisci in omnis voluptatibus aut aperiam magnam ea nihil dolores officia quos, dolore praesentium expedita</dt-text>
      <dt-text as="p" wrap="balance"><strong>Balance</strong>. Lorem ipsum dolor sit amet consectetur adipisicing consequatur deleniti non doloremque autem adipisci in omnis voluptatibus aut aperiam magnam ea nihil dolores officia quos, dolore praesentium expedita</dt-text>
      <dt-text as="p" wrap="pretty"><strong>Pretty</strong>. Lorem ipsum dolor sit amet consectetur adipisicing consequatur deleniti non doloremque autem adipisci in omnis voluptatibus aut aperiam magnam ea nihil dolores officia quos, dolore praesentium expedita</dt-text>
      <dt-text as="p" wrap="nowrap"><strong>No Wrap</strong>. Lorem ipsum dolor sit amet consectetur adipisicing consequatur deleniti non doloremque autem adipisci in omnis voluptatibus aut aperiam magnam ea nihil dolores officia quos, dolore praesentium expedita</dt-text>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text>....</dt-text>
<dt-text wrap="balance">....</dt-text>
<dt-text wrap="pretty">....</dt-text>
<dt-text wrap="nowrap">....</dt-text>
' />

## Trim

Remove extra leading space above and/or below text. Useful for tight component layouts where text needs to align precisely with adjacent elements.

Trim will only effect block-level elements, and has no effect on elements that have a inline-level styled context.

<dt-notice
  kind="warning"
  class="d-wmx100p d-my24"
  hide-close
>

  Trim requires modern browser support for `text-box-trim`, Chrome 133+, Edge 132+, Safari 18.2+ as of November 2025. Otherwise, it will gracefully fallback to default rendering with half-leading above and below.
</dt-notice>

<code-well-header>
  <dt-stack gap="500" direction="row">
    <dt-text as="p" class="d-bgc-moderate-opaque"><strong>No trim:</strong> lorem ipsum dolor sit amet</dt-text>
    <dt-text as="p" trim="start" class="d-bgc-moderate-opaque"><strong>Trim start:</strong> lorem ipsum dolor sit amet</dt-text>
    <dt-text as="p" trim="end" class="d-bgc-moderate-opaque"><strong>Trim end:</strong> lorem ipsum dolor sit amet</dt-text>
    <dt-text as="p" trim="both" class="d-bgc-moderate-opaque"><strong>Trim both:</strong> lorem ipsum dolor sit amet</dt-text>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-text as="p" trim="start">....</dt-text>
<dt-text as="p" trim="end">....</dt-text>
<dt-text as="p" trim="both">....</dt-text>
' />

<dialtone-usage>
<template #do>

* Use `trim="both"` when text needs to align flush with container's top and/or bottom edges.
* Combine with `density="compact"` for maximum space efficiency.

</template>
<template #dont>

* Apply trim to body copy that benefits from natural line spacing.
* Use trim as a substitute for proper layout spacing.

</template>
</dialtone-usage>

## Accessibility

* Maintain semantic structure via `as` (e.g., screen readers expect heading levels to be sequential).
* When using `truncate`, provide another way to access the full content (tooltip, detail view, or explicit `aria-label`). `DtText` does not apply alternative access to the full string, so consuming applications should opt in.
* Allow numeric content to remain readable by enabling the `numeric` prop when aligning tables or numbers that dynamically update.

## Vue API

<component-vue-api component-name="text" />

## Classes

<component-class-table component-name="text"></component-class-table>

<script setup>
import { computed, reactive } from 'vue';

const BOUNDS = Object.freeze({ min: 2, max: 10, default: 4 });
const clampToBounds = (value) => Math.min(Math.max(value ?? BOUNDS.default, BOUNDS.min), BOUNDS.max);

const state = reactive({
  value: clampToBounds(BOUNDS.default),
  lastApplied: clampToBounds(BOUNDS.default),
  isApplied: true,
});

const maxLinesBinding = computed(() => (state.isApplied ? state.value : undefined));

const canDecreaseMaxLines = computed(() => state.isApplied && state.value > BOUNDS.min);
const canIncreaseMaxLines = computed(() => state.isApplied && state.value < BOUNDS.max);

const adjustMaxLines = (delta) => {
  if (!state.isApplied) return;
  const nextValue = clampToBounds(state.value + delta);
  if (nextValue === state.value) return;

  state.value = nextValue;
  state.lastApplied = nextValue;
};

const decrementMaxLines = () => adjustMaxLines(-1);
const incrementMaxLines = () => adjustMaxLines(1);

const toggleMaxLines = () => {
  if (state.isApplied) {
    state.lastApplied = state.value;
    state.isApplied = false;
    return;
  }

  const restoredValue = clampToBounds(state.lastApplied);
  state.value = restoredValue;
  state.lastApplied = restoredValue;
  state.isApplied = true;
};
</script>
