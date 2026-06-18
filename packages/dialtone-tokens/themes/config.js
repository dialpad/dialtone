/* eslint-disable complexity */
import Core from '@/themes/core.js';

/**
 * Names of all materials, including the default (sandstone). Material switching
 * is attribute-driven: setMaterial sets `data-dt-material` on the rootNode,
 * and the bundled per-material CSS (loaded once at app startup) applies via
 * the matching `[data-dt-material="<name>"]` selector.
 */
export const VALID_MATERIALS = Object.freeze(['sandstone', 'steel', 'graphite', 'iron', 'amethyst', 'jade']);
const VALID_MATERIALS_SET = new Set(VALID_MATERIALS);

// Track if core tokens are loaded (per JavaScript instance)
// Note: In micro-frontend architecture, each app has separate bundle with its own
// config.js instance, so this boolean only tracks state within a single app.
let coreTokensLoaded = false;

// Track initialization state for idempotency protection
// Stores: { brand: string, mode: string, contrast: string } or null
// Note: Only one rootNode per instance (per Brad's architecture)
let initializationState = null;

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
 * @property {Object} [material] - Optional brand-locked material declaration; absent on free-choice brands (dp, tmo, prota-deuter, trita)
 * @property {string} [material.name] - Material identifier (e.g., 'jade', 'sandstone')
 */

/**
 * @typedef {Object} ContrastTheme
 * Contrast theme overrides for accessibility
 * @property {Object} contrast - Contrast-specific overrides
 * @property {string} contrast.name - Contrast identifier (e.g., 'high')
 * @property {string} contrast.css - Contrast override CSS
 */

/**
 * @typedef {'sandstone'|'steel'|'graphite'|'iron'|'amethyst'|'jade'} MaterialName
 * Material identifier — one of the names in VALID_MATERIALS.
 */

/**
 * Apply a brand theme as an overlay diff — or clear it.
 *
 * For the layered format (new system), setBrand applies the brand as an *overlay*
 * on top of whatever base brand was established by initDialtoneTheme().
 *
 * Use initDialtoneTheme() to establish the base brand. Use setBaseBrand() when you want to
 * replace the base brand itself rather than overlay it.
 *
 * Legacy format (theme.base present) is still supported and behaves as before.
 *
 * @param {Object|null} theme - Theme object (legacy: {base, brand} or Brand theme object (layered: {brand: {name, css}}), or null to clear
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element for style injection
 * @param {Object|null} [contrastTheme=null] - Optional contrast theme (legacy format only)
 *
 * @example
 * // Apply a brand overlay after initDialtoneTheme has set the base
 * import { initDialtoneTheme, setBrand } from '@dialpad/dialtone/themes/config';
 * import Dp from '@dialpad/dialtone/themes/dp.json';
 * import Tmo from '@dialpad/dialtone/themes/tmo.json';
 *
 * initDialtoneTheme(Dp, 'light');   // base brand = dp
 * setBrand(Tmo);                    // overlay: tmo overrides on top of dp
 * setBrand(null);                   // clear overlay; back to dp
 * setBrand(Dp);                     // same as null — dp IS the base, no diff needed
 *
 * @example
 * // Web Components
 * class MyWidget extends HTMLElement {
 *   constructor() {
 *     super();
 *     this.attachShadow({ mode: 'open' });
 *     setBrand(theme, this);
 *   }
 * }
 */
export function setBrand (theme, rootNode = document.documentElement, contrastTheme = null) {
  // Warn if someone passed shadowRoot directly instead of the host
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to setBrand(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
    return;
  }

  // null → clear the brand overlay and restore the base brand + material
  if (theme === null) {
    _removeStyleTag('dialtone-css-brand', rootNode?.shadowRoot ?? rootNode);
    if (initializationState) {
      rootNode?.setAttribute('data-dt-brand', initializationState.brand);
      rootNode?.setAttribute('data-dt-material', initializationState.material ?? 'sandstone');
    }
    return;
  }

  // Detect format: legacy has 'base', layered has 'core' or just 'brand'
  if (theme.base) {
    // Legacy format
    return _setBrandLegacy(theme, rootNode, contrastTheme);
  } else {
    // Layered format
    return _setBrandLayered(theme, rootNode);
  }
}

/**
 * Legacy theme setter (original system)
 */
