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
      <dt-box class="home-gradient-hero-content">
        <dt-box class="d-d-flex d-plc-center d-mbe-600">
          <dt-link to="/dialtone/">
            <dt-box
              :inline-size="viewport.pick({
                default: '125',
                md: '150',
                lg: '200',
              })"
              style="filter: drop-shadow(rgba(0, 0, 0, 0.25) 0px 25px 30px);"
            >
              <svg-loader name="home--dialtone-badge" />
            </dt-box>
          </dt-link>
        </dt-box>
        <dt-text
          as="h1"
          kind="headline"
          strength="medium"
          density="200"
          align="center"
          class="d-p-400 home-gradient-hero-title d-wmx-1300 d-mx-auto"
        >
          The fastest way to build Dialpad.
        </dt-text>
        <dt-text
          as="p"
          variant="body-md"
          :size="viewport.pick({
            default: '200',
            md: '350',
          })"
          align="center"
          strength="medium"
          class="d-px-500 d-o80 d-wmx-1000 d-mx-auto"
          wrap="balance"
        >
          Start with the system of components, design tokens, and guidance that make good design the default.
        </dt-text>
        <dt-stack direction="row" justify="center" gap="200" class="d-pbs-500">
          <dt-button
            v-dt-mode:dark
            class="home-gradient-hero-btn"
            to="/dialtone/"
            :size="400"
          >
            Docs
          </dt-button>
          <dt-button
            to="/dialtone/whats-new/"
            :size="400"
            kind="muted"
            importance="outlined"
            class="d-fc-primary d-bc-bold"
          >
            What's New
          </dt-button>
        </dt-stack>
      </dt-box>
    </dt-box>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useViewportBreakpoints } from '../theme/composables/useViewportBreakpoints.js';
import { gradientHeroFragmentShader, HERO_GEOMETRY } from './gradientHeroShader.js';
import { createGradientHeroCursor, getCursorUniforms } from './gradientHeroCursor.js';
import { observeThemeChanges, resolveHeroColors } from './gradientHeroColors.js';

// Scroll-driven overlay and text fading are still driven by the homepage's scroll handler
// writing CSS custom properties onto this element.
const viewport = useViewportBreakpoints();

const heroEl = ref(null);
const shaderHostEl = ref(null);

// Caps the shader's backing buffer. Well below Paper's default because this fragment
// shader searches a lattice per pixel, so it is far heavier than Paper's own presets, and
// because the hero is only the content column on wide viewports.
const MAX_PIXEL_COUNT = 1_000_000;
// Paper defaults to 2, which would render every 1x display at twice the necessary size.
const MIN_PIXEL_RATIO = 1;

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
  u_cursorRadiusFrac: HERO_GEOMETRY.cursorRadiusFrac,
  // Paper's shared vertex shader divides by u_scale; unset it defaults to 0. This shader
  // reads only gl_FragCoord so the resulting NaN never reaches a pixel, but there is no
  // reason to leave it that way.
  u_scale: 1,
  ...resolveHeroColors(hero),
  ...getCursorUniforms(null, HERO_GEOMETRY.cursorStrength),
});

const syncMotionState = () => {
  shaderMount?.setSpeed(currentSpeed());

  if (shouldTrackPointer()) {
    cursor?.start();
  } else {
    cursor?.stop();
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
    onChange: (state) => {
      // Pushed straight to the GPU. Routing per-frame values through reactivity would
      // re-render the hero at pointer frequency.
      shaderMount?.setUniforms(getCursorUniforms(state, HERO_GEOMETRY.cursorStrength));
    },
  });

  disposeThemeObserver = observeThemeChanges(() => {
    shaderMount?.setUniforms(resolveHeroColors(hero));
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

  /* Single source for the canvas colours; read back through a probe element and pushed
     to the shader as uniforms, since WebGL cannot consume custom properties. */
  --home-gradient-hero-color-background: var(--dt-color-surface-primary);
  --home-gradient-hero-color-dot: var(--dt-color-purple-300);

  position: relative;
  isolation: isolate;
  overflow: clip;
  block-size: 100vh;
  background-color: var(--home-gradient-hero-color-background);
}

.home-gradient-hero__shader {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

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

.home-gradient-hero-btn {
  --button-color-text: var(--dt-color-neutral-white);
  --button-color-background: var(--dt-color-purple-50);
}

.home-gradient-hero-content {
  transform: translateY(var(--text-translate-y, 0px));
  opacity: var(--text-opacity);
}

.home-gradient-hero-title {
  font-size: 32px;
  font-family: "Season Sans", var(--dt-font-family-body);
  text-wrap: balance;
  transition: none;
  background: linear-gradient(180deg, var(--dt-color-purple-900), var(--dt-color-purple-1000));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  @media screen and (min-width: 640px) {
    font-size: 46px;
  }

}
</style>
