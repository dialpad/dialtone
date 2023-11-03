/**
* TECH DEBT: this file is a not exact duplication of postcss/dialtone-generators.js and postcss/helpers.js
* There's a ticket to adress this: https://dialpad.atlassian.net/browse/DLT-1288
*/
import { SHADOW_VARIABLES, TYPOGRAPHY_VARIABLES, TYPOGRAPHY_SIZES } from './constants';
import dialtoneTokensLight from '@dialpad/dialtone-tokens/dist/tokens-light.json';
import dialtoneTokensDark from '@dialpad/dialtone-tokens/dist/tokens-dark.json';

const pascalToKebabCase = (string) => {
  return string.split(/(?=[A-Z]|[0-9]{3,}?)/).join('-').toLowerCase();
};

/**
* Extract the box shadow tokens from dialtone-tokens
* based on SHADOW_VARIABLES.
* Performs the name parsing e.g. FocusInset -> focus-inset and
* returns an array containing the shadowName as key and
* the max token index + 1 as value
*
* @returns {Object}
*/
const extractShadows = (mode) => {
  const tokens = mode === 'light' ? dialtoneTokensLight : dialtoneTokensDark;
  const shadowsRegex = new RegExp(`dtShadow(${SHADOW_VARIABLES})([0-9])(\\w+)`);
  return Object.keys(tokens)
    .filter(key => shadowsRegex.test(key))
    .reduce((shadows, shadow) => {
      const [name, index] = shadow
        .split(shadowsRegex)
        .filter(chunk => !!chunk);

      const shadowName = pascalToKebabCase(name);

      shadows[shadowName] = Number.parseInt(index) + 1;
      return shadows;
    }, {});
};

/**
* Extract the typography tokens from dialtone-tokens.
* Performs the name parsing e.g. BodySmall -> body-small and
* returns a set containing typographyNames
*
* @returns {Set}
*/
const extractTypographies = () => {
  // eslint-disable-next-line max-len
  const typographiesRegex = new RegExp(`dtTypography(${TYPOGRAPHY_VARIABLES})(${TYPOGRAPHY_SIZES})(\\w+)`);
  return Object.keys(dialtoneTokensLight)
    .filter(key => typographiesRegex.test(key))
    .reduce((typographies, typography) => {
      const [name, size] = typography
        .split(typographiesRegex)
        .filter(chunk => !!chunk);

      const typographyName = pascalToKebabCase(name);
      const typographySize = pascalToKebabCase(size);

      typographies.add(`${typographyName}-${typographySize}`);

      return typographies;
    }, new Set());
};

/**
 * Compose typography tokens
 */
export function getComposedTypographyTokens () {
  const tokens = [];
  const dialtoneTypographies = extractTypographies();
  dialtoneTypographies
    .forEach(typographyName => {
      const composedVar = `--dt-typography-${typographyName}`;
      // eslint-disable-next-line max-len
      const tokenValue = `var(${composedVar}-font-weight) var(${composedVar}-font-size)/var(${composedVar}-line-height) var(${composedVar}-font-family)`;
      tokens.push({ exampleValue: tokenValue, name: `var(${composedVar})`, tokenValue });
    });
  return tokens;
}

/**
 * Compose box shadow tokens
 * @param { string } [theme=light]
 */
export function getComposedShadowTokens (theme) {
  const tokens = [];
  const dialtoneShadows = extractShadows(theme);
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

      tokens.push({ exampleValue: tokenValue, name: `var(${shadowVar})`, tokenValue });
    });
  return tokens;
}
