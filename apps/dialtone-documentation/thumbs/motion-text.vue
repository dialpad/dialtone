<!--
  Thumbnail override for DtMotionText.
  Every mode settles on plain text, and the capture moment varies with page load,
  so a running effect would land on a different frame each time. Instead this
  pauses gradient-sweep and seeks it to the middle of its hold, where every word
  is fully transparent over the gradient. The same frame renders on every
  capture. If the animations can't be seeked, it falls back to plain text.
-->
<template>
  <dt-text
    kind="headline"
    size="500"
  >
    <dt-motion-text
      ref="motionText"
      :text="text"
      animation-mode="gradient-sweep"
      :auto-start="false"
    />
  </dt-text>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { MOTION_TEXT_TRACKS } from '@dialpad/dialtone-vue';

const text = 'Animated text';
const motionText = ref(null);

onMounted(() => {
  // Midpoint of the window (at speed 300) where the first word has not started
  // fading back and the last word has finished fading out
  const { delay, stagger, duration } = MOTION_TEXT_TRACKS.sweep;
  const wordCount = text.split(' ').length;
  const holdTime = delay + (stagger * (wordCount - 1) + duration) / 2;

  // start() measures the words so the gradient runs continuously across them;
  // pause() keeps the timeline from moving on
  motionText.value.start();
  motionText.value.pause();
  motionText.value.$el.getAnimations?.({ subtree: true })
    ?.forEach(animation => { animation.currentTime = holdTime; });
});
</script>
