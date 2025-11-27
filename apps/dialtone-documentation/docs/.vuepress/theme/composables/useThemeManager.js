import { inject, computed, onMounted, onUnmounted } from 'vue';
import { NAMED_THEMES, NUMBERED_THEMES, ALL_THEME_IDS } from '../constants/themes.js';
import { formatThemeName } from '../utils/formatThemeName.js';
import {
  setMode as setModeConfig,
  setBrand,
  setContrast as setContrastConfig,
} from '@dialpad/dialtone-tokens/themes/config';

/**
 * Composable for managing theme, mode, and contrast settings across the documentation site.
 * Provides centralized theme management logic that can be used in Navbar, markdown pages, and components.
 *
 * This composable wraps the shared theme management functions from @dialpad/dialtone-tokens/themes/config
 * and adds documentation-site-specific features like system mode detection, localStorage persistence,
 * and Vue reactive state management.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} [options.includeThemes=false] - Whether to enable theme switching functionality
 * @returns {Object} Theme management state and methods
 */
export function useThemeManager(options = {}) {
  const {
    includeThemes = false,
  } = options;

  // Inject global state from client.js
  const currentMode = inject('currentMode');
  const currentTheme = inject('currentTheme');
  const currentContrast = inject('currentContrast');
  const themes = inject('themes');

  // Constants
  const modes = ['system', 'light', 'dark'];

  // SSR-safe: Initialize media query in onMounted
  let prefersDarkMediaQuery = null;

  /**
   * Computed icon name based on current mode
   * @returns {string} Icon name for current mode
   */
  const currentModeIconName = computed(() => {
    switch (currentMode.value) {
      case 'dark':
        return 'moon';
      case 'light':
        return 'sun';
      default:
        return 'circle-half-filled';
    }
  });

  /**
   * Sets the color mode (system, light, or dark)
   * @param {string} mode - The mode to set
   */
  const setMode = (mode) => {
    currentMode.value = mode;
    setCss();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferredMode', mode);
    }
  };

  /**
   * Sets the contrast level (default or high)
   * @param {string} contrast - The contrast level to set
   */
  const setContrast = (contrast) => {
    currentContrast.value = contrast;
    setCss();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferredContrast', contrast);
    }
  };

  /**
   * Sets the brand theme (dp, tmo, numbered themes, etc.)
   * Only functional when includeThemes is true
   * @param {string} theme - The theme to set
   */
  const setTheme = (theme) => {
    if (!includeThemes) {
      console.warn('[useThemeManager] Theme switching disabled. Use includeThemes: true to enable.');
      return;
    }
    currentTheme.value = theme;
    setCss();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferredTheme', theme);
    }
  };

  /**
   * Applies brand theme using shared config.js function
   * @param {string} brandName - The brand theme name
   */
  const applyBrandTheme = (brandName) => {
    // DP is the base theme - for docs site, we don't need to apply brand overrides for DP
    // since the base DP theme CSS is already loaded in the HTML
    // For non-DP brands, we apply the brand override using the shared setBrand function
    if (brandName !== 'dp') {
      const theme = themes && themes[brandName];

      if (!theme) {
        console.warn(`[useThemeManager] Theme "${brandName}" not found in loaded themes`);
        return;
      }

      if (!theme.brand?.css) {
        console.warn(`[useThemeManager] Theme "${brandName}" missing brand.css property`);
        return;
      }

      // Use shared setBrand function from config.js
      setBrand(theme, document.documentElement);
    }
    // Note: The shared setBrand function handles style tag creation, updates, and cleanup
  };

  /**
   * Applies contrast theme using shared config.js function
   * @param {string} contrast - The contrast level (default or high)
   */
  const applyContrastTheme = (contrast) => {
    if (contrast === 'high') {
      const contrastTheme = themes && themes['high-contrast'];

      if (!contrastTheme) {
        console.warn('[useThemeManager] High contrast theme not found in loaded themes');
        return;
      }

      if (!contrastTheme.contrast?.css) {
        console.warn('[useThemeManager] High contrast theme missing contrast.css property');
        return;
      }

      // Use shared setContrast function from config.js
      setContrastConfig(contrastTheme, document.documentElement);
    } else {
      // Remove contrast by passing null (shared function handles cleanup)
      setContrastConfig(null, document.documentElement);
    }
  };

  /**
   * Applies current theme/mode/contrast settings to the DOM
   * Uses shared config.js functions for theme management
   */
  // eslint-disable-next-line complexity
  const setCss = () => {
    // SSR guard - do nothing during server-side rendering
    if (typeof document === 'undefined') return;

    // Validate mode
    if (!modes.includes(currentMode.value)) {
      currentMode.value = 'system';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('preferredMode', currentMode.value);
      }
    }

    // Resolve system mode to actual light/dark
    const mode = currentMode.value === 'system'
      ? (prefersDarkMediaQuery?.matches ? 'dark' : 'light')
      : currentMode.value;

    const brandName = currentTheme.value || 'dp';
    const contrast = currentContrast.value || 'default';

    // Use shared setMode function from config.js (handles attribute setting)
    setModeConfig(mode, document.documentElement);

    // Set brand attribute manually (setBrand will handle the style injection)
    document.documentElement.setAttribute('data-dt-brand', brandName);

    // Apply brand and contrast themes using shared functions
    applyBrandTheme(brandName);
    applyContrastTheme(contrast);
  };

  // Lifecycle: Initialize and listen for system theme changes
  onMounted(() => {
    // Initialize media query listener (client-side only)
    if (typeof window !== 'undefined') {
      prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      prefersDarkMediaQuery.addEventListener('change', setCss);
    }
    setCss();
  });

  onUnmounted(() => {
    // Clean up media query listener
    if (prefersDarkMediaQuery) {
      prefersDarkMediaQuery.removeEventListener('change', setCss);
    }
  });

  // Return public API
  return {
    // State (refs from inject)
    currentMode,
    currentTheme,
    currentContrast,
    themes,

    // Computed
    currentModeIconName,

    // Methods
    setMode,
    setContrast,
    setTheme,

    // Theme utilities (only when includeThemes is enabled)
    namedThemes: computed(() => NAMED_THEMES),
    numberedThemes: computed(() => NUMBERED_THEMES),
    allThemeIds: computed(() => ALL_THEME_IDS),
    formatThemeName,

    // Constants
    modes,
  };
}
