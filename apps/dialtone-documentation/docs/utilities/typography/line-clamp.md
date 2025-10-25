---
title: Line Clamp
description: Utilities for limiting the number of lines displayed for text content.
---

## Usage

Use `d-line-clamp-{n}` to truncate text at a specific number of lines with an ellipsis.

<code-well-header class="d-w100p">
  <div class="d-w100p d-d-grid d-g16 d-ai-start lg:d-fs-100" style="grid-template-columns: auto 1fr">
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-1</div>
    <div><p class="d-line-clamp-1 d-bgc-moderate">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-2</div>
    <div><p class="d-line-clamp-2 d-bgc-moderate">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-3</div>
    <div><p class="d-line-clamp-3 d-bgc-moderate">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-4</div>
    <div><p class="d-line-clamp-4 d-bgc-moderate">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></div>
    <div class="d-code--sm d-docsite-code d-ws-nowrap">.d-line-clamp-none</div>
    <div><p class="d-line-clamp-none d-bgc-moderate">Lorem ipsum dolor sit amet, consectetur adipiscing elit. This text will not be clamped and will show in its entirety.</p></div>
  </div>
</code-well-header>

```html
<p class="d-line-clamp-1">...</p>
<p class="d-line-clamp-2">...</p>
<p class="d-line-clamp-3">...</p>
<p class="d-line-clamp-4">...</p>
<p class="d-line-clamp-none">...</p>
```

## Browser Compatibility

<dt-notice kind="warning" class="d-wmx100p d-mt24" :hideClose="true">
  <template #default>
    The line-clamp utility uses the `-webkit-line-clamp` CSS property, which has good browser support but is technically a webkit-prefixed property. It works in all modern browsers including Chrome, Safari, Firefox (68+), and Edge.
  </template>
</dt-notice>

## Display Utility Interaction

<dt-notice kind="info" class="d-wmx100p d-mt24" :hideClose="true">
  <template #default>
    <p class="d-body--md-compact">The line-clamp utility sets <code>display: -webkit-box</code> which may conflict with other display utilities. If you need to use line-clamp with flex or grid layouts, consider wrapping the clamped text in a separate element:</p>
  </template>
</dt-notice>

```html
<!-- Instead of this -->
<div class="d-d-flex d-line-clamp-2">...</div>

<!-- Do this -->
<div class="d-d-flex">
  <p class="d-line-clamp-2">...</p>
</div>
```

## Examples

### Different Line Clamp Values

<code-well-header class="d-w100p">
  <dt-stack gap="500">
    <div>
      <h4 class="d-label--md d-mb4">Single Line (.d-line-clamp-1)</h4>
      <p class="d-line-clamp-1 d-bgc-moderate d-p8">
        The quick brown fox jumps over the lazy dog. This sentence is commonly used as a pangram to display all letters of the alphabet.
      </p>
    </div>
    <div>
      <h4 class="d-label--md d-mb4">Three Lines (.d-line-clamp-3)</h4>
      <p class="d-line-clamp-3 d-bgc-moderate d-p8">
        The quick brown fox jumps over the lazy dog. This sentence is commonly used as a pangram to display all letters of the alphabet. It has been used for testing typefaces, keyboards, and other applications involving all letters of the English alphabet. The phrase has been used since at least the late 1800s.
      </p>
    </div>
    <div>
      <h4 class="d-label--md d-mb4">Five Lines (.d-line-clamp-5)</h4>
      <p class="d-line-clamp-5 d-bgc-moderate d-p8">
        The quick brown fox jumps over the lazy dog. This sentence is commonly used as a pangram to display all letters of the alphabet. It has been used for testing typefaces, keyboards, and other applications involving all letters of the English alphabet. The phrase has been used since at least the late 1800s. Variations of the phrase exist, with some versions attempting to use each letter only once, though this is quite challenging to achieve while maintaining readability and coherence in the sentence structure.
      </p>
    </div>
  </dt-stack>
</code-well-header>

```html
<p class="d-line-clamp-1">Single line of text...</p>
<p class="d-line-clamp-3">Three lines of text...</p>
<p class="d-line-clamp-5">Five lines of text...</p>
```

### Use Cases

#### Card Descriptions

<code-well-header>
  <div class="d-d-grid d-gg16" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
    <div class="d-ba d-bc-default d-bar4 d-p16">
      <h3 class="d-headline--md d-mb8">Product Feature</h3>
      <p class="d-line-clamp-3 d-fc-secondary">
        This is a longer description of a product feature that might go on for several lines but we want to keep the cards uniform in height so we'll limit it to just three lines with an ellipsis at the end if it exceeds that limit.
      </p>
    </div>
    <div class="d-ba d-bc-default d-bar4 d-p16">
      <h3 class="d-headline--md d-mb8">Another Feature</h3>
      <p class="d-line-clamp-3 d-fc-secondary">
        Short description that fits within three lines.
      </p>
    </div>
  </div>
</code-well-header>

```html
<div class="card">
  <h3>Product Feature</h3>
  <p class="d-line-clamp-3">
    Long description text...
  </p>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in lineClamp" :key="i">
        <th class="d-code--sm d-docsite-code">.d-line-clamp-{{ i }}</th>
        <td class="d-code--sm">
          <span v-if="i !== 'none' && i !== 'unset'">
            -webkit-line-clamp: {{ i }} !important;
          </span>
          <span v-else>
            -webkit-line-clamp: unset !important;
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { lineClamp } from '@data/type.json';
</script>
