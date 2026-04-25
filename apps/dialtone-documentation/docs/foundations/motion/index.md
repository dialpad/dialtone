---
title: Motion
description: Guidelines for animation and motion design
thumb: true
keywords: ["animation","transition","movement","easing"]
---


<dt-stack gap="600" class="d-mbs-600">
  <dt-box class="d-d-grid d-g-400 d-g-cols1 md:d-g-cols3 d-ai-start">
    <dt-stack gap="200">
      <video class="d-d-block d-w100p d-bar-500" src="/assets/videos/motion--empowered-elevated.mp4" muted loop></video>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Empowered → Elevated</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">By using motion the is literally uplifting, we connect to our brand character of empowering or customers.</p>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <video class="d-d-block d-w100p d-bar-500" src="/assets/videos/motion--confident-focused.mp4" muted loop></video>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Confident → Focused</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">We use a sense of focus in our motion identity to communicate the confidence we can instill.</p>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <video class="d-d-block d-w100p d-bar-500" src="/assets/videos/motion--inspired-dynamic.mp4" muted loop></video>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Inspired → Dynamic</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">When the times right, we’re dynamic. This inspires excitement and movement about Dialpad.</p>
      </dt-stack>
    </dt-stack>
  </dt-box>

  <div class="d-d-grid d-g-600 d-g-cols1 md:d-g-cols3 d-ai-center">
    <dt-box>
      <h2 class="d-docsite--header-3">Motion Behavior</h2>
      <p class="d-docsite--paragraph">Motion graphics should always use our consistent motion curve as illustrated here. </p>
      <p class="d-docsite--paragraph">Animations in should use the ease out <dt-text kind="code" as="code">cubic-bezier(0.35,0,0.1,1)</dt-text>  curve. </p>
      <p class="d-docsite--paragraph">Animations out should be reversed using ease in <dt-text kind="code" as="code">cubic-bezier(0.9,0,0.65,1)</dt-text> curve. </p>
    </dt-box>
    <dt-box class="d-gc2" padding="400" surface="secondary" border-radius="500" style="background-color: #F2F0EE" v-dt-mode:light>
      <dt-stack direction="row" gap="400" justify="space-evenly">
        <dt-stack gap="100">
          <dt-stack gap="25">
            <dt-text as="p" kind="headline" size="200">Animate in</dt-text>
            <dt-text kind="code" as="p" tone="info" size="100" strength="bold">ease-out</dt-text>
            <dt-text kind="code" as="p" tone="info" size="100">cubic-bezier(0.35,0,0.1,1)</dt-text>
          </dt-stack>
          <dt-stack>
            <svg-loader name="motion--curve-animate-in" class="d-bbsr-500 d-d-block d-w100p" />
            <video class="d-d-block d-w100p d-bber-500" src="/assets/videos/motion--ease-out.mp4" muted loop></video>
          </dt-stack>
        </dt-stack>
        <dt-stack gap="100">
          <dt-stack gap="25">
            <dt-text as="p" kind="headline" size="200">Animate out</dt-text>
            <dt-text kind="code" as="p" tone="info" size="100" strength="bold">ease-in</dt-text>
            <dt-text kind="code" as="p" tone="info" size="100">cubic-bezier(0.9,0,0.65,1)</dt-text>
          </dt-stack>
          <dt-stack>
            <svg-loader name="motion--curve-animate-out" class="d-bbsr-500 d-d-block d-w100p" />
            <video class="d-d-block d-w100p d-bber-500" src="/assets/videos/motion--ease-in.mp4" muted loop></video>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </dt-box>
  </div>

  <dt-box class="d-d-grid d-g-400 d-g-cols1 md:d-g-cols4 d-ai-start">
    <dt-stack gap="200">
      <video class="d-d-block d-w100p d-bar-500" src="/assets/videos/motion--elevate.mp4" muted loop></video>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Elevate</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">Move up & fade In</p>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <video class="d-d-block d-w100p d-bar-500" src="/assets/videos/motion--scale-up.mp4" muted loop></video>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Scale up</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">Diagonal scale from left corner with fade in. Animate out to right corner with fade out.</p>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <video class="d-d-block d-w100p d-bar-500" src="/assets/videos/motion--scale-out.mp4" muted loop></video>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Scale out</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">Scale in from center with fade in. Scale out to center with fade out.</p>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <video class="d-d-block d-w100p d-bar-500" src="/assets/videos/motion--transform.mp4" muted loop></video>
      <dt-stack>
        <h3 class="d-docsite--header-4 d-mbs-0 d-fc-primary">Transform</h3>
        <p class="d-docsite--paragraph d-fc-tertiary">Modules can dynamically transform and shape to accommodate layout shifts.</p>
      </dt-stack>
    </dt-stack>
  </dt-box>
</dt-stack>
