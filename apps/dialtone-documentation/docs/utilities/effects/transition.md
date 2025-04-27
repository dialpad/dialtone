---
title: Transition
description: Utilities for controlling how an element transitions in and out of states.
---

## Adding a Transition

Use `d-t` to add a transition to an element.

<code-well-header>
  <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t ">Hover me</dt-button>
</code-well-header>

```html
<dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t">...</dt-button>
```

## Changing Transition Duration

Use `d-td{n}` change an element's `transition-delay` from it's default `50ms` length.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td0  ">0ms</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t        ">50ms</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td100">100ms</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td150">150ms</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td200">200ms</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300">300ms</dt-button>
  </dt-stack>
</code-well-header>

```html
<div class="d-t d-td0">...</div>
<div class="d-t">...</div>
<div class="d-t d-td100">...</div>
<div class="d-t d-td150">...</div>
<div class="d-t d-td200">...</div>
<div class="d-t d-td300">...</div>
```

## Changing Transition Easing

Use `d-ttf-{n}` change an element's `transition-timing-function` (aka easing) from it's default Quad Ease In, Ease Out value.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300                ">Ease In, Ease Out</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out      ">Ease Out</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out-quint">Ease Out Quint</dt-button>
  </dt-stack>
</code-well-header>

```html
<div class="d-t d-td100">...</div>
<div class="d-t d-td100 d-ttf-out">...</div>
<div class="d-t d-td100 d-ttf-quint">...</div>
```

## Changing Transition Property

Use `d-tp-{n}` change an what items within an element are transitioned.

<code-well-header>
  <dt-stack direction="row" gap="500">
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out-quint ">All</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out-quint h:d-o50 d-tp-o">Opacity</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out-quint d-tp-bs">Box shadow</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out-quint d-tp-bgc">Background</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out-quint d-tp-transform">Transform</dt-button>
    <dt-button unstyled class="d-p16 d-bar8 d-bgc-moderate h:d-bgc-critical h:d-bs-md h:d-fc-critical d-t d-td300 d-ttf-out-quint d-tp-colors">Colors</dt-button>
  </dt-stack>
</code-well-header>

```html
<div class="d-t">...</div>
<div class="d-t d-tp-o">...</div>
<div class="d-t d-tp-bs">...</div>
<div class="d-t d-tp-bgc">...</div>
<div class="d-t d-tp-transform">...</div>
<div class="d-t d-tp-colors">...</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-t</th>
        <td class="d-code--sm">
          transition-duration: var(--td25);<br/>
          transition-property: all;<br/>
          transition-timing-function: var(--ttf-in-out);<br/>
          transition-delay: 0s;</td>
      </tr>
    </tbody>
    <tbody v-for="i in ['td', 'ttf', 'tp', 't-delay']">
      <tr v-if="i === 'td'" v-for="d in [0, 50, 100, 150, 200]">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ i }}{{ d }}</th>
        <td class="d-code--sm">transition-duration: var(--td{{ d }}) !important;</td>
      </tr>
      <tr v-else-if="i === 'ttf'" v-for="t in ['in-out', 'out', 'quint']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ i }}-{{ t }}</th>
        <td class="d-code--sm">transition-timing-function: var(--ttf-{{ t }}) !important;</td>
      </tr>
      <tr v-else-if="i === 'tp'" v-for="p in ['all', 'o', 'bs', 'bgc', 'transform', 'colors']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ i }}-{{ p }}</th>
        <td class="d-code--sm">
          transition-property:
            <span v-if="p === 'o'">opacity</span>
            <span v-else-if="p === 'bs'">box-shadow</span>
            <span v-else-if="p === 'bgc'">background-color</span>
            <span v-else-if="p === 'colors'">background-color, border-color, color, fill, stroke</span>
            <span v-else>{{ p }}</span>
          !important;
        </td>
      </tr>
      <tr v-else v-for="d in [25, 50, 100, 150, 200, 300]">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ i }}{{ d }}</th>
        <td class="d-code--sm">transition-delay: var(--td{{ d }}) !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
