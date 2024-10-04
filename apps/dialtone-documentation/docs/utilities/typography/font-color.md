---
title: Font Colors
description: Utilities to change an element's font-color.
---

All font colors pass the WCAG 2.1 Level AA contrast ratio requirements (ratio >= 4.5:1) and most pass WCAG 2.1 Level AAA requirements (ratio >= 7:1).
The contrast ratio value is noted with the colors below.
Please use **only** these colors or variations of these colors which pass WCAG 2.1 Level AA contrast ratio requirements.

<aside class="d-notice d-notice--warning d-mt24 d-wmx100p" role="status" aria-hidden="false">
  <div class="d-notice__icon">
    <dt-icon name="alert-triangle"></dt-icon>
  </div>
  <div class="d-notice__content d-stack4">
    <p class="d-notice__message">
      Before using a Color utility, consider <router-link class="d-link d-link--muted" to="/design/colors/#text">semantic colors</router-link>.
    </p>
  </div>
</aside>

## Usage

Use `d-fc-{color}` to change an element's text color.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-200 d-fc-purple-400">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-purple-400">...</p>
```

## Changing opacity

Use `d-fco{n}` to change an element's text color opacity. You can also change font color opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-fco{n}`, `f:d-fco{n}`, `fv:d-fco{n}` prefixes.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102 d-stack8" custom>
  <p class="d-fs-200 d-fc-purple-400">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco99">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco95">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco90">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco75">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco50">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco25">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco10">The quick brown fox jumps over the lazy dog.</p>
  <p class="d-fs-200 d-fc-purple-400 d-fco0">The quick brown fox jumps over the lazy dog.</p>
</code-well-header>

```html
<p class="d-fc-purple-400">...</p>
<p class="d-fc-purple-400 d-fco99">...</p>
<p class="d-fc-purple-400 d-fco95">...</p>
<p class="d-fc-purple-400 d-fco90">...</p>
<p class="d-fc-purple-400 d-fco75">...</p>
<p class="d-fc-purple-400 d-fco50">...</p>
<p class="d-fc-purple-400 d-fco25">...</p>
<p class="d-fc-purple-400 d-fco10">...</p>
<p class="d-fc-purple-400 d-fco0">...</p>
```

## Hover

Use `h:d-fc-{color}` to change an element's text color `:hover` state.

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-purple-400 h:d-fc-neutral-white d-bgc-transparent h:d-bgc-purple-500 d-ba d-bc-transparent">Hover over me</button>
</code-well-header>

```html
<button class="d-fc-purple-400 h:d-fc-neutral-white">...</button>
```

## Focus

Use `f:d-fc-{color}` to change an element's text color `:focus` and `:focus-within` state.

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-magenta-300 f:d-fc-neutral-white d-bgc-transparent f:d-bgc-magenta-400 d-ba d-bc-transparent">Click or focus on me</button>
</code-well-header>

```html
<button class="d-fc-magenta-300 f:d-fc-neutral-white d-bgc-transparent f:d-bgc-magenta-400">...</button>
```

## Focus visible

Use `fv:d-fc-{color}` to change an element's text color on `:focus-visible` state [only when focused by keyboard].

<code-well-header class="d-fl-center d-p24 d-bgc-magenta-100 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-magenta-300 fv:d-fc-neutral-white d-bgc-transparent fv:d-bgc-magenta-400 d-ba d-bc-transparent">Focus on me</button>
</code-well-header>

```html
<button class="d-fc-magenta-300 fv:d-fc-neutral-white d-bgc-transparent fv:d-bgc-magenta-400">...</button>
```

<!--
## Dark Mode
Use `d:d-fc-{color}` to set a different text color when the user prefers dark mode.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-black-200 d-w100p d-hmn102 d-stack16">
  <button type="button" class="d-p16 d-bar4 d-fs-200 d-fc-purple-400 d-bgc-magenta-100 d-ba d-bc-transparent js-theme-switcher">Click on me toggle dark mode</button>
</code-well-header>

```html
<button class="d-fc-purple-400">...</button>
```
 -->

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <!-- Current Color -->
        <tr>
          <th scope="row" class="d-code--sm d-fc-purple-400">.d-fc-current</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl1 d-code--sm">
                color: currentColor !important;
              </div>
              <div class="d-fl0 d-fc-current d-fs-300 d-lh4">
                Aa
              </div>
            </div>
          </td>
        </tr>
        <!-- Transparent -->
        <tr>
          <th scope="row" class="d-code--sm d-fc-purple-400">.d-fc-transparent</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl1 d-code--sm">
                color: transparent !important;
              </div>
              <div class="d-fl0 d-fc-transparent d-fs-300 d-lh4">
                Aa
              </div>
            </div>
          </td>
        </tr>
        <!-- Unset Color -->
        <tr>
          <th scope="row" class="d-code--sm d-fc-purple-400">.d-fc-unset</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl1 d-code--sm">
                color: unset !important;
              </div>
              <div class="d-fl0 d-fc-unset d-fs-300 d-lh4">
                Aa
              </div>
            </div>
          </td>
        </tr>
        <!-- Semantic Colors -->
        <tr v-for="{ var: color, output } in fontColorVars">
          <th scope="row" class="d-code--sm d-fc-purple-400">.d-fc-{{ color }}</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl1 d-code--sm">
                --fco: 100%;<br/>
                color: hsla(var(--{{ output }}-h) var(--{{ output }}-s) var(--{{ output }}-l) / var(--fco)) !important;
              </div>
              <div class="d-fl0 d-ml16 d-p4 d-fs-300 d-lh4" :class="`d-fc-${color}`">
                Aa
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-for="{ color, stops } in baseColors.lightMode">
        <tr v-for="{ stop } in stops">
          <th scope="row" class="d-code--sm d-fc-purple-400">.d-fc-{{ color }}-{{ stop }}</th>
          <td>
            <div class="d-d-flex d-jc-space-between d-ai-center">
              <div class="d-fl1 d-code--sm">
                  --fco: 100%;<br/>
                  color: hsla(var(--{{ color }}-{{ stop }}-h) var(--{{ color }}-{{ stop }}-s) var(--{{ color }}-{{ stop }}-l) / var(--fco)) !important;
              </div>
              <div class="d-fl0 d-ml16 d-p4 d-fs-300 d-lh4" :class="`d-fc-${color}-${stop}`">
                  Aa
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>

<script setup>
  import { fontColorVars } from '@data/type.json';
  import { base as baseColors } from '@data/colors.json';
</script>
