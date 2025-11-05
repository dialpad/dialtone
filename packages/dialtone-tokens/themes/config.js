/* eslint-disable complexity */
import Core from '@/themes/core.js';

// Track if core tokens are loaded per rootNode (for layered system)
// Using WeakMap prevents memory leaks and allows per-rootNode tracking
const coreTokensLoadedByRoot = new WeakMap();

// Track initialization state per rootNode for idempotency protection
// Stores: { brand: string, mode: string, contrast: string }
const initializationState = new WeakMap();

/**
 * @typedef {'light'|'dark'} Mode
 * Color mode for the theme
 */

/**
 * @typedef {HTMLElement|ShadowRoot} ThemeRootNode
 * The root element where theme styles will be injected
 */

/**
 * @typedef {Object} CoreTheme
 * Core theme tokens that provide the base styling layer
 * @property {string} core - Core token CSS
 * @property {string} baseColors - Base color CSS
 */

/**
 * @typedef {Object} BrandTheme
 * Brand-specific theme overrides
 * @property {Object} brand - Brand-specific overrides
 * @property {string} brand.name - Brand identifier (e.g., 'dp', 'tmo')
 * @property {string} brand.css - Brand override CSS
 */

/**
 * @typedef {Object} ContrastTheme
 * Contrast theme overrides for accessibility
 * @property {Object} contrast - Contrast-specific overrides
 * @property {string} contrast.name - Contrast identifier (e.g., 'high')
 * @property {string} contrast.css - Contrast override CSS
 */

/**
 * Set the current theme, brand, and optionally contrast - BACKWARD COMPATIBLE
 *
 * Auto-detects whether you're using the legacy theme format or the new layered format
 * and applies the theme accordingly. Maintained for backward compatibility with existing
 * projects. New projects should use initDialtoneTheme() + individual setters instead.
 *
 * @param {Object} theme - Theme object (legacy: {base, brand} or layered: {core, brand, contrast})
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element for style injection
 * @param {Object|null} [contrastTheme=null] - Optional contrast theme (legacy format only)
 *
 * @example
 * // Legacy format (still supported)
 * import theme from '@dialpad/dialtone/themes/legacy-theme.json';
 * setTheme(theme);
 *
 * @example
 * // Layered format
 * import layeredTheme from '@dialpad/dialtone/themes/layered-theme.json';
 * setTheme(layeredTheme);
 *
 * @example
 * // Web Components with either format
 * class MyWidget extends HTMLElement {
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *     setTheme(theme, this); // Works with both legacy and layered
 *   }
 * }
 *
 * @note For new projects, prefer using initDialtoneTheme() for initial setup and
 * setMode(), setBrand(), setContrast() for dynamic switching.
 */
export function setTheme (theme, rootNode = document.documentElement, contrastTheme = null) {
  // Warn if someone passed shadowRoot directly instead of the host
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to setTheme(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
  }

  // Detect format: legacy has 'base', layered has 'core' or is just 'brand'
  if (theme.base) {
    // Legacy format
    return _setThemeLegacy(theme, rootNode, contrastTheme);
  } else {
    // Layered format
    return _setThemeLayered(theme, rootNode);
  }
}

/**
 * Legacy theme setter (original system)
 */
function _setThemeLegacy(theme, rootNode = document.documentElement, contrastTheme = null) {
  _setThemeAttributeOnRoot(theme.base.name, theme.brand.name, rootNode);
  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }
  // Load css files
  _setStyleTag('dialtone-css-theme', theme.base.css, rootNode);
  _setStyleTag('dialtone-css-brand', theme.brand.css, rootNode);

  // Apply contrast layer
  if (contrastTheme) {
    _setStyleTag('dialtone-css-contrast', contrastTheme.css, rootNode);
    rootNode?.setAttribute('data-dt-contrast', 'high');
  } else {
    _removeStyleTag('dialtone-css-contrast', rootNode);
    rootNode?.setAttribute('data-dt-contrast', 'default');
  }
}

/**
 * Layered theme setter (new optimized system)
 */
