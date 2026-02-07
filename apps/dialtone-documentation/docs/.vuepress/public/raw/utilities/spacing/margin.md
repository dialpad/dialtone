# Margins

Utilities to adjust an element's exterior spacing between other objects.

- **Keywords**: outer spacing, gap, offset

  Avoid applying margins directly. Lean toward using layout components like [Stack](../../components/stack.md) for consistent and maintainable spacing <strong>between</strong> elements.

## Add Margin to All Sides

```html
<div class="d-m24 ...">d-m24</div>
```

## Add Margin to a Single Side

```html
<div class="d-mt12 ...">d-mt12</div>
<div class="d-mr16 ...">d-mr16</div>
<div class="d-mb24 ...">d-mb24</div>
<div class="d-ml32 ...">d-ml32</div>
```

## Add Horizontal Margins

```html
<div class="d-mx24 ...">d-mx24</div>
```

## Add Vertical Margins

```html
<div class="d-my24 ...">d-my24</div>
```

## Auto Margins

Auto margins allow an element to fill a remaining space within an object. This is especially useful in flex layouts.

```html
<div class="d-mx-auto ...">d-mx-auto</div>
<div class="d-ml-auto ...">d-ml-auto</div>
<div class="d-mr-auto ...">d-mr-auto</div>
```

## Classes

Margins can be added to an element by using a utility class (i.e. `.d-m[#]`) or by using a directional class (i.e. `.d-m{t|r|b|l|y|x}[#]`).
The margin utility classes help visually separate elements. Because layouts are highly contextual, margins are never applied natively to a component's outer wrapper.

It is highly recommended to use the [stack component](../../components/stack.md) or the [auto spacing classes](./auto-spacing.md) prior to applying margins individually.

