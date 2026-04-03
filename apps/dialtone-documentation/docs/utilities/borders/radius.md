---
title: Border Radius
description: Utilities for controlling an element's border radius.
keywords: ["rounded", "corner", "pill", "circle"]
---

## All Corners

Use `d-bar{n}` to change the border radius on all corners of your element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar0"><dt-text kind="code" size="xs">d-bar0</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar1"><dt-text kind="code" size="xs">d-bar1</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar2"><dt-text kind="code" size="xs">d-bar2</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar4"><dt-text kind="code" size="xs">d-bar4</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar6"><dt-text kind="code" size="xs">d-bar6</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar8"><dt-text kind="code" size="xs">d-bar8</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar12"><dt-text kind="code" size="xs">d-bar12</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar16"><dt-text kind="code" size="xs">d-bar16</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar24"><dt-text kind="code" size="xs">d-bar24</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar32"><dt-text kind="code" size="xs">d-bar32</dt-text></div>
</dt-stack>
```

## Rounded Sides

Use `d-b{t|r|b|l}r{n}` to change the border radius on a side of your element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-btr4"><dt-text kind="code" size="xs">d-btr4</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-btr8"><dt-text kind="code" size="xs">d-btr8</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-btr12"><dt-text kind="code" size="xs">d-btr12</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-btr16"><dt-text kind="code" size="xs">d-btr16</dt-text></div>
</dt-stack>
```

## Pills

Use `d-b{a|t|r|b|l}r-pill` to change the border radius of your element to a pill shape.

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="400"
  :direction="{ 'default': 'column', 'md': 'row' }"
>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-pill">
    <dt-text kind="code" size="xs">d-bar-pill</dt-text>
  </div>
</dt-stack>
```

## Circles

Use `d-b{a|t|r|b|l}r-circle` to change the border radius of your element to a circle shape.

```vue demo
<!-- @wrapper -->
<dt-stack
  gap="400"
  :direction="{ 'default': 'column', 'md': 'row' }"
 >
  <dt-stack direction="row" align="center" justify="center" class="d-p-100 d-size-200 d-ba d-baw2 d-bc-default d-bgc-primary d-ws-nowrap d-bar-circle">
    <dt-text kind="code" size="xs">d-bar-circle</dt-text>
  </dt-stack>
</dt-stack>
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
      <tr v-for="(val, token) in {'--dt-size-radius-0': '0', '--dt-size-radius-100': '1', '--dt-size-radius-200': '2', '--dt-size-radius-300': '4', '--dt-size-radius-350': '6', '--dt-size-radius-400': '8', '--dt-size-radius-450': '12', '--dt-size-radius-500': '16', '--dt-size-550': '24', '--dt-size-radius-600': '32', '--dt-size-radius-circle': '-circle', '--dt-size-radius-pill': '-pill'}">
        <th scope="row" class="d-code--sm d-docsite-code">.d-b{{ i }}r{{ val }}</th>
        <td>
          <dt-stack direction="row" justify="between" align="center">
            <div class="d-fl-grow1 d-code--sm">
              <span v-if="i === 'a'">border-radius: var({{ token }}) !important;</span>
              <span v-else-if="i === 't'">
                border-start-start-radius: var({{ token }}) !important;<br/>
                border-start-end-radius: var({{ token }}) !important;
              </span>
              <span v-else-if="i === 'r'">
                border-start-end-radius: var({{ token }}) !important;<br/>
                border-end-end-radius: var({{ token }}) !important;
              </span>
              <span v-else-if="i === 'b'">
                border-end-start-radius: var({{ token }}) !important;<br/>
                border-end-end-radius: var({{ token }}) !important;
              </span>
              <span v-else-if="i === 'l'">
                border-end-start-radius: var({{ token }}) !important;
                border-start-start-radius: var({{ token }}) !important;<br/>
              </span>
            </div>
            <div
              class="d-fl-shrink0 d-m-50 d-mis-200 d-h-50 d-bgc-black-300"
              :class="[val === '-circle' ? 'd-w-50' : 'd-w-100', `d-b${i}r${val}`]"
            >
            </div>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
