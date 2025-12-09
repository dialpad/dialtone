---
title: Typography
description: Clear, legible, and easy-to-read text.
figma_url: https://www.figma.com/design/VjrRh4vvfONSmBQxnZrL3u/DT9-Design-Tokens--Rebrand-2025-?node-id=3746-13426&t=D8g6K4TrMGXNsvLT-11
---

## Font Properties

### Font Family

Dialtone's product UI font stack defers to the user's default system font, ensuring a seamless native experience.

<dt-stack direction="row" gap="500" class="d-wmx764">
  <svg-loader class="d-fl1" name="ff-appleSF" />
  <svg-loader class="d-fl1" name="ff-windows" />
  <svg-loader class="d-fl1" name="ff-roboto" />
  <svg-loader class="d-fl1" name="ff-linux" />
</dt-stack>

### Font Weight

Four weights for clear hierarchy and visual contrast among different elements.

<dt-stack direction="row" gap="500" class="d-wmx764">
  <svg-loader name="fw-regular" />
  <svg-loader name="fw-medium" />
  <svg-loader name="fw-semibold" />
  <svg-loader name="fw-bold" />
</dt-stack>

### Font Size

Dictates the scale of text, enhancing readability and defining information hierarchy across content.

<dt-stack gap="500">
  <dt-stack direction="row" gap="500">
    <svg-loader name="fs12" style="max-width: 140px" /> <!--lazy inline style until we redesign this whole page -->
    <svg-loader name="fs14" style="max-width: 140px" />
    <svg-loader name="fs16" style="max-width: 140px" />
    <svg-loader name="fs18" style="max-width: 140px" />
    <svg-loader name="fs20" style="max-width: 140px" />
  </dt-stack>
  <dt-stack direction="row" gap="500">
    <svg-loader name="fs28" style="max-width: 140px" />
    <svg-loader name="fs32" style="max-width: 140px" />
  </dt-stack>
</dt-stack>

### Line Height

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

All product UI text can be characterized as one of **Headline**, **Body**, **Label**, or **Code**. These styles are effectively **composition** CSS Utilities, combining multiple properties like `font-size`, `font-family`, `font-weight`, and `line-height`.

```html
<el class="d-text-{category}--{size}">...</el>
```

### Headlines

Titles and headings to establish hierarchy and set the tone of contextual groupings.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 42rem 1fr">
    <template v-for="({ var: varName }, index) in typographyStylesHeadlines" :key="varName">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-secondary-opaque', 'h:d-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
        <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-ws-nowrap">
          <span v-dt-tooltip="`Font Size`">{{ getStyles('headlines', index).fontSize }}</span>
          /
          <span v-dt-tooltip="`Line Height`">{{ getStyles('headlines', index).lineHeight }}</span>
          /
          <span v-dt-tooltip="`Font Weight`">{{ getStyles('headlines', index).fontWeightName }}</span>
        </dt-stack>
        <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
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
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 42rem 1fr">
    <template v-for="({ var: varName }, index) in typographyStylesBody" :key="varName">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-secondary-opaque', 'h:d-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
        <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-ws-nowrap">
          <span v-dt-tooltip="`Font Size`">{{ getStyles('body', index).fontSize }}</span>
          /
          <span v-dt-tooltip="`Line Height`">{{ getStyles('body', index).lineHeight }}</span>
          /
          <span v-dt-tooltip="`Font Weight`">{{ getStyles('body', index).fontWeightName }}</span>
        </dt-stack>
        <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
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
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 42rem 1fr">
    <template v-for="({ var: varName }, index) in typographyStylesLabel" :key="varName">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-secondary-opaque', 'h:d-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
        <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-ws-nowrap">
          <span v-dt-tooltip="`Font Size`">{{ getStyles('label', index).fontSize }}</span>
          /
          <span v-dt-tooltip="`Line Height`">{{ getStyles('label', index).lineHeight }}</span>
          /
          <span v-dt-tooltip="`Font Weight`">{{ getStyles('label', index).fontWeightName }}</span>
        </dt-stack>
        <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
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
  <div class="d-d-grid d-g16 d-ai-center" style="grid-template-columns: 42rem 1fr">
    <template v-for="({ var: varName }, index) in typographyStylesCode" :key="varName">
      <div class="d-truncate"><p :class="[varName, 'd-truncate', 'd-bgc-secondary-opaque', 'h:d-bgc-moderate-opaque']">{{ example }}</p></div>
      <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
        <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-ws-nowrap">
          <span v-dt-tooltip="`Font Size`">{{ getStyles('code', index).fontSize }}</span>
          /
          <span v-dt-tooltip="`Line Height`">{{ getStyles('code', index).lineHeight }}</span>
          /
          <span v-dt-tooltip="`Font Weight`">{{ getStyles('code', index).fontWeightName }}</span>
        </dt-stack>
        <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
        <div class="dialtone-copy-utility__btn">
          <copy-button :text="varName" aria-label="Copy" />
        </div>
      </dt-stack>
    </template>
  </div>
</code-well-header>

## Examples

