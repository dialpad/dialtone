<template>
  <div class="gradient-overlay" style="--overlay-opacity: 0; --text-opacity: .6;">
    <div class="gradient-overlay__overlay" />
    <h1
      class="d-headline--xxl d-h100p d-w100p d-d-grid d-plc-center d-ta-center d-fw-medium d-wmx1024 d-m-auto d-p32"
      style="
        font-size: 64px;
        font-family: var(--dt-font-family-expressive);
        text-wrap: balance;
        opacity: var(--text-opacity);
        transform: translateY(var(--text-translate-y, 0px));
        transition: none;
      "
    >
      <div
        style="
          background: linear-gradient(180deg, var(--dt-color-purple-550), var(--dt-color-purple-1000));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        "
      >
        Making every business, a better business through design.
      </div>
    </h1>
  </div>
</template>

<script setup>
// Component handles gradient overlay hero section with scroll-driven animations
// Animations are controlled by parent page's scroll handler that updates CSS variables
</script>

<style>
/* Styles are inherited from parent page's .gradient-overlay definitions */
/* Unscoped to allow parent's dynamic CSS variable updates to work */
</style>
