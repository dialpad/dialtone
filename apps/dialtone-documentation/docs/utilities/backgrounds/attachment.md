---
title: Background Attachment
description: Utilities for controlling the way an element's background image position is fixed within the viewport or scrolls with its containing block.
---

## Scroll

Use `d-bga-scroll` to fix the <dt-link href="/assets/images/dp-sample-gradient.png" target="_blank" rel="noopener noreferrer"> background image </dt-link> to the element. It does not scroll with its content.

<code-well-header>
  <div v-dt-scrollbar:never class="d-bar8 d-p16 d-w100p d-h264 d-bgr-none d-bgs-cover d-bga-scroll d-h128 d-w100p" style="background-image: url('/assets/images/dp-sample-gradient.png')">
    <dt-stack gap="400" class="d-fc-neutral-white">
      <p>Curved rhythms often accompany lateral decisions, especially when considering the abstract potential of non-specific alignments. While typically unnoticed, these gentle shifts can accumulate meaning when framed in a context that remains undefined.</p>
      <p>Momentum builds where it doesn't, anchoring intent to unmeasured goals. As frameworks iterate without resolution, the pattern repeats—not identically, but recognizably. Every nuance appears significant until it drifts, leaving behind the shape of intent without its content. That distinction matters only when observation persists without anchoring.</p>
      <p>Transitions feel deliberate, though no threshold is ever clearly crossed. Echoes outlast their origin, and yet no moment stands alone when layered against ambient expectation.</p>
      <p>Nothing hinges on timing, yet sequences unfold as if they do. Loops stretch toward closure that neither confirms nor denies their purpose.</p>
      <p>With each cycle, the presence of form replaces the need for structure. In this way, absence becomes a container—soft-edged, indefinite, and quietly complete.</p>
      <p>Texture emerges where contrast flattens, offering a sense of motion without direction. The perception of clarity is merely a rhythm of proximity, not a function of definition.</p>
      <p>Eventually, what remains is not a resolution but a sustained pause—just enough to suggest continuity while withholding the terms of return.</p>
    </dt-stack>
  </div>
</code-well-header>

```html

<div class="... d-bga-scroll">...</div>
```

## Fixed

Use `d-bga-fixed` to fix the <dt-link href="/assets/images/dp-sample-gradient.png" target="_blank" rel="noopener noreferrer"> background image </dt-link> to the viewport. The background image does not scroll with the content.

<code-well-header>
  <div v-dt-scrollbar:never class="d-bar8 d-p16 d-w100p d-h264 d-bgr-none d-bgs-cover d-bga-fixed d-h128 d-w100p" style="background-image: url('/assets/images/dp-sample-gradient.png')">
    <dt-stack gap="400" class="d-fc-neutral-white">
      <p>Curved rhythms often accompany lateral decisions, especially when considering the abstract potential of non-specific alignments. While typically unnoticed, these gentle shifts can accumulate meaning when framed in a context that remains undefined.</p>
      <p>Momentum builds where it doesn't, anchoring intent to unmeasured goals. As frameworks iterate without resolution, the pattern repeats—not identically, but recognizably. Every nuance appears significant until it drifts, leaving behind the shape of intent without its content. That distinction matters only when observation persists without anchoring.</p>
      <p>Transitions feel deliberate, though no threshold is ever clearly crossed. Echoes outlast their origin, and yet no moment stands alone when layered against ambient expectation.</p>
      <p>Nothing hinges on timing, yet sequences unfold as if they do. Loops stretch toward closure that neither confirms nor denies their purpose.</p>
      <p>With each cycle, the presence of form replaces the need for structure. In this way, absence becomes a container—soft-edged, indefinite, and quietly complete.</p>
      <p>Texture emerges where contrast flattens, offering a sense of motion without direction. The perception of clarity is merely a rhythm of proximity, not a function of definition.</p>
      <p>Eventually, what remains is not a resolution but a sustained pause—just enough to suggest continuity while withholding the terms of return.</p>
    </dt-stack>
  </div>
</code-well-header>

```html

<div class="... d-bga-fixed">...</div>
```

## Local

Use `d-bga-local` to fix <dt-link href="/assets/images/dp-sample-gradient.png" target="_blank" rel="noopener noreferrer"> background image </dt-link> relative to the element's contents. If the element is scrollable, the
background scrolls with the element's contents, and background area and positioning are relative to the scrollable area
of the element rather than the viewable box.

<code-well-header>
  <div v-dt-scrollbar:never class="d-bar8 d-p16 d-w100p d-h264 d-bgr-none d-bgs-cover d-bga-local d-h128 d-w100p" style="background-image: url('/assets/images/dp-sample-gradient.png')">
    <dt-stack gap="400" class="d-fc-neutral-white">
      <p>Curved rhythms often accompany lateral decisions, especially when considering the abstract potential of non-specific alignments. While typically unnoticed, these gentle shifts can accumulate meaning when framed in a context that remains undefined.</p>
      <p>Momentum builds where it doesn't, anchoring intent to unmeasured goals. As frameworks iterate without resolution, the pattern repeats—not identically, but recognizably. Every nuance appears significant until it drifts, leaving behind the shape of intent without its content. That distinction matters only when observation persists without anchoring.</p>
      <p>Transitions feel deliberate, though no threshold is ever clearly crossed. Echoes outlast their origin, and yet no moment stands alone when layered against ambient expectation.</p>
      <p>Nothing hinges on timing, yet sequences unfold as if they do. Loops stretch toward closure that neither confirms nor denies their purpose.</p>
      <p>With each cycle, the presence of form replaces the need for structure. In this way, absence becomes a container—soft-edged, indefinite, and quietly complete.</p>
      <p>Texture emerges where contrast flattens, offering a sense of motion without direction. The perception of clarity is merely a rhythm of proximity, not a function of definition.</p>
      <p>Eventually, what remains is not a resolution but a sustained pause—just enough to suggest continuity while withholding the terms of return.</p>
    </dt-stack>
  </div>
</code-well-header>

```html

<div class="... d-bga-local">...</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['unset', 'scroll', 'fixed', 'local']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-bga-{{ i }}</th>
        <td class="d-code--sm">background-attachment: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
