---
title: Background colors
description: Utilities for setting background colors.
---

<aside class="d-notice d-notice--warning d-mt24 d-wmx100p" role="status" aria-hidden="false">
  <div class="d-notice__icon">
    <dt-icon name="alert-triangle"></dt-icon>
  </div>
  <div class="d-notice__content d-stack4">
    <p class="d-notice__message">
      Before using background color utilities, first consider <router-link class="d-link d-link--muted" to="/design/colors/#surface">semantic surface colors</router-link>.
    </p>
  </div>
</aside>

## Usage

Use `d-bgc-{color}` to set an element's background color.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-fs-200 d-p16 d-bar4 d-bgc-purple-300">The quick brown fox jumps over the lazy dog.</div>
</code-well-header>

```html
<div class="d-bgc-purple-300">...</div>
```

## Changing opacity

Use `d-bgo{stop}` to change an element's background color opacity. You can also change the background color opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgo{stop}`, `f:d-bgo{stop}`, `fv:d-bgo{stop}` prefixes.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102 d-stack8" custom>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bar4 d-fs-300 d-fw-bold">100%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo99 d-bar4 d-fs-300 d-fw-bold">99%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo95 d-bar4 d-fs-300 d-fw-bold">95%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo90 d-bar4 d-fs-300 d-fw-bold">90%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo75 d-bar4 d-fs-300 d-fw-bold">75%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo50 d-bar4 d-fs-300 d-fw-bold">50%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo25 d-bar4 d-fs-300 d-fw-bold">25%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo10 d-bar4 d-fs-300 d-fw-bold">10%</div>
  <div class="d-fl-center d-p16 d-bgc-green-200 d-bgo0 d-bar4 d-fs-300 d-fw-bold">0%</div>
</code-well-header>

```html
<p class="d-bgc-green-200">...</p>
<p class="d-bgc-green-200 d-bgo99">...</p>
<p class="d-bgc-green-200 d-bgo95">...</p>
<p class="d-bgc-green-200 d-bgo90">...</p>
<p class="d-bgc-green-200 d-bgo75">...</p>
<p class="d-bgc-green-200 d-bgo50">...</p>
<p class="d-bgc-green-200 d-bgo25">...</p>
<p class="d-bgc-green-200 d-bgo10">...</p>
<p class="d-bgc-green-200 d-bgo0">...</p>
```

## Hover

Use `h:d-bgc-{color}` to change an element's `:hover` state background color.

<code-well-header class="d-fl-center d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <button type="button" class="d-p16 d-bar4 d-fs-200 d-bgc-green-100 h:d-bgc-green-200 d-ba d-bc-transparent">Hover over me</button>
</code-well-header>

```html
<button class="d-bgc-green-100 h:d-bgc-green-200">...</button>
```

## Focus

Use `f:d-bgc-{color}` to change an element's `:focus` and `:focus-within` state background color.

<code-well-header class="d-fl-center d-bgc-red-100 d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-black-800 d-bgc-transparent f:d-fc-red-300 f:d-bgc-red-300 f:d-bgo25 d-ba d-bc-transparent">Click on me</button>
</code-well-header>

```html
<button class="d-bgc-transparent f:d-fc-red-300 f:d-bgc-red-300 f:d-bgo25">...</button>
```

## Focus visible

Use `fv:d-bgc-{color}` to change an element's `:focus-visible` state background color [only when focused by keyboard].

<code-well-header class="d-fl-center d-bgc-red-100 d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-black-800 d-bgc-transparent fv:d-fc-red-300 fv:d-bgc-red-300 fv:d-bgo25 d-ba d-bc-transparent">Focus on me</button>
</code-well-header>

```html
<button class="d-bgc-transparent fv:d-fc-red-300 fv:d-bgc-red-300 fv:d-bgo25">...</button>
```

