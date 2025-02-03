---
title: Background Clip
description: Utilities for controlling whether an element's background extends underneath its border, padding, or content box.
---

## Usage

Use `d-bgclip-{name}` to control which box an element's background is clipped by.

<code-well-header class='d-fl-col3 d-jc-center d-p24 d-bgc-purple-100 d-bgo50 d-flow16' custom>
  <div class="d-bgclip-border-box d-fl-center d-p16 d-bgc-purple-300 d-ba d-baw4 d-bas-dashed d-bar8 d-bc-purple-200 d-fs-200 d-fw-bold">border-box</div>
  <div class="d-bgclip-padding-box d-fl-center d-p16 d-bgc-purple-300 d-ba d-baw4 d-bas-dashed d-bar8 d-bc-purple-200 d-fs-200 d-fw-bold">padding-box</div>
  <div class="d-bgclip-content-box d-fl-center d-p16 d-bgc-purple-300 d-ba d-baw4 d-bas-dashed d-bar8 d-bc-purple-200 d-fs-200 d-fw-bold">content-box</div>
</code-well-header>

```html

<div class="d-bgclip-border-box">...</div>
<div class="d-bgclip-padding-box">...</div>
<div class="d-bgclip-content-box">...</div>
```

## Clipping Text

Use `d-bgclip-text` to clip the background color(s) within the foreground text.

<code-well-header class="d-jc-center d-p24 d-bgc-black-200 d-flow16" custom>
  <div class="d-bgclip-text d-w100p d-fl-center d-p16 d-bc-black-100 d-ba d-baw4 d-bas-dashed d-bar8 d-bgg-to-r d-bgg-from-purple-500 d-bgg-to-magenta-200 d-fs-500 d-fw-bold">Magic stuff happens.</div>
</code-well-header>

```html

<div class="d-bgclip-text d-bgg-to-r d-bgg-from-purple-500 d-bgg-to-magenta-200">...</div>
```

## Classes

<new-utility-class-table utility-class-prefix="d-bgclip-"/>
