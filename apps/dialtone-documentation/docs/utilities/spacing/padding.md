---
title: Padding
description: Utilities for setting an element's interior spacing between child elements and the element's box edge.
---

<dt-notice kind="info" class="d-wmx100p d-mt24" hideClose>
  Padding CSS Utilities are most appropriate for padding on the <strong>sides</strong> of an element. Avoiding using it to create spacing <strong>between</strong> elements. Instead, favor the <router-link class="d-link d-link--muted" to="/components/stack/">Stack</router-link> component and its <code>gap</code> property for spacing between. It can still be combined with flex utilities to create more complex layouts.
</dt-notice>

## Add Padding to All Sides

<code-well-header>
  <div class="d-h128 d-w128 d-p16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-h100p d-bgc-moderate d-bar4 d-code--md" data-migrate-outline>d-p16</dt-stack></div>
</code-well-header>

```html
<div class="d-p8 ...">d-p8</div>
```

## Add Padding to a Single Side

<code-well-header>
  <div class="d-d-flex d-fw-wrap d-ai-start d-jc-center d-w100p d-flow24">
    <div class="d-as-center d-pt12 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bbr4 d-code--md" data-migrate-outline>d-pt12</dt-stack></div>
    <div class="d-as-center d-pr16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-brl4 d-code--md" data-migrate-outline>d-pr16</dt-stack></div>
    <div class="d-as-center d-pb24 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-btr4 d-code--md" data-migrate-outline>d-pb24</dt-stack></div>
    <div class="d-as-center d-pl32 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-brr4 d-code--md" data-migrate-outline>d-pl32</dt-stack></div>
  </div>
</code-well-header>

```html
<div class="d-pt12 ...">d-pt12</div>
<div class="d-pr16 ...">d-pr16</div>
<div class="d-pb24 ...">d-pb24</div>
<div class="d-pl32 ...">d-pl32</div>
```

## Add Horizontal Padding

<code-well-header>
  <div class="d-as-center d-px16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-code--md" data-migrate-outline>d-px16</dt-stack></div>
</code-well-header>

```html
<div class="d-px16 ...">d-px16</div>
```

## Add Vertical Padding

<code-well-header>
  <div class="d-as-center d-py16 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-code--md" data-migrate-outline>d-py16</dt-stack></div>
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
                  padding-top: {{ output }} !important;<br/>
                  padding-bottom: {{ output }} !important;
                </span>
                <span v-else-if="i == 'x'">
                  padding-right: {{ output }} !important;<br/>
                  padding-left: {{ output }} !important;
                </span>
                <span v-else>
                  <span v-if="i !== 'All'">padding-{{ i }}: {{ output }} !important; </span>
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
            padding-top: unset !important;<br/>
            padding-bottom: unset !important;
          </span>
          <span v-else-if="i == 'x'">
            padding-right: unset !important;<br/>
            padding-left: unset !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">padding-{{ i }}: unset !important; </span>
            <span v-else>padding: unset !important</span>
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