<script setup>
  import { base as baseColors} from '@data/colors.json';
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-primary</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-neutral-white-h) var(--dt-color-neutral-white-s) var(--dt-color-neutral-white-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-primary d-ba d-bc-black-200"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-secondary</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-black-100-h) var(--dt-color-black-100-s) var(--dt-color-black-100-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-secondary d-ba d-bc-black-200"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-moderate</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-black-200-h) var(--dt-color-black-200-s) var(--dt-color-black-200-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-moderate d-ba d-bc-black-200"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-bold</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        border-color: hsla(var(--dt-color-black-200-h) var(--dt-color-black-200-s) var(--dt-color-black-200-l) / var(--bco)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-bold d-ba d-bc-black-200"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-strong</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        border-color: hsla(var(--dt-color-black-200-h) var(--dt-color-black-200-s) var(--dt-color-black-200-l) / var(--bco)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-strong d-ba d-bc-black-200"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-contrast</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-black-800-h) var(--dt-color-black-800-s) var(--dt-color-black-800-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-contrast d-ba d-bc-black-200"></div>
                </div>
            </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-critical</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-red-100-h) var(--dt-color-red-100-s) var(--dt-color-red-100-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-critical d-ba d-bc-black-100"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-success</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-green-100-h) var(--dt-color-green-100-s) var(--dt-color-green-100-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-success d-ba d-bc-black-100"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-warning</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-gold-100-h) var(--dt-color-gold-100-s) var(--dt-color-gold-100-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-warning d-ba d-bc-black-100"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-info</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--dt-color-blue-100-h) var(--dt-color-blue-100-s) var(--dt-color-blue-100-l) / var(--bgo)) !important;
                    </div>
                    <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-info d-ba d-bc-black-100"></div>
                </div>
            </td>
        </tr>
      </tbody>
      <tbody>
          <tr>
              <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-transparent</th>
              <td>
                  <div class="d-d-flex d-jc-space-between d-ai-center">
                      <div class="d-fl-grow1 d-code--sm">
                          background-color: transparent !important;
                      </div>
                      <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-transparent d-ba d-bc-black-100"></div>
                  </div>
              </td>
          </tr>
          <tr>
              <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-unset</th>
              <td>
                  <div class="d-d-flex d-jc-space-between d-ai-center">
                      <div class="d-fl-grow1 d-code--sm">
                          background-color: unset !important;
                      </div>
                      <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-unset d-ba d-bc-black-100"></div>
                  </div>
              </td>
          </tr>
          <tr>
              <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-neutral-white</th>
              <td>
                  <div class="d-d-flex d-jc-space-between d-ai-center">
                      <div class="d-fl-grow1 d-code--sm">
                          --bgo: 100%;<br/>
                          background-color: hsla(var(--dt-color-neutral-white-h) var(--dt-color-neutral-white-s) var(--dt-color-neutral-white-l) / var(--bgo)) !important;
                      </div>
                      <div class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-bgc-neutral-white d-ba d-bc-black-100"></div>
                  </div>
              </td>
          </tr>
      </tbody>
      <tbody v-for="{ color, stops } in baseColors">
        <tr v-for="{ stop } in stops">
            <th scope="row" class="d-code--sm d-fc-purple-400">.d-bgc-{{ color }}-{{ stop }}</th>
            <td>
                <div class="d-d-flex d-jc-space-between d-ai-center">
                    <div class="d-fl-grow1 d-code--sm">
                        --bgo: 100%;<br/>
                        background-color: hsla(var(--{{ color }}-{{ stop }}-h) var(--{{ color }}-{{ stop }}-s) var(--{{ color }}-{{ stop }}-l) / var(--bgo)) !important;
                    </div>
                    <div
                      class="d-fl-shrink0 d-m4 d-ml16 d-h42 d-w42 d-bar-circle d-ba d-bc-black-100"
                      :class="`d-bgc-${color}-${stop}`"
                    />
                </div>
            </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
