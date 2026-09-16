import { colorToRGB } from '../../common/contrast.js';

export const BROWSER_THEME_COLOR_FALLBACK = '#F9F9F9';

const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]';
const THEME_COLOR_CSS_VARIABLE = '--dt-color-surface-secondary';
const TRANSPARENT_COLORS = new Set([
  'transparent',
  'rgba(0, 0, 0, 0)',
  'rgba(0,0,0,0)',
]);

/**
 * @param {Document | undefined} documentOverride
 * @returns {Document | undefined}
 */
const getDocument = (documentOverride) => {
  if (documentOverride) return documentOverride;

  return typeof document === 'undefined' ? undefined : document;
};

/**
 * @param {Window | undefined} windowOverride
 * @returns {Window | undefined}
 */
const getWindow = (windowOverride) => {
  if (windowOverride) return windowOverride;

  return typeof window === 'undefined' ? undefined : window;
};

/**
 * Where the probe element gets mounted. This matters for correctness, not just tidiness:
 * a custom property declared on some element deeper than <body> does not exist in the
 * cascade at <body>, so a probe mounted there resolves it to nothing. Pass `container`
 * to read a variable that is scoped to a subtree.
 *
 * @param {Document | undefined} doc
 * @param {HTMLElement} [containerOverride]
 * @returns {HTMLElement | null}
 */
const getProbeContainer = (doc, containerOverride) => {
  if (containerOverride) return containerOverride;
  if (!doc) return null;

  return doc.body ?? doc.documentElement;
};

/**
 * @param {Window | undefined} win
 * @returns {boolean}
 */
const canResolveComputedStyle = (win) => {
  return typeof win?.getComputedStyle === 'function';
};

/**
 * @param {string | undefined} color
 * @returns {boolean}
 */
const isUsableThemeColor = (color) => {
  const value = color?.trim();

  return Boolean(value) && !TRANSPARENT_COLORS.has(value);
};

/**
 * @param {number} value
 * @returns {string}
 */
const toHexPair = (value) => {
  return value.toString(16).padStart(2, '0');
};

/**
 * Convert a CSS color string (rgb/oklch/etc., as getComputedStyle may return it) to
 * hex for `<meta name="theme-color">` — browser chrome does not reliably parse oklch.
 * Delegates parsing to colorjs.io (already bundled, via common/contrast) so every CSS
 * color form is handled, including relative-color oklch. Returns the input unchanged
 * if it can't be parsed.
 *
 * @param {string} color
 * @returns {string}
 */
export const normalizeBrowserThemeColor = (color) => {
  try {
    const { r, g, b } = colorToRGB(color);

    return `#${toHexPair(r)}${toHexPair(g)}${toHexPair(b)}`;
  } catch {
    return color;
  }
};

/**
 * @param {Document} doc
 * @returns {HTMLMetaElement | null}
 */
const ensureThemeColorMeta = (doc) => {
  if (!doc.head) return null;

  const [themeColorMeta, ...duplicateThemeColorMetas] = doc.head.querySelectorAll(THEME_COLOR_META_SELECTOR);

  duplicateThemeColorMetas.forEach(meta => meta.remove());

  if (themeColorMeta) return themeColorMeta;

  const meta = doc.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  doc.head.appendChild(meta);

  return meta;
};

/**
 * @param {Object} [options]
 * @param {Document} [options.document]
 * @param {Window} [options.window]
 * @param {string} [options.cssVariableName]
 * @param {string} [options.fallback]
 * @param {HTMLElement} [options.container] Element to mount the probe inside. Required
 *   when `cssVariableName` is scoped to a subtree rather than declared on the root.
 * @returns {string}
 */
export const resolveBrowserThemeColor = (options = {}) => {
  const {
    cssVariableName = THEME_COLOR_CSS_VARIABLE,
    fallback = BROWSER_THEME_COLOR_FALLBACK,
  } = options;
  const doc = getDocument(options.document);
  const win = getWindow(options.window);
  const container = getProbeContainer(doc, options.container);

  if (!doc) return fallback;
  if (!container) return fallback;
  if (!canResolveComputedStyle(win)) return fallback;

  const probe = doc.createElement('div');
  probe.style.setProperty('position', 'fixed');
  probe.style.setProperty('visibility', 'hidden');
  probe.style.setProperty('pointer-events', 'none');
  probe.style.setProperty('inline-size', '0');
  probe.style.setProperty('block-size', '0');
  probe.style.setProperty('background-color', `var(${cssVariableName})`);

  container.appendChild(probe);

  try {
    const resolvedColor = win.getComputedStyle(probe).backgroundColor;

    return isUsableThemeColor(resolvedColor)
      ? normalizeBrowserThemeColor(resolvedColor)
      : fallback;
  } finally {
    probe.remove();
  }
};

/**
 * @param {Object} [options]
 * @param {Document} [options.document]
 * @param {Window} [options.window]
 * @returns {void}
 */
export const syncBrowserThemeColor = (options = {}) => {
  const doc = getDocument(options.document);
  if (!doc) return;

  const themeColorMeta = ensureThemeColorMeta(doc);
  if (!themeColorMeta) return;

  themeColorMeta.setAttribute('content', resolveBrowserThemeColor(options));
};
