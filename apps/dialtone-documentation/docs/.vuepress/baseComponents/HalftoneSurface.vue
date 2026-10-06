<template>
  <div
    ref="surfaceEl"
    class="halftone-surface"
    :class="{ 'halftone-surface--flip-x': flipX }"
  >
    <!--
      Always render the empty host so server markup and the first client render match.
      The point renderer appends its canvas after mount.
    -->
    <div
      ref="shaderHostEl"
      class="halftone-surface__shader"
      aria-hidden="true"
    />
    <slot />
  </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { HalftonePointRenderer, HERO_GEOMETRY } from './halftonePointRenderer.js';
import {
  createDotColorLoop,
  observeThemeChanges,
  resolveHalftoneBackground,
  resolveHalftoneDotPalette,
} from './gradientHeroColors.js';

const props = defineProps({
  animated: {
    type: Boolean,
    default: true,
  },
  flipX: {
    type: Boolean,
    default: false,
  },
  geometry: {
    type: Object,
    default: () => ({}),
  },
});

const surfaceEl = ref(null);
const shaderHostEl = ref(null);
const geometry = computed(() => ({ ...HERO_GEOMETRY, ...props.geometry }));
const isHalftonePaused = inject('halftonePaused', ref(false));

// Render at least 2x for crisp dots, but cap unusually large displays to bound memory.
const MIN_PIXEL_RATIO = 2;
const MAX_PIXEL_COUNT = 1920 * 1080 * 4;
const DOT_COLOR_PERIOD_MS = 14_000;
const TOUCH_SCROLL_IDLE_MS = 100;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

let pointRenderer = null;
let disposeThemeObserver = null;
let intersectionObserver = null;
let reducedMotionQuery = null;
let finePointerQuery = null;
let isVisible = true;
let isTouchActive = false;
let isTouchScrolling = false;
let touchScrollIdleTimer = null;

const dotColorLoop = createDotColorLoop({
  periodMs: DOT_COLOR_PERIOD_MS,
  onColor: (channels) => pointRenderer?.setUniforms({ u_dotColor: channels }),
});

const prefersReducedMotion = () => Boolean(reducedMotionQuery?.matches);
const prefersFinePointer = () => Boolean(finePointerQuery?.matches);
const currentSpeed = () => (
  !props.animated ||
  prefersReducedMotion() ||
  !isVisible ||
  isTouchActive ||
  isTouchScrolling ||
  isHalftonePaused.value
    ? 0
    : 1
);

const buildUniforms = (surface) => {
  const settings = geometry.value;

  return {
    u_dotSpacingCss: settings.dotSpacingCss,
    u_maxDotSizeCss: settings.maxDotSizeCss,
    u_center: [...settings.center],
    u_sizeVariation: settings.sizeVariation,
    u_burstRadiusFrac: settings.burstRadiusFrac,
    u_burstScale: settings.burstScale,
    u_coreScale: settings.coreScale,
    u_breatheAmount: settings.breatheAmount,
    u_breathePeriod: settings.breathePeriod,
    u_edgeFadeAmount: settings.edgeFadeAmount,
    u_floorLuminance: settings.floorLuminance,
    u_fieldMix: settings.fieldMix,
    u_meshPeriod: settings.meshPeriod,
    u_meshDark1: [...settings.meshDarkPoles[0]],
    u_meshDark2: [...settings.meshDarkPoles[1]],
    u_meshLight1: [...settings.meshLightPoles[0]],
    u_meshLight2: [...settings.meshLightPoles[1]],
    u_meshPointSize: settings.meshPointSize,
    u_meshSmoothness: settings.meshSmoothness,
    u_bgColor: resolveHalftoneBackground(surface),
    u_dotColor: dotColorLoop.current(),
  };
};

const refreshColors = (surface) => {
  dotColorLoop.setPalette(resolveHalftoneDotPalette(surface));

  pointRenderer?.setUniforms({
    u_bgColor: resolveHalftoneBackground(surface),
    u_dotColor: dotColorLoop.current(),
  });
};

