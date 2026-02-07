# Hovercard

A Hovercard toggles a content overlay when its anchor element is hovered for a minimum amount of time.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-hovercard--default
- **Keywords**: hover tooltip, popover, card overlay, d-hovercard, DtHovercard, dt-hovercard, preview card, user card

The hovercard will appear upon the mouse entering the anchor, with a delay of 300 milliseconds. It will remain open as long as the mouse cursor is over either the open card or the anchor.

```vue
<dt-hovercard placement="bottom-start">
  <template #anchor>
    <dt-button kind="muted" importance="outlined">
      Hover over me
    </dt-button>
  </template>
  <template #content>
    <div>Content</div>
  </template>
  <template #headerContent>
    <div>Header</div>
  </template>
  <template #footerContent>
    <div>Footer</div>
  </template>
</dt-hovercard>
```

## Variants

### Many Hovercards

## Vue API

<!-- Vue API data not found for "hovercard" -->
