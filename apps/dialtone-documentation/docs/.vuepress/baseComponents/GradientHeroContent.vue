<template>
  <dt-box class="home-gradient-hero-content">
    <dt-box class="d-d-flex d-plc-center d-mbe-600">
      <dt-link to="/dialtone/">
        <dt-box
          :inline-size="viewport.pick({
            default: '125',
            md: '150',
            lg: '200',
          })"
          style="filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 25px 30px);"
        >
          <svg-loader name="home--dialtone-badge" />
        </dt-box>
      </dt-link>
    </dt-box>
    <dt-text
      as="h1"
      kind="headline"
      strength="medium"
      density="200"
      align="center"
      class="d-p-400 home-gradient-hero-title d-wmx-1300 d-mx-auto"
    >
      The fastest way to build Dialpad.
    </dt-text>
    <dt-text
      as="p"
      variant="body-md"
      :size="viewport.pick({
        default: '200',
        md: '350',
      })"
      align="center"
      strength="medium"
      density="300"
      class="d-px-500 d-o80 d-wmx-1000 d-mx-auto"
      wrap="balance"
    >
      Start with the system of components, design tokens, and guidance that make good design the default.
    </dt-text>
    <dt-stack direction="row" justify="center" gap="200" class="d-pbs-500">
      <dt-button
        class="home-gradient-hero-btn"
        to="/dialtone/"
        :size="400"
      >
        Docs
      </dt-button>
      <dt-button
        to="/dialtone/whats-new/"
        :size="400"
        kind="muted"
        importance="outlined"
        class="d-bgc-primary h:d-bgc-secondary d-fc-primary d-bc-moderate"
      >
        What's New
      </dt-button>
    </dt-stack>
  </dt-box>
</template>

<script setup>
import { useViewportBreakpoints } from '../theme/composables/useViewportBreakpoints.js';

// Foreground copy for the homepage hero. Split from GradientHero so that component is only
// responsible for the canvas and its layering — this one carries no shader concerns and no
// lifecycle beyond reading breakpoints.
//
// Fade and travel come from `--text-opacity` and `--text-translate-y`, which the homepage's
// scroll handler writes onto the hero and this inherits.
const viewport = useViewportBreakpoints();
</script>

<style lang="less">
/* Unscoped so the custom properties the homepage sets on the hero still apply. */

.home-gradient-hero-content {
  transform: translateY(var(--text-translate-y, 0px));
  opacity: var(--text-opacity);
}

// .home-gradient-hero-btn {
//   --button-color-text: var(--dt-color-neutral-white);
//   --button-color-background: var(--dt-color-purple-50);
// }

.home-gradient-hero-title {
  font-size: 32px;
  font-family: "Season Sans", var(--dt-font-family-body);
  text-wrap: balance;
  transition: none;
  background: linear-gradient(180deg, var(--dt-color-purple-900), var(--dt-color-purple-1000));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media screen and (min-width: 640px) {
    font-size: 46px;
  }
}
</style>
