---
title: Divide width
description: Utilities for controlling the divider width between an element's child items.
---

## Default width

Use `d-divide-{y|x}` to create a 1px divider between an element's child items.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-green-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-d-flex d-fd-column d-divide-y d-divide-green-300">
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-w100p d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">3</div>
  </div>
  <div class="d-w100p d-fl-col3 d-divide-x d-divide-green-300">
    <div class="d-fl-center d-fl-grow1 d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-fl-grow1 d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-fl-grow1 d-h64 d-p16 d-fc-green-400 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-divide-y d-divide-purple-400">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
<div class="d-divide-x d-divide-purple-400">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Changing the divider width

Use `d-divide-{y|x}{n}` to change the divider width between an element's child items.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn102 d-stack8">
  <div class="d-w100p d-d-flex d-fd-column d-p8 d-bar8 d-bgc-purple-100">
    <code>.d-divide-x0</code>
    <div class="d-w100p d-fl-col3 d-divide-x0 d-divide-purple-400">
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">1</div>
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">2</div>
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">3</div>
    </div>
  </div>
  <div class="d-w100p d-d-flex d-fd-column d-p8 d-bar8 d-bgc-purple-100">
    <code>.d-divide-x2</code>
    <div class="d-w100p d-fl-col3 d-divide-x2 d-divide-purple-400">
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">1</div>
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">2</div>
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">3</div>
    </div>
  </div>
  <div class="d-w100p d-d-flex d-fd-column d-p8 d-bar8 d-bgc-purple-100">
    <code>.d-divide-x4</code>
    <div class="d-w100p d-fl-col3 d-divide-x4 d-divide-purple-400">
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">1</div>
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">2</div>
        <div class="d-fl-center d-fl-grow1 d-p16 d-fc-purple-500 d-fs-300 d-fw-bold">3</div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-divide-x0 ...">...</div>
<div class="d-divide-x2 ...">...</div>
<div class="d-divide-x4 ...">...</div>
```

## Reversing the divider direction

If an element's `flex-direction` is reversed, apply `d-divide-{y|x}-reverse` to reverse the divider placement between an element's child items.

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn102" custom>
  <div class="d-w100p d-d-flex d-fd-column-reverse d-divide-y d-divide-y-reverse d-divide-magenta-200">
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-p16 d-fc-magenta-400 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-fd-column-reverse d-divide-y d-divide-y-reverse">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <tbody v-for="d in ['y', 'x']">
        <tr v-for="i in ['default', '0', '2', '4']">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            d-divide-{{ d }}<span v-if="i !== 'default'" v-text="i"></span> > *+*
          </th>
          <td class="d-ff-mono d-fs-100">
            --divide-{{ d }}-reverse: 0;<br/>
            <span v-if="d === 'y'">
              border-top: calc(
                <span v-if="i === 'default'">1</span>
                <span v-else>{{ i }}</span>
                px *(1 - var(--divide-{{ d }}-reverse))
              ) solid !important;<br/>
              border-bottom: calc(
                <span v-if="i === 'default'">1</span>
                <span v-else>{{ i }}</span>
px* var(--divide-{{ d }}-reverse)
              ) solid !important;
            </span>
            <span v-else>
              border-right: calc(
                <span v-if="i === 'default'">1</span>
                <span v-else>{{ i }}</span>
                px *(1 - var(--divide-{{ d }}-reverse))
              ) solid !important;<br/>
              border-left: calc(
                <span v-if="i === 'default'">1</span>
                <span v-else>{{ i }}</span>
px* var(--divide-{{ d }}-reverse)
              ) solid !important;
            </span>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
