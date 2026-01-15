<template>
  <span
    ref="contentRef"
    :class="motionTextClasses"
    :style="componentStyles"
    :data-text-content="isStaticAnimationMode ? text : undefined"
    :aria-live="isAnimating ? 'polite' : 'off'"
    :aria-label="screenReaderText || undefined"
  >
    <!-- Screen reader content -->
    <span
      v-if="screenReaderText"
      class="dt-recipe-motion-text__sr-only"
    >
      {{ screenReaderText }}
    </span>

    <!-- Gradient-sweep and shimmer modes: Simple static text with gradient animation -->
    <template v-if="isStaticAnimationMode">
      {{ text }}
      <slot v-if="!text" />
    </template>

    <!-- Character-by-character animated content for other modes -->
    <span
      v-else
      :key="animationKey"
      class="dt-recipe-motion-text__content"
      :aria-hidden="isAnimating"
    >
      <template
        v-for="(word, wordIdx) in words"
        :key="`${animationKey}-${wordIdx}`"
      >
        <Transition
          :name="`dt-recipe-motion-text-word-${animationMode}`"
        >
          <span
            v-if="wordIdx < visibleWordCount"
            class="dt-recipe-motion-text__word"
            :data-text-content="word.text"
            :style="{ '--word-index': wordIdx }"
          >
            <template
              v-for="(char, charIdx) in word.chars"
              :key="`${animationKey}-${wordIdx}-${charIdx}`"
            >
              <Transition
                :name="`dt-recipe-motion-text-char-${animationMode}`"
              >
                <span
                  v-if="charIdx < visibleCharsPerWord[wordIdx]"
                  class="dt-recipe-motion-text__char"
                  :style="{
                    '--char-index': charIdx,
                    '--char-delay': `${charIdx * timing.characterDelay}ms`,
                  }"
                >{{ char }}</span>
              </Transition>
            </template>
          </span>
        </Transition>
      </template>
    </span>

    <!-- Fallback slot content -->
    <span
      v-if="!words.length && !text && !isStaticAnimationMode"
      class="dt-recipe-motion-text__fallback"
    >
      <slot />
    </span>
  </span>
</template>

