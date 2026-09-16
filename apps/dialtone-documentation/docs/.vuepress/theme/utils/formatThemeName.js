import { THEME_DISPLAY_NAMES } from '../constants/themes.js';

/**
 * Formats a theme ID into a human-readable display name
 *
 * Handles special cases for branded themes (dp, tmo) and accessibility themes,
 * then falls back to title-casing hyphenated names.
 *
 * @param {string} themeId - The theme identifier (e.g., 'dp', 'aegean', 'blue-hour')
 * @returns {string} Formatted display name
 *
 * @example
 * formatThemeName('dp')           // 'Dialpad (Base)'
 * formatThemeName('tmo')          // 'T-Mobile'
 * formatThemeName('aegean')       // 'Aegean'
 * formatThemeName('high-desert')  // 'High Desert'
 * formatThemeName('blue-hour')    // 'Blue Hour'
 * formatThemeName('prota-deuter') // 'Protanopia/Deuteranopia'
 */
export function formatThemeName(themeId) {
  // Check for explicit display name mapping
  if (THEME_DISPLAY_NAMES[themeId]) {
    return THEME_DISPLAY_NAMES[themeId];
  }

  // Default: Title-case hyphenated names
  return themeId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
