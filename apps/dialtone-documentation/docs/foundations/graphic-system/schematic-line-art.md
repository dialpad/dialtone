---
title: Schematic Line Art
description: Abstract, circle-based compositions drawn in a single hairline, with small rounded-square nodes marking the moments that matter.
status: ready
figma_url: https://www.figma.com/design/pNwlnL86ybgXvyXepg8qfM/27Q2-Resolve-Brand---Web-Updates?node-id=8572-41905
keywords: ["resolve", "line art", "schematic", "nodes", "graphics", "loop", "diagram"]
---

<img src="/assets/images/graphics-resolve--billboard.png" alt="Schematic line art: arcs rising from the corner with nodes and white status pills" class="d-bar-500 d-d-block d-w100p d-mbs-600" />

## Anatomy

| Element | Spec |
| --- | --- |
| Line | 1px Deep Blue `#10022C`, no fill. Hold it at 1px at any size (`vector-effect: non-scaling-stroke`). Never black, gradient, dashed, or shaded. |
| Node | A small square with slightly rounded corners: 6–8px (up to about 10px on large canvases), with a corner radius of 25–33% of its size. Fill nodes Deep Blue. One node at most can be Purple `#7C52FF`, marking the hub or the resolved point. |
| Node ring | A 2.5–3.5px outer stroke in the ground color, so the line breaks around the node. It reads as white on a white container, Light Tan on Light Tan, and Tan on Tan. |
| Geometry | Circles, ellipses, arcs, concentric and tangent rings, overlapping petals, a single spiral, or arches rising from an edge. Let the panel edge crop large forms. |
| Panel | Tan with a 20px radius, or Light Tan inside a white box with a 16px radius. |
| Overlays | Optional white stage or status pills centered over their nodes, with an 8px radius and the `pill` shadow. Keep overlays few and let the line art carry the idea. |

## Composition

- **One idea per graphic, drawn as one gesture.** Balance it as a mirror or order it as a wave, with generous negative space.
- **Make the forms mean something:**
  - Tangent circles for a loop or stages.
  - Overlapping circles for shared context.
  - A bridging circle for connection.
  - Concentric rings for depth.
  - Petals from a hub for orchestration.
- **It's not a network graphic.** No random node meshes, straight-line node-to-node webs, or floating specks. Place nodes only where something happens: intersections, tangent points, axis crossings, and the ends of an arc.
- Never add icons inside nodes, arrows, shading, color fills, or gradients.

<div class="d-d-grid d-g-400 d-g-cols1 md:d-g-cols2">
  <figure>
    <img src="/assets/images/graphics-resolve--loop.png" alt="The Resolve loop: four tangent circles labeled Understand, Orchestrate, Act, and Learn" class="d-bar-500 d-d-block d-w100p" />
  </figure>
  <figure>
    <img src="/assets/images/graphics-resolve--petals.png" alt="Four overlapping petal shapes around a center, with nodes at each crossing" class="d-bar-500 d-d-block d-w100p" />
  </figure>
  <figure>
    <img src="/assets/images/graphics-resolve--arches.png" alt="Overlapping arches rising from the bottom edge, with nodes at each crossing" class="d-bar-500 d-d-block d-w100p" />
  </figure>
  <figure>
    <img src="/assets/images/graphics-resolve--rings.png" alt="A row of circles growing into concentric rings along one axis, with nodes on the axis" class="d-bar-500 d-d-block d-w100p" />
  </figure>
</div>

## Motion

Line art moves calmly and precisely, with no overshoot.

- **Draw-on:** trim each stroke from its start, 1.0s per stroke (1.3–1.6s for large rings) on `cubic-bezier(0.33, 1, 0.68, 1)`.
- **Stagger:** strokes within one figure start 0.2–0.5s apart and overlap. Order them as one gesture, such as center-out or left-to-right.
- **Node pop:** each node scales from 0 to 1 over 0.4–0.5s, the moment its stroke reaches it.
- **Pills:** fade in and rise 24px over 0.4s on `cubic-bezier(0.35, 0, 0.1, 1)` when their arc is half drawn.
- **In-page graphics** play once when about 35% visible. Don't loop or replay them on scroll. Hero graphics, like the Resolve loop, can loop.
- **Reduced motion:** always honor `prefers-reduced-motion` by showing the finished, static graphic.

## On a dark surface

Use this only when a dark background is explicitly requested. Draw lines and nodes in Light Tan, ring each node in the dark ground color, and use at most one Ultra Light Purple `#D3BCFF` accent node.
