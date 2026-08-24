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

  /* The overhang gives the scroll-driven canvas parallax room to travel without
     uncovering the bottom of the hero. */
  --halftone-parallax-overflow: 20%;

  block-size: 100vh;
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
</style>
