/* eslint-disable complexity */
// Track if core tokens are loaded (for layered system)
let coreTokensLoaded = false;

/**
 * Set the current theme, brand, and optionally contrast - BACKWARD COMPATIBLE
 * Auto-detects legacy vs layered theme format
 * @param theme the theme object (legacy: {base, brand} or layered: {core, brand, contrast})
 * @param rootNode optional, the root node to apply the theme to
 * @param contrastTheme optional contrast theme object (legacy only)
 */
export function setTheme (theme, rootNode = document.documentElement, contrastTheme = null) {
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

  // Load core tokens only once
  if (theme.core && !coreTokensLoaded) {
    _setStyleTag('dialtone-css-core', theme.core, rootNode);
    coreTokensLoaded = true;
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
    rootNode.querySelector('#' + id).innerHTML = content;
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
 * Set mode (light/dark) - instant switching with layered system
 * @param mode 'light' or 'dark'
 * @param rootNode optional root element
 */
export function setMode(mode, rootNode = document.documentElement) {
  if (mode !== 'light' && mode !== 'dark') {
    console.warn(`Invalid mode: ${mode}. Must be 'light' or 'dark'`);
    return;
  }
  rootNode?.setAttribute('data-dt-mode', mode);
}

/**
 * Set brand - loads brand override CSS
 * @param brandTheme theme object with brand property
 * @param rootNode optional root element
 */
export function setBrand(brandTheme, rootNode = document.documentElement) {
  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  if (brandTheme.brand) {
    _setStyleTag('dialtone-css-brand-colors', brandTheme.brand.css, rootNode);
    rootNode?.setAttribute('data-dt-brand', brandTheme.brand.name);
  }
}

/**
 * Set contrast level
 * @param contrastTheme theme object with contrast property, or null for default
 * @param rootNode optional root element
 */
export function setContrast(contrastTheme, rootNode = document.documentElement) {
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
 * @param coreTheme theme object with core and baseColors properties
 * @param brandTheme initial brand theme
 * @param mode initial mode ('light' or 'dark')
 * @param rootNode optional root element
 */
export function initDialtoneTheme(coreTheme, brandTheme, mode = 'light', rootNode = document.documentElement) {
  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  // Load core tokens (once)
  if (coreTheme.core) {
    _setStyleTag('dialtone-css-core', coreTheme.core, rootNode);
    coreTokensLoaded = true;
  }

  // Load base colors (once)
  if (coreTheme.baseColors) {
    _setStyleTag('dialtone-css-base-colors', coreTheme.baseColors, rootNode);
  }

  // Set initial mode
  setMode(mode, rootNode);

  // Set initial brand
  setBrand(brandTheme, rootNode);

  // Set default contrast
  rootNode?.setAttribute('data-dt-contrast', 'default');
}
