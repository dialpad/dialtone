const Color = require('colorjs.io').default;
const {
  IS_COLOR_REGEX,
  IS_THEME_COLOR_REGEX,
  IS_SHADOW_REGEX,
  IS_TYPOGRAPHY_REGEX,
  REGEX_OPTIONS,
  OKLCH_EXCLUDED_COLORS,
} = require('./constants.cjs');

/**
 * Generate OKLCH CSS Variables for a color declaration
 */
function generateColorOklch (declaration) {
  const isOklch = ['-h', '-c', '-l', '-a', '-oklch', '-oklcha'].some(suffix => declaration.prop.endsWith(suffix));
  const isReferenceToken = (value) => value.includes('var(--');
  const shouldHaveOklchGenerated = (prop) =>
    (IS_COLOR_REGEX.test(prop) || IS_THEME_COLOR_REGEX.test(prop)) &&
    !isOklch &&
    !OKLCH_EXCLUDED_COLORS.includes(prop);

  if (!shouldHaveOklchGenerated(declaration.prop)) return;

  if (isReferenceToken(declaration.value)) {
    const varName = declaration.value.substring(4, declaration.value.length - 1);
    declaration.before({ prop: `${declaration.prop}-l`, value: `var(${varName}-l)` });
    declaration.before({ prop: `${declaration.prop}-c`, value: `var(${varName}-c)` });
    declaration.before({ prop: `${declaration.prop}-h`, value: `var(${varName}-h)` });
    declaration.before({ prop: `${declaration.prop}-a`, value: `var(${varName}-a)` });
    declaration.before({ prop: `${declaration.prop}-oklch`, value: `var(${varName}-oklch)` });
    declaration.before({ prop: `${declaration.prop}-oklcha`, value: `var(${varName}-oklcha)` });
    return;
  }

  const color = new Color(declaration.value).to('oklch');
  let [lightness, chroma, hue] = color.coords;
  const alpha = color.alpha?.raw || color.alpha;
  lightness = lightness?.raw || lightness;
  chroma = chroma?.raw || chroma;
  hue = hue?.raw || (isNaN(hue) ? 0 : hue);

  declaration.before({ prop: `${declaration.prop}-l`, value: `${lightness}` });
  declaration.before({ prop: `${declaration.prop}-c`, value: `${chroma}` });
  declaration.before({ prop: `${declaration.prop}-h`, value: `${hue}` });
  declaration.before({ prop: `${declaration.prop}-a`, value: `${alpha}` });
  declaration.before({ prop: `${declaration.prop}-oklch`, value: `var(${declaration.prop}-l) var(${declaration.prop}-c) var(${declaration.prop}-h)` });
  declaration.before({ prop: `${declaration.prop}-oklcha`, value: `oklch(var(${declaration.prop}-l) var(${declaration.prop}-c) var(${declaration.prop}-h) / var(--alpha, ${alpha}))` });
}

/**
 * Compose typography tokens within a selector
 */
function typography (typographyDeclarations, Declaration, parentRule) {
  const typographySegmentsRegex = new RegExp(`--dt-typography-(${REGEX_OPTIONS.TYPOGRAPHY_TYPE})-?(${REGEX_OPTIONS.TYPOGRAPHY_SIZES})?-?(${REGEX_OPTIONS.TYPOGRAPHY_VARIABLES})?-?(${REGEX_OPTIONS.TYPOGRAPHY_VARIABLES})?-?(.+)`);
  const typographyMap = typographyDeclarations.map(m => m.prop).filter(prop => !prop.endsWith('-font-family'))
    .reduce((typographies, typography) => {
      const matches = typography
        .split(typographySegmentsRegex)
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
  const shadowSegmentsRegex = new RegExp(`--dt-shadow-(${REGEX_OPTIONS.SHADOW_VARIABLES})-?([0-9])?-(\\w+)`);
  const shadowMap = shadowDeclarations.map(m => m.prop)
    .reduce((shadows, shadow) => {
      const [name, index] = shadow
        .split(shadowSegmentsRegex).slice(1, -1);
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
    // Process each declaration to generate OKLCH components
    Declaration (declaration) {
      generateColorOklch(declaration);
    },
  };
};

module.exports.postcss = true;
