---
title: Empty State
description: Indicates no data is available to display, provides clarification, and guidance on how to proceed.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-empty-state--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=17203-203
keywords: ["no results", "blank slate", "zero state", "d-empty-state", "DtEmptyState", "dt-empty-state", "placeholder", "empty view"]
---

<component-combinator component-name="DtEmptyState" />

## Anatomy

<div class="d-d-grid d-g-cols3 d-ba d-bc-subtle d-mbe-200 d-bar-400 d-bgc-secondary">
  <div class="d-gc2 d-bar-400 d-bgc-primary"><img class="d-bar-400 d-d-block d-w100p" alt="empty state bullets" src="/assets/images/components/empty-state01.png"></div>
  <div class="d-gc1 d-bl d-bc-subtle d-p-400">
    <ol class="d-pis-200">
      <li class="d-lst-decimal">Illustration or Icon <span class="d-fc-tertiary">(optional)</span></li>
      <li class="d-lst-decimal">Title</li>
      <li class="d-lst-decimal">Description <span class="d-fc-tertiary">(optional)</span></li>
      <li class="d-lst-decimal">
        Action <span class="d-fc-tertiary">(optional)</span>
        <ul class="d-pis-200">
          <li class="d-lst-disc">Secondary</li>
          <li class="d-lst-disc">Primary</li>
        </ul>
      </li>
      <li class="d-lst-decimal">Surface <span class="d-fc-tertiary">(optional)</span></li>
    </ol>
  </div>
</div>

- Empty states fill the space of its surrounding container and is always  centered vertically and horizontally.
- Actions are optional if there is no direct action to be taken.
- The primary action is always to the right when presenting multiple actions.
- Action buttons are usually `kind="default"` (aka "primary"), though may be `kind="muted"`. Do not mix `kind`s.
- Surface color most often will be transparent, deferring to its parent container's surface color.

## Usage

### Guidelines

<dialtone-usage>
<template #do>

- Offer clear and actionable guidance so the user has the bare minimum amount of information necessary to proceed.
- Use scannable, concise, informative, and useful titles that reinforce why this state is empty.
- Provide a description that complements the title, offering additional context or guidance.
- Choose visuals that complement the message, its tone, and do not distract from the real task. The content is primarily what should gain their attention.
- Provide relevant actions that guide the user on how to proceed.

</template>

<template #dont>

- Avoid creating a dead-end. Always provide actionable guidance and/or actions.
- Don't overload with information or unnecessary details. Keep messaging brief and to the point.
- Do not use technical jargon or proprietary terms. Keep the language user-friendly and straight-forward.
- Avoid customizing its style. It should inherit the surrounding container's style when not in an empty state.

</template>

</dialtone-usage>

### Scenarios

The four most likely scenarios for an empty state are **Zero State**, **No Results**, **New Feature**, and **Not Enabled**. This is not an exhaustive list, but a good starting point for most use cases.

<div class="d-d-grid d-g-cols1 lg:d-g-cols3 d-bar-400 d-bgc-secondary d-mbe-400">

  <div class="d-p-200 d-plc-center">

#### Zero State

The Empty State should guide the user on how to achieve a non-empty state. You might provide a useful tip, such as a shortcut or explanation of what needs to occur if no direct action can be taken.

  </div>
  <div class="d-gc2 d-p-200">
    <img class="d-ba d-bc-subtle d-bar-300 d-w100p d-bs-sm" alt="Example: Zero state" src="/assets/images/components/empty-state02.png">
  </div>
</div>

<div class="d-d-grid d-g-cols1 lg:d-g-cols3 d-bar-400 d-bgc-secondary d-mbe-400">

  <div class="d-p-200 d-plc-center">

#### No Results

When an action results in no data or information to display, recommend alternate steps to take. For example, suggest an alternative filter if a table search yields no results, or guide the user on creating a new entry with the desired properties.

  </div>
  <div class="d-gc2 d-p-200">
    <img class="d-ba d-bc-subtle d-bar-400 d-w100p d-bs-sm" alt="Example: No results" src="/assets/images/components/empty-state03.png">
  </div>
</div>

<div class="d-d-grid d-g-cols1 lg:d-g-cols3 d-bar-400 d-bgc-secondary d-mbe-400">

  <div class="d-p-200 d-plc-center">

#### New Feature

An opportunity to introduce something new or not yet take advantage of. If it includes a plan change, clearly inform the user. Use this space to entice the user to explore and utilize the new feature.

  </div>
  <div class="d-gc2 d-p-200">
    <img class="d-ba d-bc-subtle d-bar-400 d-w100p d-bs-sm" alt="Example: New feature" src="/assets/images/components/empty-state04.png">
  </div>
</div>

<div class="d-d-grid d-g-cols1 lg:d-g-cols3 d-bar-400 d-bgc-secondary d-mbe-400">

  <div class="d-p-200 d-plc-center">

#### Not Enabled

Appropriate for indicating that something is currently unavailable to them. Provide guidance on how they can gain access or why the feature is not enabled.

  </div>
  <div class="d-gc2 d-p-200">
    <img class="d-ba d-bc-subtle d-bar-400 d-w100p d-bs-sm" alt="Example: Not enabled" src="/assets/images/components/empty-state05.png">
  </div>
