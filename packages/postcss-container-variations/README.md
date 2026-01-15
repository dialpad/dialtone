# PostCSS Container Variations

[PostCSS](https://github.com/postcss/postcss) plugin for creating container query variations from a list of classes.

## Overview

This plugin generates container query variants of utility classes, allowing styles to respond to the size of a container element rather than the viewport. It mirrors the functionality of `postcss-responsive-variations` but uses `@container` queries instead of `@media` queries.

## Installation

```bash
npm install @dialpad/postcss-container-variations --save-dev
```

## Usage

```js
const postcssContainerVariations = require('@dialpad/postcss-container-variations');

postcss([
  postcssContainerVariations({
    breakpoints: [
      { prefix: 'c-xs\\:', query: '(min-width: 320px)' },
      { prefix: 'c-sm\\:', query: '(min-width: 480px)' },
      { prefix: 'c-md\\:', query: '(min-width: 640px)' },
      { prefix: 'c-lg\\:', query: '(min-width: 960px)' },
    ],
    classes: [
      /^\\.d-p\\d+$/,  // Match padding utilities
      /^\\.d-m\\d+$/,  // Match margin utilities
    ],
  })
])
```

## Configuration

### breakpoints

Type: `Array<{ prefix: string, query: string }>`
Default:
```js
[
  { prefix: 'c-xs\\:', query: '(min-width: 320px)' },
  { prefix: 'c-sm\\:', query: '(min-width: 480px)' },
  { prefix: 'c-md\\:', query: '(min-width: 640px)' },
  { prefix: 'c-lg\\:', query: '(min-width: 960px)' },
]
```

Defines the container query breakpoints and their corresponding class prefixes.

### classes

Type: `Array<string | RegExp>`
Default: `[]`

List of class selectors or regex patterns that should have container query variants generated. String values should start with `.` and will be converted to regex patterns.

## Example

**Input CSS:**

```css
.d-p-8 {
  padding: var(--dt-space-400);
}

.d-fc-primary {
  color: var(--dt-color-foreground-primary);
}
```

**Output CSS:**

```css
.d-p-8 {
  padding: var(--dt-space-400);
}

.d-fc-primary {
  color: var(--dt-color-foreground-primary);
}

@container (min-width: 320px) {
  .c-xs\:d-p-8 {
    padding: var(--dt-space-400);
  }

  .c-xs\:d-fc-primary {
    color: var(--dt-color-foreground-primary);
  }
}

@container (min-width: 480px) {
  .c-sm\:d-p-8 {
    padding: var(--dt-space-400);
  }

  .c-sm\:d-fc-primary {
    color: var(--dt-color-foreground-primary);
  }
}

/* ... additional breakpoints ... */
```

**Usage in HTML:**

```html
<!-- Container element -->
<div class="d-container-inline">
  <!-- Child elements respond to container size -->
  <div class="d-p-4 c-sm:d-p-8 c-md:d-p-16">
    Content with responsive padding
  </div>
</div>
```

## Browser Support

Container queries are supported in:
- Chrome 105+ (September 2022)
- Firefox 110+ (February 2023)
- Safari 16+ (September 2022)

## License

MIT
