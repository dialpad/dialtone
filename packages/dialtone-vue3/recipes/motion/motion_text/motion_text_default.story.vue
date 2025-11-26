<template>
  <dt-stack
    direction="row"
    align="center"
    class="d-hmn256 d-p24"
    data-migrate-outline
  >
    <dt-recipe-motion-text
      ref="motionText"
      :text="text"
      :animation-mode="animationMode"
      :speed="speed"
      :auto-start="autoStart"
      :loop="loop"
      :respects-reduced-motion="respectsReducedMotion"
      :screen-reader-text="screenReaderText"
      class="d-headline--lg"
      @start="onStart"
      @complete="onComplete"
      @progress="onProgress"
      @pause="onPause"
      @resume="onResume"
    />
  </dt-stack>
</template>

<script>
import { DtRecipeMotionText } from '@/recipes/motion/motion_text';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeMotionTextDefaultStory',
  components: {
    DtRecipeMotionText,
    DtStack,
  },

  props: {
    text: {
      type: String,
      default: 'Welcome to Dialtone Motion Text',
    },

    animationMode: {
      type: String,
      default: 'gradient-in',
    },

    speed: {
      type: String,
      default: 'md',
    },

    autoStart: {
      type: Boolean,
      default: true,
    },

    loop: {
      type: Boolean,
      default: false,
    },

    respectsReducedMotion: {
      type: Boolean,
      default: true,
    },

    screenReaderText: {
      type: String,
      default: '',
    },

    onStart: {
      type: Function,
      default: () => {},
    },

    onComplete: {
      type: Function,
      default: () => {},
    },

    onProgress: {
      type: Function,
      default: () => {},
    },

    onPause: {
      type: Function,
      default: () => {},
    },

    onResume: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
