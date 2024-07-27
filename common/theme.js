/* eslint-disable complexity */
import { THEMES, BRANDS, THEME_MAP, BRAND_MAP } from './constants';

let currentTheme = 'system';
let currentBrand = 'dp';

globalThis.setDialtoneTheme = setTheme;

/**
 * Set the current theme and optionally the brand
 * @param theme the theme to set. Must be one of 'light' or 'dark'
 * @param brand the brand to set. Must be one of 'dp', 'tmo', 'expressive', 'expressive-sm' if null, the current brand will be retained
 * @throws Error if the theme or brand are invalid
 */
export function setTheme (theme, brand = null) {
  if (!THEMES.includes(theme)) {
    throw new Error(`${theme} is not a valid theme. Valid themes are ${THEMES.join(', ')}`);
  }
  if (brand && !BRANDS.includes(brand)) {
    throw new Error(`${brand} is not a valid brand. Valid brands are ${BRANDS.join(', ')} or leave undefined to retain the current brand.`);
  }

  currentTheme = theme;

  if (theme === 'system') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    } else {
      currentTheme = 'light';
    }
  }

  if (brand) {
    currentBrand = brand;
  }

  // Load css files
  _setStyleTag('dialtone-css-theme', THEME_MAP[currentTheme]);
  _setStyleTag('dialtone-css-brand', BRAND_MAP[currentBrand][currentTheme]);
  _setThemeAttributeOnRoot(currentTheme, currentBrand);
}

/**
 * Set the content of a style tag with the given id, create it if the id doesn't exist.
 */
function _setStyleTag (id, content) {
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', id);
    style.innerHTML = content;
    document.head.appendChild(style);
  } else {
    document.getElementById(id).innerHTML = content;
  }
}

/**
 * Set the dialtone theme and brand custom attributes on the root element
 */
function _setThemeAttributeOnRoot (theme, brand) {
  document.documentElement.setAttribute('data-dt-theme', theme);
  document.documentElement.setAttribute('data-dt-brand', brand);
}
