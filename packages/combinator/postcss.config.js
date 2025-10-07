import postcssResponsiveVariations from '@dialpad/postcss-responsive-variations';

const classes = [
  /\.d-d-(flex)$/, // Display Flex, None and Block
];

export default {
  plugins: [
    postcssResponsiveVariations({ classes }),
  ],
};
