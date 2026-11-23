<template>
  <span
    :class="viewportClasses"
    :style="viewportStyles"
  >
    <span
      ref="content"
      class="d-text__slide-content"
    >
      <slot />
      <!-- loop only: filled with a static clone of the text while it moves -->
      <span
        v-if="copy"
        ref="copy"
        aria-hidden="true"
        inert
        class="d-text__slide-copy"
      />
    </span>
  </span>
</template>

<script>
import {
  bindSlide,
  getSlideDuration,
  listenForEscape,
  prefersReducedMotion,
  readSlideConfig,
  watchSlideChanges,
  LOOP_HOLD,
  MAX_LOOPS,
} from './slide';

// Internal to DtText: rendered only when `slide` is on, so plain text carries no slide state.
// The outer span clips and fades the text; only the inner span moves, with transform.
export default {
  name: 'DtTextSlideViewport',

  props: {
    // 'once' or 'loop'
    mode: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // rest | waiting | moving | at-end | at-start
      phase: 'rest',
      offset: 0,
      duration: 0,
      copy: false,
      loopWrap: false,
    };
  },

  computed: {
    viewportClasses() {
      return ['d-text__slide', {
        'd-text__slide--moving': this.phase === 'moving',
        'd-text__slide--end': this.phase === 'at-end',
        'd-text__slide--loop': this.phase === 'moving' && this.copy,
        'd-text__slide--loop-wrap': this.loopWrap,
      }];
    },

    viewportStyles() {
      return this.phase === 'rest'
        ? undefined
        : { '--_slide-offset': `${this.offset}px`, '--_slide-duration': `${this.duration}ms` };
    },
  },

  watch: {
    // a sequence started in the old mode can end on the loop copy: start again from rest
    async mode() {
      if (!this.runtime.stopActive.length) {
        return;
      }
      this.reset();
      // measure once the loop copy has left the DOM
      await this.$nextTick();
      if (this.runtime.stopActive.length) {
        this.enter();
      }
    },
  },

  created() {
    // non-reactive bookkeeping
    this.runtime = { unbind: null, stopActive: [], timers: [], distance: 0, restWidth: 0, loops: 0 };
  },

  mounted() {
    this.bind();
  },

  beforeUnmount() {
    this.unbind();
  },

  // inside KeepAlive the host can vanish without a pointerleave or focusout
  activated() {
    this.bind();
  },

  deactivated() {
    this.unbind();
  },

  methods: {
    bind() {
      this.unbind();
      this.runtime.unbind = bindSlide({
        // the DtText root: the host is the item around it, or the text itself
        el: this.$el.parentElement,
        moveEl: this.$refs.content,
        onEnter: this.activate,
        onLeave: this.deactivate,
        onTransitionEnd: this.moveDone,
      });
    },

    unbind() {
      this.runtime.unbind?.();
      this.runtime.unbind = null;
      this.deactivate();
    },

    // the item is hovered or keyboard-focused: watch for Escape and for changes until it is left
    activate() {
      this.runtime.stopActive = [
        listenForEscape(this.$el, this.deactivate),
        // a new label width or more room: start again from rest with fresh widths
        watchSlideChanges(this.$el, this.$refs.content, () => {
          this.reset();
          this.enter();
        }),
      ];
      this.enter();
    },

    // left, Escape or unmounted: stop watching and snap back
    deactivate() {
      this.runtime.stopActive.forEach((stop) => stop());
      this.runtime.stopActive = [];
      this.reset();
    },

    after(ms, fn) {
      this.runtime.timers.push(setTimeout(fn, ms));
    },

    clearTimers() {
      this.runtime.timers.forEach(clearTimeout);
      this.runtime.timers = [];
    },

    // snap to rest, no reverse animation
    reset(phase = 'rest') {
      this.clearTimers();
      this.phase = phase;
      this.offset = 0;
      this.duration = 0;
      this.copy = false;
      this.loopWrap = false;
    },

    // measures the label before each cycle (it may change during a hold); false when it fits
    measure() {
      const el = this.$refs.content;
      this.runtime.distance = el.scrollWidth - el.clientWidth;
      this.runtime.restWidth = el.scrollWidth;
      return this.runtime.distance > 0;
    },

    enter() {
      if (this.phase !== 'rest' || !this.measure()) {
        return;
      }

      this.runtime.loops = 0;
      this.phase = 'waiting';
      this.after(readSlideConfig(this.$el).delay, this.start);
    },

    start() {
      if (prefersReducedMotion()) {
        this.phase = 'at-end';
        this.offset = this.runtime.distance;
      } else if (this.mode === 'loop') {
        this.loop();
      } else {
        this.move(this.runtime.distance);
      }
    },

    move(offset) {
      const duration = getSlideDuration(Math.abs(offset - this.offset), readSlideConfig(this.$el).speed, this.mode);
      this.clearTimers();
      this.phase = 'moving';
      this.offset = offset;
      this.duration = duration;
      // in case transitionend does not fire
      this.after(duration + 100, this.moveDone);
      return duration;
    },

    async loop() {
      if (!this.measure()) {
        return;
      }
      // the copy has to be in the DOM to measure the full wrap-around distance
      this.copy = true;
      await this.$nextTick();
      if (!this.copy) {
        return;
      }
      const { content, copy } = this.$refs;
      // a static clone: slot components do not mount twice, and no ids, form values or tab stops repeat
      const original = [...content.childNodes].filter((node) => node !== copy);
      copy.replaceChildren(...original.map((node) => node.cloneNode(true)));
      copy.querySelectorAll('[id], [name]').forEach((node) => {
        node.removeAttribute('id');
        node.removeAttribute('name');
      });
      const { restWidth } = this.runtime;
      const distance = content.scrollWidth - restWidth;
      const duration = this.move(distance);
      this.runtime.loops += 1;
      // the start edge fades while the text slides out, then clears once the gap is
      // half past it, before the copy arrives (the scroll is linear, so time = distance)
      const gap = parseFloat(getComputedStyle(copy).paddingInlineStart) || 0;
      this.after(duration * (restWidth + gap / 2) / distance, () => { this.loopWrap = true; });
    },

    moveDone() {
      if (this.phase !== 'moving') {
        return;
      }
      if (this.mode !== 'loop') {
        this.clearTimers();
        this.phase = 'at-end';
        return;
      }
      // the copy now sits exactly where the text began, so snap back unseen; stop after MAX_LOOPS
      this.reset('at-start');
      if (this.runtime.loops < MAX_LOOPS) {
        this.after(LOOP_HOLD, this.loop);
      }
    },
  },
};
</script>
