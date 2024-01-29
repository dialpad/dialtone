---
title: Typography
description: This plays a crucial role in establishing visual hierarchy, readability, and brand identity in our digital products.
---

<svg-loader name="header-typo" />

## Introduction

Typography is more than just selecting fonts; it's about creating a harmonious and effective reading experience. In this documentation, we'll explore how our chosen typefaces, styles, and layouts come together to convey a consistent brand identity across digital interfaces.

## Core Principles

Understanding the fundamentals is key. Learn about the anatomy of type, the interplay of typefaces, and how to strike the right balance between readability and aesthetics. Discover how size, spacing, and hierarchy contribute to a seamless user experience.

## Properties

### Typeface selection

To define the Typeface selection, we make accessibility a priority, so we approach it by using the default system fonts by each operating system to have the best conversion to all possible variables of our product (Japanese, Russian, etc)

<figure class="d-m1 d-p16 d-mr0 d-p0 d-bar4 d-ta-left">
<svg-loader name="roboto" />
<svg-loader name="appleSF" />
<svg-loader name="windows" />
<svg-loader name="linux" />
</figure>

### Font weight

Typography is versatile, and so is our system. Uncover the different styles and variations available, from headings to body text, ensuring flexibility in design while maintaining a cohesive look and feel.
Our styles and variations are:

<figure class="d-m1 d-p16 d-mr0 d-p0 d-bar4 d-ta-left">
<svg-loader name="light" />
<svg-loader name="regular" />
<svg-loader name="medium" />
<svg-loader name="bold" />
</figure>

### Typescale

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-black-100 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 21rem 1fr">
    <template v-for="name in fontSizeValues">
      <div>
        <span class="d-fs-100 d-ff-mono d-fc-purple-400 d-fco75">{{ name }}</span>
        <copy-button :text="name" aria-label="copy class" class="d-d-inline" />
      </div>
      <div><p :class="name">{{ exampleAi }}</p></div>
    </template>
  </div>
</code-well-header>

### Line height

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-black-100 d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 21rem 1fr">
    <template v-for="name in lineHeightValues">
      <div>
        <span class="d-fs-100 d-ff-mono d-fc-purple-400 d-fco75">{{ name }}</span>
        <copy-button :text="name" aria-label="copy class" class="d-d-inline" />
      </div>
      <div><p :class="['d-fs-300 d-bgc-purple-200 d-bgo25', name]">{{ exampleAi }}</p></div>
    </template>
  </div>
</code-well-header>

## Usage

<code-well-header class="d-pb32">
  <div class="d-w100p">
    <dt-stack gap="500">
      <dt-stack gap="200">
        <h2 class="d-headline-large">Ai that works for you</h2>
        <div class="d-body-base">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
      </dt-stack>
      <dt-stack direction="row" gap="500">
        <dt-stack gap="200">
          <h3 class="d-headline-medium">Ai Contact Center</h3>
          <p class="d-body-small">The world’s most advanced customer engagement platform</p>
        </dt-stack>
        <dt-stack gap="200">
          <h3 class="d-headline-medium">Ai Contact Center</h3>
          <p class="d-body-small">The world’s most advanced customer engagement platform</p>
        </dt-stack>
        <dt-stack gap="200">
          <h3 class="d-headline-medium">Ai Voice</h3>
          <p class="d-body-small">Say hello to the world’s smartest business phone</p>
        </dt-stack>
        <dt-stack gap="200">
          <h3 class="d-headline-medium">Ai Meetings</h3>
          <p class="d-body-small">Ai-powered video meetings with built-in transcriptions</p>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </div>
</code-well-header>

