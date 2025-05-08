---
title: Text Opacity
description: Utilities for controlling an element's font-color opacity.
---
The ability to control an element's color is <em>only</em> provided as a class. We do not provide variables to control this. The text opacity class resets the font color's alpha channel CSS variable value.

## Usage

Use `d-fco{n}` to change a font-color's opacity. You can also change font-color's opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-fco{n}`, `f:d-fco{n}`, `fv:d-fco{n}` prefixes.

<code-well-header>
  <p class="d-fc-critical">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco99">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco95">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco90">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco75">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco50">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco25">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco10">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco0">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-critical">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco99">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco95">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco90">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco85">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco75">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco50">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco25">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco10">The quick brown fox jumps over the lazy dog.</p>
<p class="d-fc-critical d-fco0">The quick brown fox jumps over the lazy dog.</p>
```

### Inheritance Constraints

Text opacity CSS Utilities won't be inherited by its children. A font-color utility class must be present on the same element to work.

<div class="d-d-grid d-g16 lg:d-g-cols2">
  <div>
    <dt-stack direction="row" gap="400" class="d-fc-warning d-mb8">
      <dt-icon name="alert-triangle" size="400" />
      <strong>Text opacity utility classes don't inherit colors.</strong>
    </dt-stack>
    <code-well-header>
      <div class="d-fc-critical">
        <p>The quick brown fox jumps over the lazy dog.</p>
        <p class="d-fco50">The quick brown fox jumps over the lazy dog.</p>
      </div>
    </code-well-header>

```html
// This will not work
<div class="d-fc-critical">
  <p>The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fco50">The quick brown fox jumps over the lazy dog.</p>
</div>
```

  </div>
  <div>
<dt-stack direction="row" gap="400" class="d-fc-success d-mb8">
  <dt-icon name="check-circle" size="400" />
  <strong>Apply each utility class to the same element</strong>
</dt-stack>

<code-well-header>
  <div class="d-fc-critical">
    <p>The quick brown fox jumps over the lazy dog.</p>
    <p class="d-fc-critical d-fco50">The quick brown fox jumps over the lazy dog.</p>
  </div>
</code-well-header>

```html
// This will
<div class="d-fc-critical">
  <p>The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fc-critical d-fco50">The quick brown fox jumps over the lazy dog.</p>
</div>
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
        <th scope="row" class="d-code--sm d-docsite-code">.d-fco{{ i }}</th>
        <td class="d-code--sm">--fco: {{ i }}% !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
