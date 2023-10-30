---
title: Breakpoints
description: All classes can have responsive variations. Using our plugin @dialpad/postcss-responsive-variations and configuring the breakpoint constants, you can create media queries represented in conditional prefixes. These prefixed classes allow you to apply a style or property within a specific breakpoint.
---

## PostCSS

To create the responsive variations of classes we use [postcss](https://www.npmjs.com/package/postcss) and our custom plugin
[@dialpad/postcss-responsive-variations](https://www.npmjs.com/package/@dialpad/postcss-responsive-variations).
This plugin takes the breakpoints and the classes you need to have responsive variations as arguments.

## Usage

<code-well-header bgclass='d-bgc-purple-100'>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center">This is visible on all screens</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center d-d-none xl:d-d-block">This is visible on extra large screens</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center d-d-none lg:d-d-block">This is visible on large screens</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center d-d-none md:d-d-block">This is visible on medium screens</div>
  <div class="d-fl-center d-w100p d-m8 d-p16 d-bgc-purple-300 d-bar4 d-fs-300 d-fw-bold d-ta-center d-d-none sm:d-d-block">This is visible on small screens</div>
</code-well-header>

```html
<div>...</div>
<div class="d-d-none xl:d-d-block">...</div>
<div class="d-d-none lg:d-d-block">...</div>
<div class="d-d-none md:d-d-block">...</div>
<div class="d-d-none sm:d-d-block">...</div>
```

## Classes

To help keep prefixes concise, we use abbreviations. This syntax is used consistently across all responsive classes. As the viewport size grows, you can change an elements properties. For example, you can set an element to display normally, but be hidden at smaller sizes: `.d-d-block .sm:d-d-none`.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w25p">Class Prefix</th>
      <th scope="col" class="d-w25p">Media Query</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.xl:{class}</th>
      <td class="d-ff-mono d-fs-100">max-width: 1264px</td>
      <td class="d-ff-mono d-fs-100">The class is applied on extra large browser widths and below.</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.lg:{class}</th>
      <td class="d-ff-mono d-fs-100">max-width: 980px</td>
      <td class="d-ff-mono d-fs-100">The class is applied on large browser widths and below.</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.md:{class}</th>
      <td class="d-ff-mono d-fs-100">max-width: 640px</td>
      <td class="d-ff-mono d-fs-100">The class is applied on medium browser widths and below.</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.sm:{class}</th>
      <td class="d-ff-mono d-fs-100">max-width: 480px</td>
      <td class="d-ff-mono d-fs-100">The class is applied on small browser widths and below.</td>
    </tr>
  </tbody>
</table>

**Note:** These breakpoints may change.
