---
title: Typography
description: Clear, legible, and easy-to-read text.
---

## Properties

### [Font family](../../utilities/typography/font-family.md)

<dt-stack direction="row" gap="500">
<svg-loader name="roboto" />
<svg-loader name="appleSF" />
<svg-loader name="windows" />
<svg-loader name="linux" />
</dt-stack>

### [Font weight](../../utilities/typography/font-weight.md)

<dt-stack direction="row" gap="500">
<svg-loader name="light" />
<svg-loader name="regular" />
<svg-loader name="medium" />
<svg-loader name="bold" />
</dt-stack>

### [Font size](../../utilities/typography/font-size.md)

<dt-stack direction="row" gap="500">
<svg-loader name="d-fs-100" />
<svg-loader name="d-fs-200" />
<svg-loader name="d-fs-300" />
<svg-loader name="d-fs-400" />
<svg-loader name="d-fs-500" />
</dt-stack>

### [Line height](../../utilities/typography/font-family.md)

<dt-stack direction="column" gap="500">
<dt-stack direction="row" gap="500">
<svg-loader name="d-lh-100" />
<svg-loader name="d-lh-200" />
<svg-loader name="d-lh-300" />
</dt-stack>
<dt-stack direction="row" gap="500">
<svg-loader name="d-lh-400" />
<svg-loader name="d-lh-500" />
<svg-loader name="d-lh-600" />
</dt-stack>
</dt-stack>

## Styles

A collection of intentional typographic styles crafted to ensure consistent and clear presentation of user interface and content.

### Usage

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
