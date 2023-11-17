import { extractShadows, extractTypographies } from './helpersWrapper.mjs';

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
