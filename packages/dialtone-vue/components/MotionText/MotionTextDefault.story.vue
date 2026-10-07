<template>
  <dt-stack
    direction="row"
    align="center"
    class="d-hmn-400 d-p-300"
  >
    <!-- Keyed on the animation settings so changing a control replays the animation -->
    <dt-motion-text
      :key="replayKey"
      ref="motionText"
      :text="text"
      :animation-mode="animationMode"
      :speed="speed"
      :auto-start="autoStart"
      :loop="loop"
      :respects-reduced-motion="respectsReducedMotion"
      :screen-reader-text="screenReaderText"
      class="d-headline--xl"
      @start="onStart"
      @complete="onComplete"
      @progress="onProgress"
      @pause="onPause"
      @resume="onResume"
    >
      {{ $props.default }}
    </dt-motion-text>
  </dt-stack>
</template>

<script>
import { DtMotionText } from '@/components/MotionText';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtMotionTextDefaultStory',
  components: {
    DtMotionText,
    DtStack,
  },

  props: {
    text: {
      type: String,
      default: 'The AI platform for customer experience',
    },

    animationMode: {
      type: String,
      default: 'gradient-in',
    },

    speed: {
      type: [String, Number],
      default: '300',
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

    default: {
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

  computed: {
    replayKey () {
      return [this.text, this.$props.default, this.animationMode, this.speed, this.loop].join('|');
    },
  },
};
</script>
