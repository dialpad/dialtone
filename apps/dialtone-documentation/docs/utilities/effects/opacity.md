---
title: Opacity
description: Utility classes for changing an element's opacity.
---

## Usage

Use `d-o{n}` to change the opacity of your element.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <div class="d-p16 d-bar8 d-bgc-moderate d-o100">.d-o100</div>
    <div class="d-p16 d-bar8 d-bgc-moderate d-o75">.d-o75</div>
    <div class="d-p16 d-bar8 d-bgc-moderate d-o50">.d-o50</div>
    <div class="d-p16 d-bar8 d-bgc-moderate d-o25">.d-o25</div>
    <div class="d-p16 d-bar8 d-bgc-moderate d-o0">.d-o0</div>
  </dt-stack>
</code-well-header>

```html
<div class="d-o100">...</div>
<div class="d-o75">...</div>
<div class="d-o50">...</div>
<div class="d-o25">...</div>
<div class="d-o0">...</div>
```

## Hover

Use `h:d-o{n}` to change an element's :hover state opacity.

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bar8 d-bgc-moderate h:d-o50">Hover me</dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="h:d-o50">...</dt-button>
```

## Focus

Use `f:d-o{n}` to change an element's :focus and :focus-within state opacity.

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bar8 d-bgc-moderate f:d-o50">Focus me</dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="f:d-o50">...</dt-button>
```

## Focus Visible

Use `fv:d-o{n}` to change an element's :focus-visible state opacity [only when focused by keyboard].

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bar8 d-bgc-moderate fv:d-o50">Keyboard focus me</dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="fv:d-o50">...</dt-button>
```

<script setup>
  const opacities = [
    {className: 0, value: 0},
    {className: 5, value: 0.05},
    {className: 10, value: 0.1},
    {className: 20, value: 0.2},
    {className: 25, value: 0.25},
    {className: 30, value: 0.3},
    {className: 40, value: 0.4},
    {className: 50, value: 0.5},
    {className: 60, value: 0.6},
    {className: 70, value: 0.7},
    {className: 75, value: 0.75},
    {className: 80, value: 0.8},
    {className: 90, value: 0.9},
    {className: 100, value: 1},
    {className: '-unset', value: 'unset'}
  ];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{className, value} in opacities">
        <th scope="row" class="d-code--sm d-docsite-code">.d-o{{className}}</th>
        <td class="d-code--sm">opacity: {{value}} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
