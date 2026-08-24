import Color from 'colorjs.io';
import { resolveBrowserThemeColor } from '../theme/utils/browserThemeColor.js';

/**
 * Bridges Dialtone theme colours into the hero shader's uniforms, including the dot
 * colour loop.
 *
 * WebGL cannot read CSS custom properties, so values are resolved in JS and pushed as
 * uniforms. Resolution goes through `resolveBrowserThemeColor`, which paints the variable
 * onto a throwaway probe and reads back the computed `background-color`. That matters:
 * `getComputedStyle().getPropertyValue('--x')` hands back the substituted token stream
 * rather than a colour, and many Dialtone tokens resolve to relative-colour syntax
 * (`oklch(from … l c h / .07)`) that the bundled colorjs.io cannot parse. Letting the
 * browser compute a real property sidesteps both.
 *
 * The probe is mounted inside the hero element, not <body>, because these variables are
 * declared on the hero and a custom property does not exist in the cascade above the
 * element that declares it.
 *
 * @module baseComponents/gradientHeroColors
 */

const BACKGROUND_CSS_VARIABLE = '--home-gradient-hero-color-background';

/** Single-colour form, used when no numbered palette is declared. */
const DOT_CSS_VARIABLE = '--home-gradient-hero-color-dot';

/** Numbered palette form: `--home-gradient-hero-color-dot-1`, `-2`, and so on. */
const DOT_PALETTE_CSS_VARIABLE_PREFIX = '--home-gradient-hero-color-dot-';

/** Upper bound on the scan for numbered palette entries. */
const DOT_PALETTE_MAX = 8;

// Last-resort values, used only when the probe cannot resolve anything (no document, or
// no variable declared at all). Current light-mode resolutions of
// --dt-color-surface-primary and --dt-color-purple-300.
const BACKGROUND_FALLBACK = '#FFFFFF';
const DOT_FALLBACK = '#B9A3FF';

/** Attributes on <html> that any theme change writes to. */
const THEME_ATTRIBUTE_PREFIX = 'data-dt-';

/**
 * Clamped sRGB channels, 0-1, as the shader wants them.
 *
 * @param {Color | string} color
 * @returns {[number, number, number, number]}
 */
const toChannels = (color) => {
  const [r, g, b] = new Color(color).to('srgb').coords;
  const clamp = (value) => Math.min(1, Math.max(0, value));

  return [clamp(r), clamp(g), clamp(b), 1];
};

/**
 * @param {string} cssVariableName
 * @param {HTMLElement} [container]
 * @returns {string | null} Resolved colour, or null when the variable is absent.
 */
const resolveVariable = (cssVariableName, container) => {
  // A sentinel fallback distinguishes "declared but unresolvable" from "not declared":
  // the helper returns its fallback in both cases, so presence is checked separately.
  const resolved = resolveBrowserThemeColor({
    cssVariableName,
    fallback: '',
    container,
  });

  return resolved === '' ? null : resolved;
};

/**
 * @param {HTMLElement} [scopeElement]
 * @param {string} cssVariableName
 * @returns {boolean} Whether the property is declared at all.
 */
const isVariableDeclared = (scopeElement, cssVariableName) => {
  if (!scopeElement || typeof window === 'undefined') return false;
  if (typeof window.getComputedStyle !== 'function') return false;

  // An undeclared custom property computes to the empty string. The value itself is not
  // usable here (it is an unevaluated token stream) but its presence is reliable.
  return window.getComputedStyle(scopeElement)
    .getPropertyValue(cssVariableName)
    .trim() !== '';
};

/**
 * Background colour as shader channels.
 *
 * @param {HTMLElement} scopeElement Element the hero variables are declared on.
 * @returns {[number, number, number, number]}
 */
export function resolveHeroBackground (scopeElement) {
  const resolved = resolveVariable(BACKGROUND_CSS_VARIABLE, scopeElement);

  try {
    return toChannels(resolved ?? BACKGROUND_FALLBACK);
  } catch {
    return toChannels(BACKGROUND_FALLBACK);
  }
}

/**
 * Dot colours in loop order.
 *
 * Prefers the numbered form (`…-dot-1`, `…-dot-2`, …) and falls back to the single
 * `…-dot`. Declaring one colour, or only the single form, yields a static dot colour.
 * Repeat a colour in the sequence to pass through it more than once per loop.
 *
 * @param {HTMLElement} scopeElement
 * @returns {string[]}
 */
