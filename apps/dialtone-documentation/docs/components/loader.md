---
title: Loader
description: Animated indicator for indeterminate loading or progress.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-loader--default
keywords: ["spinner", "loading", "progress", "d-loader", "DtLoader", "dt-loader", "activity indicator", "spin", "dots", "dot loader"]
combinator: DtLoader
---

## Loader vs Skeleton

**Use Loader when:**

- You need a simple, generic loading indicator
- Loading time is short or indeterminate
- You want to indicate that a process is running without showing layout structure
- You need a compact loading indicator for buttons, small components, or overlays

**Use [Skeleton](/components/skeleton.html) when:**

- Content is expected to take more than a few hundred milliseconds to load on average
- You want to show the approximate layout and structure of content being loaded
- Loading complex lists, cards, or detailed content where users benefit from seeing the expected layout
- You need to maintain visual hierarchy during loading states

## Variants

### Default

The base loader should be the go-to loader for most of your needs. When in doubt, use this style.

<!-- @example {"id":"examples/loader-default","responsibilities":"Provide a meaningful loading label when the default loading label is insufficient.","interaction":"Presentational loading indicator; no application action or keyboard interaction is supplied."} -->

```vue demo
<dt-loader></dt-loader>
```

### Spinner

The circular spinner from earlier versions of Dialtone. Use `kind="spinner"` only where a placement still needs it.

```vue demo
<dt-loader kind="spinner"></dt-loader>
```

## Sizes

The base loader size is 24px and should be used in most cases.

<!-- @example {"id":"examples/loader-sizes","responsibilities":"DtStack is layout setup, not the subject of this example. Verify supported sizes against the selected installed API.","interaction":"Presentational size comparison; no application action or keyboard interaction is supplied."} -->

```vue demo
<dt-stack
  gap="200"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <dt-loader size="100"></dt-loader>
  <dt-loader size="200"></dt-loader>
  <dt-loader size="300"></dt-loader>
  <dt-loader size="400"></dt-loader>
  <dt-loader size="500"></dt-loader>
  <dt-loader size="600"></dt-loader>
  <dt-loader size="700"></dt-loader>
  <dt-loader size="800"></dt-loader>
</dt-stack>
<!-- @code -->
<dt-loader size="100|200|300|400|500|600|700|800"></dt-loader>
```

## Color

The loader inherits the text color of its parent through `currentColor`, so inside a [Button](/components/button.html) it matches the button's text. To recolor it, add a color utility class such as `d-fc-critical` to the loader or a parent element, or set the `--loader-color-dot` custom property.

## Accessibility

- You can add an `aria-label` attribute to the loader to indicate a custom label.
- If no `aria-label` is provided, the default value is "loading".
- When the user prefers reduced motion, the loader stops moving and gently pulses in opacity instead. This applies to both the dots and the spinner.

## Vue API

<component-vue-api component-name="loader" />
