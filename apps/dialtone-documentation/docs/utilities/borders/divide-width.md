---
title: Divide Width
description: Utilities for controlling the divider width between an element's child items.
---

## Default Width

Use `d-divide-{y|x}` to create a 1px divider between an element's child items.

<code-well-header>
  <dt-stack class="d-divide-y d-divide-default d-w100p">
    <div class="d-fl-center d-p16">1</div>
    <div class="d-fl-center d-p16">2</div>
    <div class="d-fl-center d-p16">3</div>
  </dt-stack>
  <dt-stack direction="row" class="d-divide-x d-divide-default d-w100p">
    <div class="d-fl-center d-w100p d-p16">1</div>
    <div class="d-fl-center d-w100p d-p16">2</div>
    <div class="d-fl-center d-w100p d-p16">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack class="d-divide-y d-divide-default d-w100p">
  <div class="d-fl-center d-p16">1</div>
  <div class="d-fl-center d-p16">2</div>
  <div class="d-fl-center d-p16">3</div>
</dt-stack>

<dt-stack direction="row" class="d-divide-x d-divide-default d-w100p">
  <div class="d-fl-center d-w100p d-p16">1</div>
  <div class="d-fl-center d-w100p d-p16">2</div>
  <div class="d-fl-center d-w100p d-p16">3</div>
</dt-stack>
```

## Changing the Divider Width

Use `d-divide-{y|x}{n}` to change the divider width between an element's child items.

<code-well-header>
  <code>d-divide-x0</code>
  <dt-stack direction="row" class="d-divide-x d-divide-x0 d-divide-default d-w100p d-ba">
    <div class="d-fl-center d-w100p d-p16">1</div>
    <div class="d-fl-center d-w100p d-p16">2</div>
    <div class="d-fl-center d-w100p d-p16">3</div>
  </dt-stack>
  <code>d-divide-x2</code>
  <dt-stack direction="row" class="d-divide-x d-divide-x2 d-divide-default d-w100p d-ba d-baw2">
    <div class="d-fl-center d-w100p d-p16">1</div>
    <div class="d-fl-center d-w100p d-p16">2</div>
    <div class="d-fl-center d-w100p d-p16">3</div>
  </dt-stack>
  <code>d-divide-x4</code>
  <dt-stack direction="row" class="d-divide-x d-divide-x4 d-divide-default d-w100p d-ba d-baw4">
    <div class="d-fl-center d-w100p d-p16">1</div>
    <div class="d-fl-center d-w100p d-p16">2</div>
    <div class="d-fl-center d-w100p d-p16">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-divide-x d-divide-x0 d-divide-default d-w100p d-ba">
  ...
</dt-stack>
<dt-stack direction="row" class="d-divide-x d-divide-x2 d-divide-default d-w100p d-ba d-baw2">
  ...
</dt-stack>
<dt-stack direction="row" class="d-divide-x d-divide-x4 d-divide-default d-w100p d-ba d-baw4">
  ...
</dt-stack>
```

## Reversing the Divider Direction

If an element's `flex-direction` is reversed, apply `d-divide-{y|x}-reverse` to reverse the divider placement between an element's child items.

<code-well-header>
  <dt-stack direction="row-reverse" class="d-divide-x d-divide-default d-divide-x-reverse d-w100p">
    <div class="d-fl-center d-w100p d-p16">1</div>
    <div class="d-fl-center d-w100p d-p16">2</div>
    <div class="d-fl-center d-w100p d-p16">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row-reverse" class="d-divide-x d-divide-default d-divide-x-reverse d-w100p d-ba">
  <div class="d-fl-center d-w100p d-p16">1</div>
  <div class="d-fl-center d-w100p d-p16">2</div>
  <div class="d-fl-center d-w100p d-p16">3</div>
</dt-stack>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody v-for="d in ['y', 'x']">
      <tr v-for="i in ['default', '0', '2', '4']">
        <th scope="row" class="d-code--sm d-docsite-code">
          d-divide-{{ d }}<span v-if="i !== 'default'" v-text="i"></span> > *+*
        </th>
        <td class="d-code--sm">
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
* var(--divide-{{ d }}-reverse)
            ) solid !important;
          </span>
          <span v-else>
            border-right: calc(
              <span v-if="i === 'default'">1</span>
              <span v-else>{{ i }}</span>
              px*var(--divide-{{ d }}-reverse)
            ) solid !important;<br/>
            border-left: calc(
              <span v-if="i === 'default'">1</span>
              <span v-else>{{ i }}</span>
*(1 - var(--divide-{{ d }}-reverse))
            ) solid !important;
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
