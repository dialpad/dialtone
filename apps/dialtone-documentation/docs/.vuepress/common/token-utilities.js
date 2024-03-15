import Helpers from '@dialpad/dialtone-css/postcss/helpers.cjs';

/**
 * Compose typography tokens
 */
export function getComposedTypographyTokens () {
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
export function getComposedShadowTokens (theme) {
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
