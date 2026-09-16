const {
  PLATFORM_FONT_SIZES,
  Z_INDEX,
  IS_SHADOW_REGEX,
  IS_TYPOGRAPHY_REGEX,
  IS_TEXT_REGEX,
  SHADOW_ALIASES,
  REGEX_OPTIONS,
} = require('./constants.cjs');

// Hoisted to module scope — these regexes are read-only and the plugin's
// hot path runs them per CSS file in a large per-theme loop.
const TYPOGRAPHY_SEGMENTS_REGEX = new RegExp(`--dt-typography-(${REGEX_OPTIONS.TYPOGRAPHY_TYPE})-?(${REGEX_OPTIONS.TYPOGRAPHY_SIZES})?-?(${REGEX_OPTIONS.TYPOGRAPHY_VARIABLES})?-?(${REGEX_OPTIONS.TYPOGRAPHY_VARIABLES})?-?(.+)`);
const TEXT_SEGMENTS_REGEX = new RegExp(`--dt-text-(${REGEX_OPTIONS.TEXT_TYPE})-(${REGEX_OPTIONS.TEXT_SIZES})-(.+)`);
const SHADOW_SEGMENTS_REGEX = new RegExp(`--dt-shadow-(${REGEX_OPTIONS.SHADOW_VARIABLES})-?([0-9])?-(\\w+)`);

let newDocEntries = {};

/**
 * Compose typography tokens
 * @param { Declaration } declaration
 */
function typography (typographyDeclarations, Declaration) {
  const typographyMap = typographyDeclarations.map(m => m.prop).filter(prop => !prop.endsWith('-font-family'))
    .reduce((typographies, typography) => {
      const matches = typography
        .split(TYPOGRAPHY_SEGMENTS_REGEX)
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
 * Compose text tokens
 * @param { Declaration } declaration
 */
function text (textDeclarations, Declaration) {
  const textMap = textDeclarations.map(m => m.prop).filter(prop => !prop.endsWith('-font-family'))
    .reduce((texts, text) => {
      const matches = text
        .split(TEXT_SEGMENTS_REGEX)
        .filter(chunk => !!chunk);

      matches.pop();

      texts.add(matches.join('-'));

      return texts;
    }, new Set());

  textMap
    .forEach(textName => {
      const composedVar = `--dt-text-${textName}`;
      const value = `var(${composedVar}-font-weight) var(${composedVar}-font-size)/var(${composedVar}-line-height) var(${composedVar}-font-family)`;
      textDeclarations.at(-1).after(new Declaration({ prop: composedVar, value }));
      newDocEntries[composedVar] = formatCompositionTokenForDocs(composedVar, value);
    });
}

/**
 * Compose box shadow tokens
 * @param { shadowDeclarations } array declarations related to shadow
 * @param { Declaration } declaration
 */
function boxShadows (shadowDeclarations, Declaration) {
  const shadowMap = shadowDeclarations.map(m => m.prop)
    .reduce((shadows, shadow) => {
      const [name, index] = shadow
        .split(SHADOW_SEGMENTS_REGEX).slice(1, -1);
      // Track the maximum layer index for multi-layer shadows
      const layerIndex = Number.isNaN(Number.parseInt(index)) ? 1 : Number.parseInt(index);
      shadows[name] = Math.max(shadows[name] || 0, layerIndex);
      return shadows;
    }, {});

  Object
    .keys(shadowMap)
    .forEach(shadowName => {
      const shadowVar = `--dt-shadow-${shadowName}`;
      // in css inset shadows are defined by adding the inset keyword
      const isInset = shadowName.includes('inset');
      const times = shadowMap[shadowName];
      const alias = SHADOW_ALIASES[shadowName];
      const value = alias
        ? `var(--dt-shadow-${alias})`
        : Array(times)
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
    // Simplify "var(--dt-font-size-root) * 1" to just the variable reference
    if (declaration.value === 'var(--dt-font-size-root) * 1') {
      declaration.value = 'var(--dt-font-size-root)';
      return;
    }
    declaration.value = `calc(${declaration.value})`;
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
module.exports = () => {
  return {
    postcssPlugin: 'dialtone-tokens',
    async Once (root, { Declaration, AtRule }) {
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
      const texts = rootSelector.nodes.filter(node => node.type === 'decl' && IS_TEXT_REGEX.test(node.prop));
      text(texts, Declaration);

      // add the new entries to the documentation object
      buildDocs(platformName, theme, newDocEntries);

      // Wrap all token CSS output in @layer dialtone.base
      const layerRule = new AtRule({ name: 'layer', params: 'dialtone.base' });
      const nodes = [];
      root.each(node => nodes.push(node));
      nodes.forEach(node => layerRule.append(node));
      root.append(layerRule);
    },

    Declaration (declaration) {
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
