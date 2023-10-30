---
title: Width
description: Utilities to control an element's width.
---

## Percentages

Use `d-w{n}p` to set a percentage width for an element.

<code-well-header class="d-d-flex d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmx332 d-stack16 d-fs-200 d-ff-mono d-ta-center d-of-y-scroll" custom>
  <div v-for="i in percentage" class="d-d-flex d-fl-center d-ps-relative">
    <span class="d-zi-active d-h64 d-d-flex d-ai-center">d-w{{i}}p</span>
    <div class="d-w100p d-h64 d-ps-absolute d-bgc-purple-200">
      <div class="d-h64 d-bgc-purple-300 d-bar4" :class="`d-w${i}p`"></div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-w10p">d-w10p</div>
<div class="d-w20p">d-w20p</div>
<div class="d-w25p">d-w25p</div>
<div class="d-w30p">d-w30p</div>
<div class="d-w40p">d-w40p</div>
<div class="d-w50p">d-w50p</div>
<div class="d-w60p">d-w60p</div>
<div class="d-w70p">d-w70p</div>
<div class="d-w75p">d-w75p</div>
<div class="d-w80p">d-w80p</div>
<div class="d-w90p">d-w90p</div>
<div class="d-w100p">d-w100p</div>
```

## Fixed

Use `d-w{n}` to set a fixed width for an element.

<code-well-header class="d-d-flex d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmx332 d-stack16 d-fs-300 d-fw-bold d-ta-center d-of-scroll" custom>
  <div v-for="(i, index) in fixed" class="d-d-flex d-pls-start d-ai-center">
              <span class="d-w48">{{ index }}</span>
              <div class="d-h64 d-bgc-magenta-100 d-bar4" :class="`d-w${i}`"></div>
            </div>
</code-well-header>

```html
<div class="d-w0">1</div>
<div class="d-w1">2</div>
<div class="d-w2">3</div>
<div class="d-w4">4</div>
<div class="d-w6">5</div>
<div class="d-w8">6</div>
<div class="d-w12">7</div>
<div class="d-w16">8</div>
<div class="d-w24">9</div>
<div class="d-w32">10</div>
<div class="d-w42">11</div>
<div class="d-w48">12</div>
<div class="d-w64">13</div>
<div class="d-w72">14</div>
<div class="d-w84">15</div>
<div class="d-w96">16</div>
<div class="d-w102">17</div>
<div class="d-w114">18</div>
<div class="d-w128">19</div>
<div class="d-w164">20</div>
<div class="d-w216">21</div>
<div class="d-w264">22</div>
<div class="d-w332">23</div>
<div class="d-w464">24</div>
<div class="d-w512">25</div>
<div class="d-w628">26</div>
<div class="d-w764">27</div>
<div class="d-w828">28</div>
<div class="d-w912">29</div>
<div class="d-w1024">30</div>
<div class="d-w1140">31</div>
<div class="d-w1268">32</div>
<div class="d-w1340">33</div>
```

## Screen

Use `d-w100vh` to have an element cover the user's viewport.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-h3 d-stack16 d-of-y-scroll" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100vw d-h100vh d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold d-ta-center">Viewport</div>
</code-well-header>

```html
<div class="d-w100vw">...</div>
```

## Auto

Use `d-w-auto` have the browser calculate and select a width.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-blue-100 d-bgo50 d-w100p d-hmn102 d-stack16" custom>
  <div class="d-fl-center d-py16 d-px8 d-h72 d-w-auto d-bgc-blue-200 d-bar4 d-fs-300 d-fw-bold d-ta-center">Auto</div>
</code-well-header>

```html
<div class="d-w-auto">...</div>
```

<script setup>
  import { percentage, fixed, other } from '@data/width-height.json';
</script>

## Classes

<div class="d-h464 d-of-y-scroll d-bb d-bc-black-200">
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" class="d-w30p">Class</th>
        <th scope="col">Output</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in percentage">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-w{{ i }}p</th>
        <td class="d-ff-mono d-fs-100">width: {{ i }}% !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in fixed">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-w{{ i }}</th>
        <td class="d-ff-mono d-fs-100">width: {{ i }}px !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-w100vw</th>
        <td class="d-ff-mono d-fs-100">width: 100vh !important;</td>
      </tr>
      <tr v-for="i in other">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-w-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">width: {{ i }} !important;</td>
      </tr>
    </tbody>
  </table>
</div>
