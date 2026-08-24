import { colorToRGB } from '../common/contrast.js';
import { resolveBrowserThemeColor } from '../theme/utils/browserThemeColor.js';

/**
 * Bridges Dialtone theme colours into the hero shader's uniforms.
 *
 * WebGL cannot read CSS custom properties, so the values have to be resolved in JS and
 * pushed as uniforms. Resolution goes through `resolveBrowserThemeColor`, which paints the
 * variable onto a throwaway probe element and reads back the computed `background-color`.
 * That matters: `getComputedStyle().getPropertyValue('--x')` hands back the substituted
 * token stream rather than a colour, and a good number of Dialtone tokens resolve to
 * relative-colour syntax (`oklch(from … l c h / .07)`) that the bundled colorjs.io cannot
 * parse. Letting the browser compute a real property sidesteps both problems.
 *
 * @module baseComponents/gradientHeroColors
 */

const BACKGROUND_CSS_VARIABLE = '--home-gradient-hero-color-background';
const DOT_CSS_VARIABLE = '--home-gradient-hero-color-dot';

// Last-resort values, used only if the probe cannot resolve a colour (no document, or a
// variable that is missing entirely). These are the current light-mode resolutions of
// --dt-color-surface-primary and --dt-color-surface-brand-strong; the live tokens are
// always preferred, so these should never be what renders.
const BACKGROUND_FALLBACK = '#FFFFFF';
const DOT_FALLBACK = '#7B51FF';

/** Attributes on <html> that any theme change writes to. */
const THEME_ATTRIBUTE_PREFIX = 'data-dt-';

/**
 * @param {string} cssVariableName
 * @param {string} fallback
 * @param {HTMLElement} [container]
 * @returns {[number, number, number, number]}
 */
const resolveChannels = (cssVariableName, fallback, container) => {
  const resolved = resolveBrowserThemeColor({ cssVariableName, fallback, container });

  try {
    const { r, g, b } = colorToRGB(resolved);

    return [r / 255, g / 255, b / 255, 1];
  } catch {
    const { r, g, b } = colorToRGB(fallback);

    return [r / 255, g / 255, b / 255, 1];
  }
};

/**
 * Current theme colours as shader uniforms.
 *
 * `scopeElement` must be the element the hero variables are declared on (or a descendant
 * of it). The probe is mounted inside it, because a custom property scoped to that
 * element does not exist in the cascade further up the tree — probing <body> for it
 * yields transparent, and every call would silently return the fallbacks.
 *
 * @param {HTMLElement} scopeElement
 * @returns {{ u_bgColor: number[], u_dotColor: number[] }}
 */
export function resolveHeroColors (scopeElement) {
  return {
    u_bgColor: resolveChannels(BACKGROUND_CSS_VARIABLE, BACKGROUND_FALLBACK, scopeElement),
    u_dotColor: resolveChannels(DOT_CSS_VARIABLE, DOT_FALLBACK, scopeElement),
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