function _setThemeLayered(theme, rootNode = document.documentElement) {
  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  // Load core tokens only once per rootNode
  if (theme.core && !coreTokensLoadedByRoot.get(rootNode)) {
    _setStyleTag('dialtone-css-core', theme.core, rootNode);
    coreTokensLoadedByRoot.set(rootNode, true);
  }

  // Load base colors only once
  if (theme.baseColors && !rootNode?.querySelector('#dialtone-css-base-colors')) {
    _setStyleTag('dialtone-css-base-colors', theme.baseColors, rootNode);
  }

  // Load brand colors (dp base is always loaded, others are overrides)
  if (theme.brand) {
    _setStyleTag('dialtone-css-brand-colors', theme.brand.css, rootNode);
    rootNode?.setAttribute('data-dt-brand', theme.brand.name);
  }

  // Apply contrast layer if provided
  if (theme.contrast) {
    _setStyleTag('dialtone-css-contrast', theme.contrast.css, rootNode);
    rootNode?.setAttribute('data-dt-contrast', theme.contrast.name);
  }
}

/**
 * Set the content of a style tag with the given id, create it if the id doesn't exist.
 */
function _setStyleTag (id, content, rootNode) {
  if (!rootNode?.querySelector('#' + id)) {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', id);
    style.innerHTML = content;
    if (rootNode?.querySelector('head')) {
      rootNode.querySelector('head').appendChild(style);
    } else {
      rootNode?.appendChild(style);
    }
  } else {
    const existingTag = rootNode.querySelector('#' + id);
    existingTag.innerHTML = content;
  }
}


/**
 * Remove a style tag with the given id
 */
function _removeStyleTag (id, rootNode) {
  const existingStyleTag = rootNode?.querySelector('#' + id);
  if (existingStyleTag) {
    existingStyleTag.remove();
  }
}

/**
 * Set the dialtone theme and brand custom attributes on the root element
 */
function _setThemeAttributeOnRoot (theme, brand, rootNode) {
  rootNode?.setAttribute('data-dt-theme', theme);
  rootNode?.setAttribute('data-dt-brand', brand);
}

/**
 * LAYERED SYSTEM HELPERS
 * These functions work with the new layered token architecture
 */

/**
 * Set color mode (light/dark) - instant switching with layered system
 *
 * Changes the color mode by setting the data-dt-mode attribute. With the layered theming
 * system, mode switching is instant as it only toggles CSS custom properties.
 *
 * @param {Mode} mode - Color mode: 'light' or 'dark'
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element to apply mode to
 *
 * @example
 * // Standard usage
 * import { setMode } from '@dialpad/dialtone/themes/config';
 * setMode('dark');
 *
 * @example
 * // In Web Components, pass the host element
 * class MyWidget extends HTMLElement {
 *   toggleDarkMode() {
 *     setMode('dark', this); // Apply to this component's shadowRoot
 *   }
 * }
 */
export function setMode(mode, rootNode = document.documentElement) {
  if (mode !== 'light' && mode !== 'dark') {
    console.warn(`Invalid mode: ${mode}. Must be 'light' or 'dark'`);
    return;
  }

  // Warn if someone passed shadowRoot directly instead of the host
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to setMode(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
  }

  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  rootNode?.setAttribute('data-dt-mode', mode);
}

/**
 * Set brand - loads brand override CSS
 *
 * Dynamically switches the brand by injecting brand-specific CSS overrides. Allows runtime
 * brand switching without reloading core tokens.
 *
 * @param {BrandTheme} brandTheme - Theme object with brand property containing CSS and name
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element for style injection
 *
 * @example
 * // Standard brand switching
 * import { setBrand } from '@dialpad/dialtone/themes/config';
 * import Tmo from '@dialpad/dialtone/themes/tmo.json';
 * setBrand(Tmo);
 *
 * @example
 * // In Web Components
 * class MyWidget extends HTMLElement {
 *   switchBrand(brandTheme) {
 *     setBrand(brandTheme, this);
 *   }
 * }
 */
export function setBrand(brandTheme, rootNode = document.documentElement) {
  // Validation: brandTheme must be an object
  if (!brandTheme || typeof brandTheme !== 'object') {
    throw new TypeError(
      '[Dialtone] setBrand: brandTheme must be an object. ' +
      'Import a brand theme like: import Dp from \'@dialpad/dialtone-tokens/themes/dp\';',
    );
  }

  // Validation: brandTheme.brand must exist and be properly structured
  if (!brandTheme.brand || typeof brandTheme.brand !== 'object') {
    throw new TypeError(
      '[Dialtone] setBrand: brandTheme.brand must be an object with {name, css} properties.',
    );
  }

  if (typeof brandTheme.brand.name !== 'string' || !brandTheme.brand.name) {
    throw new TypeError(
      '[Dialtone] setBrand: brandTheme.brand.name must be a non-empty string.',
    );
  }

  if (typeof brandTheme.brand.css !== 'string') {
    throw new TypeError(
      '[Dialtone] setBrand: brandTheme.brand.css must be a string containing CSS.',
    );
  }

  // Warn if someone passed shadowRoot directly instead of the host
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to setBrand(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
  }

  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  _setStyleTag('dialtone-css-brand-colors', brandTheme.brand.css, rootNode);
  rootNode?.setAttribute('data-dt-brand', brandTheme.brand.name);
}

