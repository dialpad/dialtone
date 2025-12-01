---
title: Border Radius
description: Utilities for controlling an element's border radius.
---

## All Corners

Use `d-bar{n}` to change the border radius on all corners of your element.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="r in [0, 1, 2, 4, 8, 12, 16, 24, 32]"
      class="d-p16 d-ba d-baw2 d-bc-default d-bgc-primary d-ws-nowrap"
      :class="`d-bar${r}`"
    >
      d-bar{{ r }}
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-bar0">...</div>
<div class="d-bar1">...</div>
<div class="d-bar2">...</div>
<div class="d-bar4">...</div>
<div class="d-bar8">...</div>
<div class="d-bar12">...</div>
<div class="d-bar16">...</div>
<div class="d-bar24">...</div>
<div class="d-bar32">...</div>
```

## Rounded Sides

Use `d-b{t|r|b|l}r{n}` to change the border radius on a side of your element.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div
      v-for="r in [4, 8, 12, 16]"
      class="d-p16 d-ba d-baw2 d-bc-default d-bgc-primary d-ws-nowrap"
      :class="`d-btr${r}`"
    >
      d-btr{{ r }}
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-btr4">...</div>
<div class="d-brr8">...</div>
<div class="d-bbr12">...</div>
<div class="d-blr16">...</div>
```

## Pills

Use `d-b{a|t|r|b|l}r-pill` to change the border radius of your element to a pill shape.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
  >
    <div class="d-p16 d-ba d-baw2 d-bc-default d-bgc-primary d-ws-nowrap d-bar-pill">
      d-bar-pill
    </div>
  </dt-stack>
</code-well-header>

```html
<div class="d-bar-pill">...</div>
```

## Circles

Use `d-b{a|t|r|b|l}r-circle` to change the border radius of your element to a circle shape.

<code-well-header>
  <dt-stack
    gap="400"
    :direction="{ 'default': 'column', 'md': 'row' }"
   >
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h128 d-w128 d-ba d-baw2 d-bc-default d-bgc-primary d-ws-nowrap d-bar-circle">
      d-bar-circle
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<div class="d-bar-circle">...</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-bar-unset</th>
        <td class="d-code--sm">border-radius: unset !important;</td>
      </tr>
    </tbody>
    <tbody v-for="i in ['a', 't', 'r', 'b', 'l']">
      <tr v-for="(val, token) in {'--dt-size-radius-0': '0', '--dt-size-radius-100': '1', '--dt-size-radius-200': '2', '--dt-size-radius-300': '4', '--dt-size-radius-400': '8', '--dt-size-radius-450': '12', '--dt-size-radius-500': '16', '--dt-size-550': '24', '--dt-size-radius-600': '32', '--dt-size-radius-circle': '-circle', '--dt-size-radius-pill': '-pill'}">
        <th scope="row" class="d-code--sm d-docsite-code">.d-b{{ i }}r{{ val }}</th>
        <td>
          <dt-stack direction="row" justify="between" align="center">
            <div class="d-fl-grow1 d-code--sm">
              <span v-if="i === 'a'">border-radius: var({{ token }}) !important;</span>
              <span v-else-if="i === 't'">
                border-top-left-radius: var({{ token }}) !important;<br/>
                border-top-right-radius: var({{ token }}) !important;
              </span>
              <span v-else-if="i === 'r'">
                border-top-right-radius: var({{ token }}) !important;<br/>
                border-bottom-right-radius: var({{ token }}) !important;
              </span>
              <span v-else-if="i === 'b'">
                border-bottom-left-radius: var({{ token }}) !important;<br/>
                border-bottom-right-radius: var({{ token }}) !important;
              </span>
              <span v-else-if="i === 'l'">
                border-bottom-left-radius: var({{ token }}) !important;
                border-top-left-radius: var({{ token }}) !important;<br/>
              </span>
            </div>
            <div
              class="d-fl-shrink0 d-m4 d-ml16 d-h32 d-bgc-black-300"
              :class="[val === '-circle' ? 'd-w32' : 'd-w64', `d-b${i}r${val}`]"
            >
            </div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
