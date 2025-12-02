---
title: Margins
description: Utilities to adjust an element's exterior spacing between other objects.
---

<dt-notice kind="warning" class="d-wmx100p d-mt24" hideClose>
  Avoid applying margins directly. Lean toward using layout components like <router-link class="d-link d-link--muted" to="/components/stack/">Stack</router-link> for consistent and maintainable spacing <strong>between</strong> elements.
</dt-notice>

## Add Margin to All Sides

<code-well-header>
  <div class="d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-p16 d-m24 d-bgc-moderate d-bar4 d-code--md">d-m24</dt-stack></div>
</code-well-header>

```html
<div class="d-m24 ...">d-m24</div>
```

## Add Margin to a Single Side

<code-well-header>
  <div class="d-d-flex d-fw-wrap d-jc-center d-bgo50 d-w100p d-g24">
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mt12 d-p16 d-bgc-moderate d-bbr4 d-code--md">d-mt12</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mr16 d-p16 d-bgc-moderate d-brl4 d-code--md">d-mr16</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mb24 d-p16 d-bgc-moderate d-btr4 d-code--md">d-mb24</dt-stack></div>
    <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-ml32 d-p16 d-bgc-moderate d-brr4 d-code--md">d-ml32</dt-stack></div>
  </div>
</code-well-header>

```html
<div class="d-mt12 ...">d-mt12</div>
<div class="d-mr16 ...">d-mr16</div>
<div class="d-mb24 ...">d-mb24</div>
<div class="d-ml32 ...">d-ml32</div>
```

## Add Horizontal Margins

<code-well-header>
  <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mx16 d-p16 d-bgc-moderate d-code--md">d-mx16</dt-stack></div>
</code-well-header>

```html
<div class="d-mx24 ...">d-mx24</div>
```

## Add Vertical Margins

<code-well-header>
  <div class="d-as-center d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-my16 d-p16 d-bgc-moderate d-code--sm">d-my16</dt-stack></div>
</code-well-header>

```html
<div class="d-my24 ...">d-my24</div>
```

## Auto Margins

Auto margins allow an element to fill a remaining space within an object. This is especially useful in flex layouts.

<code-well-header>
  <div class="d-w100p d-stack16">
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mx-auto d-p16 d-bgc-moderate d-code--md">d-mx-auto</dt-stack></dt-stack>
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-ml-auto d-p16 d-bgc-moderate d-code--md">d-ml-auto</dt-stack></dt-stack>
    <dt-stack direction="row" class="d-bar8 d-bgc-bold d-of-hidden"><dt-stack direction="row" align="center" justify="center" class="d-mr-auto d-p16 d-bgc-moderate d-code--md">d-mr-auto</dt-stack></dt-stack>
  </div>
</code-well-header>

```html
<div class="d-mx-auto ...">d-mx-auto</div>
<div class="d-ml-auto ...">d-ml-auto</div>
<div class="d-mr-auto ...">d-mr-auto</div>
```

## Classes

Margins can be added to an element by using a utility class (i.e. `.d-m[#]`) or by using a directional class (i.e. `.d-m{t|r|b|l|y|x}[#]`).
The margin utility classes help visually separate elements. Because layouts are highly contextual, margins are never applied natively to a component's outer wrapper.

It is highly recommended to use the [stack component](/components/stack.md) or the [auto spacing classes](/utilities/spacing/auto-spacing.md) prior to applying margins individually.

<utility-class-table>
  <template #content>
    <!-- Positive margins -->
    <tbody v-for="i in directions">
      <tr v-for="{ value: val, output } in values">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}{{ val }}</span>
          <span v-else>.d-m{{ val }}</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-top: {{ output }} !important;<br/>
            margin-bottom: {{ output }} !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-right: {{ output }} !important;<br/>
            margin-left: {{ output }} !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i }}: {{ output }} !important; </span>
            <span v-else>margin: {{ output }} !important</span>
          </span>
        </td>
      </tr>
    </tbody>
    <!-- Negative margins -->
    <tbody v-for="i in directions">
      <tr v-for="{ value: val, output } in values.slice(1)">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}n{{ val }}</span>
          <span v-else>.d-mn{{ val }}</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-top: -{{ output }} !important;<br/>
            margin-bottom: -{{ output }} !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-right: -{{ output }} !important;<br/>
            margin-left: -{{ output }} !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i }}: -{{ output }} !important; </span>
            <span v-else>margin: -{{ output }} !important</span>
          </span>
        </td>
      </tr>
    </tbody>
    <!-- Auto margins -->
    <tbody>
      <tr v-for="i in directions">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}-auto</span>
          <span v-else>.d-m-auto</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-top: auto !important;<br/>
            margin-bottom: auto !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-right: auto !important;<br/>
            margin-left: auto !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i }}: auto !important; </span>
            <span v-else>margin: auto !important</span>
          </span>
        </td>
      </tr>
    </tbody>
    <!-- Unset margins -->
    <tbody>
      <tr v-for="i in directions">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="i !== 'All'">.d-m{{ i[0] }}-unset</span>
          <span v-else>.d-m-unset</span>
        </th>
        <td class="d-code--sm">
          <span v-if="i == 'y'">
            margin-top: unset !important;<br/>
            margin-bottom: unset !important;
          </span>
          <span v-else-if="i == 'x'">
            margin-right: unset !important;<br/>
            margin-left: unset !important;
          </span>
          <span v-else>
            <span v-if="i !== 'All'">margin-{{ i }}: unset !important; </span>
            <span v-else>margin: unset !important</span>
          </span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>
