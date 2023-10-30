---
title: Collapsible
description: A collapsible is a component consisting of an interactive anchor that toggled the expandable/collapsible element.
status: ready
thumb: true
image: assets/images/components/collapsible.png
figma: planned
storybook: https://vue.dialpad.design/?path=/story/components-collapsible--default
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
        <div class="d-ta-center d-ba d-bc-gold-400 d-bgc-gold-100 d-bas-dotted d-baw2 d-p8 d-code-small">(content slot)</div>
      </template>
    </dt-collapsible>
    <dt-collapsible
      anchorText="Label 2"
      maxWidth="340px"
      initial-focus-element="first"
    >
      <template #content>
        <div class="d-ta-center d-ba d-bc-gold-400 d-bgc-gold-100 d-bas-dotted d-baw2 d-p8 d-code-small">(content slot)</div>
      </template>
    </dt-collapsible>
  </div>
</code-well-header>

## Vue API

<component-vue-api component-name="collapsible" />
