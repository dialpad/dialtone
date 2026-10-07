<template>
  <dt-stack
    gap="300"
    class="d-p-300"
  >
    <dt-stack
      v-for="mode in animationModes"
      :key="mode.value"
      gap="100"
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
          :size="200"
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
        class="d-p-300 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-200"
      >
        <!-- Every mode loops, like the Figma prototypes, so they can be compared side by side -->
        <dt-motion-text
          :ref="el => { if (el) modeRefs[mode.value] = el }"
          :text="exampleText"
          :animation-mode="mode.value"
          loop
          class="d-headline--xl"
        />
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
import { DtMotionText, MOTION_TEXT_ANIMATION_MODES } from '@/components/MotionText';
import { DtButton } from '@/components/Button';
import { DtStack } from '@/components/Stack';

const MODE_DESCRIPTIONS = {
  'gradient-in': 'Each word fades in showing its slice of a purple-to-orange gradient, then settles into the text color',
  'fade-in': 'Each word fades in, one after another',
  'slide-in': 'Each word fades in while rising into place',
  'slide-in-gradient': 'Each word rises into place showing its slice of a purple-to-orange gradient, then settles into the text color',
  'gradient-sweep': 'Text stays visible while a purple-to-orange gradient sweeps across it word by word, holds, and fades back',
  shimmer: 'Text stays visible while a dimmed band sweeps left to right across it',
};

export default {
  name: 'DtMotionTextModesStory',
  components: {
    DtMotionText,
    DtButton,
    DtStack,
  },

  data () {
    return {
      modeRefs: {},
      // Reference sentence used by the "Motion-Text-Effects" Figma spec
      exampleText: 'The AI platform for customer experience',
      animationModes: MOTION_TEXT_ANIMATION_MODES.map(mode => ({
        value: mode,
        label: this.formatLabel(mode),
        description: MODE_DESCRIPTIONS[mode] || '',
      })),
    };
  },

  methods: {
    formatLabel (mode) {
      return mode.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1),
      ).join(' ');
    },

    restartAnimation (mode) {
      const ref = this.modeRefs[mode];
      if (ref) {
        ref.reset();
        this.$nextTick(() => ref.start());
      }
    },
  },
};
</script>