<code-well-header class="d-pb32">
  <dt-stack gap="500">
    <dt-stack>
      <h2 class="d-text-headline--xxl">Ai that works for you</h2>
      <div class="d-text-body--lg">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
    </dt-stack>
    <dt-stack direction="row" gap="500" align="start">
      <dt-stack>
        <h3 class="d-text-headline--xl">Ai Contact Center</h3>
        <p class="d-text-body--md">The world’s most advanced customer engagement platform</p>
      </dt-stack>
      <dt-stack>
        <h3 class="d-text-headline--xl">Ai Voice</h3>
        <p class="d-text-body--md">Say hello to the world’s smartest business phone</p>
      </dt-stack>
      <dt-stack>
        <h3 class="d-text-headline--xl">Ai Meetings</h3>
        <p class="d-text-body--md">Ai-powered video meetings with built-in transcriptions</p>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack gap="500">
  <dt-stack>
    <h2 class="d-text-headline--xxl">Ai that works for you</h2>
    <div class="d-text-body--lg">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</div>
  </dt-stack>
  <dt-stack direction="row" gap="500" align="start">
    <dt-stack>
      <h3 class="d-text-headline--xl">Ai Contact Center</h3>
      <p class="d-text-body--md">The world’s most advanced customer engagement platform</p>
    </dt-stack>
    <dt-stack>
      <h3 class="d-text-headline--xl">Ai Voice</h3>
      <p class="d-text-body--md">Say hello to the world’s smartest business phone</p>
    </dt-stack>
    <dt-stack>
      <h3 class="d-text-headline--xl">Ai Meetings</h3>
      <p class="d-text-body--md">Ai-powered video meetings with built-in transcriptions</p>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

## API

Each typography style is expressed through a shorthand `font` property, and its value's design token contains all font styles, e.g. `font-size`, `line-height`, `font-family`, etc,

<clamped-table-wrapper>
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-w40p  d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Class</div></th>
          <th scope="col" class="d-p0 d-bbw0"><div class="d-p16 d-bb d-bc-default d-bbw1">Output</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ var: varName, output } in typographyStyles">
          <td class="d-code--sm d-docsite-code">.{{ varName }}</td>
          <td class="d-code--sm">{{ output }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</clamped-table-wrapper>

<script setup>
  import { typographyVariants, typographyStyles, weight } from '@data/type.json';
  import CopyButton from '@baseComponents/CopyButton.vue';
  import SvgLoader from '@baseComponents/SvgLoader.vue';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';

  const typographyStylesHeadlines = typographyStyles.filter(type => type.var.startsWith("d-text-headline"));
  const typographyStylesBody = typographyStyles.filter(type => type.var.startsWith("d-text-body"));
  const typographyStylesLabel = typographyStyles.filter(type => type.var.startsWith("d-text-label"));
  const typographyStylesCode = typographyStyles.filter(type => type.var.startsWith("d-text-code"));

  const example = "The quick brown fox jumps over the lazy dog.";

  // Map numeric font-weight to its name (e.g., "700" → "bold")
  const getWeightName = (numericWeight) => {
    const match = weight.find(w => w.output === numericWeight);
    return match ? match.name : numericWeight;
  };

  // Function to get styles directly from CSS variables
  const getStyles = (category, index) => {
    const arrays = { headlines: typographyStylesHeadlines, body: typographyStylesBody, label: typographyStylesLabel, code: typographyStylesCode };
    const item = arrays[category]?.[index];
    if (!item) return { fontSize: '', lineHeight: '', fontWeight: '', fontWeightName: '' };

    // Convert class name to CSS variable prefix
    // d-text-headline--xxxl → --dt-text-headline-xxxl
    const cssVarPrefix = '--dt-' + item.var.slice(2).replace('--', '-');

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Read the CSS variable values directly
    const fontSize = computedStyle.getPropertyValue(cssVarPrefix + '-font-size').trim();
    const lineHeight = computedStyle.getPropertyValue(cssVarPrefix + '-line-height').trim();
    const fontWeight = computedStyle.getPropertyValue(cssVarPrefix + '-font-weight').trim();

    // Parse font-size: extract multiplier from calc(1rem * X) and convert to px
    let formattedFontSize = fontSize;
    const calcMatch = fontSize.match(/calc\(1rem \* ([\d.]+)\)/);
    if (calcMatch) {
      formattedFontSize = Math.round(parseFloat(calcMatch[1]) * 10);
    } else if (fontSize.endsWith('px')) {
      formattedFontSize = Math.round(parseFloat(fontSize));
    }

    return { fontSize: formattedFontSize, lineHeight, fontWeight, fontWeightName: getWeightName(fontWeight) };
  };
</script>

<style lang="less" scoped>
  .dialtone-copy-utility {
    & {
      position: relative;
      cursor: default;
    }

    &__btn {
      display: none;
      position: absolute;
      inset-inline-end: 0;
      background-color: var(--dt-color-surface-secondary);
      padding-inline-start: var(--dt-space-300);

      .dialtone-copy-utility:hover & {
        display: block;
      }
    }
  }
</style>
