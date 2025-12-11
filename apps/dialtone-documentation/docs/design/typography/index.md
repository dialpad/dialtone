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

Product UI text can be characterized as one of **Headline**, **Body**, **Label**, or **Code**.

### Vue Component

Use the [DtText](/components/text.html) component as the primary way to apply typography styles. The component provides a semantic, prop-driven API that's easier to maintain and ensures consistent usage across your application.

```html
<dt-text kind="headline|body|label|code" size="{size}" {{props}}>...</dt-text>
```

### CSS Utility

Text Style CSS utilities should be considered a last resort or as a fallback for non-Vue contexts.

```html
<el class="d-text-{category}--{size}">...</el>
```

### Headlines

Titles and headings to establish hierarchy and set the tone of contextual groupings.

<code-well-header class="d-p16 d-bgc-secondary" custom>
  <table class="d-w100p">
    <tbody>
      <template v-for="({ var: varName }, index) in typographyStylesHeadlines" :key="varName">
        <tr>
          <td class="d-p4 d-lc-1">
            <div :class="[varName]">{{ example }}</div>
          </td>
          <td class="d-p4 d-ws-nowrap">
            <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-c-default">
              <span v-dt-tooltip="`Font Size`">{{ getStyles('headlines', index).fontSize }}</span>
              /
              <span v-dt-tooltip="`Line Height`">{{ getStyles('headlines', index).lineHeight }}</span>
              /
              <span v-dt-tooltip="`Font Weight`">{{ getStyles('headlines', index).fontWeightName }}</span>
            </dt-stack>
          </td>
          <td class="d-p4 d-ws-nowrap">
            <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
              <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
              <div class="dialtone-copy-utility__btn">
                <copy-button :text="varName" aria-label="Copy" />
              </div>
            </dt-stack>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</code-well-header>

### Body

Default text style for longer-form prose content, designed for comfort and clarity in reading varying lengths.

<code-well-header class="d-p16 d-bgc-secondary" custom>
  <table class="d-w100p">
    <tbody>
      <tr v-for="({ var: varName }, index) in typographyStylesBody" :key="varName">
        <td class="d-p4 d-lc-1">
          <div :class="[varName]">{{ example }}</div>
        </td>
        <td class="d-p4 d-ws-nowrap">
          <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-c-default">
            <span v-dt-tooltip="`Font Size`">{{ getStyles('body', index).fontSize }}</span>
            /
            <span v-dt-tooltip="`Line Height`">{{ getStyles('body', index).lineHeight }}</span>
            /
            <span v-dt-tooltip="`Font Weight`">{{ getStyles('body', index).fontWeightName }}</span>
          </dt-stack>
        </td>
        <td class="d-p4 d-ws-nowrap">
          <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
            <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
            <div class="dialtone-copy-utility__btn">
              <copy-button :text="varName" aria-label="Copy" />
            </div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </table>
</code-well-header>

### Label

Shorter-length copy like form fields, buttons, and other UI-labeling elements, ensuring clear navigation and
interaction.

<code-well-header class="d-p16 d-bgc-secondary" custom>
  <table class="d-w100p">
    <tbody>
      <tr v-for="({ var: varName }, index) in typographyStylesLabel" :key="varName">
        <td class="d-p4 d-lc-1">
          <div :class="[varName]">{{ example }}</div>
        </td>
        <td class="d-p4 d-ws-nowrap">
          <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-c-default">
            <span v-dt-tooltip="`Font Size`">{{ getStyles('label', index).fontSize }}</span>
            /
            <span v-dt-tooltip="`Line Height`">{{ getStyles('label', index).lineHeight }}</span>
            /
            <span v-dt-tooltip="`Font Weight`">{{ getStyles('label', index).fontWeightName }}</span>
          </dt-stack>
        </td>
        <td class="d-p4 d-ws-nowrap">
          <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
            <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
            <div class="dialtone-copy-utility__btn">
              <copy-button :text="varName" aria-label="Copy" />
            </div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </table>
</code-well-header>

### Code

Code snippets, technical commands, or data values rendered as a monospaced font.

<code-well-header class="d-p16 d-bgc-secondary" custom>
  <table class=d-w100p>
    <tbody>
      <tr v-for="({ var: varName }, index) in typographyStylesCode" :key="varName">
        <td class="d-p4 d-lc-1">
          <div :class="[varName]">{{ example }}</div>
        </td>
        <td class="d-p4 d-ws-nowrap">
          <dt-stack direction="row" as="code" gap="300" class="d-text-code--sm d-bgc-transparent d-ta-center d-c-default">
            <span v-dt-tooltip="`Font Size`">{{ getStyles('code', index).fontSize }}</span>
            /
            <span v-dt-tooltip="`Line Height`">{{ getStyles('code', index).lineHeight }}</span>
            /
            <span v-dt-tooltip="`Font Weight`">{{ getStyles('code', index).fontWeightName }}</span>
          </dt-stack>
        </td>
        <td class="d-p4 d-ws-nowrap">
          <dt-stack direction="row" justify="between" class="dialtone-copy-utility">
            <code class="dialtone-copy-utility__utility d-bgc-transparent d-text-code--sm">{{ varName }}</code>
            <div class="dialtone-copy-utility__btn">
              <copy-button :text="varName" aria-label="Copy" />
            </div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </table>
