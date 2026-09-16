<template>
  <halftone-surface
    class="home-gradient-hero"
    style="--overlay-opacity: 0; --text-opacity: 1;"
  >
    <div class="home-gradient-hero__overlay" />
    <dt-box
      block-size="100p"
      padding-block-end="800"
      class="d-plc-center home-gradient-hero__content"
    >
      <gradient-hero-content />
    </dt-box>
    <dt-box
      aria-hidden="true"
      position="absolute"
      inset-block-end="0"
      inset-inline="0"
      z-index="base1"
      class="home-gradient-hero__bottom-fade-out"
    />
  </halftone-surface>
</template>

<script setup>
import GradientHeroContent from './GradientHeroContent.vue';
import HalftoneSurface from './HalftoneSurface.vue';
</script>

<style lang="less">
/* Unscoped so the homepage's scroll handler can drive the custom properties below. */

.home-gradient-hero {
  --overlay-color-surface: var(--halftone-color-background);
  --overlay-opacity: 0;
  --fadeout-block-size: var(--dt-layout-75);

  /* The overhang gives the scroll-driven canvas parallax room to travel without
     uncovering the bottom of the hero. */
  --halftone-parallax-overflow: 20%;

  block-size: calc(100vh + var(--fadeout-block-size));
}

.home-gradient-hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: var(--overlay-color-surface);
  opacity: var(--overlay-opacity);
}

.home-gradient-hero__content {
  position: relative;
  z-index: 2;
}

.home-gradient-hero__bottom-fade-out {
  pointer-events: none;
  block-size: var(--fadeout-block-size);
  background-color: var(--halftone-color-background);
  mask-image: linear-gradient(to bottom, transparent, black);
}
</style>
