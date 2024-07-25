import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { CATEGORY_MAP, SUBCATEGORY_MAP, FORMAT_MAP, THEMES, BRANDS, getTokensStructure } from './constants';

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
      const baseThemeKey = `base-${theme.value}`;

      for (const brand of BRANDS) {
        const brandThemeKey = `${brand.value}-${theme.value}`;
        structure[format][brandThemeKey] = getTokensStructure();

        // merge base and semantic tokens into one object per theme
        Object.entries(tokensJson[baseThemeKey]).forEach((token) => {
          addTokensToCategories(token, format, structure[format][brandThemeKey]);
        });
        Object.entries(tokensJson[brandThemeKey]).forEach((token) => {
          addTokensToCategories(token, format, structure[format][brandThemeKey]);
        });
      }
    }
  });
};

/**
 * split a composition token into an array based on a slash or a css var() function
 */
const splitCompositionTokenIntoArray = (value) => {
  const regex = /var\([^)]+\)|\//g;
  const matches = value.match(regex);
  if (matches) {
    return matches;
  }
  return value;
};

// eslint-disable-next-line complexity
const addTokensToCategories = (token, format, structure) => {
  const [key, value] = token;
  if (!value[FORMAT_MAP[format]] || !value[FORMAT_MAP.CSS] || isBaseToken(key)) return;

  const { name, value: tokenValue, description, keywords, isCompositionToken } = value[FORMAT_MAP[format]];
  const { value: exampleValue, name: exampleName } = value[FORMAT_MAP.CSS];
  const displayToken = { exampleValue, exampleName, name, tokenValue, description, keywords };

  if (isCompositionToken) {
    displayToken.tokenValue = splitCompositionTokenIntoArray(tokenValue);
  }

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
    structure.typography['font style']._children.push({ ...displayToken, hidden: !isCompositionToken });
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
    structure.shadow._children.push({ ...displayToken, hidden: !isCompositionToken });
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
