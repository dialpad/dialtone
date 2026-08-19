<script>
/**
 * Circular SVG progress indicator for determinate upload or processing progress.
 * @see https://dialtone.dialpad.com/components/progress-circle.html
 */
import { PROGRESS_CIRCLE_SIZES, PROGRESS_CIRCLE_KINDS } from './ProgressCircleConstants';
import { ordinalSizeValidator } from '@/common/validators';

export default {
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
      type: [String, Number],
      default: 500,
      validator: ordinalSizeValidator(PROGRESS_CIRCLE_SIZES),
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

    circleCircumference () {
      return 2 * Math.PI * this.circleRadius;
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
            stop-color="var(--dt-color-brand-gold)"
          />
          <stop
            offset="33%"
            stop-color="var(--dt-color-brand-red)"
          />
          <stop
            offset="66%"
            stop-color="var(--dt-color-brand-magenta)"
          />
          <stop
            offset="100%"
            stop-color="var(--dt-color-brand-purple)"
          />
        </linearGradient>
      </defs>
      <path
        v-if="progress <= 95"
        :d="circlePath"
        class="d-progress-circle__shape d-progress-circle__shape--track"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
      />
      <path
        v-if="progress > 0"
        :d="circlePath"
        class="d-progress-circle__shape d-progress-circle__shape--fill"
        fill="none"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :style="fillStrokeStyle"
      />
    </svg>
  </div>
</template>
