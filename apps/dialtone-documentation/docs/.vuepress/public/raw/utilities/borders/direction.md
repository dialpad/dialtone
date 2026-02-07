# Border Directions

Utilities for controlling an element's border.

- **Keywords**: border top, border bottom, border left, border right

## All Sides

Use `d-ba` to add a border to all sides of your element.

```html
<div class="d-p16 d-ba d-baw0 d-bgc-primary">d-baw0</div>
<div class="d-p16 d-ba d-baw1 d-bgc-primary">d-baw1</div>
<div class="d-p16 d-ba d-baw2 d-bgc-primary">d-baw2</div>
<div class="d-p16 d-ba d-baw4 d-bgc-primary">d-baw4</div>
```

## Individual Sides

Use `d-b{t|r|b|l|x|y}` to add a border to only specific sides of your element.

```html
<div class="d-p16 d-bt d-baw4 d-bgc-primary">d-bt</div>
<div class="d-p16 d-br d-baw4 d-bgc-primary">d-br</div>
<div class="d-p16 d-bb d-baw4 d-bgc-primary">d-bb</div>
<div class="d-p16 d-bl d-baw4 d-bgc-primary">d-bl</div>
<div class="d-p16 d-bx d-baw4 d-bgc-primary">d-bx</div>
<div class="d-p16 d-by d-baw4 d-bgc-primary">d-by</div>
<div class="d-p16 d-ba d-baw4 d-bgc-primary">d-ba</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ba` | border-color: var(--dt-color-border-default) !important; border-style: solid !important; border-width: var(--dt-size-border-100) !important |
| `d-ba-none` | border: none !important |
| `d-ba-unset` | border: unset !important |
| `d-bar-circle` | border-radius: var(--dt-size-radius-circle) !important |
| `d-bar-pill` | border-radius: var(--dt-size-radius-pill) !important |
| `d-bar-unset` | border-radius: unset !important |
| `d-bar0` | border-radius: var(--dt-size-radius-0) !important |
| `d-bar1` | border-radius: var(--dt-size-radius-100) !important |
| `d-bar12` | border-radius: var(--dt-size-radius-450) !important |
| `d-bar16` | border-radius: var(--dt-size-radius-500) !important |
| `d-bar2` | border-radius: var(--dt-size-radius-200) !important |
| `d-bar24` | border-radius: var(--dt-size-550) !important |
| `d-bar32` | border-radius: var(--dt-size-radius-600) !important |
| `d-bar4` | border-radius: var(--dt-size-radius-300) !important |
| `d-bar8` | border-radius: var(--dt-size-radius-400) !important |
| `d-bas-dashed` | border-style: dashed !important |
| `d-bas-dotted` | border-style: dotted !important |
| `d-bas-unset` | border-style: unset !important |
| `d-baw0` | border-width: var(--dt-size-border-0) !important |
| `d-baw1` | border-width: var(--dt-size-border-100) !important |
| `d-baw2` | border-width: var(--dt-size-border-200) !important |
| `d-baw4` | border-width: var(--dt-size-border-300) !important |
| `d-bb` | -webkit-border-after: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-default) !important |
| `d-bbr-circle` | border-end-end-radius: var(--dt-size-radius-circle) !important; border-end-start-radius: var(--dt-size-radius-circle) !important |
| `d-bbr-pill` | border-end-end-radius: var(--dt-size-radius-pill) !important; border-end-start-radius: var(--dt-size-radius-pill) !important |
| `d-bbr0` | border-end-start-radius: var(--dt-size-radius-0) !important; border-end-end-radius: var(--dt-size-radius-0) !important |
| `d-bbr1` | border-end-start-radius: var(--dt-size-radius-100) !important; border-end-end-radius: var(--dt-size-radius-100) !important |
| `d-bbr12` | border-end-start-radius: var(--dt-size-radius-450) !important; border-end-end-radius: var(--dt-size-radius-450) !important |
| `d-bbr16` | border-end-start-radius: var(--dt-size-radius-500) !important; border-end-end-radius: var(--dt-size-radius-500) !important |
| `d-bbr2` | border-end-start-radius: var(--dt-size-radius-200) !important; border-end-end-radius: var(--dt-size-radius-200) !important |
| `d-bbr24` | border-end-start-radius: var(--dt-size-550) !important; border-end-end-radius: var(--dt-size-550) !important |
| `d-bbr32` | border-end-start-radius: var(--dt-size-radius-600) !important; border-end-end-radius: var(--dt-size-radius-600) !important |
| `d-bbr4` | border-end-start-radius: var(--dt-size-radius-300) !important; border-end-end-radius: var(--dt-size-radius-300) !important |
| `d-bbr8` | border-end-start-radius: var(--dt-size-radius-400) !important; border-end-end-radius: var(--dt-size-radius-400) !important |
| `d-bbs-dashed` | border-block-end-style: dashed !important |
| `d-bbs-dotted` | border-block-end-style: dotted !important |
| `d-bbw0` | border-block-end-width: var(--dt-size-border-0) !important |
| `d-bbw1` | border-block-end-width: var(--dt-size-border-100) !important |
| `d-bbw2` | border-block-end-width: var(--dt-size-border-200) !important |
| `d-bbw4` | border-block-end-width: var(--dt-size-border-300) !important |
| `d-bl` | -webkit-border-start: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-inline-start: var(--dt-size-border-100) solid var(--dt-color-border-default) !important |
| `d-blr-circle` | border-start-start-radius: var(--dt-size-radius-circle) !important; border-end-start-radius: var(--dt-size-radius-circle) !important |
| `d-blr-pill` | border-start-start-radius: var(--dt-size-radius-pill) !important; border-end-start-radius: var(--dt-size-radius-pill) !important |
| `d-blr0` | border-start-start-radius: var(--dt-size-radius-0) !important; border-end-start-radius: var(--dt-size-radius-0) !important |
| `d-blr1` | border-start-start-radius: var(--dt-size-radius-100) !important; border-end-start-radius: var(--dt-size-radius-100) !important |
| `d-blr12` | border-start-start-radius: var(--dt-size-radius-450) !important; border-end-start-radius: var(--dt-size-radius-450) !important |
| `d-blr16` | border-start-start-radius: var(--dt-size-radius-500) !important; border-end-start-radius: var(--dt-size-radius-500) !important |
| `d-blr2` | border-start-start-radius: var(--dt-size-radius-200) !important; border-end-start-radius: var(--dt-size-radius-200) !important |
| `d-blr24` | border-start-start-radius: var(--dt-size-550) !important; border-end-start-radius: var(--dt-size-550) !important |
| `d-blr32` | border-start-start-radius: var(--dt-size-radius-600) !important; border-end-start-radius: var(--dt-size-radius-600) !important |
| `d-blr4` | border-start-start-radius: var(--dt-size-radius-300) !important; border-end-start-radius: var(--dt-size-radius-300) !important |
| `d-blr8` | border-start-start-radius: var(--dt-size-radius-400) !important; border-end-start-radius: var(--dt-size-radius-400) !important |
| `d-bls-dashed` | border-inline-start-style: dashed !important |
| `d-bls-dotted` | border-inline-start-style: dotted !important |
| `d-blw0` | border-inline-start-width: var(--dt-size-border-0) !important |
| `d-blw1` | border-inline-start-width: var(--dt-size-border-100) !important |
| `d-blw2` | border-inline-start-width: var(--dt-size-border-200) !important |
| `d-blw4` | border-inline-start-width: var(--dt-size-border-300) !important |
| `d-br` | -webkit-border-end: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-inline-end: var(--dt-size-border-100) solid var(--dt-color-border-default) !important |
| `d-brr-circle` | border-start-end-radius: var(--dt-size-radius-circle) !important; border-end-end-radius: var(--dt-size-radius-circle) !important |
| `d-brr-pill` | border-start-end-radius: var(--dt-size-radius-pill) !important; border-end-end-radius: var(--dt-size-radius-pill) !important |
| `d-brr0` | border-start-end-radius: var(--dt-size-radius-0) !important; border-end-end-radius: var(--dt-size-radius-0) !important |
| `d-brr1` | border-start-end-radius: var(--dt-size-radius-100) !important; border-end-end-radius: var(--dt-size-radius-100) !important |
| `d-brr12` | border-start-end-radius: var(--dt-size-radius-450) !important; border-end-end-radius: var(--dt-size-radius-450) !important |
| `d-brr16` | border-start-end-radius: var(--dt-size-radius-500) !important; border-end-end-radius: var(--dt-size-radius-500) !important |
| `d-brr2` | border-start-end-radius: var(--dt-size-radius-200) !important; border-end-end-radius: var(--dt-size-radius-200) !important |
| `d-brr24` | border-start-end-radius: var(--dt-size-550) !important; border-end-end-radius: var(--dt-size-550) !important |
| `d-brr32` | border-start-end-radius: var(--dt-size-radius-600) !important; border-end-end-radius: var(--dt-size-radius-600) !important |
| `d-brr4` | border-start-end-radius: var(--dt-size-radius-300) !important; border-end-end-radius: var(--dt-size-radius-300) !important |
| `d-brr8` | border-start-end-radius: var(--dt-size-radius-400) !important; border-end-end-radius: var(--dt-size-radius-400) !important |
| `d-brs-dashed` | border-inline-end-style: dashed !important |
| `d-brs-dotted` | border-inline-end-style: dotted !important |
| `d-brw0` | border-inline-end-width: var(--dt-size-border-0) !important |
| `d-brw1` | border-inline-end-width: var(--dt-size-border-100) !important |
| `d-brw2` | border-inline-end-width: var(--dt-size-border-200) !important |
| `d-brw4` | border-inline-end-width: var(--dt-size-border-300) !important |
| `d-bt` | -webkit-border-before: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-block-start: var(--dt-size-border-100) solid var(--dt-color-border-default) !important |
| `d-btr-circle` | border-start-start-radius: var(--dt-size-radius-circle) !important; border-start-end-radius: var(--dt-size-radius-circle) !important |
| `d-btr-pill` | border-start-start-radius: var(--dt-size-radius-pill) !important; border-start-end-radius: var(--dt-size-radius-pill) !important |
| `d-btr0` | border-start-start-radius: var(--dt-size-radius-0) !important; border-start-end-radius: var(--dt-size-radius-0) !important |
| `d-btr1` | border-start-start-radius: var(--dt-size-radius-100) !important; border-start-end-radius: var(--dt-size-radius-100) !important |
| `d-btr12` | border-start-start-radius: var(--dt-size-radius-450) !important; border-start-end-radius: var(--dt-size-radius-450) !important |
| `d-btr16` | border-start-start-radius: var(--dt-size-radius-500) !important; border-start-end-radius: var(--dt-size-radius-500) !important |
| `d-btr2` | border-start-start-radius: var(--dt-size-radius-200) !important; border-start-end-radius: var(--dt-size-radius-200) !important |
| `d-btr24` | border-start-start-radius: var(--dt-size-550) !important; border-start-end-radius: var(--dt-size-550) !important |
| `d-btr32` | border-start-start-radius: var(--dt-size-radius-600) !important; border-start-end-radius: var(--dt-size-radius-600) !important |
| `d-btr4` | border-start-start-radius: var(--dt-size-radius-300) !important; border-start-end-radius: var(--dt-size-radius-300) !important |
| `d-btr8` | border-start-start-radius: var(--dt-size-radius-400) !important; border-start-end-radius: var(--dt-size-radius-400) !important |
| `d-bts-dashed` | border-block-start-style: dashed !important |
| `d-bts-dotted` | border-block-start-style: dotted !important |
| `d-btw0` | border-block-start-width: var(--dt-size-border-0) !important |
| `d-btw1` | border-block-start-width: var(--dt-size-border-100) !important |
| `d-btw2` | border-block-start-width: var(--dt-size-border-200) !important |
| `d-btw4` | border-block-start-width: var(--dt-size-border-300) !important |
| `d-bx` | -webkit-border-end: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-inline-end: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; -webkit-border-start: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-inline-start: var(--dt-size-border-100) solid var(--dt-color-border-default) !important |
| `d-bxw0` | border-inline-end-width: var(--dt-size-border-0) !important; border-inline-start-width: var(--dt-size-border-0) !important |
| `d-bxw1` | border-inline-end-width: var(--dt-size-border-100) !important; border-inline-start-width: var(--dt-size-border-100) !important |
| `d-bxw2` | border-inline-end-width: var(--dt-size-border-200) !important; border-inline-start-width: var(--dt-size-border-200) !important |
| `d-bxw4` | border-inline-end-width: var(--dt-size-border-300) !important; border-inline-start-width: var(--dt-size-border-300) !important |
| `d-by` | -webkit-border-before: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-block-start: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; -webkit-border-after: var(--dt-size-border-100) solid var(--dt-color-border-default) !important; border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-default) !important |
| `d-byw0` | border-block-start-width: var(--dt-size-border-0) !important; border-block-end-width: var(--dt-size-border-0) !important |
| `d-byw1` | border-block-start-width: var(--dt-size-border-100) !important; border-block-end-width: var(--dt-size-border-100) !important |
| `d-byw2` | border-block-start-width: var(--dt-size-border-200) !important; border-block-end-width: var(--dt-size-border-200) !important |
| `d-byw4` | border-block-start-width: var(--dt-size-border-300) !important; border-block-end-width: var(--dt-size-border-300) !important |
