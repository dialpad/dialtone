---
title: Segmented Control
description: Single-select, all-options-visible control for switching views, scopes, or modes within the same context.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-segmented-control--default
keywords: ["segmented control", "toggle group", "button toggle", "radio group", "d-segmented-control", "DtSegmentedControl", "dt-segmented-control", "select", "scope", "content switcher"]
---

<code-example only-show="demo">
  <dt-segmented-control v-model="selected" aria-label="View filter">
    <dt-segmented-control-item value="all">All</dt-segmented-control-item>
    <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
    <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
    <dt-segmented-control-item value="groups">Groups</dt-segmented-control-item>
  </dt-segmented-control>
</code-example>

<component-combinator component-name="DtSegmentedControl" />

## Usage

A segmented control is a **mutually exclusive**, single-select control where all options are visible at once. Only one item can be selected at a time, and there is always one item selected. It is commonly used to switch between different **views or formats of the same content** — such as toggling between grid and list view, or filtering between "All", "Favorites", and "Recent".

Each `dt-segmented-control-item` wraps a `DtButton` internally and inherits its slot and prop surface, including `#startIcon`, `#endIcon`, `#leading`, `#trailing`, `disabled`, and `label-class`.

### Segmented Control vs. Tabs

| | Segmented Control | Tabs |
|---|---|---|
| **Purpose** | Switch between **views or formats** of the same content | Navigate between **distinct content sections** |
| **Content relationship** | Same data, different presentation (e.g., grid vs. list) | Different data in each section (the filing cabinet metaphor — each tab holds different papers) |
| **Hierarchy** | Lower-level, often **within** a tabbed section | Top-level content organization |
| **ARIA role** | `radiogroup` with `radio` items | `tablist` with `tab` items and associated `tabpanel`s |
| **Content panel** | None — consumers manage their own view switching | Built-in panel association via `aria-controls` |

### Guidelines

<dialtone-usage>
<template #do>

- Use when presenting **2–5 mutually exclusive options** that control the same content area.
- Use concise labels — **1–3 words** that describe the view the user will see.
- Keep label lengths consistent across items for visual balance.
- Use for switching between **views or formats**: grid/list, all/filtered, map/satellite.
- Provide an `aria-label` on the segmented control that describes the purpose of the group.
- Use the `label` prop on icon-only items for accessibility.

</template>

<template #dont>

- Don't use for **navigation between distinct content sections** — use <dt-link to="tabs.html">Tabs</dt-link> instead.
- Don't use for **binary on/off choices** — use a <dt-link to="toggle.html">Toggle</dt-link> instead.
- Don't use for **more than 5 options** — consider a <dt-link to="select-menu.html">Select Menu</dt-link> or <dt-link to="chip.html">Chip</dt-link> group.
- Don't mix text-only and icon-only items within the same control.
- Don't use to **trigger actions** — use a <dt-link to="button.html">Button</dt-link> or <dt-link to="button-group.html">Button Group</dt-link> instead.

</template>

</dialtone-usage>

## Variants

### Default

<code-example>
  <div class="d-w100p" data-demo-wrapper>
    <dt-segmented-control v-model="selected" aria-label="View filter">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
      <dt-segmented-control-item value="groups">Groups</dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</code-example>

### Borderless

Remove the border and padding from the container.

<code-example vueCode='
<dt-segmented-control v-model="selected" borderless>
  ...
</dt-segmented-control>
'>
  <div class="d-w100p" data-demo-wrapper>
    <dt-segmented-control v-model="selected" borderless aria-label="View filter">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
      <dt-segmented-control-item value="groups">Groups</dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</code-example>

### Hide Divider

<code-example vueCode='
<dt-segmented-control v-model="selected" hide-divider>
  ...
</dt-segmented-control>
'>
  <div class="d-w100p" data-demo-wrapper>
    <dt-segmented-control v-model="selected" hide-divider aria-label="View filter">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
      <dt-segmented-control-item value="groups">Groups</dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</code-example>

### Spread Evenly

Items share space equally. Only applies in horizontal orientation.

<code-example vueCode='
<dt-segmented-control v-model="selected" spread="evenly">
  ...
