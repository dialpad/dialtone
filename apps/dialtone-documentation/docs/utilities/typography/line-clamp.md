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

### Complex Examples

#### Mixed Typography Styles

Line clamping works with different text styles and maintains the typography hierarchy:

<code-well-header class="d-w100p">
  <dt-stack gap="500">
    <div class="d-ba d-bc-default d-bar4 d-p16">
      <h2 class="d-headline--lg d-line-clamp-1 d-mb8">This is a Very Long Headline That Will Be Clamped to a Single Line No Matter How Much Content</h2>
      <p class="d-body--md d-line-clamp-2 d-mb8">This is the body text that provides more detail about the headline above. It uses a different font size and weight but line clamping still works perfectly, maintaining readability while limiting the vertical space used.</p>
      <p class="d-body--sm d-line-clamp-1 d-fc-tertiary">Author: Jane Doe • Published: October 24, 2025 • Category: Design Systems</p>
    </div>
  </dt-stack>
</code-well-header>

```html
<h2 class="d-headline--lg d-line-clamp-1">Long headline...</h2>
<p class="d-body--md d-line-clamp-2">Body text...</p>
<p class="d-body--sm d-line-clamp-1 d-fc-tertiary">Meta info...</p>
```

#### Responsive Grid Layout

Combine line clamping with responsive grid layouts for consistent card heights:

<code-well-header class="d-w100p">
  <div class="d-d-grid d-gg24" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
    <div class="d-ba d-bc-default d-bar4 d-p12">
      <div class="d-w100p d-h64 d-bgc-moderate d-bar4 d-mb12"></div>
      <h4 class="d-headline--sm d-line-clamp-2 d-mb4">Product Design Fundamentals and Best Practices</h4>
      <p class="d-body--sm d-line-clamp-3 d-fc-secondary d-mb8">Learn the essential principles of product design, including user research, prototyping, and iterative design processes that lead to successful digital products.</p>
      <span class="d-label--sm d-fc-tertiary">12 lessons • 3hrs</span>
    </div>
    <div class="d-ba d-bc-default d-bar4 d-p12">
      <div class="d-w100p d-h64 d-bgc-moderate d-bar4 d-mb12"></div>
      <h4 class="d-headline--sm d-line-clamp-2 d-mb4">Advanced CSS</h4>
      <p class="d-body--sm d-line-clamp-3 d-fc-secondary d-mb8">Master modern CSS techniques including Grid, Flexbox, and animations.</p>
      <span class="d-label--sm d-fc-tertiary">8 lessons • 2hrs</span>
    </div>
    <div class="d-ba d-bc-default d-bar4 d-p12">
      <div class="d-w100p d-h64 d-bgc-moderate d-bar4 d-mb12"></div>
      <h4 class="d-headline--sm d-line-clamp-2 d-mb4">JavaScript ES6+ Features You Need to Know</h4>
      <p class="d-body--sm d-line-clamp-3 d-fc-secondary d-mb8">Explore the latest JavaScript features including destructuring, async/await, modules, and more. This comprehensive course covers everything from basic to advanced concepts with practical examples.</p>
      <span class="d-label--sm d-fc-tertiary">15 lessons • 4hrs</span>
    </div>
  </div>
</code-well-header>

#### Article Preview List