function _setBrandLegacy(theme, rootNode = document.documentElement, contrastTheme = null) {
  rootNode?.setAttribute('data-dt-theme', theme.base.name);
  rootNode?.setAttribute('data-dt-brand', theme.brand.name);
  const styleRoot = rootNode?.shadowRoot ?? rootNode;
  // Load css files
  _setStyleTag('dialtone-css-theme', theme.base.css, styleRoot);
  _setStyleTag('dialtone-css-brand', theme.brand.css, styleRoot);

  // Apply contrast layer
  if (contrastTheme) {
    _setStyleTag('dialtone-css-contrast', contrastTheme.css, styleRoot);
    rootNode?.setAttribute('data-dt-contrast', 'high');
  } else {
    _removeStyleTag('dialtone-css-contrast', styleRoot);
    rootNode?.setAttribute('data-dt-contrast', 'default');
  }
}

/**
 * Layered theme setter (new optimized system)
 *
 * Brand is applied as an overlay (dialtone-css-brand) on top of the base
 * brand established by initDialtoneTheme. If the requested brand matches the base
 * brand tracked in initializationState, the override is cleared instead.
 */
function _setBrandLayered(theme, rootNode = document.documentElement) {
  const styleRoot = rootNode?.shadowRoot ?? rootNode;

  // Load core tokens only once per JavaScript instance
  if (theme.core && !coreTokensLoaded) {
    _setStyleTag('dialtone-css-core', theme.core, styleRoot);
    coreTokensLoaded = true;
  }

  // Load base colors only once
  if (theme.baseColors && !styleRoot?.querySelector('#dialtone-css-base-colors')) {
    _setStyleTag('dialtone-css-base-colors', theme.baseColors, styleRoot);
  }

  // Apply brand as an overlay diff over the base brand (set by initDialtoneTheme/setBaseBrand).
  // If the requested brand is the same as the base, clear the override instead.
  if (theme.brand) {
    const baseBrand = initializationState?.brand;
    if (baseBrand && theme.brand.name === baseBrand) {
      _removeStyleTag('dialtone-css-brand', styleRoot);
      rootNode?.setAttribute('data-dt-brand', baseBrand);
      rootNode?.setAttribute('data-dt-material', initializationState?.material ?? 'sandstone');
    } else {
      _setStyleTag('dialtone-css-brand', theme.brand.css, styleRoot);
      rootNode?.setAttribute('data-dt-brand', theme.brand.name);
      _applyBrandLockedMaterial(theme, rootNode);
    }
  }

  // Apply contrast layer if provided
  if (theme.contrast) {
    _setStyleTag('dialtone-css-contrast', theme.contrast.css, styleRoot);
    rootNode?.setAttribute('data-dt-contrast', theme.contrast.name);
  }
}

/**
 * Set the content of a style tag with the given id, create it if the id doesn't exist.
 * If `beforeId` is provided and that tag exists, insert the new tag immediately before
 * it (so the named tag wins at the same specificity). Otherwise append.
 */
