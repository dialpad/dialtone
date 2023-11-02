---
title: Padding
description: Utilities for setting an element's interior spacing between child elements and the element's box edge.
---

## Add padding to all sides

<code-well-header class="d-fl-center d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-h128 d-w128 d-p16 d-bar8 d-bgc-purple-200 d-of-hidden"><div class="d-fl-center d-fl1 d-h100p d-bgc-purple-300 d-bar4 d-fs-200 d-ff-mono">d-p16</div></div>
</code-well-header>

```html
<div class="d-p8 ...">d-p8</div>
```

## Add padding to a single side

<code-well-header class="d-d-flex d-fw-wrap d-ai-start d-jc-center d-bgc-green-100 d-bgo50 d-w100p d-hmn216 d-flow24" custom>
  <div class="d-as-center d-pt12 d-bar8 d-bgc-green-200 d-of-hidden"><div class="d-fl-center d-p16 d-bgc-green-100 d-bbr4 d-fs-200 d-ff-mono">d-pt12</div></div>
  <div class="d-as-center d-pr16 d-bar8 d-bgc-green-200 d-of-hidden"><div class="d-fl-center d-p16 d-bgc-green-100 d-brl4 d-fs-200 d-ff-mono">d-pr16</div></div>
  <div class="d-as-center d-pb24 d-bar8 d-bgc-green-200 d-of-hidden"><div class="d-fl-center d-p16 d-bgc-green-100 d-btr4 d-fs-200 d-ff-mono">d-pb24</div></div>
  <div class="d-as-center d-pl32 d-bar8 d-bgc-green-200 d-of-hidden"><div class="d-fl-center d-p16 d-bgc-green-100 d-brr4 d-fs-200 d-ff-mono">d-pl32</div></div>
</code-well-header>

```html
<div class="d-pt12 ...">d-pt12</div>
<div class="d-pr16 ...">d-pr16</div>
<div class="d-pb24 ...">d-pb24</div>
<div class="d-pl32 ...">d-pl32</div>
```

## Add horizontal padding

<code-well-header class="d-d-flex d-fw-wrap d-ai-start d-jc-center d-bgc-magenta-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-as-center d-px24 d-bar8 d-bgc-magenta-100 d-of-hidden"><div class="d-fl-center d-p16 d-bgc-magenta-100 d-fs-200 d-ff-mono">d-px24</div></div>
</code-well-header>

```html
<div class="d-px24 ...">d-px24</div>
```

## Add vertical padding

<code-well-header class="d-d-flex d-fw-wrap d-ai-start d-jc-center d-bgc-red-100 d-bgo50 d-w100p d-hmn216" custom>
  <div class="d-as-center d-py24 d-bar8 d-bgc-red-100 d-of-hidden">
    <div class="d-fl-center d-p16 d-bgc-red-100 d-fs-200 d-ff-mono">d-py24</div>
  </div>
</code-well-header>

```html
<div class="d-py24 ...">d-py24</div>
```

<script setup>
  import { directions, values } from '@data/spacing.json';
</script>

## Classes

Padding can be added to an element by using a utility class (i.e. `.d-p[#]`) or by using a directional class (i.e. `.d-p{t|r|b|l|y|x}[#]`).

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <utility-class-table>
    <template #content>
      <!-- Positive paddings -->
      <tbody v-for="i in directions">
          <tr v-for="{ value: val, output } in values">
              <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
                <span v-if="i !== 'All'">.d-p{{ i[0] }}{{ val }}</span>
                <span v-else>.d-p{{ val }}</span>
              </th>
              <td class="d-ff-mono d-fs-100">
                  <span v-if="i == 'y'">
                    padding-top: {{ output }} !important;<br/>
                    padding-bottom: {{ output }} !important;
                  </span>
                  <span v-else-if="i == 'x'">
                    padding-right: {{ output }} !important;<br/>
                    padding-left: {{ output }} !important;
                  </span>
                  <span v-else>
                    <span v-if="i !== 'All'">padding-{{ i }}: {{ output }} !important; </span>
                    <span v-else>padding: {{ output }} !important</span>
                  </span>
              </td>
          </tr>
      </tbody>
      <!-- Unset paddings -->
      <tbody>
        <tr v-for="i in directions">
          <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">
            <span v-if="i !== 'All'">.d-p{{ i[0] }}-unset</span>
            <span v-else>.d-p-unset</span>
          </th>
          <td class="d-ff-mono d-fs-100">
            <span v-if="i == 'y'">
              padding-top: unset !important;<br/>
              padding-bottom: unset !important;
            </span>
            <span v-else-if="i == 'x'">
              padding-right: unset !important;<br/>
              padding-left: unset !important;
            </span>
            <span v-else>
              <span v-if="i !== 'All'">padding-{{ i }}: unset !important; </span>
              <span v-else>padding: unset !important</span>
            </span>
          </td>
        </tr>
      </tbody>
    </template>
  </utility-class-table>
</div>
