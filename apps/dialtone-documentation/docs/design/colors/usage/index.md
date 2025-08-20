---
title: Usage
description: A systematic and accessible color palette that supports both functional needs and personalized experiences within our products.
---

<div class="d-m32"></div>

## Overview

Dialtone's color system offers a consistent visual foundation with a brand purple, versatile grayscale, and semantic status colors. Subtle gradients are used for promotional accents.

What we prioritize is semantic clarity, ensuring each color serves a distinct purpose within the UI for clear communication and consistency...

<div class="d-m32"></div>

<div class="d-bgc-secondary d-bar8">
 <svg-loader name="color-table" />
</div>

## Use Semantic Color Tokens

Dialtone uses **semantic tokens** for color, representing a color's *purpose* in the UI. See our [See our design token list](https://dialtone.dialpad.com/tokens/) for descriptions guiding their application.

<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-tokens" /></div>

<div class="d-m32"></div>

It's crucial to understand that while these semantic tokens are built upon our underlying **base color palette**, the work of selecting the appropriate base color for each specific UI context has already been meticulously done for you.

<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-semantic" /></div>

## Color roles

Color roles describe the purpose of how color is used. Each uses neutrals for general UI and status colors for impact.

<div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-roles" /></div>

We categorize color application by semantic roles such as: **text, surfaces, borders, and themes**. Each uses neutrals for general UI and status colors for impact.

### Foreground Colors

Foreground colors are the visual language of our content, applied across all content considered to be "in the foreground", i.e. text and icons. You can utilize foreground tokens which can be found within the [tokens documentation here](https://dialtone.dialpad.com/tokens/).

<div class="d-d-grid d-g24 d-g-cols2">
  <div>
    <div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-text-f" /></div>
    <h4>Foreground Text</h4>
    Neutral text colors form the backbone of our content, used for headers, body text, forms, and more.
  </div>
  <div>
     <div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-text-s" /></div>
    <h4>Status Text</h4>
    Status text colors are critical for highlighting key information:
    <ul>
      <li><em>Red:</em> Signals critical attention.</li>
      <li><em>Yellow:</em> Indicates warnings.</li>
      <li><em>Green:</em> Denotes positive actions.</li>
    </ul>
  </div>
<div>
   <div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-foreground-icon" /></div>
    <h4>Icons</h4>
    Icon colors profoundly impact readability, user interaction, communicating meaning and status at a glance.
  </div>
</div>

### Surfaces

Surface colors define the background of UI elements, from pages and modals to tables and cards. Neutrals provide the primary backdrop, while status colors add emphasis and context.

<div class="d-d-grid d-g24 d-g-cols2">
  <div>
    <div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-surface-neutral" /></div>
  </div>
  <div>
     <div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-surface-status" /></div>
  </div>
</div>

### Borders

Borders delineate content areas and components, using neutrals for subtle definition and status colors for heightened emphasis. Inverted colors ensure clarity on darker surfaces.

<div class="d-d-grid d-g24 d-g-cols2">
  <div>
    <div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-border-ai" /></div>
  </div>
  <div>
     <div class="d-bgc-secondary d-bar8"><svg-loader class="d-fl1" name="color-border-status" /></div>
  </div>
</div>

### Charts

View our [Chart Colors](../chart-colors/index.md) documentation for more information.

<div class="d-d-grid d-g24 d-g-cols2">
  <div class="d-bgc-secondary d-bar8">
   <svg-loader name="chart-singlecolor" />
  </div>
  <div class="d-bgc-secondary d-bar8">
   <svg-loader name="chart-semantic" />
  </div>
  <div class="d-bgc-secondary d-bar8">
   <svg-loader name="chart-categorical" />
  </div>
  <div class="d-bgc-secondary d-bar8">
   <svg-loader name="chart-sequential" />
  </div>
</div>

## Best Practices

### Preserve Color Semantics

Use feedback colors consistently to maintain clear communication and avoid confusion.

<dialtone-usage class="d-d-grid d-g24 d-g-cols2">
  <template #do>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-semantics-do" />
    </div>
  </template>
  <template #dont>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-semantics-dont" />
    </div>
  </template>
</dialtone-usage>

### Semantics Over Base Values

Embrace semantic tokens to separate color values from their contextual meaning, enhancing maintainability and clarity.

<dialtone-usage class="d-d-grid d-g24 d-g-cols2">
  <template #do>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-token-do" />
    </div>
  </template>
  <template #dont>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-token-dont" />
    </div>
  </template>
</dialtone-usage>

### Prioritize Contrast

We primarily employ the APCA for precise contrast evaluation, ensuring readability for all users.

**Refer to Accessibility Guidelines for detailed information.**

<dialtone-usage class="d-d-grid d-g24 d-g-cols2">
  <template #do>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-contrast-do" />
    </div>
  </template>
  <template #dont>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-contrast-dont" />
    </div>
  </template>
</dialtone-usage>

### Uniformity

Maintain color consistency across similar components to build intuitive user patterns.

<dialtone-usage class="d-d-grid d-g24 d-g-cols2">
  <template #do>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-uniform-do" />
    </div>
  </template>
  <template #dont>
    <div class="d-bgc-secondary d-bar8">
      <svg-loader class="d-fl1" name="color-uniform-dont" />
    </div>
  </template>
</dialtone-usage>

## Modes

Dialtone is designed to seamlessly support both light and dark themes. We supply colors through semantic tokens that automatically adapt their underlying values depending on the active mode, ensuring consistent meaning and optimal contrast in any environment.

<div class="d-bgc-secondary d-bgo10 ">
 <svg-loader class="d-fl1" name="color-mode" />
</div>

## Related

- If you need full list of our color palette, [Check out our list of colors](../palette/index.md).
- [See our entire token catalog with full descriptions and values of all tokens.](../../../tokens/index.md).
