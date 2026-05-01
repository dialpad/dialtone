---
title: Padding
description: Utilities for setting an element's interior spacing between child elements and the element's box edge.
keywords: ["inner spacing", "inset", "padding inline start", "padding inline end", "padding block start", "padding block end"]
---

> [!INFO] Consider DtBox and DtStack first
>
> - Favor using the [DtBox](/components/box.md) component and its padding properties.
> - Avoid using padding or margin utilities for spacing **between** elements. Instead, favor the [DtStack](/components/stack.md) component and its `gap` property for spacing between.

Use `d-p-{stop}` to set padding using spacing token stops. The number references the spacing token (`d-p-100` = `--dt-spacing-100` = 8px).

## Add Padding to All Sides

```vue demo
<div class="d-size-200 d-p-200 d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-fl1 d-h100p d-bgc-moderate d-bar-300 d-code--md">d-p-200</dt-stack></div>
```

## Add Padding to a Single Side

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" justify="center" gap="300" class="d-fw-wrap d-w100p">
  <div class="d-as-center d-pbs-150 d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bber-300 d-code--md">d-pbs-150</dt-stack></div>
  <div class="d-as-center d-pie-200 d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-brl4 d-code--md">d-pie-200</dt-stack></div>
  <div class="d-as-center d-pbe-300 d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bbsr-300 d-code--md">d-pbe-300</dt-stack></div>
  <div class="d-as-center d-pis-400 d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bier-300 d-code--md">d-pis-400</dt-stack></div>
</dt-stack>
```

## Add Horizontal Padding

```vue demo
<div class="d-as-center d-px-200 d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--md">d-px-200</dt-stack></div>
```

## Add Vertical Padding

```vue demo
<div class="d-as-center d-py-300 d-bar-400 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--md">d-py-300</dt-stack></div>
```

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>

## Classes

Padding can be added to an element by using `d-p-{stop}` or a directional class like `d-p{t|r|b|l|y|x}-{stop}`. Logical property aliases are also available: `d-pbs-{stop}` (padding-block-start), `d-pbe-{stop}` (padding-block-end), `d-pis-{stop}` (padding-inline-start), `d-pie-{stop}` (padding-inline-end).

It is highly recommended to use the [DtBox component](/components/box.md) before applying padding individually.

<utility-class-table show-rendered>
  <template #content>
    <!-- Positive paddings -->
    <tbody v-for="{ name: dir, deprecated } in directions">
        <tr v-for="{ value: val, output } in values">
            <th scope="row">
              <dt-stack gap="50">
                <span class="d-code--sm d-docsite-code">
                  <span v-if="dir !== 'All'">d-p{{ dir[0] }}-{{ val }}</span>
                  <span v-else>d-p-{{ val }}</span>
                </span>
                <span>
                  <dt-badge v-if="deprecated" type="critical" kind="label" text="Deprecated" />
                </span>
              </dt-stack>
            </th>
            <td class="d-code--sm">
                <span v-if="dir == 'y'">
                  padding-block: var(--dt-spacing-{{ val }}) !important;
                </span>
                <span v-else-if="dir == 'x'">
                  padding-inline: var(--dt-spacing-{{ val }}) !important;
                </span>
                <span v-else>
                  <span v-if="dir !== 'All'">padding-{{ dir === 'top' ? 'block-start' : dir === 'bottom' ? 'block-end' : dir === 'left' ? 'inline-start' : dir === 'right' ? 'inline-end' : dir }}: var(--dt-spacing-{{ val }}) !important; </span>
                  <span v-else>padding: var(--dt-spacing-{{ val }}) !important</span>
                </span>
            </td>
            <td class="d-code--sm d-fc-tertiary d-ta-right">{{ output }}</td>
            <td class="d-code--sm d-fc-tertiary d-ta-right">{{ parseFloat(output) * 10 }}px</td>
        </tr>
    </tbody>
    <!-- Unset paddings -->
    <tbody>
      <tr v-for="{ name: dir, deprecated } in directions">
        <th scope="row">
          <dt-stack gap="50">
            <span class="d-code--sm d-docsite-code">
              <span v-if="dir !== 'All'">d-p{{ dir[0] }}-unset</span>
              <span v-else>d-p-unset</span>
            </span>
            <span>
              <dt-badge v-if="deprecated" type="critical" kind="label" text="Deprecated" />
            </span>
          </dt-stack>
        </th>
        <td class="d-code--sm">
          <span v-if="dir == 'y'">
            padding-block: unset !important;
          </span>
          <span v-else-if="dir == 'x'">
            padding-inline: unset !important;
          </span>
          <span v-else>
            <span v-if="dir !== 'All'">padding-{{ dir === 'top' ? 'block-start' : dir === 'bottom' ? 'block-end' : dir === 'left' ? 'inline-start' : dir === 'right' ? 'inline-end' : dir }}: unset !important; </span>
            <span v-else>padding: unset !important</span>
          </span>
        </td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
