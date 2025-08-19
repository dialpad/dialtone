---
title: Chart Colors
description: Chart color guidance to communicate data clearly.
---

## Overview

Data visualization is crucial for clear communication, but inconsistent color usage can hinder comprehension and create visual noise.
**Chart Color Tokens** provide a unified, robust, and accessible system for coloring data visualizations  across all Dialpad products.

<div class="d-bgc-secondary d-bar8 d-mb16">
 <svg-loader name="chart-header" />
</div>

These tokens are designed to:

- **Ensure Visual Consistency:** Guarantee a cohesive look and feel for data insights.
- **Enhance Accessibility:** Provide high-contrast, color-blind friendly palettes out-of-the-box.
- **Streamline Workflow:** Offer a single source of truth for both designers and developers, reducing guesswork and speeding up development.
- **Improve Maintainability:** Simplify global color updates and future-proof our data experiences.

<div class="d-m32"></div>

## Types

Chart Colors are available for one of four types: [Single Color](#single-color), [Semantic](#semantic), [Categorical](#categorical), and [Sequential](#sequential).

### Single Color

Use for data visualizations that only require a single color, with `chart.color.accent` as the default.
Conversely, to bring to focus a data point within a set, use `chart.color.accent` for the focused data point and `chart.color.neutral` for the rest.

<div class="d-bgc-secondary d-bar8 d-mb16">
  <svg-loader name="chart-singlecolor" />
</div>

**When to Use:**

- Basic data points.
- Indicating selected chart series or segments.
- Dimming or disabling inactive chart elements.

<token-table :tokens="singleColorTokens" theme="light" :show-value="false" />

### Semantic

Apply colors that associate meaning to the data points, such as status, severity, or sentiment.

<div class="d-bgc-secondary d-bar8 d-mb16">
  <svg-loader name="chart-semantic" />
</div>

**When to Use:**

- Performance Dashboards: Showing status (on-track, at-risk, complete).
- Alerts/Notifications: Highlighting critical data points.
- Sentiment Analysis: Representing positive, neutral, or negative sentiment.
- Brand Alignment: Emphasizing data related directly to Dialpad's core identity.

<token-table :tokens="semanticTokens" theme="light" :show-value="false" />

### Categorical

Apply unique colors to distinguish two or more unrelated data where color carries no meaning. Use in the predetermined numerical order, e.g. `01,`02`, etc. This ensures applied data can be visually distinguished from its adjacent data.

<div class="d-bgc-secondary d-bar8 d-mb16">
  <svg-loader name="chart-categorical" />
</div>

**When to Use:**

- Multi-series bar charts, pie charts, or line charts comparing different groups.
- Visualizing discrete variables (e.g., customer segments, operating systems).

<token-table :tokens="categoricalTokens" theme="light" :show-value="false" />

### Sequential

To represent data using progressive shades or tints of a single color, emphasizing their relative depth within a single data series.

<div class="d-bgc-secondary d-bar8 d-mb16">
  <svg-loader name="chart-sequential" />
</div>

**When to Use:**

- Single-series charts where visual depth or intensity within one category is key.
- Heatmaps or density visualizations for a single metric.
- Situations requiring a strong visual connection to the Dialpad brand.

<token-table :tokens="sequentialTokens" theme="light" :show-value="false" />

## Usage for Designers

Designers should leverage these tokens directly from the Dialtone Figma Library.

- Applying Colors: Apply color directly to chart elements (bars, lines, fills) via Figma Styles linked to tokens. Unlike other Dialtone colors, Chart Colors are not scoped to foreground, surface, border, etc.
- Understanding Hover/Selected: Remember that hover and selected states for specific chart series (single color, semantic, categorical, and sequential) have predetermined contrasting colors, ensuring consistent interaction feedback.
- Prototyping: Use these tokens in your Figma prototypes to demonstrate interactive states and theme switching.

## Do and Don'ts

### Apply Categorical colors in numeric order

<dialtone-usage>
<template #do>
 <div class="d-bar8">
  <svg-loader class="d-fl1" name="chart-dondont-1-1" />
 </div>
Use categorical and sequential colors in their predetermined order, e.g. 01, 02, 03, etc.
</template>

<template #dont>
 <div class="d-bar8">
  <svg-loader class="d-fl1" name="chart-dondont-1-2" />
 </div>
Avoid using categorical and sequential colors out of order, e.g. 10, 03, 05, etc.

</template>

</dialtone-usage>

### Limit chart colors

<dialtone-usage>
<template #do>
 <div class="d-bar8">
  <svg-loader class="d-fl1" name="chart-dondont-2-1" />
 </div>
Where possible, limit the number of colors in a single graph to no more than 6.
</template>

<template #dont>
 <div class="d-bar8">
  <svg-loader class="d-fl1" name="chart-dondont-2-2" />
 </div>
Using more than 6 color may make the chart difficult to parse. Exhaust design possibilities before going beyond.
</template>

</dialtone-usage>

### Use multiple colors only with purpose

<dialtone-usage>
<template #do>
 <div class="d-bar8">
  <svg-loader class="d-fl1" name="chart-dondont-3-1" />
 </div>
Use more than one color only when it serves the data's communication.
</template>

<template #dont>
 <div class="d-bar8">
  <svg-loader class="d-fl1" name="chart-dondont-3-2" />
 </div>
Using more than one color without purpose may make the chart difficult to parse and could confuse the user on the data's communication.
</template>

</dialtone-usage>

### Use space to separate data

<dialtone-usage>
<template #do>
 <div class="d-bar8">
  <svg-loader class="d-fl1" name="chart-dondont-4-1" />
 </div>
Use space to separate data and make it easier to understand to the user.
</template>

<template #dont>
 <div class="d-bar8">
   <svg-loader class="d-fl1" name="chart-dondont-4-2" />
 </div>
Avoid mixing the tokens next to each other as much as possible, so keep a space to separate data and more digestible for the user.
</template>

</dialtone-usage>

## Accessibility Guidelines

Ensuring accessible data visualizations is a core tenet of Dialtone. When using these tokens:

- Contrast Ratios: All token color combinations are designed to meet WCAG AA contrast standards (minimum 3:1 for graphics/UI components).
- Color-Blindness Compatibility: Palettes have been vetted for common forms of color blindness (e.g., using tools like Viz Palette).
- Redundancy is Key: Never rely solely on color to convey critical information. Always provide supplementary visual cues such as:
  - Labels/Text: Directly annotating data points with values.
  - Icons/Patterns: Using distinct icons or patterns for categories.
  - Shapes/Stroke Styles: Varying shapes, line styles (dashed, dotted), or stroke widths.
- Theming Impact: Token values are specifically defined for both light and dark modes to ensure optimal contrast and readability in any theme.

## Known Issues & Troubleshooting

While this system aims for robustness, be aware of potential challenges during implementation and adoption:

- Charting Library Overrides: Some charting libraries might aggressively override inline styles or custom properties, requiring careful mapping or deeper customization.
- Complex Color Logic: For very custom data-driven color calculations beyond simple references (e.g., dynamic gradients based on data range), you might still need to implement logic in code that consumes these Chart Color design tokens.
- Transitioning Existing Charts: Migrating older charts not using design tokens will require dedicated refactoring effort.

<script setup>
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json'; 
import { alphabeticalSorter } from '@utilities'; 

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
const theme = "dp-light";
const isSemantic = (token) => /(warning|positive|info|critical|brand)/.test(token);
const isCategorical = (token) => /(categorical)/.test(token);
const isSequential = (token) => /(sequential)/.test(token);

const { 
  semanticTokens, 
  categoricalTokens,
  sequentialTokens,
  singleColorTokens 
} = Object.keys(tokensJson[theme]).sort(alphabeticalSorter).reduce((acc, curr) => {
    if (!curr.startsWith('color/chart')) return acc;
  
    const { name, value, description } = tokensJson[theme][curr]["css/variables"];
  
    const tokenCategory = isSemantic(name) ? 'semanticTokens' : isCategorical(name) ? 'categoricalTokens' : isSequential(name) ? 'sequentialTokens' : 'singleColorTokens';
    acc[tokenCategory].push({ name, tokenValue: value, description, exampleValue: value, exampleName: name });
  
    return acc;
  }, {
    semanticTokens: [],
    categoricalTokens: [],
    sequentialTokens: [],
    singleColorTokens: [],
  });
</script>
