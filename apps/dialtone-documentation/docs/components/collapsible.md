---
title: Collapsible
description: Expandable region for showing or hiding related content.
status: ready
thumb: true
figma: planned
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-collapsible--default
keywords: ["accordion", "expand", "collapse", "toggle content", "d-collapsible", "DtCollapsible", "dt-collapsible", "disclosure", "expandable"]
combinator: DtCollapsible
---

The collapsible component consists of two parts: the anchor and the content. If the anchor slot is not filled, the anchor will default to a basic button with text. The content must be provided and is the element that can be hidden or shown when the anchor is clicked.

### Basic Usage Without Anchor Slot

```vue demo
<!-- @class d-d-block -->
<div>
  <dt-collapsible
    class="d-fc-primary"
    anchorText="Label 1"
    maxWidth="340px"
    initial-focus-element="first"
    >
    <template #content>
      <div class="d-ta-center d-ba d-bc-warning d-bgc-warning d-bas-dotted d-baw2 d-p-100 d-code--sm">(content slot)</div>
    </template>
  </dt-collapsible>
  <dt-collapsible
    anchorText="Label 2"
    maxWidth="340px"
    initial-focus-element="first"
  >
    <template #content>
      <div class="d-ta-center d-ba d-bc-warning d-bgc-warning d-bas-dotted d-baw2 d-p-100 d-code--sm">(content slot)</div>
    </template>
  </dt-collapsible>
</div>
```

### With Anchor Slot

```vue demo
<!-- @class d-d-block -->
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
```

## Vue API

<component-vue-api component-name="collapsible" />

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);

function toggleIsOpen () {
  isOpen.value = !isOpen.value;
}
</script>