function _setStyleTag (id, content, rootNode, beforeId = null) {
  if (!rootNode?.querySelector('#' + id)) {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', id);
    style.innerHTML = content;
    const parent = rootNode?.querySelector('head') ?? rootNode;
    const anchor = beforeId ? rootNode?.querySelector('#' + beforeId) : null;
    if (anchor && anchor.parentNode === parent) {
      parent.insertBefore(style, anchor);
    } else {
      parent?.appendChild(style);
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
  rootNode?.querySelector('#' + id)?.remove();
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
    return;
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
 * import { setBaseBrand } from '@dialpad/dialtone/themes/config';
 * import Tmo from '@dialpad/dialtone/themes/tmo.json';
 * setBaseBrand(Tmo);
 *
 * @example
 * // In Web Components
 * class MyWidget extends HTMLElement {
 *   switchBrand(brandTheme) {
 *     setBaseBrand(brandTheme, this);
 *   }
 * }
 */
export function setBaseBrand(brandTheme, rootNode = document.documentElement) {
  // Validation: brandTheme must be an object
  if (!brandTheme || typeof brandTheme !== 'object') {
    throw new TypeError(
      '[Dialtone] setBaseBrand: brandTheme must be an object. ' +
      'Import a brand theme like: import Dp from \'@dialpad/dialtone-tokens/themes/dp\';',
    );
  }

  // Validation: brandTheme.brand must exist and be properly structured
  if (!brandTheme.brand || typeof brandTheme.brand !== 'object') {
    throw new TypeError(
      '[Dialtone] setBaseBrand: brandTheme.brand must be an object with {name, css} properties.',
    );
  }

  if (typeof brandTheme.brand.name !== 'string' || !brandTheme.brand.name || typeof brandTheme.brand.css !== 'string') {
    throw new TypeError(
      '[Dialtone] setBaseBrand: brandTheme.brand.name must be a non-empty string and brandTheme.brand.css must be a string.',
    );
  }

  // Warn if someone passed shadowRoot directly instead of the host
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to setBaseBrand(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
    return;
  }

  const styleRoot = rootNode?.shadowRoot ?? rootNode;
  _setStyleTag('dialtone-css-brand-base', brandTheme.brand.css, styleRoot);
  rootNode?.setAttribute('data-dt-brand', brandTheme.brand.name);

  _applyBrandLockedMaterial(brandTheme, rootNode);

  // Clear any active overlay — its variables would otherwise win over the new base.
  _removeStyleTag('dialtone-css-brand', styleRoot);

  // Update initializationState so setBrand(null) reverts to this new base, not the original.
  if (initializationState) {
    initializationState.brand = brandTheme.brand.name;
    initializationState.material = getBrandMaterial(brandTheme) ?? 'sandstone';
  }
}

function _applyBrandLockedMaterial(brandTheme, rootNode) {
  const lockName = brandTheme.material?.name;
  if (!lockName) return;

  // Skip the round-trip through setMaterial — caller (setBaseBrand) already
  // resolved shadowRoot, and we'd just hit the same VALID_MATERIALS_SET
  // lookup. Set the attribute directly; preserve the brand-context warn
  // for unknown names so token-JSON typos surface clearly.
  if (VALID_MATERIALS_SET.has(lockName)) {
    rootNode?.setAttribute('data-dt-material', lockName);
    return;
  }

  console.warn(
    `[Dialtone] setBaseBrand: brand '${brandTheme.brand.name}' ` +
    `declares unknown material '${lockName}'; falling back to sandstone.`,
  );
  rootNode?.setAttribute('data-dt-material', 'sandstone');
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
    return;
  }

  const styleRoot = rootNode?.shadowRoot ?? rootNode;
  if (contrastTheme && contrastTheme.contrast) {
    _setStyleTag('dialtone-css-contrast', contrastTheme.contrast.css, styleRoot);
    rootNode?.setAttribute('data-dt-contrast', contrastTheme.contrast.name);
  } else {
    _removeStyleTag('dialtone-css-contrast', styleRoot);
    rootNode?.setAttribute('data-dt-contrast', 'default');
  }
}

/**
 * Set the active material — toggles `data-dt-material` on the rootNode. The
 * matching `[data-dt-material="<name>"][data-dt-mode="..."]` CSS (loaded once
 * in the layered bundle) re-binds `--dt-color-black-*` for that subtree.
 *
 * Pass `null`, `undefined`, or `'sandstone'` to clear the override (sandstone
 * is the default neutral ramp baked into the base CSS, so it has no override
 * selector — the attribute simply matches nothing and the bare base values
 * apply). Pass a known string name to apply that material.
 *
 * Unknown material names emit a `console.warn` and fall back to sandstone.
 *
 * @param {MaterialName|null} name - Material name, or null/undefined to reset to sandstone
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element to apply the attribute to
 *
 * @example
 * setMaterial('steel');
 * setMaterial(null); // back to default (sandstone)
 */
export function setMaterial (name, rootNode = document.documentElement) {
  if (name !== null && name !== undefined && typeof name !== 'string') {
    throw new TypeError(
      '[Dialtone] setMaterial: expected a string material name or null.',
    );
  }

  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to setMaterial(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
    return;
  }

  const resolved = name || 'sandstone';
  if (!VALID_MATERIALS_SET.has(resolved)) {
    console.warn(
      `[Dialtone] setMaterial: unknown material '${name}'; falling back to sandstone.`,
    );
    rootNode?.setAttribute('data-dt-material', 'sandstone');
    return;
  }

  rootNode?.setAttribute('data-dt-material', resolved);
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

  if (typeof brandTheme.brand.name !== 'string' || !brandTheme.brand.name || typeof brandTheme.brand.css !== 'string') {
    throw new TypeError(
      '[Dialtone] initDialtoneTheme: brandTheme.brand.name must be a non-empty string and brandTheme.brand.css must be a string.',
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
    return;
  }

  const styleRoot = rootNode?.shadowRoot ?? rootNode;

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
  const existing = initializationState;
  if (existing) {
    if (existing.brand === brandTheme.brand.name && existing.mode === mode) {
      console.warn(
        `[Dialtone] Theme already initialized with brand '${brandTheme.brand.name}' and mode '${mode}'. ` +
        'Re-applying the same theme may be unnecessary. ' +
        'If you need to switch themes dynamically, use setBaseBrand() or setMode() instead of calling initDialtoneTheme() again.',
      );
      return;
    } else {
      console.warn(
        `[Dialtone] Theme already initialized. ` +
        `Previous: brand='${existing.brand}', mode='${existing.mode}'. ` +
        `New: brand='${brandTheme.brand.name}', mode='${mode}'. ` +
        'Re-initializing with different parameters. Consider using setBaseBrand()/setMode() for dynamic switching.',
      );
      return;
    }
  }

  // Load core tokens (once per JavaScript instance)
  _setStyleTag('dialtone-css-core', Core.core, styleRoot);
  coreTokensLoaded = true;

  // Load base colors (once)
  _setStyleTag('dialtone-css-base-colors', Core.baseColors, styleRoot);

  // Set initial mode
  setMode(mode, rootNode);

  // Seed defaults; setBaseBrand may override `data-dt-material` below if the brand declares a lock.
  rootNode?.setAttribute('data-dt-contrast', 'default');
  rootNode?.setAttribute('data-dt-material', 'sandstone');

  // Set initial brand (auto-applies brand-locked material if declared)
  setBaseBrand(brandTheme, rootNode);

  // Track initialization state for future idempotency checks
  initializationState = {
    brand: brandTheme.brand.name,
    mode: mode,
    contrast: 'default',
    material: getBrandMaterial(brandTheme) ?? 'sandstone',
  };
}

/**
 * @param {BrandTheme} brandTheme
 * @returns {string|null} the locked material name, or null when the brand is free-choice
 */
export function getBrandMaterial(brandTheme) {
  return brandTheme?.material?.name ?? null;
}

/**
 * @param {BrandTheme} brandTheme
 * @returns {boolean}
 */
export const hasBrandMaterialLock = (brandTheme) => getBrandMaterial(brandTheme) !== null;

/**
 * Reset theme for a given rootNode - useful for testing and cleanup
 *
 * Removes all theme styles, attributes, and initialization state for the specified rootNode.
 * This allows re-initialization with a clean slate, which is particularly useful in test
 * environments or when unmounting micro-frontends.
 *
 * Note: In micro-frontend architectures where each app has its own bundle,
 * this resets the state for the current JavaScript instance only.
 *
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element to reset
 *
 * @example
 * // Reset document theme (test cleanup)
 * import { resetBrand } from '@dialpad/dialtone/themes/config';
 * afterEach(() => {
 *   resetBrand();  // Clean slate for next test
 * });
 *
 * @example
 * // Reset Shadow DOM theme (component unmount)
 * class MyWidget extends HTMLElement {
 *   disconnectedCallback() {
 *     resetBrand(this);  // Clean up when component removed
 *   }
 * }
 */
/** @deprecated Use setBrand instead */
export const setTheme = setBrand;
/** @deprecated Use resetBrand instead */
export const resetTheme = resetBrand;
export function resetBrand(rootNode = document.documentElement) {
  if (rootNode instanceof ShadowRoot) {
    console.warn(
      '[Dialtone] You passed a ShadowRoot directly to resetBrand(). ' +
      'Please pass the host element instead. The function will access shadowRoot automatically.',
    );
    return;
  }

  const styleRoot = rootNode?.shadowRoot ?? rootNode;

  // Clear initialization state (only one instance per app)
  initializationState = null;
  coreTokensLoaded = false;

  // Remove all theme style tags. Material no longer injects a style tag
  // (attribute-driven), but resetBrand should still scrub any pre-existing
  // injection from older code paths.
  _removeStyleTag('dialtone-css-core', styleRoot);
  _removeStyleTag('dialtone-css-base-colors', styleRoot);
  _removeStyleTag('dialtone-css-material', styleRoot);
  _removeStyleTag('dialtone-css-brand-base', styleRoot);
  _removeStyleTag('dialtone-css-brand', styleRoot);
  _removeStyleTag('dialtone-css-contrast', styleRoot);

  // Remove theme attributes from the host element (not ShadowRoot — it has no removeAttribute)
  rootNode?.removeAttribute('data-dt-mode');
  rootNode?.removeAttribute('data-dt-brand');
  rootNode?.removeAttribute('data-dt-contrast');
  rootNode?.removeAttribute('data-dt-material');
}
