---
title: Description list
description: Description lists are a way to group and clarify associated ideas. They are notably useful when outlining and explaining terms, like those in a glossary.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-description-list--default
figma: planned
---

<code-well-header>
  <div class="d-w332">
    <dt-description-list
      gap="400"
      :items="items"
      direction="row"
    />
  </div>
</code-well-header>

## Variants and examples

### Default

<code-well-header>
  <div class="d-w332">
    <dt-description-list
      ref="exampleDefault"
      gap="400"
      :items="items"
      direction="row"
    />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.exampleDefault"
vueCode='
<dt-description-list
  ref="descriptionList"
  gap="400"
  :items="items"
  direction="row"
/>
'
/>

### Column direction

<code-well-header>
  <div class="d-w332">
    <dt-description-list
      ref="exampleColumn"
      gap="400"
      :items="items"
      direction="column"
    />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.exampleColumn"
vueCode='
<dt-description-list
  gap="400"
  :items="items"
  direction="column"
/>
'
/>

### Long text

<code-well-header>
  <div class="d-w332">
    <dt-description-list
      ref="exampleLongText"
      gap="400"
      :items="longTextItems"
      direction="row"
    />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.exampleLongText"
vueCode='
<dt-description-list
  gap="400"
  :items="longTextItems"
  direction="row"
/>
'
/>

### With term and description styles

<code-well-header>
  <div class="d-w332">
    <dt-description-list
      ref="exampleWithStyles"
      gap="400"
      :items="items"
      direction="row"
      :termClass="['d-fw-bold', 'd-fc-purple-400']"
      :descriptionClass="['d-fw-medium', 'd-fc-disabled']"
    />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.exampleWithStyles"
vueCode='
<dt-description-list
  gap="400"
  :items="items"
  direction="row"
  :termClass="[`d-fw-bold`, `d-fc-purple-400`]"
  :descriptionClass="[`d-fw-medium`, `d-fc-disabled`]"
/>
'
/>

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
