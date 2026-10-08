<template>
  <!-- gradient-sweep is a single CSS animation, so the generator can pin it to
       a fixed frame (FREEZE_FRAMES in scripts/thumbs/generate.mjs). The default
       gradient-in mode is driven by JS timeouts and can't be frozen reliably. -->
  <dt-motion-text
    text="Animated text"
    animation-mode="gradient-sweep"
  />
</template>
