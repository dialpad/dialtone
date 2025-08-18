---
title: Color Palette
shortTitle: palette
description: A functional, personal, and accessible color palette.
figma_url: https://www.figma.com/design/VjrRh4vvfONSmBQxnZrL3u/DT9-Design-Tokens--Rebrand-2025-?node-id=7712-1472&t=D8g6K4TrMGXNsvLT-11
---

## Foreground

Colors for text and icons

<DesignColorTable :excluded-colors="textColorsExclusionList" class-prefix="d-fc-">
  <template #example="{color}">
    <div
      class="d-bar-circle d-w42 d-h42 d-ba d-bc-moderate d-bas-dashed"
      :style="`background-color: var(${color.tokenName})`"
    />
    <span
      :class="[
        'd-fl0 d-fs-300 d-p6 d-fw-medium',
        color.utilityClass,
        { 'd-bgc-contrast': color.utilityClass.endsWith('inverted') },
      ]"
    >
      Aa
    </span>
  </template>
</DesignColorTable>

## Foreground Status

Foreground colors distinguishing important information with a status role.

<DesignColorTable :excluded-colors="statusTextColorsExclusionList" class-prefix="d-fc-">
  <template #example="{color}">
    <div
      class="d-bar-circle d-w42 d-h42 d-ba d-bc-moderate d-bas-dashed"
      :style="`background-color: var(${color.tokenName})`"
    />
    <span
      :class="[
        'd-fl0 d-fs-300 d-p6 d-fw-medium',
        color.utilityClass,
        { 'd-bgc-contrast': color.utilityClass.endsWith('inverted') },
      ]"
    >
      Aa
    </span>
  </template>
</DesignColorTable>

## Surface

Background colors for application UI surfaces. Surface colors are containing blocks — such as pages, modals, tables, headers, and cards — containing foreground content or elements.

<DesignColorTable :excluded-colors="surfaceColorsExclusionList" class-prefix="d-bgc-">
  <template #example="{color}">
    <div
      class="d-bar-circle d-w42 d-h42 d-ba d-bc-moderate d-bas-dashed"
      :style="`background: var(${color.tokenName})`"
    />
  </template>
</DesignColorTable>

## Borders

Define the edge of key content area, components, or surfaces.

<DesignColorTable class-prefix="d-bc-">
  <template #example="{color}">
    <div
      :class="[
        'd-d-inline-flex d-p4 d-bar-pill',
        { 'd-bgc-contrast': color.utilityClass.includes('inverted') },
      ]"
    >
      <div :class="`d-bar-circle d-w42 d-h42 d-ba d-bas-solid d-baw4 ${color.utilityClass}`"></div>
    </div>
  </template>
</DesignColorTable>

## Theme Shell

CSS variables for themeable parts of the UI, primarily targeting the top bar and left bar.

<ThemeColorTable></ThemeColorTable>

## Base Palette

Base colors are the literal value of all available colors. Use these only if all abstracted Text, Status text, Surface, or Border colors do not fit your need — consult a Product Designer.

Each of the colors listed above references these. For example, in Light mode
`var(--dt-color-foreground-primary)` is an alias to `var(--dt-color-black-900)`, and
`var(--dt-color-foreground-critical)` is an alias to
`var(--dt-color-red-300)`, and will have a different value in Dark mode.

### Light Theme

<ColorsCatalog theme="light"></ColorsCatalog>

### Dark Theme

<ColorsCatalog theme="dark"></ColorsCatalog>

<script setup>
import DesignColorTable from '@baseComponents/DesignColorTable.vue';
import ThemeColorTable from '@baseComponents/ThemeColorTable.vue';
import ColorsCatalog from '@views/ColorsCatalog.vue';

/*
* Remove unwanted background-clip classes
*@TODO: Remove this once background-clip classes are refactored to d-bgclip https://dialpad.atlassian.net/browse/DLT-2439
*/
const surfaceColorsExclusionList = ['box', 'text'];
const textColorsExclusionList = ['critical',  'success',  'warning',  'info'];
const statusTextColorsExclusionList = [
  'current',
  'transparent',
  'unset',
  'neutral',
  'primary',
  'secondary',
  'tertiary',
  'placeholder',
  'disabled',
  'muted',
];
</script>
