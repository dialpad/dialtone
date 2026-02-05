/**
 * Theme System Constants
 *
 * Single source of truth for all theme-related metadata in the Dialtone documentation site.
 * This file defines the complete list of available themes, their display names, and
 * organizational structure for UI presentation.
 *
 * Note: Theme management now uses shared functions from @dialpad/dialtone-tokens/themes/config
 * which handle style tag IDs internally ('dialtone-css-brand-colors', 'dialtone-css-contrast').
 *
 * @module theme/constants/themes
 */

/**
 * Color assistive themes for accessibility
 * Optimized for color vision deficiencies
 *
 * @constant {string[]} COLOR_ASSISTIVE_THEMES
 */
export const COLOR_ASSISTIVE_THEMES = [
  'prota-deuter',
  'trita',
];

/**
 * Named themes that have official marketing names (alphabetical order)
 * Used for UI grouping in theme selection dropdowns
 *
 * @constant {string[]} NAMED_THEMES
 */
export const NAMED_THEMES = [
  'aegean',
  'botany',
  'buttercream',
  // 'ceruleo',
  'high-desert',
  'melon',
  'plum',
  'sunflower',
  'verdant-haze',
];

/**
 * Numbered experimental themes (101-137)
 * These themes are awaiting final marketing names
 *
 * @constant {string[]} NUMBERED_THEMES
 */
export const NUMBERED_THEMES = [
  '101', '102', '103', '104', '105', '106', '107', '108', '109', '110',
  '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
  '121', '122', '123', '124', '125', '126', '127', '128', '129', '130',
  '131', '132', '133', '134', '135', '136', '137',
];

/**
 * Complete list of theme IDs in display order.
 * This order must match the import sequence in client.js for proper theme loading.
 *
 * Structure:
 * 1. Base theme (dp) - Foundation for all other themes
 * 2. Partner themes (tmo) - Brand partner customizations
 * 3. Color assistive themes (prota-deuter, trita) - Accessibility variants
 * 4. Named themes - Production-ready themes with marketing names (alphabetical)
 * 5. Numbered themes (101-137) - Experimental themes awaiting final names
 *
 * @constant {string[]} ALL_THEME_IDS
 */
export const ALL_THEME_IDS = [
  // Base theme
  'dp',
  // Partner themes
  'tmo',
  // Color assistive themes (accessibility)
  ...COLOR_ASSISTIVE_THEMES,
  // Named themes (alphabetical)
  ...NAMED_THEMES,
  // Numbered themes (experimental - not yet named)
  ...NUMBERED_THEMES,
];

/**
 * Display names for themes that require special formatting
 * If a theme ID is not in this map, formatThemeName will auto-generate a title-case name
 *
 * @constant {Object.<string, string>} THEME_DISPLAY_NAMES
 */
export const THEME_DISPLAY_NAMES = {
  'dp': 'Dialpad (Base)',
  'tmo': 'T-Mobile',
  'prota-deuter': 'Protanopia/Deuteranopia',
  'trita': 'Tritanopia',
};

/**
 * Categorized theme groups for UI organization
 * Used to structure theme selection dropdowns with logical groupings
 *
 * @constant {Object} THEME_CATEGORIES
 */
export const THEME_CATEGORIES = {
  base: ['dp'],
  partner: ['tmo'],
  accessibility: COLOR_ASSISTIVE_THEMES,
  named: NAMED_THEMES,
  experimental: NUMBERED_THEMES,
};