<script>
import { MOTION_TEXT_ANIMATION_MODES, MOTION_TEXT_SPEEDS, MOTION_TEXT_TIMING_PRESETS } from './motion_text_constants';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeMotionText',

  inheritAttrs: false,

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
     * The animation mode to use for the text reveal.
     * @values gradient-in, fade-in, slide-in, gradient-sweep, shimmer, none
     */
    animationMode: {
      type: String,
      default: 'gradient-in',
      validator: (value) => MOTION_TEXT_ANIMATION_MODES.includes(value),
    },

    /**
     * Animation speed using t-shirt sizing.
     * @values sm, md, lg
     */
    speed: {
      type: String,
      default: 'md',
      validator: (value) => MOTION_TEXT_SPEEDS.includes(value),
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
     * Emitted when the animation starts.
     * @event start
     */
    'start',

    /**
     * Emitted when the animation completes.
     * @event complete
     */
    'complete',

    /**
     * Emitted during animation progress.
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
      words: [],
      visibleWordCount: 0,
      visibleCharsPerWord: [],
      isAnimating: false,
      isPaused: false,
      isLooped: false,
      animationTimeouts: [],
      prefersReducedMotion: false,
      animationKey: 0,
    };
  },

  computed: {
    /**
     * Get timing preset based on speed prop
     */
    timing () {
      return MOTION_TEXT_TIMING_PRESETS[this.speed];
    },

    /**
     * Computed styles with timing CSS variables
     */
    componentStyles () {
      return {
        '--dt-recipe-motion-text-duration': `${this.timing.duration}ms`,
        '--dt-recipe-motion-text-char-duration': `${this.timing.duration}ms`,
        '--dt-recipe-motion-text-word-duration': `${this.timing.duration * 2}ms`,
      };
    },

    /**
     * Check if current animation mode is static (gradient-sweep or shimmer)
     */
    isStaticAnimationMode () {
      return this.animationMode === 'gradient-sweep' || this.animationMode === 'shimmer';
    },

    /**
     * Computed classes for the motion text element
     */
    motionTextClasses () {
      return [
        'dt-recipe-motion-text',
        `dt-recipe-motion-text--${this.animationMode}`,
        {
          'dt-recipe-motion-text--animating': this.isAnimating,
          'dt-recipe-motion-text--paused': this.isPaused,
          'dt-recipe-motion-text--looped': this.isLooped,
        },
        this.$attrs.class,
      ];
    },
  },

  watch: {
    text () {
      this.reset();
      this.initializeContent();
    },

    loop: {
      handler (newVal) {
        this.isLooped = newVal;
      },

      immediate: true,
    },
  },

  mounted () {
    this.checkReducedMotion();
    this.initializeContent();
  },

  beforeUnmount () {
    this.clearTimeouts();
  },

  methods: {
    /**
     * Self-contained text processing from DOM nodes
     */
    processTextToChars (node) {
      const words = [];

      const processNode = (node, index = 0) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const matches = node.textContent?.match(/\S+\s*/g) || [];
          words.push(...matches.map((text, i) => ({
            text,
            chars: text.split(''),
            index: index + i,
          })));
          return index + matches.length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          let currentIdx = index;
          Array.from(node.childNodes).forEach(child => {
            currentIdx = processNode(child, currentIdx);
          });
          return currentIdx;
        }
        return index;
      };

      processNode(node);
      return words;
    },

    /**
     * Process direct text prop into word/character data
     */
    processDirectText (text) {
      if (!text) return [];

      const matches = text.match(/\S+\s*/g) || [];
      return matches.map((wordText, i) => ({
        text: wordText,
        chars: wordText.split(''),
        index: i,
      }));
    },

    /**
     * Check for reduced motion preference
     */
    checkReducedMotion () {
      if (typeof window !== 'undefined' && window.matchMedia) {
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
    },

    /**
     * Clear all animation timeouts
     */
    clearTimeouts () {
      this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
      this.animationTimeouts = [];
    },

    /**
     * Start the animation
     * @public
     */
    start () {
      if (this.isAnimating) return;

      this.isAnimating = true;
      this.isPaused = false;
      this.$emit('start');

      // Skip animation if reduced motion is preferred and enabled
      if (this.respectsReducedMotion && this.prefersReducedMotion) {
        this.showAllContent();
        return;
      }

      if (this.animationMode === 'none') {
        this.showAllContent();
        return;
      }

      // For gradient-sweep and shimmer modes, just mark as animating (CSS handles the animation)
      if (this.isStaticAnimationMode) {
        return;
      }

      // Start the word-by-word animation for "-in" modes
      this.showNextWord();
    },

    /**
     * Pause the animation
     * @public
     */
    pause () {
      if (!this.isAnimating || this.isPaused) return;

      this.isPaused = true;
      this.clearTimeouts();
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
      this.showNextWord();
    },

    /**
     * Reset the animation to initial state
     * @public
     */
    reset () {
      this.clearTimeouts();
      this.isAnimating = false;
      this.isPaused = false;
      this.visibleWordCount = 0;
      this.visibleCharsPerWord = Array(this.words.length).fill(0);
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
     * Show all content immediately
     */
    showAllContent () {
      this.visibleWordCount = this.words.length;
      this.visibleCharsPerWord = this.words.map(word => word.chars.length);
      setTimeout(() => {
        this.isAnimating = false;
        this.$emit('complete');
      }, 0);
    },

    /**
     * Show next word in sequence
     */
    showNextWord () {
      if (this.isPaused || this.visibleWordCount >= this.words.length) {
        if (this.visibleWordCount >= this.words.length) {
          this.completeAnimation();
        }
        return;
      }

      const timeout = setTimeout(() => {
        this.visibleWordCount++;
        this.$emit('progress', {
          wordsComplete: this.visibleWordCount,
          totalWords: this.words.length,
          progress: this.visibleWordCount / this.words.length,
        });

        this.animateCharsForWord(this.visibleWordCount - 1);
      }, this.timing.wordDelay);

      this.animationTimeouts.push(timeout);
    },

    /**
     * Animate characters for a specific word
     */
    animateCharsForWord (wordIdx) {
      if (this.isPaused || wordIdx >= this.words.length) return;

      this.visibleCharsPerWord[wordIdx] = 0;
      const chars = this.words[wordIdx].chars.length;

      const revealChar = () => {
        if (this.isPaused || this.visibleCharsPerWord[wordIdx] >= chars) {
          if (this.visibleCharsPerWord[wordIdx] >= chars) {
            this.showNextWord();
          }
          return;
        }

        this.visibleCharsPerWord[wordIdx]++;
        const timeout = setTimeout(revealChar, this.timing.characterDelay);
        this.animationTimeouts.push(timeout);
      };

      revealChar();
    },

    /**
     * Complete the animation
     */
    completeAnimation () {
      this.isAnimating = false;
      this.clearTimeouts();

      this.$emit('complete');

      if (this.loop) {
        const timeout = setTimeout(() => {
          this.reset();
          this.$nextTick(() => {
            this.start();
          });
        }, 500);

        this.animationTimeouts.push(timeout);
      }
    },

    /**
     * Initialize content based on text prop or slot content
     */
    initializeContent () {
      // For gradient-sweep and shimmer modes, skip word/character processing
      if (this.isStaticAnimationMode) {
        if (this.autoStart) {
          this.$nextTick(() => this.start());
        }
        return;
      }

      if (this.text) {
        this.words = this.processDirectText(this.text);
      } else if (this.$refs.contentRef) {
        this.words = this.processTextToChars(this.$refs.contentRef);
      }

      this.visibleCharsPerWord = Array(this.words.length).fill(0);
      this.visibleWordCount = 0;

      if (this.autoStart && this.words.length > 0) {
        this.$nextTick(() => this.start());
      }
    },
  },
};
</script>
