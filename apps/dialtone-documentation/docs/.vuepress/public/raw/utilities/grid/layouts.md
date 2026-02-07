# Layouts

Common grid layout patterns used throughout Dialpad and UberConference.

- **Keywords**: css grid,grid layout,grid template,columns,rows

## Sidebar

Use `.d-gl-sidebar` to create a simple 2-column layout with a sidebar and main content area.

### CSS Variables

| CSS Var | Output |
| --- | --- |
| var(--sidebar-width) | minmax(20rem, 30rem); |
| var(--content-width) | minmax(32rem, 90ch); |

### Example

<aside class="d-bar8 d-of-hidden d-bgc-secondary">
    <div class="d-d-grid d-gl-sidebar d-g16 d-w100p d-hmn216 d-bar8 d-of-auto d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
    </div>
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

| CSS Var | Output |
| --- | --- |
| var(--header-height) | minmax(6.4rem, min-content); |
| var(--content-height) | minmax(64rem, max-content); |

### Example

<aside class="d-bar8 d-of-hidden d-bgc-secondary">
    <div class="d-d-grid d-gl-sidebar d-g16 d-w100p d-hmn216 d-bar8 d-bgc-moderate" style="--sidebar-width: minmax(10rem, 20rem);">
      <div class="d-ga-content d-d-grid d-gl-header d-g16 d-p16 d-bgc-moderate-opaque d-bar4" style="--content-height: minmax(24rem, max-content);">
      </div>
    </div>
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

| Class | Output |
| --- | --- |
| `d-g-cols1` | grid-template-columns: [full-start] repeat(1, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols10` | grid-template-columns: [full-start] repeat(10, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols11` | grid-template-columns: [full-start] repeat(11, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols12` | grid-template-columns: [full-start] repeat(12, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols2` | grid-template-columns: [full-start] repeat(2, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols3` | grid-template-columns: [full-start] repeat(3, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols4` | grid-template-columns: [full-start] repeat(4, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols5` | grid-template-columns: [full-start] repeat(5, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols6` | grid-template-columns: [full-start] repeat(6, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols7` | grid-template-columns: [full-start] repeat(7, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols8` | grid-template-columns: [full-start] repeat(8, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |
| `d-g-cols9` | grid-template-columns: [full-start] repeat(9, [col-start] var(--col-width, minmax(0,1fr)) [col-end]) [full-end] !important |

### Example

<aside class="d-bar8 d-of-hidden d-bgc-secondary d-p16">
    <div class="d-d-grid d-g-cols4 d-g16 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    </div>
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

```html
<div class="d-d-grid d-g16 d-g-cols2">
  <div>1</div>
  <div class="d-d-grid d-g16 d-g-cols2">
    <div>3</div>
    <div>4</div>
  </div>
</div>
```
