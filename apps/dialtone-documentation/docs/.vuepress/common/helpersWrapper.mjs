// dynamically import the CommonJS module
let extractColors, appendHoverFocusSelectors, extractShadows, extractTypographies, removePrefixFromColor;

async function loadHelpers() {
  const helpers = await import('@dialpad/dialtone/postcss/helpers.mjs');
  extractColors = helpers.extractColors;
  appendHoverFocusSelectors = helpers.appendHoverFocusSelectors;
  extractShadows = helpers.extractShadows;
  extractTypographies = helpers.extractTypographies;
  removePrefixFromColor = helpers.removePrefixFromColor;
}

// call the function to load helpers
loadHelpers().catch(error => console.error('Failed to load helpers:', error));

// re-export the functions
export { extractColors, appendHoverFocusSelectors, extractShadows, extractTypographies, removePrefixFromColor };
