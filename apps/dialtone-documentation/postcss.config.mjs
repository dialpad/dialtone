import postcssResponsiveVariations from '@dialpad/postcss-responsive-variations';
import postcssContainerVariations from '@dialpad/postcss-container-variations';

const classes = [
  /\.d-d-(flex|none|block)$/, // Display Flex, None and Block
  /\.d-pt16$/, // Padding classes
  /\.d-g-cols[1-3]$/, // Grid columns
  /\.d-w(96|128|216|50p)$/, // Widths
  /\.d-fs-100$/, // Font sizes
];

// Classes for container query examples
const containerClasses = [
  '.d-p4', '.d-p8', '.d-p16', '.d-p24', '.d-p32',  // Padding
  '.d-mt8',                                          // Margin top
  '.d-g8', '.d-g16',                                // Gap
  '.d-w50p', '.d-w100p',                            // Width percentage
  '.d-d-flex',                                       // Display flex
  '.d-fd-column', '.d-fd-row',                      // Flex direction
  '.d-fs-200', '.d-fs-300', '.d-fs-400',           // Font sizes
];

export default {
  plugins: [
    postcssResponsiveVariations({ classes }),
    postcssContainerVariations({ classes: containerClasses }),
  ],
};
