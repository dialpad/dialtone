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
 * Standard brand themes (alphabetical order)
 * Used for UI grouping in theme selection dropdowns
 *
 * @constant {string[]} STANDARD_THEMES
 */
export const STANDARD_THEMES = [
  'aegean',
  'alpine',
  'arctic',
  'aurora',
  'autumn',
  'blue-hour',
  'botany',
  'brick',
  'buttercream',
  'cactus-bloom',
  'cayenne',
  'cedar-grove',
  'cobalt',
  'copper',
  'coral-reef',
  'dragonfruit',
  'eucalyptus',
  'fjord',
  'high-desert',
  'inkberry',
  'kiln',
  'lavender',
  'marigold',
  'melon',
  'mulberry',
  'mushroom',
  'nightshade',
  'paprika',
  'peach-blossom',
  'plum',
  'poppy-field',
  'raincloud',
  'rhubarb',
  'rust-harbor',
  'sea-glow',
  'seashell',
  'solstice',
  'storm',
  'sunflower',
  'tropical-night',
  'verdant-haze',
  'wildflower',
  'wineberry',
  'winter-gold',
  'woodland',
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
