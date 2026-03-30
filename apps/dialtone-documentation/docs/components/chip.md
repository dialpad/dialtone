---
title: Chip
description: A Chip is a compact UI element that provides brief, descriptive information about an element. It is terse, ideally one word.
status: ready
thumb: true
image: assets/images/components/chip.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-chip--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=9937-64802
keywords: ["tag", "pill", "token", "badge", "d-chip", "DtChip", "dt-chip", "filter chip", "choice chip"]
---

<component-combinator component-name="DtChip" />

## Variants and Examples

### Non Interactive

Add `:interactive="false"` to make it a read-only, non-interactive Chip. This changes it from a `<button>` to a non-interactive, read-only Chip with no events or hover/active state. Note that this does not effect the interactivity of its `×` remove button.

<code-example>
  <dt-chip :interactive="false">Chip</dt-chip>
</code-example>

### Default

<code-example>
  <dt-chip>Chip</dt-chip>
</code-example>

### Disabled

Use the `disabled` prop to disable both the Chip and its close button. This sets `aria-disabled="true"` and `tabindex="-1"` on the interactive elements and applies disabled styles, preventing pointer and keyboard interaction.

<code-example>
  <dt-chip disabled>Chip</dt-chip>
</code-example>

### Without Close Button

<code-example>
  <dt-chip :hide-close="true">Chip</dt-chip>
</code-example>

### With Icon

<code-example>
  <dt-chip :hide-close="true">
    <template #icon>
      <dt-icon
        name="phone"
        size="200"
      />
    </template>
    <template #default>
      Chip
    </template>
  </dt-chip>
</code-example>

### With Icon and Close Button

<code-example>
  <dt-chip>
    <template #icon>
      <dt-icon
        name="phone"
        size="200"
      />
    </template>
    <template #default>
      Chip
    </template>
  </dt-chip>
</code-example>

### With Avatar and Close Button

<code-example>
  <dt-chip>
    <template #avatar>
      <dt-avatar
        image-src="/assets/images/person.png"
        image-alt="Jaqueline Nackos"
        full-name="Jaqueline Nackos"
      />
    </template>
    <template #default>
      Chip
    </template>
  </dt-chip>
</code-example>

### Truncated

To truncate text, add `.d-truncate` to the content element, and set the width of the `.d-chip` element.

<code-example>
  <dt-chip content-class="d-w-150">
    <span class="d-chip__text d-truncate">Chip loooooong name</span>
  </dt-chip>
</code-example>

### Sizes

<code-example>
  <dt-stack direction="row" gap="400" data-demo-wrapper>
    <dt-chip :interactive="false" :size="100">Chip</dt-chip>
    <dt-chip :interactive="false" :size="200">Chip</dt-chip>
    <dt-chip :interactive="false">Chip</dt-chip>
  </dt-stack>
</code-example>

## Vue API

<component-vue-api component-name="chip" />

## Classes

<component-class-table component-name="chip" />

[//]: # (## Accessibility)
[//]: # (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa ante, tempus vitae lacus id, luctus tristique lorem. Mauris feugiat massa ex, id aliquet mi tempor non. Curabitur non tristique lectus. Fusce ut nisl non diam dignissim viverra. In posuere dui arcu, sed eleifend massa faucibus sed. Phasellus quis leo vitae erat pellentesque venenatis id vitae lectus. Suspendisse convallis, metus a congue tincidunt, velit sem tincidunt dui, eget auctor ipsum ipsum in ex. Nullam lobortis, mauris vel vestibulum rutrum, lorem elit vehicula est, nec viverra ante erat nec dolor. Proin at placerat tortor. Nam ullamcorper metus et eros porta, at lacinia leo scelerisque. Curabitur finibus sollicitudin odio tempor finibus. Donec lobortis metus vitae mollis gravida.)
