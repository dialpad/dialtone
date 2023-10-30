---
title: Background attachment
description: Utilities for controlling the way an element's background image position is fixed within the viewport or scrolls with its containing block.
---

## Scroll

Use `d-bga-scroll` to fix a background image to the element. It does not scroll with its content.

<code-well-header>
  <div class="d-p32 d-w100p d-h264 d-bgr-none d-bgs-cover d-bga-scroll d-fs-300 d-fw-bold d-of-y-scroll" style="background-image: url('/assets/images/agent-bw-illo.svg')">London. Michaelmas term lately over, and the Lord Chancellor sitting in Lincoln's Inn Hall. Implacable November weather. As much mud in the streets as if the waters had but newly retired from the face of the earth, and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an elephantine lizard up Holborn Hill. London. Michaelmas term lately over, and the Lord Chancellor sitting in Lincoln's Inn Hall. Implacable November weather. As much mud in the streets as if the waters had but newly retired from the face of the earth, and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an elephantine lizard up Holborn Hill.</div>
</code-well-header>

```html

<div class="... d-bga-scroll">...</div>
```

## Fixed

Use `d-bga-fixed` to fix a background image to the viewport. The background image does not scroll with the content.

<code-well-header>
  <div class="d-p32 d-w100p d-h264 d-bgr-none d-bgs-cover d-bga-fixed d-fs-300 d-fw-bold d-of-y-scroll" style="background-image: url('/assets/images/agent-bw-illo.svg')">London. Michaelmas term lately over, and the Lord Chancellor sitting in Lincoln's Inn Hall. Implacable November weather. As much mud in the streets as if the waters had but newly retired from the face of the earth, and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an elephantine lizard up Holborn Hill. London. Michaelmas term lately over, and the Lord Chancellor sitting in Lincoln's Inn Hall. Implacable November weather. As much mud in the streets as if the waters had but newly retired from the face of the earth, and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an elephantine lizard up Holborn Hill.</div>
</code-well-header>

```html

<div class="... d-bga-fixed">...</div>
```

## Local

Use `d-bga-local` to fix a background image relative to the element's contents. If the element is scrollable, the
background scrolls with the element's contents, and background area and positioning are relative to the scrollable area
of the element rather than the viewable box.

<code-well-header>
        <div class="d-p32 d-w100p d-h264 d-bgr-none d-bgs-cover d-bga-local d-fs-300 d-fw-bold d-of-y-scroll" style="background-image: url('/assets/images/agent-bw-illo.svg')">London. Michaelmas term lately over, and the Lord Chancellor sitting in Lincoln's Inn Hall. Implacable November weather. As much mud in the streets as if the waters had but newly retired from the face of the earth, and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an elephantine lizard up Holborn Hill. London. Michaelmas term lately over, and the Lord Chancellor sitting in Lincoln's Inn Hall. Implacable November weather. As much mud in the streets as if the waters had but newly retired from the face of the earth, and it would not be wonderful to meet a Megalosaurus, forty feet long or so, waddling like an elephantine lizard up Holborn Hill.</div>
</code-well-header>

```html

<div class="... d-bga-local">...</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['unset', 'scroll', 'fixed', 'local']">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-bga-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">background-attachment: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
