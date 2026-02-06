---
title: Padding
description: Utilities for setting an element's interior spacing between child elements and the element's box edge.
---

<dt-notice kind="info" class="d-wmx100p d-mt24" hideClose>
  Padding CSS Utilities are most appropriate for padding on the <strong>sides</strong> of an element. Avoiding using it to create spacing <strong>between</strong> elements. Instead, favor the <router-link class="d-link d-link--muted" to="/components/stack/">Stack</router-link> component and its <code>gap</code> property for spacing between. It can still be combined with flex utilities to create more complex layouts.
</dt-notice>

## Add Padding to All Sides

<code-well-header>
  <div class="d-h128 d-w128 d-p16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-h100p d-bgc-moderate d-bar4 d-code--md">d-p16</dt-stack></div>
</code-well-header>

```html
<div class="d-p8 ...">d-p8</div>
```

## Add Padding to a Single Side

<code-well-header>
  <dt-stack direction="row" justify="center" gap="550" class="d-fw-wrap d-w100p">
    <div class="d-as-center d-pt12 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bbr4 d-code--md">d-pt12</dt-stack></div>
    <div class="d-as-center d-pr16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-brl4 d-code--md">d-pr16</dt-stack></div>
    <div class="d-as-center d-pb24 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-btr4 d-code--md">d-pb24</dt-stack></div>
    <div class="d-as-center d-pl32 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-brr4 d-code--md">d-pl32</dt-stack></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-pt12 ...">d-pt12</div>
<div class="d-pr16 ...">d-pr16</div>
<div class="d-pb24 ...">d-pb24</div>
<div class="d-pl32 ...">d-pl32</div>
```

## Add Horizontal Padding

<code-well-header>
  <div class="d-as-center d-px16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-code--md">d-px16</dt-stack></div>
</code-well-header>

```html
<div class="d-px16 ...">d-px16</div>
```

## Add Vertical Padding

<code-well-header>
  <div class="d-as-center d-py16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-code--md">d-py16</dt-stack></div>
</code-well-header>

```html
<div class="d-py24 ...">d-py24</div>
```

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>

## Classes

Padding can be added to an element by using a utility class (i.e. `.d-p[#]`) or by using a directional class (i.e. `.d-p{t|r|b|l|y|x}[#]`).

<utility-class-table>
  <template #content>
    <!-- Positive paddings -->
    <tbody v-for="i in directions">
        <tr v-for="{ value: val, output } in values">
            <th scope="row" class="d-code--sm d-docsite-code">
              <span v-if="i !== 'All'">.d-p{{ i[0] }}{{ val }}</span>
              <span v-else>.d-p{{ val }}</span>
            </th>
            <td class="d-code--sm">
                <span v-if="i == 'y'">
                  padding-block-start: {{ output }} !important;<br/>
                  padding-block-end: {{ output }} !important;
                </span>
                <span v-else-if="i == 'x'">
                  padding-inline-end: {{ output }} !important;<br/>
                  padding-inline-start: {{ output }} !important;
                </span>
                <span v-else>
                  <span v-if="i !== 'All'">padding-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}: {{ output }} !important; </span>
                  <span v-else>padding: {{ output }} !important</span>
                </span>
            </td>
        </tr>
    </tbody>
    <!-- Unset paddings -->
    <tbody>
      <tr v-for="i in directions">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-p{{ i[0] }}-unset</span>
          <span v-else>.d-p-unset</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            padding-block-start: unset !important;<br/>
            padding-block-end: unset !important;
          </span>
          <span v-else-if="i == 'x'">
            padding-inline-end: unset !important;<br/>
            padding-inline-start: unset !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">padding-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}: unset !important; </span>
            <span v-else>padding: unset !important</span>
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