</dt-segmented-control>
'>
  <div class="d-w464" data-demo-wrapper>
    <dt-segmented-control v-model="spreadSelected" spread="evenly" aria-label="Spread example">
      <dt-segmented-control-item value="1">1</dt-segmented-control-item>
      <dt-segmented-control-item value="two">Two</dt-segmented-control-item>
      <dt-segmented-control-item value="three">Three</dt-segmented-control-item>
      <dt-segmented-control-item value="four">Four long label</dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</code-example>

### Disabled

Add `disabled` to the group to disable all items.

<code-example vueCode='
<dt-segmented-control v-model="selected" disabled>
  ...
</dt-segmented-control>
'>
  <div class="d-w100p" data-demo-wrapper>
    <dt-segmented-control v-model="selected" disabled aria-label="Disabled example" hide-divider>
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</code-example>

Add `disabled` to an individual item.

<code-example>
  <div class="d-w100p" data-demo-wrapper>
    <dt-segmented-control v-model="selected" aria-label="Individual disabled example">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites" disabled>Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
      <dt-segmented-control-item value="groups">Groups</dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</code-example>

## Sizes

<code-example vueCode='
<dt-segmented-control v-model="selected" :size="100|200|300|400|500">
  ...
</dt-segmented-control>
'>
  <dt-stack gap="400" class="d-w100p" data-demo-wrapper>
    <dt-segmented-control v-model="selected" :size="100" aria-label="Extra small">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
    </dt-segmented-control>
    <dt-segmented-control v-model="selected" aria-label="Small (default)">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
    </dt-segmented-control>
    <dt-segmented-control v-model="selected" :size="300" aria-label="Medium">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
    </dt-segmented-control>
    <dt-segmented-control v-model="selected" :size="400" aria-label="Large">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
    </dt-segmented-control>
    <dt-segmented-control v-model="selected" :size="500" aria-label="Extra large">
      <dt-segmented-control-item value="all">All</dt-segmented-control-item>
      <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
      <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
    </dt-segmented-control>
  </dt-stack>
</code-example>

## Slots

### Icon

Use the `#startIcon` or `#endIcon` slot on `dt-segmented-control-item` to add an icon. The slot provides `iconSize` to match the control's size.

<code-example>
  <div class="d-w100p" data-demo-wrapper>
    <dt-segmented-control v-model="iconSelected" aria-label="List spacing">
      <dt-segmented-control-item value="compact">
        <template #startIcon="{ iconSize }">
          <dt-icon name="list-spacing-compact" :size="iconSize" />
        </template>
        Compact
      </dt-segmented-control-item>
      <dt-segmented-control-item value="regular">
        <template #startIcon="{ iconSize }">
          <dt-icon name="list-spacing-regular" :size="iconSize" />
        </template>
        Regular
      </dt-segmented-control-item>
      <dt-segmented-control-item value="expanded">
        <template #startIcon="{ iconSize }">
          <dt-icon name="list-spacing-expanded" :size="iconSize" />
        </template>
        Expanded
      </dt-segmented-control-item>
    </dt-segmented-control>
  </div>
</code-example>

### Icon Only

Omit the default slot text to create icon-only items. Use the `label` prop for accessibility.

<code-example>
  <dt-stack gap="400" class="d-w464" data-demo-wrapper>
    <div>
      <dt-segmented-control v-model="iconOnlySelected" aria-label="Appearance mode">
        <dt-segmented-control-item value="system" label="System">
          <template #startIcon="{ iconSize }">
            <dt-icon name="laptop-2" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item value="light" label="Light">
          <template #startIcon="{ iconSize }">
            <dt-icon name="sun" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item value="dark" label="Dark">
          <template #startIcon="{ iconSize }">
            <dt-icon name="moon" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
      </dt-segmented-control>
    </div>
    <div>
      <dt-segmented-control v-model="iconOnlySelected" aria-label="Appearance mode" class="d-d-inline-flex">
        <dt-segmented-control-item value="system" label="System">
          <template #startIcon="{ iconSize }">
            <dt-icon name="laptop-2" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item value="light" label="Light">
          <template #startIcon="{ iconSize }">
            <dt-icon name="sun" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item value="dark" label="Dark">
          <template #startIcon="{ iconSize }">
            <dt-icon name="moon" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
      </dt-segmented-control>
    </div>
  </dt-stack>
