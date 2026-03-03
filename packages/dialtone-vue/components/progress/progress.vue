<script>
/**
 * Circular SVG progress indicator for determinate upload or processing progress.
 * @see https://dialtone.dialpad.com/components/progress.html
 */
import { PROGRESS_SIZES, PROGRESS_SIZE_DEFAULT } from './progress_constants';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtProgress',
  props: {
    /** Accessible label read by screen readers. */
    ariaLabel: { type: String, required: true },
    /** Current progress value (0–100). */
    progress: {
      type: Number,
      default: 0,
      validator: (v) => v >= 0 && v <= 100,
    },

    /**
     * The size of the progress indicator.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: PROGRESS_SIZE_DEFAULT,
      validator: (s) => Object.keys(PROGRESS_SIZES).includes(s),
    },
  },

  data: () => ({ circleCircumference: 50 }),

  computed: {
    sizeClass () {
      return PROGRESS_SIZES[this.size];
    },

    cssVars () {
      return {
        '--stroke-dashoffset': this.circleCircumference - (this.circleCircumference * this.progress / 100),
        '--stroke-dasharray': this.circleCircumference,
      };
    },
  },

  mounted () {
    this.circleCircumference = this.$refs.progressCircle.getTotalLength();
  },
};
</script>

<template>
  <div
    role="progressbar"
    :aria-label="ariaLabel"
    tabindex="-1"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    data-qa="dt-progress"
  >
    <svg
      class="d-progress"
      :class="sizeClass"
      :style="cssVars"
      viewBox="0 0 24 24"
    >
      <circle
        ref="progressCircle"
        r="8"
        cx="12"
        cy="12"
        class="d-progress__circle"
      />
      <circle
        r="8"
        cx="12"
        cy="12"
        class="d-progress__circle"
      />
    </svg>
  </div>
</template>
