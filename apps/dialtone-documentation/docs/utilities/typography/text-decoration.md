---
title: Text Decoration
description: Utilities to change an element's text decoration styles.
---

## Underline

Use `d-td-underline` to underline text.

<code-well-header>
  <p class="d-td-underline">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-td-underline">...</p>
```

## Dotted

Use `d-td-dotted` to apply a dotted underline style to the text.

<code-well-header>
  <p class="d-td-dotted">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-td-dotted">...</p>
```

## Line Through

Use `d-td-line-through` to apply a line through the text.

<code-well-header>
  <p class="d-td-line-through">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-td-line-through">...</p>
```

## No Decorations

Use `d-td-none` to remove text decorations.

<code-well-header>
  <p class="d-td-none">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-td-none">...</p>
```

<script setup>
  import { decoration } from '@data/type.json';
</script>

## Hover

Use `h:d-td-{n}` to change an element's :hover state text decoration.

<code-well-header>
  <dt-button unstyled class="h:d-td-underline">
    The quick brown fox jumps over the lazy dog.
  </dt-button>
</code-well-header>

```html
<dt-button unstyled class="h:d-td-underline">
  The quick brown fox jumps over the lazy dog.
</dt-button>
```

## Focus

Use `f:d-td-{n}` to change an element's :focus and :focus-within state text decoration.

<code-well-header>
  <dt-button unstyled class="f:d-td-underline">
    The quick brown fox jumps over the lazy dog.
  </dt-button>
</code-well-header>

```html
<dt-button unstyled class="f:d-td-underline">
  The quick brown fox jumps over the lazy dog.
</dt-button>
```

## Focus Visible

Use `fv:d-td-{n}` to change an element's :focus-visible state text decoration [only when focused by keyboard].

<code-well-header>
  <dt-button unstyled class="fv:d-td-underline">
    The quick brown fox jumps over the lazy dog.
  </dt-button>
</code-well-header>

```html
<dt-button unstyled class="fv:d-td-underline">
  The quick brown fox jumps over the lazy dog.
</dt-button>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for=" i in decoration">
        <th scope="row" class="d-code--sm d-docsite-code">.d-td-{{ i }}</th>
        <td class="d-code--sm">
          <span v-if="i === 'dotted'">text-decoration: underline {{ i }} !important</span>
          <span v-else>text-decoration: {{ i }} !important</span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
