import baseConfig from '../../percy.base_config.cjs'

module.exports = {
  ...baseConfig,
  storybook: {
    exclude: [
      'Components/Scroller: Dynamic',
    ],
  },
};
