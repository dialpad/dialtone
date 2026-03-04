<script>
/**
 * Circular SVG progress indicator for determinate upload or processing progress.
 * @see https://dialtone.dialpad.com/components/progress-circle.html
 */
import { PROGRESS_CIRCLE_SIZES, PROGRESS_CIRCLE_KINDS } from './progress_circle_constants';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtProgressCircle',
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
     * The size of the progress indicator, aligning to Dialtone icon sizes.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: '500',
      validator: (s) => Object.keys(PROGRESS_CIRCLE_SIZES).includes(s),
    },

    /**
     * The color variant of the progress indicator.
     * @values default, brand, critical, positive, warning, info, ai
     */
    kind: {
      type: String,
      default: 'default',
      validator: (k) => Object.keys(PROGRESS_CIRCLE_KINDS).includes(k),
    },
  },

  data () {
    return {
      circleCircumference: 50,
      strokeWidth: 3.25,
      uid: Math.random().toString(36).substring(2, 9),
    };
  },

  computed: {
    // SVG stroke doesn't support CSS gradients, so the "ai" kind uses an inline
    // SVG <linearGradient> referenced via url(#id) instead of a CSS variable.
    isAi () {
      return this.kind === 'ai';
    },

    // Unique per-instance to avoid collisions when multiple progress circles coexist.
    aiGradientId () {
      return `progress-circle-ai-gradient-${this.uid}`;
    },

    fillStrokeStyle () {
      return this.isAi ? { stroke: `url(#${this.aiGradientId})` } : {};
    },

    sizeClass () {
      return PROGRESS_CIRCLE_SIZES[this.size];
    },

    kindClass () {
      return PROGRESS_CIRCLE_KINDS[this.kind];
    },

    circleRadius () {
      return 12 - (this.strokeWidth / 2);
    },

    // Draws a full circle as two arcs so getTotalLength() returns the circumference.
    circlePath () {
      const r = this.circleRadius;
      const top = 12 - r;
      const bottom = 12 + r;
      return `M 12 ${top} A ${r} ${r} 0 0 1 12 ${bottom} A ${r} ${r} 0 0 1 12 ${top} Z`;
    },

    // stroke-dasharray/offset control how much of the circle is visually "filled".
    cssVars () {
      const C = this.circleCircumference;
      const MIN_VISUAL_PROGRESS = 5;
      const visualProgress = (this.progress > 0 && this.progress < MIN_VISUAL_PROGRESS)
        ? MIN_VISUAL_PROGRESS
        : this.progress;
      const fillLength = C * visualProgress / 100;
      const sw = this.strokeWidth;
      const capArc = sw / 2;

      // When both arcs are visible, round linecaps extend capArc past each endpoint.
      // Shorten each arc by capArc at both ends (total sw per arc) so the caps meet
      // exactly at each junction without overlapping. Rotate the fill forward by
      // capArc so its start cap lands at 12 o'clock.
      const both = this.progress > 0 && this.progress < 100;
      const adj = both ? sw : 0;

      return {
        // Full-circle arcs use 'none' to avoid round-cap overlap at the path seam.
        '--stroke-dasharray': (!both && this.progress >= 100) ? 'none' : C,
        '--fill-dashoffset': C - Math.max(0, fillLength - adj),
        '--fill-rotate': `${both ? (capArc / C * 360) : 0}deg`,
        '--track-dasharray': (!both && this.progress <= 0) ? 'none' : `${Math.max(0, C - fillLength - adj)} ${C}`,
        '--track-dashoffset': -(fillLength + (both ? capArc : 0)),
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
    class="d-progress-circle"
    :class="[sizeClass, kindClass]"
    role="progressbar"
    :aria-label="ariaLabel"
    tabindex="-1"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    data-qa="dt-progress-circle"
  >
    <svg
      class="d-progress-circle__bar"
      :style="cssVars"
      viewBox="0 0 24 24"
    >
      <defs v-if="isAi">
        <linearGradient
          :id="aiGradientId"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <!-- This emulates the AI gradient, for which each color isn't directly mappable to a CSS variable -->
          <stop
            offset="0%"
            stop-color="oklch(0.3328 0.079 261.93)"
          />
          <stop
            offset="3.08%"
            stop-color="oklch(0.3745 0.0869 263.76)"
          />
          <stop
            offset="14.48%"
            stop-color="oklch(0.4561 0.0924 291.07)"
          />
          <stop
            offset="23.67%"
            stop-color="oklch(0.4911 0.1003 307.79)"
          />
          <stop
            offset="35.5%"
            stop-color="oklch(0.5278 0.1347 342.65)"
          />
          <stop
            offset="48.3%"
            stop-color="oklch(0.587 0.1705 357.19)"
          />
          <stop
            offset="60.29%"
            stop-color="oklch(0.6192 0.1989 6.7)"
          />
          <stop
            offset="70.08%"
            stop-color="oklch(0.6541 0.2066 15.56)"
          />
          <stop
            offset="90.02%"
            stop-color="oklch(0.7086 0.1887 25.9)"
          />
          <stop
            offset="97.29%"
            stop-color="oklch(0.7524 0.1596 36.19)"
          />
          <stop
            offset="100%"
            stop-color="oklch(0.7524 0.1596 36.19)"
          />
        </linearGradient>
      </defs>
      <path
        ref="progressCircle"
        :d="circlePath"
        class="d-progress-circle__shape d-progress-circle__shape--track"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :style="{ display: progress > 95 ? 'none' : undefined }"
      />
      <path
        :d="circlePath"
        class="d-progress-circle__shape d-progress-circle__shape--fill"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :style="{ ...fillStrokeStyle, display: progress <= 0 ? 'none' : undefined }"
      />
    </svg>
  </div>
</template>
