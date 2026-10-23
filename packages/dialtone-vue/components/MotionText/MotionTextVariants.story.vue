<template>
  <dt-stack
    gap="400"
    class="d-p-300"
  >
    <!-- Speed Variants -->
    <section>
      <h2 class="d-headline--lg d-mbe-200">
        Speed Variants
      </h2>
      <dt-stack
        gap="200"
      >
        <dt-stack
          v-for="speed in speeds"
          :key="speed.value"
          gap="100"
        >
          <dt-stack
            direction="row"
            align="center"
            justify="between"
          >
            <h3 class="d-headline--md">
              {{ speed.label }} ({{ speed.value }})
            </h3>
            <dt-button
              :size="200"
              importance="outlined"
              kind="muted"
              @click="restartAnimation('speed', speed.value)"
            >
              Restart
            </dt-button>
          </dt-stack>
          <dt-stack
            direction="row"
            align="center"
            class="d-p-200 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-150"
          >
            <dt-motion-text
              :ref="el => { if (el) speedRefs[speed.value] = el }"
              text="Quick brown fox jumps"
              animation-mode="gradient-in"
              :speed="speed.value"
              class="d-body--lg"
            />
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </section>

    <!-- Text Size Variants -->
    <section>
      <h2 class="d-headline--lg d-mbe-200">
        Text Size Variants
      </h2>
      <dt-stack
        gap="200"
      >
        <dt-stack
          v-for="size in textSizes"
          :key="size.class"
          gap="100"
        >
          <dt-stack
            direction="row"
            align="center"
            justify="between"
          >
            <h3 class="d-headline--md">
              {{ size.label }}
            </h3>
            <dt-button
              :size="200"
              importance="outlined"
              kind="muted"
              @click="restartAnimation('size', size.class)"
            >
              Restart
            </dt-button>
          </dt-stack>
          <dt-stack
            direction="row"
            align="center"
            class="d-p-200 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-150"
          >
            <dt-motion-text
              :ref="el => { if (el) sizeRefs[size.class] = el }"
              text="Animated text"
              animation-mode="slide-in-gradient"
              :class="size.class"
            />
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </section>

    <!-- Looping Animation -->
    <section>
      <h2 class="d-headline--lg d-mbe-200">
        Looping Animation
      </h2>
      <dt-stack
        direction="row"
        align="center"
        class="d-p-300 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-200"
      >
        <dt-motion-text
          text="This text loops continuously"
          animation-mode="slide-in"
          :loop="true"
          class="d-headline--md"
        />
      </dt-stack>
    </section>

    <!-- Manual Controls -->
    <section>
      <h2 class="d-headline--lg d-mbe-200">
        Manual Controls
      </h2>
      <dt-stack
        gap="200"
      >
        <dt-stack
          direction="row"
          gap="100"
          class="d-fw-wrap"
        >
          <dt-button
            v-for="control in manualControls"
            :key="control.method"
            :size="200"
            importance="outlined"
            @click="runManualControl(control.method)"
          >
            {{ control.label }}
          </dt-button>
        </dt-stack>
        <dt-stack
          direction="row"
          align="center"
          class="d-p-300 d-bar-400 d-ba d-bc-subtle d-bgc-secondary d-hmn-200"
        >
          <dt-motion-text
            ref="manualRef"
            text="Control me with the buttons above"
            animation-mode="gradient-in"
            :speed="400"
            :auto-start="false"
            class="d-headline--md"
          />
        </dt-stack>
      </dt-stack>
    </section>
  </dt-stack>
</template>

<script>
import { DtMotionText, MOTION_TEXT_SPEEDS } from '@/components/MotionText';
import { DtButton } from '@/components/Button';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtMotionTextVariantsStory',
  components: {
    DtMotionText,
    DtButton,
    DtStack,
  },

  data () {
    return {
      speedRefs: {},
      sizeRefs: {},
      speeds: MOTION_TEXT_SPEEDS.map(speed => ({
        value: speed,
        label: this.getSpeedLabel(speed),
      })),

      textSizes: [
        { class: 'd-headline--xxl', label: 'Headline XXL' },
        { class: 'd-headline--xl', label: 'Headline XL' },
        { class: 'd-headline--lg', label: 'Headline Large' },
        { class: 'd-headline--md', label: 'Headline Medium' },
        { class: 'd-body--lg', label: 'Body Large' },
        { class: 'd-body--md', label: 'Body Medium' },
        { class: 'd-body--sm', label: 'Body Small' },
      ],

      manualControls: [
        { method: 'start', label: 'Start' },
        { method: 'pause', label: 'Pause' },
        { method: 'resume', label: 'Resume' },
        { method: 'reset', label: 'Reset' },
        { method: 'skipToEnd', label: 'Skip to End' },
      ],
    };
  },

  methods: {
    getSpeedLabel (speed) {
      const labels = {
        100: 'Fastest',
        200: 'Fast',
        300: 'Default',
        400: 'Slow',
        500: 'Slowest',
      };
      return labels[speed] || speed;
    },

    restartAnimation (type, key) {
      const refs = type === 'speed' ? this.speedRefs : this.sizeRefs;
      const ref = refs[key];
      if (ref) {
        ref.reset();
        this.$nextTick(() => ref.start());
      }
    },

    runManualControl (method) {
      this.$refs.manualRef?.[method]();
    },
  },
};
</script>
