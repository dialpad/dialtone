---
title: Gradients
description: Utilities for creating an background gradient and controlling its stops.
---

## Starting Color

Use `d-bgg-from-{color}` to declare the gradient starting color stop.

<code-well-header>
  <div class="d-w100p d-h128 d-bar8 d-bgg-to-br d-bgg-from-purple-400"></div>
</code-well-header>

```html
<div class="d-bgg-to-br d-bgg-from-purple-400">...</div>
```

## Ending Color

Use `d-bgg-to-{color}` to declare the gradient ending color stop.

<code-well-header>
  <div class="d-w100p d-h128 d-bar8 d-bgg-to-br d-bgg-from-magenta-300 d-bgg-to-purple-400"></div>
</code-well-header>

```html
<div class="d-bgg-to-br d-bgg-from-purple-400 d-bgg-to-magenta-300">...</div>
```

## Hover

Use `h:d-bgg-{from|to}-{color}` to change an element's background gradient color spot when in an `:hover` state.

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 h:d-bgg-to-magenta-300 d-baw0">Hover over me</dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 h:d-bgg-to-magenta-300 d-baw0">Hover over me</dt-button>
```

## Focus

Use `f:d-bgg-{from|to}-{color}` to change an element's background gradient starting and ending stops in `:focus` and `:focus-within` states.

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 f:d-bgg-to-magenta-300 d-baw0">Focus me</dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 f:d-bgg-to-magenta-300 d-baw0">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-bgg-{from|to}-{color}` to change an element's background gradient starting and ending stops in `:focus-visible` state [only when focused by keyboard].

<code-well-header>
  <dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 fv:d-bgg-to-magenta-300 d-baw0">Keyboard focus me</dt-button>
</code-well-header>

```html
<dt-button kind="unstyled" class="d-p16 d-bar4 d-fs-200 d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 fv:d-bgg-to-magenta-300 d-baw0">Keyboard focus me</dt-button>
```

## Changing Opacities

Use `d-bgg-(from|to)-o{n}` to change the opacity values of each gradient color stop. You can also change the opacity values of each gradient color stop on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgg-(from|to)-o{n}`, `f:d-bgg-(from|to)-o{n}`, `fv:d-bgg-(from|to)-o{n}` prefixes.

<code-well-header>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-to-magenta-100 d-bgg-to-o0 d-fs-300 d-fw-bold" data-migrate-outline><span>100%</span><span>0%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o99 d-bgg-to-magenta-100 d-bgg-to-o10 d-fs-300 d-fw-bold" data-migrate-outline><span>99%</span><span>10%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o95 d-bgg-to-magenta-100 d-bgg-to-o25 d-fs-300 d-fw-bold" data-migrate-outline><span>95%</span><span>25%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o90 d-bgg-to-magenta-100 d-bgg-to-o50 d-fs-300 d-fw-bold" data-migrate-outline><span>90%</span><span>50%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o75 d-bgg-to-magenta-100 d-bgg-to-o75 d-fs-300 d-fw-bold" data-migrate-outline><span>75%</span><span>75%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o50 d-bgg-to-magenta-100 d-bgg-to-o90 d-fs-300 d-fw-bold" data-migrate-outline><span>50%</span><span>90%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o25 d-bgg-to-magenta-100 d-bgg-to-o95 d-fs-300 d-fw-bold" data-migrate-outline><span>25%</span><span>95%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o10 d-bgg-to-magenta-100 d-bgg-to-o99 d-fs-300 d-fw-bold" data-migrate-outline><span>10%</span><span>99%</span></dt-stack>
  <dt-stack direction="row" justify="between" align="center" class="d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o0 d-bgg-to-magenta-100 d-fs-300 d-fw-bold" data-migrate-outline><span>0%</span><span>100%</span></dt-stack>
</code-well-header>

```html
<div class="d-bgg-from-purple-300 d-bgg-to-magenta-100 d-bgg-to-o0">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o99 d-bgg-to-magenta-100 d-bgg-to-o10">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o95 d-bgg-to-magenta-100 d-bgg-to-o25">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o90 d-bgg-to-magenta-100 d-bgg-to-o50">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o75 d-bgg-to-magenta-100 d-bgg-to-o75">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o50 d-bgg-to-magenta-100 d-bgg-to-o90">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o25 d-bgg-to-magenta-100 d-bgg-to-o95">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o10 d-bgg-to-magenta-100 d-bgg-to-o99">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o0 d-bgg-to-magenta-100">...</div>
```

## Directions

To create a background gradient, first declare the desired gradient and, if applicable, the direction. All classes with directions are linear gradients. Radial gradients start from the center and work out to the edge. Conic gradients progressively work around a circle.

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="{ className, output } in gradients">
          <th scope="row" class="d-code--sm d-docsite-code">.d-bgg-{{ className }}</th>
          <td class="d-code--sm">
            background-image: {{ output }}
            <span v-if="!['unset', 'none'].includes(className)"> var(--bgg-stops)) </span>
            !important;
          </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

## Color Stops

The starting stop (`d-bgg-from-{color}`) should be declared. Optionally an ending stop (`d-bgg-to-{color}`) can also be declared.

<utility-class-table>
<template #content>
       <div v-for="direction in ['from', 'to']" style="display: contents">
         <tbody v-for="{ color, stops } in baseColors">
             <tr v-for="{ stop } in stops">
                 <th scope="row" class="d-code--sm d-docsite-code">.d-bgg-{{ direction }}-{{ color }}-{{ stop }}</th>
                 <td>
                     <dt-stack direction="row" justify="between" align="center" data-migrate-outline>
                         <div class="d-fl-grow1 d-code--sm">
                             <span v-if="direction === 'from'">
                               --bgg-from-opacity: 100%;<br/>
                               --bgg-from: hsla(var(--{{ color }}-{{ stop }}-h) var(--{{ color }}-{{ stop }}-s) var(--{{ color }}-{{ stop }}-l) / var(--bgg-from-opacity)) !important;<br/>
                               --bgg-to: hsla(var(--{{ color }}-{{ stop }}-h) var(--{{ color }}-{{ stop }}-s) var(--{{ color }}-{{ stop }}-l) / 0%) !important;
                             </span>
                             <span v-else-if="direction === 'to'">
                               --bgg-to-opacity: 100%;<br/>
                               --bgg-to: hsla(var(--{{ color }}-{{ stop }}-h) var(--{{ color }}-{{ stop }}-s) var(--{{ color }}-{{ stop }}-l) / var(--bgg-to-opacity)) !important;
                             </span>
                         </div>
                         <div
                           class="d-fl-shrink0 d-m4 d-ml16 d-h32 d-w64 d-bar4 d-bgg-to-r d-bgg-from-black-100"
                           :class="[`d-bgg-${direction}-${color}-${stop}`]"
                         >
                         </div>
                     </dt-stack>
                 </td>
             </tr>
         </tbody>
       </div>
   </template>
 </utility-class-table>

<script setup>
  import { gradients } from '@data/backgrounds.json';
  import { base } from '@data/colors.json';
  const baseColors = base.lightMode;
</script>
