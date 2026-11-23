<template>
  <span
    ref="viewportEl"
    :class="viewportClasses"
    :style="viewportStyles"
  >
    <span
      ref="contentEl"
      class="d-text__slide-content"
    >
      <slot />
      <!-- loop only: filled with a static clone of the text while it moves -->
      <span
        v-if="hasCopy"
        ref="copyEl"
        aria-hidden="true"
        inert
        class="d-text__slide-copy"
      />
    </span>
  </span>
</template>

<script setup lang="ts">
// @ts-nocheck
import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  watch,
} from 'vue';
import { TEXT_SLIDE_MODES } from '../TextConstants';
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

/** @typedef {'rest' | 'waiting' | 'moving' | 'at-end' | 'at-start'} SlidePhase */

// Internal to DtText: rendered only when `slide` is on, so plain text carries no slide state.
// The outer span clips and fades the text; only the inner span moves, with transform.
defineOptions({ name: 'DtTextSlideViewport' });

const props = defineProps({
  // 'once' or 'loop'
  mode: {
    type: String,
    required: true,
    validator: (value) => TEXT_SLIDE_MODES.includes(value),
  },
});

const viewportEl = ref(null);
const contentEl = ref(null);
const copyEl = ref(null);

/** @type {import('vue').Ref<SlidePhase>} */
const phase = ref('rest');
const offset = ref(0);
const duration = ref(0);
const hasCopy = ref(false);
const loopWrap = ref(false);

/**
 * Non-reactive bookkeeping.
 * @type {{ unbind: (() => void) | null, stopActive: Array<() => void>, timers: number[],
 *   distance: number, restWidth: number, loops: number }}
 */
const runtime = { unbind: null, stopActive: [], timers: [], distance: 0, restWidth: 0, loops: 0 };

const viewportClasses = computed(() => ['d-text__slide', {
  'd-text__slide--moving': phase.value === 'moving',
  'd-text__slide--end': phase.value === 'at-end',
  'd-text__slide--loop': phase.value === 'moving' && hasCopy.value,
  'd-text__slide--loop-wrap': loopWrap.value,
}]);

const viewportStyles = computed(() => (phase.value === 'rest'
  ? undefined
  : { '--_slide-offset': `${offset.value}px`, '--_slide-duration': `${duration.value}ms` }));

const viewport = () => viewportEl.value;
const content = () => contentEl.value;

function bind () {
  unbind();
  runtime.unbind = bindSlide({
    // the DtText root: the host is the item around it, or the text itself
    el: viewport().parentElement,
    moveEl: content(),
    onEnter: activate,
    onLeave: deactivate,
    onTransitionEnd: moveDone,
  });
}

function unbind () {
  runtime.unbind?.();
  runtime.unbind = null;
  deactivate();
}

// the item is hovered or keyboard-focused: watch for Escape and for changes until it is left
function activate () {
  runtime.stopActive = [
    listenForEscape(viewport(), deactivate),
    // a new label width or more room: start again from rest with fresh widths
    watchSlideChanges(viewport(), content(), () => {
      reset();
      enter();
    }),
  ];
  enter();
}

// left, Escape or unmounted: stop watching and snap back
function deactivate () {
  runtime.stopActive.forEach((stop) => stop());
  runtime.stopActive = [];
  reset();
}

function after (ms, fn) {
  runtime.timers.push(setTimeout(fn, ms));
}

function clearTimers () {
  runtime.timers.forEach(clearTimeout);
  runtime.timers = [];
}

// snap to rest, no reverse animation
/** @param {SlidePhase} next */
function reset (next = 'rest') {
  clearTimers();
  phase.value = next;
  offset.value = 0;
  duration.value = 0;
  hasCopy.value = false;
  loopWrap.value = false;
}

// measures the label before each cycle (it may change during a hold); false when it fits
function measure () {
  const el = content();
  runtime.distance = el.scrollWidth - el.clientWidth;
  runtime.restWidth = el.scrollWidth;
  return runtime.distance > 0;
}

function enter () {
  if (phase.value !== 'rest' || !measure()) {
    return;
  }

  runtime.loops = 0;
  phase.value = 'waiting';
  after(readSlideConfig(viewport()).delay, start);
}

function start () {
  if (prefersReducedMotion()) {
    phase.value = 'at-end';
    offset.value = runtime.distance;
  } else if (props.mode === 'loop') {
    loop();
  } else {
    move(runtime.distance);
  }
}

function move (to) {
  const time = getSlideDuration(Math.abs(to - offset.value), readSlideConfig(viewport()).speed, props.mode);
  clearTimers();
  phase.value = 'moving';
  offset.value = to;
  duration.value = time;
  // in case transitionend does not fire
  after(time + 100, moveDone);
  return time;
}

async function loop () {
  if (!measure()) {
    return;
  }
  // the copy has to be in the DOM to measure the full wrap-around distance
  hasCopy.value = true;
  await nextTick();
  const el = content();
  const copy = copyEl.value;
  if (!hasCopy.value || !copy) {
    return;
  }
  // a static clone: slot components do not mount twice, and no ids, form values or tab stops repeat
  const original = [...el.childNodes].filter((node) => node !== copy);
  copy.replaceChildren(...original.map((node) => node.cloneNode(true)));
  copy.querySelectorAll('[id], [name]').forEach((node) => {
    node.removeAttribute('id');
    node.removeAttribute('name');
  });
  const { restWidth } = runtime;
  const distance = el.scrollWidth - restWidth;
  const time = move(distance);
  runtime.loops += 1;
  // the start edge fades while the text slides out, then clears once the gap is
  // half past it, before the copy arrives (the scroll is linear, so time = distance)
  const gap = parseFloat(getComputedStyle(copy).paddingInlineStart) || 0;
  after(time * (restWidth + gap / 2) / distance, () => { loopWrap.value = true; });
}

function moveDone () {
  if (phase.value !== 'moving') {
    return;
  }
  if (props.mode !== 'loop') {
    clearTimers();
    phase.value = 'at-end';
    return;
  }
  // the copy now sits exactly where the text began, so snap back unseen; stop after MAX_LOOPS
  reset('at-start');
  if (runtime.loops < MAX_LOOPS) {
    after(LOOP_HOLD, loop);
  }
}

// a sequence started in the old mode can end on the loop copy: start again from rest
watch(() => props.mode, async () => {
  if (!runtime.stopActive.length) {
    return;
  }
  reset();
  // measure once the loop copy has left the DOM
  await nextTick();
  if (runtime.stopActive.length) {
    enter();
  }
});

onMounted(bind);
onBeforeUnmount(unbind);
// inside KeepAlive the host can vanish without a pointerleave or focusout
onActivated(bind);
onDeactivated(unbind);
</script>
