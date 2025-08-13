---
title: Chart Colors
description: Chart Colors are crucial for clear communication, but inconsistent color usage can hinder comprehension and create visual noise.
---

## Overview & Purpose

<div class="d-bgc-brand d-bar8 ">
 <svg-loader name="chart-header" />
 </div>

Data visualization is crucial for clear communication, but inconsistent color usage can hinder comprehension and create visual noise.
**Chart Color Tokens** provide a unified, robust, and accessible system for coloring data visualizations  across all Dialpad products.

These tokens are designed to:

- **Ensure Visual Consistency:** Guarantee a cohesive look and feel for data insights.
- **Enhance Accessibility:** Provide high-contrast, color-blind friendly palettes out-of-the-box.
- **Streamline Workflow:** Offer a single source of truth for both designers and developers, reducing guesswork and speeding up development.
- **Improve Maintainability:** Simplify global color updates and future-proof our data experiences.

<div class="d-m32"></div>

## Types

We have 4 types or groups of colors, these are:

- Single color
- Semantics
- Categorical
- Sequential

### Single color

Use to provide clear visual feedback for user interactions or specific visual conditions of chart elements. These apply broadly to chart components. Treat this one as a default, if you have doubts on which color to use, use this one.

**When to Use:**

- Basic data points.
- Indicating selected chart series or segments.
- Dimming or disabling inactive chart elements.

<token-table :tokens="singleColorTokens" theme="light" :show-value="false" />

### Semantics

Use to convey inherent meaning, status, severity, or sentiment (e.g., positive, negative, warning, informational, or brand-specific).

**When to Use:**

- Performance Dashboards: Showing status (on-track, at-risk, complete).
- Alerts/Notifications: Highlighting critical data points.
- Sentiment Analysis: Representing positive, neutral, or negative sentiment.
- Brand Alignment: Emphasizing data related directly to Dialpad's core identity.

<token-table :tokens="semanticTokens" theme="light" :show-value="false" />

### Categorical

Purpose: To differentiate distinct, unrelated categories of data where the color itself does not carry inherent meaning (e.g., comparing product lines, regions).

**When to Use:**

- Multi-series bar charts, pie charts, or line charts comparing different groups.
- Visualizing discrete variables (e.g., customer segments, operating systems).

<token-table :tokens="categoricalTokens" theme="light" :show-value="false" />

### Sequential

To represent data using progressive shades or tints of a single color, emphasizing their relative depth within a single data series.

**When to Use:**

- Single-series charts where visual depth or intensity within one category is key.
- Heatmaps or density visualizations for a single metric.
- Situations requiring a strong visual connection to the Dialpad brand.

<token-table :tokens="sequentialTokens" theme="light" :show-value="false" />

## Accesibility Guidelines

Ensuring accessible data visualizations is a core tenet of Dialtone. When using these tokens:

- Contrast Ratios: All token color combinations are designed to meet WCAG AA contrast standards (minimum 3:1 for graphics/UI components).
- Color-Blindness Compatibility: Palettes have been vetted for common forms of color blindness (e.g., using tools like Viz Palette).
- Redundancy is Key: Never rely solely on color to convey critical information. Always provide supplementary visual cues such as:
  - Labels/Text: Directly annotating data points with values.
  - Icons/Patterns: Using distinct icons or patterns for categories.
  - Shapes/Stroke Styles: Varying shapes, line styles (dashed, dotted), or stroke widths.
- Theming Impact: Token values are specifically defined for both light and dark modes to ensure optimal contrast and readability in any theme.

## Usage for Designers

Designers should leverage these tokens directly  from the Dialtone Figma Library.

- Applying Colors: Apply color directly to chart elements (bars, lines, fills) via Figma Styles linked to tokens. Unlike other Dialtone colors, Chart Colors are not scoped to foreground, surface, border, etc.
- Understanding Hover/Selected: Remember that hover and selected states for specific chart series (single color, semantic, categorical, and sequential) have predetermined contrasting colors, ensuring consistent interaction feedback.
- Prototyping: Use these tokens in your Figma prototypes to demonstrate interactive states and theme switching.

