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
  <header class="d-fl-center d-fd-column d-p16 d-w100p d-hmn216">
    <div class="d-d-grid d-gl-sidebar d-g16 d-w100p d-hmn216 d-bar8 d-of-auto d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
      <div class="d-ga-sidebar d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">Sidebar</div>
      <div class="d-ga-content d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">Content</div>
    </div>
  </header>
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
  <header class="d-fl-center d-fd-column d-p16 d-w100p d-hmn216 d-of-auto">
    <div class="d-d-grid d-gl-sidebar d-g16 d-w100p d-hmn216 d-bar8 d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
      <div class="d-ga-sidebar d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">Sidebar</div>
      <div class="d-ga-content d-d-grid d-gl-header d-g16 d-p16 d-bgc-moderate-opaque d-bar4" style="--content-height: minmax(24rem, max-content);">
        <div class="d-ga-header d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">Header</div>
        <div class="d-ga-content d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">Content</div>
      </div>
    </div>
  </header>
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
  <header class="d-fl-center d-fd-column d-w100p d-hmn216">
    <div class="d-d-grid d-g-cols4 d-g16 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">1</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">2</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">3</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">4</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">5</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">6</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">7</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">8</div>
    </div>
  </header>
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
    <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">1</div>
    <div class="d-d-grid d-g-cols2 d-g16 d-p16 d-bgc-moderate-opaque d-bar4">
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">3</div>
      <div class="d-fl-center d-p16 d-bgc-moderate-opaque d-bar4">4</div>
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
