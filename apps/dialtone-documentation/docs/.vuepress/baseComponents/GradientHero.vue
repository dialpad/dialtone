<template>
  <div
    ref="heroEl"
    class="home-gradient-hero"
    style="--overlay-opacity: 0; --text-opacity: 1;"
  >
    <!--
      Shader host. Always rendered and always empty so the markup is identical on the
      server and on the first client render; the canvas is appended after mount.
    -->
    <div
      ref="shaderHostEl"
      class="home-gradient-hero__shader"
      aria-hidden="true"
    />
    <div class="home-gradient-hero__overlay" />
    <dt-box
      block-size="100p"
      padding-block-end="800"
      class="d-plc-center home-gradient-hero__content"
    >
      <gradient-hero-content />
    </dt-box>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import GradientHeroContent from './GradientHeroContent.vue';
import { gradientHeroFragmentShader, HERO_GEOMETRY } from './gradientHeroShader.js';
import { createGradientHeroCursor, getCursorUniforms } from './gradientHeroCursor.js';
import {
  createDotColorLoop,
  observeThemeChanges,
  resolveHeroBackground,
  resolveHeroDotPalette,
} from './gradientHeroColors.js';

// Scroll-driven overlay fading and canvas parallax are driven by the homepage's scroll
// handler writing CSS custom properties onto this element.

const heroEl = ref(null);
const shaderHostEl = ref(null);

// Both match Paper's defaults, which is what the reference implementation runs at.
//
// They are stated rather than left implicit because getting them wrong is invisible in
// code review and obvious on screen: a tighter pixel cap makes Paper render the canvas
// *below* CSS resolution and stretch it up, which softens every dot edge and smears the
// pointer trail. Dot geometry is expressed in CSS pixels and scaled by u_pixelRatio, so
// raising these changes sharpness only — not the size or spacing of anything.
//
// Lower MAX_PIXEL_COUNT if frame timing becomes a problem, and expect the field to go
// soft as it drops below the viewport's own pixel count.
const MIN_PIXEL_RATIO = 2;
const MAX_PIXEL_COUNT = 1920 * 1080 * 4;

// One full pass through the dot palette, matching the reference's colour period.
const DOT_COLOR_PERIOD_MS = 14_000;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
// A carry effect that follows a pointer has nothing to follow on touch.
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

let shaderMount = null;
let cursor = null;
let disposeThemeObserver = null;
let intersectionObserver = null;
let reducedMotionQuery = null;
let finePointerQuery = null;
let isDisposed = false;
let isVisible = true;

const dotColorLoop = createDotColorLoop({
  periodMs: DOT_COLOR_PERIOD_MS,
  onColor: (channels) => shaderMount?.setUniforms({ u_dotColor: channels }),
});

const prefersReducedMotion = () => Boolean(reducedMotionQuery?.matches);
const prefersFinePointer = () => Boolean(finePointerQuery?.matches);

// Static frame when motion is unwelcome. Paper still paints once, because its initial
// resize renders directly rather than waiting on the animation loop.
const currentSpeed = () => (prefersReducedMotion() || !isVisible ? 0 : 1);

const shouldTrackPointer = () => isVisible && prefersFinePointer() && !prefersReducedMotion();

const buildUniforms = (hero) => ({
  u_dotSpacingCss: HERO_GEOMETRY.dotSpacingCss,
  u_maxDotSizeCss: HERO_GEOMETRY.maxDotSizeCss,
  u_center: [...HERO_GEOMETRY.center],
  u_sizeVariation: HERO_GEOMETRY.sizeVariation,
  u_burstRadiusFrac: HERO_GEOMETRY.burstRadiusFrac,
  u_burstScale: HERO_GEOMETRY.burstScale,
  u_coreScale: HERO_GEOMETRY.coreScale,
  u_breatheAmount: HERO_GEOMETRY.breatheAmount,
  u_breathePeriod: HERO_GEOMETRY.breathePeriod,
  u_edgeFadeAmount: HERO_GEOMETRY.edgeFadeAmount,
  u_floorLuminance: HERO_GEOMETRY.floorLuminance,
  u_cursorRadiusFrac: HERO_GEOMETRY.cursorRadiusFrac,
  // Paper's shared vertex shader divides by u_scale; unset it defaults to 0. This shader
  // reads only gl_FragCoord so the resulting NaN never reaches a pixel, but there is no
  // reason to leave it that way.
  u_scale: 1,
  u_bgColor: resolveHeroBackground(hero),
  u_dotColor: dotColorLoop.current(),
  ...getCursorUniforms(null, HERO_GEOMETRY.cursorStrength),
});

