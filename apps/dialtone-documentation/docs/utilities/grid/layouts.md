---
title: Layouts
description: Common grid layout patterns used throughout Dialpad and UberConference.
keywords: ["css grid","grid layout","grid template","columns","rows"]
---

## Sidebar

Use `.d-gl-sidebar` to create a simple 2-column layout with a sidebar and main content area.

### CSS Variables

| CSS Var | Output |
| --- | --- |
| `var(--sidebar-width)` | `minmax(20rem, 30rem);` |
| `var(--content-width)` | `minmax(32rem, 90ch);` |

### Example

```vue demo
<dt-stack as="header" align="center" justify="center" class="d-p-200 d-w100p d-hmn216">
  <div class="d-d-grid d-gl-sidebar d-g-200 d-w100p d-hmn216 d-bar8 d-of-auto d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
    <dt-stack direction="row" align="center" justify="center" class="d-ga-sidebar d-p-200 d-bgc-moderate-opaque d-bar4">Sidebar</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-ga-content d-p-200 d-bgc-moderate-opaque d-bar4">Content</dt-stack>
  </div>
</dt-stack>
```

## Header

Use `.d-gl-header` to create a simple 2-row layout with a header area and main content area. Usually this is nested within a `.d-gl-sidebar` content area.

### CSS Variables

| CSS Var | Output |
| --- | --- |
| `var(--header-height)` | `minmax(6.4rem, min-content);` |
| `var(--content-height)` | `minmax(64rem, max-content);` |

### Example


```vue demo
<dt-stack as="header" align="center" justify="center" class="d-p-200 d-w100p d-hmn216 d-of-auto">
  <div class="d-d-grid d-gl-sidebar d-g-200 d-w100p d-hmn216 d-bar8 d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
    <dt-stack direction="row" align="center" justify="center" class="d-ga-sidebar d-p-200 d-bgc-moderate-opaque d-bar4">Sidebar</dt-stack>
    <div class="d-ga-content d-d-grid d-gl-header d-g-200 d-p-200 d-bgc-moderate-opaque d-bar4" style="--content-height: minmax(24rem, max-content);">
      <dt-stack direction="row" align="center" justify="center" class="d-ga-header d-p-200 d-bgc-moderate-opaque d-bar4">Header</dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ga-content d-p-200 d-bgc-moderate-opaque d-bar4">Content</dt-stack>
    </div>
  </div>
</dt-stack>
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

```vue demo
<dt-stack as="header" align="center" justify="center" class="d-w100p d-hmn216">
  <div class="d-d-grid d-g-cols4 d-g-200 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">5</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">6</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">7</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">8</dt-stack>
  </div>
</dt-stack>
<!-- @code -->
<div class="d-d-grid d-g-200 d-g-cols4">
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

```vue demo
<div class="d-d-grid d-g-cols2 d-g-200 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">1</dt-stack>
  <div class="d-d-grid d-g-cols2 d-g-200 d-p-200 d-bgc-moderate-opaque d-bar4">
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
  </div>
</div>
```
