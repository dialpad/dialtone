const Color = require('colorjs.io').default;
const {
  PLATFORM_FONT_SIZES,
  Z_INDEX,
  IS_COLOR_REGEX,
  IS_THEME_COLOR_REGEX,
  IS_SHADOW_REGEX,
  IS_TYPOGRAPHY_REGEX,
  REGEX_OPTIONS,
  HSLA_EXCLUDED_COLORS,
} = require('./constants.cjs');

let newDocEntries = {};

/**
 * Compose typography tokens
 * @param { Declaration } declaration
 */
function typography (typographyDeclarations, Declaration) {
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

  typographyMap
    .forEach(typographyName => {
      const composedVar = `--dt-typography-${typographyName}`;
      const value = `var(${composedVar}-font-weight) var(${composedVar}-font-size)/var(${composedVar}-line-height) var(${composedVar}-font-family)`;
      typographyDeclarations.at(-1).after(new Declaration({ prop: composedVar, value }));
      newDocEntries[composedVar] = formatCompositionTokenForDocs(composedVar, value);
    });
}

/**
 * Compose box shadow tokens
 * @param { shadowDeclarations } array declarations related to shadow
 * @param { Declaration } declaration
 */
function boxShadows (shadowDeclarations, Declaration) {
  const shadowSegmentsRegex = new RegExp(`--dt-shadow-(${REGEX_OPTIONS.SHADOW_VARIABLES})-?([0-9])?-(\\w+)`);
  const shadowMap = shadowDeclarations.map(m => m.prop)
    .reduce((shadows, shadow) => {
      const [name, index] = shadow
        .split(shadowSegmentsRegex).slice(1, -1);
      // if not a number that means it's only a single shadow so set to 1.
      shadows[name] = Number.isNaN(Number.parseInt(index)) ? 1 : Number.parseInt(index);
      return shadows;
    }, {});

  Object
    .keys(shadowMap)
    .forEach(shadowName => {
      const shadowVar = `--dt-shadow-${shadowName}`;
      // in css inset shadows are defined by adding the inset keyword
      const isInset = shadowName.includes('inset');
      const times = shadowMap[shadowName];
      const value = Array(times)
        .fill(undefined)
        .map((val, i) => {
          let shadowNumber = `-${i + 1}`;
          // tokens no longer get numbered if there is only a single one, so if this is the case, do not number it.
          if (times === 1) {
            shadowNumber = '';
          }
          return `var(${shadowVar}${shadowNumber}-offset-x) var(${shadowVar}${shadowNumber}-offset-y) var(${shadowVar}${shadowNumber}-blur) var(${shadowVar}${shadowNumber}-spread) var(${shadowVar}${shadowNumber}-color)${isInset ? ' inset' : ''}`;
        }).join(', ');

      shadowDeclarations.at(0).after(new Declaration({ prop: shadowVar, value }));
      newDocEntries[shadowVar] = formatCompositionTokenForDocs(shadowVar, value);
    });
}

/**
 * Wrap the value in a calc function if it is not already wrapped.
 * Checks for multiplication and addition operators within the value.
 * @param { Declaration } declaration
 */
function wrapInCalc (declaration) {
  if ([' * ', ' + '].some(str => declaration.value.includes(str)) && !declaration.value.startsWith('calc')) {
    declaration.value = `calc(${declaration.value})`;
  }
}

/**
 * Generate HSL CSS Variables.
 * @param { Declaration } declaration
 */
function generateColorHsla (declaration) {
  // Prevent regenerating hsla variables that have already been generated, since postcss will run this
  // even for newly generated variables.
  const isHSLA = ['-h', '-s', '-l', '-a', '-hsl', '-hsla'].some(suffix => {
    if (declaration.prop.endsWith(suffix)) {
      return true;
    }
    return false;
  });

  const isReferenceToken = (value) => value.includes('var(--');
  const shouldHaveHSLAGenerated = (prop) =>
    (IS_COLOR_REGEX.test(prop) ||
    IS_THEME_COLOR_REGEX.test(prop)) &&
    !isHSLA &&
    !HSLA_EXCLUDED_COLORS.includes(prop);

  if (shouldHaveHSLAGenerated(declaration.prop)) {
    if (isReferenceToken(declaration.value)) {
      const varName = declaration.value.substring(4, declaration.value.length - 1);
      declaration.before({ prop: `${declaration.prop}-h`, value: `var(${varName}-h)` });
      declaration.before({ prop: `${declaration.prop}-s`, value: `var(${varName}-s)` });
      declaration.before({ prop: `${declaration.prop}-l`, value: `var(${varName}-l)` });
      declaration.before({ prop: `${declaration.prop}-a`, value: `var(${varName}-a)` });
      declaration.before({ prop: `${declaration.prop}-hsl`, value: `var(${varName}-hsl)` });
      declaration.before({ prop: `${declaration.prop}-hsla`, value: `var(${varName}-hsla)` });
    } else {
      const color = new Color(declaration.value).to('hsl');
      let [hue, saturation, lightness] = color.coords;
      const alpha = ((color.alpha?.raw || color.alpha) * 100).toFixed(0);
      hue = hue?.raw || (isNaN(hue) ? 0 : hue);
      saturation = saturation?.raw || saturation;
      lightness = lightness?.raw || lightness;

      declaration.before({ prop: `${declaration.prop}-h`, value: `${hue}` });
      declaration.before({ prop: `${declaration.prop}-s`, value: `${saturation}%` });
      declaration.before({ prop: `${declaration.prop}-l`, value: `${lightness}%` });
      declaration.before({ prop: `${declaration.prop}-a`, value: `${alpha}%` });
      declaration.before({ prop: `${declaration.prop}-hsl`, value: `var(${declaration.prop}-h) var(${declaration.prop}-s) var(${declaration.prop}-l)` });
      declaration.before({ prop: `${declaration.prop}-hsla`, value: `hsl(var(${declaration.prop}-h) var(${declaration.prop}-s) var(${declaration.prop}-l) / var(--alpha, ${alpha}%))` });
    }
  }
}

