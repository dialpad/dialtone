---
title: Image Viewer
description: Image Viewer lets the user click on an image to see it in a full screen modal.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-image-viewer--default
---

<code-well-header>
  <dt-image-viewer
    image-src="https://dialtone.dialpad.com/vue/assets/test-mtc3yI39.jpg"
    image-alt="Image Alt Text"
    image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
    aria-label="Click to open image"
    close-aria-label="Close"
  />
</code-well-header>

## Examples

### JPG image

<code-well-header>
  <dt-image-viewer
    ref="jpgExample"
    image-src="https://dialtone.dialpad.com/vue/assets/test-mtc3yI39.jpg"
    image-alt="Image Alt Text"
    image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
    aria-label="Click to open image"
    close-aria-label="Close"
  />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.jpgExample'
vueCode='
<dt-image-viewer
  image-src="https://dialtone.dialpad.com/vue/assets/test-mtc3yI39.jpg"
  image-alt="Image Alt Text"
  image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
'
/>

### GIF image

<code-well-header>
  <dt-image-viewer
    ref="gifExample"
    image-src="https://dialtone.dialpad.com/vue/assets/fry-0Qyk-dGv.gif"
    image-alt="Image Alt Text"
    image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
    aria-label="Click to open image"
    close-aria-label="Close"
  />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.gifExample'
vueCode='
<dt-image-viewer
  image-src="https://dialtone.dialpad.com/vue/assets/fry-0Qyk-dGv.gif"
  image-alt="Image Alt Text"
  image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
'
/>

## Vue API

<component-vue-api component-name="imageviewer" />
