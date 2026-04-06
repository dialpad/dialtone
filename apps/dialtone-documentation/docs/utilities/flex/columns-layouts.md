---
title: Columns & Layouts
description: Utilities for flex columns and common flex layouts.
keywords: ["flexbox","flex columns","flex layout","column layout"]
---

> [!WARNING] Use DtStack in favor of Flex CSS Utilities
> Use the [DtStack](/components/stack) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Creating Flex Columns

Use `d-fl-col{n}` to create uniformly sized children within an element.

```vue demo
<dt-stack gap="200" class="d-w100p">
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col1</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col1">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col2</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col2">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col3</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col3">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col4</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col4">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col5</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col5">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col6</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col6">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">6</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col7</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col7">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">6</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">7</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col8</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col8">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">6</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">7</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">8</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col9</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col9">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">6</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">7</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">8</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">9</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col10</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col10">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">6</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">7</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">8</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">9</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">10</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col11</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col11">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">6</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">7</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">8</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">9</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">10</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">11</dt-stack>
    </div>
  </div>
  <div class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-fl-col12</dt-text>
    <div class="d-cg-100 d-of-auto d-fl-col12">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">6</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">7</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">8</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">9</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">10</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">11</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">12</dt-stack>
    </div>
  </div>
</dt-stack>
```

## Flex Column Gaps

Use `d-cg{n}` to create uniform gaps between flex columns within an element.

```vue demo
<dt-stack gap="200" class="d-w100p">
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg0</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg0">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg1</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg1">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg2</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg2">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg4</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg4">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg6</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg6">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg8</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg8">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg12</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg12">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg16</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg16">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg24</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg24">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg32</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg32">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg48</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg48">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100" class="d-p-100 d-bar8 d-bgc-moderate d-w100p">
    <dt-text as="p" kind="code" size="100">.d-cg64</dt-text>
    <div class="d-fl-col3 d-of-auto d-cg64">
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bar4 d-bgc-moderate-opaque">3</dt-stack>
    </div>
  </dt-stack>
</dt-stack>
```

## Centering Objects

This used to be accomplished with `d-fl-center`, which is deprecated in favor of using [Stack](/utilities/stack).

By default flexed items align to `flex-start` both horizontally and vertically (effectively top, left). Combine Stack's `align` and `justify` utilities to center-center child items within an element.

```vue demo
<dt-stack direction="row" align="center" justify="center" class="d-w100p d-hmn216 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-size-75 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-size-100 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-size-75 d-m-100 d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
</dt-stack>
```

<script setup>
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const gaps = [0, 1, 2, 4, 6, 8, 12, 16, 24, 32, 48, 64];
  const calcFlexBasis = (columns) => {
    return Math.round(100/columns);
  };
  const calcGap = (gap) => {
    return `${gap/10}rem`;
  };
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in columns">
        <th scope="row" class="d-code--sm d-docsite-code">.d-fl-col{{ i }}</th>
        <td class="d-code--sm d-ws-pre">> *{ flex-basis: calc({{ calcFlexBasis(i) }}% - (var(--fl-gap)* 2)); }</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in gaps">
        <th scope="row" class="d-code--sm d-docsite-code">.d-cg{{ i }}</th>
        <td class="d-code--sm d-ws-pre">> * { --fl-gap: {{ calcGap(i) }} !important; }</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
