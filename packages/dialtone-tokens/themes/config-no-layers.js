import CoreNoLayers from '@/themes/core-no-layers.js';
import { initDialtoneTheme } from '@/themes/config.js';

/**
 * @typedef {import('./config.js').BrandTheme} BrandTheme
 * @typedef {import('./config.js').Mode} Mode
 * @typedef {import('./config.js').ThemeRootNode} ThemeRootNode
 */

/**
 * Initialize the Dialtone theme system for apps that can't use CSS Cascade
 * Layers — call once on app startup, in place of initDialtoneTheme(..., { layers: false }).
 *
 * Statically imports the no-layers core so it's available synchronously at
 * init time, unlike `initDialtoneTheme(..., { layers: false })`, which
 * resolves the no-layers core via a runtime dynamic import and therefore
 * applies its styles a moment after the call returns. Bundlers still only
 * ship the no-layers CSS string to apps that import from this entrypoint —
 * apps using the default layered `initDialtoneTheme` never pay for it.
 *
 * @param {BrandTheme} brandTheme - Initial brand theme to apply
 * @param {Mode} [mode='light'] - Initial color mode ('light' or 'dark')
 * @param {ThemeRootNode} [rootNode=document.documentElement] - Root element for style injection
 * @param {Object} [options={}] - Same options as initDialtoneTheme, minus `layers`/`core`
 *   (both are fixed by this entrypoint).
 *
 * @example
 * import { initDialtoneThemeNoLayers } from '@dialpad/dialtone-tokens/themes/config-no-layers';
 * import Dp from '@dialpad/dialtone-tokens/themes/dp.json';
 *
 * initDialtoneThemeNoLayers(Dp, 'light');
 */
export function initDialtoneThemeNoLayers(brandTheme, mode = 'light', rootNode = document.documentElement, options = {}) {
  return initDialtoneTheme(brandTheme, mode, rootNode, { ...options, layers: false, core: CoreNoLayers });
}
