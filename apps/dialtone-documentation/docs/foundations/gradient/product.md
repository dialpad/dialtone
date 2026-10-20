---
title: Gradient in Product
description: The limited places the legacy gradient appears in product UI, applied through Dialtone's gradient tokens and utility classes.
status: ready
download_url: /downloads/#gradient
keywords: ["gradient", "product", "background", "utility", "linear gradient"]
---

In product, the gradient is limited to the app icon, AI treatments such as the AI badge, and the AI type reveal on AI-written text. These treatments stay faithful to the product UI. They don't license gradient use on brand or marketing surfaces, which use the [Resolve halftone](/foundations/halftone/). See [Gradient](/foundations/gradient/) for the full list of approved uses.

[Gradient Design Tokens](/tokens/?search=gradient)

<dt-stack gap="650" class="d-my-600">
  <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <h2 class="d-docsite--header-3">App Icon</h2>
      <p class="d-docsite--paragraph"><dt-link to="/foundations/icons/?search=dialpad">Icons</dt-link></p>
    </div>
    <div class="d-gc2">
      <figure>
        <img src="/assets/images/gradient--product-01.png" alt="" class="d-d-block d-w100p d-bar-500">
      </figure>
    </div>
  </div>

  <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
    <div>
      <h2 class="d-docsite--header-3">DtBadge</h2>
      <p class="d-docsite--paragraph">The AI badge uses the gradient surface to mark AI features in product UI.</p>
    </div>
    <div class="d-gc2">
      <figure>
        <img src="/assets/images/gradient--product-02.png" alt="" class="d-d-block d-w100p d-bar-500">
      </figure>
    </div>
  </div>
</dt-stack>

## AI type

AI-written words inside product UI can use the `gradient-in` mode of [Motion Text](/components/motion-text.html). Each word fades in on its slice of the gradient, then settles to solid ink. Use it for AI-generated text only, never for headlines or static text.
