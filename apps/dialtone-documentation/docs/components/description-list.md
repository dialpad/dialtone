---
title: Description List
description: Description lists are a way to group and clarify associated ideas. They are notably useful when outlining and explaining terms, like those in a glossary.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-description-list--default
figma: planned
keywords: ["definition list", "key value", "dl", "d-description-list", "DtDescriptionList", "dt-description-list", "metadata list", "property list"]
---

<component-combinator component-name="DtDescriptionList" />

## Variants and Examples

### Default

<code-example>
  <div class="d-w-500" data-demo-wrapper>
    <dt-description-list
      gap="100"
      :items="items"
      direction="row"
    />
  </div>
</code-example>

### Column Direction

<code-example>
  <div class="d-w-500" data-demo-wrapper>
    <dt-description-list
      gap="100"
      :items="items"
      direction="column"
    />
  </div>
</code-example>

### Long Text

<code-example>
  <div class="d-w-500" data-demo-wrapper>
    <dt-description-list
      gap="100"
      :items="longTextItems"
      direction="row"
    />
  </div>
</code-example>

### With Term and Description Styles

<code-example>
  <div class="d-w-500" data-demo-wrapper>
    <dt-description-list
      gap="100"
      :items="items"
      direction="row"
      :termClass="[`d-fc-critical`, `d-fw-bold`]"
      :descriptionClass="[`d-fc-success`]"
    />
  </div>
</code-example>

## Vue API

<component-vue-api component-name="descriptionlist" />

<script setup>
const items = [
  {
    term: 'Local time',
    description: '10:36 AM (PST)',
  },
  {
    term: 'Dialpad',
    description: '(985) 241-8617',
  },
  {
    term: 'work',
    description: '+1 604-900-7909',
  },
  {
    term: 'email',
    description: 'jackeline.na@dialpad.com',
  },
];

const longTextItems = [
  {
    term: 'Customer Intent',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  },
  {
    term: 'Three word term',
    description: ` Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  },
];
</script>