/**
 * Set contrast level for accessibility
 *
 * Applies a contrast theme layer for improved accessibility (e.g., high contrast mode).
 * Pass null to remove contrast overrides and return to default contrast.
 *
 * @param {ContrastTheme|null} contrastTheme - Theme object with contrast property, or null for default
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element for style injection
 *
 * @example
 * // Enable high contrast
 * import { setContrast } from '@dialpad/dialtone/themes/config';
 * import HighContrast from '@dialpad/dialtone/themes/high-contrast.json';
 * setContrast(HighContrast);
 *
 * @example
 * // Disable contrast overrides (return to default)
 * setContrast(null);
 *
 * @example
 * // In Web Components
 * class MyWidget extends HTMLElement {
 *   toggleHighContrast(enabled) {
 *     setContrast(enabled ? HighContrast : null, this);
 *   }
 * }
 */
export function setContrast(contrastTheme, rootNode = document.documentElement) {
  // Warn if someone passed shadowRoot directly instead of the host
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to setContrast(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
  }

  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  if (contrastTheme && contrastTheme.contrast) {
    _setStyleTag('dialtone-css-contrast', contrastTheme.contrast.css, rootNode);
    rootNode?.setAttribute('data-dt-contrast', contrastTheme.contrast.name);
  } else {
    _removeStyleTag('dialtone-css-contrast', rootNode);
    rootNode?.setAttribute('data-dt-contrast', 'default');
  }
}

/**
 * Initialize Dialtone theme system - call once on app startup
 *
 * Loads core tokens, base colors, sets initial mode and brand. This function should be called
 * once during application initialization to set up the theming system.
 *
 * Core tokens are loaded automatically - you only need to specify the brand and mode.
 *
 * @param {BrandTheme} brandTheme - Initial brand theme to apply
 * @param {Mode} [mode='light'] - Initial color mode ('light' or 'dark')
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element for style injection
 *
 * @example
 * // Standard usage (non-Shadow DOM)
 * import { initDialtoneTheme } from '@dialpad/dialtone/themes/config';
 * import Dp from '@dialpad/dialtone/themes/dp.json';
 *
 * initDialtoneTheme(Dp, 'light');
 *
 * @example
 * // Explicit document.documentElement (optional but clear in config files)
 * initDialtoneTheme(Dp, 'light', document.documentElement);
 *
 * @example
 * // ❌ WRONG - In Web Components, forgetting rootNode causes styles to inject into document!
 * class MyWidget extends HTMLElement {
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *     initDialtoneTheme(Dp, 'light'); // BUG: Styles won't appear in Shadow DOM!
 *   }
 * }
 *
 * @example
 * // ✅ CORRECT - Pass the host element (function accesses shadowRoot automatically)
 * class MyWidget extends HTMLElement {
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *     initDialtoneTheme(Dp, 'light', this); // Styles inject into shadowRoot
 *   }
 * }
 */
