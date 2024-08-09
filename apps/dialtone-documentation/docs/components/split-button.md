---
title: Split Button
description: A split button offers a default action paired with a secondary action to reveal alternate, but related actions.
status: beta
thumb: true
image: assets/images/components/split-button.png
storybook:
---

<code-well-header>
  <dt-split-button>
    Place call
  </dt-split-button>
</code-well-header>

## Usage

## Variants

### Base

<code-well-header>
  <div class="d-d-flex d-flow8">
      <dt-split-button> Place Call </dt-split-button>
      <dt-split-button importance="outlined"> Place Call </dt-split-button>
      <dt-split-button importance="clear"> Place Call </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button> Place Call </dt-button>
<dt-split-button importance="outlined"> Place Call </dt-button>
<dt-split-button importance="clear"> Place Call </dt-button>
'
showHtmlWarning />

### Danger

<code-well-header>
  <div class="d-d-flex d-flow8">
      <dt-split-button kind="danger"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" kind="danger"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="danger"> Place Call </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--danger d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--danger d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--danger d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button kind="danger"> Place Call </dt-button>
<dt-split-button importance="outlined" kind="danger"> Place Call </dt-button>
<dt-split-button importance="clear" kind="danger"> Place Call </dt-button>
'
showHtmlWarning />

### Inverted

<code-well-header bgclass="d-bgc-contrast">
  <div class="d-d-flex d-flow8">
      <dt-split-button kind="inverted"> Place Call </dt-split-button>
      <dt-split-button importance="outlined" kind="inverted"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="inverted"> Place Call </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button kind="inverted"> Place Call </dt-split-button>
<dt-split-button importance="outlined" kind="inverted"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="inverted"> Place Call </dt-split-button>
'
showHtmlWarning />

### Muted

<code-well-header>
  <div class="d-d-flex d-flow8">
      <dt-split-button importance="outlined" kind="muted"> Place Call </dt-split-button>
      <dt-split-button importance="clear" kind="muted"> Place Call </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--muted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--muted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--muted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--muted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button importance="outlined" kind="muted"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="muted"> Place Call </dt-split-button>
'
showHtmlWarning />

### Disabled

<code-well-header>
  <div class="d-d-flex d-flow8">
      <dt-split-button disabled> Place Call (disable attribute)</dt-split-button>
      <span class="d-c-not-allowed">
        <dt-split-button class="d-btn--disabled"> Place Call (disabled class) </dt-split-button>
      </span>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button" disabled>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button" disabled>
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md d-btn--disabled" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md d-btn--disabled" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button disabled> Place Call (disable attribute)</dt-split-button>
<span class="d-c-not-allowed">
  <dt-split-button class="d-btn--disabled"> Place Call (disabled class) </dt-split-button>
</span>
'
showHtmlWarning />

### Active

<code-well-header>
  <div class="d-d-flex d-flow8">
    <dt-split-button alpha-active> Alpha active </dt-split-button>
    <dt-split-button omega-active importance="outlined"> Omega active </dt-split-button>
    <dt-split-button alpha-active omega-active importance="clear"> Both active </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--active d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button alpha-active> Alpha active </dt-split-button>
<dt-split-button omega-active importance="outlined"> Omega active </dt-split-button>
<dt-split-button alpha-active omega-active importance="clear"> Both active </dt-split-button>
'
showHtmlWarning />

### Sizes

<code-well-header>
  <div class="d-d-flex d-flow8 d-ai-center">
    <dt-split-button size="xs"> xs </dt-split-button>
    <dt-split-button size="sm"> sm </dt-split-button>
    <dt-split-button size="md"> md </dt-split-button>
    <dt-split-button size="lg"> lg </dt-split-button>
    <dt-split-button size="xl"> xl </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--xs d-split-btn__alpha d-split-btn__alpha--xs" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--xs d-btn--icon-only d-split-btn__omega d-split-btn__omega--xs" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--sm d-split-btn__alpha d-split-btn__alpha--sm" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--sm d-btn--icon-only d-split-btn__omega d-split-btn__omega--sm" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--lg d-split-btn__alpha d-split-btn__alpha--lg" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--lg d-btn--icon-only d-split-btn__omega d-split-btn__omega--lg" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--xl d-split-btn__alpha d-split-btn__alpha--xl" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--xl d-btn--icon-only d-split-btn__omega d-split-btn__omega--xl" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button size="xs"> xs </dt-split-button>
<dt-split-button size="sm"> sm </dt-split-button>
<dt-split-button size="md"> md </dt-split-button>
<dt-split-button size="lg"> lg </dt-split-button>
<dt-split-button size="xl"> xl </dt-split-button>
'
showHtmlWarning />

### Loading

<code-well-header>
  <div class="d-d-flex d-flow8 d-ai-center">
    <dt-split-button alpha-loading> Place call </dt-split-button>
    <dt-split-button alpha-loading importance="outlined"> Place call </dt-split-button>
    <dt-split-button alpha-loading importance="clear"> Place call </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--loading d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--loading d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--loading d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button alpha-loading> Place call </dt-split-button>
<dt-split-button alpha-loading importance="outlined"> Place call </dt-split-button>
<dt-split-button alpha-loading importance="clear"> Place call </dt-split-button>
'
showHtmlWarning />

### Icon support

#### Icon and label

<code-well-header>
  <div class="d-d-flex d-flow8 d-ai-center">
    <dt-split-button importance="outlined">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" alpha-icon-position="top">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" alpha-icon-position="right">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
    <dt-split-button importance="outlined" alpha-icon-position="bottom">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
      Place call
    </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--top">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--right">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--bottom">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
    <span class="d-btn__label base-button__label"> Place Call </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button importance="outlined">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="top">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="right">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="bottom">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
'
showHtmlWarning />

#### Icon only

<code-well-header>
  <div class="d-d-flex d-flow8 d-ai-center">
    <dt-split-button>
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="outlined" kind="muted">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="clear" kind="danger">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--danger d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button>
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="muted">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="danger">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
'
showHtmlWarning />

<code-well-header bgclass="d-bgc-contrast">
  <div class="d-d-flex d-flow8 d-ai-center">
    <dt-split-button kind="inverted">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="outlined" kind="inverted">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
    <dt-split-button importance="clear" kind="inverted">
      <template #alphaIcon="{ size }">
        <dt-icon name="phone" :size="size" />
      </template>
    </dt-split-button>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--primary d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--outlined d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
<span class="d-split-btn">
  <button class="base-button__button d-btn d-btn--inverted d-split-btn__alpha d-split-btn__alpha--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">
      <svg class="d-icon--size-300 d-icon">...</svg>
    </span>
  </button>
  <button class="base-button__button d-btn d-btn--inverted d-btn--icon-only d-split-btn__omega d-split-btn__omega--md" type="button">
    <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
  </button>
</span>
'
vueCode='
<dt-split-button kind="inverted">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="inverted">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="inverted">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="splitButton" />

## Classes

<component-class-table component-name="split-button" />
