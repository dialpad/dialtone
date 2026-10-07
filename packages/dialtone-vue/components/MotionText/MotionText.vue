<template>
  <span
    data-qa="dt-motion-text"
    :class="motionTextClasses"
    :style="componentStyles"
    :aria-live="isAnimating ? 'polite' : 'off'"
    :aria-label="screenReaderText || undefined"
  >
    <!-- Screen reader content -->
    <span
      v-if="screenReaderText"
      data-qa="dt-motion-text-sr-only"
      class="d-motion-text__sr-only"
    >
      {{ screenReaderText }}
    </span>

    <!-- Word-by-word animated content -->
    <span
      v-if="words.length"
      ref="contentRef"
      :key="animationKey"
      data-qa="dt-motion-text-content"
      class="d-motion-text__content"
      :aria-hidden="screenReaderText ? 'true' : undefined"
    >
      <template
        v-for="(word, wordIdx) in words"
        :key="`${animationKey}-${wordIdx}`"
      >
        <span
          data-qa="dt-motion-text-word"
          class="d-motion-text__word"
          :style="wordStyles[wordIdx]"
        >{{ word }}</span>
        <template v-if="wordIdx < words.length - 1">
          {{ ' ' }}
        </template>
      </template>
    </span>

    <!-- Slot content, rendered until its text has been split into words -->
    <span
      v-else
      ref="slotRef"
      class="d-motion-text__fallback"
    >
      <slot />
    </span>
  </span>
</template>


<script>
import {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_DEPRECATED_ANIMATION_MODES,
  MOTION_TEXT_MODE_SETTINGS,
  MOTION_TEXT_SPEEDS,
  MOTION_TEXT_TIMING_PRESETS,
  MOTION_TEXT_TRACKS,
} from './MotionTextConstants';
import { getGradientSlices, splitWords } from './utils';

const DEFAULT_PRESET = MOTION_TEXT_TIMING_PRESETS['300'];
// Unsupported and deprecated modes (such as 'none') render the text at rest
const RESTING_SETTINGS = { tracks: [], gradient: false, loopHold: 0 };

