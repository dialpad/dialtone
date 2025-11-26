---
title: Layouts
description: Common grid layout patterns used throughout Dialpad and UberConference.
---

## Sidebar

Use `.d-gl-sidebar` to create a simple 2-column layout with a sidebar and main content area.

### CSS Variables

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w25p">CSS Var</th>
      <th scope="col">Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" class="d-code--sm d-docsite-code">var(--sidebar-width)</th>
      <td class="d-code--sm">minmax(20rem, 30rem);</td>
    </tr>
    <tr>
      <th scope="row" class="d-code--sm d-docsite-code">var(--content-width)</th>
      <td class="d-code--sm">minmax(32rem, 90ch);</td>
    </tr>
  </tbody>
</table>

### Example

<aside class="d-bar8 d-of-hidden d-bgc-secondary">
  <dt-stack as="header" align="center" justify="center" class="d-p16 d-w100p d-hmn216" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">
    <div class="d-d-grid d-gl-sidebar d-g16 d-w100p d-hmn216 d-bar8 d-of-auto d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
      <dt-stack direction="row" align="center" justify="center" class="d-ga-sidebar d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">Sidebar</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ga-content d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">Content</dt-stack>
    </div>
  </dt-stack>
</aside>

```html
<div class="d-d-grid d-g16 d-gl-sidebar">
  <div class="d-ga-sidebar">...</div>
  <div class="d-ga-content">...</div>
</div>
```

## Header

Use `.d-gl-header` to create a simple 2-row layout with a header area and main content area. Usually this is nested within a `.d-gl-sidebar` content area.

### CSS Variables

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w25p">CSS Var</th>
      <th scope="col">Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" class="d-code--sm d-docsite-code">var(--header-height)</th>
      <td class="d-code--sm">minmax(6.4rem, min-content);</td>
    </tr>
    <tr>
      <th scope="row" class="d-code--sm d-docsite-code">var(--content-height)</th>
      <td class="d-code--sm">minmax(64rem, max-content);</td>
    </tr>
  </tbody>
</table>

### Example

<aside class="d-bar8 d-of-hidden d-bgc-secondary">
  <dt-stack as="header" align="center" justify="center" class="d-p16 d-w100p d-hmn216 d-of-auto" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">
    <div class="d-d-grid d-gl-sidebar d-g16 d-w100p d-hmn216 d-bar8 d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
      <dt-stack direction="row" align="center" justify="center" class="d-ga-sidebar d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">Sidebar</dt-stack>
      <div class="d-ga-content d-d-grid d-gl-header d-g16 d-p16 d-bgc-moderate-opaque d-bar4" style="--content-height: minmax(24rem, max-content);">
        <dt-stack direction="row" align="center" justify="center" class="d-ga-header d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">Header</dt-stack>
        <dt-stack direction="row" align="center" justify="center" class="d-ga-content d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">Content</dt-stack>
      </div>
    </div>
  </dt-stack>
</aside>

```html
<div class="d-d-grid d-g16 d-gl-sidebar">
  <div class="d-ga-sidebar">...</div>
  <div class="d-ga-content">
    <div class="d-d-grid d-g16 d-gl-header">
      <div class="d-ga-header">...</div>
      <div class="d-ga-content">...</div>
    </div>
  </div>
</div>
```

## Columns

Use `.d-g-cols{n}` to create a multi-column layout.

### Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
        <th scope="row" class="d-code--sm d-docsite-code">.d-g-cols{{ i }}</th>
        <td class="d-code--sm">grid-template-columns: repeat({{ i }},  minmax(0, 1fr)) !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

### Example

<aside class="d-bar8 d-of-hidden d-bgc-secondary d-p16">
  <dt-stack as="header" align="center" justify="center" class="d-w100p d-hmn216" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">
    <div class="d-d-grid d-g-cols4 d-g16 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">5</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">6</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">7</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">8</dt-stack>
    </div>
  </dt-stack>
</aside>

```html
<div class="d-d-grid d-g16 d-g-cols4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
</div>
```

## Nesting Grids

Unlike some CSS, CSS grid does not cascade beyond the parent and its direct children (`parent-element > *`). We can use this to our advantage by being able to nest grids within each other without cascade errors.

<code-well-header>
  <div class="d-d-grid d-g-cols2 d-g16 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <div class="d-d-grid d-g-cols2 d-g16 d-p16 d-bgc-moderate-opaque d-bar4">
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
    </div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g16 d-g-cols2">
  <div>1</div>
  <div class="d-d-grid d-g16 d-g-cols2">
    <div>3</div>
    <div>4</div>
  </div>
</div>
```
