---
title: Product Storytelling
description: Patterns and guidance for communicating product value, feature moments, and user journeys.
thumb: true
figma_url: https://www.figma.com/design/PLQoed9VsIUxWgUB5Fkmnh/%F0%9F%8E%9B%EF%B8%8F-Brand-UI-Library?node-id=6003-2435&t=gtQZTaTOQoTPIX6b-1
download_url: /downloads/#product-storytelling
keywords: ["narrative", "feature", "value proposition"]
---

<dt-stack gap="600" class="d-mbs-600">
  <div class="d-d-grid d-g-400 d-g-cols1 md:d-g-cols3 d-ai-start">
    <dt-stack gap="200">
      <img src="/assets/images/product-storytelling--simplified.png" alt="Simplified UI: a product panel with a status pill stacked below it" class="d-d-block d-w100p d-bar-500">
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Simplified UI</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">For use when speaking to high-level product and platform benefits.</p>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <img src="/assets/images/product-storytelling--02.png" alt="" class="d-d-block d-w100p d-bar-500">
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Focused UI</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">For use when communicating specific product benefits.</p>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <img src="/assets/images/product-storytelling--03.png" alt="" class="d-d-block d-w100p d-bar-500">
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Literal UI</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">For use when showing the product as a complete interface in context.</p>
      </dt-stack>
    </dt-stack>
  </div>
</dt-stack>

## Choosing a mode

Use the least literal UI that still supports the message:

1. **Simplified first.** This is the default for heroes, value propositions, benefits, and top-of-funnel content.
2. **Focused second.** Use it when the content demonstrates a single product capability that simplified UI would obscure.
3. **Literal last.** Reserve it for bottom-funnel content, comparisons, product tours, and detailed walkthroughs.

Never recreate product UI. Use approved assets from the [Brand UI Library](https://www.figma.com/design/PLQoed9VsIUxWgUB5Fkmnh/), and flag a gap if no approved asset fits.

## Staging UI

- Stage floating UI on a [halftone](/foundations/halftone/) tile, not a gradient.
- Arrange the context UI panel and its status pill as a centered stack, about 12px apart.
- Status pills have an 8px radius, never a capsule. Floating UI gets the `brand-ui` drop shadow.
