import { inject, computed, onMounted, onUnmounted, ref } from 'vue';
import { NAMED_THEMES, NUMBERED_THEMES, ALL_THEME_IDS } from '../constants/themes.js';
import { formatThemeName } from '../utils/formatThemeName.js';
import { syncBrowserThemeColor } from '../utils/browserThemeColor.js';
import {
  setMode as setModeConfig,
  setBrand,
  setContrast as setContrastConfig,
  setMaterial as setMaterialConfig,
  getBrandMaterial,
} from '@dialpad/dialtone-tokens/themes/config';

const DEFAULT_MATERIAL = 'sandstone';
const MATERIALS = Object.freeze([DEFAULT_MATERIAL, 'steel', 'graphite', 'iron', 'amethyst', 'jade']);

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
  const currentMaterial = inject('currentMaterial');
  const themes = inject('themes');

  // Constants
  const modes = ['system', 'light', 'dark'];

  // SSR-safe: Initialize media query in onMounted
  let prefersDarkMediaQuery = null;

  // Reactive ref for system preference (for resolvedMode)
  const systemPrefersDark = ref(false);

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

  // `themes` is provided synchronously in `enhance` (client.js), before any
  // component mounts — so it's safe to read non-reactively here.
  const activeBrandModule = computed(() => themes?.[currentTheme.value] ?? null);
  const lockedMaterial = computed(() => getBrandMaterial(activeBrandModule.value));
  const isMaterialLocked = computed(() => lockedMaterial.value !== null);
  const displayedMaterial = computed(() => lockedMaterial.value ?? currentMaterial.value);

  /**
   * Computed resolved mode that converts 'system' to actual 'light' or 'dark'
   * Reactively updates when system preference changes
   * @returns {string} 'light' or 'dark'
   */
  const resolvedMode = computed(() => {
    if (currentMode.value === 'system') {
      return systemPrefersDark.value ? 'dark' : 'light';
    }
    return currentMode.value;
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
   * Sets the active material (sandstone, steel, graphite, iron).
   * Sandstone is the default — passing 'sandstone' (or anything unrecognized) removes any override.
   * @param {string} material - The material name
   */
  const setMaterial = (material) => {
    if (!MATERIALS.includes(material)) {
      console.warn(`[useThemeManager] Unknown material '${material}'. Falling back to '${DEFAULT_MATERIAL}'.`);
      material = DEFAULT_MATERIAL;
    }
    currentMaterial.value = material;
    setCss();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferredMaterial', material);
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
    // DP is the base brand — clearing the overlay reverts to it.
    if (brandName === 'dp') {
      setBrand(null, document.documentElement);
      return;
    }

    const theme = themes && themes[brandName];

    if (!theme) {
      console.warn(`[useThemeManager] Theme "${brandName}" not found in loaded themes`);
      return;
    }

    if (!theme.brand?.css) {
      console.warn(`[useThemeManager] Theme "${brandName}" missing brand.css property`);
      return;
    }

    setBrand(theme, document.documentElement);
  };

  /**
   * Applies the selected material via the shared setMaterial config function.
   * Material switching is attribute-only — `setMaterialConfig` toggles
   * `data-dt-material` and the pre-bundled per-material CSS handles the rest.
   * @param {string} material - The material name
   */
  const applyMaterialTheme = (material) => {
    setMaterialConfig(material === DEFAULT_MATERIAL ? null : material, document.documentElement);
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
    // displayedMaterial supersedes currentMaterial on locked brands, so the
    // user's saved preference is preserved for round-trip back to dp/tmo.
    const material = displayedMaterial.value || DEFAULT_MATERIAL;

    // Use shared setMode function from config.js (handles attribute setting)
    setModeConfig(mode, document.documentElement);

    if (!isMaterialLocked.value) {
      applyMaterialTheme(material);
    }
    applyBrandTheme(brandName);
    applyContrastTheme(contrast);
    syncBrowserThemeColor();
  };

  // Handler to update both CSS and reactive ref when system preference changes
  const handleSystemPreferenceChange = () => {
    systemPrefersDark.value = prefersDarkMediaQuery?.matches ?? false;
    setCss();
  };

  // Lifecycle: Initialize and listen for system theme changes
  onMounted(() => {
    // Initialize media query listener (client-side only)
    if (typeof window !== 'undefined') {
      prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      systemPrefersDark.value = prefersDarkMediaQuery.matches;
      prefersDarkMediaQuery.addEventListener('change', handleSystemPreferenceChange);
    }
    setCss();
  });

  onUnmounted(() => {
    // Clean up media query listener
    if (prefersDarkMediaQuery) {
      prefersDarkMediaQuery.removeEventListener('change', handleSystemPreferenceChange);
    }
  });

  // Return public API
  return {
    // State (refs from inject)
    currentMode,
    currentTheme,
    currentContrast,
    currentMaterial,
    themes,

    // Computed
    currentModeIconName,
    resolvedMode,
    isMaterialLocked,
    lockedMaterial,
    displayedMaterial,

    // Methods
    setMode,
    setContrast,
    setMaterial,
    setTheme,

    // Theme utilities (only when includeThemes is enabled)
    namedThemes: computed(() => NAMED_THEMES),
    numberedThemes: computed(() => NUMBERED_THEMES),
    allThemeIds: computed(() => ALL_THEME_IDS),
    formatThemeName,

    // Constants
    modes,
    materials: MATERIALS,
  };
}
