---
title: Image Viewer
description: Image Viewer lets the user click on an image to see it in a full screen modal.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-image-viewer--default
keywords: ["lightbox", "image modal", "photo viewer", "d-image-viewer", "DtImageViewer", "dt-image-viewer", "gallery", "carousel"]
combinator: DtImageViewer
---

## Examples

### JPG Image

```vue demo
<dt-image-viewer
  :image-src="$withBase('/assets/images/test.jpg')"
  image-alt="Image Alt Text"
  image-button-class="d-wmn-100 d-hmn-100 d-wmx-500 d-hmx-500"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
```

### GIF Image

```vue demo
<dt-image-viewer
  :image-src="$withBase('/assets/images/fry.gif')"
  image-alt="Image Alt Text"
  image-button-class="d-wmn-100 d-hmn-100 d-wmx-500 d-hmx-500"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
```

## Vue API

<component-vue-api component-name="imageviewer" />
