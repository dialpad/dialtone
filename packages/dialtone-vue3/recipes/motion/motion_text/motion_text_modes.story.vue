<template>
  <dt-stack
    gap="550"
    class="d-p24"
  >
    <dt-stack
      v-for="mode in animationModes"
      :key="mode.value"
      gap="400"
    >
      <dt-stack
        direction="row"
        align="center"
        justify="between"
      >
        <h3 class="d-headline--md">
          {{ mode.label }} Mode
        </h3>
        <dt-button
          v-if="!isStaticMode(mode.value)"
          size="sm"
          importance="outlined"
          kind="muted"
          @click="restartAnimation(mode.value)"
        >
          Restart
        </dt-button>
      </dt-stack>
      <p class="d-body--sm d-fc-tertiary">
        {{ mode.description }}
      </p>
      <dt-stack
        direction="row"
        align="center"
        class="d-p24 d-bar8 d-ba d-bc-subtle d-bgc-secondary d-hmn128"
      >
        <dt-recipe-motion-text
          :ref="el => { if (el) modeRefs[mode.value] = el }"
          :text="exampleText"
          :animation-mode="mode.value"
          speed="md"
          :auto-start="false"
          :loop="isStaticMode(mode.value)"
          class="d-headline--lg"
        />
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
import { DtRecipeMotionText, MOTION_TEXT_ANIMATION_MODES } from '@/recipes/motion/motion_text';
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeMotionTextModesStory',
  components: {
    DtRecipeMotionText,
    DtButton,
    DtStack,
  },

  data () {
    return {
      modeRefs: {},
      exampleText: 'Experience the magic of animated text',
      animationModes: MOTION_TEXT_ANIMATION_MODES.map(mode => ({
        value: mode,
        label: this.formatLabel(mode),
        description: this.getDescription(mode),
      })),
    };
  },

  mounted () {
    // Start all animations on mount
    Object.values(this.modeRefs).forEach(ref => {
      if (ref) {
        setTimeout(() => ref.start(), 100);
      }
    });
  },

  methods: {
    formatLabel (mode) {
      return mode.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1),
      ).join(' ');
    },

    getDescription (mode) {
      const descriptions = {
        'gradient-in': 'Characters appear one by one with a gradient highlight reveal effect',
        'fade-in': 'Characters fade in smoothly with opacity transitions',
        'slide-in': 'Characters slide up from below with smooth vertical movement',
        'gradient-sweep': 'Text is static while a gradient sweeps across continuously',
        'shimmer': 'Text is static while a black and white gradient pulses continuously',
        'none': 'All text appears instantly without animation',
      };
      return descriptions[mode] || 'Unknown animation mode';
    },

    isStaticMode (mode) {
      return mode === 'gradient-sweep' || mode === 'shimmer';
    },

    restartAnimation (mode) {
      const ref = this.modeRefs[mode];
      if (ref) {
        ref.reset();
        setTimeout(() => ref.start(), 100);
      }
    },
  },
};
</script>
