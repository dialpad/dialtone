<template>
  <!-- gradient-sweep runs entirely on CSS animations, so the generator can pin it to
       a fixed frame (FREEZE_FRAMES in scripts/thumbs/generate.mjs). At 1500ms every
       word has faded to its slice of the gradient and hasn't started fading back. -->
  <dt-motion-text
    text="Animated text"
    animation-mode="gradient-sweep"
  />
</template>
