# Image Viewer

Image Viewer lets the user click on an image to see it in a full screen modal.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-image-viewer--default
- **Keywords**: lightbox, image modal, photo viewer, d-image-viewer, DtImageViewer, dt-image-viewer, gallery, carousel

## Examples

### JPG Image

```vue
<dt-image-viewer
  image-src="url/to/image"
  image-alt="Image Alt Text"
  image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
```

### GIF Image

```vue
<dt-image-viewer
  image-src="/url/to/gif"
  image-alt="Image Alt Text"
  image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
  aria-label="Click to open image"
  close-aria-label="Close"
/>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `appendTo` | By default the portal appends to the body of the root parent. We can modify this behaviour by passing an appendTo prop that points to an id or an html tag from the root of the parent. The appendTo prop expects a CSS selector string or an actual DOM node. type: string \| HTMLElement, default: 'body' | `string` | `'body'` |
| `open` | Controls whether the image modal is shown. Leaving this null will have the image modal trigger on click by default. If you set this value, the default trigger behavior will be disabled and you can control it as you need. Supports .sync modifier | `boolean` | `null` |
| `imageSrc` | URL of the image to be shown | `string` | `''` |
| `imageAlt` | Alt text of image | `string` | `''` |
| `imageButtonClass` | Image Class | `string` | `''` |
| `ariaLabel` | Aria label | `string` | `''` |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `opened` | Emitted when popover is shown or hidden | `Boolean` |
| `update:open` | Event fired to sync the open prop with the parent component | `undefined` |
