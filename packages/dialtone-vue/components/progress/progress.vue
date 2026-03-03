<script>
/**
 * Circular SVG progress indicator for determinate upload or processing progress.
 * @see https://dialtone.dialpad.com/components/progress.html
 */
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
  },

  data: () => ({ circleCircumference: 50 }),
  computed: {
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
      :style="cssVars"
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