export function initDialtoneTheme(brandTheme, mode = 'light', rootNode = document.documentElement) {
  // Validation: brandTheme must be an object
  if (!brandTheme || typeof brandTheme !== 'object') {
    throw new TypeError(
      '[Dialtone] initDialtoneTheme: brandTheme must be an object. ' +
      'Import a brand theme like: import Dp from \'@dialpad/dialtone-tokens/themes/dp\';',
    );
  }

  // Validation: brandTheme.brand must exist and be properly structured
  if (!brandTheme.brand || typeof brandTheme.brand !== 'object') {
    throw new TypeError(
      '[Dialtone] initDialtoneTheme: brandTheme.brand must be an object with {name, css} properties. ' +
      'Ensure you\'re importing a valid brand theme.',
    );
  }

  if (typeof brandTheme.brand.name !== 'string' || !brandTheme.brand.name) {
    throw new TypeError(
      '[Dialtone] initDialtoneTheme: brandTheme.brand.name must be a non-empty string.',
    );
  }

  if (typeof brandTheme.brand.css !== 'string') {
    throw new TypeError(
      '[Dialtone] initDialtoneTheme: brandTheme.brand.css must be a string containing CSS.',
    );
  }

  // Validation: mode must be valid
  if (mode !== 'light' && mode !== 'dark') {
    throw new TypeError(
      `[Dialtone] initDialtoneTheme: mode must be 'light' or 'dark', got '${mode}'.`,
    );
  }

  // Validation: rootNode must be a valid element
  if (!rootNode || (typeof rootNode !== 'object')) {
    throw new TypeError(
      '[Dialtone] initDialtoneTheme: rootNode must be an HTMLElement or host element with shadowRoot.',
    );
  }

  // Warn if someone passed shadowRoot directly instead of the host
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to initDialtoneTheme(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.\n' +
      'Correct: initDialtoneTheme(brand, mode, hostElement)\n' +
      'Incorrect: initDialtoneTheme(brand, mode, hostElement.shadowRoot)',
    );
  }

  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  // CRITICAL: Detect embedded app trying to use document.documentElement
  // This check MUST run on first init, before idempotency check
  if (rootNode === document.documentElement) {
    const hasThemeStyles = document.querySelector('#dialtone-css-core') !== null;
    if (hasThemeStyles) {
      throw new Error(
        '[Dialtone] Cannot initialize theme on document.documentElement because theme styles already exist. ' +
        'You are likely in an embedded app/micro-frontend. ' +
        'You MUST pass your own container element as the rootNode parameter. ' +
        'Example: initDialtoneTheme(brandTheme, mode, myAppContainerElement)',
      );
    }
  }

  // Check for duplicate initialization (idempotency protection with soft warnings)
  const existing = initializationState.get(rootNode);
  if (existing) {
    if (existing.brand === brandTheme.brand.name && existing.mode === mode) {
      console.warn(
        `[Dialtone] Theme already initialized for this rootNode with brand '${brandTheme.brand.name}' and mode '${mode}'. ` +
        'Re-applying the same theme may be unnecessary. ' +
        'If you need to switch themes dynamically, use setBrand() or setMode() instead of calling initDialtoneTheme() again.',
      );
      return;
    } else {
      console.warn(
        `[Dialtone] Theme already initialized for this rootNode. ` +
        `Previous: brand='${existing.brand}', mode='${existing.mode}'. ` +
        `New: brand='${brandTheme.brand.name}', mode='${mode}'. ` +
        'Re-initializing with different parameters. Consider using setBrand()/setMode() for dynamic switching.',
      );
      return;
    }
  }

  // Load core tokens (once per rootNode)
  _setStyleTag('dialtone-css-core', Core.core, rootNode);
  coreTokensLoadedByRoot.set(rootNode, true);

  // Load base colors (once)
  _setStyleTag('dialtone-css-base-colors', Core.baseColors, rootNode);

  // Set initial mode
  setMode(mode, rootNode);

  // Set initial brand
  setBrand(brandTheme, rootNode);

  // Set default contrast
  rootNode?.setAttribute('data-dt-contrast', 'default');

  // Track initialization state for future idempotency checks
  initializationState.set(rootNode, {
    brand: brandTheme.brand.name,
    mode: mode,
    contrast: 'default',
  });
}

/**
 * Reset theme for a given rootNode - useful for testing and cleanup
 *
 * Removes all theme styles, attributes, and initialization state for the specified rootNode.
 * This allows re-initialization with a clean slate, which is particularly useful in test
 * environments or when unmounting micro-frontends.
 *
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element to reset
 *
 * @example
 * // Reset document theme (test cleanup)
 * import { resetTheme } from '@dialpad/dialtone/themes/config';
 * afterEach(() => {
 *   resetTheme();  // Clean slate for next test
 * });
 *
 * @example
 * // Reset Shadow DOM theme (component unmount)
 * class MyWidget extends HTMLElement {
 *   disconnectedCallback() {
 *     resetTheme(this);  // Clean up when component removed
 *   }
 * }
 */
export function resetTheme(rootNode = document.documentElement) {
  // Access shadowRoot if present
  const actualRoot = rootNode?.shadowRoot || rootNode;

  // Clear initialization state
  initializationState.delete(actualRoot);
  coreTokensLoadedByRoot.delete(actualRoot);

  // Remove all theme style tags
  _removeStyleTag('dialtone-css-core', actualRoot);
  _removeStyleTag('dialtone-css-base-colors', actualRoot);
  _removeStyleTag('dialtone-css-brand-colors', actualRoot);
  _removeStyleTag('dialtone-css-contrast', actualRoot);

  // Remove theme attributes
  actualRoot?.removeAttribute('data-dt-mode');
  actualRoot?.removeAttribute('data-dt-brand');
  actualRoot?.removeAttribute('data-dt-contrast');
}
