---
title: Height
description: Utilities to control an element's height.
---

## Percentages

Use `d-h{n}p` to set a percentage height for an element.

<code-well-header class="d-d-flex d-p24 d-bgc-green-100 d-bgo50 d-w100p d-h332 d-flow16 d-of-x-scroll d-fs-200 d-ff-mono d-ta-center" custom>
  <div v-for="i in percentage" class="d-d-flex d-fl-center d-h100p d-ps-relative">
    <span class="d-zi-active d-w64">d-h{{i}}p</span>
    <div class="d-w64 d-h216 d-ps-absolute d-bgc-green-100">
      <div class="d-w64 d-bgc-green-200 d-bar4" :class="`d-h${i}p`"></div>
    </div>
  </div>
</code-well-header>

```html
<div class="d-h216">
  <div class="d-h10p">d-h10p</div>
  <div class="d-h20p">d-h20p</div>
  <div class="d-h25p">d-h25p</div>
  <div class="d-h30p">d-h30p</div>
  <div class="d-h40p">d-h40p</div>
  <div class="d-h50p">d-h50p</div>
  <div class="d-h60p">d-h60p</div>
  <div class="d-h70p">d-h70p</div>
  <div class="d-h75p">d-h75p</div>
  <div class="d-h80p">d-h80p</div>
  <div class="d-h90p">d-h80p</div>
  <div class="d-h100p">d-h100p</div>
</div>
```

## Fixed

Use `d-h{n}` to set a fixed height for an element.

<code-well-header class="d-d-flex d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmx512 d-flow16 d-of-scroll d-fs-300 d-fw-bold d-ta-center" custom>
  <div v-for="(i, index) in fixed" class="d-d-flex d-fd-column d-pls-start">
    <span>{{ index }}</span>
    <div class="d-fl-center d-w64 d-bgc-magenta-100 d-bar4" :class="`d-h${i}`"></div>
  </div>
</code-well-header>

```html
<div class="d-hmn264">
  <div class="d-h0">1</div>
  <div class="d-h1">2</div>
  <div class="d-h2">3</div>
  <div class="d-h4">4</div>
  <div class="d-h6">5</div>
  <div class="d-h8">6</div>
  <div class="d-h12">7</div>
  <div class="d-h16">8</div>
  <div class="d-h24">9</div>
  <div class="d-h32">10</div>
  <div class="d-h42">11</div>
  <div class="d-h48">12</div>
  <div class="d-h64">13</div>
  <div class="d-h72">14</div>
  <div class="d-h84">15</div>
  <div class="d-h96">16</div>
  <div class="d-h102">17</div>
  <div class="d-h114">18</div>
  <div class="d-h128">19</div>
  <div class="d-h164">20</div>
  <div class="d-h216">21</div>
  <div class="d-h264">22</div>
  <div class="d-h332">23</div>
  <div class="d-h464">24</div>
  <div class="d-h512">25</div>
  <div class="d-h628">26</div>
  <div class="d-h764">27</div>
  <div class="d-h828">28</div>
  <div class="d-h912">29</div>
  <div class="d-h1024">30</div>
  <div class="d-h1140">31</div>
  <div class="d-h1268">32</div>
  <div class="d-h1340">33</div>
</div>
```

## Screen

Use `d-h100vh` to have an element cover the user's viewport.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-h3 d-flow16 d-of-y-scroll" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100vw d-h100vh d-bgc-gold-200 d-bar4 d-fs-300 d-fw-bold d-ta-center">Viewport</div>
</code-well-header>

```html
<div class="d-h100vh">...</div>
```

## Auto

Use `d-h-auto` have the browser calculate and select a height.

<code-well-header class="d-ps-relative d-d-flex d-jc-center d-p24 d-bgc-blue-100 d-bgo50 d-w100p d-hmn216 d-flow16" custom>
  <div class="d-fl-center d-py16 d-px8 d-w100p d-h-auto d-bgc-blue-200 d-bar4 d-fs-300 d-fw-bold d-ta-center">Auto</div>
</code-well-header>

```html
<div class="d-h-auto">...</div>
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
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-h{{ i }}p</th>
        <td class="d-ff-mono d-fs-100">height: {{ i }}% !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr v-for="i in fixed">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-h{{ i }}</th>
        <td class="d-ff-mono d-fs-100">height: {{ i }}px !important;</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-h100vh</th>
        <td class="d-ff-mono d-fs-100">height: 100vh !important;</td>
      </tr>
      <tr v-for="i in other">
        <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-h-{{ i }}</th>
        <td class="d-ff-mono d-fs-100">height: {{ i }} !important;</td>
      </tr>
    </tbody>
  </table>
</div>