| Class | Output |
| --- | --- |
| `d-m-auto` | margin: auto !important |
| `d-m-unset` | margin: unset !important |
| `d-m0` | margin: var(--dt-size-0) !important |
| `d-m1` | margin: var(--dt-size-100) !important |
| `d-m12` | margin: var(--dt-size-450) !important |
| `d-m128` | margin: var(--dt-size-800) !important |
| `d-m16` | margin: var(--dt-size-500) !important |
| `d-m2` | margin: var(--dt-size-200) !important |
| `d-m20` | margin: var(--dt-size-525) !important |
| `d-m24` | margin: var(--dt-size-550) !important |
| `d-m32` | margin: var(--dt-size-600) !important |
| `d-m4` | margin: var(--dt-size-300) !important |
| `d-m48` | margin: var(--dt-size-650) !important |
| `d-m6` | margin: var(--dt-size-350) !important |
| `d-m64` | margin: var(--dt-size-700) !important |
| `d-m8` | margin: var(--dt-size-400) !important |
| `d-m96` | margin: var(--dt-size-750) !important |
| `d-mb-auto` | -webkit-margin-after: auto !important; margin-block-end: auto !important |
| `d-mb-unset` | -webkit-margin-after: unset !important; margin-block-end: unset !important |
| `d-mb0` | -webkit-margin-after: var(--dt-size-0) !important; margin-block-end: var(--dt-size-0) !important |
| `d-mb1` | -webkit-margin-after: var(--dt-size-100) !important; margin-block-end: var(--dt-size-100) !important |
| `d-mb12` | -webkit-margin-after: var(--dt-size-450) !important; margin-block-end: var(--dt-size-450) !important |
| `d-mb128` | -webkit-margin-after: var(--dt-size-800) !important; margin-block-end: var(--dt-size-800) !important |
| `d-mb16` | -webkit-margin-after: var(--dt-size-500) !important; margin-block-end: var(--dt-size-500) !important |
| `d-mb2` | -webkit-margin-after: var(--dt-size-200) !important; margin-block-end: var(--dt-size-200) !important |
| `d-mb20` | -webkit-margin-after: var(--dt-size-525) !important; margin-block-end: var(--dt-size-525) !important |
| `d-mb24` | -webkit-margin-after: var(--dt-size-550) !important; margin-block-end: var(--dt-size-550) !important |
| `d-mb32` | -webkit-margin-after: var(--dt-size-600) !important; margin-block-end: var(--dt-size-600) !important |
| `d-mb4` | -webkit-margin-after: var(--dt-size-300) !important; margin-block-end: var(--dt-size-300) !important |
| `d-mb48` | -webkit-margin-after: var(--dt-size-650) !important; margin-block-end: var(--dt-size-650) !important |
| `d-mb6` | -webkit-margin-after: var(--dt-size-350) !important; margin-block-end: var(--dt-size-350) !important |
| `d-mb64` | -webkit-margin-after: var(--dt-size-700) !important; margin-block-end: var(--dt-size-700) !important |
| `d-mb8` | -webkit-margin-after: var(--dt-size-400) !important; margin-block-end: var(--dt-size-400) !important |
| `d-mb96` | -webkit-margin-after: var(--dt-size-750) !important; margin-block-end: var(--dt-size-750) !important |
| `d-mbn1` | -webkit-margin-after: var(--dt-size-100-negative) !important; margin-block-end: var(--dt-size-100-negative) !important |
| `d-mbn12` | -webkit-margin-after: var(--dt-size-450-negative) !important; margin-block-end: var(--dt-size-450-negative) !important |
| `d-mbn128` | -webkit-margin-after: var(--dt-size-800-negative) !important; margin-block-end: var(--dt-size-800-negative) !important |
| `d-mbn16` | -webkit-margin-after: var(--dt-size-500-negative) !important; margin-block-end: var(--dt-size-500-negative) !important |
| `d-mbn2` | -webkit-margin-after: var(--dt-size-200-negative) !important; margin-block-end: var(--dt-size-200-negative) !important |
| `d-mbn24` | -webkit-margin-after: var(--dt-size-550-negative) !important; margin-block-end: var(--dt-size-550-negative) !important |
| `d-mbn32` | -webkit-margin-after: var(--dt-size-600-negative) !important; margin-block-end: var(--dt-size-600-negative) !important |
| `d-mbn4` | -webkit-margin-after: var(--dt-size-300-negative) !important; margin-block-end: var(--dt-size-300-negative) !important |
| `d-mbn48` | -webkit-margin-after: var(--dt-size-650-negative) !important; margin-block-end: var(--dt-size-650-negative) !important |
| `d-mbn6` | -webkit-margin-after: var(--dt-size-350-negative) !important; margin-block-end: var(--dt-size-350-negative) !important |
| `d-mbn64` | -webkit-margin-after: var(--dt-size-700-negative) !important; margin-block-end: var(--dt-size-700-negative) !important |
| `d-mbn8` | -webkit-margin-after: var(--dt-size-400-negative) !important; margin-block-end: var(--dt-size-400-negative) !important |
| `d-mbn96` | -webkit-margin-after: var(--dt-size-750-negative) !important; margin-block-end: var(--dt-size-750-negative) !important |
| `d-ml-auto` | -webkit-margin-start: auto !important; margin-inline-start: auto !important |
| `d-ml-unset` | -webkit-margin-start: unset !important; margin-inline-start: unset !important |
| `d-ml0` | -webkit-margin-start: var(--dt-size-0) !important; margin-inline-start: var(--dt-size-0) !important |
| `d-ml1` | -webkit-margin-start: var(--dt-size-100) !important; margin-inline-start: var(--dt-size-100) !important |
| `d-ml12` | -webkit-margin-start: var(--dt-size-450) !important; margin-inline-start: var(--dt-size-450) !important |
| `d-ml128` | -webkit-margin-start: var(--dt-size-800) !important; margin-inline-start: var(--dt-size-800) !important |
| `d-ml16` | -webkit-margin-start: var(--dt-size-500) !important; margin-inline-start: var(--dt-size-500) !important |
| `d-ml2` | -webkit-margin-start: var(--dt-size-200) !important; margin-inline-start: var(--dt-size-200) !important |
| `d-ml20` | -webkit-margin-start: var(--dt-size-525) !important; margin-inline-start: var(--dt-size-525) !important |
| `d-ml24` | -webkit-margin-start: var(--dt-size-550) !important; margin-inline-start: var(--dt-size-550) !important |
| `d-ml32` | -webkit-margin-start: var(--dt-size-600) !important; margin-inline-start: var(--dt-size-600) !important |
| `d-ml4` | -webkit-margin-start: var(--dt-size-300) !important; margin-inline-start: var(--dt-size-300) !important |
| `d-ml48` | -webkit-margin-start: var(--dt-size-650) !important; margin-inline-start: var(--dt-size-650) !important |
| `d-ml6` | -webkit-margin-start: var(--dt-size-350) !important; margin-inline-start: var(--dt-size-350) !important |
| `d-ml64` | -webkit-margin-start: var(--dt-size-700) !important; margin-inline-start: var(--dt-size-700) !important |
| `d-ml8` | -webkit-margin-start: var(--dt-size-400) !important; margin-inline-start: var(--dt-size-400) !important |
| `d-ml96` | -webkit-margin-start: var(--dt-size-750) !important; margin-inline-start: var(--dt-size-750) !important |
| `d-mln1` | -webkit-margin-start: var(--dt-size-100-negative) !important; margin-inline-start: var(--dt-size-100-negative) !important |
| `d-mln12` | -webkit-margin-start: var(--dt-size-450-negative) !important; margin-inline-start: var(--dt-size-450-negative) !important |
| `d-mln128` | -webkit-margin-start: var(--dt-size-800-negative) !important; margin-inline-start: var(--dt-size-800-negative) !important |
| `d-mln16` | -webkit-margin-start: var(--dt-size-500-negative) !important; margin-inline-start: var(--dt-size-500-negative) !important |
| `d-mln2` | -webkit-margin-start: var(--dt-size-200-negative) !important; margin-inline-start: var(--dt-size-200-negative) !important |
| `d-mln24` | -webkit-margin-start: var(--dt-size-550-negative) !important; margin-inline-start: var(--dt-size-550-negative) !important |
| `d-mln32` | -webkit-margin-start: var(--dt-size-600-negative) !important; margin-inline-start: var(--dt-size-600-negative) !important |
| `d-mln4` | -webkit-margin-start: var(--dt-size-300-negative) !important; margin-inline-start: var(--dt-size-300-negative) !important |
| `d-mln48` | -webkit-margin-start: var(--dt-size-650-negative) !important; margin-inline-start: var(--dt-size-650-negative) !important |
| `d-mln6` | -webkit-margin-start: var(--dt-size-350-negative) !important; margin-inline-start: var(--dt-size-350-negative) !important |
| `d-mln64` | -webkit-margin-start: var(--dt-size-700-negative) !important; margin-inline-start: var(--dt-size-700-negative) !important |
| `d-mln8` | -webkit-margin-start: var(--dt-size-400-negative) !important; margin-inline-start: var(--dt-size-400-negative) !important |
| `d-mln96` | -webkit-margin-start: var(--dt-size-750-negative) !important; margin-inline-start: var(--dt-size-750-negative) !important |
| `d-mn1` | margin: var(--dt-size-100-negative) !important |
| `d-mn12` | margin: var(--dt-size-450-negative) !important |
| `d-mn128` | margin: var(--dt-size-800-negative) !important |
| `d-mn16` | margin: var(--dt-size-500-negative) !important |
| `d-mn2` | margin: var(--dt-size-200-negative) !important |
| `d-mn24` | margin: var(--dt-size-550-negative) !important |
| `d-mn32` | margin: var(--dt-size-600-negative) !important |
| `d-mn4` | margin: var(--dt-size-300-negative) !important |
| `d-mn48` | margin: var(--dt-size-650-negative) !important |
| `d-mn6` | margin: var(--dt-size-350-negative) !important |
| `d-mn64` | margin: var(--dt-size-700-negative) !important |
| `d-mn8` | margin: var(--dt-size-400-negative) !important |
| `d-mn96` | margin: var(--dt-size-750-negative) !important |
| `d-mr-auto` | -webkit-margin-end: auto !important; margin-inline-end: auto !important |
| `d-mr-unset` | -webkit-margin-end: unset !important; margin-inline-end: unset !important |
| `d-mr0` | -webkit-margin-end: var(--dt-size-0) !important; margin-inline-end: var(--dt-size-0) !important |
| `d-mr1` | -webkit-margin-end: var(--dt-size-100) !important; margin-inline-end: var(--dt-size-100) !important |
| `d-mr12` | -webkit-margin-end: var(--dt-size-450) !important; margin-inline-end: var(--dt-size-450) !important |
| `d-mr128` | -webkit-margin-end: var(--dt-size-800) !important; margin-inline-end: var(--dt-size-800) !important |
| `d-mr16` | -webkit-margin-end: var(--dt-size-500) !important; margin-inline-end: var(--dt-size-500) !important |
| `d-mr2` | -webkit-margin-end: var(--dt-size-200) !important; margin-inline-end: var(--dt-size-200) !important |
| `d-mr20` | -webkit-margin-end: var(--dt-size-525) !important; margin-inline-end: var(--dt-size-525) !important |
| `d-mr24` | -webkit-margin-end: var(--dt-size-550) !important; margin-inline-end: var(--dt-size-550) !important |
| `d-mr32` | -webkit-margin-end: var(--dt-size-600) !important; margin-inline-end: var(--dt-size-600) !important |
| `d-mr4` | -webkit-margin-end: var(--dt-size-300) !important; margin-inline-end: var(--dt-size-300) !important |
| `d-mr48` | -webkit-margin-end: var(--dt-size-650) !important; margin-inline-end: var(--dt-size-650) !important |
| `d-mr6` | -webkit-margin-end: var(--dt-size-350) !important; margin-inline-end: var(--dt-size-350) !important |
| `d-mr64` | -webkit-margin-end: var(--dt-size-700) !important; margin-inline-end: var(--dt-size-700) !important |
| `d-mr8` | -webkit-margin-end: var(--dt-size-400) !important; margin-inline-end: var(--dt-size-400) !important |
| `d-mr96` | -webkit-margin-end: var(--dt-size-750) !important; margin-inline-end: var(--dt-size-750) !important |
| `d-mrn1` | -webkit-margin-end: var(--dt-size-100-negative) !important; margin-inline-end: var(--dt-size-100-negative) !important |
| `d-mrn12` | -webkit-margin-end: var(--dt-size-450-negative) !important; margin-inline-end: var(--dt-size-450-negative) !important |
| `d-mrn128` | -webkit-margin-end: var(--dt-size-800-negative) !important; margin-inline-end: var(--dt-size-800-negative) !important |
| `d-mrn16` | -webkit-margin-end: var(--dt-size-500-negative) !important; margin-inline-end: var(--dt-size-500-negative) !important |
| `d-mrn2` | -webkit-margin-end: var(--dt-size-200-negative) !important; margin-inline-end: var(--dt-size-200-negative) !important |
| `d-mrn24` | -webkit-margin-end: var(--dt-size-550-negative) !important; margin-inline-end: var(--dt-size-550-negative) !important |
| `d-mrn32` | -webkit-margin-end: var(--dt-size-600-negative) !important; margin-inline-end: var(--dt-size-600-negative) !important |
| `d-mrn4` | -webkit-margin-end: var(--dt-size-300-negative) !important; margin-inline-end: var(--dt-size-300-negative) !important |
| `d-mrn48` | -webkit-margin-end: var(--dt-size-650-negative) !important; margin-inline-end: var(--dt-size-650-negative) !important |
| `d-mrn6` | -webkit-margin-end: var(--dt-size-350-negative) !important; margin-inline-end: var(--dt-size-350-negative) !important |
| `d-mrn64` | -webkit-margin-end: var(--dt-size-700-negative) !important; margin-inline-end: var(--dt-size-700-negative) !important |
| `d-mrn8` | -webkit-margin-end: var(--dt-size-400-negative) !important; margin-inline-end: var(--dt-size-400-negative) !important |
| `d-mrn96` | -webkit-margin-end: var(--dt-size-750-negative) !important; margin-inline-end: var(--dt-size-750-negative) !important |
| `d-mt-auto` | -webkit-margin-before: auto !important; margin-block-start: auto !important |
| `d-mt-unset` | -webkit-margin-before: unset !important; margin-block-start: unset !important |
| `d-mt0` | -webkit-margin-before: var(--dt-size-0) !important; margin-block-start: var(--dt-size-0) !important |
| `d-mt1` | -webkit-margin-before: var(--dt-size-100) !important; margin-block-start: var(--dt-size-100) !important |
| `d-mt12` | -webkit-margin-before: var(--dt-size-450) !important; margin-block-start: var(--dt-size-450) !important |
| `d-mt128` | -webkit-margin-before: var(--dt-size-800) !important; margin-block-start: var(--dt-size-800) !important |
| `d-mt16` | -webkit-margin-before: var(--dt-size-500) !important; margin-block-start: var(--dt-size-500) !important |
| `d-mt2` | -webkit-margin-before: var(--dt-size-200) !important; margin-block-start: var(--dt-size-200) !important |
| `d-mt20` | -webkit-margin-before: var(--dt-size-525) !important; margin-block-start: var(--dt-size-525) !important |
| `d-mt24` | -webkit-margin-before: var(--dt-size-550) !important; margin-block-start: var(--dt-size-550) !important |
| `d-mt32` | -webkit-margin-before: var(--dt-size-600) !important; margin-block-start: var(--dt-size-600) !important |
| `d-mt4` | -webkit-margin-before: var(--dt-size-300) !important; margin-block-start: var(--dt-size-300) !important |
| `d-mt48` | -webkit-margin-before: var(--dt-size-650) !important; margin-block-start: var(--dt-size-650) !important |
| `d-mt6` | -webkit-margin-before: var(--dt-size-350) !important; margin-block-start: var(--dt-size-350) !important |
| `d-mt64` | -webkit-margin-before: var(--dt-size-700) !important; margin-block-start: var(--dt-size-700) !important |
| `d-mt8` | -webkit-margin-before: var(--dt-size-400) !important; margin-block-start: var(--dt-size-400) !important |
| `d-mt96` | -webkit-margin-before: var(--dt-size-750) !important; margin-block-start: var(--dt-size-750) !important |
| `d-mtn1` | -webkit-margin-before: var(--dt-size-100-negative) !important; margin-block-start: var(--dt-size-100-negative) !important |
| `d-mtn12` | -webkit-margin-before: var(--dt-size-450-negative) !important; margin-block-start: var(--dt-size-450-negative) !important |
| `d-mtn128` | -webkit-margin-before: var(--dt-size-800-negative) !important; margin-block-start: var(--dt-size-800-negative) !important |
| `d-mtn16` | -webkit-margin-before: var(--dt-size-500-negative) !important; margin-block-start: var(--dt-size-500-negative) !important |
| `d-mtn2` | -webkit-margin-before: var(--dt-size-200-negative) !important; margin-block-start: var(--dt-size-200-negative) !important |
| `d-mtn24` | -webkit-margin-before: var(--dt-size-550-negative) !important; margin-block-start: var(--dt-size-550-negative) !important |
| `d-mtn32` | -webkit-margin-before: var(--dt-size-600-negative) !important; margin-block-start: var(--dt-size-600-negative) !important |
| `d-mtn4` | -webkit-margin-before: var(--dt-size-300-negative) !important; margin-block-start: var(--dt-size-300-negative) !important |
| `d-mtn48` | -webkit-margin-before: var(--dt-size-650-negative) !important; margin-block-start: var(--dt-size-650-negative) !important |
| `d-mtn6` | -webkit-margin-before: var(--dt-size-350-negative) !important; margin-block-start: var(--dt-size-350-negative) !important |
| `d-mtn64` | -webkit-margin-before: var(--dt-size-700-negative) !important; margin-block-start: var(--dt-size-700-negative) !important |
| `d-mtn8` | -webkit-margin-before: var(--dt-size-400-negative) !important; margin-block-start: var(--dt-size-400-negative) !important |
| `d-mtn96` | -webkit-margin-before: var(--dt-size-750-negative) !important; margin-block-start: var(--dt-size-750-negative) !important |
| `d-mx-auto` | margin-inline: auto !important |
| `d-mx-unset` | -webkit-margin-end: unset !important; margin-inline-end: unset !important; -webkit-margin-start: unset !important; margin-inline-start: unset !important |
| `d-mx0` | margin-inline: var(--dt-size-0) !important |
| `d-mx1` | margin-inline: var(--dt-size-100) !important |
| `d-mx12` | margin-inline: var(--dt-size-450) !important |
| `d-mx128` | margin-inline: var(--dt-size-800) !important |
| `d-mx16` | margin-inline: var(--dt-size-500) !important |
| `d-mx2` | margin-inline: var(--dt-size-200) !important |
| `d-mx20` | margin-inline: var(--dt-size-525) !important |
| `d-mx24` | margin-inline: var(--dt-size-550) !important |
| `d-mx32` | margin-inline: var(--dt-size-600) !important |
| `d-mx4` | margin-inline: var(--dt-size-300) !important |
| `d-mx48` | margin-inline: var(--dt-size-650) !important |
| `d-mx6` | margin-inline: var(--dt-size-350) !important |
| `d-mx64` | margin-inline: var(--dt-size-700) !important |
| `d-mx8` | margin-inline: var(--dt-size-400) !important |
| `d-mx96` | margin-inline: var(--dt-size-750) !important |
| `d-mxn1` | margin-inline: var(--dt-size-100-negative) !important |
| `d-mxn12` | margin-inline: var(--dt-size-450-negative) !important |
| `d-mxn128` | margin-inline: var(--dt-size-800-negative) !important |
| `d-mxn16` | margin-inline: var(--dt-size-500-negative) !important |
| `d-mxn2` | margin-inline: var(--dt-size-200-negative) !important |
| `d-mxn24` | margin-inline: var(--dt-size-550-negative) !important |
| `d-mxn32` | margin-inline: var(--dt-size-600-negative) !important |
| `d-mxn4` | margin-inline: var(--dt-size-300-negative) !important |
| `d-mxn48` | margin-inline: var(--dt-size-650-negative) !important |
| `d-mxn6` | margin-inline: var(--dt-size-350-negative) !important |
| `d-mxn64` | margin-inline: var(--dt-size-700-negative) !important |
| `d-mxn8` | margin-inline: var(--dt-size-400-negative) !important |
| `d-mxn96` | margin-inline: var(--dt-size-750-negative) !important |
| `d-my-auto` | margin-block: auto !important |
| `d-my-unset` | -webkit-margin-before: unset !important; margin-block-start: unset !important; -webkit-margin-after: unset !important; margin-block-end: unset !important |
| `d-my0` | margin-block: var(--dt-size-0) !important |
| `d-my1` | margin-block: var(--dt-size-100) !important |
| `d-my12` | margin-block: var(--dt-size-450) !important |
| `d-my128` | margin-block: var(--dt-size-800) !important |
| `d-my16` | margin-block: var(--dt-size-500) !important |
| `d-my2` | margin-block: var(--dt-size-200) !important |
| `d-my20` | margin-block: var(--dt-size-525) !important |
| `d-my24` | margin-block: var(--dt-size-550) !important |
| `d-my32` | margin-block: var(--dt-size-600) !important |
| `d-my4` | margin-block: var(--dt-size-300) !important |
| `d-my48` | margin-block: var(--dt-size-650) !important |
| `d-my6` | margin-block: var(--dt-size-350) !important |
| `d-my64` | margin-block: var(--dt-size-700) !important |
| `d-my8` | margin-block: var(--dt-size-400) !important |
| `d-my96` | margin-block: var(--dt-size-750) !important |
| `d-myn1` | margin-block: var(--dt-size-100-negative) !important |
| `d-myn12` | margin-block: var(--dt-size-450-negative) !important |
| `d-myn128` | margin-block: var(--dt-size-800-negative) !important |
| `d-myn16` | margin-block: var(--dt-size-500-negative) !important |
| `d-myn2` | margin-block: var(--dt-size-200-negative) !important |
| `d-myn24` | margin-block: var(--dt-size-550-negative) !important |
| `d-myn32` | margin-block: var(--dt-size-600-negative) !important |
| `d-myn4` | margin-block: var(--dt-size-300-negative) !important |
| `d-myn48` | margin-block: var(--dt-size-650-negative) !important |
| `d-myn6` | margin-block: var(--dt-size-350-negative) !important |
| `d-myn64` | margin-block: var(--dt-size-700-negative) !important |
| `d-myn8` | margin-block: var(--dt-size-400-negative) !important |
| `d-myn96` | margin-block: var(--dt-size-750-negative) !important |
