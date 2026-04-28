---
title: Product Color Palette
shortTitle: palette
description: Representative Design Tokens and CSS Utilities for foreground, surfaces, and border colors.
figma_url: https://www.figma.com/design/VjrRh4vvfONSmBQxnZrL3u/DT9-Design-Tokens--Rebrand-2025-?node-id=7712-1472&t=D8g6K4TrMGXNsvLT-11
keywords: ["swatches","token","color system", "foreground", "surface", "border"]
---

## Foreground

Colors for text and icons

<DesignColorTable :excluded-colors="textColorsExclusionList" class-prefix="d-fc-">
  <template #example="{color}">
    <div
      class="d-bar-circle d-size-75 d-ba d-bc-moderate d-bas-dashed"
      :style="`background-color: var(${color.tokenName})`"
    />
    <span
      :class="[
        'd-fl0 d-fs-300 d-p-75 d-fw-medium',
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
      class="d-bar-circle d-size-75 d-ba d-bc-moderate d-bas-dashed"
      :style="`background-color: var(${color.tokenName})`"
    />
    <span
      :class="[
        'd-fl0 d-fs-300 d-p-75 d-fw-medium',
        color.utilityClass,
        { 'd-bgc-contrast': color.utilityClass.endsWith('inverted') },
      ]"
    >
      Aa
    </span>
  </template>
</DesignColorTable>

## Surface

Background colors for application UI surfaces. Surface colors are container blocks — such as pages, modals, tables, headers, and cards — containing foreground content or elements.

<DesignColorTable :excluded-colors="surfaceColorsExclusionList" class-prefix="d-bgc-">
  <template #example="{color}">
    <div
      class="d-bar-circle d-size-75 d-ba d-bc-moderate d-bas-dashed"
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
        'd-d-inline-flex d-p-50 d-bar-pill',
        { 'd-bgc-contrast': color.utilityClass.includes('inverted') },
      ]"
    >
      <div :class="`d-bar-circle d-size-75 d-ba d-bas-solid d-baw4 ${color.utilityClass}`"></div>
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

<dt-tab-group outlined activation-mode="auto" size="200">
  <template #tabs>
    <dt-tab id="1" panel-id="2" selected>
      Light Mode
      <template #icon>
        <dt-icon name="sun" size="200"></dt-icon>
      </template>
    </dt-tab>
    <dt-tab id="3" panel-id="4">
      Dark Mode
      <template #icon>
        <dt-icon name="moon" size="200"></dt-icon>
      </template>
    </dt-tab>
  </template>
  <div>
    <dt-tab-panel id="2" tab-id="1">
      <ColorsCatalog mode="light"></ColorsCatalog>
    </dt-tab-panel>
    <dt-tab-panel id="4" tab-id="3">
      <ColorsCatalog mode="dark"></ColorsCatalog>
    </dt-tab-panel>
  </div>
</dt-tab-group>

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
