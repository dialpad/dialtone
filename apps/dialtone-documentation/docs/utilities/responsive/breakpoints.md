---
title: Breakpoints
description: All classes can have responsive variations. Using our plugin @dialpad/postcss-responsive-variations and configuring the breakpoint constants, you can create media queries represented in conditional prefixes. These prefixed classes allow you to apply a style or property within a specific breakpoint.
---

## How Responsive Variations Work

The `@dialpad/postcss-responsive-variations` plugin generates responsive versions of your CSS classes by:

1. **Taking the base classes defined in the `classes` array in the configuration** (like `.d-d-block`)
2. **Creating prefixed versions** (like `.sm:d-d-block`, `.md:d-d-block`)
3. **Wrapping them in media queries** based on your breakpoint configuration

### What the Plugin Does

**Input CSS:**

```css
.d-d-block {
  display: block;
}
```

**Generated Output:**

```css
.d-d-block {
  display: block;
}

@media (min-width: 480px) {
  .sm\:d-d-block {
    display: block;
  }
}

@media (min-width: 640px) {
  .md\:d-d-block {
    display: block;
  }
}

@media (min-width: 980px) {
  .lg\:d-d-block {
    display: block;
  }
}

@media (min-width: 1264px) {
  .xl\:d-d-block {
    display: block;
  }
}
```

## Setup

To use [PostCSS](https://www.npmjs.com/package/postcss) with our custom plugin
[@dialpad/postcss-responsive-variations](https://www.npmjs.com/package/@dialpad/postcss-responsive-variations),
install it and configure your PostCSS setup.

## Configuration

### Step 1: Install the Plugin

```bash
npm install @dialpad/postcss-responsive-variations
```

### Step 2: Configure PostCSS

In your `postcss.config.js`, configure the plugin with two main options:

```js
import postcssResponsiveVariations from '@dialpad/postcss-responsive-variations';

// Define your breakpoints
const breakpoints = [
  { prefix: 'sm\\:', mediaQuery: '(min-width: 480px)' },
  { prefix: 'md\\:', mediaQuery: '(min-width: 640px)' },
  { prefix: 'lg\\:', mediaQuery: '(min-width: 980px)' },
  { prefix: 'xl\\:', mediaQuery: '(min-width: 1264px)' },
];

// Define which classes should get responsive variations
const classes = [
  /\.d-d-(flex|none|block)$/,  // Display utilities
  /\.d-p[0-9]+$/,              // Padding utilities
  /\.d-m[0-9]+$/,              // Margin utilities
  '.d-w100p',                  // Width 100%
];

export default {
  plugins: [
    postcssResponsiveVariations({ breakpoints, classes }),
  ],
};
```

### Configuration Options

**`breakpoints`** (optional): Array of breakpoint objects. Each object has:

- `prefix`: The prefix to use (e.g., `'sm\:'`)
- `mediaQuery`: The CSS media query (e.g., `'(min-width: 480px)'`)

**`classes`**: Array of class selectors (strings or regex patterns) that should get responsive variations.

### Recommended Breakpoints

Dialtone uses a **mobile-first approach** with `min-width` media queries as the default recommendation.

To take advantage of this, simply use the breakpoints provided by the plugin, which are:

```js
[
  { prefix: 'sm\\:', mediaQuery: '(min-width: 480px)' },
  { prefix: 'md\\:', mediaQuery: '(min-width: 640px)' },
  { prefix: 'lg\\:', mediaQuery: '(min-width: 980px)' },
  { prefix: 'xl\\:', mediaQuery: '(min-width: 1264px)' },
]
```

And in the configuration define only the classes you want to have responsive variations:

```js
import postcssResponsiveVariations from '@dialpad/postcss-responsive-variations';

// Define which classes should get responsive variations
const classes = [
  '.d-d-block',
  ...otherClasses
];

export default {
  plugins: [
    postcssResponsiveVariations({ classes }),
  ],
};
```

For more context on this approach and its benefits, see our [What's New post about mobile-first design principles](https://dialtone.dialpad.com/about/whats-new/posts/2025-5-6.html).

### Examples of Class Patterns

```js
const classes = [
  // Exact match
  '.d-d-block',

  // Regex for multiple related classes
  /\.d-d-(flex|none|block)$/,     // Matches .d-d-flex, .d-d-none, .d-d-block
  /\.d-p[0-9]+$/,                 // Matches .d-p8, .d-p16, .d-p24, etc.
  /\.d-m[tblr]?[0-9]*$/,          // Matches .d-m8, .d-mt16, .d-ml24, etc.
];
```

**Result**: The plugin will generate responsive versions like `sm:d-d-block`, `md:d-p16`, `lg:d-mt8`, etc.

**⚠️ Performance Note**: Be mindful of CSS bundle size when adding classes to the configuration. Each class added to the `classes` array will generate 4 additional responsive variations (one for each breakpoint: `sm:`, `md:`, `lg:`, `xl:`), significantly increasing your CSS bundle size. Only include classes that are actually used in your application to keep bundle sizes optimal.

## Usage

<code-well-header>
  <div class="d-ai-center d-w100p d-m8 d-p16 d-bgc-moderate d-bar4 d-ta-center">Visible on <strong>all</strong> screens</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-moderate d-bar4 d-ta-center d-d-none xl:d-d-block">Visible only on screens wider than <strong>extra-large</strong> breakpoint</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-moderate d-bar4 d-ta-center d-d-none lg:d-d-block">Visible only on screens wider than <strong>large</strong> breakpoint</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-moderate d-bar4 d-ta-center d-d-none md:d-d-block">Visible only on screens wider than <strong>medium</strong> breakpoint</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-moderate d-bar4 d-ta-center d-d-none sm:d-d-block">Visible only on screens wider than <strong>small</strong> breakpoint</div>
</code-well-header>

```html
<div>...</div>
<div class="d-d-none xl:d-d-block">...</div>
<div class="d-d-none lg:d-d-block">...</div>
<div class="d-d-none md:d-d-block">...</div>
<div class="d-d-none sm:d-d-block">...</div>
```

## Classes

To help keep prefixes concise, we use abbreviations. This syntax is used consistently across all responsive classes. As the viewport size grows, you can change an elements properties. For example, you can set an element to display normally, but be hidden at smaller sizes: `.d-d-block .sm:d-d-none`.

<div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
  <div>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
        <tr>
          <th scope="col" class="d-p0 d-bbw0 d-w25p"><div class="d-p16 d-bb d-bbw1">Class Prefix</div></th>
          <th scope="col" class="d-p0 d-bbw0 d-w25p"><div class="d-p16 d-bb d-bbw1">Media Query</div></th>
          <th scope="col" class="d-p0 d-bbw0 "><div class="d-p16 d-bb d-bbw1">Description</div></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.sm:{class}</th>
          <td class="d-code--sm">min-width: 480px</td>
          <td class="d-code--sm">The class is applied on small browser widths and above.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.md:{class}</th>
          <td class="d-code--sm">min-width: 640px</td>
          <td class="d-code--sm">The class is applied on medium browser widths and above.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.lg:{class}</th>
          <td class="d-code--sm">min-width: 980px</td>
          <td class="d-code--sm">The class is applied on large browser widths and above.</td>
        </tr>
        <tr>
          <th scope="row" class="d-code--sm d-docsite-code">.xl:{class}</th>
          <td class="d-code--sm">min-width: 1264px</td>
          <td class="d-code--sm">The class is applied on extra large browser widths and above.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
