---
title: Image Viewer
description: Image Viewer lets the user click on an image to see it in a full screen modal.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-image-viewer--default
keywords: ["lightbox", "image modal", "photo viewer", "d-image-viewer", "DtImageViewer", "dt-image-viewer", "gallery", "carousel"]
---

<code-example only-show="demo">
  <dt-image-viewer
    :image-src="$withBase('/assets/images/test.jpg')"
    image-alt="Image Alt Text"
    image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
    aria-label="Click to open image"
    close-aria-label="Close"
  />
</code-example>

<component-combinator component-name="DtImageViewer" />

## Examples

### JPG Image

<code-example vueCode='
<dt-image-viewer
  image-src="url/to/image"
  image-alt="Image Alt Text"
  image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
'>
  <dt-image-viewer
    :image-src="$withBase('/assets/images/test.jpg')"
    image-alt="Image Alt Text"
    image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
    aria-label="Click to open image"
    close-aria-label="Close"
  />
</code-example>

### GIF Image

<code-example vueCode='
<dt-image-viewer
  image-src="/url/to/gif"
  image-alt="Image Alt Text"
  image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
'>
  <dt-image-viewer
    :image-src="$withBase('/assets/images/fry.gif')"
    image-alt="Image Alt Text"
    image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
    aria-label="Click to open image"
    close-aria-label="Close"
  />
</code-example>

## Vue API

<component-vue-api component-name="imageviewer" />
