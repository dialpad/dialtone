---
title: Skeleton
status: ready
thumb: true
image: assets/images/components/skeleton.png
description: Skeleton loader is a non-interactive placeholder that displays a preview of the UI to visually communicate that content is in the process of loading. Skeleton is used to provide a low fidelity representation of the user interface (UI) before content appears on the page.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-skeleton--default
figma: planned
---

<code-well-header>
  <div class="d-w50p">
    <div
      class="
        d-h8
        d-bar2
        skeleton-placeholder
      "
    ></div>
  </div>
</code-well-header>

## Variants

### Default

<code-well-header>
  <div class="d-w50p">
    <div class="d-h8 d-bar2 skeleton-placeholder"></div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div aria-busy="true" role="status" aria-label="">
  <div class="d-skeleton-text skeleton-placeholder" style="width: 100%;"></div>
</div>
'
vueCode='
<dt-skeleton :animate="false" />
'
showHtmlWarning />

### Animation

<code-well-header>
  <div class="d-w50p">
    <div class="d-h8 d-bar2 skeleton-placeholder skeleton-placeholder--animate"></div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div aria-busy="true" role="status" aria-label="">
  <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 100%; animation-delay: 3000ms; animation-duration: 1000ms;"></div>
</div>
'
vueCode='
<dt-skeleton />
'
showHtmlWarning />

## Custom

To customize a non-animating Skeleton background color modify the `--placeholder-from-color` variable with an inline `style`.

<code-well-header>
  <div class="d-w50p">
    <div
      class="
        skeleton-placeholder
        d-h8
        d-bar2
      "
      style="
        --placeholder-from-color: var(--dt-color-blue-400);
      ">
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div aria-busy="true" role="status" aria-label="">
  <div class="d-skeleton-text skeleton-placeholder" style="width: 100%; --placeholder-from-color: var(--dt-color-blue-400); --placeholder-to-color: var(--dt-color-blue-200);"></div>
</div>
'
vueCode='
<dt-skeleton
  :animate="false"
  :text-option="{
    style: `--placeholder-from-color: var(--dt-color-blue-400)`,
  }"
/>
'
showHtmlWarning />

Customize an animating Skeleton by modifying the `--placeholder-from-color` and `--placeholder-to-color` variables with an inline `style`.

<code-well-header>
  <div class="d-w50p">
    <div
      class="
        skeleton-placeholder
        skeleton-placeholder--animate
        d-h8
        d-bar2
      "
      style="
        --placeholder-from-color: var(--dt-color-blue-400);
        --placeholder-to-color: var(--dt-color-blue-200);
      ">
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div aria-busy="true" role="status" aria-label="">
  <div
    class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate"
    style="width: 100%; animation-delay: 3000ms; animation-duration: 1000ms; --placeholder-from-color: var(--dt-color-blue-400); --placeholder-to-color: var(--dt-color-blue-200);"
  ></div>
</div>
'
vueCode='
<dt-skeleton
  :text-option="{
    style: `--placeholder-from-color: var(--dt-color-blue-400); --placeholder-to-color: var(--dt-color-blue-200);`,
  }"
/>
'
showHtmlWarning />

## Prefabricated examples

<code-well-header>
  <div class="d-stack8 d-mb24 d-w50p">
    <div class="d-h16 d-bar2 skeleton-placeholder" style=" width: 160px; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-h24 d-bar2 skeleton-placeholder" style=" width: 240px; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-h32 d-bar2 skeleton-placeholder" style=" width: 320px; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
  </div>
  <div class="d-stack8 d-mb24 d-w50p">
    <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 90%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 87%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 82%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 92%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 21%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
  </div>
  <div class="d-d-flex d-mb24 d-gg8 d-ai-center">
    <div class="d-bar-circle d-bar2 skeleton-placeholder" style=" width: 1.8rem; height: 1.8rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-bar-circle d-bar2 skeleton-placeholder" style=" width: 2.4rem; height: 2.4rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-bar-circle d-bar2 skeleton-placeholder" style=" width: 3.2rem; height: 3.2rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-bar-circle d-bar2 skeleton-placeholder" style=" width: 4.8rem; height: 4.8rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
  </div>
  <div class="d-d-flex d-mb24 d-gg8 d-ai-center">
    <div class="d-bar2 skeleton-placeholder" style=" width: 1.2rem; height: 1.2rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-bar2 skeleton-placeholder" style=" width: 1.4rem; height: 1.4rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-bar2 skeleton-placeholder" style=" width: 1.8rem; height: 1.8rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-bar2 skeleton-placeholder" style=" width: 2.0rem; height: 2.0rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    <div class="d-bar2 skeleton-placeholder" style=" width: 2.4rem; height: 2.4rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
  </div>
  <div class="d-d-flex d-mb24 d-gg8 d-ai-center d-w50p">
    <div class="d-d-flex d-ai-center d-w50p d-gg8">
      <div class="d-bar-circle d-bar2 skeleton-placeholder" style=" width: 2.4rem; height: 2.4rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
      <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 87%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
    </div>
  </div>
  <div class="d-d-flex d-mb24 d-gg8 d-ai-center d-w50p">
    <div class="d-d-flex d-ai-center d-w50p d-gg8 d-ai-flex-start">
      <div class="d-bar-circle d-bar2 skeleton-placeholder" style=" width: 3.2rem; height: 3.2rem; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
      <div class="d-fl1 d-stack8">
        <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 90%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
        <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 87%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
        <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 82%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
        <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 92%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
        <div class="d-h8 d-bar2 skeleton-placeholder" style=" width: 21%; --placeholder-from-color: var(--dt-color-black-400); --placeholder-to-color: var(--dt-color-black-200); " ></div>
      </div>
    </div>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div aria-busy="true" role="status" aria-label="" class="d-mb8">
  <div class="d-h16 d-skeleton-text--heading skeleton-placeholder skeleton-placeholder--animate" style="width: 160px; animation-delay: 3000ms; animation-duration: 1000ms;"></div>