// Re-read on every theme change: the stops are tokens, so mode, material, brand and
// contrast can all move them.
const refreshColors = (hero) => {
  dotColorLoop.setPalette(resolveHeroDotPalette(hero));

  shaderMount?.setUniforms({
    u_bgColor: resolveHeroBackground(hero),
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

  // A parked mount does not render, so advancing the colour would be invisible work.
  if (speed !== 0) {
    dotColorLoop.start();
  } else {
    dotColorLoop.stop();
  }
};

const canMountShader = (host) => {
  if (!host) return false;
  // Paper divides by the host's width when sizing its buffer, so a zero-width host
  // yields a non-finite render scale.
  if (host.clientWidth === 0 || host.clientHeight === 0) return false;

  // Paper stamps the host on construction; a second mount on the same node would leak
  // the first one's WebGL context.
  return !('paperShaderMount' in host);
};

const attachControllers = (hero) => {
  cursor = createGradientHeroCursor({
    element: hero,
    // The canvas layer overhangs the hero and slides for parallax, and the shader maps
    // cursor uv over the canvas — so coordinates must be measured against it, not the hero.
    rectElement: shaderHostEl.value,
    onChange: (state) => {
      // Pushed straight to the GPU. Routing per-frame values through reactivity would
      // re-render the hero at pointer frequency.
      shaderMount?.setUniforms(getCursorUniforms(state, HERO_GEOMETRY.cursorStrength));
    },
  });

  disposeThemeObserver = observeThemeChanges(() => {
    refreshColors(hero);
    syncMotionState();
  });

  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncMotionState();
    });
    intersectionObserver.observe(hero);
  }
};

const initShader = async () => {
  const host = shaderHostEl.value;
  const hero = heroEl.value;

  if (!hero || !canMountShader(host)) return;

  const { ShaderMount } = await import('@paper-design/shaders');

  // The import is async, so the component may already be gone.
  if (isDisposed || shaderHostEl.value !== host) return;

  // buildUniforms samples the palette, so the loop needs its stops first.
  dotColorLoop.setPalette(resolveHeroDotPalette(hero));

  // Arguments are positional in this version, not an options object.
  shaderMount = new ShaderMount(
    host,
    gradientHeroFragmentShader,
    buildUniforms(hero),
    undefined, // webGlContextAttributes
    currentSpeed(),
    0, // frame
    MIN_PIXEL_RATIO,
    MAX_PIXEL_COUNT,
  );

  attachControllers(hero);
  syncMotionState();
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    reducedMotionQuery.addEventListener('change', syncMotionState);
    // Read on demand but not listened to: pointer capability does not change under a
    // running page the way a motion preference does.
    finePointerQuery = window.matchMedia(FINE_POINTER_QUERY);
  }

  // A missing WebGL context, a failed compile, or a link error must leave the flat token
  // background and a fully usable hero rather than breaking the page.
  initShader().catch((error) => {
    console.warn('[GradientHero] Halftone canvas unavailable; using the flat background.', error);
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
  finePointerQuery = null;

  dotColorLoop.dispose();

  cursor?.dispose();
  cursor = null;

  shaderMount?.dispose();
  shaderMount = null;
});
</script>

<style lang="less">
/* Unscoped so the homepage's scroll handler can drive the custom properties below. */

.home-gradient-hero {
  --overlay-color-surface: var(--home-gradient-hero-color-background);
  --overlay-opacity: 0;

  /* How far the canvas layer extends past the hero, and therefore how far it can travel.
     The homepage's scroll handler reads the real overflow off the element rather than
     duplicating this number. */
  --shader-parallax-overflow: 70%;

  /* Single source for the canvas colours; read back through a probe element and pushed
     to the shader as uniforms, since WebGL cannot consume custom properties. */
  --home-gradient-hero-color-background: var(--dt-color-surface-primary);

  /* Loop stops, in order, wrapping from the last back to the first. Add, remove or reorder
     them and nothing else changes; declare a single `--home-gradient-hero-color-dot`
     instead for a static field. Repeat a stop to pass through it twice per loop.

     Stop 1 is what renders first, before the loop starts moving. The neutral stop sits
     much closer to the background than the chromatic ones, so the field deliberately fades
     toward invisible as the loop passes through it and swells back on the way out. Being
     on the neutral ramp, it is also the one stop the active material retints. */
  --home-gradient-hero-color-dot-1: var(--dt-color-purple-300);
  --home-gradient-hero-color-dot-2: var(--dt-color-black-300);
  --home-gradient-hero-color-dot-3: var(--dt-color-magenta-300);
  --home-gradient-hero-color-dot-4: var(--dt-color-red-200);

  position: relative;
  isolation: isolate;
  overflow: clip;
  block-size: 100vh;
  background-color: var(--home-gradient-hero-color-background);
}

.home-gradient-hero__shader {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 0;
  pointer-events: none;

  /* Deliberately overhangs the hero. Two jobs: the strip below the fold is what the
     parallax translate slides up into, so the hero never uncovers; and because the burst's
     focal point is positioned as a percentage of the canvas, a taller canvas carries that
     point further below the viewport, keeping its dark core out of frame. The centre and
     the burst radius scale together, so the field's appearance at the top of the hero is
     unchanged by this. */
  block-size: calc(100% + var(--shader-parallax-overflow));
  transform: translate3d(0, var(--shader-translate-y, 0px), 0);
  will-change: transform;

  /* Paper sets its own stacking on the canvas it appends. */
  canvas {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }
}

.home-gradient-hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-color: var(--overlay-color-surface);
  opacity: var(--overlay-opacity);
}

.home-gradient-hero__content {
  position: relative;
  z-index: 2;
}
</style>
