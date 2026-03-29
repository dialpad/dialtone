---
title: Padding
description: Utilities for setting an element's interior spacing between child elements and the element's box edge.
keywords: ["inner spacing", "inset"]
---

<dt-notice kind="info" class="d-wmx100p d-my-200" hideClose>
  Padding CSS Utilities are most appropriate for padding on the <strong>sides</strong> of an element. Avoiding using it to create spacing <strong>between</strong> elements. Instead, favor the <dt-link to="/components/stack/" kind="muted">Stack</dt-link> component and its <code>gap</code> property for spacing between. It can still be combined with flex utilities to create more complex layouts.
</dt-notice>

Use `d-p-{stop}` to set padding using spacing token stops. The number references the spacing token (`d-p-100` = `--dt-spacing-100` = 8px).

## Add Padding to All Sides

<code-well-header>
  <div class="d-size-200 d-p-200 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-h100p d-bgc-moderate d-bar4 d-code--md">d-p-200</dt-stack></div>
</code-well-header>

```html
<div class="d-p-200 ...">d-p-200</div>
```

## Add Padding to a Single Side

<code-well-header>
  <dt-stack direction="row" justify="center" gap="300" class="d-fw-wrap d-w100p">
    <div class="d-as-center d-pbs-150 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bbr4 d-code--md">d-pbs-150</dt-stack></div>
    <div class="d-as-center d-pie-200 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-brl4 d-code--md">d-pie-200</dt-stack></div>
    <div class="d-as-center d-pbe-300 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-btr4 d-code--md">d-pbe-300</dt-stack></div>
    <div class="d-as-center d-pis-400 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-brr4 d-code--md">d-pis-400</dt-stack></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-pbs-150 ...">d-pbs-150</div>
<div class="d-pie-200 ...">d-pie-200</div>
<div class="d-pbe-300 ...">d-pbe-300</div>
<div class="d-pis-400 ...">d-pis-400</div>
```

## Add Horizontal Padding

<code-well-header>
  <div class="d-as-center d-px-200 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--md">d-px-200</dt-stack></div>
</code-well-header>

```html
<div class="d-px-200 ...">d-px-200</div>
```

## Add Vertical Padding

<code-well-header>
  <div class="d-as-center d-py-300 d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--md">d-py-300</dt-stack></div>
</code-well-header>

```html
<div class="d-py-300 ...">d-py-300</div>
```

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>

## Classes

Padding can be added to an element by using `d-p-{stop}` or a directional class like `d-p{t|r|b|l|y|x}-{stop}`. Logical property aliases are also available: `d-pbs-{stop}` (padding-block-start), `d-pbe-{stop}` (padding-block-end), `d-pis-{stop}` (padding-inline-start), `d-pie-{stop}` (padding-inline-end).

<utility-class-table>
  <template #content>
    <!-- Positive paddings -->
    <tbody v-for="i in directions">
        <tr v-for="{ value: val, output } in values">
            <th scope="row" class="d-code--sm d-docsite-code">
              <span v-if="i !== 'All'">.d-p{{ i[0] }}-{{ val }}</span>
              <span v-else>.d-p-{{ val }}</span>
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
            padding-block: unset !important;
          </span>
          <span v-else-if="i == 'x'">
            padding-inline: unset !important;
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
