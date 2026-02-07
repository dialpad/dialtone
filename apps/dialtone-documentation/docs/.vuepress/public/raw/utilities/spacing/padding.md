# Padding

Utilities for setting an element's interior spacing between child elements and the element's box edge.

- **Keywords**: inner spacing, inset

  Padding CSS Utilities are most appropriate for padding on the <strong>sides</strong> of an element. Avoiding using it to create spacing <strong>between</strong> elements. Instead, favor the [Stack](../../components/stack.md) component and its <code>gap</code> property for spacing between. It can still be combined with flex utilities to create more complex layouts.

## Add Padding to All Sides

```html
<div class="d-p8 ...">d-p8</div>
```

## Add Padding to a Single Side

```html
<div class="d-pt12 ...">d-pt12</div>
<div class="d-pr16 ...">d-pr16</div>
<div class="d-pb24 ...">d-pb24</div>
<div class="d-pl32 ...">d-pl32</div>
```

## Add Horizontal Padding

```html
<div class="d-px16 ...">d-px16</div>
```

## Add Vertical Padding

```html
<div class="d-py24 ...">d-py24</div>
```

## Classes

Padding can be added to an element by using a utility class (i.e. `.d-p[#]`) or by using a directional class (i.e. `.d-p{t|r|b|l|y|x}[#]`).

