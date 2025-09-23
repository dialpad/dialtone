import postcssResponsiveVariations from '@dialpad/postcss-responsive-variations';

const classes = [
  /\.d-d-(flex|none|block)$/, // Display Flex, None and Block
  /\.d-pt24$/, // Padding classes
  /\.d-g-cols[1-3]$/, // Grid columns
  /\.d-w(96|128|216|50p)$/, // Widths
  /\.d-fs-100$/, // Font sizes
];

export default {
  plugins: [
    postcssResponsiveVariations({ classes }),
  ],
};