```html
<dt-stack gap="500">
  <dt-stack gap="200">
    <h2 class="d-headline-large">Ai that works for you</h2>
    <div class="d-body-base">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
  </dt-stack>
  <dt-stack direction="row" gap="500">
    <dt-stack gap="200">
      <h3 class="d-headline-medium">Ai Contact Center</h3>
      <p class="d-body-small">The world’s most advanced customer engagement platform</p>
    </dt-stack>
    <dt-stack gap="200">
      <h3 class="d-headline-medium">Ai Contact Center</h3>
      <p class="d-body-small">The world’s most advanced customer engagement platform</p>
    </dt-stack>
    <dt-stack gap="200">
      <h3 class="d-headline-medium">Ai Voice</h3>
      <p class="d-body-small">Say hello to the world’s smartest business phone system</p>
    </dt-stack>
    <dt-stack gap="200">
      <h3 class="d-headline-medium">Ai Meetings</h3>
      <p class="d-body-small">Ai-powered video meetings with built-in transcriptions</p>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

## Styles

### Headlines

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 25rem 1fr">
    <template v-for="{ var: varName } in typographyStylesHeadlines">
      <div>
        <span class="d-code-small d-fc-purple-400">{{ varName }}</span>
        <copy-button :text="varName" aria-label="copy class" class="d-d-inline" />
      </div>
      <div><p :class="varName">{{ example }}</p></div>
    </template>
  </div>
</code-well-header>

### Body

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 25rem 1fr">
    <template v-for="{ var: varName } in typographyStylesBody">
      <div>
        <span class="d-code-small d-fc-purple-400">{{ varName }}</span>
        <copy-button :text="varName" aria-label="copy class" class="d-d-inline" />
      </div>
      <div><p :class="varName">{{ example }}</p></div>
    </template>
  </div>
</code-well-header>

### Label

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 25rem 1fr">
    <template v-for="{ var: varName } in typographyStylesLabel">
      <div>
        <span class="d-code-small d-fc-purple-400">{{ varName }}</span>
        <copy-button :text="varName" aria-label="copy class" class="d-d-inline" />
      </div>
      <div><p :class="varName">{{ example }}</p></div>
    </template>
  </div>
</code-well-header>

### Helper

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 25rem 1fr">
    <template v-for="{ var: varName } in typographyStylesHelper">
      <div>
        <span class="d-code-small d-fc-purple-400">{{ varName }}</span>
        <copy-button :text="varName" aria-label="copy class" class="d-d-inline" />
      </div>
      <div><p :class="varName">{{ example }}</p></div>
    </template>
  </div>
</code-well-header>

### Code

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 25rem 1fr">
    <template v-for="{ var: varName } in typographyStylesCode">
      <div>
        <span class="d-code-small d-fc-purple-400">{{ varName }}</span>
        <copy-button :text="varName" aria-label="copy class" class="d-d-inline" />
      </div>
      <div><p :class="varName">{{ example }}</p></div>
    </template>
  </div>
</code-well-header>

## Responsive & Mobile Typography

In a world of diverse devices, responsive design is paramount. Learn how our typography adapts to different screen sizes and orientations, ensuring a consistent and enjoyable experience across desktops, tablets, and smartphones.

## Tokens

We have our own sections for the Tokens and theming, you can check our typography tokens in the [Design tokens section](tokens.md)

<script setup>
import { typographyStyles, fontSize, lineHeight } from '@data/type.json';
import CopyButton from '@baseComponents/CopyButton.vue';
import SvgLoader from '@baseComponents/SvgLoader.vue';

const typographyStylesHeadlines = typographyStyles.filter(type => type.var.startsWith("d-headline"));
const typographyStylesBody = typographyStyles.filter(type => type.var.startsWith("d-body"));
const typographyStylesLabel = typographyStyles.filter(type => type.var.startsWith("d-label"));
const typographyStylesHelper = typographyStyles.filter(type => type.var.startsWith("d-helper"));
const typographyStylesCode = typographyStyles.filter(type => type.var.startsWith("d-code"));

const example = "The quick brown fox jumps over the lazy dog."

const fontSizeValues = fontSize.product.reduce((accum, curr) => {
  accum.push(`d-fs-${curr.stop}`);
  return accum;
}, []);
fontSizeValues.push('d-headline36', 'd-headline48', 'd-headline54');

const lineHeightValues = lineHeight.reduce((accum, curr) => {
  if (curr.class.startsWith('-') && !curr.class.endsWith('unset')) {
    accum.push(`d-lh${curr.class}`);
  }
  return accum;
}, []);

const exampleAi = "Ai that works for you."

</script>
