import postcssResponsiveVariations from '@dialpad/postcss-responsive-variations';

const breakpoints = [
  { prefix: 'sm\\:', mediaQuery: '(min-width: 480px)' },
  { prefix: 'md\\:', mediaQuery: '(min-width: 640px)' },
  { prefix: 'lg\\:', mediaQuery: '(min-width: 980px)' },
  { prefix: 'xl\\:', mediaQuery: '(min-width: 1264px)' },
];

const classes = [
  /\.d-d-(flex|none|block)$/, // Display Flex, None and Block
  '.d-t0',
  /\.d-p[t|r|l|b]([0-9]*|-unset)$/, // Padding Top and Right
  '.d-fd-column',
  '.d-ai-stretch',
  '.d-ps-relative',
  /\.d-mx([0-9]*|-(auto|unset))$/, // Margin X
  /\.d-g-cols[0-9]*$/, // Grid columns
  /\.d-(stack|flow|h|w|fs-)[0-9]*$/, // Stack, Flow, Height, Widths and Font sizes
  '.d-w100p',
  /\.d-wmx(-(auto|unset)|[0-9]*(ch|p))$/, // Max widths
];

export default {
  plugins: [
    postcssResponsiveVariations({ breakpoints, classes }),
  ],
};
