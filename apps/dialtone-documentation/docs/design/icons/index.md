---
title: Icons
status: in progress
shortTitle: icons
description: Glyphs with clean lines and consistent styles for clear context and easy understanding.
---

## Usage

For detailed instructions on using the icons and full library of icons, check the [Icon component](/components/icon.html).

### In Figma

Find a list of available icons in [DT Core: Icons](https://), or search the icons in the search library within your Figma file.

### In VUE

```js
import { DtIcon } from '@dialpad/dialtone-vue';
<dt-icon name="icon-name" size="500" />
```

### Choosing the right icon

Some icons are linked to specific actions, like the Settings gear icon <dt-icon name="settings" size="200" /> or the Edit pencil icon <dt-icon name="edit" size="200" /> .

When you need an icon for another action, don't just reuse these. Instead, find an existing icon in the [Icon Library](/components/icon.html) without a specific action meaning or consider [creating a new one](#crafting-an-icon) that clearly represents the intended action. This helps users quickly understand what each icon does and avoids confusion.

### Colors

- Don’t use different colors for text and icons. Match your icon color with your text color when pairing them.
- All icons are monochrome; don’t use more than one color within an icon.

### Accessibility

If your icon serves a purpose beyond its visual representation, it's vital to provide a clear description of its function in the ariaLabel prop. This ensures that all users, regardless of how they interact with your interface, can understand the icon's purpose.

## Crafting an icon

### Before we start

Simple and consistent shapes, our icons are designed for easy recognition and understanding. They are a visual support, helping people navigate the experience more effectively.

### On Figma

Go to the [Icon Builder page]([https://](https://www.figma.com/file/zz40wi0uW9MvaJ5RuhcRZR/DT8-Icon-Library?type=design&node-id=12057-3505&mode=design&t=CNADHg9I1bsKDPiB-4)) in Figma and follow the instructions. Remember to work on a branch and send a review for your icons.

- Use simple lines and shapes, and avoid creating overly literal, complex icons.
- Utilize the icon grid while maintaining the style of each icon.
- The icon's content should remain within the 2px padding (24x24); no part of the icon should extend beyond this area.
- Both exterior and interior corners should be 8px (24x24).
- The icon's weight varies depending on its size, ranging from 1 to 3.5.

### Exporting

Start by naming your icon using kebab-case, which enhances its readability.

<aside class="d-notice d-notice--info d-mt24 d-wmx100p" role="status" aria-hidden="false">
  <div class="d-notice__icon">
    <dt-icon name="info"></dt-icon>
  </div>
  <div class="d-notice__content d-stack4">
    <h2 class="d-notice__title"></h2>
    <p>
      <strong>Work in progress</strong>. We are working on improving this section with more details on how to craft an icon, from the corners, end points, strokes, grids and everything that will help you create your own icons and export them to Dialtone.
    </p>
  </div>
</aside>
