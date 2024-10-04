---
title: Text opacity
description: Utilities for controlling an element's font-color opacity.
---
The ability to control an element's color is <em>only</em> provided as a class. We do not provide variables to control this. The text opacity class resets the font color's alpha channel CSS variable value.

## Usage

Use `d-fco{n}` to change a font-color's opacity. You can also change font-color's opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-fco{n}`, `f:d-fco{n}`, `fv:d-fco{n}` prefixes.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-magenta-100 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-magenta-400">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco99">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco95">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco90">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco75">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco50">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco25">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco10">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-300 d-fc-magenta-400 d-fco0">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-magenta-400">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco99">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco95">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco90">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco85">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco75">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco50">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco25">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco10">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-magenta-400 d-fco0">The quick brown fox jumps over the lazy dog.</p>
```

Please note that because the opacity adjustments are made via CSS variables, a font-color utility class must be present on the same element to work.

<div class="d-fw-bold d-d-flex d-ai-center d-lh20 d-mt16">
  <icon-close class="d-w24 d-h24 d-p2 d-bar-circle d-bgc-red-100 d-fc-red-200" />
  <span class="d-ml8">Text opacity utility classes don't inherit colors.</span>
</div>

<!-- Is important to have a blank line between div and ```html -->
<div  class="d-bgc-black-700 d-bar8">
  <div  class="d-p8 d-bgc-red-200 d-bgo25 d-bar8">

  ```jsx
  <p class="d-fc-primary">
      <span class="d-fco75">The quick brown fox jumps over the lazy dog.</span>
  </p>
  ```

  </div>
</div>

<div class="d-fw-bold d-d-flex d-ai-center d-lh20 d-mt16">
  <icon-checkmark class="d-w24 d-h24 d-p2 d-bar-circle d-bgc-green-100 d-fc-green-300" />
  <span class="d-ml8">Add a font-color utility classes to enable the opacity class to work.</span>
</div>

<!-- Is important to have a blank line between div and ```html -->
<div  class="d-bgc-black-700 d-bar8">
  <div  class="d-p8 d-bgc-green-200 d-bgo25 d-bar8">

  ```jsx
  <p class="d-fc-primary">
      <span class="d-fc-primary d-fco75">The quick brown fox jumps over the lazy dog.</span>
  </p>
  ```

  </div>
</div>

<script setup>
  import { opacity } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in opacity">
        <th scope="row" class="d-code--sm d-fc-purple-400">.d-fco{{ i }}</th>
        <td class="d-code--sm">--fco: {{ i }}% !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
