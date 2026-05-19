const {
  IS_SHADOW_REGEX,
  IS_TYPOGRAPHY_REGEX,
  REGEX_OPTIONS,
} = require('./constants.cjs');

// Hoisted to module scope — read-only and the plugin runs them per selector
// across the whole layered build.
const TYPOGRAPHY_SEGMENTS_REGEX = new RegExp(`--dt-typography-(${REGEX_OPTIONS.TYPOGRAPHY_TYPE})-?(${REGEX_OPTIONS.TYPOGRAPHY_SIZES})?-?(${REGEX_OPTIONS.TYPOGRAPHY_VARIABLES})?-?(${REGEX_OPTIONS.TYPOGRAPHY_VARIABLES})?-?(.+)`);
const SHADOW_SEGMENTS_REGEX = new RegExp(`--dt-shadow-(${REGEX_OPTIONS.SHADOW_VARIABLES})-?([0-9])?-(\\w+)`);

/**
 * Compose typography tokens within a selector
 */
function typography (typographyDeclarations, Declaration, parentRule) {
  const typographyMap = typographyDeclarations.map(m => m.prop).filter(prop => !prop.endsWith('-font-family'))
    .reduce((typographies, typography) => {
      const matches = typography
        .split(TYPOGRAPHY_SEGMENTS_REGEX)
        .filter(chunk => !!chunk);

      matches.pop();
      typographies.add(matches.join('-'));
      return typographies;
    }, new Set());

  typographyMap.forEach(typographyName => {
    const composedVar = `--dt-typography-${typographyName}`;
    const value = `var(${composedVar}-font-weight) var(${composedVar}-font-size)/var(${composedVar}-line-height) var(${composedVar}-font-family)`;
    parentRule.append(new Declaration({ prop: composedVar, value }));
  });
}

/**
 * Compose box shadow tokens within a selector
 */
function boxShadows (shadowDeclarations, Declaration, parentRule) {
  const shadowMap = shadowDeclarations.map(m => m.prop)
    .reduce((shadows, shadow) => {
      const [name, index] = shadow
        .split(SHADOW_SEGMENTS_REGEX).slice(1, -1);
      // Track the maximum layer index for multi-layer shadows
      const layerIndex = Number.isNaN(Number.parseInt(index)) ? 1 : Number.parseInt(index);
      shadows[name] = Math.max(shadows[name] || 0, layerIndex);
      return shadows;
    }, {});

  Object.keys(shadowMap).forEach(shadowName => {
    const shadowVar = `--dt-shadow-${shadowName}`;
    const isInset = shadowName.includes('inset');
    const times = shadowMap[shadowName];
    const value = Array(times)
      .fill(undefined)
      .map((val, i) => {
        let shadowNumber = `-${i + 1}`;
        if (times === 1) {
          shadowNumber = '';
        }
        return `var(${shadowVar}${shadowNumber}-offset-x) var(${shadowVar}${shadowNumber}-offset-y) var(${shadowVar}${shadowNumber}-blur) var(${shadowVar}${shadowNumber}-spread) var(${shadowVar}${shadowNumber}-color)${isInset ? ' inset' : ''}`;
      }).join(', ');

    parentRule.append(new Declaration({ prop: shadowVar, value }));
  });
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    postcssPlugin: 'layered-tokens',
    // Process each rule that matches our selectors
    Rule (rule, { Declaration }) {
      // Only process :root and [data-dt-mode] selectors
      if (rule.selector === ':root' || rule.selector.startsWith('[data-dt-mode')) {
        const shadows = rule.nodes.filter(node => node.type === 'decl' && IS_SHADOW_REGEX.test(node.prop));
        shadows.reverse();
        if (shadows.length > 0) {
          boxShadows(shadows, Declaration, rule);
        }

        const typographies = rule.nodes.filter(node => node.type === 'decl' && IS_TYPOGRAPHY_REGEX.test(node.prop));
        if (typographies.length > 0) {
          typography(typographies, Declaration, rule);
        }
      }
    },
  };
};

module.exports.postcss = true;
