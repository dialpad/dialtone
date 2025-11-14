---
title: Getting Started with Dialtone
description: A quick start guide to add Dialtone to your project.
keywords: ["setup","install","quick start","introduction"]
---

## Adding Dialtone to Your Project

To take advantage of Dialtone's customizations, classes, and variables in your project, you will want to install Dialtone via [npm](https://www.npmjs.com/).

```bash
npm install @dialpad/dialtone-css
```

Add the following line in your Less file:

```less
@import "@dialpad/dialtone-css/lib/build/less/dialtone.less";
```

If you only need access to Dialtone's variables and customizations to build a file and don't need the whole library exported, use this line instead in your Less file:

```less
@import (reference) "@dialpad/dialtone-css/lib/build/less/dialtone.less";
```

## Theme and Mode

Dialtone includes a powerful theming system for light/dark modes, multiple themes, and accessibility. To add theming support to your project:

```bash
npm install @dialpad/dialtone @dialpad/dialtone-tokens
```

```js
import { initDialtoneTheme } from '@dialpad/dialtone/themes/config';
import Dp from '@dialpad/dialtone-tokens/themes/dp';

initDialtoneTheme(Dp, 'light');
```

This gives you access to multiple themes, light/dark mode switching, high contrast support, and Shadow DOM compatibility for web components.

[Learn more about Theme and Mode →](/guides/theme-and-mode/)

## Usage

A general overview of Dialtone's utility classes, CSS components, and Vue components.

### Utility-First

Dialtone's CSS library offers a framework of utility-first classes. Each class is a small, [atomic style](https://css-tricks.com/lets-define-exactly-atomic-css/) declaration that, when chained together, should mitigate most situations in which custom CSS must be written. Just write these classes right in your mark-up and you're all set!

<code-well-header>
  <div class="d-body--sm d-p8 d-bgc-contrast d-fc-primary-inverted d-bar8">Box</div>
</code-well-header>

```html
<div class="d-body--sm d-p8 d-bgc-contrast d-fc-primary-inverted d-bar8">Box</div>
```

In the above example, we used:

- Our [padding utility class](/utilities/spacing/padding.md) `.d-p8` to add 8px of padding on all sides.
- Our [background color utility class](/utilities/backgrounds/color.md) `.d-bgc-contrast`.
- Our [font color utility class](/utilities/typography/font-color.md) `.d-fc-primary-inverted` to change the font color to the inverted primary text color.
- Our [border radius](/utilities/borders/radius.md) `.d-bar8` for rounded corners.
- Our [text style](/foundations/typography/index.md) `.d-body--sm`.

Though an atomic CSS approach comes with many advantages, we know it also offers a notable disadvantage: reducing the CSS cascade. This is especially true for repeated UI elements, which can end up creating redundant mark-up. For these instances, Dialtone offers components.

### Components

There are two methods to implement Dialtone components: Vue (recommended) and CSS. Vue is the preferred method as it's more robust and readily accessible out-of-the-box. [Get started with Vue components](https://dialtone.dialpad.com/vue/).
In the event Dialtone Vue doesn't suit your needs, Dialtone's CSS library offers the same set of components. These may require more work to implement and make accessible, but will work in a pinch.

<code-well-header>
  <button class="d-btn d-btn--primary">Primary Button</button>
</code-well-header>

```html
<button class="d-btn d-btn--primary">Primary Button</button>
```

### Authoring Custom Style

