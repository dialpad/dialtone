---
title: Margins
description: Utilities to adjust an element's exterior spacing between other objects.
keywords: ["outer spacing", "gap", "offset"]
---

<dt-notice kind="warning" class="d-wmx100p d-mt-300" hideClose>
  Avoid applying margins directly. Lean toward using layout components like <dt-link to="/components/stack/" kind="muted">Stack</dt-link> for consistent and maintainable spacing <strong>between</strong> elements.
</dt-notice>

Use `d-m-{stop}` to set margin using spacing token stops. The number references the spacing token (`d-m-100` = `--dt-spacing-100` = 8px). Logical property aliases are also available: `d-mbs-{stop}` (margin-block-start), `d-mbe-{stop}` (margin-block-end), `d-mis-{stop}` (margin-inline-start), `d-mie-{stop}` (margin-inline-end).

## Add Margin to All Sides

<code-well-header>
  <div class="d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-m-300 d-bgc-moderate d-bar4 d-code--md">d-m-300</dt-stack></div>
</code-well-header>

```html
<div class="d-m-300 ...">d-m-300</div>
```

## Add Margin to a Single Side

<code-well-header>
  <dt-stack direction="row" justify="center" gap="300" class="d-w100p">
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mt-150 d-p-200 d-bgc-moderate d-bbr4 d-code--md">d-mt-150</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mr-200 d-p-200 d-bgc-moderate d-brl4 d-code--md">d-mr-200</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mb-300 d-p-200 d-bgc-moderate d-btr4 d-code--md">d-mb-300</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-ml-400 d-p-200 d-bgc-moderate d-brr4 d-code--md">d-ml-400</dt-stack></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-mt-150 ...">d-mt-150</div>
<div class="d-mr-200 ...">d-mr-200</div>
<div class="d-mb-300 ...">d-mb-300</div>
<div class="d-ml-400 ...">d-ml-400</div>
```

## Add Horizontal Margins

<code-well-header>
  <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mx-200 d-p-200 d-bgc-moderate d-code--md">d-mx-200</dt-stack></div>
</code-well-header>

```html
<div class="d-mx-200 ...">d-mx-200</div>
```

## Add Vertical Margins

<code-well-header>
  <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-my-200 d-p-200 d-bgc-moderate d-code--sm">d-my-200</dt-stack></div>
</code-well-header>

```html
<div class="d-my-200 ...">d-my-200</div>
```

## Negative Margins

Use `d-mt-n{stop}` for negative margins. These use the `--dt-spacing-{stop}-negative` tokens.

<code-well-header>
  <dt-stack direction="row" justify="center" gap="300" class="d-w100p">
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mt-n100 d-p-200 d-bgc-moderate d-code--md">d-mt-n100</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-ml-n200 d-p-200 d-bgc-moderate d-code--md">d-ml-n200</dt-stack></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-mt-n100 ...">d-mt-n100</div>
<div class="d-ml-n200 ...">d-ml-n200</div>
```

## Auto Margins

Auto margins allow an element to fill a remaining space within an object. This is especially useful in flex layouts.

<code-well-header>
  <dt-stack gap="200" class="d-w100p">
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mx-auto d-p-200 d-bgc-moderate d-code--md">d-mx-auto</dt-stack></dt-stack>
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-ml-auto d-p-200 d-bgc-moderate d-code--md">d-ml-auto</dt-stack></dt-stack>
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mr-auto d-p-200 d-bgc-moderate d-code--md">d-mr-auto</dt-stack></dt-stack>
  </dt-stack>
</code-well-header>

```html
<div class="d-mx-auto ...">d-mx-auto</div>
<div class="d-ml-auto ...">d-ml-auto</div>
<div class="d-mr-auto ...">d-mr-auto</div>
```

## Classes

Margins can be added using `d-m-{stop}` or directional classes like `d-m{t|r|b|l|y|x}-{stop}`. Logical property aliases group with physical names: `d-mt-{stop}` / `d-mbs-{stop}` share the same rule.

It is highly recommended to use the [stack component](/components/stack.md) or the [auto spacing classes](/utilities/spacing/auto-spacing.md) prior to applying margins individually.

<utility-class-table>
  <template #content>
    <!-- Positive margins -->
    <tbody v-for="i in directions">
      <tr v-for="{ value: val, output } in values">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}-{{ val }}</span>
          <span v-else>.d-m-{{ val }}</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-block-start: {{ output }} !important;<br/>
            margin-block-end: {{ output }} !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-inline-end: {{ output }} !important;<br/>
            margin-inline-start: {{ output }} !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}: {{ output }} !important; </span>
            <span v-else>margin: {{ output }} !important</span>
          </span>
        </td>
      </tr>
    </tbody>
    <!-- Negative margins -->
    <tbody v-for="i in directions">
      <tr v-for="{ value: val, output } in values.slice(1)">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}-n{{ val }}</span>
          <span v-else>.d-m-n{{ val }}</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-block-start: -{{ output }} !important;<br/>
            margin-block-end: -{{ output }} !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-inline-end: -{{ output }} !important;<br/>
            margin-inline-start: -{{ output }} !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}: -{{ output }} !important; </span>
            <span v-else>margin: -{{ output }} !important</span>
          </span>
        </td>
      </tr>
    </tbody>
    <!-- Auto margins -->
    <tbody>
      <tr v-for="i in directions">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}-auto</span>
          <span v-else>.d-m-auto</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-block-start: auto !important;<br/>
            margin-block-end: auto !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-inline-end: auto !important;<br/>
            margin-inline-start: auto !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}: auto !important; </span>
            <span v-else>margin: auto !important</span>
          </span>
        </td>
      </tr>
    </tbody>
    <!-- Unset margins -->
    <tbody>
      <tr v-for="i in directions">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}-unset</span>
          <span v-else>.d-m-unset</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-block-start: unset !important;<br/>
            margin-block-end: unset !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-inline-end: unset !important;<br/>
            margin-inline-start: unset !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i === 'top' ? 'block-start' : i === 'bottom' ? 'block-end' : i === 'left' ? 'inline-start' : i === 'right' ? 'inline-end' : i }}: unset !important; </span>
            <span v-else>margin: unset !important</span>
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>
