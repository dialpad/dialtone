---
title: Margins
description: Utilities to adjust an element's exterior spacing between other objects.
keywords: ["outer spacing", "gap", "offset", "margin inline start", "margin inline end", "margin block start", "margin block end"]
---

> [!WARNING]
> Avoid applying margins directly. Lean toward using layout components like [Stack](/components/stack/) for consistent and maintainable spacing **between** elements.

Use `d-m-{stop}` to set margin using spacing token stops. The number references the spacing token (`d-m-100` = `--dt-spacing-100` = 8px). Logical property aliases are also available: `d-mbs-{stop}` (margin-block-start), `d-mbe-{stop}` (margin-block-end), `d-mis-{stop}` (margin-inline-start), `d-mie-{stop}` (margin-inline-end).

## Add Margin to All Sides

```vue demo
<div class="d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-m-300 d-bgc-moderate d-bar-300 d-code--md">d-m-300</dt-stack></div>
```

## Add Margin to a Single Side

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" justify="center" gap="300" class="d-w100p">
  <div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mbs-150 d-p-200 d-bgc-moderate d-bber-300 d-code--md">d-mbs-150</dt-stack></div>
  <div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mie-200 d-p-200 d-bgc-moderate d-bisr-300 d-code--md">d-mie-200</dt-stack></div>
  <div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mbe-300 d-p-200 d-bgc-moderate d-bbsr-300 d-code--md">d-mbe-300</dt-stack></div>
  <div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mis-400 d-p-200 d-bgc-moderate d-bier-300 d-code--md">d-mis-400</dt-stack></div>
</dt-stack>
```

## Add Horizontal Margins

```vue demo
<div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mx-200 d-p-200 d-bgc-moderate d-code--md">d-mx-200</dt-stack></div>
```

## Add Vertical Margins

```vue demo
<div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-my-200 d-p-200 d-bgc-moderate d-code--sm">d-my-200</dt-stack></div>
```

## Negative Margins

Use `d-mbs-n{stop}` for negative margins. These use the `--dt-spacing-{stop}-negative` tokens.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" justify="center" gap="300" class="d-w100p">
  <div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mbs-n100 d-p-200 d-bgc-moderate d-code--md">d-mbs-n100</dt-stack></div>
  <div class="d-as-center d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mis-n200 d-p-200 d-bgc-moderate d-code--md">d-mis-n200</dt-stack></div>
</dt-stack>
```

## Auto Margins

Auto margins allow an element to fill a remaining space within an object. This is especially useful in flex layouts.

```vue demo
<!-- @wrapper -->
<dt-stack gap="200" class="d-w100p">
  <dt-stack direction="row" class="d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mx-auto d-p-200 d-bgc-moderate d-code--md">d-mx-auto</dt-stack></dt-stack>
  <dt-stack direction="row" class="d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mis-auto d-p-200 d-bgc-moderate d-code--md">d-mis-auto</dt-stack></dt-stack>
  <dt-stack direction="row" class="d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mie-auto d-p-200 d-bgc-moderate d-code--md">d-mie-auto</dt-stack></dt-stack>
</dt-stack>
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
