---
title: Outline
description: Utilities for controlling an element's outline.
keywords: ['focus ring', 'focus outline', 'focus style']
---

## Usage

Use `d-ol-{focusring|focusring-outset|none}` to change an element's outline.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--sm d-ol-focusring">
    .d-ol-focusring
  </dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--sm d-ol-focusring-outset">
    .d-ol-focusring-outset
  </dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-code--sm d-ol-none">
    .d-ol-none
  </dt-stack>
</dt-stack>
```

- Use `d-ol-focusring` to add a focus ring within the edge of an element. Use this utility when an element reaches the edge of its parent or its `overflow` property is set to `hidden`.
- Use `d-ol-focusring-outset` to add a focus ring outside the edge of an element.
- Use `d-ol-none` to remove an element's focus ring.

## Hover

Use `h:d-ol-{focusring|focusring-outset|none}` to change an element's outline on `:hover`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary h:d-ol-focusring-outset">outset</dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary h:d-ol-focusring">inset</dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary h:d-ol-none">none</dt-button>
</dt-stack>
```

## Focus Visible

Use `fv:d-ol-{focusring|focusring-outset|none}` to change an element's outline on `:focus-visible` when focused by keyboard.

> [!INFO]
> `fv:d-ol-*` applies to elements that are focused via **keyboard navigation**, not mouse or touch.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary fv:d-ol-focusring-outset">outset</dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary fv:d-ol-focusring">inset</dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary fv:d-ol-none">none</dt-button>
</dt-stack>
```

## Focus

Use `f:d-ol-{focusring|focusring-outset|none}` to change an element's outline on `:focus` and `:focus-within`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary f:d-ol-focusring-outset">outset</dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary f:d-ol-focusring">inset</dt-button>
  <dt-button kind="unstyled" class="d-p-200 d-bar-400 d-bgc-primary f:d-ol-none">none</dt-button>
</dt-stack>
```

<script setup>
  import { outline } from '@data/interactivity.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in outline">
        <th scope="row" class="d-code--sm d-docsite-code">.{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
