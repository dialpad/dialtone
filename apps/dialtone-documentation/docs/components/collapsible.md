---
title: Collapsible
description: A collapsible is a component consisting of an interactive anchor that toggled the expandable/collapsible element.
status: ready
thumb: true
image: assets/images/components/collapsible.png
figma: planned
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-collapsible--default
---

<code-well-header>
  <div>
    <dt-collapsible
      class="d-fc-primary"
      anchorText="Label 1"
      maxWidth="340px"
      initial-focus-element="first"
      >
      <template #content>
        <div class="d-ta-center d-ba d-bc-gold-400 d-bgc-gold-100 d-bas-dotted d-baw2 d-p8 d-code--sm">(content slot)</div>
      </template>
    </dt-collapsible>
    <dt-collapsible
      anchorText="Label 2"
      maxWidth="340px"
      initial-focus-element="first"
    >
      <template #content>
        <div class="d-ta-center d-ba d-bc-gold-400 d-bgc-gold-100 d-bas-dotted d-baw2 d-p8 d-code--sm">(content slot)</div>
      </template>
    </dt-collapsible>
  </div>
</code-well-header>

The collapsible component consists of two parts: the anchor and the content. If the anchor slot is not filled, the anchor will default to a basic button with text. The content must be provided and is the element that can be hidden or shown when the anchor is clicked.

### Basic usage without anchor slot

<code-well-header class="d-d-block">
  <dt-collapsible
    anchorText="Click me to toggle Content"
    ref="example-collapsible"
    >
    <template #content>
      <div>Content slot</div>
    </template>
  </dt-collapsible>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['example-collapsible']"
vueCode='
<dt-collapsible
  anchorText="Click me to toggle Content"
>
  <template #content>
    <div>Content slot</div>
  </template>
</dt-collapsible>
'
/>

### With anchor slot

<code-well-header class="d-d-block">
  <dt-collapsible :open="isOpen" ref="with-anchor-slot">
    <template #anchor>
      <dt-button @click="toggleIsOpen">
        Click Me!
      </dt-button>
    </template>
    <template #content>
      <div>
        This will be shown in the expanded area.
      </div>
    </template>
  </dt-collapsible>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['with-anchor-slot']"
vueCode='
<dt-collapsible :open="isOpen">
  <template #anchor>
    <dt-button @click="toggleIsOpen">
      Click Me!
    </dt-button>
  </template>
  <template #content>
    <div>
      This will be shown in the expanded area.
    </div>
  </template>
</dt-collapsible>
'
/>

## Vue API

<component-vue-api component-name="collapsible" />

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

function toggleIsOpen () {
  isOpen.value = !isOpen.value;
}
</script>
