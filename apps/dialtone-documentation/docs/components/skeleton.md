---
title: Skeleton
status: ready
thumb: true
image: assets/images/components/skeleton.png
description: Skeleton loader is a non-interactive placeholder that displays a preview of the UI to visually communicate that content is in the process of loading. Skeleton is used to provide a low fidelity representation of the user interface (UI) before content appears on the page.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-skeleton--default
figma: planned
keywords: ["loading placeholder","shimmer","ghost","d-skeleton","DtSkeleton","dt-skeleton"]
---

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton :animate="false" />
  </div>
</code-well-header>

## Usage

<dialtone-usage>
<template #do>

- Use when data takes more than 300ms to load on an average connection for our user base.
- Use to represent a general layout of what is being loaded.
- For a repeating list, show 6 items maximum, since it’s enough to give an idea of a layout. For conversations, limit to 3.
- Use skeleton loading for dynamic content, and use actual content for static content that doesn’t change e.g. page title, headings, action components (button, toggles, checkboxes etc.).
- Dynamic content: Content that would change after loading, usually data-based text.
- Static content: Content that can be loaded quickly and wouldn’t change, usually non-data-based text.
- Always match the size of content that will load.
- Always allow content to load gradually. Real content should replace skeleton objects immediately when the data is available.

</template>
<template #dont>

- Use for fast loading less than 300ms.
- Be super detailed trying to represent everything in an interface.
- Use for user action feedback e.g. saving form.

</template>
</dialtone-usage>

## Variants

### Default

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton :animate="false" arial-label="Loading" ref="defaultExample" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.defaultExample"
vueCode='
<dt-skeleton :animate="false" arial-label="Loading" />
'
showHtmlWarning />

### Animation

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton arial-label="Loading" ref="animationExample" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.animationExample"
vueCode='
<dt-skeleton arial-label="Loading" />
'
/>

## Custom

To customize a non-animating Skeleton background color modify the `--placeholder-from-color` variable with an inline `style`.

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton
      :animate="false"
      :text-option="{
        style: '--placeholder-from-color: var(--dt-color-blue-400)',
      }"
      ref="customExample"
      arial-label="Loading"
    />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.customExample"
vueCode='
<dt-skeleton
  :animate="false"
  :text-option="{
    style: `--placeholder-from-color: var(--dt-color-blue-400)`,
  }"
  arial-label="Loading"
/>
'
showHtmlWarning />

Customize an animating Skeleton by modifying the `--placeholder-from-color` and `--placeholder-to-color` variables with an inline `style`.

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton
      :text-option="{
        style: '--placeholder-from-color: var(--dt-color-blue-400); --placeholder-to-color: var(--dt-color-blue-200);',
      }"
      ref="customAnimateExample"
      arial-label="Loading"
    />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.customAnimateExample"
vueCode='
<dt-skeleton
  :text-option="{
    style: `--placeholder-from-color: var(--dt-color-blue-400); --placeholder-to-color: var(--dt-color-blue-200);`,
  }"
  arial-label="Loading"
/>
'
showHtmlWarning />

## Shapes

### Avatar

Default sizes match the avatar size. Size is customizable when needed.

<code-well-header class="d-ai-flex-start">
  <div ref="avatarExample">
    <p>S (24x24px)</p>
    <dt-skeleton :shape-option="{ shape: 'circle', size: 'sm' }" :animate="false" />
    <p>M (32x32px)</p>
    <dt-skeleton :shape-option="{ shape: 'circle' }" :animate="false" />
    <p>L (48x48px)</p>
    <dt-skeleton :shape-option="{ shape: 'circle', size: 'lg' }" :animate="false" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.avatarExample"
vueCode='
<dt-skeleton :shape-option="{ shape: `circle`, size: `sm` }" :animate="false" />
<dt-skeleton :shape-option="{ shape: `circle` }" :animate="false" />
<dt-skeleton :shape-option="{ shape: `circle`, size: `lg` }" :animate="false" />
'
/>

### Image / Icon

<code-well-header class="d-ai-flex-start">
  <div ref="squareExample">
    <p>S (24x24px)</p>
    <dt-skeleton :shape-option="{ shape: 'square', size: 'sm' }" :animate="false" />
    <p>M (32x32px)</p>
    <dt-skeleton :shape-option="{ shape: 'square' }" :animate="false" />
    <p>L (48x48px)</p>
    <dt-skeleton :shape-option="{ shape: 'square', size: 'lg' }" :animate="false" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.squareExample"
vueCode='
<dt-skeleton :shape-option="{ shape: `square`, size: `sm` }" :animate="false" />
<dt-skeleton :shape-option="{ shape: `square` }" :animate="false" />
<dt-skeleton :shape-option="{ shape: `square`, size: `lg` }" :animate="false" />
'
/>

