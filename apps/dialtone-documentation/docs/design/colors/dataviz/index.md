---
title: Data visualization
description: Data visualization is crucial for clear communication, but inconsistent color usage can hinder comprehension and create visual noise.
---

## Overview & Purpose

<div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
  <svg width="800" height="350" viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <rect width="80" height="80" rx="16" fill="#F3F3F6"/>
    <circle cx="40" cy="40" r="24" fill="#E0E0EA"/>
    <rect x="28" y="28" width="24" height="24" rx="6" fill="#C1BFF3"/>
    <rect x="36" y="36" width="8" height="8" rx="2" fill="#8B83F6"/>
  </svg>
</div>

Our Data Visualization Color Tokens provide a unified, robust, and accessible system for coloring charts and graphs across all Dialpad products.

These tokens are designed to:

- **Ensure Visual Consistency:** Guarantee a cohesive look and feel for data insights.
- **Enhance Accessibility:** Provide high-contrast, color-blind friendly palettes out-of-the-box.
- **Streamline Workflow:** Offer a single source of truth for both designers and developers, reducing guesswork and speeding up development.
- **Improve Maintainability:** Simplify global color updates and future-proof our data experiences.

<div class="d-m32"></div>

## Token Categories & Usage Guidelines

<div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <rect width="80" height="80" rx="16" fill="#F3F3F6"/>
    <circle cx="40" cy="40" r="24" fill="#E0E0EA"/>
    <rect x="28" y="28" width="24" height="24" rx="6" fill="#C1BFF3"/>
    <rect x="36" y="36" width="8" height="8" rx="2" fill="#8B83F6"/>
  </svg>
</div>

It’s important to use these colors in **numerical ascending order** (e.g., 01, 02, 03, 04, etc.) based on their lightness.
Our Data Visualization Color Tokens are organized into four distinct categories, each serving a specific purpose.

### 1. Semantics

**Purpose:** Convey inherent meaning, status, or sentiment (e.g., positive, negative, warning, informational, or brand-specific).
These colors provide immediate context.

**When to Use:**

- Performance Dashboards: Showing status (on-track, at-risk, complete).
- Alerts/Notifications: Highlighting critical data points.
- Sentiment Analysis: Representing positive, neutral, or negative sentiment.
- Brand Alignment: Emphasizing data related directly to Dialpad's core identity.

<DesignColorTable :included-colors="['chart-positive-strong','chart-positive','chart-positive-strong-hover','chart-positive-strong-selected','chart-positive-hover','chart-positive-selected','chart-negative-strong','chart-negative','chart-negative-strong-hover','chart-negative-strong-selected','chart-negative-hover','chart-negative-selected','chart-warning-strong','chart-warning','chart-warning-strong-hover','chart-warning-strong-selected','chart-warning-hover','chart-warning-selected','chart-info-strong','chart-info','chart-info-strong-hover','chart-info-strong-selected','chart-info-hover','chart-info-selected','chart-brand-strong','chart-brand','chart-brand-strong-hover','chart-brand-strong-selected','chart-brand-hover','chart-brand-selected']" class-prefix="d-bgc-">
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
      {{ color.tokenName }}
    </span>
  </template>
</DesignColorTable>

---

### 2. Categorical

**Purpose:** Differentiate distinct, unrelated categories of data where the color itself does not carry inherent meaning.

**When to Use:**

- Multi-series bar charts, pie charts, or line charts comparing different groups.
- Visualizing discrete variables (e.g., customer segments, operating systems).

<DesignColorTable :included-colors="['chart-categorical-01','chart-categorical-01-hover','chart-categorical-01-selected','chart-categorical-02','chart-categorical-02-hover','chart-categorical-02-selected','chart-categorical-03','chart-categorical-03-hover','chart-categorical-03-selected','chart-categorical-04','chart-categorical-04-hover','chart-categorical-04-selected','chart-categorical-05','chart-categorical-05-hover','chart-categorical-05-selected','chart-categorical-06','chart-categorical-06-hover','chart-categorical-06-selected','chart-categorical-07','chart-categorical-07-hover','chart-categorical-07-selected']" class-prefix="d-bgc-">
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
      {{ color.tokenName }}
    </span>
  </template>
</DesignColorTable>

## Do and Don'ts

Cards are surfaces that display content and actions on a single topic.
They should be easy to scan for relevant and actionable information. Elements, like text and images, should be placed on them in a way that clearly indicates hierarchy.

### Use the colors in the right order

<dialtone-usage>
<template #do>
 <div class="d-bgc-brand d-bar8">
 <svg-loader class="d-fl1" name="color-roles" />
 </div>
We categorize color application by semantic roles such as: **text, surfaces, borders, and themes**. Each uses neutrals for general UI and status colors for impact.
</template>

<template #dont>
 <div class="d-bgc-brand d-bar8">
 <svg-loader class="d-fl1" name="color-roles" />
 </div>
We categorize color application by semantic roles such as: **text, surfaces, borders, and themes**. Each uses neutrals for general UI and status colors for impact.

</template>

</dialtone-usage>

### Limit the number of colors used in one graph to 5 max

<dialtone-usage>
<template #do>

- To display content and actions on a single topic.
</template>

<template #dont>

- Add too many call-to-action elements to the same card. A card should only contain a single primary action.
- Inform users about important changes.
</template>

</dialtone-usage>

### Don’t use more than one color in your data visualization if the additional colors don’t serve any communication purpose.

<dialtone-usage>
<template #do>

- To display content and actions on a single topic.
</template>

<template #dont>

- Add too many call-to-action elements to the same card. A card should only contain a single primary action.
- Inform users about important changes.
</template>

</dialtone-usage>

### Add visual separator using white space

<dialtone-usage>
<template #do>

- To display content and actions on a single topic.
</template>

<template #dont>

- Add too many call-to-action elements to the same card. A card should only contain a single primary action.
- Inform users about important changes.
</template>

</dialtone-usage>

### Best Practices

- It should only contain a single idea that may feature a call-to-action, or the option to navigate to more detailed content.
- The content of a card should be concise and offer only a preview of detailed content.
- The headings should set clear expectations about the card’s purpose.

---

<!-- Repeat the SVG block after each H2 as needed for other sections -->
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