export function resolveHeroDotPalette (scopeElement) {
  const stops = [];

  for (let index = 1; index <= DOT_PALETTE_MAX; index += 1) {
    const name = `${DOT_PALETTE_CSS_VARIABLE_PREFIX}${index}`;
    // Stop at the first gap rather than scanning the whole range, so the sequence stays
    // contiguous and a typo cannot silently reorder the loop.
    if (!isVariableDeclared(scopeElement, name)) break;

    const resolved = resolveVariable(name, scopeElement);
    if (resolved) stops.push(resolved);
  }

  if (stops.length > 0) return stops;

  const single = resolveVariable(DOT_CSS_VARIABLE, scopeElement);

  return [single ?? DOT_FALLBACK];
}

const smoothstep = (t) => t * t * (3 - 2 * t);

/**
 * Samples a looping dot colour.
 *
 * Interpolation runs in OKLCH so the midpoints between saturated hues stay as vivid as
 * the stops; mixing the same pair in sRGB desaturates through the middle. Ranges are
 * built once per palette rather than per frame.
 *
 * The returned sampler takes a phase where each whole number is one full loop, and eases
 * each leg so the handovers have no corner.
 *
 * @param {string[]} palette
 * @returns {(phase: number) => [number, number, number, number]}
 */
export function createDotColorSampler (palette) {
  const stops = palette.length > 0 ? palette : [DOT_FALLBACK];

  if (stops.length === 1) {
    let fixed;
    try {
      fixed = toChannels(stops[0]);
    } catch {
      fixed = toChannels(DOT_FALLBACK);
    }

    return () => fixed;
  }

  // One leg per stop, the last closing the loop back to the first so it repeats seamlessly.
  const legs = stops.map((from, index) => Color.range(
    from,
    stops[(index + 1) % stops.length],
    { space: 'oklch', hue: 'shorter' },
  ));

  return (phase) => {
    const wrapped = ((phase % 1) + 1) % 1;
    const scaled = wrapped * legs.length;
    const leg = Math.min(Math.floor(scaled), legs.length - 1);

    return toChannels(legs[leg](smoothstep(scaled - leg)));
  };
}

/**
 * Drives the dot colour around the palette loop.
 *
 * Owns its own animation frame, like the cursor controller, and reports through a callback
 * rather than reactive state. Phase accumulates instead of being derived from a start
 * timestamp, so pausing and resuming continues from where it stopped rather than jumping
 * to wherever wall-clock time has reached.
 *
 * @param {object} options
 * @param {number} options.periodMs Duration of one full pass through the palette.
 * @param {(channels: [number, number, number, number]) => void} options.onColor
 * @returns {{
 *   setPalette: (stops: string[]) => void,
 *   current: () => [number, number, number, number] | null,
 *   isAnimated: () => boolean,
 *   start: () => void,
 *   stop: () => void,
 *   dispose: () => void,
 * }}
 */
export function createDotColorLoop ({ periodMs, onColor }) {
  let sampler = null;
  let animated = false;
  let phase = 0;
  let frame = 0;
  let lastFrameTime = 0;

  const step = (now) => {
    // Skip the first frame's delta so a resume does not advance by however long it spent
    // parked.
    if (lastFrameTime !== 0) phase += (now - lastFrameTime) / periodMs;
    lastFrameTime = now;

    if (sampler) onColor(sampler(phase));

    frame = requestAnimationFrame(step);
  };

  const stop = () => {
    if (frame === 0) return;

    cancelAnimationFrame(frame);
    frame = 0;
    lastFrameTime = 0;
  };

  return {
    setPalette (stops) {
      sampler = createDotColorSampler(stops);
      animated = stops.length > 1;
      if (!animated) stop();
    },

    current () {
      return sampler ? sampler(phase) : null;
    },

    isAnimated () {
      return animated;
    },

    start () {
      // A single-stop palette has nothing to animate toward.
      if (!animated || frame !== 0) return;

      lastFrameTime = 0;
      frame = requestAnimationFrame(step);
    },

    stop,

    dispose () {
      stop();
      sampler = null;
      animated = false;
    },
  };
}

/**
 * Calls `onChange` after any theme change on the document element, coalesced into one
 * animation frame.
 *
 * Watches every attribute rather than a named list: mode, brand, material, contrast and
 * theme are all carried as `data-dt-*` attributes, and enumerating them invites missing
 * one when another is added.
 *
 * @param {() => void} onChange
 * @returns {() => void} Disposer.
 */
export function observeThemeChanges (onChange) {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }

  let frame = 0;

  const observer = new MutationObserver((records) => {
    const touchedTheme = records.some(
      (record) => record.attributeName?.startsWith(THEME_ATTRIBUTE_PREFIX),
    );
    if (!touchedTheme || frame !== 0) return;

    frame = requestAnimationFrame(() => {
      frame = 0;
      onChange();
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  return () => {
    if (frame !== 0) cancelAnimationFrame(frame);
    observer.disconnect();
  };
}