### Headings

<code-well-header class="d-ai-flex-start">
  <div ref="headingsExample">
    <p>Small</p>
    <dt-skeleton :text-option="{ type: 'heading', headingHeight: 'sm', width: '160px' }" :animate="false" />
    <p>Medium</p>
    <dt-skeleton :text-option="{ type: 'heading', width: '240px' }" :animate="false" />
    <p>Large</p>
    <dt-skeleton :text-option="{ type: 'heading', headingHeight: 'lg', width: '320px' }" :animate="false" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.headingsExample"
vueCode='
<dt-skeleton :text-option="{ type: `heading`, headingHeight: `sm`, width: `160px` }" :animate="false" />
<dt-skeleton :text-option="{ type: `heading`, width: `240px` }" :animate="false" />
<dt-skeleton :text-option="{ type: `heading`, headingHeight: `lg`, width: `320px` }" :animate="false" />
'
/>

## Prefabricated Combinations

### Paragraphs

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton :paragraph-option="{ rows: 5, randomWidth: true }" :animate="false" />
  </div>
</code-well-header>

<code-example-tabs
vueCode='
<dt-skeleton
  :paragraph-option="{
    rows: 5,
    randomWidth: true,
  }"
  :animate="false"
/>
'
/>

### Avatar + Name

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton
      :list-item-option="{ shapeSize: 'sm', paragraphs: { rows: 1 } }"
    />
  </div>
</code-well-header>

<code-example-tabs
vueCode='
<dt-skeleton
  :list-item-option="{
    shapeSize: `sm`,
    paragraphs: {
      rows: 1,
    },
  }"
/>
'
/>

### Icon + Text

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton
      :list-item-option="{
        shapeSize: '2rem',
        shape: 'square',
        paragraphs: {
          rows: 1,
        },
      }"
    />
  </div>
</code-well-header>

<code-example-tabs
vueCode='
<dt-skeleton
  :list-item-option="{
    shapeSize: `2rem`,
    shape: `square`,
    paragraphs: {
      rows: 1,
    },
  }"
/>
'
/>

### Messages / Transcript / Comment

<code-well-header>
  <div class="d-w50p">
    <dt-skeleton
      :list-item-option="{
        shapeSize: '3.6rem',
        paragraphs: {
          rows: 4,
          width: [
            '120px', '311px', '371px', '279px',
          ],
        },
      }"
    />
  </div>
</code-well-header>

<code-example-tabs
vueCode='
<dt-skeleton
  :list-item-option="{
    shapeSize: `3.6rem`,
    paragraphs: {
      rows: 4,
      width: [
        `120px`, `311px`, `371px`, `279px`,
      ],
    },
  }"
/>
'
/>

## Accessibility

For sighted users, they are able to see that there is loading content and no other action is needed until loading completes.
Likewise, there is nothing that needs to be added for keyboard users.
For users who rely on assistive technology, skeleton’s visual representation of a loading state won’t be accessible
without additional labeling.

It's `role="status"` on the skeleton component, keep in mind, that:

- The aria live region role of status has an implicit `aria-live` value of `polite`, which allows a user to be notified
via AT (such as a screen reader) when status messages are added. The `role` of `status` also has a default `aria-atomic`
value of `true`, so that updates to the container marked with a role of status will result in the AT presenting the
entire contents of the container to the user, including any author-defined labels (or additional nested elements).

- `aria-busy` state indicates an element is being modified and that assistive technologies may want to wait until the
changes are complete before informing the user about the update.
When multiple parts of a live region need to be loaded before changes are announced to the user, set `aria-busy="true"`
until loading is complete. Then set to aria-busy="false". This prevents assistive technologies from announcing changes
before updates are done.

- If you need fully accessible skeleton and loading content, probably you will want to add `aria-live="polite"`
and `aria-busy="false"` to corresponding loaded html element content.

```vue
<dt-skeleton
  v-if="loading"
  :aria-label="$i18n('Loading')"
/>
<p
  v-else
  aria-live="polite"
  aria-busy="false"
>
  Loaded content.
</p>
```

### References

- [Aria-busy](https://accessibilityresources.org/aria-busy),
[Status role](https://www.digitala11y.com/status-role/),
[ARIA22](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22),
[a11y support status_role](https://a11ysupport.io/tech/aria/status_role#support-table-1)
- [Carbon DS Loading pattern](https://www.carbondesignsystem.com/patterns/loading-pattern/),
[Skeleton screens](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
- [Short note on being busy](https://www.tpgi.com/short-note-on-being-busy/),
[More Accessible Skeletons](https://adrianroselli.com/2020/11/more-accessible-skeletons.html)

## Vue API

<component-vue-api component-name="skeleton" />