</div>

## Variants

A few rules to keep in nothing-to-see-here when choosing a size variant.

- Choosing a size adjusts the relative width, padding, and font size.
- `400` and `300` sizes
  - The visual may be an Illustration or an Icon.
  - If both are chosen, the Illustration takes precedence.
- `200` size
  - Illustrations are not available, an Icon is the only visual available.
  - If both are chosen, the Icon takes precedence.

### Large with Illustration

```vue demo
<dt-empty-state
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="50">
      <dt-button importance="clear">Action</dt-button>
      <dt-button>Action</dt-button>
    </dt-stack>
  </template>
  <template #illustration>
    <dt-illustration-nothing-to-see-here></dt-illustration-nothing-to-see-here>
  </template>
</dt-empty-state>
```

### Large with Icon

```vue demo
<dt-empty-state
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="50">
      <dt-button importance="clear">Action</dt-button>
      <dt-button>Action</dt-button>
    </dt-stack>
  </template>
  <template #icon="{ iconSize }">
    <dt-icon-box :size="iconSize"></dt-icon-box>
  </template>
</dt-empty-state>
```

### Medium with Illustration

```vue demo
<dt-empty-state
  :size="300"
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="50">
      <dt-button importance="clear">Action</dt-button>
      <dt-button>Action</dt-button>
    </dt-stack>
  </template>
  <template #illustration>
    <dt-illustration-nothing-to-see-here></dt-illustration-nothing-to-see-here>
  </template>
</dt-empty-state>
```

### Medium with Icon

```vue demo
<dt-empty-state
  :size="300"
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="50">
      <dt-button importance="clear">Action</dt-button>
      <dt-button>Action</dt-button>
    </dt-stack>
  </template>
  <template #icon="{ iconSize }">
    <dt-icon-box :size="iconSize"></dt-icon-box>
  </template>
</dt-empty-state>
```

### Small

```vue demo
<dt-empty-state
  :size="200"
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="50">
      <dt-button importance="clear">Action</dt-button>
      <dt-button>Action</dt-button>
    </dt-stack>
  </template>
  <template #icon="{ iconSize }">
    <dt-icon-box :size="iconSize"></dt-icon-box>
  </template>
</dt-empty-state>
```

## Examples

### No Actions

```vue demo
<dt-empty-state
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #illustration>
    <dt-illustration-nothing-to-see-here></dt-illustration-nothing-to-see-here>
  </template>
</dt-empty-state>
```

### No Description

```vue demo
<dt-empty-state
  header-text="Nothing to see here"
>
  <template #illustration>
    <dt-illustration-nothing-to-see-here></dt-illustration-nothing-to-see-here>
  </template>
</dt-empty-state>
```

### Everything

```vue demo
<dt-empty-state
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="50">
      <dt-button importance="clear">Action</dt-button>
      <dt-button>Action</dt-button>
    </dt-stack>
  </template>
  <template #illustration>
    <dt-illustration-nothing-to-see-here></dt-illustration-nothing-to-see-here>
  </template>
</dt-empty-state>
```

### Small, with Muted Actions

```vue demo
<dt-empty-state
  :size="200"
  header-text="Nothing to see here"
  body-text="Looks like there is no data to display here."
>
  <template #body>
    <dt-stack direction="row" gap="50">
      <dt-button kind="muted" :size="200" importance="clear">Action</dt-button>
      <dt-button kind="muted" importance="outlined" :size="200">Action</dt-button>
    </dt-stack>
  </template>
  <template #icon="{ iconSize }">
    <dt-icon-box :size="iconSize"></dt-icon-box>
  </template>
</dt-empty-state>
```

## Writing Guidelines

### Empty State Parts

#### Title

- Should be scannable and informative.
- Short and concise.

#### Description

- Short and to the point.
- Avoid repeating the title's message, favoring complementary and useful information.
- Inline text links (i.e. `<a class="d-link">...</a>`) may be appropriate given its use case, though first consider if it should be an action button.

#### Actions

- Follow existing writing guidelines for Dialtone's Button commponent.
- Connect its labels to the paired Title and Description.

### Scenarios

#### Zero State

Encourage and guide the user through product engagement.

```text
Title: No Ai recaps yet
Description: Enable Ai for calls and meetings and check back here!
Action: [Show me how]
```

#### No Results

Consider the user's intent and provide guidance to resolve in a useful result.

```text
Title: No matching results
Description: Try adjusting your search criteria or filters.
```

#### New Feature

Call out interesting new features or services, and entice the user to explore them.

```text
Title: Discover Ai recaps
Description: Enable Ai for calls and meetings to view and share a recap.
Action: [Tell me more]
```

#### Not Available

Be direct in communicating the unavailability of a feature or service, and provide quick actions.

```text
Title: Restricted access
Description: Permission required. You can request access from the owner.
Action: [Cancel] [Request access]
```

## Vue API

<component-vue-api component-name="empty_state" />

## Classes

At a minimum, empty state requires a body of content. It can optionally contain a header with buttons, or a footer with buttons/text.

<component-class-table component-name="empty-state"></component-class-table>

<script setup>
import {
  DtIllustrationNothingToSeeHere,
  DtIconBox,
} from '@dialpad/dialtone-icons/vue';
</script>
