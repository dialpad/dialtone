---
title: Margins
description: Utilities to adjust an element's exterior spacing between other objects.
---

## Add margin to all sides

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-bgc-purple-200 d-of-hidden"><div class="d-fl-center d-p16 d-m24 d-bgc-purple-300 d-bar4 d-fs-200 d-ff-mono">d-m24</div></div>
</code-well-header>

```html
<div class="d-m24 ...">d-m24</div>
```

## Add margin to a single side

<code-well-header class="d-d-flex d-fw-wrap d-ai-start d-jc-center d-bgc-green-100 d-bgo50 d-w100p d-hmn216 d-flow24" custom>
  <div class="d-as-center d-bar8 d-bgc-green-100 d-of-hidden"><div class="d-fl-center d-mt12 d-p16 d-bgc-green-200 d-bbr4 d-fs-200 d-ff-mono">d-mt12</div></div>
  <div class="d-as-center d-bar8 d-bgc-green-100 d-of-hidden"><div class="d-fl-center d-mr16 d-p16 d-bgc-green-200 d-brl4 d-fs-200 d-ff-mono">d-mr16</div></div>
  <div class="d-as-center d-bar8 d-bgc-green-100 d-of-hidden"><div class="d-fl-center d-mb24 d-p16 d-bgc-green-200 d-btr4 d-fs-200 d-ff-mono">d-mb24</div></div>
  <div class="d-as-center d-bar8 d-bgc-green-100 d-of-hidden"><div class="d-fl-center d-ml32 d-p16 d-bgc-green-200 d-brr4 d-fs-200 d-ff-mono">d-ml32</div></div>
</code-well-header>

```html
<div class="d-mt12 ...">d-mt12</div>
<div class="d-mr16 ...">d-mr16</div>
<div class="d-mb24 ...">d-mb24</div>
<div class="d-ml32 ...">d-ml32</div>
```

## Add horizontal margins

<code-well-header class="d-d-flex d-fw-wrap d-ai-start d-jc-center d-bgc-magenta-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-as-center d-bar8 d-bgc-magenta-100 d-of-hidden"><div class="d-fl-center d-mx24 d-p16 d-bgc-magenta-200 d-fs-200 d-ff-mono">d-mx24</div></div>
</code-well-header>

```html
<div class="d-mx24 ...">d-mx24</div>
```

## Add vertical margins

<code-well-header class="d-d-flex d-fw-wrap d-ai-start d-jc-center d-bgc-red-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-as-center d-bar8 d-bgc-red-100 d-of-hidden"><div class="d-fl-center d-my24 d-p16 d-bgc-red-300 d-fs-200 d-fc-primary-inverted d-ff-mono">d-my24</div></div>
</code-well-header>

```html
<div class="d-my24 ...">d-my24</div>
```

## Auto margins

Auto margins allow an element to fill a remaining space within an object. This is especially useful in flex layouts.

<code-well-header class="d-bgc-gold-100 d-bgo50 d-w100p d-hmn216 d-p24 d-stack16" custom>
  <div class="d-d-flex d-bar8 d-bgc-gold-100 d-of-hidden"><div class="d-fl-center d-mx-auto d-p16 d-bgc-gold-200 d-fs-200 d-ff-mono">d-mx-auto</div></div>
  <div class="d-d-flex d-bar8 d-bgc-gold-100 d-of-hidden"><div class="d-fl-center d-ml-auto d-p16 d-bgc-gold-200 d-fs-200 d-ff-mono">d-ml-auto</div></div>
  <div class="d-d-flex d-bar8 d-bgc-gold-100 d-of-hidden"><div class="d-fl-center d-mr-auto d-p16 d-bgc-gold-200 d-fs-200 d-ff-mono">d-mr-auto</div></div>
</code-well-header>

```html
<div class="d-mx-auto ...">d-mx-auto</div>
<div class="d-ml-auto ...">d-ml-auto</div>
<div class="d-mr-auto ...">d-mr-auto</div>
```

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>

## Classes

Margins can be added to an element by using a utility class (i.e. `.d-m[#]`) or by using a directional class (i.e. `.d-m{t|r|b|l|y|x}[#]`).
The margin utility classes help visually separate elements. Because layouts are highly contextual, margins are never applied natively to a component's outer wrapper. Instead you can use these margin classes to provide that space or the [Stack and Flow layouts](/utilities/layout/stacks/).

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <!-- Positive margins -->
      <tbody v-for="i in directions">
        <tr v-for="{ value: val, output } in values">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="i !== 'All'">.d-m{{ i[0] }}{{ val }}</span>
            <span v-else>.d-m{{ val }}</span>
          </th>
          <td class="d-ff-mono d-fs-100">
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
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="i !== 'All'">.d-m{{ i[0] }}n{{ val }}</span>
            <span v-else>.d-mn{{ val }}</span>
          </th>
          <td class="d-ff-mono d-fs-100">
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
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="i !== 'All'">.d-m{{ i[0] }}-auto</span>
            <span v-else>.d-m-auto</span>
          </th>
          <td class="d-ff-mono d-fs-100">
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
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="i !== 'All'">.d-m{{ i[0] }}-unset</span>
            <span v-else>.d-m-unset</span>
          </th>
          <td class="d-ff-mono d-fs-100">
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
</div>
