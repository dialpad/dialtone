import { inject, computed, onMounted, onUnmounted } from 'vue';

/**
 * Composable for managing theme, mode, and contrast settings across the documentation site.
 * Provides centralized theme management logic that can be used in Navbar, markdown pages, and components.
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
   * Manages brand override style tag injection
   * @param {string} brandName - The brand theme name
   */
  const manageBrandOverride = (brandName) => {
    const brandOverrideTag = document.getElementById('dialtone-css-brand-override');

    if (brandName === 'dp') {
      // DP is the base theme - remove override if it exists
      if (brandOverrideTag) {
        brandOverrideTag.remove();
      }
    } else {
      // Load theme-specific overrides on top of DP
      const theme = themes && themes[brandName];
      if (theme && theme.brand && theme.brand.css) {
        if (!brandOverrideTag) {
          const newTag = document.createElement('style');
          newTag.id = 'dialtone-css-brand-override';
          newTag.type = 'text/css';
          newTag.innerHTML = theme.brand.css;
          document.head.appendChild(newTag);
        } else {
          brandOverrideTag.innerHTML = theme.brand.css;
        }
      }
    }
  };

  /**
   * Manages contrast override style tag injection
   * @param {string} contrast - The contrast level (default or high)
   */
  const manageContrastOverride = (contrast) => {
    const contrastTag = document.getElementById('dialtone-css-contrast');

    if (contrast === 'high') {
      const contrastTheme = themes && themes['high-contrast'];
      if (contrastTheme && contrastTheme.contrast && contrastTheme.contrast.css) {
        if (!contrastTag) {
          const newTag = document.createElement('style');
          newTag.id = 'dialtone-css-contrast';
          newTag.type = 'text/css';
          newTag.innerHTML = contrastTheme.contrast.css;
          document.head.appendChild(newTag);
        } else {
          contrastTag.innerHTML = contrastTheme.contrast.css;
        }
      }
    } else {
      // Remove contrast override when not needed
      if (contrastTag) {
        contrastTag.remove();
      }
    }
  };

  /**
   * Applies current theme/mode/contrast settings to the DOM
   * Manages CSS injection for brand overrides and high contrast
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

    // Set HTML attributes (required for CSS selectors)
    document.documentElement.setAttribute('data-dt-mode', mode);
    document.documentElement.setAttribute('data-dt-brand', brandName);
    document.documentElement.setAttribute('data-dt-contrast', contrast);

    // Manage style tag injections
    manageBrandOverride(brandName);
    manageContrastOverride(contrast);
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

    // Constants
    modes,
  };
}
