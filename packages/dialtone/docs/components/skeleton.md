---
title: Skeleton
status: ready
thumb: true
image: assets/images/components/skeleton.png
description: Skeleton loader is a non-interactive placeholder that displays a preview of the UI to visually communicate that content is in the process of loading. Skeleton is used to provide a low fidelity representation of the user interface (UI) before content appears on the page.
storybook: https://vue.dialpad.design/?path=/story/components-skeleton--default
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

```html
<div class="d-h8 d-bar2 skeleton-placeholder"></div>
```

### Animation

<code-well-header>
  <div class="d-w50p">
    <div class="d-h8 d-bar2 skeleton-placeholder skeleton-placeholder--animate"></div>
  </div>
</code-well-header>

```html
<div class="d-h8 d-bar2 skeleton-placeholder skeleton-placeholder--animate"></div>
```

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

```html
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
```

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

```html
<div
  class="
    skeleton-placeholder
    skeleton-placeholder--animate
    d-h8
    d-bar2
  "
  style="
    --placeholder-from-color: var(--dt-color-blue-300);
    --placeholder-to-color: var(--dt-color-blue-200);
  ">
</div>
```

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

## Vue API

<component-vue-api component-name="skeleton" />
