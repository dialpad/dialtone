---
title: Border colors
description: Utilities for controlling an element's border color.
---

<aside class="d-notice d-notice--warning d-mt24 d-wmx100p" role="status" aria-hidden="false">
  <div class="d-notice__icon">
    <dt-icon name="alert-triangle"></dt-icon>
  </div>
  <div class="d-notice__content d-stack4">
    <p class="d-notice__message">
      Before using border color utilities, first consider <router-link class="d-link d-link--muted" to="/design/colors/#borders">semantic border colors</router-link>.
    </p>
  </div>
</aside>

## Usage

Use `d-bc-{color}` to set an element's border color.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p32 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-d-flex d-ai-center d-w100p d-h64 d-py8 d-px16 d-bar8 d-ba d-bc-purple-400 d-bgc-neutral-white d-bgo50 d-fc-black-700 d-fs-200">A bordered element</div>
</code-well-header>

```html

<div class="... d-ba d-bc-purple-400">...</div>
```

## Changing opacities

Use `d-bco{n}` to change the border color opacity value. You can also change the border color opacity value on `:hover`
, `:focus`, `:focus-visible` by using the respective `h:d-bco{n}`, `f:d-bco{n}`, `fv:d-bco{n}` prefixes.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102 d-stack8" custom>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-code--md d-fw-bold">100%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco99 d-code--md d-fw-bold">99%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco95 d-code--md d-fw-bold">95%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco90 d-code--md d-fw-bold">90%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco75 d-code--md d-fw-bold">75%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco50 d-code--md d-fw-bold">50%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco25 d-code--md d-fw-bold">25%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco10 d-code--md d-fw-bold">10%</div>
  <div class="d-w100p d-p4 d-bb d-bbw2 d-bc-magenta-300 d-bco0 d-code--md d-fw-bold">0%</div>
</code-well-header>

```html
<div class="d-bb d-bbw2 d-bc-magenta-300">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco99">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco95">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco90">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco75">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco50">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco25">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco10">...</div>
<div class="d-bb d-bbw2 d-bc-magenta-300 d-bco0">...</div>
```

## Hover

Use `h:d-bc-{color}` to change an element's border color spot on `:hover`.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-green-400 d-ba d-baw2 d-bc-green-100 h:d-bc-green-400 d-bgc-green-100">Hover over me</button>
</code-well-header>

```html

<button class="d-ba d-baw2 d-bc-green-100 h:d-bc-green-400">...</button>
```

## Focus

Use `f:d-bc-{color}` to change an element's border color when in `:focus` or `:focus-within` states.

<code-well-header class="d-fl-center d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-primary-inverted d-bgc-red-200 d-ba d-baw2 d-bc-red-300 f:d-bc-purple-400">Click on me</button>
</code-well-header>

```html

<button class="d-ba d-baw2 d-bc-red-300 f:d-bc-neutral-white">...</button>
```

## Focus visible

Use `fv:d-bc-{color}` to change an element's border color when in `:focus-visible` state [only when focused by keyboard]
.

<code-well-header class="d-fl-center d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-primary-inverted d-bgc-red-200 d-ba d-baw2 d-bc-red-300 fv:d-bc-purple-400">Focus on me</button>
</code-well-header>

```html

<button class="d-ba d-baw2 d-bc-red-300 fv:d-bc-purple-400">...</button>
```

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
          <tr v-for="c in special">
              <th scope="row" class="d-code--sm d-fc-purple-400">.d-bc-{{c}}</th>
              <td>
                  <div class="d-d-flex d-jc-space-between d-ai-center">
                      <div class="d-fl-grow1 d-code--sm">
                        <span v-if="c === 'white'">
                            --bco: 100%;<br/>
                            border-color: hsla(var(--{{ c }}-h) var(--{{ c }}-s) var(--{{ c }}-l) / var(--bco)) !important;
                        </span>
                        <span v-else>border-color: {{c}} !important;</span>
                      </div>
                      <div
                        :class="['d-d-inline-flex', {'d-bgc-contrast': c.includes('white')}]"
                      >
                        <div
                            :class="`d-fl-shrink0 d-m4 d-h42 d-w42 d-bar4 d-bc-${c} d-ba d-baw2`"
                        />
                      </div>
                  </div>
              </td>
          </tr>
      </tbody>
      <tbody>
          <tr v-for="c in borders">
              <th scope="row" class="d-code--sm d-fc-purple-400">.d-bc-{{c}}</th>
              <td>
                  <div class="d-d-flex d-jc-space-between d-ai-center">
                      <div class="d-fl-grow1 d-code--sm">
                        <span>border-color: var(--bc-{{c}})</span>
                      </div>
                      <div
                        :class="['d-d-inline-flex', {'d-bgc-contrast': c.includes('inverted')}]"
                      >
                        <div
                            :class="`d-fl-shrink0 d-m4 d-h42 d-w42 d-bar4 d-bc-${c} d-ba d-baw2`"
                        />
                      </div>
                  </div>
              </td>
          </tr>
      </tbody>
      <tbody v-for="{color: c, stops} in base">
          <tr v-for="{ stop, copy } in stops">
              <th scope="row" class="d-code--sm d-fc-purple-400">.d-bc-{{ c }}-{{ stop }}</th>
              <td>
                  <div class="d-d-flex d-jc-space-between d-ai-center">
                      <div class="d-fl-grow1 d-code--sm">
                          --bco: 100%;<br/>
                          border-color: hsla(var(--{{ c }}-{{ stop }}-h) var(--{{ c }}-{{ stop }}-s) var(--{{ c }}-{{ stop }}-l) / var(--bco)) !important;
                      </div>
                      <div
                        class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar4 d-ba d-baw2"
                        :class="`d-bc-${c}-${stop}`"
                      >
                      </div>
                  </div>
              </td>
          </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>

<script setup>
import {base, special, borders} from '@data/colors.json';
</script>
