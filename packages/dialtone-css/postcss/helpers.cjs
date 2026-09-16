function _generateTokenName (string) {
  return string
    .split(/([A-Z][a-z]+)(\d{2,})?/)
    .filter(item => !!item)
    .join('-')
    .toLowerCase();
}

function _removePrefixFromColor (colorName) {
  return colorName
    .replace('--dt-theme-', '')
    .replace(/--dt-color-((foreground|surface|border)-)?/, '');
}

module.exports = {

  processColors (result, color) {
    const token = `--${_generateTokenName(color[0])}`;
    const hexValue = color[1];
    const colorName = _removePrefixFromColor(token);
    result.push({ token, hexValue, colorName });
    return result;
  },

  /**
  * Pass a selector to this function to generate hover / focus selectors
  * of it prefixed with h:, f: and fv:
  * @param {String} selector
  * @returns String
  */
  appendHoverFocusSelectors (selector) {
    const hoverSelector = selector.replaceAll('.', '.h\\:').concat(':hover');
    const focusSelector = selector.replaceAll('.', '.f\\:').concat(':focus');
    const focusWithinSelector = selector.replaceAll('.', '.f\\:').concat(':focus-within');
    const focusVisibleSelector = selector.replaceAll('.', '.fv\\:').concat(':focus-visible');
    return `${selector}, ${hoverSelector}, ${focusSelector}, ${focusWithinSelector}, ${focusVisibleSelector}`;
  },

  /**
   * Convert camelCase token names to kebab-case with dashes
   * @param {String} string - Token name in camelCase (e.g. 'dtColorBorderSubtle')
   * @returns {String} Kebab-case token name (e.g. 'dt-color-border-subtle')
   */
  generateTokenName: _generateTokenName,
};
