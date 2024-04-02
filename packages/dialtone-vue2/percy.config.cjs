const baseConfig = require('../../percy.base_config.cjs');

module.exports = {
  ...baseConfig,
  storybook: {
    include: [
      'Components/Avatar: Variants',
      'Components/Icon: Variants',
      'Components/Modal: Default',
    ],
    exclude: [
      ...baseConfig.storybook.exclude
      // Add specific dialtone-vue 2 stories to exclude
    ],
  },
};
