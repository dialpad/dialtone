---
title: Transformation Grid
description: A field of rounded squares that morph into circles, the graphic for change stories.
status: ready
figma_url: https://www.figma.com/design/pNwlnL86ybgXvyXepg8qfM/27Q2-Resolve-Brand---Web-Updates?node-id=8572-41991
keywords: ["resolve", "grid", "transformation", "squares", "circles", "graphics", "before and after"]
---

<img src="/assets/images/graphics-grid--wide.png" alt="Grid of Dark Tan tiles whose corners round into circles across one patch of the field" class="d-bar-500 d-d-block d-w100p d-mbs-600" />

## When to use

Use the transformation grid for stories about change: fragmented → resolved, data → understanding, manual → automated, or before → after. It's a statement graphic, so use it in select moments rather than everywhere.

## Anatomy

| Element | Spec |
| --- | --- |
| Tiles | A regular grid of squares |
| Shape change | Only the corner radius changes, from a slightly rounded square (about 10%) to a full circle. Position, size, and color never change. |
| Colors | Tiles one step off the ground: Tan `#F2F0EE` or Dark Tan `#CEC8C4` on Light Tan. Accent variants use Ultra Light Purple, Purple, or Dark Purple tiles. Use one tile color per grid. |
| Static versions | A frozen moment: a soft patch of circles easing back to squares across the field |

## Motion

<div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
  <div class="d-gc2">
    <ul>
      <li class="d-docsite--list-element">One soft bump of roundness travels a figure-8 across the grid in a 20-second seamless loop. Never let the field stop or reset.</li>
      <li class="d-docsite--list-element">On the web, the bump can follow the cursor instead, rounding tiles near the pointer into circles.</li>
      <li class="d-docsite--list-element">Tiles never move, scale, or change color.</li>
      <li class="d-docsite--list-element">Always honor <code>prefers-reduced-motion</code> by showing a static version.</li>
    </ul>
  </div>
  <figure>
    <img src="/assets/images/graphics-grid--square.png" alt="Square transformation grid with circles easing back to rounded squares" class="d-bar-500 d-d-block d-w100p" />
  </figure>
</div>
