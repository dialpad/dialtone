---
title: Typography
description: Clear, legible, and easy-to-read text.
---

## Font properties

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

### Usage

All product UI text can be characterized as one of **Headline**, **Body**, **Label**, **Helper**, or **Code**. These styles are effectively **composition** CSS Utilities, combining multiple properties like `font-size`, `font-family`, `font-weight`, and `line-height`.

```html
<el class="d-{category}--{size}-{strength}-{density}">...</el>
```

<div class="d-bb d-bc-default">
  <table class="d-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Size</th>
        <th>Strength <span class="d-label--sm-plain-compact d-tt-none">(optional)</span></th>
        <th>Density <span class="d-label--sm-plain-compact d-tt-none">(optional)</span></th>
      </tr>
    </thead>
    <tbody>
      <tr class="d-va-top" v-for="item in typographyVariants" :key="item.category">
        <td>
          <code class="d-code--sm">{{ item.category }}</code>
        </td>
        <td>
          <dt-stack gap="300">
            <div v-for="(size, index) in item.size" :key="index" :class="{'d-fc-transparent': size === '-'}">
              <code class="d-code--sm">{{ size }}</code>
            </div>
          </dt-stack>
        </td>
        <td>
          <dt-stack gap="300">
            <div v-for="(strength, index) in item.strength" :key="index" :class="{'d-fc-transparent': strength === '-'}">
              <code class="d-code--sm">{{ strength }}</code>
            </div>
          </dt-stack>
        </td>
        <td>
          <dt-stack gap="300">
            <div v-for="(density, index) in item.density" :key="index" :class="{'d-fc-transparent': density === '-'}">
              <code class="d-code--sm">{{ density }}</code>
            </div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Examples

<code-well-header class="d-pb32">
  <div class="d-w100p">
    <dt-stack gap="400">
      <dt-stack>
        <h2 class="d-headline--lg">Ai that works for you</h2>
        <div class="d-body--md-compact">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
      </dt-stack>
      <dt-stack direction="row" gap="500" class="d-ai-flex-start">
        <dt-stack>
          <h3 class="d-headline--md-compact">Ai Contact Center</h3>
          <p class="d-body--sm">The world’s most advanced customer engagement platform</p>
        </dt-stack>
        <dt-stack>
          <h3 class="d-headline--md-compact">Ai Voice</h3>
          <p class="d-body--sm">Say hello to the world’s smartest business phone</p>
        </dt-stack>
        <dt-stack>
          <h3 class="d-headline--md-compact">Ai Meetings</h3>
          <p class="d-body--sm">Ai-powered video meetings with built-in transcriptions</p>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </div>
</code-well-header>

```html
<dt-stack gap="400">
  <dt-stack>
    <h2 class="d-headline--lg">Ai that works for you</h2>
    <div class="d-body--md-compact">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
  </dt-stack>
  <dt-stack direction="row" gap="500" class="d-ai-flex-start">
    <dt-stack>
      <h3 class="d-headline--md-compact">Ai Contact Center</h3>
      <p class="d-body--sm">The world’s most advanced customer engagement platform</p>
    </dt-stack>
    <dt-stack>
      <h3 class="d-headline--md-compact">Ai Voice</h3>
      <p class="d-body--sm">Say hello to the world’s smartest business phone</p>
    </dt-stack>
    <dt-stack>
      <h3 class="d-headline--md-compact">Ai Meetings</h3>
      <p class="d-body--sm">Ai-powered video meetings with built-in transcriptions</p>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

### Headlines

Titles and headings to establish hierarchy and set the tone of contextual groupings.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesHeadlines">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--sm d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### Body

Default text style for longer-form prose content, designed for comfort and clarity in reading varying lengths.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesBody">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--sm d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### Label

Shorter-length copy like form fields, buttons, and other UI-labeling elements, ensuring clear navigation and interaction.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesLabel">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--sm d-fc-purple-400">{{ varName }}</span>
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
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesHelper">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--sm d-fc-purple-400">{{ varName }}</span>
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
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 52rem 1fr">
    <template v-for="{ var: varName } in typographyStylesCode">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" class="d-jc-space-between dialtone-copy-utility">
        <span class="dialtone-copy-utility__utility d-code--sm d-fc-purple-400">{{ varName }}</span>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

### API

Each typography style is expressed through a shorthand `font` property, and its value's design token contains all font styles, e.g. `font-size`, `line-height`, `font-family`, etc,

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
        <td class="d-code--sm d-fc-purple-400">.{{ varName }}</td>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </table>
</div>

<script setup>
  import { typographyVariants, typographyStyles, fontSize, lineHeight } from '@data/type.json';
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