</div>
<div aria-busy="true" role="status" aria-label="" class="d-mb8">
  <div class="d-h24 d-skeleton-text--heading skeleton-placeholder skeleton-placeholder--animate" style="width: 240px; animation-delay: 3000ms; animation-duration: 1000ms;"></div>
</div>
<div aria-busy="true" role="status" aria-label="" class="d-mb8">
  <div class="d-h32 d-skeleton-text--heading skeleton-placeholder skeleton-placeholder--animate" style="width: 320px; animation-delay: 3000ms; animation-duration: 1000ms;"></div>
</div>
<div aria-busy="true" role="status" aria-label="" class="d-mb8">
  <div class="d-skeleton-paragraph">
    <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 88%; animation-delay: 1500ms; animation-duration: 1000ms;"></div>
    <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 75%; animation-delay: 1500ms; animation-duration: 1000ms;"></div>
    <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 75%; animation-delay: 1500ms; animation-duration: 1000ms;"></div>
    <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 43%; animation-delay: 1500ms; animation-duration: 1000ms;"></div>
    <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 62%; animation-delay: 1500ms; animation-duration: 1000ms;"></div>
  </div>
</div>
<div aria-busy="true" role="status" aria-label="" class="d-mb8">
  <div class="skeleton-placeholder d-bar2 skeleton-placeholder--animate" style="animation-delay: 3000ms; animation-duration: 1000ms; min-width: 32px; max-width: 32px; min-height: 32px; max-height: 32px;"></div>
</div>
<div aria-busy="true" role="status" aria-label="" class="d-mb8">
  <div class="skeleton-placeholder d-bar2 skeleton-placeholder--animate" style="animation-delay: 3000ms; animation-duration: 1000ms; min-width: 48px; max-width: 48px; min-height: 48px; max-height: 48px;"></div>
</div>
<div aria-busy="true" role="status" aria-label="" class="d-mb8">
  <div class="d-skeleton-list-item">
    <div
      class="d-skeleton-list-item__shape skeleton-placeholder d-bar-circle skeleton-placeholder--animate"
      style="animation-delay: 1800ms; animation-duration: 1000ms; min-width: 3.6rem; max-width: 3.6rem; min-height: 3.6rem; max-height: 3.6rem;"
    ></div>
    <div class="d-skeleton-list-item__paragraph-container">
      <div class="d-skeleton-paragraph">
        <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 120px; animation-delay: 1800ms; animation-duration: 1000ms;"></div>
        <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 311px; animation-delay: 1800ms; animation-duration: 1000ms;"></div>
        <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 371px; animation-delay: 1800ms; animation-duration: 1000ms;"></div>
        <div class="d-skeleton-text skeleton-placeholder skeleton-placeholder--animate" style="width: 279px; animation-delay: 1800ms; animation-duration: 1000ms;"></div>
      </div>
    </div>
  </div>
</div>
'
vueCode='
<dt-skeleton
  :text-option="{
    type: `heading`,
    width: `160px`,
    headingHeight: `sm`,
  }"
  class="d-mb8"
/>
<dt-skeleton
  :text-option="{
    type: `heading`,
    headingHeight: `md`,
    width: `240px`,
  }"
  class="d-mb8"
/>
<dt-skeleton
  :text-option="{
    type: `heading`,
    headingHeight: `lg`,
    width: `320px`,
  }"
  class="d-mb8"
/>
<dt-skeleton
  :paragraph-option="{
    rows: 5,
    randomWidth: true,
  }"
  class="d-mb8"
  :offset="0.5"
/>
<dt-skeleton
  :shape-option="{
    shape: `square`,
  }"
  class="d-mb8"
/>
<dt-skeleton
  :shape-option="{
    size: `lg`,
    shape: `square`,
  }"
  class="d-mb8"
/>
<dt-skeleton
  :offset="0.6"
  :list-item-option="{
    shapeSize: `3.6rem`,
    paragraphs: {
      rows: 4,
      width: [
        `120px`, `311px`, `371px`, `279px`,
      ],
    },
  }"
  class="d-mb8"
/>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="skeleton" />
