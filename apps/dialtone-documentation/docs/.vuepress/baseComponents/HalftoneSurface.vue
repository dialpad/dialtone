<template>
  <div
    ref="surfaceEl"
    class="halftone-surface"
    :class="{ 'halftone-surface--flip-x': flipX }"
  >
    <!--
      Always render the empty host so server markup and the first client render match.
      Paper appends its canvas after mount.
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { gradientHeroFragmentShader, HERO_GEOMETRY } from './gradientHeroShader.js';
import { createGradientHeroCursor, getCursorUniforms } from './gradientHeroCursor.js';
import { createFrameCoalescer } from '../theme/utils/frameCoalescer.js';
import {
  createDotColorLoop,
  observeThemeChanges,
  resolveHalftoneBackground,
  resolveHalftoneDotPalette,
} from './gradientHeroColors.js';

const props = defineProps({
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

// Both match Paper's defaults. A tighter pixel cap renders the canvas below CSS
// resolution and stretches it up, softening the dots and pointer trail.
const MIN_PIXEL_RATIO = 2;
const MAX_PIXEL_COUNT = 1920 * 1080 * 4;
const DOT_COLOR_PERIOD_MS = 14_000;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

let shaderMount = null;
let cursor = null;
let disposeThemeObserver = null;
let intersectionObserver = null;
let reducedMotionQuery = null;
let finePointerQuery = null;
let isDisposed = false;
let isVisible = true;
let pendingUniforms = null;

// Every setUniforms call ends in a synchronous full-canvas draw. Stage concurrent
// colour and cursor updates so they produce at most one additional draw per frame.
const flushUniforms = createFrameCoalescer(() => {
  const patch = pendingUniforms;
  pendingUniforms = null;
  if (patch && shaderMount) shaderMount.setUniforms(patch);
});

const queueUniforms = (patch) => {
  pendingUniforms = pendingUniforms ? Object.assign(pendingUniforms, patch) : { ...patch };
  flushUniforms.schedule();
};

const dotColorLoop = createDotColorLoop({
  periodMs: DOT_COLOR_PERIOD_MS,
  onColor: (channels) => queueUniforms({ u_dotColor: channels }),
});

const prefersReducedMotion = () => Boolean(reducedMotionQuery?.matches);
const prefersFinePointer = () => Boolean(finePointerQuery?.matches);
const currentSpeed = () => (prefersReducedMotion() || !isVisible ? 0 : 1);
const shouldTrackPointer = () => isVisible && prefersFinePointer() && !prefersReducedMotion();
const mirrorCursorX = (state) => {
  if (!props.flipX || !state) return state;

  return {
    ...state,
    x: 1 - state.x,
    prevX: 1 - state.prevX,
    trail: state.trail.map(([x, y, intensity, padding]) => [
      1 - x,
      y,
      intensity,
      padding,
    ]),
  };
};

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
    u_cursorRadiusFrac: settings.cursorRadiusFrac,
    // Paper's shared vertex shader divides by u_scale. This fragment shader reads only
    // gl_FragCoord, but supplying a valid value avoids leaving NaN in the vertex stage.
    u_scale: 1,
    u_bgColor: resolveHalftoneBackground(surface),
    u_dotColor: dotColorLoop.current(),
    ...getCursorUniforms(null, settings.cursorStrength),
  };
};

const refreshColors = (surface) => {
  dotColorLoop.setPalette(resolveHalftoneDotPalette(surface));

  queueUniforms({
    u_bgColor: resolveHalftoneBackground(surface),
    u_dotColor: dotColorLoop.current(),
  });
};

const syncMotionState = () => {
  const speed = currentSpeed();
  shaderMount?.setSpeed(speed);

  if (shouldTrackPointer()) {
    cursor?.start();
  } else {
    cursor?.stop();
  }

  if (speed !== 0) {
    dotColorLoop.start();
  } else {
    dotColorLoop.stop();
  }
};

const canMountShader = (host) => {
  if (!host || host.clientWidth === 0 || host.clientHeight === 0) return false;

  // Paper stamps the host on construction. A second mount would leak the first context.
  return !('paperShaderMount' in host);
};

const attachControllers = (surface) => {
  cursor = createGradientHeroCursor({
    element: surface,
    rectElement: shaderHostEl.value,
    onChange: (state) => {
      queueUniforms(getCursorUniforms(
        mirrorCursorX(state),
        geometry.value.cursorStrength,
      ));
    },
  });

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

const initShader = async () => {
  const host = shaderHostEl.value;
  const surface = surfaceEl.value;

  if (!surface || !canMountShader(host)) return;

  const { ShaderMount } = await import('@paper-design/shaders');

  if (isDisposed || shaderHostEl.value !== host) return;

  dotColorLoop.setPalette(resolveHalftoneDotPalette(surface));

  shaderMount = new ShaderMount(
    host,
    gradientHeroFragmentShader,
    buildUniforms(surface),
    undefined,
    currentSpeed(),
    0,
    MIN_PIXEL_RATIO,
    MAX_PIXEL_COUNT,
  );

  attachControllers(surface);
  syncMotionState();
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    reducedMotionQuery.addEventListener('change', syncMotionState);
    finePointerQuery = window.matchMedia(FINE_POINTER_QUERY);
    finePointerQuery.addEventListener('change', syncMotionState);
  }

  initShader().catch((error) => {
    console.warn('[HalftoneSurface] Canvas unavailable; using the flat background.', error);
  });
});

onBeforeUnmount(() => {
  isDisposed = true;

  intersectionObserver?.disconnect();
  intersectionObserver = null;

  disposeThemeObserver?.();
  disposeThemeObserver = null;

  reducedMotionQuery?.removeEventListener('change', syncMotionState);
  reducedMotionQuery = null;
  finePointerQuery?.removeEventListener('change', syncMotionState);
  finePointerQuery = null;

  flushUniforms.cancel();
  pendingUniforms = null;

  dotColorLoop.dispose();

  cursor?.dispose();
  cursor = null;

  shaderMount?.dispose();
  shaderMount = null;
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
}

.halftone-surface__shader {
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

  canvas {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }
}

.halftone-surface--flip-x {
  --halftone-scale-x: -1;
}
</style>
