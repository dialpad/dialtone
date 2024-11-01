const { REGEX_OPTIONS } = require('./constants.cjs');

function _pascalToKebabCase (string) {
  return string.split(/(?=[A-Z]|[0-9]{3,}?)/).join('-').toLowerCase();
}

function _removePrefixFromColor (colorName) {
  return colorName
    .replace('--dt-theme-', '')
    .replace(/--dt-color-((foreground|surface|border)-)?/, '');
}

module.exports = {

  processColors (result, color) {
    const token = `--${_pascalToKebabCase(color[0])}`;
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
    const prefixRegex = new RegExp(`\\.(${REGEX_OPTIONS.HOVER_FOCUS_PREFIXES})\\\\:`);
    if (prefixRegex.test(selector)) {
      return selector;
    }
    const hoverSelector = selector.replaceAll('.', '.h\\:').concat(':hover');
    const focusSelector = selector.replaceAll('.', '.f\\:').concat(':focus');
    const focusWithinSelector = selector.replaceAll('.', '.f\\:').concat(':focus-within');
    const focusVisibleSelector = selector.replaceAll('.', '.fv\\:').concat(':focus-visible');
    return `${selector}, ${hoverSelector}, ${focusSelector}, ${focusWithinSelector}, ${focusVisibleSelector}`;
  },
};
