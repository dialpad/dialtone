<template>
  <dt-stack
    gap="600"
    class="d-p24"
  >
    <!-- Speed Variants -->
    <section>
      <h2 class="d-headline--lg d-mb16">
        Speed Variants
      </h2>
      <dt-stack
        gap="500"
      >
        <dt-stack
          v-for="speed in speeds"
          :key="speed.value"
          gap="400"
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
              size="sm"
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
            class="d-p16 d-bar8 d-ba d-bc-subtle d-bgc-secondary d-hmn96"
          >
            <dt-recipe-motion-text
              :ref="el => { if (el) speedRefs[speed.value] = el }"
              text="Quick brown fox jumps"
              animation-mode="gradient-in"
              :speed="speed.value"
              :auto-start="false"
              class="d-body--lg"
            />
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </section>

    <!-- Text Size Variants -->
    <section>
      <h2 class="d-headline--lg d-mb16">
        Text Size Variants
      </h2>
      <dt-stack
        gap="500"
      >
        <dt-stack
          v-for="size in textSizes"
          :key="size.class"
          gap="400"
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
              size="sm"
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
            class="d-p16 d-bar8 d-ba d-bc-subtle d-bgc-secondary d-hmn96"
          >
            <dt-recipe-motion-text
              :ref="el => { if (el) sizeRefs[size.class] = el }"
              text="Animated text"
              animation-mode="fade-in"
              speed="md"
              :auto-start="false"
              :class="size.class"
            />
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </section>

    <!-- Looping Animation -->
    <section>
      <h2 class="d-headline--lg d-mb16">
        Looping Animation
      </h2>
      <dt-stack
        direction="row"
        align="center"
        class="d-p24 d-bar8 d-ba d-bc-subtle d-bgc-secondary d-hmn128"
      >
        <dt-recipe-motion-text
          text="This text loops continuously"
          animation-mode="slide-in"
          speed="sm"
          :auto-start="true"
          :loop="true"
          class="d-headline--md"
        />
      </dt-stack>
    </section>

    <!-- Manual Controls -->
    <section>
      <h2 class="d-headline--lg d-mb16">
        Manual Controls
      </h2>
      <dt-stack
        gap="500"
      >
        <dt-stack
          direction="row"
          gap="400"
          class="d-fw-wrap"
        >
          <dt-button
            size="sm"
            importance="outlined"
            @click="manualRef?.start()"
          >
            Start
          </dt-button>
          <dt-button
            size="sm"
            importance="outlined"
            @click="manualRef?.pause()"
          >
            Pause
          </dt-button>
          <dt-button
            size="sm"
            importance="outlined"
            @click="manualRef?.resume()"
          >
            Resume
          </dt-button>
          <dt-button
            size="sm"
            importance="outlined"
            @click="manualRef?.reset()"
          >
            Reset
          </dt-button>
          <dt-button
            size="sm"
            importance="outlined"
            @click="manualRef?.skipToEnd()"
          >
            Skip to End
          </dt-button>
        </dt-stack>
        <dt-stack
          direction="row"
          align="center"
          class="d-p24 d-bar8 d-ba d-bc-subtle d-bgc-secondary d-hmn128"
        >
          <dt-recipe-motion-text
            ref="manualRef"
            text="Control me with the buttons above"
            animation-mode="gradient-in"
            speed="lg"
            :auto-start="false"
            class="d-headline--md"
          />
        </dt-stack>
      </dt-stack>
    </section>
  </dt-stack>
</template>

<script>
import { DtRecipeMotionText, MOTION_TEXT_SPEEDS } from '@/recipes/motion/motion_text';
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeMotionTextVariantsStory',
  components: {
    DtRecipeMotionText,
    DtButton,
    DtStack,
  },

  data () {
    return {
      speedRefs: {},
      sizeRefs: {},
      manualRef: null,
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
    };
  },

  mounted () {
    // Start all animations on mount
    Object.values(this.speedRefs).forEach(ref => {
      if (ref) {
        setTimeout(() => ref.start(), 100);
      }
    });
    Object.values(this.sizeRefs).forEach(ref => {
      if (ref) {
        setTimeout(() => ref.start(), 100);
      }
    });
  },

  methods: {
    getSpeedLabel (speed) {
      const labels = {
        sm: 'Small (Fast)',
        md: 'Medium',
        lg: 'Large (Slow)',
      };
      return labels[speed] || speed;
    },

    restartAnimation (type, key) {
      const refs = type === 'speed' ? this.speedRefs : this.sizeRefs;
      const ref = refs[key];
      if (ref) {
        ref.reset();
        setTimeout(() => ref.start(), 100);
      }
    },
  },
};
</script>
