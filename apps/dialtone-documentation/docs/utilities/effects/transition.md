---
title: Transition
description: Utilities for controlling how an element transitions in and out of states.
---

## Adding a transition

Use `d-t` to add a transition to an element.

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-purple-300 h:d-bgc-gold-200 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary-inverted h:d-fc-primary d-t d-c-pointer">Hover on me</div>
</code-well-header>

```html
<div class="d-bgc-purple-300 h:d-bgc-gold-200 h:d-bs-lg d-fc-primary-inverted h:d-fc-primary d-t">...</div>
```

## Changing transition duration

Use `d-td{n}` change an element's `transition-delay` from it's default `50ms` length.

<code-well-header class="d-fl-col6 d-flg8 d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102 d-of-auto" custom>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-magenta-200 h:d-bgc-gold-200 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary-inverted h:d-fc-primary d-t d-td0 d-c-pointer">0ms</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-magenta-200 h:d-bgc-gold-200 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary-inverted h:d-fc-primary d-t d-c-pointer">50ms</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-magenta-200 h:d-bgc-gold-200 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary-inverted h:d-fc-primary d-t d-td100 d-c-pointer">100ms</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-magenta-200 h:d-bgc-gold-200 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary-inverted h:d-fc-primary d-t d-td150 d-c-pointer">150ms</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-magenta-200 h:d-bgc-gold-200 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary-inverted h:d-fc-primary d-t d-td200 d-c-pointer">200ms</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-magenta-200 h:d-bgc-gold-200 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary-inverted h:d-fc-primary d-t d-td300 d-c-pointer">300ms</div>
</code-well-header>

```html
<div class="d-t d-td0">...</div>
<div class="d-t">...</div>
<div class="d-t d-td100">...</div>
<div class="d-t d-td150">...</div>
<div class="d-t d-td200">...</div>
<div class="d-t d-td300">...</div>
```

## Changing transition easing

Use `d-ttf-{n}` change an element's `transition-timing-function` (aka easing) from it's default Quad Ease In, Ease Out value.

<code-well-header class="d-fl-col3 d-flg8 d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-green-200 h:d-bgc-purple-100 h:d-bs-lg d-fs-200 d-fw-bold d-t d-td300 d-c-pointer">Ease In, Ease Out</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-green-200 h:d-bgc-purple-100 h:d-bs-lg d-fs-200 d-fw-bold d-t d-td300 d-ttf-out d-c-pointer">Ease Out</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-green-200 h:d-bgc-purple-100 h:d-bs-lg d-fs-200 d-fw-bold d-t d-td300 d-ttf-out-quint d-c-pointer">Ease Out Quint</div>
</code-well-header>

```html
<div class="d-t d-td100">...</div>
<div class="d-t d-td100 d-ttf-out">...</div>
<div class="d-t d-td100 d-ttf-quint">...</div>
```

## Changing transition property

Use `d-tp-{n}` change an what items within an element are transitioned.

<code-well-header class="d-fl-col6 d-flg8 d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn102 d-of-auto" custom>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-gold-200 h:d-bgc-purple-100 h:d-bs-lg d-fs-200 d-fw-bold d-fc-primary h:d-fc-red-200 d-t d-td100 d-c-pointer">All</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-gold-200 d-fs-200 d-fw-bold d-fc-primary d-t d-td100 d-tp-o d-c-pointer h:d-o50">Opacity</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-gold-200 d-fs-200 d-fw-bold d-fc-primary d-t d-td100 d-tp-bs d-c-pointer d-bs-sm h:d-bs-lg">Box shadow</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-gold-200 h:d-bgc-purple-100 d-fs-200 d-fw-bold d-fc-primary d-t d-td100 d-tp-bgc d-c-pointer">Background</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-gold-200 d-fs-200 d-fw-bold d-fc-primary d-t d-td100 d-tp-transform d-c-pointer">Transform</div>
  <div class="d-fl-center d-p24 d-bar8 d-bgc-gold-200 h:d-bgc-purple-100 d-fs-200 d-fw-bold d-fc-primary h:d-fc-red-200 d-ba h:d-bc-gold-300 d-t d-td100 d-tp-colors d-c-pointer">Colors</div>
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

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr>
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-t</th>
          <td class="d-ff-mono d-fs-100">
            transition-duration: var(--td25);<br/>
            transition-property: all;<br/>
            transition-timing-function: var(--ttf-in-out);<br/>
            transition-delay: 0s;</td>
        </tr>
      </tbody>
      <tbody v-for="i in ['td', 'ttf', 'tp', 't-delay']">
        <tr v-if="i === 'td'" v-for="d in [0, 50, 100, 150, 200]">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ i }}{{ d }}</th>
          <td class="d-ff-mono d-fs-100">transition-duration: var(--td{{ d }}) !important;</td>
        </tr>
        <tr v-else-if="i === 'ttf'" v-for="t in ['in-out', 'out', 'quint']">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ i }}-{{ t }}</th>
          <td class="d-ff-mono d-fs-100">transition-timing-function: var(--ttf-{{ t }}) !important;</td>
        </tr>
        <tr v-else-if="i === 'tp'" v-for="p in ['all', 'o', 'bs', 'bgc', 'transform', 'colors']">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ i }}-{{ p }}</th>
          <td class="d-ff-mono d-fs-100">
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
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ i }}{{ d }}</th>
          <td class="d-ff-mono d-fs-100">transition-delay: var(--td{{ d }}) !important;</td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
