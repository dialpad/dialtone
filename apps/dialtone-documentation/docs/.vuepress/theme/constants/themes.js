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
 * Appearance-mode options offered by the docs UI, in display order.
 *
 * @constant {string[]} MODES
 */
export const MODES = Object.freeze(['system', 'light', 'dark']);

/**
 * Mode applied to first-time visitors, before any stored preference exists.
 *
 * @constant {string} DEFAULT_MODE
 */
export const DEFAULT_MODE = 'dark';

/**
 * Material applied when none is stored. `setMaterial(null)` is the token API's way
 * of expressing this one, since no `[data-dt-material="sandstone"]` selector exists.
 *
 * @constant {string} DEFAULT_MATERIAL
 */
export const DEFAULT_MATERIAL = 'sandstone';
