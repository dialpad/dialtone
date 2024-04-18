import Helpers from '@dialpad/dialtone-css/postcss/helpers.cjs';
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { CATEGORY_MAP, SUBCATEGORY_MAP, FORMAT_MAP, THEMES, getTokensStructure } from './constants';

/**
 * Compose typography tokens
 */
function getComposedTypographyTokens () {
  const tokens = [];
  const dialtoneTypographies = Helpers.extractTypographies();
  dialtoneTypographies
    .forEach(typographyName => {
      const composedVar = `--dt-typography-${typographyName}`;
      const weight = `var(${composedVar}-font-weight)`;
      const sizeLineHeight = `var(${composedVar}-font-size) / var(${composedVar}-line-height)`;
      const fontFamily = `var(${composedVar}-font-family)`;
      tokens.push({
        exampleValue: `${weight} ${sizeLineHeight} ${fontFamily}`,
        name: `var(${composedVar})`,
        tokenValue: [weight, sizeLineHeight, fontFamily],
      });
    });
  return tokens;
}

/**
 * Compose box shadow tokens
 * @param { string } [theme=light]
 */
function getComposedShadowTokens (theme) {
  const tokens = [];
  const dialtoneShadows = Helpers.extractShadows(theme);
  Object
    .keys(dialtoneShadows)
    .forEach(shadowName => {
      const shadowVar = `--dt-shadow-${shadowName}`;
      const times = dialtoneShadows[shadowName];
      const tokenValue = Array(times)
        .fill(undefined)
        .map((val, i) => {
          const shadowNumber = i + 1;
          // eslint-disable-next-line max-len
          return `var(${shadowVar}-${shadowNumber}-x) var(${shadowVar}-${shadowNumber}-y) var(${shadowVar}-${shadowNumber}-blur) var(${shadowVar}-${shadowNumber}-spread) var(${shadowVar}-${shadowNumber}-color)`;
        }).join(', ');

      tokens.push({ exampleValue: tokenValue, name: `var(${shadowVar})`, tokenValue: tokenValue.split(' ') });
    });
  return tokens;
}

/**
* Tokens that are a combination of other tokens.
* Only apply for the categories typography and shadow, and only in CSS format.
* @param { object } structure Structure where to add the tokens
*/
export const addComposedTokens = (structure) => {
  const composedTypographyTokens = getComposedTypographyTokens();
  THEMES.forEach((themeObj) => {
    const theme = themeObj.value;
    if (!structure.CSS || !structure.CSS[theme]) return;

    const composedShadowTokens = getComposedShadowTokens(theme);

    if (structure.CSS[theme].typography['font style']) {
      structure.CSS[theme].typography['font style']._children = [
        ...composedTypographyTokens,
        ...structure.CSS[theme].typography['font style']._children,
      ];
    }

    if (structure.CSS[theme].shadow) {
      structure.CSS[theme].shadow._children = [
        ...composedShadowTokens,
        ...structure.CSS[theme].shadow._children,
      ];
    }
  });
};

/**
  Process the file tokensJson and fill processedTokens with the data we want to show.
  This data contains the tokens names, values, description, exampleValue,
  exampleName for the tokens in every format, theme and category, respecting the
  structure defined in constants/getTokensStructure
* @param { object } structure Structure where to add the tokens
*/
export const addTokensToStructure = (structure) => {
  Object.keys(FORMAT_MAP).forEach(format => {
    structure[format] = {};
    for (const theme of THEMES) {
      structure[format][theme.value] = getTokensStructure();
      Object.entries(tokensJson[theme.value]).forEach((token) => {
        addTokensToCategories(token, format, structure[format][theme.value]);
      });
    }
  });
};