/**
 * Generates font sizes for specific platforms
 * TV, TC8 and Mobile
 * @param { Declaration } declaration
 */
function platformSpecificFontSizes (rootSelector, Declaration) {
  Object.keys(PLATFORM_FONT_SIZES).forEach(stop => {
    const fontSizeVar = `--dt-font-size-${stop}`;
    rootSelector.append(new Declaration({ prop: fontSizeVar, value: PLATFORM_FONT_SIZES[stop] }));
    newDocEntries[fontSizeVar] = {
      name: fontSizeVar.slice(2),
      value: PLATFORM_FONT_SIZES[stop],
      path: fontSizeVar.split('-').slice(3),
    };
  });
}

/**
 * Generate z-index Variables.
 * @param { Declaration } declaration
 */
function layoutVariables (rootSelector, Declaration) {
  Object.keys(Z_INDEX).forEach(name => {
    const zIndexVar = `--zi-${name}`;
    rootSelector.append(new Declaration({ prop: zIndexVar, value: Z_INDEX[name] }));
  });
}

/**
 * set color scheme based on whether the file name includes light or dark.
 * @param { string } filename the name of the file we are processing
 * @param { Rule } rootSelector the :root selector object
 * @param { Declaration } Declaration
 */
function insertColorScheme (filename, rootSelector, Declaration) {
  if (filename.includes('dark')) {
    rootSelector.prepend(new Declaration({ prop: 'color-scheme', value: 'dark' }));
  } else {
    rootSelector.prepend(new Declaration({ prop: 'color-scheme', value: 'light' }));
  }
}

/**
 *
 * @param {string} name css var name like '--dt-typography-body-md-compact'
 * @param {string} value value of the token
 * @returns object structured in the format required for documentation processing in build-docs.js
 */
function formatCompositionTokenForDocs (name, value) {
  return {
    name: name.slice(2),
    value,
    path: name.split('-').slice(3),
    isCompositionToken: true,
  };
}

/**
 * extracts the theme name from the filename of the css file we
 * are currently processing.
 * @param {*} filename the name of the file we are processing
 * @returns the theme name
 */
function getThemeFromFilename (filename) {
  const segments = filename.split('/').at(-1).split('-');
  segments.shift();
  segments[segments.length - 1] = segments.at(-1).replace('.css', '');
  return segments.join('-');
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'dialtone-tokens',
    async Once (root, { Declaration }) {
      // dynamic import because we're importing ES6 into CJS
      const { buildDocs } = await import('../build-docs.js');

      newDocEntries = {};
      const rootSelector = root.last;

      insertColorScheme(root.source.input.file, rootSelector, Declaration);

      const theme = getThemeFromFilename(root.source.input.file);
      const platformName = 'css/variables';

      platformSpecificFontSizes(rootSelector, Declaration);
      layoutVariables(rootSelector, Declaration);

      const shadows = rootSelector.nodes.filter(node => node.type === 'decl' && IS_SHADOW_REGEX.test(node.prop));
      // for some reason when outputReferences is enabled the numbered shadows output in a backwards order. This messes
      // up our algorithm to count the shadows in boxShadows() so we reverse the array to fix this.
      shadows.reverse();
      boxShadows(shadows, Declaration);
      const typographies = rootSelector.nodes.filter(node => node.type === 'decl' && IS_TYPOGRAPHY_REGEX.test(node.prop));
      typography(typographies, Declaration);

      // add the new entries to the documentation object
      buildDocs(platformName, theme, newDocEntries);
    },

    Declaration (declaration) {
      generateColorHsla(declaration);

      // A little hacky, but doesn't seem like there's a better way to do this currently.
      // wraps calculated values in calc() for css if it contains a multiplication operator.
      // This could cause issues if a value ever contains a * character that isn't for multiplication.
      // There are many discussions on this issue and it is yet unresolved:
      // https://github.com/amzn/style-dictionary/issues/820
      // https://github.com/tokens-studio/sd-transforms/issues/13
      // https://github.com/amzn/style-dictionary/issues/1055
      wrapInCalc(declaration);
    },
  };
};

module.exports.postcss = true;