</code-example>

### Leading & Trailing

Use the `#leading` and `#trailing` slots on `dt-segmented-control-item` to render content alongside labels, such as badges or count indicators.

<code-example>
  <dt-segmented-control v-model="trailingSelected" aria-label="Fruit counts">
    <dt-segmented-control-item value="apples" trailingClass="d-pr8">
      Apples
      <template #trailing>
        <dt-badge kind="count">24</dt-badge>
      </template>
    </dt-segmented-control-item>
    <dt-segmented-control-item value="oranges" trailingClass="d-pr8">
      Oranges
      <template #trailing>
        <dt-badge kind="count">8</dt-badge>
      </template>
    </dt-segmented-control-item>
    <dt-segmented-control-item value="bananas" trailingClass="d-pr8">
      Bananas
      <template #trailing>
        <dt-badge kind="count">15</dt-badge>
      </template>
    </dt-segmented-control-item>
  </dt-segmented-control>
</code-example>

## Orientation

Set `orientation="vertical"` to stack items vertically.

<code-example vueCode='
<dt-segmented-control v-model="selected" orientation="vertical">
  ...
</dt-segmented-control>
'>
  <dt-stack direction="row" gap="500" align="start">
    <div class="d-w164">
      <dt-segmented-control v-model="selected" orientation="vertical" aria-label="Vertical example">
        <dt-segmented-control-item value="all">
          System
          <template #startIcon="{ iconSize }">
            <dt-icon name="laptop-2" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item value="favorites">
          Light
          <template #startIcon="{ iconSize }">
            <dt-icon name="sun" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
        <dt-segmented-control-item value="recent">
          Dark
          <template #startIcon="{ iconSize }">
            <dt-icon name="moon" :size="iconSize" />
          </template>
        </dt-segmented-control-item>
      </dt-segmented-control>
    </div>
    <dt-segmented-control v-model="iconOnlySelected" aria-label="Appearance mode" orientation="vertical">
      <dt-segmented-control-item value="system" label="System">
        <template #startIcon="{ iconSize }">
          <dt-icon name="laptop-2" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
      <dt-segmented-control-item value="light" label="Light">
        <template #startIcon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
      <dt-segmented-control-item value="dark" label="Dark">
        <template #startIcon="{ iconSize }">
          <dt-icon name="moon" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
    </dt-segmented-control>
  </dt-stack>
</code-example>

## Advanced Usages

### Manual Activation Mode

By default, items select immediately on focus via arrow keys, following the <a class="d-link" href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/" target="_blank">WAI-ARIA Radio Group pattern</a>. Set `activation-mode="manual"` to require an explicit `Enter` or `Space` keypress after focusing an item.

<code-example vueCode='
<dt-segmented-control v-model="selected" activation-mode="manual">
  ...
</dt-segmented-control>
'>
  <dt-segmented-control v-model="selected" activation-mode="manual" aria-label="Manual activation">
    <dt-segmented-control-item value="all">All</dt-segmented-control-item>
    <dt-segmented-control-item value="favorites">Favorites</dt-segmented-control-item>
    <dt-segmented-control-item value="recent">Recent</dt-segmented-control-item>
  </dt-segmented-control>
</code-example>

## Vue API

### Segmented Control

<component-vue-api component-name="segmentedcontrol" :also-import="['segmentedcontrolitem']" />

### Segmented Control Item

<component-vue-api component-name="segmentedcontrolitem" :show-import="false" />

## Classes

<component-class-table component-name="segmented-control" />

## Accessibility

The segmented control implements the <a class="d-link" href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/" target="_blank">WAI-ARIA Radio Group pattern</a> with roving tabindex for keyboard navigation.

<component-accessible-table component-name="segmented-control" />

<script setup>
import { ref } from 'vue';

const selected = ref('all');
const spreadSelected = ref('1');
const iconSelected = ref('compact');
const iconOnlySelected = ref('system');
const trailingSelected = ref('apples');
</script>