export default {
  name: 'DtMotionText',

  props: {
    /**
     * The text content to animate.
     * @type {string}
     */
    text: {
      type: String,
      default: '',
    },

    /**
     * The animation mode to use for the text reveal. `none` is deprecated and renders the text at rest.
     * @values gradient-in, fade-in, slide-in, slide-in-gradient, gradient-sweep, shimmer
     */
    animationMode: {
      type: String,
      default: 'gradient-in',
      validator: (value) => MOTION_TEXT_ANIMATION_MODES.includes(value) ||
        MOTION_TEXT_DEPRECATED_ANIMATION_MODES.includes(value),
    },

    /**
     * Animation speed. 300 plays the motion spec as designed; lower values are faster.
     * @values 100, 200, 300, 400, 500
     */
    speed: {
      type: [String, Number],
      default: 300,
      validator: (value) => MOTION_TEXT_SPEEDS.includes(String(value)),
    },

    /**
     * Whether to start animation automatically when component is mounted.
     * @values true, false
     */
    autoStart: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether to loop the animation continuously.
     * @values true, false
     */
    loop: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to respect the user's prefers-reduced-motion system setting.
     * @values true, false
     */
    respectsReducedMotion: {
      type: Boolean,
      default: true,
    },

    /**
     * Alternative text for screen readers. If provided, this will be announced
     * instead of the animated text.
     * @type {string}
     */
    screenReaderText: {
      type: String,
      default: '',
    },
  },

  emits: [
    /**
     * Emitted when the animation starts, and at the start of each looped cycle.
     * @event start
     */
    'start',

    /**
     * Emitted when the animation completes, and at the end of each looped cycle.
     * @event complete
     */
    'complete',

    /**
     * Emitted as each word finishes animating.
     * @event progress
     * @type {{ wordsComplete: number, totalWords: number, progress: number }}
     */
    'progress',

    /**
     * Emitted when the animation is paused.
     * @event pause
     */
    'pause',

    /**
     * Emitted when the animation resumes.
     * @event resume
     */
    'resume',
  ],

  data () {
    return {
      words: splitWords(this.text),
      wordWidths: [],
      isRtl: false,
      isAnimating: false,
      isPaused: false,
      isComplete: false,
      isRestarting: false,
      isLooped: false,
      isUnmounted: false,
      animationTimeouts: [],
      timelineStartedAt: 0,
      timelineElapsed: 0,
      prefersReducedMotion: false,
      animationKey: 0,
    };
  },

  computed: {
    modeSettings () {
      return MOTION_TEXT_MODE_SETTINGS[this.animationMode] ?? RESTING_SETTINGS;
    },

    /**
     * Multiplier applied to every motion timing for the current speed.
     */
    speedScale () {
      const preset = MOTION_TEXT_TIMING_PRESETS[String(this.speed)] ?? DEFAULT_PRESET;
      return preset.duration / DEFAULT_PRESET.duration;
    },

    /**
     * Track timings for the current mode as CSS variables, e.g. --d-motion-text-enter-stagger
     */
    componentStyles () {
      const styles = {};
      this.modeSettings.tracks.forEach(track => {
        Object.entries(MOTION_TEXT_TRACKS[track]).forEach(([key, value]) => {
          styles[`--d-motion-text-${track}-${key}`] = `${Math.round(value * this.speedScale)}ms`;
        });
      });
      return styles;
    },

    /**
     * Per-word index (drives the stagger) and, in gradient modes, the slice of the shared gradient
     * each word shows so it reads as one continuous gradient across the text.
     */
    wordStyles () {
      const slices = this.modeSettings.gradient ? getGradientSlices(this.wordWidths, this.isRtl) : [];

      return this.words.map((word, index) => {
        const slice = slices[index];
        return {
          '--d-motion-text-word-index': index,
          ...(slice && {
            '--d-motion-text-gradient-size': slice.size,
            '--d-motion-text-gradient-position': slice.position,
          }),
        };
      });
    },

    /**
     * Time (ms) at which each word finishes its last track
     */
    wordEndTimes () {
      return this.words.map((word, index) => {
        const ends = this.modeSettings.tracks.map(track => {
          const { delay, stagger, duration } = MOTION_TEXT_TRACKS[track];
          return delay + stagger * index + duration;
        });
        return Math.max(0, ...ends) * this.speedScale;
      });
    },

    motionTextClasses () {
      return [
        'd-motion-text',
        `d-motion-text--${this.animationMode}`,
        {
          'd-motion-text--animating': this.isAnimating,
          'd-motion-text--paused': this.isPaused,
          'd-motion-text--complete': this.isComplete,
          'd-motion-text--restarting': this.isRestarting,
          'd-motion-text--looped': this.isLooped,
          'd-motion-text--respects-reduced-motion': this.respectsReducedMotion,
        },
      ];
    },
  },

  watch: {
    text () {
      this.reset();

      if (this.text) {
        this.initializeContent();
        return;
      }

      // Slot content only renders once the words are cleared, so read it on the next tick
      this.words = [];
      this.$nextTick(() => this.initializeContent());
    },

    animationMode () {
      this.restartIfAnimating();
    },

    speed () {
      this.restartIfAnimating();
    },

    loop: {
      handler (newVal) {
        this.isLooped = newVal;

        // Reschedule so the current cycle ends (or restarts) according to the new value
        if (this.isAnimating && !this.isPaused) {
          this.timelineElapsed = Date.now() - this.timelineStartedAt;
          this.clearTimeouts();
          this.runTimeline();
        }
      },

      immediate: true,
    },
  },

  mounted () {
    this.initWatchReducedMotion();
    this.initializeContent();

    // Word widths change once web fonts load, which would misalign the gradient slices
    document.fonts?.ready.then(() => {
      if (!this.isUnmounted && this.isAnimating) this.measureWords();
    });
  },

  beforeUnmount () {
    this.isUnmounted = true;
    this.clearTimeouts();
    this.stopWatchingReducedMotion?.();
  },

  methods: {
    /**
     * Collect the text of slot content, ignoring markup
     */
    getSlotText () {
      return this.$refs.slotRef?.textContent || '';
    },

    /**
     * Track the reduced motion preference, finishing any running animation if it turns on
     */
    initWatchReducedMotion () {
      if (typeof window === 'undefined' || !window.matchMedia) return;

      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = (event) => {
        this.prefersReducedMotion = event.matches;
        if (event.matches && this.respectsReducedMotion && this.isAnimating) this.skipToEnd();
      };

      this.prefersReducedMotion = query.matches;
      query.addEventListener?.('change', onChange);
      this.stopWatchingReducedMotion = () => query.removeEventListener?.('change', onChange);
    },

    /**
     * Measure rendered word widths so each word can show its slice of the gradient.
     * Falls back to character counts when layout is unavailable (e.g. not yet rendered).
     */
    measureWords () {
      if (!this.modeSettings.gradient) return;

      const wordEls = this.$refs.contentRef?.querySelectorAll('.d-motion-text__word') || [];
      const widths = Array.from(wordEls, el => el.getBoundingClientRect().width);

      this.isRtl = window.getComputedStyle(this.$el).direction === 'rtl';
      this.wordWidths = widths.length === this.words.length && widths.every(width => width > 0)
        ? widths
        : this.words.map(word => word.length);
    },

    /**
     * Clear all animation timeouts
     */
    clearTimeouts () {
      this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
      this.animationTimeouts = [];
    },

    schedule (delay, callback) {
      this.animationTimeouts.push(setTimeout(callback, Math.max(0, delay)));
    },

    /**
     * Schedule progress, completion and (when looping) restart events for the remainder
     * of the current cycle. CSS runs the animation itself; this keeps events in step with it.
     */
    runTimeline () {
      const elapsed = this.timelineElapsed;
      const totalWords = this.words.length;
      const cycleEnd = Math.max(0, ...this.wordEndTimes);

      this.timelineStartedAt = Date.now() - elapsed;

      this.wordEndTimes.forEach((end, index) => {
        if (end <= elapsed) return;
        this.schedule(end - elapsed, () => {
          this.$emit('progress', {
            wordsComplete: index + 1,
            totalWords,
            progress: (index + 1) / totalWords,
          });
        });
      });

      if (cycleEnd > elapsed) {
        this.schedule(cycleEnd - elapsed, () => this.completeAnimation());
      }

      if (this.loop) {
        const restartAt = cycleEnd + this.modeSettings.loopHold * this.speedScale;
        this.schedule(restartAt - elapsed, () => this.restartCycle());
      } else if (cycleEnd <= elapsed) {
        // The cycle already ended while looping (e.g. loop turned off during the hold)
        this.finishAnimation();
      }
    },

    /**
     * Start the animation
     * @public
     */
    start () {
      if (this.isAnimating || this.isUnmounted) return;

      this.clearTimeouts();
      this.isAnimating = true;
      this.isPaused = false;
      this.isComplete = false;
      this.$emit('start');

      // Skip animation if reduced motion is preferred and enabled
      if (this.respectsReducedMotion && this.prefersReducedMotion) {
        this.showAllContent();
        return;
      }

      if (!this.modeSettings.tracks.length || !this.words.length) {
        this.showAllContent();
        return;
      }

      this.measureWords();
      this.timelineElapsed = 0;
      this.runTimeline();
    },

    /**
     * Pause the animation
     * @public
     */
    pause () {
      if (!this.isAnimating || this.isPaused) return;

      this.timelineElapsed = Date.now() - this.timelineStartedAt;
      this.clearTimeouts();
      this.isPaused = true;
      this.$emit('pause');
    },

    /**
     * Resume the animation
     * @public
     */
    resume () {
      if (!this.isPaused) return;

      this.isPaused = false;
      this.$emit('resume');
      this.runTimeline();
    },

    /**
     * Reset the animation to initial state
     * @public
     */
    reset () {
      this.clearTimeouts();
      this.isAnimating = false;
      this.isPaused = false;
      this.isComplete = false;
      this.timelineElapsed = 0;
      this.animationKey++;
    },

    /**
     * Skip to the end of the animation
     * @public
     */
    skipToEnd () {
      this.showAllContent();
    },

    /**
     * Show all content immediately in its resting state
     */
    showAllContent () {
      this.finishAnimation();
      this.isPaused = false;
      this.schedule(0, () => this.$emit('complete'));
    },

    finishAnimation () {
      this.clearTimeouts();
      this.isAnimating = false;
      this.isComplete = true;
    },

    restartIfAnimating () {
      if (!this.isAnimating) return;

      this.reset();
      this.$nextTick(() => this.start());
    },

    /**
     * End of a cycle. Looped animations keep animating through the hold before restarting.
     */
    completeAnimation () {
      this.$emit('complete');
      if (!this.loop) this.finishAnimation();
    },

    /**
     * Restart a looped animation: every word returns to its starting state at once.
     * The animations are dropped for one style pass and replayed on the same word nodes, so text
     * selection survives and nothing is re-inserted into the aria-live region.
     */
    restartCycle () {
      if (this.isUnmounted) return;

      this.clearTimeouts();
      this.isRestarting = true;

      this.$nextTick(() => {
        // Flush styles while the animations are removed so they restart from their first frame
        this.$refs.contentRef?.getBoundingClientRect();
        this.isRestarting = false;
        this.measureWords();
        this.timelineElapsed = 0;
        this.$emit('start');
        this.runTimeline();
      });
    },

    /**
     * Initialize content based on text prop or slot content
     */
    initializeContent () {
      this.words = splitWords(this.text || this.getSlotText());
      this.wordWidths = [];

      if (this.autoStart && this.words.length > 0) {
        this.$nextTick(() => this.start());
      }
    },
  },
};
</script>