<code-well-header class="d-w100p">
  <dt-stack gap="400">
    <article class="d-p16 d-ba d-bc-subtle d-bar4">
      <div class="d-d-flex d-ai-start d-g16">
        <div class="d-fl-grow1">
          <h3 class="d-headline--md d-line-clamp-1 d-mb4">Understanding the Fundamentals of Design Systems in Modern Web Development</h3>
          <p class="d-body--md d-line-clamp-2 d-fc-secondary d-mb8">Design systems have revolutionized how teams build and maintain digital products. This comprehensive guide explores the core concepts, implementation strategies, and best practices for creating scalable design systems that enhance collaboration between designers and developers.</p>
          <div class="d-d-flex d-ai-center d-g8">
            <span class="d-badge">Design</span>
            <span class="d-badge">Development</span>
            <span class="d-fc-tertiary d-body--sm">• 5 min read</span>
          </div>
        </div>
        <div class="d-w96 d-h96 d-bgc-moderate d-bar4 d-fl-shrink0"></div>
      </div>
    </article>
    <article class="d-p16 d-ba d-bc-subtle d-bar4">
      <div class="d-d-flex d-ai-start d-g16">
        <div class="d-fl-grow1">
          <h3 class="d-headline--md d-line-clamp-1 d-mb4">CSS Grid vs Flexbox: When to Use Each</h3>
          <p class="d-body--md d-line-clamp-2 d-fc-secondary d-mb8">Both CSS Grid and Flexbox are powerful layout tools, but knowing when to use each can significantly improve your CSS architecture. Let's explore the strengths of each approach.</p>
          <div class="d-d-flex d-ai-center d-g8">
            <span class="d-badge">CSS</span>
            <span class="d-badge">Tutorial</span>
            <span class="d-fc-tertiary d-body--sm">• 3 min read</span>
          </div>
        </div>
        <div class="d-w96 d-h96 d-bgc-moderate d-bar4 d-fl-shrink0"></div>
      </div>
    </article>
  </dt-stack>
</code-well-header>

## Interactive Demo

### Dynamic Line Clamping

Try adjusting the line clamp value to see how the text truncates at different lengths:

<code-well-header class="d-w100p">
  <div class="d-p16">
    <div class="d-mb16">
      <label class="d-label--md d-mb8 d-db">Select line clamp value:</label>
      <select v-model="selectedClamp" class="d-select">
        <option v-for="value in ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'none']" :key="value" :value="value">
          {{ value === 'none' ? 'No clamping' : value + ' line' + (value === '1' ? '' : 's') }}
        </option>
      </select>
    </div>
    <div class="d-ba d-bc-default d-bar8 d-p16">
      <h3 class="d-headline--md d-mb8">Sample Article</h3>
      <p :class="`d-body--md d-fc-secondary ${selectedClamp === 'none' ? '' : 'd-line-clamp-' + selectedClamp}`">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
    </div>
    <div class="d-mt16 d-p12 d-bgc-secondary d-bar4">
      <code class="d-code--sm">{{ selectedClamp === 'none' ? 'No class applied' : '.d-line-clamp-' + selectedClamp }}</code>
    </div>
  </div>
</code-well-header>

### Comparison View

See how the same content looks with different line clamp values:

<code-well-header class="d-w100p">
  <div class="d-d-grid d-gg16" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
    <div v-for="lines in ['1', '2', '3', 'none']" :key="lines" class="d-ba d-bc-default d-bar4 d-p12">
      <h4 class="d-label--md d-mb8">{{ lines === 'none' ? 'No Clamping' : lines + ' Line' + (lines === '1' ? '' : 's') }}</h4>
      <p :class="`d-body--sm ${lines === 'none' ? '' : 'd-line-clamp-' + lines}`">
        The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it useful for testing fonts and demonstrating text layouts. It has been used since the late 1800s by typesetters to display font samples.
      </p>
      <code class="d-code--xs d-fc-tertiary d-mt8">{{ lines === 'none' ? 'No class' : '.d-line-clamp-' + lines }}</code>
    </div>
  </div>
</code-well-header>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in lineClamp" :key="i">
        <th class="d-code--sm d-docsite-code">.d-line-clamp-{{ i }}</th>
        <td class="d-code--sm">
          {{ i !== 'none' && i !== 'unset' ? `-webkit-line-clamp: ${i} !important;` : '-webkit-line-clamp: unset !important;' }}
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { ref } from 'vue';
  import { lineClamp } from '@data/type.json';
  
  const selectedClamp = ref('3');
</script>
