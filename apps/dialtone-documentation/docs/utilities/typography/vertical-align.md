---
title: Vertical Align
description: Utilities for controlling an element's text baseline.
keywords: ["baseline", "middle", "top", "bottom"]
---

## Baseline

Use `d-va-baseline` to vertically align an element to the baseline.

```vue demo
<div class="d-w100p d-ps-relative d-lh0 d-bgc-moderate">
  <div class="d-w-0 d-h-25 d-d-inline-block d-va-baseline">
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
  </div>
  <p class="d-fs-200 d-d-inline-block d-ps-relative d-zi-base1">The quick brown fox.</p>
</div>
```

## Top

Use `d-va-top` to vertically align an element to the top.

```vue demo
<div class="d-w100p d-ps-relative d-lh0 d-bgc-moderate">
  <div class="d-w-0 d-h-25 d-d-inline-block d-va-top">
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
  </div>
  <p class="d-fs-200 d-d-inline-block d-ps-relative d-zi-base1">The quick brown fox.</p>
</div>
```

## Middle

Use `d-va-middle` to vertically align an element to middle.

```vue demo
<div class="d-w100p d-ps-relative d-lh0 d-bgc-moderate">
  <div class="d-w-0 d-h-25 d-d-inline-block d-va-middle">
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
  </div>
  <p class="d-fs-200 d-d-inline-block d-ps-relative d-zi-base1">The quick brown fox.</p>
</div>
```

## Bottom

Use `d-va-bottom` to vertically align an element to the bottom.

```vue demo
<div class="d-w100p d-ps-relative d-lh0 d-bgc-moderate">
  <div class="d-w-0 d-h-25 d-d-inline-block d-va-bottom">
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
  </div>
  <p class="d-fs-200 d-d-inline-block d-ps-relative d-zi-base1">The quick brown fox.</p>
</div>
```

## Text Top

Use `d-va-text-top` to vertically align an element to text top.

```vue demo
<div class="d-w100p d-ps-relative d-lh0 d-bgc-moderate">
  <div class="d-w-0 d-h-25 d-d-inline-block d-va-text-top">
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
  </div>
  <p class="d-fs-200 d-d-inline-block d-ps-relative d-zi-base1">The quick brown fox.</p>
</div>
```

## Text Bottom

Use `d-va-text-bottom` to vertically align an element to text bottom.

```vue demo
<div class="d-w100p d-ps-relative d-lh0 d-bgc-moderate">
  <div class="d-w-0 d-h-25 d-d-inline-block d-va-text-bottom">
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
    <span class="d-ps-absolute d-ibs-0 d-h-25 d-w100p d-by d-bts-dashed d-bbs-dashed d-bc-focus"></span>
  </div>
  <p class="d-fs-200 d-d-inline-block d-ps-relative d-zi-base1">The quick brown fox.</p>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['baseline', 'top', 'bottom', 'text-top', 'text-bottom', 'middle', 'sub', 'super', 'unset']">
          <th scope="row" class="d-code--sm d-docsite-code">.d-va-{{ i }}</th>
          <td class="d-code--sm">vertical-align: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
