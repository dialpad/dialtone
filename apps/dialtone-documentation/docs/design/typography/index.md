---
title: Typography
description: Clear, legible, and easy-to-read text.
---

## Properties

### Font family

Dialtone's product UI font stack defers to the user's default system font, ensuring a seamless native experience.

<dt-stack direction="row" gap="500" class="d-wmx764">
  <svg-loader class="d-fl1" name="ff-appleSF" />
  <svg-loader class="d-fl1" name="ff-windows" />
  <svg-loader class="d-fl1" name="ff-roboto" />
  <svg-loader class="d-fl1" name="ff-linux" />
</dt-stack>

### Font weight

Four weights for clear hierarchy and visual contrast among different elements.

<dt-stack direction="row" gap="500" class="d-wmx764">
  <svg-loader name="fw-regular" />
  <svg-loader name="fw-medium" />
  <svg-loader name="fw-semibold" />
  <svg-loader name="fw-bold" />
</dt-stack>

### Font size

Dictates the scale of text, enhancing readability and defining information hierarchy across content.

<dt-stack direction="row" gap="500" class="d-wmx764">
  <svg-loader name="fs-100" />
  <svg-loader name="fs-200" />
  <svg-loader name="fs-300" />
  <svg-loader name="fs-400" />
  <svg-loader name="fs-500" />
</dt-stack>

### Line height

Adjusts vertical spacing between lines of text, optimizing legibility and text flow.

<dt-stack direction="column" gap="500">
  <dt-stack direction="row" gap="500" class="d-wmx764">
    <svg-loader name="lh-100" />
    <svg-loader name="lh-200" />
    <svg-loader name="lh-300" />
  </dt-stack>
  <dt-stack direction="row" gap="500" class="d-wmx764">
    <svg-loader name="lh-400" />
    <svg-loader name="lh-500" />
    <svg-loader name="lh-600" />
  </dt-stack>
</dt-stack>

## Styles

Dialtone's text styles are narrowed down to five categories: **Headline**, **Body**, **Label**, **Helper**, or **Code**. These combine `font-size`, `font-family`, `font-weight`, and `line-height` style properties into a CSS Utility for a uniform design language across all content.

<dt-notice
  kind="warning"
  hideClose="true"
  class="d-wmx100p"
>
  <template #default>
    <p class="d-body--base-compact">Reach for these styles first before using CSS Utilities or creating custom styles. Otherwise, CSS Utilities are available for <router-link class="d-fw-semibold d-link d-link--muted" to="../../utilities/typography/font-family.md">Font family</router-link>, <router-link class="d-fw-semibold d-link d-link--muted" to="../../utilities/typography/font-weight.md">Font weight</router-link>, <router-link class="d-fw-semibold d-link d-link--muted" to="../../utilities/typography/font-size.md">Font size</router-link>, and <router-link class="d-fw-semibold d-link d-link--muted" to="../../utilities/typography/font-family.md">Line height</router-link>, as well as <router-link class="d-fw-semibold d-link d-link--muted" to="/tokens/typography.md">Design Tokens</router-link> when you need to create custom styles with the same values.</p>
  </template>
</dt-notice>

### Usage

<code-well-header class="d-pb32">
  <div class="d-w100p">
    <dt-stack gap="500">
      <dt-stack gap="200">
        <h2 class="d-headline--large">Ai that works for you</h2>
        <div class="d-body--base">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
      </dt-stack>
      <dt-stack direction="row" gap="500" class="d-ai-flex-start">
        <dt-stack gap="200">
          <h3 class="d-headline--medium-compact">Ai Contact Center</h3>
          <p class="d-body--small">The world’s most advanced customer engagement platform</p>
        </dt-stack>
        <dt-stack gap="200">
          <h3 class="d-headline--medium-compact">Ai Contact Center</h3>
          <p class="d-body--small">The world’s most advanced customer engagement platform</p>
        </dt-stack>
        <dt-stack gap="200">
          <h3 class="d-headline--medium-compact">Ai Voice</h3>
          <p class="d-body--small">Say hello to the world’s smartest business phone</p>
        </dt-stack>
        <dt-stack gap="200">
          <h3 class="d-headline--medium-compact">Ai Meetings</h3>
          <p class="d-body--small">Ai-powered video meetings with built-in transcriptions</p>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </div>
</code-well-header>

```html
<dt-stack gap="500">
  <dt-stack gap="200">
    <h2 class="d-headline--large">Ai that works for you</h2>
    <div class="d-body--base">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
  </dt-stack>
  <dt-stack direction="row" gap="500" class="d-wmx764">
    <dt-stack gap="200">
      <h3 class="d-headline--medium-compact">Ai Contact Center</h3>
      <p class="d-body--small">The world’s most advanced customer engagement platform</p>
    </dt-stack>
    <dt-stack gap="200">
      <h3 class="d-headline--medium-compact">Ai Contact Center</h3>
      <p class="d-body--small">The world’s most advanced customer engagement platform</p>
    </dt-stack>
    <dt-stack gap="200">
      <h3 class="d-headline--medium-compact">Ai Voice</h3>
      <p class="d-body--small">Say hello to the world’s smartest business phone system</p>
    </dt-stack>
    <dt-stack gap="200">
      <h3 class="d-headline--medium-compact">Ai Meetings</h3>
      <p class="d-body--small">Ai-powered video meetings with built-in transcriptions</p>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

### Headlines

Titles and headings to establish hierarchy and set the tone of contextual groupings.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesHeadlines">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--small d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### Body

Default text style for readable content, designed for comfort and clarity in reading varying lengths.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesBody">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--small d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### Label

Identifying form fields, buttons, and other interface elements, ensuring clear navigation and interaction.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesLabel">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--small d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### Helper

Complementary information or guidance, such as tooltips and hints, to aid user understanding without overwhelming.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesHelper">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--small d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### Code

Code snippets, technical commands, or data values rendered as a monospaced font.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-gg16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesCode">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--small d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### API

<div class="d-hmx464 d-of-y-auto d-bb d-bc-default">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w40p">Class</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ var: varName, output } in typographyStyles">
        <td class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.{{ varName }}</td>
        <td class="d-ff-mono d-fs-100">{{ output }}</td>
      </tr>
    </tbody>
  </table>
</div>

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

<style lang="less" scoped>
  .dialtone-copy-utility {

    & {
      position: relative;
      cursor: default;
    }

    &__utility {
    }

    &__btn {
      display: none;
      position: absolute;
      right: 0;
      background-color: var(--dt-color-surface-secondary);
      padding-left: var(--dt-space-300);

      .dialtone-copy-utility:hover & {
        display: block;
      }
    }
  }
</style>
