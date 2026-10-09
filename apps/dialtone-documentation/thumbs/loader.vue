<!--
  Thumbnail override for DtLoader.
  The capture can land mid-loop, where the dots overlap into a blob. Pausing on
  the first frame shows the resting pose from the Figma spec.
-->
<template>
  <dt-loader size="800" />
</template>

<style scoped>
:deep(.d-loader__dot) {
  animation-play-state: paused;
}
</style>