In the event you need to write CSS, use [BEM (Block Element Modifier)](http://getbem.com/). This is a simple, common naming convention that helps make our CSS easier to read and understand. If you aren't familiar with the approach, here's a [quick synposis](http://getbem.com/introduction/):

- **Block:** A parent entity that is meaningful on its own. For example: `.card`
- **Element:** A child that is meaningful only in relation to its parent. For example: `.card__header`
- **Modifier:** A modifying flag on a Block or Element that changes appearance or behavior. For example: `.card--featured`

### HTML

```html
<div class="card card--featured">
  <div class="card__header">...</div>
  <div class="card__body">...</div>
  <div class="card__footer">...</div>
</div>
```

### CSS

```less
.card {
  // Local CSS Custom Properties
  --card-color-background: var(--dt-color-surface-primary);

  // Default block styles
  display: flex;
  flex-direction: column;
  background-color: var(--card-color-background);
  border: var(--dt-size-border-100) solid var(--dt-color-border-default);

  // Modifier for block
  &--featured {
    --card-color-background: var(--dt-color-surface-info);
  }

  // Elements within block
  &__header {
    padding: var(--dt-space-500);
  }

  &__body {
    flex-grow: 1;
    padding: var(--dt-space-500);
  }

  &__footer {
    padding: var(--dt-space-500);
  }
}
```

### Backbone

For internal Dialpad projects, using Dialtone in Backbone should be rare, since most front end changes are now being implemented using Vue. Regardless, if you find yourself needing to use Dialtone in Backbone, there are a few steps:

1. Create a `.less` file for your feature, if one does not yet exist.
2. Import this `.less` file into the relevant base less file e.g. `single.less`, `web.less` etc.
3. Import Dialtone into your `.less` file and compose your styles like shown in the example above.

### Polyfills

In order to make Dialtone work across our supported browsers you need to manually install **focus-visible** polyfill and **postcss-focus-visible** plugin.

1. Focus-visible adds a listener to every element that should be keyboard-focused only and when the element is focused, it adds the .focus-visible class to it, follow the [focus-visible](https://github.com/WICG/focus-visible#installation) installation instructions.
2. Postcss focus-visible plugin adds a .focus-visible class for every :focus-visible class found in your css, follow the [postcss-focus-visible](https://www.npmjs.com/package/postcss-focus-visible) installation instructions.

### Box-Sizing

All Dialtone components are implemented with `box-sizing: border-box;` applied. To understand why we prefer `border-box` over `content-box`, please visit this [Stack Overflow Teams question](https://stackoverflow.com/c/dialpad/questions/121).

In `Vue`, we apply `border-box` globally at the `VueView` level, ensuring all child elements use this style. As such, Dialtone styles will work correctly in Vue with respect to element sizing.

In `Backbone` we are not using `border-box` by default. Because Dialtone expects this, anytime we wish to use Dialtone styles in Backbone we must ensure to apply the `border-box` style to all affected elements.

## Components

Components are reusable building blocks that support a specific interaction or UI need. These components can be reused across Dialpad products and projects
ensuring UI consistency and cohesion while helping teams deliver high-quality features faster.

Dialtone provides two options to use the components: CSS and Vue.

### Vue components (recommended)

Use [Vue components](https://dialtone.dialpad.com/vue3/index.html) in the case your project supports Vue since these components are built conforming to [WCAG AA Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/glance/)
and with usability and performance in mind.

### CSS components

If Vue isn't supported in your application, you can use the [CSS components](../components/avatar.md) in your project, but you'll be responsible
for writing the correct markup, managing DOM elements and events, and making it [accessible for all users](../getting-started/accessibility/fundamentals.md).

See more about [components usage](../getting-started/usage.md/#components).

## Build Dialtone Locally

We're excited you want to install Dialtone locally as this most likely means you'll be contributing soon! Before you get to get started though,  **please make sure you've read our [contributing docs](https://github.com/dialpad/dialtone/blob/master/.github/CONTRIBUTING.md)**.

### Install Node & npm

To run Dialtone locally, you must have Node and NPM (Node Package Manager) installed. [Click here to download Node](https://nodejs.org/en/). The recommended Node version is fine. NPM is included with Node. If you already have Node installed, you may move onto the next step.

Once Node finishes installing, ensure it is installed properly by typing the following command in your Terminal window:

```bash
node -v
```

You should see the following response:

```bash
v16.x.x
```

### Clone Project

Download the project:

```bash
// SSH
git clone git@github.com:dialpad/dialtone.git

// HTTPS
git clone https://github.com/dialpad/dialtone.git
```

Then `cd` into the Dialtone directory:

```bash
cd ./path/to/dialtone
```

### Install Dependencies

Dialtone uses [Gulp](https://gulpjs.com/) to automate its various workflows.
Run the following command to install Gulp and all other project dependencies:

```bash
pnpm install
```

### Building Dialtone

You're now ready to build Dialtone! To build and run the development server:

```bash
nx run dialtone-documentation:start
```

Once finished, visit [http://localhost:4000/](http://localhost:4000/).