## Known Issues & Troubleshooting

While this system aims for robustness, be aware of potential challenges during implementation and adoption:

- Charting Library Overrides: Some charting libraries might aggressively override inline styles or custom properties, requiring careful mapping or deeper customization.
- Complex Color Logic: For very custom data-driven color calculations beyond simple references (e.g., dynamic gradients based on data range), you might still need to implement logic in code that consumes these Chart Color design tokens.
- Transitioning Existing Charts: Migrating older charts not using design tokens will require dedicated refactoring effort.

## Do and Don'ts

### Use the colors in the right order

<dialtone-usage>
<template #do>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-1-1" />
 </div>
Use categorical and sequential colors in their predetermined order, e.g. 01, 02, 03, etc.
</template>

<template #dont>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-1-2" />
 </div>
Avoid using categorical and sequential colors out of order, e.g. 10, 03, 05, etc.

</template>

</dialtone-usage>

### Limit the number of colors used in one graph to 6 max

<dialtone-usage>
<template #do>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-2-1" />
 </div>
When displaying information, limit the number of colors used in one graph to 6 max.
</template>

<template #dont>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-2-2" />
 </div>
If you use more than 6 colors, the chart will be too complex and hard to read. Try show the most important data using the first 6 colors.
</template>

</dialtone-usage>

### Don’t use more than one color in your data visualization if the additional colors don’t serve any communication purpose.

<dialtone-usage>
<template #do>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-3-1" />
 </div>
Don’t use more than one color in your data visualization if the additional colors don’t serve any communication purpose.
</template>

<template #dont>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-3-2" />
 </div>
- Add too many call-to-action elements to the same card. A card should only contain a single primary action.
- Inform users about important changes.
</template>

</dialtone-usage>

### Add visual separator using white space

<dialtone-usage>
<template #do>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-4-1" />
 </div>
- To display content and actions on a single topic.
</template>

<template #dont>
 <div class="d-bar8"> <svg-loader class="d-fl1" name="chart-dondont-4-2" />
 </div>
- Add too many call-to-action elements to the same card. A card should only contain a single primary action.
- Inform users about important changes.
</template>

</dialtone-usage>

### Best Practices

- It should only contain a single idea that may feature a call-to-action, or the option to navigate to more detailed content.
- The content of a card should be concise and offer only a preview of detailed content.
- The headings should set clear expectations about the card’s purpose.

## Contribution & Feedback

This is a living system. Your feedback is crucial for its continuous improvement.

- Found a missing token?
- Have a use case not covered?
- Encountered an issue?

Please reach out to the Design Systems team or submit an issue/request [here](https://dialpad.atlassian.net/servicedesk/customer/portal/123/create/465).

<script setup>
import DesignColorTable from '@baseComponents/DesignColorTable.vue';
import ThemeColorTable from '@baseComponents/ThemeColorTable.vue';
import ColorsCatalog from '@views/ColorsCatalog.vue';
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';

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

const chartTokens = Object.keys(tokensJson[theme]).reduce((acc, curr) => {
  if (!curr.startsWith('color/chart')) return acc;

  const { name, value, description } = tokensJson[theme][curr]["css/variables"];

  acc.push({
    name,
    tokenValue: value,
    description,
    exampleValue: value,
    exampleName: name,
  });
  return acc;
}, []);

const isSemantic = (token) => /(warning|positive|info|critical|brand)/.test(token);
const isCategorical = (token) => /(categorical)/.test(token);
const isSequential = (token) => /(sequential)/.test(token);

const semanticTokens = chartTokens.filter(({ name: token }) => isSemantic(token));
const categoricalTokens = chartTokens.filter(({ name: token }) => isCategorical(token));
const sequentialTokens = chartTokens.filter(({ name: token }) => isSequential(token));
const singleColorTokens = chartTokens.filter(({ name: token }) => !(isSequential(token) || isCategorical(token) || isSemantic(token)));

</script>