// eslint-disable-next-line complexity
const addTokensToCategories = (token, format, structure) => {
  const [key, value] = token;
  if (!value[FORMAT_MAP[format]] || !value[FORMAT_MAP.CSS] || isBaseToken(key)) return;

  const { name, value: tokenValue, description, keywords } = value[FORMAT_MAP[format]];
  const { value: exampleValue, name: exampleName } = value[FORMAT_MAP.CSS];
  const displayToken = { exampleValue, exampleName, name, tokenValue, description, keywords };

  const splitKeys = key.split('/');

  // COLOR
  if (key.startsWith('color') && SUBCATEGORY_MAP.color.includes(splitKeys[1])) {
    addTokenToSubcategory(displayToken, 'color', SUBCATEGORY_MAP.color.find(sub => sub === splitKeys[1]), structure);
    return;
  }

  if (key.startsWith('color/brand') || key.startsWith('color/gradient')) {
    structure.color.brand._children.push(displayToken);
    return;
  }

  if (key.startsWith('opacity')) {
    structure.color.opacity._children.push(displayToken);
    return;
  }

  if ((CATEGORY_MAP.component.includes(splitKeys[0]) && (splitKeys[1] === 'color')) ||
    (CATEGORY_MAP.component.includes(splitKeys[1]) && splitKeys[0] === 'theme')) {
    structure.color.components._children.push(displayToken);
    return;
  }

  if (key.startsWith('color')) {
    structure.color.base._children.push(displayToken);
    return;
  }

  // TYPOGRAPHY
  if (key.startsWith('typography')) {
    structure.typography['font style']._children.push({ ...displayToken, hidden: true });
    return;
  }

  if (key.startsWith('font') && SUBCATEGORY_MAP.font.includes(splitKeys[1])) {
    const displaySubcategory = `font ${SUBCATEGORY_MAP.font.find(sub => sub === splitKeys[1])}`;
    addTokenToSubcategory(displayToken, 'typography', displaySubcategory, structure);
    return;
  }

  if (key.startsWith('font/text-case')) {
    structure.typography.textcase._children.push(displayToken);
    return;
  }

  if (key.startsWith('font/lineHeight')) {
    structure.typography['line height']._children.push(displayToken);
    return;
  }

  if (CATEGORY_MAP.component.includes(splitKeys[0]) &&
    (splitKeys[1] === 'font' || splitKeys[1] === 'lineHeight')) {
    structure.typography.components._children.push(displayToken);
    return;
  }

  // SHADOW
  if (key.startsWith('shadow')) {
    structure.shadow._children.push({ ...displayToken, hidden: true });
    return;
  }

  // SIZE
  if (key.startsWith('size') && key.endsWith('negative')) {
    structure.size.negative._children.push(displayToken);
    return;
  }

  if (key.startsWith('size') && key.endsWith('percent')) {
    structure.size.percentage._children.push(displayToken);
    return;
  }

  if (key.startsWith('size') && SUBCATEGORY_MAP.size.includes(splitKeys[1])) {
    addTokenToSubcategory(displayToken, 'size', SUBCATEGORY_MAP.size.find(sub => sub === splitKeys[1]), structure);
    return;
  }

  if (key.startsWith('size/radius')) {
    structure.size.radius._children.push(displayToken);
    return;
  }

  if (key.startsWith('size/border')) {
    structure.size.border._children.push(displayToken);
    return;
  }

  if (key.startsWith('size')) {
    structure.size.base._children.push(displayToken);
    return;
  }

  if (CATEGORY_MAP.component.includes(splitKeys[0]) && splitKeys[1] === 'size') {
    if (splitKeys[2] === 'border') {
      structure.size.components._children.push({ ...displayToken, hidden: true });
    } else {
      structure.size.components._children.push(displayToken);
    }
    return;
  }

  // SPACE
  if (key.startsWith('space') && key.endsWith('negative')) {
    structure.space.negative._children.push(displayToken);
    return;
  }

  if (key.startsWith('space') && key.endsWith('percent')) {
    structure.space.percentage._children.push(displayToken);
    return;
  }

  if (key.startsWith('space')) {
    structure.space.base._children.push(displayToken);
  }
};

const addTokenToSubcategory = (token, category, subcategory, structure) => {
  structure[category][subcategory]._children.push(token);
};

const isBaseToken = (name) => name.endsWith('base') || name.endsWith('root');
