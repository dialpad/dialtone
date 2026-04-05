---
title: Margins
description: Utilities to adjust an element's exterior spacing between other objects.
keywords: ["outer spacing", "gap", "offset"]
---

> [!WARNING]
> Avoid applying margins directly. Lean toward using layout components like [Stack](/components/stack/) for consistent and maintainable spacing **between** elements.

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
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mbs-150 d-p-200 d-bgc-moderate d-bbr4 d-code--md">d-mbs-150</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mie-200 d-p-200 d-bgc-moderate d-brl4 d-code--md">d-mie-200</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mbe-300 d-p-200 d-bgc-moderate d-btr4 d-code--md">d-mbe-300</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mis-400 d-p-200 d-bgc-moderate d-brr4 d-code--md">d-mis-400</dt-stack></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-mbs-150 ...">d-mbs-150</div>
<div class="d-mie-200 ...">d-mie-200</div>
<div class="d-mbe-300 ...">d-mbe-300</div>
<div class="d-mis-400 ...">d-mis-400</div>
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

Use `d-mbs-n{stop}` for negative margins. These use the `--dt-spacing-{stop}-negative` tokens.

<code-well-header>
  <dt-stack direction="row" justify="center" gap="300" class="d-w100p">
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mbs-n100 d-p-200 d-bgc-moderate d-code--md">d-mbs-n100</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mis-n200 d-p-200 d-bgc-moderate d-code--md">d-mis-n200</dt-stack></div>
  </dt-stack>
</code-well-header>

```html
<div class="d-mbs-n100 ...">d-mbs-n100</div>
<div class="d-mis-n200 ...">d-mis-n200</div>
```

## Auto Margins

Auto margins allow an element to fill a remaining space within an object. This is especially useful in flex layouts.

<code-well-header>
  <dt-stack gap="200" class="d-w100p">
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mx-auto d-p-200 d-bgc-moderate d-code--md">d-mx-auto</dt-stack></dt-stack>
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mis-auto d-p-200 d-bgc-moderate d-code--md">d-mis-auto</dt-stack></dt-stack>
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mie-auto d-p-200 d-bgc-moderate d-code--md">d-mie-auto</dt-stack></dt-stack>
  </dt-stack>
</code-well-header>

```html
<div class="d-mx-auto ...">d-mx-auto</div>
<div class="d-mis-auto ...">d-mis-auto</div>
<div class="d-mie-auto ...">d-mie-auto</div>
```

## Classes

Margins can be added using `d-m-{stop}` or directional classes like `d-m{t|r|b|l|y|x}-{stop}`. Logical property aliases are also available: `d-mbs-{stop}` (margin-block-start), `d-mbe-{stop}` (margin-block-end), `d-mis-{stop}` (margin-inline-start), `d-mie-{stop}` (margin-inline-end).

It is highly recommended to use the [DtStack component](/components/stack.md) prior to applying margins individually.

<utility-class-table show-rendered>
  <template #content>
    <!-- Positive margins -->
    <tbody v-for="{ name: dir, deprecated } in directions">
      <tr v-for="{ value: val, output } in values">
        <th scope="row">
          <dt-stack gap="50">
            <span class="d-code--sm d-docsite-code">
              <span v-if="dir !== 'All'">d-m{{ dir[0] }}-{{ val }}</span>
              <span v-else>d-m-{{ val }}</span>
            </span>
            <span>
              <dt-badge v-if="deprecated" type="critical" kind="label" text="Deprecated" />
            </span>
          </dt-stack>
        </th>
        <td class="d-code--sm">
          <span v-if="dir == 'y'">
            margin-block: var(--dt-spacing-{{ val }}) !important;
          </span>
          <span v-else-if="dir == 'x'">
            margin-inline: var(--dt-spacing-{{ val }}) !important;
          </span>
          <span v-else>
            <span v-if="dir !== 'All'">margin-{{ dir === 'top' ? 'block-start' : dir === 'bottom' ? 'block-end' : dir === 'left' ? 'inline-start' : dir === 'right' ? 'inline-end' : dir }}: var(--dt-spacing-{{ val }}) !important; </span>
            <span v-else>margin: var(--dt-spacing-{{ val }}) !important</span>
          </span>
        </td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">{{ output }}</td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">{{ parseFloat(output) * 10 }}px</td>
      </tr>
    </tbody>
    <!-- Negative margins -->
    <tbody v-for="{ name: dir, deprecated } in directions">
      <tr v-for="{ value: val, output } in values.slice(1)">
        <th scope="row">
          <dt-stack gap="50">
            <span class="d-code--sm d-docsite-code">
              <span v-if="dir !== 'All'">d-m{{ dir[0] }}-n{{ val }}</span>
              <span v-else>d-m-n{{ val }}</span>
            </span>
            <span>
              <dt-badge v-if="deprecated" type="critical" kind="label" text="Deprecated" />
            </span>
          </dt-stack>
        </th>
        <td class="d-code--sm">
          <span v-if="dir == 'y'">
            margin-block: var(--dt-spacing-{{ val }}-negative) !important;
          </span>
          <span v-else-if="dir == 'x'">
            margin-inline: var(--dt-spacing-{{ val }}-negative) !important;
          </span>
          <span v-else>
            <span v-if="dir !== 'All'">margin-{{ dir === 'top' ? 'block-start' : dir === 'bottom' ? 'block-end' : dir === 'left' ? 'inline-start' : dir === 'right' ? 'inline-end' : dir }}: var(--dt-spacing-{{ val }}-negative) !important; </span>
            <span v-else>margin: var(--dt-spacing-{{ val }}-negative) !important</span>
          </span>
        </td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">-{{ output }}</td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">-{{ parseFloat(output) * 10 }}px</td>
      </tr>
    </tbody>
    <!-- Auto margins -->
    <tbody>
      <tr v-for="{ name: dir, deprecated } in directions">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="dir !== 'All'">d-m{{ dir[0] }}-auto</span>
          <span v-else>d-m-auto</span>
          <dt-badge v-if="deprecated" type="critical" kind="label" text="Deprecated" />
        </th>
        <td class="d-code--sm">
          <span v-if="dir == 'y'">
            margin-block: auto !important;
          </span>
          <span v-else-if="dir == 'x'">
            margin-inline: auto !important;
          </span>
          <span v-else>
            <span v-if="dir !== 'All'">margin-{{ dir === 'top' ? 'block-start' : dir === 'bottom' ? 'block-end' : dir === 'left' ? 'inline-start' : dir === 'right' ? 'inline-end' : dir }}: auto !important; </span>
            <span v-else>margin: auto !important</span>
          </span>
        </td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
      </tr>
    </tbody>
    <!-- Unset margins -->
    <tbody>
      <tr v-for="{ name: dir, deprecated } in directions">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="dir !== 'All'">d-m{{ dir[0] }}-unset</span>
          <span v-else>d-m-unset</span>
          <dt-badge v-if="deprecated" type="critical" kind="label" text="Deprecated" />
        </th>
        <td class="d-code--sm">
          <span v-if="dir == 'y'">
            margin-block: unset !important;
          </span>
          <span v-else-if="dir == 'x'">
            margin-inline: unset !important;
          </span>
          <span v-else>
            <span v-if="dir !== 'All'">margin-{{ dir === 'top' ? 'block-start' : dir === 'bottom' ? 'block-end' : dir === 'left' ? 'inline-start' : dir === 'right' ? 'inline-end' : dir }}: unset !important; </span>
            <span v-else>margin: unset !important</span>
          </span>
        </td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>
