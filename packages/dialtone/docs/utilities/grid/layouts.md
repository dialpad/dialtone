---
title: Layouts
description: Common grid layout patterns used throughout Dialpad and UberConference.
---

## Sidebar

Use `.d-gl-sidebar` to create a simple 2-column layout with a sidebar and main content area.

### CSS variables

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w25p">CSS Var</th>
      <th scope="col">Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">var(--sidebar-width)</th>
      <td class="d-ff-mono d-fs-100">minmax(20rem, 30rem);</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">var(--content-width)</th>
      <td class="d-ff-mono d-fs-100">minmax(32rem, 90ch);</td>
    </tr>
  </tbody>
</table>

### Example

<aside class="d-bar8 d-of-hidden">
  <header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216">
    <div class="d-d-grid d-gl-sidebar d-gg16 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-purple-100 d-of-auto" style="--sidebar-width: minmax(10rem, 20rem);">
      <div class="d-ga-sidebar d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">Sidebar</div>
      <div class="d-ga-content d-fl-center d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold">Content</div>
    </div>
  </header>
</aside>

```html
<div class="d-d-grid d-gg16 d-gl-sidebar">
  <div class="d-ga-sidebar">...</div>
  <div class="d-ga-content">...</div>
</div>
```

## Header

Use `.d-gl-header` to create a simple 2-row layout with a header area and main content area. Usually this is nested within a `.d-gl-sidebar` content area.

### CSS variables

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w25p">CSS Var</th>
      <th scope="col">Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">var(--header-height)</th>
      <td class="d-ff-mono d-fs-100">minmax(6.4rem, min-content);</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">var(--content-height)</th>
      <td class="d-ff-mono d-fs-100">minmax(64rem, max-content);</td>
    </tr>
  </tbody>
</table>

### Example

<aside class="d-bar8 d-of-hidden">
  <header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn216 d-of-auto">
    <div class="d-d-grid d-gl-sidebar d-gg16 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-green-100" style="--sidebar-width: minmax(10rem, 20rem);">
      <div class="d-ga-sidebar d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold d-o50">Sidebar</div>
      <div class="d-ga-content d-d-grid d-gl-header d-gg16 d-p16 d-bgc-green-100 d-bar4 d-fs-300 d-fw-bold" style="--content-height: minmax(24rem, max-content);">
        <div class="d-ga-header d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">Header</div>
        <div class="d-ga-content d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">Content</div>
      </div>
    </div>
  </header>
</aside>

```html
<div class="d-d-grid d-gg16 d-gl-sidebar">
  <div class="d-ga-sidebar">...</div>
  <div class="d-ga-content">
    <div class="d-d-grid d-gg16 d-gl-header">
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
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-g-cols{{ i }}</th>
        <td class="d-ff-mono d-fs-100">grid-template-columns: repeat({{ i }},  minmax(0, 1fr)) !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

### Example

<aside class="d-bar8 d-of-hidden">
  <header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn216">
    <div class="d-d-grid d-g-cols4 d-gg16 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-magenta-100">
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">1</div>
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">2</div>
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">3</div>
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">4</div>
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">5</div>
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">6</div>
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">7</div>
      <div class="d-fl-center d-p16 d-bgc-magenta-100 d-bar4 d-fs-300 d-fw-bold">8</div>
    </div>
  </header>
</aside>

```html
<div class="d-d-grid d-gg16 d-g-cols4">
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

## Nesting grids

Unlike some CSS, CSS grid does not cascade beyond the parent and its direct children (`parent-element > *`). We can use this to our advantage by being able to nest grids within each other without cascade errors.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-d-grid d-g-cols2 d-gg16 d-p16 d-w100p d-hmn216 d-bar8 d-bgc-gold-100">
    <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-d-grid d-g-cols2 d-gg16 d-p16 d-bgc-gold-100 d-bar4 d-fs-300 d-fw-bold">
      <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">3</div>
      <div class="d-fl-center d-p16 d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold">4</div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-gg16 d-g-cols2">
  <div>1</div>
  <div class="d-d-grid d-gg16 d-g-cols2">
    <div>3</div>
    <div>4</div>
  </div>
</div>
```