</code-well-header>

## Examples

<code-well-header>
  <dt-stack gap="400" class="d-w100p">
    <dt-text as="h2" kind="headline" size="lg">Saturday, May 24, 2025</dt-text>
    <dt-stack direction="row" gap="450" class="d-w100p">
      <dt-avatar full-name="Ashanti Trevor" />
      <dt-stack class="d-fl1">
        <dt-text kind="body" size="sm" strength="bold">Ashanti Trevor</dt-text>
        <dt-stack direction="row" gap="300">
          <dt-stack direction="row" gap="400">
            <dt-icon name="phone-outgoing" size="200" class="d-fc-tertiary" />
            <dt-text kind="body" size="xs" tone="tertiary">Outgoing call</dt-text>
          </dt-stack>
          <dt-text kind="body" size="xs" tone="tertiary">&bull;</dt-text>
          <dt-text kind="body" size="xs" tone="tertiary">2 minutes 10 seconds</dt-text>
        </dt-stack>
      </dt-stack>
      <dt-text kind="body" size="sm" tone="tertiary">3:23 pm</dt-text>
      <dt-badge kind="count" type="bulletin" text="6" />
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-text as="h2" kind="headline" size="lg">Saturday, May 24, 2025</dt-text>
<dt-stack direction="row" gap="450" class="d-w100p">
  <dt-avatar full-name="Ashanti Trevor" />
  <dt-stack class="d-fl1">
    <dt-text kind="body" size="sm" strength="bold">Ashanti Trevor</dt-text>
    <dt-stack direction="row" gap="300">
      <dt-stack direction="row" gap="400">
        <dt-icon name="phone-outgoing" size="200" class="d-fc-tertiary" />
        <dt-text kind="body" size="xs" tone="tertiary">Outgoing call</dt-text>
      </dt-stack>
      <dt-text kind="body" size="xs" tone="tertiary">&bull;</dt-text>
      <dt-text kind="body" size="xs" tone="tertiary">2 minutes 10 seconds</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-text kind="body" size="sm" tone="tertiary">3:23 pm</dt-text>
  <dt-badge kind="count" type="bulletin" text="6" />
</dt-stack>
```

<code-well-header class="d-pb32">
  <dt-stack gap="500">
    <dt-stack>
      <dt-text as="h2" kind="headline" size="xxl">Ai that works for you</dt-text>
      <dt-text kind="body" size="lg">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="500" align="start">
      <dt-stack>
        <dt-text as="h3" kind="headline" size="xl">Ai Contact Center</dt-text>
        <dt-text as="p" kind="body" size="md">The world's most advanced customer engagement platform</dt-text>
      </dt-stack>
      <dt-stack>
        <dt-text as="h3" kind="headline" size="xl">Ai Voice</dt-text>
        <dt-text as="p" kind="body" size="md">Say hello to the world's smartest business phone</dt-text>
      </dt-stack>
      <dt-stack>
        <dt-text as="h3" kind="headline" size="xl">Ai Meetings</dt-text>
        <dt-text as="p" kind="body" size="md">Ai-powered video meetings with built-in transcriptions</dt-text>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack gap="500">
  <dt-stack>
    <dt-text as="h2" kind="headline" size="xxl">Ai that works for you</dt-text>
    <dt-text kind="body" size="lg">Support customers, drive sales, and collaborate with your team—all in one, beautiful Ai-powered app.</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="500" align="start">
    <dt-stack>
      <dt-text as="h3" kind="headline" size="xl">Ai Contact Center</dt-text>
      <dt-text as="p" kind="body" size="md">The world's most advanced customer engagement platform</dt-text>
    </dt-stack>
    <dt-stack>
      <dt-text as="h3" kind="headline" size="xl">Ai Voice</dt-text>
      <dt-text as="p" kind="body" size="md">Say hello to the world's smartest business phone</dt-text>
    </dt-stack>
    <dt-stack>
      <dt-text as="h3" kind="headline" size="xl">Ai Meetings</dt-text>
      <dt-text as="p" kind="body" size="md">Ai-powered video meetings with built-in transcriptions</dt-text>
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