const syncMotionState = () => {
  if (!pointRenderer) return;

  const speed = currentSpeed();
  // Both animation clocks retain their accumulated phase while stopped, so resuming continues
  // from the parked frame instead of jumping forward by the elapsed wall-clock time.
  pointRenderer.setSpeed(speed);

  if (speed !== 0) {
    dotColorLoop.start();
  } else {
    dotColorLoop.stop();
  }
};

const handleTouchScroll = () => {
  if (prefersFinePointer()) return;

  if (!isTouchScrolling) {
    isTouchScrolling = true;
    syncMotionState();
  }

  window.clearTimeout(touchScrollIdleTimer);
  touchScrollIdleTimer = window.setTimeout(() => {
    touchScrollIdleTimer = null;
    isTouchScrolling = false;
    syncMotionState();
  }, TOUCH_SCROLL_IDLE_MS);
};

const handleTouchStart = () => {
  if (prefersFinePointer() || isTouchActive) return;

  isTouchActive = true;
  syncMotionState();
};

const handleTouchEnd = (event) => {
  if (event.touches.length > 0 || !isTouchActive) return;

  isTouchActive = false;
  if (!isTouchScrolling) syncMotionState();
};

const canMountShader = (host) => {
  if (!host || host.clientWidth === 0 || host.clientHeight === 0) return false;

  return host.childElementCount === 0;
};

const attachObservers = (surface) => {
  disposeThemeObserver = observeThemeChanges(() => {
    refreshColors(surface);
    syncMotionState();
  });

  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncMotionState();
    });
    intersectionObserver.observe(surface);
  }
};

watch([isHalftonePaused, () => props.animated], syncMotionState);

const initRenderer = () => {
  const host = shaderHostEl.value;
  const surface = surfaceEl.value;

  if (!surface || !canMountShader(host)) return;

  dotColorLoop.setPalette(resolveHalftoneDotPalette(surface));

  pointRenderer = new HalftonePointRenderer(
    host,
    buildUniforms(surface),
    {
      speed: currentSpeed(),
      minPixelRatio: MIN_PIXEL_RATIO,
      maxPixelCount: MAX_PIXEL_COUNT,
    },
  );
  pointRenderer.canvasElement.classList.add('halftone-surface__canvas');

  attachObservers(surface);
  syncMotionState();
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    reducedMotionQuery.addEventListener('change', syncMotionState);
    finePointerQuery = window.matchMedia(FINE_POINTER_QUERY);
    window.addEventListener('scroll', handleTouchScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  }

  try {
    initRenderer();
  } catch (error) {
    console.warn('[HalftoneSurface] Canvas unavailable; using the flat background.', error);
  }
});

onBeforeUnmount(() => {
  intersectionObserver?.disconnect();
  intersectionObserver = null;

  disposeThemeObserver?.();
  disposeThemeObserver = null;

  reducedMotionQuery?.removeEventListener('change', syncMotionState);
  reducedMotionQuery = null;
  finePointerQuery = null;

  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleTouchScroll);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchcancel', handleTouchEnd);
    window.clearTimeout(touchScrollIdleTimer);
  }

  dotColorLoop.dispose();

  pointRenderer?.dispose();
  pointRenderer = null;
});
</script>

<style lang="less">
.halftone-surface {
  --halftone-color-background: var(--dt-color-surface-primary);
  --halftone-color-dot-1: var(--dt-color-purple-300);
  --halftone-color-dot-2: var(--dt-color-black-300);
  --halftone-color-dot-3: var(--dt-color-magenta-300);
  --halftone-color-dot-4: var(--dt-color-red-200);

  position: relative;
  isolation: isolate;
  overflow: clip;
  background-color: var(--halftone-color-background);

  &--flip-x {
    --halftone-scale-x: -1;
  }

  &__shader {
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: 0;
    pointer-events: none;
    block-size: calc(100% + var(--halftone-parallax-overflow, 0%));
    transform:
      translate3d(0, var(--halftone-translate-y, 0px), 0)
      scaleX(var(--halftone-scale-x, 1));
    will-change: transform;
  }

  &__canvas {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }
}
</style>