| Class | Output |
| --- | --- |
| `d-p-unset` | padding: unset !important |
| `d-p0` | padding: var(--dt-size-0) !important |
| `d-p1` | padding: var(--dt-size-100) !important |
| `d-p12` | padding: var(--dt-size-450) !important |
| `d-p128` | padding: var(--dt-size-800) !important |
| `d-p16` | padding: var(--dt-size-500) !important |
| `d-p2` | padding: var(--dt-size-200) !important |
| `d-p20` | padding: var(--dt-size-525) !important |
| `d-p24` | padding: var(--dt-size-550) !important |
| `d-p32` | padding: var(--dt-size-600) !important |
| `d-p4` | padding: var(--dt-size-300) !important |
| `d-p48` | padding: var(--dt-size-650) !important |
| `d-p6` | padding: var(--dt-size-350) !important |
| `d-p64` | padding: var(--dt-size-700) !important |
| `d-p8` | padding: var(--dt-size-400) !important |
| `d-p96` | padding: var(--dt-size-750) !important |
| `d-pb-unset` | -webkit-padding-after: unset !important; padding-block-end: unset !important |
| `d-pb0` | -webkit-padding-after: var(--dt-size-0) !important; padding-block-end: var(--dt-size-0) !important |
| `d-pb1` | -webkit-padding-after: var(--dt-size-100) !important; padding-block-end: var(--dt-size-100) !important |
| `d-pb12` | -webkit-padding-after: var(--dt-size-450) !important; padding-block-end: var(--dt-size-450) !important |
| `d-pb128` | -webkit-padding-after: var(--dt-size-800) !important; padding-block-end: var(--dt-size-800) !important |
| `d-pb16` | -webkit-padding-after: var(--dt-size-500) !important; padding-block-end: var(--dt-size-500) !important |
| `d-pb2` | -webkit-padding-after: var(--dt-size-200) !important; padding-block-end: var(--dt-size-200) !important |
| `d-pb20` | -webkit-padding-after: var(--dt-size-525) !important; padding-block-end: var(--dt-size-525) !important |
| `d-pb24` | -webkit-padding-after: var(--dt-size-550) !important; padding-block-end: var(--dt-size-550) !important |
| `d-pb32` | -webkit-padding-after: var(--dt-size-600) !important; padding-block-end: var(--dt-size-600) !important |
| `d-pb4` | -webkit-padding-after: var(--dt-size-300) !important; padding-block-end: var(--dt-size-300) !important |
| `d-pb48` | -webkit-padding-after: var(--dt-size-650) !important; padding-block-end: var(--dt-size-650) !important |
| `d-pb6` | -webkit-padding-after: var(--dt-size-350) !important; padding-block-end: var(--dt-size-350) !important |
| `d-pb64` | -webkit-padding-after: var(--dt-size-700) !important; padding-block-end: var(--dt-size-700) !important |
| `d-pb8` | -webkit-padding-after: var(--dt-size-400) !important; padding-block-end: var(--dt-size-400) !important |
| `d-pb96` | -webkit-padding-after: var(--dt-size-750) !important; padding-block-end: var(--dt-size-750) !important |
| `d-pl-unset` | -webkit-padding-start: unset !important; padding-inline-start: unset !important |
| `d-pl0` | -webkit-padding-start: var(--dt-size-0) !important; padding-inline-start: var(--dt-size-0) !important |
| `d-pl1` | -webkit-padding-start: var(--dt-size-100) !important; padding-inline-start: var(--dt-size-100) !important |
| `d-pl12` | -webkit-padding-start: var(--dt-size-450) !important; padding-inline-start: var(--dt-size-450) !important |
| `d-pl128` | -webkit-padding-start: var(--dt-size-800) !important; padding-inline-start: var(--dt-size-800) !important |
| `d-pl16` | -webkit-padding-start: var(--dt-size-500) !important; padding-inline-start: var(--dt-size-500) !important |
| `d-pl2` | -webkit-padding-start: var(--dt-size-200) !important; padding-inline-start: var(--dt-size-200) !important |
| `d-pl20` | -webkit-padding-start: var(--dt-size-525) !important; padding-inline-start: var(--dt-size-525) !important |
| `d-pl24` | -webkit-padding-start: var(--dt-size-550) !important; padding-inline-start: var(--dt-size-550) !important |
| `d-pl32` | -webkit-padding-start: var(--dt-size-600) !important; padding-inline-start: var(--dt-size-600) !important |
| `d-pl4` | -webkit-padding-start: var(--dt-size-300) !important; padding-inline-start: var(--dt-size-300) !important |
| `d-pl48` | -webkit-padding-start: var(--dt-size-650) !important; padding-inline-start: var(--dt-size-650) !important |
| `d-pl6` | -webkit-padding-start: var(--dt-size-350) !important; padding-inline-start: var(--dt-size-350) !important |
| `d-pl64` | -webkit-padding-start: var(--dt-size-700) !important; padding-inline-start: var(--dt-size-700) !important |
| `d-pl8` | -webkit-padding-start: var(--dt-size-400) !important; padding-inline-start: var(--dt-size-400) !important |
| `d-pl96` | -webkit-padding-start: var(--dt-size-750) !important; padding-inline-start: var(--dt-size-750) !important |
| `d-pr-unset` | -webkit-padding-end: unset !important; padding-inline-end: unset !important |
| `d-pr0` | -webkit-padding-end: var(--dt-size-0) !important; padding-inline-end: var(--dt-size-0) !important |
| `d-pr1` | -webkit-padding-end: var(--dt-size-100) !important; padding-inline-end: var(--dt-size-100) !important |
| `d-pr12` | -webkit-padding-end: var(--dt-size-450) !important; padding-inline-end: var(--dt-size-450) !important |
| `d-pr128` | -webkit-padding-end: var(--dt-size-800) !important; padding-inline-end: var(--dt-size-800) !important |
| `d-pr16` | -webkit-padding-end: var(--dt-size-500) !important; padding-inline-end: var(--dt-size-500) !important |
| `d-pr2` | -webkit-padding-end: var(--dt-size-200) !important; padding-inline-end: var(--dt-size-200) !important |
| `d-pr20` | -webkit-padding-end: var(--dt-size-525) !important; padding-inline-end: var(--dt-size-525) !important |
| `d-pr24` | -webkit-padding-end: var(--dt-size-550) !important; padding-inline-end: var(--dt-size-550) !important |
| `d-pr32` | -webkit-padding-end: var(--dt-size-600) !important; padding-inline-end: var(--dt-size-600) !important |
| `d-pr4` | -webkit-padding-end: var(--dt-size-300) !important; padding-inline-end: var(--dt-size-300) !important |
| `d-pr48` | -webkit-padding-end: var(--dt-size-650) !important; padding-inline-end: var(--dt-size-650) !important |
| `d-pr6` | -webkit-padding-end: var(--dt-size-350) !important; padding-inline-end: var(--dt-size-350) !important |
| `d-pr64` | -webkit-padding-end: var(--dt-size-700) !important; padding-inline-end: var(--dt-size-700) !important |
| `d-pr8` | -webkit-padding-end: var(--dt-size-400) !important; padding-inline-end: var(--dt-size-400) !important |
| `d-pr96` | -webkit-padding-end: var(--dt-size-750) !important; padding-inline-end: var(--dt-size-750) !important |
| `d-pt-unset` | -webkit-padding-before: unset !important; padding-block-start: unset !important |
| `d-pt0` | -webkit-padding-before: var(--dt-size-0) !important; padding-block-start: var(--dt-size-0) !important |
| `d-pt1` | -webkit-padding-before: var(--dt-size-100) !important; padding-block-start: var(--dt-size-100) !important |
| `d-pt12` | -webkit-padding-before: var(--dt-size-450) !important; padding-block-start: var(--dt-size-450) !important |
| `d-pt128` | -webkit-padding-before: var(--dt-size-800) !important; padding-block-start: var(--dt-size-800) !important |
| `d-pt16` | -webkit-padding-before: var(--dt-size-500) !important; padding-block-start: var(--dt-size-500) !important |
| `d-pt2` | -webkit-padding-before: var(--dt-size-200) !important; padding-block-start: var(--dt-size-200) !important |
| `d-pt20` | -webkit-padding-before: var(--dt-size-525) !important; padding-block-start: var(--dt-size-525) !important |
| `d-pt24` | -webkit-padding-before: var(--dt-size-550) !important; padding-block-start: var(--dt-size-550) !important |
| `d-pt32` | -webkit-padding-before: var(--dt-size-600) !important; padding-block-start: var(--dt-size-600) !important |
| `d-pt4` | -webkit-padding-before: var(--dt-size-300) !important; padding-block-start: var(--dt-size-300) !important |
| `d-pt48` | -webkit-padding-before: var(--dt-size-650) !important; padding-block-start: var(--dt-size-650) !important |
| `d-pt6` | -webkit-padding-before: var(--dt-size-350) !important; padding-block-start: var(--dt-size-350) !important |
| `d-pt64` | -webkit-padding-before: var(--dt-size-700) !important; padding-block-start: var(--dt-size-700) !important |
| `d-pt8` | -webkit-padding-before: var(--dt-size-400) !important; padding-block-start: var(--dt-size-400) !important |
| `d-pt96` | -webkit-padding-before: var(--dt-size-750) !important; padding-block-start: var(--dt-size-750) !important |
| `d-px-unset` | -webkit-padding-end: unset !important; padding-inline-end: unset !important; -webkit-padding-start: unset !important; padding-inline-start: unset !important |
| `d-px0` | padding-inline: var(--dt-size-0) !important |
| `d-px1` | padding-inline: var(--dt-size-100) !important |
| `d-px12` | padding-inline: var(--dt-size-450) !important |
| `d-px128` | padding-inline: var(--dt-size-800) !important |
| `d-px16` | padding-inline: var(--dt-size-500) !important |
| `d-px2` | padding-inline: var(--dt-size-200) !important |
| `d-px20` | padding-inline: var(--dt-size-525) !important |
| `d-px24` | padding-inline: var(--dt-size-550) !important |
| `d-px32` | padding-inline: var(--dt-size-600) !important |
| `d-px4` | padding-inline: var(--dt-size-300) !important |
| `d-px48` | padding-inline: var(--dt-size-650) !important |
| `d-px6` | padding-inline: var(--dt-size-350) !important |
| `d-px64` | padding-inline: var(--dt-size-700) !important |
| `d-px8` | padding-inline: var(--dt-size-400) !important |
| `d-px96` | padding-inline: var(--dt-size-750) !important |
| `d-py-unset` | -webkit-padding-before: unset !important; padding-block-start: unset !important; -webkit-padding-after: unset !important; padding-block-end: unset !important |
| `d-py0` | padding-block: var(--dt-size-0) !important |
| `d-py1` | padding-block: var(--dt-size-100) !important |
| `d-py12` | padding-block: var(--dt-size-450) !important |
| `d-py128` | padding-block: var(--dt-size-800) !important |
| `d-py16` | padding-block: var(--dt-size-500) !important |
| `d-py2` | padding-block: var(--dt-size-200) !important |
| `d-py20` | padding-block: var(--dt-size-525) !important |
| `d-py24` | padding-block: var(--dt-size-550) !important |
| `d-py32` | padding-block: var(--dt-size-600) !important |
| `d-py4` | padding-block: var(--dt-size-300) !important |
| `d-py48` | padding-block: var(--dt-size-650) !important |
| `d-py6` | padding-block: var(--dt-size-350) !important |
| `d-py64` | padding-block: var(--dt-size-700) !important |
| `d-py8` | padding-block: var(--dt-size-400) !important |
| `d-py96` | padding-block: var(--dt-size-750) !important |
